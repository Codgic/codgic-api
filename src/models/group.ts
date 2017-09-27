/* /src/models/group.ts */

import * as createError from 'http-errors';
import { getRepository } from 'typeorm';

import { getUserInfo } from './user';

import { Group } from './../entities/group';
import { GroupMap } from './../entities/group_map';
import { User } from './../entities/user';

import { config } from './../init/config';

export async function getGroupInfo(data: number | string, by: 'id' | 'name' = 'id') {

  // Validate parameters.
  if (!data || (by !== 'id' && by !== 'name')) {
    throw createError(500, 'Invalid parameters.');
  }

  const groupInfo = await getRepository(Group)
    .findOne({
      join: {
        alias: 'group',
        innerJoinAndSelect: {
          owner: 'group.owner',
        },
      },
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

export async function getGroupMemberInfo(user: User, group: Group) {

  // Validate parameters.
  if (!(user && group)) {
    throw createError(500, 'Invalid parameters.');
  }

  const groupMember = await getRepository(GroupMap)
    .createQueryBuilder('group_map')
    .innerJoinAndSelect('group_map.group', 'group', `group.id = :groupId`)
    .innerJoinAndSelect('group_map.user', 'user', `user.id = :userId`)
    .setParameters({
      groupId: group.id,
      userId: user.id,
    })
    .getOne()
    .catch((err) => {
      console.error(err);
      throw createError(500, 'Database operation failed.');
    });

  return groupMember;

}

export async function getGroupMemberList(
  data: number,
  by: 'id' | 'name' = 'id',
  sort: 'id' | 'username' | 'joinedAt' = 'joinedAt',
  direction: 'ASC' | 'DESC' = 'ASC',
  page: number = 1,
  perPage: number = config.oj.default.page.group_member || 20,
) {

  // Validate parameters.
  if (
    !data ||
    (by !== 'id' && by !== 'name') ||
    (direction !== 'ASC' && direction !== 'DESC') ||
    page < 1 ||
    perPage < 1
  ) {
    throw createError(500, 'Invalid parameters.');
  }

  let orderBy: string;

  if (sort === 'joinedAt') {
    orderBy = 'group_map.createdAt';
  } else if (sort === 'id' || sort === 'username') {
    orderBy = `group_map.user.${sort}`;
  } else {
    throw createError(500, 'Invalid parameters.');
  }

  const firstResult = (page - 1) * perPage;

  const groupMember = await getRepository(GroupMap)
    .createQueryBuilder('group_map')
    .innerJoinAndSelect('group_map.group', 'group', `group.${by} = :data`)
    .innerJoinAndSelect('group_map.user', 'user')
    .select([
      'user',
      'group_map.privilege',
      'group_map.createdAt',
      'group_map.updatedAt',
    ])
    .setParameter('data', data)
    .offset(firstResult)
    .limit(perPage)
    .orderBy(orderBy, direction)
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
  perPage: number = config.oj.default.page.group || 20) {

  // Validate parameters.
  if (
    page < 1 ||
    perPage < 1 ||
    keyword !== ('id' || 'name' || 'createdAt' || 'updatedAt') ||
    order !== ('ASC' || 'DESC')
  ) {
    throw createError(500, 'Invalid parameters.');
  }

  const firstResult = (page - 1) * perPage;

  const searchResult = await getRepository(Group)
    .createQueryBuilder('group')
    .where('group.name LIKE :keyword')
    .orWhere('group.description LIKE :keyword')
    .setParameter('keyword', `%${keyword}%`)
    .offset(firstResult)
    .limit(perPage)
    .orderBy(`group.${orderBy}`, order)
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

export async function addToGroup(userId: number, groupId: number, privilege: number = 1) {

  // Validate parameters.
  if (!(userId && groupId) || privilege < 0) {
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
  groupMap.privilege = privilege;

  await getRepository(GroupMap)
    .save(groupMap)
    .catch((err) => {
      if (err.errno === 1062) {
        throw createError(400, 'Relationship already exists.');
      } else {
        console.error(err);
        throw createError(500, 'Database operation failed.');
      }
    });

  return groupMap;

}

export async function removeFromGroup(userId: number, groupId: number) {

  // Validate parameters.
  if (!(userId && groupId)) {
    throw createError(500, 'Invalid parameters.');
  }
  const groupMapRepository = getRepository(GroupMap);

  await groupMapRepository
    .createQueryBuilder('group_map')
    .innerJoinAndSelect('group_map.group', 'group', 'group.id = :groupId')
    .innerJoinAndSelect('group_map.user', 'user', 'user.id = :userId')
    .setParameters({
      groupId,
      userId,
    })
    .delete()
    .execute()
    .catch((err) => {
      console.error(err);
      throw createError(500, 'Database operation failed.');
    });

  return null;

}

// Create or update group.
export async function postGroup(data: Group, user: User) {

  // Validate parameters.
  if (!(data.name && user)) {
    throw createError(500, 'Invalid parameters.');
  }

  const group = new Group();

  group.name = data.name;
  group.description = data.description;
  group.owner = user;

  await getRepository(Group)
    .save(group)
    .catch((err) => {
      if (err.errno === 1062) {
        throw createError(400, 'Group name taken.');
      } else {
        console.error(err);
        throw createError (500, 'Database operation failed.');
      }
    });

  return group;

}
