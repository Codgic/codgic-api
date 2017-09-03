/* /src/init/privilege.ts */

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
  downloadData = 8,
  uploadData = 16,
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

export function checkPrivilege(operationPrivilege: number, userPrivilege: number) {
  return (userPrivilege & operationPrivilege) === 1 ? true : false;
}
