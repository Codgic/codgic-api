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

export async function initTestGroupWithMember() {

  const users = await initAllUsers();

  const group = await initTestGroup();
  const groupMap = new GroupMap();

  groupMap.group = group;
  groupMap.user = users[1];

  await getRepository(GroupMap).persist(groupMap);

  groupMap.group = group;
  groupMap.user = users[2];

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

  await getRepository(User).persist(user);

  userCredential.id = 1;
  userCredential.user = user;
  userCredential.updatePassword('CorrectPassword');

  await getRepository(UserCredential).persist(userCredential);

  return user;

}

export async function initAllUsers() {

  const users: User[] = new Array();

  const zk = new User();
  const zkCredential = new UserCredential();

  zk.id = 1;
  zk.username = 'zk';
  zk.email = 'fuckzk@codgi.cc';
  zk.privilege = 1;

  users[0] = await getRepository(User).persist(zk);

  zkCredential.id = 1;
  zkCredential.user = zk;
  zkCredential.updatePassword('CorrectPassword');

  await getRepository(UserCredential).persist(zkCredential);

  const gzf = new User();
  const gzfCredential = new UserCredential();

  gzf.id = 2;
  gzf.username = 'gzf';
  gzf.email = 'fuckgzf@codgi.cc';
  gzf.privilege = 1;

  users[1] = await getRepository(User).persist(gzf);

  gzfCredential.id = 2;
  gzfCredential.user = gzf;
  gzfCredential.updatePassword('CorrectPassword');

  await getRepository(UserCredential).persist(gzfCredential);

  const yyd = new User();
  const yydCredential = new UserCredential();

  yyd.id = 3;
  yyd.username = 'yyd';
  yyd.email = 'fuckyyd@codgi.cc';
  yyd.privilege = 1;

  users[2] = await getRepository(User).persist(yyd);

  yydCredential.id = 3;
  yydCredential.user = yyd;
  yydCredential.updatePassword('CorrectPassword');

  await getRepository(UserCredential).persist(yydCredential);

  return users;

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
