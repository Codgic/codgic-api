/* /src/models/user.ts */

import * as emailValidator from 'email-validator';
import * as createError from 'http-errors';
import { getRepository } from 'typeorm';

import { User } from './../entities/user';
import { config } from './../init/config';
import { UserPrivilege } from './../init/privilege';

export async function getUserInfo(data: number | string, by: 'id' | 'username' = 'id') {

  // Validate parameters.
  if (!(data && by) || (by !== 'id' && by !== 'username')) {
    throw createError(500, 'Invalid parameters.');
  }

  const userRepository = getRepository(User);
  const userInfo = await userRepository
    .findOne({
      where: {
        [by]: data,
      },
    })
    .catch((err) => {
      console.error(err);
      throw createError(500, 'Database operation failed.');
    });

  if (!userInfo) {
    throw createError(404, 'User not found.');
  }

  return userInfo;

}

export async function getUserList(
  orderBy: 'id' | 'username' | 'createdAt' = 'id',
  order: 'ASC' | 'DESC' = 'ASC',
  page: number = 1,
  num: number = config.oj.default.page.user || 20,
) {

  // Validate parameters.
  if (page < 1 || num < 1) {
    throw createError(500, 'Invalid parameters.');
  }

  const firstResult = (page - 1) * num;
  const userRepository = getRepository(User);
  const userList = await userRepository
    .createQueryBuilder('user')
    .select([
      'user.id',
      'user.email',
      'user.username',
      'user.nickname',
      'user.sex',
      'user.privilege',
    ])
    .setFirstResult(firstResult)
    .setMaxResults(num)
    .orderBy(`user.${orderBy}`, order)
    .getMany()
    .catch((err) => {
      console.error(err);
      throw createError(500, 'Database operation failed.');
    });

  if (!userList || userList.length === 0) {
    throw createError(404, 'No matching result.');
  }

  return userList;

}

export async function searchUser(
  keyword: string,
  orderBy: 'id' | 'username' | 'createdAt' = 'id',
  order: 'ASC' | 'DESC'  = 'ASC',
  page: number = 1,
  num: number = config.oj.default.page.user || 20,
) {

  // Validate parameters.
  if (page < 1 || num < 1 || !keyword) {
    throw createError(500, 'Invalid parameters.');
  }

  const firstResult = (page - 1) * num;
  const userRepository = getRepository(User);
  const searchResult = await userRepository
    .createQueryBuilder('user')
    .select([
      'user.id',
      'user.email',
      'user.username',
      'user.nickname',
      'user.sex',
      'user.privilege',
    ])
    .where('user.username LIKE :keyword')
    .orWhere('user.email LIKE :keyword')
    .orWhere('user.nickname LIKE :keyword')
    .setParameter('keyword', `%${keyword}%`)
    .setFirstResult(firstResult)
    .setMaxResults(num)
    .orderBy(`user.${orderBy}`, order)
    .getMany()
    .catch((err) => {
      console.error(err);
      throw createError(500, 'Database operation failed.');
    });

  if (!searchResult || searchResult.length === 0) {
    throw createError(404, 'No matching result.');
  }

  return searchResult;

}

export async function postUser(data: any) {

  // Verify parameters.
  if (!(data.email && data.username && data.password)) {
    throw createError(500, 'Invalid parameters.');
  }

  const userRepository = getRepository(User);
  const userInfo = await userRepository
    .findOne({
      where: {
        id: data.id,
      },
    })
    .catch((err) => {
      console.error(err);
      throw createError(500, 'Database operation failed.');
    });

  const user = userInfo ? userInfo : new User();

  // Update password.
  user
    .updatePassword(data.password)
    .catch((err) => {
      console.error(err);
      throw createError(500, 'Update user password failed.');
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

  await userRepository
    .persist(user)
    .catch((err) => {
      console.error(err);
      if (err.errno === 1062) {
        throw createError(400, 'Username or email taken.');
      }
      throw createError(500, 'Database operation failed.');
    });

  return user;

}

export async function validateUserInfo(data: any) {

  if (!data.username) {
    throw createError(400, 'Invalid username.');
  }

  if (
    config.oj.policy.profile.username.min_length &&
    data.username.length < config.oj.policy.profile.username.min_length
  ) {
    throw createError(400, 'Username too short.');
  }

  if (!data.password) {
    throw createError(400, 'Invalid password.');
  }

  // Complexity Check: To be implemented.

  if (
    config.oj.policy.profile.password.max_length &&
    data.password.length > config.oj.policy.profile.password.max_length
  ) {
    throw createError(400, 'Password too long.');
  }

  if (
    data.nickname &&
    config.oj.policy.profile.nickname.min_length &&
    data.nickname.length < config.oj.policy.profile.nickname.min_length
  ) {
    throw createError(400, 'Nickname too short.');
  }

  if (
    data.nickname &&
    config.oj.policy.profile.nickname.max_length &&
    data.nickname.length > config.oj.policy.profile.nickname.max_length
  ) {
    throw createError(400, 'Nickname too long.');
  }

  if (!data.email || !emailValidator.validate(data.email)) {
    throw createError(400, 'Invalid email.');
  }

  return true;

}
