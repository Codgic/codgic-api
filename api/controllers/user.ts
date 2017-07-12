/* /api/controllers/user.ts
   We love our users! */

import * as Koa from 'koa';
import * as User from './../models/user';

export async function getCurrentInfo(ctx: Koa.Context, next: () => Promise<any>) {
  ctx.body = await User.getCurrentInfo();
  await next();
}

export async function getUserInfo(ctx: Koa.Context, next: () => Promise<any>) {
  ctx.body = await User.getUserInfo(ctx.params.username);
  await next();
}

export async function searchUser(ctx: Koa.Context, next: () => Promise<any>) {
  ctx.body = await User.searchUser(ctx.params.keyword, ctx.query.page, ctx.query.num);
  await next();
}
