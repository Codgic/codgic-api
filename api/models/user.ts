/* /api/models/user.ts */

import { getRepository } from 'typeorm';

import { getConfig } from './../init/config';

import { User } from './../entities/user';

const config = getConfig();

export async function getUserInfo(username: string) {
  try {
    if (username === undefined) {
      throw new Error('Invalid username.');
    }

    const userRepository = await getRepository(User);
    const userInfo = await userRepository
                            .createQueryBuilder('user')
                            .select([
                              'user.id',
                              'user.uuid',
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

export async function searchUser(query: string, page: number = 1, num: number = config.page.user) {
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
