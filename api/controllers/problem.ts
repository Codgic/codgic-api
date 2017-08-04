/* /api/controllers/problem.ts */

import * as Koa from 'koa';
import * as Problem from './../models/problem';

import { ProblemPrivilege, UserPrivilege } from './../init/privilege';

import { getConfig } from './../init/config';

const config = getConfig();

export async function getProblemList(ctx: Koa.Context, next: () => Promise<any>) {
  ctx.body = await Problem.getProblemList(ctx.query.sort, ctx.query.order, ctx.query.page, ctx.query.num);
  if (ctx.body.error) {
    ctx.throw(404, {
      error: ctx.body.error,
    });
  } else {
    ctx.status = 200;
  }
  await next();
}

export async function getProblemInfo(ctx: Koa.Context, next: () => Promise<any>) {

  // Retrieve problem info.
  const problemInfo: any = Problem.getProblemInfo(ctx.params.problemid);

  if (problemInfo.error) {
    ctx.throw(404, {
      error: problemInfo.error,
    });
  }

  // Verify privilege.
  if (!Problem.verifyProblemPrivilege(ProblemPrivilege.read, ctx.state.user.id, ctx.state.user.privilege, {
    owner: problemInfo.owner,
    group: problemInfo.group,
    ownerPrivilege: problemInfo.ownerPrivilege,
    groupPrivilege: problemInfo.groupPrivilege,
    othersPrivilege: problemInfo.othersPrivilege,
  })) {
    ctx.throw(401);
  }

  ctx.body = problemInfo;

  // Handle errors.
  if (ctx.body.error) {
    ctx.throw(404, {
      error: ctx.body.error,
    });
  }

  ctx.status = 200;

  await next();

}

export async function searchProblem(ctx: Koa.Context, next: () => Promise<any>) {

  ctx.body = await Problem.searchProblem(
    ctx.query.sort,
    ctx.query.order,
    ctx.query.keyword,
    ctx.query.page,
    ctx.query.num,
  );
  if (ctx.body.error) {
    ctx.throw(404, {
      error: ctx.body.error,
    });
  }

  ctx.status = 200;

  await next();

}

export async function postProblem(ctx: Koa.Context, next: () => Promise<any>) {

  // Verify login.
  if (!ctx.state.user) {
    ctx.throw(401);
  }

  if (ctx.state.user.privilege & UserPrivilege.content) {
    ctx.body = await Problem.postProblemAdmin(ctx.request.body, ctx.state.user.id);
  } else {
    if (config.oj.policy.content.common_user_can_post) {
      if (config.oj.policy.content.common_user_need_confirmation) {
        ctx.body = await Problem.postProblemCommon(ctx.request.body, ctx.state.user.id);
      } else {
        ctx.body = await Problem.postProblemAdmin(ctx.request.body, ctx.state.user.id);
      }
    } else {
      ctx.throw(403);
    }
  }

  if (ctx.body.error) {
    ctx.throw(400, {
      error: ctx.body.error,
    });
  } else {
    ctx.status = 201;
  }
  await next();
}

export async function updateProblem(ctx: Koa.Context, next: () => Promise<any>) {

  // Retrieve problem info.
  const problemInfo: any = Problem.getProblemInfo(ctx.params.problemid);

  if (problemInfo.error) {
    ctx.throw(404, {
      error: problemInfo.error,
    });
  }

  // Verify privilege.
  if (!Problem.verifyProblemPrivilege(ProblemPrivilege.read, ctx.state.user.id, ctx.state.user.privilege, {
    owner: problemInfo.owner,
    group: problemInfo.group,
    ownerPrivilege: problemInfo.ownerPrivilege,
    groupPrivilege: problemInfo.groupPrivilege,
    othersPrivilege: problemInfo.othersPrivilege,
  })) {
    ctx.throw(401);
  }

  // To be rewritten.
  if (ctx.state.user.privilege & UserPrivilege.content) {
    ctx.body = await Problem.updateProblemAdmin(ctx.params.problemid, ctx.request.body, ctx.state.user.id);
  } else {
    ctx.body = await Problem.updateProblemCommon(ctx.params.problemid, ctx.request.body, ctx.state.user.id);
  }

  if (ctx.body.error) {
    ctx.throw(400, {
      error: ctx.body.error,
    });
  } else {
    ctx.status = 201;
  }
  await next();
}
