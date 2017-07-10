/* /api/controllers/user.ts
   We love our users! */

import * as Koa from 'koa';
import * as User from './../models/user';

export async function getCurrentInfo(ctx: Koa.Context, next: () => Promise<any>) {
  ctx.status = 200;
  ctx.body = await User.getCurrentInfo();
  await next();
}

export async function getUserInfo(ctx: Koa.Context, next: () => Promise<any>) {
  ctx.status = 200;
  ctx.body = await User.getUserInfo(ctx.params.username);
  await next();
}
