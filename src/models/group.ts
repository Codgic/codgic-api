/* /src/models/group.ts */

import * as createError from 'http-errors';
import { getRepository } from 'typeorm';

import { Group } from './../entities/group';
import { GroupMap } from './../entities/group_map';
import { config } from './../init/config';
import { GroupMemberPrivilege } from './../init/privilege';

export async function getGroupInfo(groupid: number) {

  // Validate parameters.
  if (!groupid) {
    throw createError(500, 'Invalid parameters.');
  }

  const groupRepository = getRepository(Group);
  const groupInfo = await groupRepository
    .findOne({
      where: {
        id: groupid,
      },
    })
    .catch((err) => {
      console.error(err);
      throw createError(500, 'Database operation failed.');
    });

  if (!groupInfo) {
    throw createError(404, 'Group not found.');
  }

  return groupInfo;

}

export async function getGroupMembers(groupid: number) {

  // Validate parameters.
  if (!groupid) {
    throw createError(500, 'Invalid parameters.');
  }

  const groupMapInfo = await getRepository(GroupMap)
    .find({
      where: {
        groupid,
      },
    })
    .catch((err) => {
      console.error(err);
      throw createError(500, 'Database operation failed.');
    });

  if (!groupMapInfo) {
      throw createError(404, 'Group not found.');
  }

  return groupMapInfo;

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
export async function isInGroup(userid: number, groupid: number) {

  // Validate parameters.
  if (isNaN(userid) || isNaN(groupid)) {
    throw createError(500, 'Invalid parameters.');
  }

  const groupMapInfo = await getRepository(GroupMap)
    .findOne({
      where: {
        userid,
        groupid,
      },
    })
    .catch((err) => {
      console.error(err);
      throw createError(500, 'Database operation failed.');
    });

  if (groupMapInfo && (groupMapInfo.privilege & GroupMemberPrivilege.isMember)) {
    return true;
  } else {
    return false;
  }

}

export async function addToGroup(userid: number, groupid: number, privilege: number) {

  // Validate parameters.
  if (!(userid && !groupid)) {
    throw createError(500, 'Invalid parameters.');
  }

  const groupMap = new GroupMap();

  groupMap.userid = userid;
  groupMap.groupid = groupid;
  groupMap.privilege = privilege;

  await getRepository(GroupMap)
    .persist(groupMap)
    .catch((err) => {
      console.error(err);
      throw createError(500, 'Database operation failed.');
    });

  return groupMap;

}

// Create or update group.
export async function postGroup(data: Group, userid: number) {

  // Validate parameters.
  if (!(data.name && userid)) {
    throw createError(500, 'Invalid parameters.');
  }

  const group = new Group();

  group.name = data.name;
  group.description = data.description;
  group.owner = userid;

  await getRepository(Group)
    .persist(group)
    .catch((err) => {
      console.error(err);
      if (err.errno === 1062) {
        throw createError(400, 'Group name taken.');
      }
      throw createError (500, 'Database operation failed.');
    });

  return group;

}
