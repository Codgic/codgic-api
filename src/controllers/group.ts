/* /src/controller/group.ts
  Groups promote love and friendship. */

import { Context } from 'koa';

import * as GroupModel from './../models/group';

export async function getGroupInfo(ctx: Context, next: () => Promise<any>) {

  // Validate request.
  if (isNaN(ctx.params.groupid)) {
    ctx.throw(400);
  }

  // Retrieve group info.
  const groupInfo = await GroupModel.getGroupInfo(ctx.params.groupid);

  ctx.body = groupInfo;
  ctx.status = 200;

  await next();

}

export async function getGroupMembers(ctx: Context, next: () => Promise<any>) {

  // Validate request.
  if (isNaN(ctx.params.groupid)) {
    ctx.throw(400, 'Invalid group id.');
  }

  // Retrieve group members.
  const groupMembers = await GroupModel.getGroupMembers(ctx.params.groupid);

  ctx.body = groupMembers;
  ctx.status = 200;

  await next();

}

export async function postGroup(ctx: Context, next: () => Promise<any>) {

  // Check login.
  if (!ctx.state.user) {
    ctx.throw(401);
  }

  // Validate request.
  if (!ctx.request.body.name) {
    ctx.throw(400);
  }

  // Create group.
  const groupInfo = await GroupModel.postGroup(ctx.request.body, ctx.state.user.id);

  ctx.body = groupInfo;
  ctx.status = 201;

  await next();

}
