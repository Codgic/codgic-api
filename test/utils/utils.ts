/* /test/utils.ts
  Utilities here. Happy testing! */

import { ConnectionOptions, getRepository } from 'typeorm';

import { User } from './../../src/entities/user';
import { UserCredential } from './../../src/entities/user_credential';
import { config } from './../../src/init/config';

export const testConnectionOptions: ConnectionOptions = {

  type: config.database.type,
  host: config.database.host,
  port: config.database.port,
  database: config.database.database + '_test',
  username: config.database.username,
  password: config.database.password,
  logging: false,
  autoSchemaSync: true,
  entities: [
    __dirname + '/../../src/entities/*.js',
  ],
  /*
  subscribers: [
    __dirname + '/../../subscribers/.js',
  ] */

};

export async function initTestUser() {

  const user = new User();
  const userCredential = new UserCredential();

  user.id = 1;
  user.username = 'zk';
  user.email = 'fuckzk@codgi.cc';
  user.privilege = 1;

  userCredential.id = 1;
  userCredential.user = user;
  userCredential.updatePassword('CorrectPassword');

  await getRepository(User).persist(user);
  await getRepository(UserCredential).persist(userCredential);

}

export async function initAllUsers() {

  const user = new User();
  const userCredential = new UserCredential();

  user.id = 1;
  user.username = 'zk';
  user.email = 'fuckzk@codgi.cc';
  user.privilege = 1;

  userCredential.id = 1;
  userCredential.user = user;
  userCredential.updatePassword('CorrectPassword');

  await getRepository(User).persist(user);
  await getRepository(UserCredential).persist(userCredential);

  user.id = 2;
  user.username = 'gzf';
  user.email = 'fuckgzf@codgi.cc';
  user.privilege = 1;

  userCredential.id = 2;
  userCredential.user = user;
  userCredential.updatePassword('CorrectPassword');

  await getRepository(User).persist(user);
  await getRepository(UserCredential).persist(userCredential);

  user.id = 3;
  user.username = 'yyd';
  user.email = 'fuckyyd@codgi.cc';
  user.privilege = 1;

  userCredential.id = 3;
  userCredential.user = user;
  userCredential.updatePassword('CorrectPassword');

  await getRepository(User).persist(user);
  await getRepository(UserCredential).persist(userCredential);

}

export async function deleteAllUsers() {

  await getRepository(UserCredential)
    .createQueryBuilder('user_credential')
    .delete()
    .execute();

  await getRepository(User)
    .createQueryBuilder('user')
    .delete()
    .execute();

}

export async function updateTestUserPrivilege(username: string, privilege: number) {

  await getRepository(User)
    .createQueryBuilder('user')
    .update({
      privilege,
    })
    .where('user.username = :username')
    .setParameter('username', username)
    .execute();

}

export async function verifyUserPassword(username: string, retrievedPassword: string) {

  const userCredentialInfo = await getRepository(UserCredential)
    .createQueryBuilder('user_credential')
    .innerJoinAndSelect('user_credential.user', 'user', 'user.username = :username')
    .setParameter('username', username)
    .getOne();

  if (!userCredentialInfo) {
    throw new Error('User does not exist.');
  }

  return userCredentialInfo.verifyPassword(retrievedPassword);

}
