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

  let result: boolean = false;

  if (userid) {
    if (userid === contentInfo.owner) {
      // If user is the problem owner.
      result = (contentInfo.ownerPrivilege & operation) === 0 ? false : true;
    } else if (isInGroup(userid, contentInfo.group)) {
      // If user belongs to the problem owner group.
      result = (contentInfo.groupPrivilege & operation) === 0 ? false : true;
    } else {
      result = (contentInfo.worldPrivilege & operation) === 0 ? false : true;
    }
  } else {
    result = (contentInfo.worldPrivilege & operation) === 0 ? false : true;
  }

  return result;

}
