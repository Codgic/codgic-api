/* /api/models/auth.ts */

import * as jwt from 'jsonwebtoken';
import * as jwtKoa from 'koa-jwt';

import { getRepository } from 'typeorm';

import { getConfig } from './../init/config';

import { UserPrivilege } from './../init/privilege';

import { User } from './../entities/user';

const config = getConfig();

export async function getUserInfoWithAuth(retrievedPassword: string, username: string) {
  try {
    if (!retrievedPassword || !username) {
      throw new Error('Invalid requst.');
    }

    const userRepository = await getRepository(User);
    const userInfo = await userRepository
                          .createQueryBuilder('user')
                          .where(`user.username = '${username}'`)
                          .getOne()
                          .catch((err) => {
                            console.error(err);
                            throw new Error('Database operation failed.');
                          });

    if (!userInfo) {
      throw new Error('User does not exist.');
    }

    if (!(userInfo.privilege & UserPrivilege.isEnabled)) {
      throw new Error('User is disabled.');
    }

    if (!userInfo.verifyPassword(retrievedPassword)) {
      throw new Error('Incorrect username or password.');
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(userInfo);
      });
    });

  } catch (err) {
    return new Promise((reject) => {
      setTimeout(() => {
        reject({
          error: err.message,
        });
      });
    });
  }
}

export async function generateToken(userid: number, username: string, email: string, privilege: number) {
  try {

    // Sign jwt token.
    const accessToken = jwt.sign({
      id: userid,
      email: `${email}`,
      username: `${username}`,
      privilege: `${privilege}`,
    }, config.api.jwt.secret, {
      expiresIn: config.api.jwt.expire_time,
    });

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          token: accessToken,
        });
      });
    });

  } catch (err) {
    return new Promise((reject) => {
      setTimeout(() => {
        reject({
          error: err.message,
        });
      });
    });
  }
}
