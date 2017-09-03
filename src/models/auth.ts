/* /src/models/auth.ts */

import * as createError from 'http-errors';
import * as jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';

import { User } from './../entities/user';
import { config } from './../init/config';
import { UserPrivilege } from './../init/privilege';

export async function getUserInfoWithAuth(data: string, retrievedPassword: string) {

  // Validate parameters.
  if (!(retrievedPassword && data)) {
    throw createError(500, 'Invalid parameters.');
  }

  const userRepository = getRepository(User);
  const userInfo = await userRepository
    .createQueryBuilder('user')
    .where('user.username = :data')
    .orWhere('user.email = :data')
    .setParameter('data', data)
    .getOne()
    .catch((err) => {
      console.error(err);
      throw createError(500, 'Database operation failed.');
    });

  if (!userInfo) {
    // For security purposes, return 'Incorrect username or password.'.
    throw createError(403, 'Incorrect username or password.');
  }

  if (!(userInfo.privilege & UserPrivilege.isEnabled)) {
    throw createError(403, 'User is disabled.');
  }

  if (!userInfo.verifyPassword(retrievedPassword)) {
    throw createError(403, 'Incorrect username or password.');
  }

  return userInfo;

}

export async function generateToken(userid: number, username: string, email: string, privilege: number) {

  // Validate parameters.
  if (!(username && email) || isNaN(userid) || isNaN(privilege)) {
    throw createError(500, 'Invalid parameters');
  }

  if (!config.api.jwt.secret || typeof(config.api.jwt.secret) !== 'string') {
    throw createError(500, 'Invalid jwt secret.');
  }

  // Sign jwt token.
  const accessToken = jwt.sign({
    id: userid,
    username,
    email,
    privilege,
  }, config.api.jwt.secret, {
    expiresIn: config.api.jwt.expire_time,
  });

  return accessToken;

}
