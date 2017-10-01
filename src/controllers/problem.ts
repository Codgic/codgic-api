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
  const problemInfo = await ProblemModel.getProblemInfo(parseInt(ctx.params.problemId, 10), 'problemId');

  if (!problemInfo) {
    throw createError(404, 'Problem not found.');
  }

  const userPrivilege = ctx.state.user ? ctx.state.user.privilege : UserPrivilege.isEnabled;

  // Check privilege.
  const hasPrivilege = await checkPrivilege(UserPrivilege.readEverything, userPrivilege) ? true :
    await checkContentPrivilege(ProblemPrivilege.read, ctx.state.user, {
      owner: problemInfo.owner,
      group: problemInfo.group,
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

  const problemList = await ProblemModel.getProblemListWithFilter(
    ctx.state.user,
    ctx.query.sort,
    ctx.query.direction,
    parseInt(ctx.query.page, 10),
    parseInt(ctx.query.per_page, 10),
  );

  ctx.body = problemList;
  ctx.status = 200;

  await next();

}

export async function searchProblem(ctx: Context, next: () => Promise<any>) {

  const searchResult = await ProblemModel
    .searchProblemWithFilter(
      ctx.state.user,
      ctx.query.sort,
      ctx.query.direction,
      ctx.query.q,
      parseInt(ctx.query.page, 10),
      parseInt(ctx.query.per_page, 10),
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

    if (isNaN(ctx.request.body.problemId)) {
      throw createError(400);
    }

    ctx.request.body.problemId = parseInt(ctx.request.body.problemId, 10);

    // UserPrivilege.editContent is needed to customize problemId.
    if (!await checkPrivilege(UserPrivilege.editContent, ctx.state.user.privilege)) {
      throw createError(403);
    }

    // Check if the problem id is already taken.
    if (await ProblemModel.getProblemInfo(ctx.request.body.problemId, 'problemId')) {
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
  const problemInfo = await ProblemModel.getProblemInfo(parseInt(ctx.params.problemId, 10), 'problemId');

  if (!problemInfo) {
    throw createError(400, 'Problem does not exist.');
  }

  // Check privilege.
  const hasPrivilege = await checkPrivilege(UserPrivilege.editContent, ctx.state.user.privilege) ? true :
    await checkContentPrivilege(ProblemPrivilege.write, ctx.state.user, {
      owner: problemInfo.owner,
      group: problemInfo.group,
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

    if (await checkPrivilege(UserPrivilege.editContent, ctx.state.user.privilege)) {
      result = await ProblemModel.postProblem(ctx.request.body, ctx.state.user);
    } else {
      if (config.oj.policy.content.common_user_can_post) {
        if (config.oj.policy.content.common_user_post_need_confirmation) {
          result = await ProblemModel.postProblemTemp(ctx.request.body, ctx.state.user);
        } else {
          result = await ProblemModel.postProblem(ctx.request.body, ctx.state.user);
        }
      } else {
        ctx.throw(403);
      }
    }

    return result;

}
