/* /api/models/group.ts */

import * as Koa from 'koa';

import { getRepository } from 'typeorm';

import { getConfig } from './../init/config';

import { Group } from './../entities/group';
import { GroupMap } from './../entities/group_map';

const config = getConfig();

// Judge whether user is in group.
export async function isInGroup(userid: number, groupid: number) {
  try {
    if (!userid || !groupid) {
      throw new Error('Invalid request.');
    }

    const groupMapRepository = getRepository(GroupMap);
    const groupMapInfo = groupMapRepository
                          .createQueryBuilder('group_map')
                          .where(`userid = ${userid}`)
                          .andWhere(`groupid = ${groupid}`)
                          .getOne()
                          .catch((err) => {
                            console.error(err);
                            throw new Error('Database operation failed.');
                          });

    let result: boolean = false;
    if (groupMapInfo) {
      result = true;
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(result);
      });
    });
  } catch (err) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
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
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
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
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          error: err.message,
        });
      });
    });
  }
}
