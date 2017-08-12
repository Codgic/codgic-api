/* /api/models/group.ts */

import * as Koa from 'koa';
import { getRepository } from 'typeorm';

import { Group } from './../entities/group';
import { GroupMap } from './../entities/group_map';
import { config } from './../init/config';
import { GroupMemberPrivilege } from './../init/privilege';

export async function getGroupInfo(groupid: number) {

  // Validate parameters.
  if (!groupid) {
    throw new Error('Invalid parameters.');
  }

  const groupRepository = getRepository(Group);
  const groupInfo = await groupRepository
                        .createQueryBuilder('group')
                        .where(`id = ${groupid}`)
                        .getOne()
                        .catch((err) => {
                          console.error(err);
                          throw new Error('Database operation failed.');
                        });

  if (!groupInfo) {
    throw new Error('Group not found.');
  }

  return groupInfo;

}

export async function getGroupMembers(groupid: number) {

  // Validate parameters.
  if (!groupid) {
    throw new Error('Invalid parameters.');
  }

  const groupMapRepository = getRepository(GroupMap);
  const groupMapInfo = await groupMapRepository
                            .createQueryBuilder('group')
                            .where(`id = ${groupid}`)
                        .getMany()
                        .catch((err) => {
                          console.error(err);
                          throw new Error('Database operation failed.');
                        });

  if (!groupMapInfo) {
      throw new Error('Group not found.');
    }

  return groupMapInfo;

}

export async function searchGroup(
  sort: 'id' | 'name' | 'createdAt' | 'updatedAt' = 'id',
  order: 'ASC' | 'DESC'  = 'ASC',
  keyword: string,
  page: number = 1,
  num: number = config.oj.default.page.group) {

  // Validate parameters.
  if (page < 1 || num < 1 || !keyword) {
    throw new Error('Invalid parameters.');
  }

  const firstResult = (page - 1) * num;
  const groupRepository = getRepository(Group);
  const searchResult = await groupRepository
                              .createQueryBuilder('group')
                              .where(`problem.name LIKE '%${keyword}%'`)
                              .orWhere(`problem.description LIKE '%${keyword}%'`)
                              .setFirstResult(firstResult)
                              .setMaxResults(num)
                              .orderBy(`problem.${sort}`, order)
                              .getMany()
                              .catch((err) => {
                                console.error(err);
                                throw new Error('Database operation failed.');
                              });

  if (!searchResult) {
    throw new Error('No matching result.');
  }

  return searchResult;

}

// Judge whether user is in group.
export async function isInGroup(userid: number, groupid: number) {

  // Validate parameters.
  if (!userid || !groupid) {
    throw new Error('Invalid request.');
  }

  const groupMapRepository = getRepository(GroupMap);
  const groupMapInfo: any = await groupMapRepository
                                  .createQueryBuilder('group_map')
                                  .where(`userid = ${userid}`)
                                  .andWhere(`groupid = ${groupid}`)
                                  .getOne()
                                  .catch((err) => {
                                    console.error(err);
                                    throw new Error('Database operation failed.');
                                  });

  let result: boolean = false;
  if (groupMapInfo && (groupMapInfo.privilege & GroupMemberPrivilege.isMember)) {
    result = true;
  }

  return result;

}

export async function addToGroup(userid: number, groupid: number, privilege: number) {

  // Validate parameters.
  if (!userid || !groupid) {
      throw new Error('Invalid request.');
    }

  const groupMap = new GroupMap();

  groupMap.userid = userid;
  groupMap.groupid = groupid;
  groupMap.privilege = privilege;

  const groupMapRepository = getRepository(GroupMap);

  await groupMapRepository
          .persist(groupMap)
          .catch((err) => {
            console.error(err);
            throw new Error('Database operation failed.');
          });

  return groupMap;

}

// Create or update group.
export async function postGroup(data: Group, userid: number) {

  // Validate parameters.
  if (!data.name || !userid) {
    throw new Error('Invalid request.');
  }

  const group = new Group();

  group.name = data.name;
  group.description = data.description;
  group.owner = userid;

  const groupRepository = getRepository(Group);

  await groupRepository
          .persist(group)
          .catch((err) => {
            console.error(err);
            if (err.errno === 1062) {
              throw new Error('Group name taken.');
            }
            throw new Error ('Database operation failed.');
          });

  return group;

}
