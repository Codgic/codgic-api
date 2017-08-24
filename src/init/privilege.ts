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
  viewSource = 2,
  editContent = 4,
  editUser = 8,
  editGroup = 16,
}
