/* /src/controllers/problem.ts */

import * as createError from 'http-errors';
import { Context } from 'koa';

import { config } from './../init/config';
import { checkContentPrivilege, checkPrivilege, ProblemPrivilege, UserPrivilege } from './../init/privilege';
import * as ProblemModel from './../models/problem';

export async function getProblemInfo(ctx: Context, next: () => Promise<any>) {

  // Validate request.
  if (isNaN(ctx.params.problemId)) {
    throw createError(400);
  }

  // Retrieve problem info.
  const problemInfo = await ProblemModel.getProblemInfo(ctx.params.problemId);

  if (!problemInfo) {
    throw createError(404, 'Problem not found.');
  }

  // Check privilege.
  const hasPrivilege = checkPrivilege(UserPrivilege.viewHidden, ctx.state.user.privilege) ? true :
    await checkContentPrivilege(ProblemPrivilege.read, ctx.state.user.id, {
      owner: problemInfo.owner.id,
      group: problemInfo.group.id,
      ownerPrivilege: problemInfo.ownerPrivilege,
      groupPrivilege: problemInfo.groupPrivilege,
      worldPrivilege: problemInfo.worldPrivilege,
    });

  if (!hasPrivilege) {
    if (ctx.state.user) {
      ctx.throw(403);
    } else {
      ctx.throw(401);
    }
  }

  ctx.body = problemInfo;
  ctx.status = 200;

  await next();

}

export async function getProblemList(ctx: Context, next: () => Promise<any>) {

  if (!ctx.state.user) {
    ctx.state.user = {
      id: undefined,
    };
  }

  const problemList = await ProblemModel.getProblemListWithFilter(
    ctx.state.user.id,
    ctx.query.sort,
    ctx.query.direction,
    ctx.query.page,
    ctx.query.per_page,
  );

  ctx.body = problemList;
  ctx.status = 200;

  await next();

}

export async function searchProblem(ctx: Context, next: () => Promise<any>) {

  if (!ctx.state.user) {
    ctx.state.user = {
      id: undefined,
    };
  }

  const searchResult = await ProblemModel
    .searchProblemWithFilter(
      ctx.state.user.id,
      ctx.query.sort,
      ctx.query.direction,
      ctx.query.q,
      ctx.query.page,
      ctx.query.per_page,
    );

  ctx.body = searchResult;
  ctx.status = 200;

  await next();

}

export async function postProblem(ctx: Context, next: () => Promise<any>) {

  // Check login.
  if (!ctx.state.user) {
    ctx.throw(401);
  }

  if (ctx.request.body.problemId) {

    // UserPrivilege.editContent is needed to customize problemId.
    if (!checkPrivilege(UserPrivilege.editContent, ctx.state.user.privilege)) {
      throw createError(403);
    }

    // Check if the problem id is already taken.
    if (await ProblemModel.getProblemInfo(ctx.request.body.problemId)) {
      throw createError('Problem id has been taken.');
    }

  } else {

    // Generate problem id (default: 1000).
    ctx.request.body.problemId = config.oj.default.problem.first_problem_id || 1000;

    const maxProblemId: number | null = await ProblemModel.getMaxProblemId();
    if (maxProblemId) {
      ctx.request.body.problemId = maxProblemId + 1;
    }
  }

  // Post problem.
  ctx.body = await routePostProblem(ctx);

  ctx.status = 201;

  await next();
}

export async function updateProblem(ctx: Context, next: () => Promise<any>) {

  // Check login.
  if (!ctx.state.user) {
    ctx.throw(401);
  }

  // Validate request.
  if (isNaN(ctx.params.problemId)) {
    ctx.throw(400);
  }

  // Retrieve problem info.
  const problemInfo = await ProblemModel.getProblemInfo(ctx.params.problemId);

  if (!problemInfo) {
    throw createError(400, 'Problem does not exist.');
  }

  // Check privilege.
  const hasPrivilege = checkPrivilege(UserPrivilege.editContent, ctx.state.user.privilege) ? true :
    await checkContentPrivilege(ProblemPrivilege.write, ctx.state.user.privilege, {
      owner: problemInfo.owner.id,
      group: problemInfo.group.id,
      ownerPrivilege: problemInfo.ownerPrivilege,
      groupPrivilege: problemInfo.groupPrivilege,
      worldPrivilege: problemInfo.worldPrivilege,
    });

  if (!hasPrivilege) {
      ctx.throw(401);
  }

  // Post problem.
  ctx.body = await routePostProblem(ctx);

  ctx.status = 201;

  await next();
}

async function routePostProblem(ctx: Context) {

    let result;

    if (checkPrivilege(UserPrivilege.editContent, ctx.state.user.privilege)) {
      result = await ProblemModel.postProblem(ctx.request.body, ctx.state.user.id);
    } else {
      if (config.oj.policy.content.common_user_can_post) {
        if (config.oj.policy.content.common_user_post_need_confirmation) {
          result = await ProblemModel.postProblemTemp(ctx.request.body, ctx.state.user.id);
        } else {
          result = await ProblemModel.postProblem(ctx.request.body, ctx.state.user.id);
        }
      } else {
        ctx.throw(403);
      }
    }

    return result;

}
