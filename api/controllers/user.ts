/* /api/controllers/user.ts
   We love our users! */

import * as Koa from 'koa';
import * as User from './../models/user';

export async function getCurrentInfo(ctx: Koa.Context, next: () => Promise<any>) {
  // Verify login.
  if (!ctx.state.user) {
    ctx.throw(400);
  }

  // Retrieve user info.
  const userInfo: any = await User.getUserInfo(ctx.state.user.id);

  if (userInfo.error) {
    ctx.throw(404, {
      error: ctx.body.error,
    });
  } else {
    userInfo.delete('salt');
    userInfo.delete('password');
    ctx.body = userInfo;
    ctx.status = 200;
  }
  await next();
}

export async function getUserInfo(ctx: Koa.Context, next: () => Promise<any>) {

  // Retrieve user info.
  const userInfo: any = await User.getUserInfo(ctx.params.username);

  if (userInfo.error) {
    ctx.throw(404, {
      error: ctx.body.error,
    });
  } else {
    userInfo.delete('salt');
    userInfo.delete('password');
    ctx.body = userInfo;
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
