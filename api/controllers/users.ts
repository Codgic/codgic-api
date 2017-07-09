/* /api/controllers/users.js
   We love our users! */

import * as Koa from 'koa';
import * as Users from './../models/users';

/* getCurrentInfo()
   Get user info of current user.
   Return: Username | Nickname
 */
export async function getCurrentInfo(ctx: Koa.Context, next: () => Promise<any>) {
  ctx.status = 200;
  ctx.body = '{ "msg": "Comming Soon!" }';
  await next();
}

// Get user info of other users
export async function getUserInfo(ctx: Koa.Context, next: () => Promise<any>) {
  ctx.status = 200;
  ctx.body = await Users.getUserInfo();
  await next();
}
