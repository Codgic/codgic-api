/* /src/controllers/user.ts
   We love our users! */

import { Context } from 'koa';

import * as UserModel from './../models/user';

export async function getCurrentInfo(ctx: Context, next: () => Promise<any>) {

  // Check login.
  if (!ctx.state.user) {
    ctx.throw(401);
  }

  // Retrieve user info.
  const userInfo = await UserModel.getUserInfo(ctx.state.user.id, 'id');

  ctx.body = userInfo;
  ctx.status = 200;

  await next();

}

export async function getUserInfo(ctx: Context, next: () => Promise<any>) {

  // Retrieve user info.
  const userInfo = await UserModel.getUserInfo(ctx.params.username, 'username');

  ctx.body = userInfo;
  ctx.status = 200;

  await next();

}

export async function searchUser(ctx: Context, next: () => Promise<any>) {

  const userList = await UserModel
    .searchUser(
      ctx.query.keyword,
      ctx.query.sort,
      ctx.query.order,
      ctx.query.page,
      ctx.query.num,
    );

  ctx.body = userList;
  ctx.status = 200;

  await next();

}

export async function postUser(ctx: Context, next: () => Promise<any>) {

  // Logged in users cannot sign up again.
  if (ctx.state.user) {
    ctx.throw(400, 'Please log out first.');
  }

  // Validate request.
  if (ctx.request.body.id || !await UserModel.validateUserInfo(ctx.request.body)) {
    ctx.throw(400);
  }

  // Post user.
  const userInfo = await UserModel.postUser(ctx.request.body);

  ctx.body = userInfo;
  ctx.status = 201;

  await next();

}

export async function updateUser(ctx: Context, next: () => Promise<any>) {

  // Check login.
  if (!ctx.state.user) {
    ctx.throw(401);
  }

  ctx.request.body.id = ctx.state.user.id;

  // Validate request.
  const isValid = await UserModel.validateUserInfo(ctx.request.body);

  if (isValid !== true) {
    ctx.throw(400);
  }

  // Post user.
  const userInfo = await UserModel.postUser(ctx.request.body);

  ctx.body = userInfo;
  ctx.status = 201;

  await next();

}
