/* /api/controllers/user.ts
   We love our users! */

import * as Koa from 'koa';
import * as Problem from './../models/problem';

export async function getProblemList(ctx: Koa.Context, next: () => Promise<any>) {
  ctx.status = 200;
  ctx.body = await Problem.getProblemList(ctx.params.pageid);
  await next();
}

export async function getProblemInfo(ctx: Koa.Context, next: () => Promise<any>) {
  ctx.status = 200;
  ctx.body = await Problem.getProblemInfo(ctx.params.username);
  await next();
}
