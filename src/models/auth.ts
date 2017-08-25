/* /src/models/auth.ts */

import * as createError from 'http-errors';
import * as jwt from 'jsonwebtoken';
import * as jwtKoa from 'koa-jwt';
import { getRepository } from 'typeorm';

import { User } from './../entities/user';
import { config } from './../init/config';
import { UserPrivilege } from './../init/privilege';

export async function getUserInfoWithAuth(retrievedPassword: string, username: string) {

  // Validate parameters.
  if (!(retrievedPassword && username)) {
    throw new Error('Invalid parameters.');
  }

  const userRepository = getRepository(User);
  const userInfo = await userRepository
                          .createQueryBuilder('user')
                          .where(`user.username = '${username}'`)
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
  if (!(userid && username && email && privilege)) {
    throw createError(500, 'Invalid parameters');
  }

  // Sign jwt token.
  const accessToken = await jwt.sign({
    email: `${email}`,
    id: userid,
    privilege: `${privilege}`,
    username: `${username}`,
  }, config.api.jwt.secret, {
    expiresIn: config.api.jwt.expire_time,
  });

  return accessToken;

}
