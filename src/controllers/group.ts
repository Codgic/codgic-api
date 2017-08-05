/* /api/controller/group.ts
  Groups promote love and friendship. */

import * as Koa from 'koa';
import * as Group from './../models/group';

export async function getGroupInfo(ctx: Koa.Context, next: () => Promise<any>) {

  ctx.body = await Group
                  .getGroupInfo(ctx.params.groupid)
                  .catch((err) => {
                    ctx.throw(404, err);
                  });

  ctx.status = 200;

  await next();

}

export async function getGroupMembers(ctx: Koa.Context, next: () => Promise<any>) {

  ctx.body = await Group
                  .getGroupMembers(ctx.params.groupid)
                  .catch((err) => {
                    ctx.throw(404, err);
                  });

  ctx.status = 200;

  await next();

}

export async function postGroup(ctx: Koa.Context, next: () => Promise<any>) {

  // Verify login.
  if (!ctx.state.user) {
    ctx.throw(400);
  }

  // Create group.
  ctx.body = await Group
                  .postGroup(ctx.request.body, ctx.state.user.id)
                  .catch((err) => {
                    ctx.throw(400, err);
                  });

  ctx.status = 200;

  await next();

}
