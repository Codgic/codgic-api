/* /src/controllers/user.ts
   We love our users! */

import { Context } from 'koa';

import { UserPrivilege } from './../init/privilege';
import * as User from './../models/user';

export async function getCurrentInfo(ctx: Context, next: () => Promise<any>) {

  // Check login.
  if (!ctx.state.user) {
    ctx.throw(401);
  }

  // Retrieve user info.
  ctx.body = await User.getUserInfo(ctx.state.user.id);

  ctx.status = 200;

  await next();

}

export async function getUserInfo(ctx: Context, next: () => Promise<any>) {

  // Retrieve user info.
  ctx.body = await User.getUserInfo(ctx.params.username);

  ctx.status = 200;

  await next();

}

export async function searchUser(ctx: Context, next: () => Promise<any>) {

  ctx.body = await User
                  .searchUser(
                    ctx.query.keyword,
                    ctx.query.sort,
                    ctx.query.order,
                    ctx.query.page,
                    ctx.query.num,
                  );

  ctx.status = 200;

  await next();

}

export async function postUser(ctx: Context, next: () => Promise<any>) {

  // Validate request.
  await User.validateUserInfo(ctx.request.body);

  // Post user.
  ctx.body = await User.postUser(ctx.request.body);

  ctx.status = 201;

  await next();

}

export async function updateUser(ctx: Context, next: () => Promise<any>) {

  // Check login.
  if (!ctx.state.user) {
    ctx.throw(401);
  }

  // Validate request.
  User.validateUserInfo(ctx.request.body);

  // Retrieve user info.
  const userInfo: any = await User.getUserInfo(ctx.params.username);

  // Check privilege.
  const hasPrivilege = await User
              .verifyUserPrivilege(UserPrivilege.editUser, ctx.state.user.id, userInfo.id, ctx.state.user.privilege);

  if (!hasPrivilege) {
    ctx.throw(403);
  }

  // Post user.
  ctx.body = await User.postUser(ctx.request.body);

  ctx.status = 201;

  await next();

}
