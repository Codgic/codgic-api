/* /api/controller/group.ts
  Groups promote love and friendship. */

import * as Koa from 'koa';
import * as Group from './../models/group';

export async function getGroupInfo(ctx: Koa.Context, next: () => Promise<any>) {

  const groupInfo: any = await Group.getGroupInfo(ctx.params.groupid);

  if (groupInfo.error) {
    ctx.throw(404, groupInfo.error);
  }

  ctx.body = groupInfo;
  ctx.status = 200;

  await next();

}

export async function getGroupMembers(ctx: Koa.Context, next: () => Promise<any>) {

  const groupMembers: any = await Group.getGroupMembers(ctx.params.groupid);

  if (groupMembers.error) {
    ctx.throw(404, groupMembers.error);
  }

  ctx.body = groupMembers;
  ctx.status = 200;

  await next();

}

export async function postGroup(ctx: Koa.Context, next: () => Promise<any>) {

  // Verify login.
  if (!ctx.state.user) {
    ctx.throw(400);
  }

  // Create group.
  const result: any = await Group.postGroup(ctx.request.body, ctx.state.user.id);

  if (result.error) {
    ctx.throw(400, result.error);
  }

  ctx.body = result;
  ctx.status = 200;

  await next();

}
