/* /src/controller/group.ts
  Groups promote love and friendship. */

import * as createError from 'http-errors';
import { Context } from 'koa';

import * as GroupModel from './../models/group';

export async function getGroupInfo(ctx: Context, next: () => Promise<any>) {

  // Validate request.
  if (isNaN(ctx.params.groupId)) {
    throw createError(400);
  }

  // Retrieve group info.
  const groupInfo = await GroupModel.getGroupInfo(ctx.params.groupId, 'id');

  if (!groupInfo) {
    throw createError(404, 'Group does not exist.');
  }

  ctx.body = groupInfo;
  ctx.status = 200;

  await next();

}

export async function getGroupMemberList(ctx: Context, next: () => Promise<any>) {

  // Validate request.
  if (isNaN(ctx.params.groupId)) {
    throw createError(400);
  }

  // Retrieve group info.
  const groupMember = await GroupModel.getGroupMemberList(
    ctx.params.groupId,
    'id',
    ctx.query.sort,
    ctx.query.direction,
    ctx.query.page,
    ctx.query.pre_page,
  );

  ctx.body = groupMember;
  ctx.status = 200;

  await next();

}

export async function addToGroup(ctx: Context, next: () => Promise<any>) {

  // Check login.
  if (!ctx.state.user) {
    throw createError(401);
  }

  // Validate request.
  if (!(ctx.request.body.userid && ctx.request.body.groupid)) {
    throw createError(400);
  }

  ctx.body = await GroupModel.addToGroup(ctx.request.body.userid, ctx.request.body.groupid);
  ctx.status = 201;

  await next();

}

export async function removeFromGroup(ctx: Context, next: () => Promise<any>) {

  // Check login.
  if (!ctx.state.user) {
    throw createError(401);
  }

  // Validate request.
  if (!(ctx.params.userId && ctx.params.groupId)) {
    throw createError(400);
  }

  ctx.body = await GroupModel.removeFromGroup(ctx.params.userId, ctx.params.groupId);
  ctx.status = 204;

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
