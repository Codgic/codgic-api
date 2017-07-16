/* /api/controllers/auth.ts
   Get authenticated first! */

import * as Koa from 'koa';
import * as Auth from './../models/auth';

export async function verifyAuthInfo(ctx: Koa.Context, next: () => Promise<any>) {
  ctx.body = await Auth.verifyAuthInfo(ctx.body);
  await next();
}
