/* /src/init/privilege.ts */

import * as createError from 'http-errors';

import { Group } from './../entities/group';
import { User } from './../entities/user';
import { getGroupMemberInfo } from './../models/group';

export const enum ArticleOption {
  isSticky = 1,
  isBulletin = 2,
}

export const enum ArticleType {
  global = 0,
  problemDiscussion = 1,
  problemSolution = 2,  // problemSolution needs to be binded with sourcecode.
  contestDiscussion = 3,
}

export const enum ArticlePrivilege {
  comment = 1,
  write = 2,
  read = 4,
}

export const enum CommentOption {
  isPrivate = 1,
}

export const enum ContestPrivilege {
  join = 1,
  write = 2,
  read = 4,
}

export const enum GroupPrivilege {
  isVisible = 1,
}

export const enum GroupMemberPrivilege {
  isMember = 1,
  editInfo = 2,
  editUser = 4,
}

export const enum ProblemPrivilege {
  submit = 1,
  write = 2,
  read = 4,
}

export const enum PrivilegeLevel {
  world = 1,
  group = 2,
  owner = 4,
}

export const enum UserPrivilege {
  isEnabled = 1,
  readEverything = 2,
  editContent = 4,
  editUser = 8,
  editGroup = 16,
  editSystem = 32,
}

// Check privilege (bitwise).
export async function checkPrivilege(operation: number, privilege: number) {
  return (operation & privilege) === 0 ? false : true;
}

export async function getPrivilegeLevel(owner: User, group: Group | undefined, user: User | undefined) {

  if (!owner) {
    throw createError(500, 'Invalid parameters.');
  }

  let privilegeLevel: number = PrivilegeLevel.world;

  if (user) {
    if (user.id === owner.id) {
      privilegeLevel += PrivilegeLevel.owner;
    }
    if (group && getGroupMemberInfo(user, group)) {
      privilegeLevel += PrivilegeLevel.group;
    }
  }

  return privilegeLevel;

}

// Verify content privilege.
export async function checkContentPrivilege(
  operation: number,
  user: User | undefined,
  contentInfo: {
    owner: User,
    group: Group | undefined,
    ownerPrivilege: number,
    groupPrivilege: number,
    worldPrivilege: number,
  },
) {

  // Validate parameters.
  if (
    typeof operation !== 'number' ||
    (user !== undefined && typeof user !== 'object') ||
    typeof contentInfo.owner !== 'object' ||
    (contentInfo.group && typeof contentInfo.group !== 'object') ||
    typeof contentInfo.ownerPrivilege !== 'number' ||
    typeof contentInfo.groupPrivilege !== 'number' ||
    typeof contentInfo.worldPrivilege !== 'number'
  ) {
    throw createError(500, 'Invalid parameters.');
  }

  let actualPrivilege = contentInfo.worldPrivilege;

  if (user) {
    if (user.id === contentInfo.owner.id) {
      // If user is the problem owner.
      actualPrivilege = contentInfo.ownerPrivilege;
    } else if (contentInfo.group && getGroupMemberInfo(user, contentInfo.group)) {
      // If user belongs to the problem owner group.
      actualPrivilege = contentInfo.groupPrivilege;
    }
  }

  return checkPrivilege(operation, actualPrivilege);

}
