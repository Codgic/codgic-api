/* /api/models/user.ts */

import * as emailValidator from 'email-validator';

import { getRepository } from 'typeorm';

import { getConfig } from './../init/config';

import { UserPrivilege } from './../init/privilege';

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
                            .where(`user.username = '${username}'`)
                            .getOne()
                            .catch((err) => {
                              console.error(err);
                              throw new Error('Database operation failed.');
                            });

    if (!userInfo) {
      throw new Error('User does not exist.');
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

export async function getUserAuthInfo(username: string) {
  try {
    if (!username) {
      throw new Error('Username can not be blank.');
    }

    const userRepository = await getRepository(User);
    const userAuthInfo = await userRepository
                            .createQueryBuilder('user')
                            .select([
                              'user.id',
                              'user.password',
                              'user.salt',
                              ])
                            .where(`user.username = '${username}'`)
                            .orWhere(`user.email = '${username}'`)
                            .getOne()
                            .catch((err) => {
                              console.error(err);
                              throw new Error('Database operation failed.');
                            });

    return new Promise((resolve) => {
      setTimeout(() => {
      resolve(userAuthInfo);
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

export async function searchUser(
  sort: 'id' | 'username' | 'createdAt' = 'id',
  order: 'ASC' | 'DESC'  = 'ASC',
  keyword: string,
  page: number = 1,
  num: number = config.oj.default.page.user) {
  try {
    if (page < 1 || num < 1) {
      throw new Error('Invalid request.');
    }
    if (!keyword) {
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
                            .where(`user.username LIKE '%${keyword}%'`)
                            .orWhere(`user.email LIKE '%${keyword}%'`)
                            .orWhere(`user.nickname LIKE '%${keyword}%'`)
                            .setFirstResult(firstResult)
                            .setMaxResults(num)
                            .orderBy(`user.${sort}`, order)
                            .getMany()
                            .catch((err) => {
                              console.error(err);
                              throw new Error('Database operation failed.');
                            });

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

export async function signUp(data: any) {
  try {
    // Verify data
    if (!data.email || !data.username || !data.password) {
      throw new Error('Required fields can not be blank. ');
    }
    if (!emailValidator.validate(data.email)) {
      throw new Error('Invalid email.');
    }

    const user = new User();

    // Update passeord.
    user
      .updatePassword(data.password)
      .catch((err) => {
        console.error(err);
        throw new Error('Update user password failed.');
      });

    user.email = data.email;
    user.username = data.username;
    user.nickname = data.nickname;
    user.sex = data.sex;
    user.motto = data.motto;
    user.description = data.description;
    user.privilege = UserPrivilege.isEnabled;

    if (config.oj.policy.signup.need_confirmation) {
      user.privilege = 0;
    }

    const userRepository = await getRepository(User);

    await userRepository
          .persist(user)
          .catch((err) => {
            console.error(err);
            if (err.errno === 1062) {
              throw new Error('Username or email taken.');
            }
            throw new Error('Database operation failed.');
          });

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(user);
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
