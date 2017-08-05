/* /api/models/group.ts */

import * as Koa from 'koa';

import { getRepository } from 'typeorm';

import { getConfig } from './../init/config';

import { Group } from './../entities/group';
import { GroupMap } from './../entities/group_map';

import { GroupMemberPrivilege } from './../init/privilege';

const config = getConfig();

export async function getGroupInfo(groupid: number) {
  try {
    if (!groupid) {
      throw new Error('Invalid request.');
    }

    const groupRepository = getRepository(Group);
    const groupInfo = await groupRepository
                      .createQueryBuilder('group')
                      .where(`id = '${groupid}'`)
                      .getOne()
                      .catch((err) => {
                        console.error(err);
                        throw new Error('Database operation failed.');
                      });

    if (!groupInfo) {
      throw new Error('Group does not exist.');
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(groupInfo);
      });
    });
  } catch (err) {
    return new Promise((reject) => {
      setTimeout(() => {
        reject({
          error: err.message,
        });
      });
    });
  }
}

export async function getGroupMembers(groupid: number) {
  try {
    if (!groupid) {
      throw new Error('Invalid request.');
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
      throw new Error('Group does not exist.');
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(groupMapInfo);
      });
    });

  } catch (err) {
    return new Promise((reject) => {
      setTimeout(() => {
        reject({
          error: err.message,
        });
      });
    });
  }
}

export async function searchGroup(
  sort: 'id' | 'name' | 'createdAt' | 'updatedAt' = 'id',
  order: 'ASC' | 'DESC'  = 'ASC',
  keyword: string,
  page: number = 1,
  num: number = config.oj.default.page.group) {
  try {
    if (page < 1 || num < 1) {
      throw new Error('Invalid request.');
    }
    if (!keyword) {
      throw new Error('Keyword can not be blank.');
    }

    const firstResult = (page - 1) * num;
    const groupRepository = await getRepository(Group);
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

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(searchResult);
      });
    });
  } catch (err) {
    return new Promise((reject) => {
      setTimeout(() => {
        reject({
          error: err.message,
        });
      });
    });
  }
}

// Judge whether user is in group.
export async function isInGroup(userid: number, groupid: number) {
  try {
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

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(result);
      });
    });
  } catch (err) {
    return new Promise((reject) => {
      setTimeout(() => {
        reject({
          error: err.message,
        });
      });
    });
  }
}

export async function addToGroup(userid: number, groupid: number, privilege: number) {
  try {
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

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(groupMap);
      });
    });
  } catch (err) {
    return new Promise((reject) => {
      setTimeout(() => {
        reject({
          error: err.message,
        });
      });
    });
  }
}

// Create or update group.
export async function postGroup(data: Group, userid: number) {
  try {
    if (!data.name || !userid) {
      throw new Error('Invalid request.');
    }

    const group = new Group();

    group.name = data.name;
    group.description = data.description;
    group.owner = userid;

    const groupRepository = await getRepository(Group);

    await groupRepository
          .persist(group)
          .catch((err) => {
            console.error(err);
            if (err.errno === 1062) {
              throw new Error('Group name taken.');
            }
            throw new Error ('Database operation failed.');
          });

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(group);
      });
    });

  } catch (err) {
    return new Promise((reject) => {
      setTimeout(() => {
        reject({
          error: err.message,
        });
      });
    });
  }
}
