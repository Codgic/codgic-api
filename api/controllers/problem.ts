/* /api/controllers/user.ts
   We love our users! */

import * as Koa from 'koa';
import * as Problem from './../models/problem';

export async function getProblemList(ctx: Koa.Context, next: () => Promise<any>) {
  ctx.body = await Problem.getProblemList(ctx.query.page, ctx.query.num);
  await next();
}

export async function getProblemInfo(ctx: Koa.Context, next: () => Promise<any>) {
  ctx.body = await Problem.getProblemInfo(ctx.params.problemid);
  await next();
}

export async function searchProblem(ctx: Koa.Context, next: () => Promise<any>) {
  ctx.body = await Problem.searchProblem(ctx.params.keyword, ctx.query.page, ctx.query.num);
  await next();
}

export async function postProblem(ctx: Koa.Context, next: () => Promise<any>) {
  ctx.body = await Problem.postProblem(ctx.body);
  await next();
}

export async function updateProblem(ctx: Koa.Context, next: () => Promise<any>) {
  ctx.body = await Problem.updateProblem(ctx.params.problemid, ctx.body);
  await next();
}
