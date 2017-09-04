/* /src/init/privilege.ts */

import * as createError from 'http-errors';
import { isInGroup } from './../models/group';

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

export const enum UserPrivilege {
  isEnabled = 1,
  emailVerified = 2,
  viewSource = 4,
  editContent = 8,
  editUser = 16,
  editGroup = 32,
  editSystem = 64,
}

export async function checkPrivilege(operation: number, privilege: number) {
  return (operation & privilege) === 0 ? false : true;
}

// Verify problem privilege.
export async function checkContentPrivilege(
  operation: number,
  userid: number | undefined,
  userPrivilege: number,
  contentPrivilegeInfo: {
    owner: number,
    group: number,
    ownerPrivilege: number,
    groupPrivilege: number,
    worldPrivilege: number,
}) {

  // Validate parameters.
  if (!(
    operation &&
    contentPrivilegeInfo.owner &&
    contentPrivilegeInfo.group &&
    contentPrivilegeInfo.ownerPrivilege &&
    contentPrivilegeInfo.groupPrivilege &&
    contentPrivilegeInfo.worldPrivilege)
  ) {
    throw createError(500, 'Invalid parameters.');
  }

  let result: boolean = false;

  if (userid) {
    if (userPrivilege & operation) {
      // Check user's admin privilege first.
      result = true;
    } else if (userid === contentPrivilegeInfo.owner) {
      // If user is the problem owner.
      result = (contentPrivilegeInfo.ownerPrivilege & operation) === 0 ? false : true;
    } else if (isInGroup(userid, contentPrivilegeInfo.group)) {
      // If user belongs to the problem owner group.
      result = (contentPrivilegeInfo.groupPrivilege & operation) === 0 ? false : true;
    } else {
      result = (contentPrivilegeInfo.worldPrivilege & operation) === 0 ? false : true;
    }
  } else {
    result = (contentPrivilegeInfo.worldPrivilege & operation) === 0 ? false : true;
  }

  return result;

}
