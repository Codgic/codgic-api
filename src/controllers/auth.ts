/* /src/controllers/AuthModel.ts
   Get authenticated first! */

import * as createError from 'http-errors';
import { Context } from 'koa';

import * as AuthModel from './../models/auth';
import * as UserModel from './../models/user';

export async function refreshToken(ctx: Context, next: () => Promise<any>) {

  // Check login.
  if (!ctx.state.user) {
    throw createError(401);
  }

  // Retrieve user info again.
  const user = await UserModel.getUserInfo(ctx.state.user.id, 'id');

  if (!user) {
    throw createError(403, 'User does not exist.');
  }

  // Generate Token.
  const token = await AuthModel
    .generateToken(user);

  ctx.body = {
    token,
  };
  ctx.status = 200;

  await next();

}

export async function verifyAuthInfo(ctx: Context, next: () => Promise<any>) {

  // Validate request.
  if (!(ctx.request.body.password && ctx.request.body.username)) {
    throw createError(400);
  }

  // Auth and get user info.
  const user = await AuthModel.validateUserCredential(ctx.request.body.username, ctx.request.body.password);

  // Generate Token.
  const token = await AuthModel.generateToken(user);

  ctx.body = {
    token,
  };
  ctx.status = 200;

  await next();

}
