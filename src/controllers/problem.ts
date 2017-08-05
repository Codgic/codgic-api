/* /api/controllers/problem.ts */

import * as Koa from 'koa';
import * as Problem from './../models/problem';

import { ProblemPrivilege, UserPrivilege } from './../init/privilege';

import { getConfig } from './../init/config';
import { getMaxProblemId } from './../models/problem';

const config = getConfig();

export async function getProblemList(ctx: Koa.Context, next: () => Promise<any>) {

  ctx.body = await Problem
                  .getProblemList(ctx.query.sort, ctx.query.order, ctx.query.page, ctx.query.num)
                  .catch((err) => {
                    ctx.throw(404, err);
                  });

  ctx.status = 200;

  await next();

}

export async function getProblemInfo(ctx: Koa.Context, next: () => Promise<any>) {

  // Retrieve problem info.
  const problemInfo: any = await Problem
                                .getProblemInfo(ctx.params.problemid)
                                .catch((err) => {
                                  ctx.throw(404, err);
                                });

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
                            )
                            .catch((err) => {
                              ctx.throw(500);
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

export async function searchProblem(ctx: Koa.Context, next: () => Promise<any>) {

  ctx.body = await Problem
                  .searchProblem(
                    ctx.query.sort,
                    ctx.query.order,
                    ctx.query.keyword,
                    ctx.query.page,
                    ctx.query.num,
                  )
                  .catch((err) => {
                    ctx.throw(404, err);
                  });

  ctx.status = 200;

  await next();

}

export async function postProblem(ctx: Koa.Context, next: () => Promise<any>) {

  // Verify login.
  if (!ctx.state.user) {
    ctx.throw(401);
  }

  // Get maximum problem id.
  const maxProblemId: any = await Problem
                                .getMaxProblemId()
                                .catch((err) => {
                                  ctx.throw(500, err);
                                });

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

export async function updateProblem(ctx: Koa.Context, next: () => Promise<any>) {

  // Retrieve problem info.
  const problemInfo: any = await Problem
                                .getProblemInfo(ctx.params.problemid)
                                .catch((err) => {
                                  ctx.throw(404, err);
                                });

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
                            )
                            .catch((err) => {
                              ctx.throw(500);
                            });

  if (!hasPrivilege) {
      ctx.throw(401);
  }

  // Post problem.
  ctx.body = await routePost(ctx);

  ctx.status = 201;

  await next();
}

async function routePost(ctx: Koa.Context) {
    let result: any;

    if (ctx.state.user.privilege & UserPrivilege.editContent) {
      result = await Problem
                    .postProblem(ctx.params.problemid, ctx.request.body, ctx.state.user.id)
                    .catch((err) => {
                      ctx.throw(500, err);
                    });
    } else {
      if (config.oj.policy.content.common_user_can_post) {
        if (config.oj.policy.content.common_user_need_confirmation) {
          result = await Problem
                        .postProblemTemp(ctx.params.problemid, ctx.request.body, ctx.state.user.id)
                        .catch((err) => {
                          ctx.throw(500, err);
                        });
        } else {
          result = await Problem
                        .postProblem(ctx.params.problemid, ctx.request.body, ctx.state.user.id)
                        .catch((err) => {
                          ctx.throw(500, err);
                        });
        }
      } else {
        ctx.throw(403);
      }
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(result);
      });
    });
}
