/* /src/models/group.ts */

import * as createError from 'http-errors';
import { getRepository } from 'typeorm';

import { getUserInfo } from './user';

import { Group } from './../entities/group';
import { GroupMap } from './../entities/group_map';

import { config } from './../init/config';

export async function getGroupInfo(data: number, by: 'id' | 'name' = 'id') {

  // Validate parameters.
  if (!data || (by !== 'id' && 'name')) {
    throw createError(500, 'Invalid parameters.');
  }

  const groupInfo = await getRepository(Group)
    .findOne({
      where: {
        [by]: data,
      },
    })
    .catch((err) => {
      console.error(err);
      throw createError(500, 'Database operation failed.');
    });

  return groupInfo;

}

export async function getGroupMember(data: number, by: 'id' | 'name' = 'id') {

  // Validate parameters.
  if (!data || (by !== 'id' && 'name')) {
    throw createError(500, 'Invalid parameters.');
  }

  const groupMember = await getRepository(GroupMap)
    .createQueryBuilder('group_map')
    .innerJoinAndSelect('group_map.group', 'groupInfo', `groupInfo.${by} = :data`)
    .setParameter('data', data)
    .getMany()
    .catch((err) => {
      console.error(err);
      throw createError(500, 'Database operation failed.');
    });

  return groupMember;

}

export async function searchGroup(
  orderBy: 'id' | 'name' | 'createdAt' | 'updatedAt' = 'id',
  order: 'ASC' | 'DESC'  = 'ASC',
  keyword: string,
  page: number = 1,
  num: number = config.oj.default.page.group || 20) {

  // Validate parameters.
  if (
    page < 1 ||
    num < 1 ||
    keyword !== ('id' || 'name' || 'createdAt' || 'updatedAt') ||
    order !== ('ASC' || 'DESC')
  ) {
    throw createError(500, 'Invalid parameters.');
  }

  const firstResult = (page - 1) * num;

  const searchResult = await getRepository(Group)
    .createQueryBuilder('group')
    .where('problem.name LIKE :keyword')
    .orWhere('problem.description LIKE :keyword')
    .setParameter('keyword', `%${keyword}%`)
    .setFirstResult(firstResult)
    .setMaxResults(num)
    .orderBy(`problem.${orderBy}`, order)
    .getMany()
    .catch((err) => {
      console.error(err);
      throw createError(500, 'Database operation failed.');
    });

  if (!searchResult) {
    throw createError(404, 'No matching result.');
  }

  return searchResult;

}

// Judge whether user is in group.
export async function isInGroup(userId: number, groupId: number) {

  // Validate parameters.
  if (isNaN(userId) || isNaN(groupId)) {
    throw createError(500, 'Invalid parameters.');
  }

  return true;

}

export async function addToGroup(userId: number, groupId: number) {

  // Validate parameters.
  if (!(userId && groupId)) {
    throw createError(500, 'Invalid parameters.');
  }

  const user = await getUserInfo(userId, 'id');

  if (!user) {
    throw createError(400, 'User does not exist.');
  }

  const group = await getGroupInfo(groupId, 'id');

  if (!group) {
    throw createError(400, 'Group does not exist.');
  }

  const groupMap = new GroupMap();

  groupMap.user = user;
  groupMap.group = group;

  const groupMapInfo = getRepository(GroupMap).save(groupMap)
    .catch((err) => {
      console.error(err);
      throw createError(500, 'Database operation failed.');
    });

  return groupMapInfo;

}

// Create or update group.
export async function postGroup(data: Group, userId: number) {

  // Validate parameters.
  if (!(data.name && userId)) {
    throw createError(500, 'Invalid parameters.');
  }

  const user = await getUserInfo(userId, 'id');

  if (!user) {
    throw createError(500, 'User does not exist.');
  }

  const group = new Group();
  const groupMap = new GroupMap();

  group.name = data.name;
  group.description = data.description;
  group.owner = user;

  groupMap.group = group;
  groupMap.user = user;

  // Add owner as group users.
  group.users = [ groupMap ];

  const groupInfo = await getRepository(Group).persist(group)
    .catch((err) => {
      if (err.errno === 1062) {
        throw createError(400, 'Group name taken.');
      } else {
        console.error(err);
        throw createError (500, 'Database operation failed.');
      }
    });

  return groupInfo;

}
