/* /init/error.ts
  Determine error code according to error message. */

export function getHttpStatusCode(err: string) {

  switch (err) {
    case 'Group name taken.':
    case 'Invalid email.':
    case 'Invalid password.':
    case 'Invalid username.':
    case 'Nickname too long.':
    case 'Nickname too short.':
    case 'Password too long.':
    case 'Password too short.':
    case 'Username or email taken.':
    case 'Username too long.':
    case 'Username too short.':
      return 400;

    case 'Incorrect username or password.':
    case 'User is disabled.':
      return 403;

    case 'Group not found.':
    case 'No matching result.':
    case 'Problem not found':
    case 'User not found.':
      return 404;

    default:
      return 500;
  }

}
