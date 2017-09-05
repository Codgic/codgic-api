/* /test/utils/stubs/models/user.ts
  Fake user model functions for testing. */

export function fakeGetUserInfo(data: number | string, by: 'id' | 'username' | 'email' = 'id') {
  if (!data || (by !== 'id' && by !== 'username' && by !== 'email')) {
    throw new Error('Invalid parameters.');
  }

  if (
    (data === 'zk' && by === 'username') ||
    (data === 1 && by === 'id') ||
    (data === 'fuckzk@codgi.cc' && by === 'email')
  ) {
    return {
      id: 1,
      email: 'fuckzk@codgi.cc',
      username: 'zk',
      privilege: 1,
    };
  } else {
    return undefined;
  }
}
