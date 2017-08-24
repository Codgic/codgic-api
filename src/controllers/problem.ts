/* /src/controllers/problem.ts */

import { Context } from 'koa';

import { config } from './../init/config';
import { ProblemPrivilege, UserPrivilege } from './../init/privilege';
import * as Problem from './../models/problem';

export async function getProblemInfo(ctx: Context, next: () => Promise<any>) {

  // Validate request.
  if (isNaN(ctx.params.problemid)) {
    ctx.throw(400);
  }

  // Retrieve problem info.
  const problemInfo: any = await Problem.getProblemInfo(ctx.params.problemid);

  // Verify privilege.
  const hasPrivilege = await Problem
                            .verifyProblemPrivilege(
                              ProblemPrivilege.read,
                              ctx.state.user.id,
                              ctx.state.user.privilege, {
                                owner: problemInfo.owner,
                                group: problemInfo.group,
                                ownerPrivilege: problemInfo.ownerPrivilege,
                                groupPrivilege: problemInfo.groupPrivilege,
                                othersPrivilege: problemInfo.othersPrivilege,
                              },
                            );

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

  ctx.body = await Problem.getProblemList(ctx.query.sort, ctx.query.order, ctx.query.page, ctx.query.num);

  ctx.status = 200;

  await next();

}

export async function searchProblem(ctx: Context, next: () => Promise<any>) {

  ctx.body = await Problem
                  .searchProblem(
                    ctx.query.sort,
                    ctx.query.order,
                    ctx.query.keyword,
                    ctx.query.page,
                    ctx.query.num,
                  );
  ctx.status = 200;

  await next();

}

export async function postProblem(ctx: Context, next: () => Promise<any>) {

  // Check login.
  if (!ctx.state.user) {
    ctx.throw(401);
  }

  // Get maximum problem id.
  const maxProblemId: any = await Problem.getMaxProblemId();

  // Generate next id (default: 1000).
  let nextProblemId: number = 1000;

  if (maxProblemId) {
    nextProblemId = maxProblemId + 1;
  }

  // Post problem.
  ctx.body = await routePost(ctx);

  ctx.status = 201;

  await next();
}

export async function updateProblem(ctx: Context, next: () => Promise<any>) {

  // Check login.
  if (!ctx.state.user) {
    ctx.throw(401);
  }

  // Retrieve problem info.
  const problemInfo: any = await Problem.getProblemInfo(ctx.params.problemid);

  // Verify privilege.
  const hasPrivilege = await Problem
                            .verifyProblemPrivilege(
                              ProblemPrivilege.write,
                              ctx.state.user.id,
                              ctx.state.user.privilege, {
                                owner: problemInfo.owner,
                                group: problemInfo.group,
                                ownerPrivilege: problemInfo.ownerPrivilege,
                                groupPrivilege: problemInfo.groupPrivilege,
                                othersPrivilege: problemInfo.othersPrivilege,
                              },
                            );

  if (!hasPrivilege) {
      ctx.throw(401);
  }

  // Post problem.
  ctx.body = await routePost(ctx);

  ctx.status = 201;

  await next();
}

function routePost(ctx: Context) {

    let result: any;

    if (ctx.state.user.privilege & UserPrivilege.editContent) {
      result = Problem.postProblem(ctx.params.problemid, ctx.request.body, ctx.state.user.id);
    } else {
      if (config.oj.policy.content.common_user_can_post) {
        if (config.oj.policy.content.common_user_need_confirmation) {
          result = Problem.postProblemTemp(ctx.params.problemid, ctx.request.body, ctx.state.user.id);
        } else {
          result = Problem.postProblem(ctx.params.problemid, ctx.request.body, ctx.state.user.id);
        }
      } else {
        ctx.throw(403);
      }
    }

    return result;

}
