/* /api/controllers/user.ts
   We love our users! */

import { Context } from 'koa';

import { getConfig } from './../init/config';
import { getHttpStatusCode } from './../init/error';
import * as User from './../models/user';

const config = getConfig();

export async function getCurrentInfo(ctx: Context, next: () => Promise<any>) {

  // Verify login.
  if (!ctx.state.user) {
    ctx.throw(401);
  }

  // Retrieve user info.
  ctx.body = await User
                  .getUserInfo(ctx.state.user.id)
                  .catch((err) => {
                    ctx.throw(getHttpStatusCode(err.message), err.message);
                  });

  ctx.status = 200;

  await next();

}

export async function getUserInfo(ctx: Context, next: () => Promise<any>) {

  // Retrieve user info.
  ctx.body = await User
                  .getUserInfo(ctx.params.username)
                  .catch((err) => {
                    ctx.throw(getHttpStatusCode(err.message), err.message);
                  });

  ctx.status = 200;

  await next();

}

export async function searchUser(ctx: Context, next: () => Promise<any>) {

  ctx.body = await User
                  .searchUser(
                    ctx.query.sort,
                    ctx.query.order,
                    ctx.query.keyword,
                    ctx.query.page,
                    ctx.query.num,
                  )
                  .catch((err) => {
                    ctx.throw(getHttpStatusCode(err.message), err.message);
                  });

  ctx.status = 200;

  await next();

}

export async function signUp(ctx: Context, next: () => Promise<any>) {

  // Validate request.
  User.validateUserInfo(ctx.request.body)
    .catch((err) => {
      ctx.throw(getHttpStatusCode(err.message), err.message);
    });

  ctx.body = await User
                  .signUp(ctx.request.body)
                  .catch((err) => {
                    ctx.throw(getHttpStatusCode(err.message), err.message);
                  });

  ctx.status = 201;

  await next();
}
