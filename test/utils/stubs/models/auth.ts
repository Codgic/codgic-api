/* /test/utils/stubs/models/auth.ts
  Fake auth model functions for testing. */

export function fakevalidateUserCredential(username: string, password: string) {
  if (!(username && password)) {
    throw new Error('Invalid parameters.');
  }
  // We don't have to test error throwing situations here.
  // Controller doesn't handdle them, middleware errorHandler does.

  if (username === 'zk' && password === 'CorrectPassword') {
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

export function fakeGenerateToken(userid: number, username: string, email: string, privilege: number) {
  if (!(userid && username && email && privilege)) {
    throw new Error('Invalid parameters');
  } else {
    return 'ValidToken';
  }
}
