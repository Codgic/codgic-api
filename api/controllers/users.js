/* /api/controllers/users.js
   We love our users! */

'use strict';

import { usersQuery } from './../models/users';

/* getCurrentInfo()
   Get user info of current user.
   Return: Username | Nickname
 */
export async function getCurrentInfo(ctx, next) {
  ctx.status = 200;
  const request = ['uuid', 'nickname'];
  const para = ctx.params.text;
  ctx.body = usersQuery(request);
  await next();
}

// Get user info of other users
export async function getUserInfo(ctx, next) {
  ctx.status = 200;
  ctx.body = 'Comming Soon!';
  await next();
}
