/* /api/models/user.ts */

import * as crypto from 'crypto';
import * as emailValidator from 'email-validator';

import { getRepository } from 'typeorm';

import { getConfig } from './../init/config';

import { User } from './../entities/user';

const config = getConfig();

export async function getUserInfo(username: string) {
  try {
    if (!username) {
      throw new Error('Username can not be blank.');
    }

    const userRepository = await getRepository(User);
    const userInfo = await userRepository
                            .createQueryBuilder('user')
                            .select([
                              'user.id',
                              'user.email',
                              'user.username',
                              'user.nickname',
                              'user.sex',
                              'user.motto',
                              'user.description',
                              'user.privilege',
                              'user.createdAt',
                              'user.updatedAt',
                              ])
                            .where(`user.username = '${username}'`)
                            .getOne();

    return new Promise((resolve) => {
      setTimeout(() => {
      resolve(userInfo);
    });
  });
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

export async function getCurrentInfo() {
  const userRepository = await getRepository(User);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('Coming Soon!');
    });
  });
}

export async function searchUser(query: string, page: number = 1, num: number = config.oj.default.page.user) {
  try {
    if (page < 1 || num < 1) {
      throw new Error('Invalid request.');
    }

    if (!query) {
      throw new Error('Keyword can not be blank.');
    }

    const firstResult = (page - 1) * num;
    const userRepository = await getRepository(User);
    const userInfo = await userRepository
                            .createQueryBuilder('user')
                            .select([
                              'user.id',
                              'user.email',
                              'user.username',
                              'user.nickname',
                              'user.sex',
                              'user.privilege',
                              ])
                            .where(`user.username LIKE ${query}`)
                            .orWhere(`user.email LIKE ${query}`)
                            .orWhere(`user.nickname LIKE ${query}`)
                            .getOne();

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(userInfo);
      });
    });
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

export async function signUp(data: any) {
  try {
    // Verify data
    if (!data.email || !data.username || !data.password) {
      throw new Error('Required fields can not be blank. ');
    }
    if (!emailValidator.validate("test@email.com")) {
      throw new Error('Invalid email.');
    }

    const user = new User();

    // Generate salt
    crypto.randomBytes(256, (err, buf) => {
      if (err) {
        console.error(err);
        throw new Error('Failed to generate salt.');
      } else {
        user.salt = buf.toString();
      }
    });

    // Generate password
    user.password = crypto
                    .createHash('sha256')
                    .update(data.password + user.salt)
                    .toString();
    
    user.email = data.email;
    user.username = data.username;
    user.nickname = data.nickname;
    user.sex = data.sex;
    user.motto = data.motto;
    user.description = data.description;

    const userRepository = await getRepository(User);

    await userRepository
          .persist(user)
          .catch((err) => {
            console.error(err);
            throw new Error('Database operation failure.');
          });

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(user);
      });
    });

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
