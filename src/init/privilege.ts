/* /src/init/privilege.ts */

import * as createError from 'http-errors';
import { isInGroup } from './../models/group';

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
  viewHidden = 2,
  editContent = 4,
  editUser = 8,
  editGroup = 16,
  editSystem = 32,
}

// Check privilege (bitwise).
export async function checkPrivilege(operation: number, privilege: number) {
  return (operation & privilege) === 0 ? false : true;
}

export async function getPrivilegeLevel(owner: number, group: number, userid: number) {

  if (!(owner && group)) {
    throw createError(500, 'Invalid parameters.');
  }

  let privilegeLevel: number = PrivilegeLevel.world;

  if (userid) {
    if (userid === owner) {
      privilegeLevel += PrivilegeLevel.owner;
    }
    if (isInGroup(userid, group)) {
      privilegeLevel += PrivilegeLevel.group;
    }
  }

  return privilegeLevel;

}

// Verify content privilege.
export async function checkContentPrivilege(
  operation: number,
  userid: number | undefined,
  contentInfo: {
    owner: number,
    group: number,
    ownerPrivilege: number,
    groupPrivilege: number,
    worldPrivilege: number,
  },
) {

  // Validate parameters.
  if (!(
    operation &&
    contentInfo.owner &&
    contentInfo.group &&
    contentInfo.ownerPrivilege &&
    contentInfo.groupPrivilege &&
    contentInfo.worldPrivilege)
  ) {
    throw createError(500, 'Invalid parameters.');
  }

  let actualPrivilege = contentInfo.worldPrivilege;

  if (userid) {
    if (userid === contentInfo.owner) {
      // If user is the problem owner.
      actualPrivilege = contentInfo.ownerPrivilege;
    } else if (isInGroup(userid, contentInfo.group)) {
      // If user belongs to the problem owner group.
      actualPrivilege = contentInfo.groupPrivilege;
    }
  }

  return checkPrivilege(operation, actualPrivilege);

}
