/* /api/controllers/user.ts
   We love our users! */

import { Context } from 'koa';

import { config } from './../init/config';
import { getHttpStatusCode } from './../init/error';
import { UserPrivilege } from './../init/privilege';
import * as User from './../models/user';

export async function getCurrentInfo(ctx: Context, next: () => Promise<any>) {

  // Check login.
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

export async function postUser(ctx: Context, next: () => Promise<any>) {

  // Validate request.
  await User.validateUserInfo(ctx.request.body)
    .catch((err) => {
      ctx.throw(getHttpStatusCode(err.message), err.message);
    });

  // Post user.
  ctx.body = await User
                  .postUser(ctx.request.body)
                  .catch((err) => {
                    ctx.throw(getHttpStatusCode(err.message), err.message);
                  });

  ctx.status = 201;

  await next();

}

export async function updateUser(ctx: Context, next: () => Promise<any>) {

  // Check login.
  if (!ctx.state.user) {
    ctx.throw(401);
  }

  // Validate request.
  User.validateUserInfo(ctx.request.body)
    .catch((err) => {
      ctx.throw(getHttpStatusCode(err.message), err.message);
    });

  // Retrieve user info.
  const userInfo: any = await User
              .getUserInfo(ctx.params.username)
              .catch((err) => {
                ctx.throw(getHttpStatusCode(err.message), err.message);
              });

  // Check privilege.
  const hasPrivilege = await User
              .verifyUserPrivilege(UserPrivilege.editUser, ctx.state.user.id, userInfo.id, ctx.state.user.privilege)
              .catch((err) => {
                ctx.throw(getHttpStatusCode(err.message), err.message);
              });

  if (!hasPrivilege) {
    ctx.throw(403);
  }

  // Post user.
  ctx.body = await User
                  .postUser(ctx.request.body)
                  .catch((err) => {
                    ctx.throw(getHttpStatusCode(err.message), err.message);
                  });

  ctx.status = 201;

  await next();

}
