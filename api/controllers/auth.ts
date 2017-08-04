/* /api/controllers/auth.ts
   Get authenticated first! */

import * as Koa from 'koa';
import * as Auth from './../models/auth';

import { getUserInfo } from './../models/user';

import { UserPrivilege } from './../init/privilege';

export async function verifyAuthInfo(ctx: Koa.Context, next: () => Promise<any>) {

  // Get user auth info.
  const userInfo: any = await getUserInfo(ctx.request.body.username, { auth_info: true });

  if (userInfo.error) {
    ctx.throw(400, {
      error: userInfo.error,
    });
  }

  // Check if user is disabled.
  if (!(userInfo.privilege & UserPrivilege.isEnabled)) {
    ctx.throw(403, {
      error: 'User is disabled.',
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
  }

  ctx.status = 200;

  await next();

}
