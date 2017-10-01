/* /src/models/auth.ts */

import * as createError from 'http-errors';
import * as jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';

import { User } from './../entities/user';
import { UserCredential } from './../entities/user_credential';
import { config } from './../init/config';
import { UserPrivilege } from './../init/privilege';

export async function validateUserCredential(data: string, retrievedPassword: string) {

  // Validate parameters.
  if (!data || typeof data !== 'string' || !retrievedPassword || typeof retrievedPassword !== 'string') {
    throw createError(500, 'Invalid parameters.');
  }

  const userCredentialInfo = await getRepository(UserCredential)
    .createQueryBuilder('user_credential')
    .innerJoinAndSelect('user_credential.user', 'user', 'user.email = :data OR user.username = :data')
    .setParameter('data', data)
    .getOne()
    .catch((err) => {
      console.error(err);
      throw createError(500, 'Database operation failed.');
    });

  if (!userCredentialInfo) {
    // For security purposes, return 'Incorrect username or password.'.
    throw createError(403, 'Incorrect username or password.');
  }

  if (!(userCredentialInfo.user.privilege & UserPrivilege.isEnabled)) {
    throw createError(403, 'User is disabled.');
  }

  if (!await userCredentialInfo.verifyPassword(retrievedPassword)) {
    throw createError(403, 'Incorrect username or password.');
  }

  const userInfo: User = userCredentialInfo.user;

  return userInfo;

}

export async function generateToken(user: User) {

  // Validate parameters.
  if (!user || typeof user !== 'object') {
    throw createError(500, 'Invalid parameters');
  }

  if (!config.api.jwt.secret || typeof config.api.jwt.secret !== 'string') {
    throw createError(500, 'Invalid jwt secret.');
  }

  // Sign jwt token.
  const accessToken = jwt.sign({
    id: user.id,
    username: user.username,
    email: user.email,
    privilege: user.privilege,
  }, config.api.jwt.secret, {
    expiresIn: config.api.jwt.expire_time,
  });

  return accessToken;

}
