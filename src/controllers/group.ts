/* /src/controller/group.ts
  Groups promote love and friendship. */

import * as createError from 'http-errors';
import { Context } from 'koa';

import * as GroupModel from './../models/group';

export async function getGroupInfo(ctx: Context, next: () => Promise<any>) {

  // Validate request.
  if (isNaN(ctx.params.groupid)) {
    throw createError(400);
  }

  // Retrieve group info.
  const groupInfo = await GroupModel.getGroupInfo(ctx.params.groupid);

  if (!groupInfo) {
    throw createError(404, 'Group does not exist.');
  }

  ctx.body = groupInfo;
  ctx.status = 200;

  await next();

}

export async function getGroupMembers(ctx: Context, next: () => Promise<any>) {

  // Validate request.
  if (isNaN(ctx.params.groupid)) {
    throw createError(400, 'Invalid group id.');
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
    throw createError(401);
  }

  // Validate request.
  if (!ctx.request.body.name) {
    throw createError(400);
  }

  // Create group.
  const groupInfo = await GroupModel.postGroup(ctx.request.body, ctx.state.user.id);

  ctx.body = groupInfo;
  ctx.status = 201;

  await next();

}
