/* /api/models/user.ts */

import { getRepository } from 'typeorm';

import { User } from './../entities/user';

export async function getUserInfo(username: string) {
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
}

export async function getCurrentInfo() {
  const userRepository = await getRepository(User);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('Coming Soon!');
    });
  });
}
