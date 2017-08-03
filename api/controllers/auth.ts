/* /api/controllers/auth.ts
   Get authenticated first! */

import * as Koa from 'koa';
import * as Auth from './../models/auth';

import { getUserInfo } from './../models/user';

export async function verifyAuthInfo(ctx: Koa.Context, next: () => Promise<any>) {

  // Get user info.
  const userInfo: any = await getUserInfo(ctx.request.body.username);

  if (userInfo.error) {
    ctx.throw(400, {
      error: userInfo.error,
    });
  }

  // Verify password.
  if (!Auth.verifyPassword(ctx.request.body.password, userInfo.password, userInfo.salt)) {
    ctx.throw(400, {
      error: ctx.body.error,
    });
  }

  // Generate Token.
  ctx.body = await Auth.generateToken(userInfo.id, userInfo.username, userInfo.email, userInfo.privilege);
  if (ctx.body.error) {
    ctx.throw(500, {
      error: ctx.body.error,
    });
  } else {
    ctx.status = 200;
  }
  await next();
}
