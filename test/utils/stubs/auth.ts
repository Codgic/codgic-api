/* /test/utils/stubs/auth.ts
  Fake model functions for testing. */

export function fakeGetUserInfoWithAuth(username: string, password: string) {
  if (!(username && password)) {
    throw new Error('Invalid parameters.');
  } else {
    // We don't have to test error throwing situations here.
    // Controller doesn't handdle them, errorHandler does.
    return {
      id: 1,
      email: 'fuckzk@codgi.cc',
      username: 'zk',
      privilege: 1,
    };
  }
}

export function fakeGenerateToken(userid: number, username: string, email: string, privilege: number) {
  if (!(userid && username && email && privilege)) {
    throw new Error('Invalid parameters');
  } else {
    return 'ValidToken';
  }
}
