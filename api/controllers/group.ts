/* /api/controller/group.ts
  Groups promote love and friendship. */

import * as Koa from 'koa';
import * as Group from './../models/group';

export async function postGroup(ctx: Koa.Context, next: () => Promise<any>) {

  // Verify login.
  if (!ctx.state.user) {
    ctx.throw(400);
  }

  // Create group.
  const groupInfo: any = await Group.postGroup(ctx.request.body, ctx.state.user.id);

  if (groupInfo.error) {
    ctx.throw(400, {
      error: ctx.body.error,
    });
  }

  ctx.body = groupInfo;
  ctx.status = 200;

  await next();

}
