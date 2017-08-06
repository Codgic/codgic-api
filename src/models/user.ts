/* /api/models/user.ts */

import * as emailValidator from 'email-validator';
import { getRepository } from 'typeorm';

import { User } from './../entities/user';
import { getConfig } from './../init/config';
import { UserPrivilege } from './../init/privilege';

const config = getConfig();

export async function getUserInfo(username: string) {

  // Validate parameters.
  if (!username) {
    throw new Error('Invalid parameters.');
  }

  const userRepository = getRepository(User);
  const userInfo = await userRepository
                .createQueryBuilder('user')
                .where(`user.username = '${username}'`)
                .getOne()
                .catch((err) => {
                  console.error(err);
                  throw new Error('Database operation failed.');
                });

  if (!userInfo) {
    throw new Error('User not found.');
  }

  return userInfo;

}

export async function searchUser(
  sort: 'id' | 'username' | 'createdAt' = 'id',
  order: 'ASC' | 'DESC'  = 'ASC',
  keyword: string,
  page: number = 1,
  num: number = config.oj.default.page.user) {

  // Validate parameters.
  if (page < 1 || num < 1 || !keyword) {
    throw new Error('Invalid parameters.');
  }

  const firstResult = (page - 1) * num;
  const userRepository = getRepository(User);
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

  if (!userInfo) {
    throw new Error('No matching result.');
  }

  return userInfo;

}

export async function signUp(data: any) {

  // Verify parameters.
  if (!data.email || !data.username || !data.password) {
    throw new Error('Invalid parameters.');
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

  return user;

}

export async function validateUserInfo(data: any) {

  if (!data.username) {
    throw new Error('Invalid username');
  }

  if (
    config.oj.policy.signup.username.min_length &&
    data.username.length < config.oj.policy.signup.username.min_length
  ) {
    throw new Error('Username too short.');
  }

  // Complexity Check: To be implemented.

  if (
    config.oj.policy.signup.password.max_length &&
    data.password.length > config.oj.policy.signup.password.max_length
  ) {
    throw new Error('Password too long.');
  }

  if (
    config.oj.policy.signup.nickname.min_length &&
    data.nickname.length < config.oj.policy.signup.nickname.min_length
  ) {
    throw new Error('Nickname too short.');
  }

  if (
    config.oj.policy.signup.nickname.max_length &&
    data.nickname.length > config.oj.policy.signup.nickname.max_length
  ) {
    throw new Error('Nickname too long.');
  }

  if (!data.email || !emailValidator.validate(data.email)) {
    throw new Error('Invalid email.');
  }

  return true;

}
