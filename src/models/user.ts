/* /src/models/user.ts */

import * as emailValidator from 'email-validator';
import * as createError from 'http-errors';
import { getRepository } from 'typeorm';

import { User } from './../entities/user';
import { UserCredential } from './../entities/user_credential';
import { config } from './../init/config';
import { UserPrivilege } from './../init/privilege';

export async function getUserInfo(data: number | string, by: 'id' | 'username' | 'email' = 'id') {

  // Validate parameters.
  if (!data || (by !== 'id' && by !== 'username' && by !== 'email')) {
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

  let user = new User();
  let userCredential = new UserCredential();

  const userRepository = getRepository(User);
  const userCredentialRepository = getRepository(UserCredential);

  if (data.id) {

    const userCredentialInfo = await userCredentialRepository
      .findOne({
        join: {
          alias: 'user_credential',
          innerJoinAndSelect: {
            user: 'user_credential.user',
          },
        },
        where: {
          user: data.id,
        },
      })
      .catch((err) => {
        console.error(err);
        throw createError(500, 'Database operation failed.');
      });

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

    if (!userInfo) {
      throw createError(400, 'User does not exist.');
    }

    if (!userCredentialInfo) {
      throw createError(400, 'User credential does not exist.');
    }

    // Update privilege.
    user.privilege = data.privilege ===
      undefined ? userCredentialInfo.user.privilege : data.privilege;

    user = userInfo;
    userCredential = userCredentialInfo;

  } else {
    user.privilege =
      (config.oj.policy.signup.need_confirmation && !user.createdAt) ? 0 : UserPrivilege.isEnabled;
  }

  // Update password.
  if (data.password) {
    userCredential
      .updatePassword(data.password)
      .catch((err) => {
        console.error(err);
        throw createError(500, 'Update user password failed.');
      });
  }

  user.email = data.email === undefined ? user.email : data.email;
  user.username = data.username === undefined ? user.username : data.username;
  user.nickname = data.nickname === undefined ? user.nickname : data.nickname;
  user.sex = data.sex === undefined ? user.sex : data.sex;
  user.motto = data.motto === undefined ? user.motto : data.motto;
  user.description = data.description === undefined ? user.description : data.description;

  userCredential.user = user;

  await userCredentialRepository
    .persist(userCredential)
    .catch((err) => {
      if (err.errno === 1062) {
        throw createError(400, 'Username or email taken.');
      } else {
        console.error(err);
        throw createError(500, 'Database operation failed.');
      }
    });

  return user;

}

export async function validateUserInfo(data: any) {

  // Only validate if property exists.
  // It is controller's job to check whether important fields are missing.

  if (
    data.username &&
    config.oj.policy.profile.username.min_length &&
    data.username.length < config.oj.policy.profile.username.min_length
  ) {
    throw createError(400, 'Username too short.');
  }

  // Password Complexity Check: To be implemented.

  if (
    data.password &&
    config.oj.policy.profile.password.min_length &&
    data.password.length < config.oj.policy.profile.password.min_length
  ) {
    throw createError(400, 'Password too long.');
  }

  if (
    data.password &&
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

  if (data.email && !emailValidator.validate(data.email)) {
    throw createError(400, 'Invalid email.');
  }

  return true;

}
