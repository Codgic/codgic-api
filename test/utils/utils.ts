/* /test/utils.ts
  Utilities here. Happy testing! */

import { ConnectionOptions, getRepository } from 'typeorm';

import { Group } from './../../src/entities/group';
import { GroupMap } from './../../src/entities/group_map';
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

// ====================
//  Groups
// ====================

export async function initTestGroup() {

  // Should initialize an user as group owner first.

  const user = await initTestUser();

  const group = new Group();
  const groupMap = new GroupMap();

  group.id = 1;
  group.name = 'ZKWaterQueen';
  group.description = 'All hail the Queen.';
  group.owner = user;

  groupMap.group = group;
  groupMap.user = user;

  await getRepository(Group).persist(group);
  await getRepository(GroupMap).persist(groupMap);

  return group;

}

export async function deleteAllGroups() {

  await getRepository(GroupMap)
    .createQueryBuilder('group_map')
    .delete()
    .execute();

  await getRepository(Group)
    .createQueryBuilder('group')
    .delete()
    .execute();

}

// ====================
//  Users
// ====================

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

  return user;

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
