/* /api/controllers/user.ts
   We love our users! */

import * as Koa from 'koa';
import * as User from './../models/user';

export async function getCurrentInfo(ctx: Koa.Context, next: () => Promise<any>) {
  ctx.body = await User.getCurrentInfo();
  if (ctx.body.error) {
    ctx.throw(404, {
      error: ctx.body.error,
    });
  } else {
    ctx.status = 200;
  }
  await next();
}

export async function getUserInfo(ctx: Koa.Context, next: () => Promise<any>) {
  ctx.body = await User.getUserInfo(ctx.params.username);
  if (ctx.body.error) {
    ctx.throw(404, {
      error: ctx.body.error,
    });
  } else {
    ctx.status = 200;
  }
  await next();
}

export async function searchUser(ctx: Koa.Context, next: () => Promise<any>) {
  ctx.body = await User.searchUser(
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

export async function signUp(ctx: Koa.Context, next: () => Promise<any>) {
  ctx.body = await User.signUp(ctx.request.body);
  if (ctx.body.error) {
    ctx.throw(400, {
      error: ctx.body.error,
    });
  } else {
    ctx.status = 201;
  }
  await next();
}
