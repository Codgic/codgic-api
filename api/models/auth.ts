/* /api/models/auth.ts */

import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import * as jwtKoa from 'koa-jwt';

import { getRepository } from 'typeorm';

import { getConfig } from './../init/config';

import { UserPrivilege } from './../init/privilege';

import { User } from './../entities/user';

const config = getConfig();

export async function verifyAuthInfo(data: any) {
  try {
    if (!data.username || !data.password) {
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
                       .orWhere(`user.email = '${data.username}'`)
                       .getOne()
                       .catch((err) => {
                         console.error(err);
                         throw new Error('Database operation failed.');
                       });

    if (!user) {
      // Account does not exist.
      throw new Error('Incorrect username or password.');
    }

    if (!(user.privilege & UserPrivilege.enabled)) {
      throw new Error('Account has been disabled.');
    }

    const retrievedPassword = crypto
                              .createHash('sha512')
                              .update(data.password + user.salt)
                              .digest('hex');

    if (retrievedPassword === user.password) {
      const accessToken = jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username,
        privilege: user.privilege,
      }, config.api.jwt.secret, {
        expiresIn: config.api.jwt.expire_time,
      }, (err) => {
        console.error(err);
        throw new Error('Failed to generate token.');
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
