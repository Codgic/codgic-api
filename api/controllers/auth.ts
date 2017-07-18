/* /api/controllers/auth.ts
   Get authenticated first! */

import * as Koa from 'koa';
import * as Auth from './../models/auth';

export async function verifyAuthInfo(ctx: Koa.Context, next: () => Promise<any>) {
  ctx.body = await Auth.verifyAuthInfo(ctx.body);
  if (ctx.body.error) {
    ctx.status = 400;
  } else {
    ctx.status = 200;
  }
  await next();
}
