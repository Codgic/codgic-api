// User privileges

export const enum UserPrivilege {
  enabled = 1,
  source = 2,
  content = 4,
  user = 8,
}

export const enum ProblemPrivilege {
  submit = 1,
  write = 2,
  read = 4,
  downloadData = 8,
  uploadData = 16,
}
