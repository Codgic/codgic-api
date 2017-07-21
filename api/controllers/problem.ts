/* /api/controllers/problem.ts */

import * as Koa from 'koa';
import * as Problem from './../models/problem';

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
  ctx.body = await Problem.getProblemInfo(ctx.params.problemid);
  if (ctx.body.error) {
    ctx.throw(404, {
      error: ctx.body.error,
    });
  } else {
    ctx.status = 200;
  }
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
  } else {
    ctx.status = 200;
  }
  await next();
}

export async function postProblem(ctx: Koa.Context, next: () => Promise<any>) {
  // Verify login.
  if (!ctx.state.user) {
    ctx.throw(401);
  }

  ctx.body = await Problem.postProblemAdmin(ctx.request.body, ctx.state.user.id);
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
  ctx.body = await Problem.updateProblemAdmin(ctx.params.problemid, ctx.request.body, ctx.state.user.id);
  if (ctx.body.error) {
    ctx.throw(400, {
      error: ctx.body.error,
    });
  } else {
    ctx.status = 201;
  }
  await next();
}
