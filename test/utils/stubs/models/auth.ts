/* /test/utils/stubs/models/auth.ts
  Fake auth model functions for testing. */

import { User } from './../../../../src/entities/user';
import * as Utils from './../../utils';

export function fakevalidateUserCredential(username: string, password: string) {

  if (!(username && password)) {
    throw new Error('Invalid parameters.');
  }

  if (username === 'zk' && password === 'CorrectPassword') {
    return Utils.getUserInstance();
  } else {
    return undefined;
  }

}

export function fakeGenerateToken(user: User) {
  if (typeof user !== 'object') {
    throw new Error('Invalid parameters');
  } else {
    return 'ValidToken';
  }
}
