/* /test/utils.ts
  Utilities here. Happy testing! */

import { ConnectionOptions, getRepository } from 'typeorm';

import { User } from './../src/entities/user';
import { config } from './../src/init/config';

export const testConnectionOptions: ConnectionOptions = {

  type: config.database.type,
  host: config.database.host,
  port: config.database.port,
  database: config.database.database + '_test',
  username: config.database.username,
  password: config.database.password,
  logging: {
    logQueries: false,
    logFailedQueryError: true,
  },
  autoSchemaSync: true,
  entities: [
    __dirname + '/../src/entities/*.js',
  ],
  /*
  subscribers: [
    __dirname + '/../subscribers/.js',
  ] */

};

export async function initTestUser() {

  const user = new User();

  user.updatePassword('CorrectPassword');

  user.id = 1;
  user.username = 'test';
  user.email = 'fuckzk@codgi.cc';
  user.privilege = 1;

  const userRepository = getRepository(User);

  await userRepository.persist(user);

}

export async function deleteTestUser() {

  await getRepository(User)
      .createQueryBuilder('user')
      .delete()
      .where(`user.username = 'test'`)
      .execute();

}

export async function updateTestUserPrivilege(username: string, privilege: number) {

  await getRepository(User)
      .createQueryBuilder('user')
      .update({
        privilege: `${privilege}`,
      })
      .where(`user.username = '${username}'`)
      .execute();

}
