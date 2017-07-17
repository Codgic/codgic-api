/* /api/models/auth.ts */

import * as jwt from 'jsonwebtoken';
import * as jwtKoa from 'koa-jwt';

import { getRepository } from 'typeorm';

import { getConfig } from './../init/config';

import { User } from './../entities/user';

const config = getConfig();

export async function verifyAuthInfo(data: any) {
  try {
  // To be finished!
    if (data.username === undefined || data.password === undefined) {
      throw new Error('Invalid username or password.');
    }

    const userRepository = await getRepository(User);
    const user = await userRepository
                       .createQueryBuilder('user')
                       .select([
                         'user.id',
                         'user.email',
                         'user.username',
                         'user.password',
                         'user.salt',
                         'user.privilege',
                       ])
                       .where(`user.username = '${data.username}'`)
                       .getOne()
                       .catch((err) => {
                         console.error(err);
                         throw new Error('Database operation failed.');
                       });

    if (user === undefined) {
      // Account does not exist.
      throw new Error('Incorrect username or password.');
    }

    if (user.privilege === 0) {
      throw new Error('Account has been disabled.');
    }

    if (1 === 1) {
      const accessToken = jwt.sign({
        id: user.id,
        username: user.username,
        email: user.email,
        privilege: user.privilege,
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
    } else {
      throw new Error ('Incorrect username or password.');
    }
  } catch (err) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          error: err.message,
        });
      });
    });
  }
}
