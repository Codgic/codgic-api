/* /src/controllers/AuthModel.ts
   Get authenticated first! */

import { Context } from 'koa';

import * as AuthModel from './../models/auth';
import * as UserModel from './../models/user';

export async function refreshToken(ctx: Context, next: () => Promise<any>) {

  // Check login.
  if (!ctx.state.user) {
    ctx.throw(401);
  }

  // Retrieve user info again.
  const userInfo = await UserModel.getUserInfo(ctx.state.user.id, 'id');

  if (!userInfo) {
    ctx.throw(400, 'Failed to retrieve user info.');
  }

  // Generate Token.
  const token = await AuthModel
    .generateToken(ctx.state.user.id, userInfo.username, userInfo.email, userInfo.privilege);

  ctx.body = {
    token,
  };
  ctx.status = 200;

  await next();

}

export async function verifyAuthInfo(ctx: Context, next: () => Promise<any>) {

  // Validate request.
  if (!(ctx.request.body.password && ctx.request.body.username)) {
    ctx.throw(400);
  }

  // AuthModel and get user info.
  const userInfo = await AuthModel.getUserInfoWithAuth(ctx.request.body.username, ctx.request.body.password);

  // Generate Token.
  const token = await AuthModel.generateToken(userInfo.id, userInfo.username, userInfo.email, userInfo.privilege);

  ctx.body = {
    token,
  };
  ctx.status = 200;

  await next();

}
