/* /src/controller/group.ts
  Groups promote love and friendship. */

import * as createError from 'http-errors';
import { Context } from 'koa';

import { checkPrivilege, GroupMemberPrivilege } from './../init/privilege';
import * as GroupModel from './../models/group';
import * as UserModel from './../models/user';

export async function getGroupInfo(ctx: Context, next: () => Promise<any>) {

  // Validate request.
  if (isNaN(ctx.params.groupId)) {
    throw createError(400);
  }

  // Retrieve group info.
  const groupInfo = await GroupModel.getGroupInfo(parseInt(ctx.params.groupId, 10), 'id');

  if (!groupInfo) {
    throw createError(404, 'Group does not exist.');
  }

  ctx.body = groupInfo;
  ctx.status = 200;

  await next();

}

export async function getGroupMemberInfo(ctx: Context, next: () => Promise<any>) {

  // Validate request.
  if (isNaN(ctx.params.groupId) || !ctx.params.username) {
    throw createError(400);
  }

  // Retrieve group and user.
  const group = await GroupModel.getGroupInfo(parseInt(ctx.params.groupId, 10), 'id');
  const user =  await UserModel.getUserInfo(ctx.params.username, 'username');

  if (!group) {
    throw createError(500, 'Group does not exist.');
  }
  if (!user) {
    throw createError(500, 'User does not exist.');
  }

  // Retrieve group info.
  const groupMemberInfo = await GroupModel.getGroupMemberInfo(user, group);

  if (!groupMemberInfo) {
    throw createError(404, 'Group does not exist.');
  }

  ctx.body = groupMemberInfo;
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
    parseInt(ctx.params.groupId, 10),
    'id',
    ctx.query.sort,
    ctx.query.direction,
    parseInt(ctx.query.page, 10),
    parseInt(ctx.query.per_page, 10),
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
  if (isNaN(ctx.request.body.userid) || isNaN(ctx.request.body.groupid)) {
    throw createError(400);
  }

  const group = await GroupModel.getGroupInfo(parseInt(ctx.request.body.groupid, 10), 'id');
  if (!group) {
    throw createError(400, 'Group does not exist.');
  }

  // Check privilege.
  const groupMemberInfo = await GroupModel.getGroupMemberInfo(ctx.state.user, group);

  if (!groupMemberInfo || !checkPrivilege(GroupMemberPrivilege.editUser, groupMemberInfo.privilege)) {
    throw createError(403);
  }

  const user = await UserModel.getUserInfo(parseInt(ctx.request.body.userid, 10), 'id');
  if (!user) {
    throw createError(400, 'User does not exist.');
  }

  // Add to group.
  ctx.body = await GroupModel.addToGroup(user, group, parseInt(ctx.request.body.privilege, 10));
  ctx.status = 201;

  await next();

}

export async function removeFromGroup(ctx: Context, next: () => Promise<any>) {

  // Check login.
  if (!ctx.state.user) {
    throw createError(401);
  }

  // Validate request.
  if (isNaN(ctx.params.username) || isNaN(ctx.params.groupId)) {
    throw createError(400);
  }

  const group = await GroupModel.getGroupInfo(parseInt(ctx.params.groupId, 10), 'id');
  if (!group) {
    throw createError(400, 'Group does not exist.');
  }

  const user = await UserModel.getUserInfo(ctx.params.username, 'username');
  if (!user) {
    throw createError(400, 'User does not exist.');
  }

  ctx.body = await GroupModel.removeFromGroup(user, group);
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

  // Retrieve owner user.
  const user =  await UserModel.getUserInfo(parseInt(ctx.state.user.id, 10), 'id');

  if (!user) {
    throw createError(500, 'User does not exist.');
  }

  // Create group.
  const group = await GroupModel.postGroup(ctx.request.body, user);

  // Add owner to group.
  await GroupModel.addToGroup(
    ctx.state.user,
    group,
    GroupMemberPrivilege.isMember + GroupMemberPrivilege.editInfo + GroupMemberPrivilege.editUser,
  ).catch((err) => {
      // await GroupModel.deleteGroup(groupInfo.id);
      throw createError(500, err);
    });

  ctx.body = group;
  ctx.status = 201;

  await next();

}
