/* /test/functional/models/group.ts */

import 'reflect-metadata';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { createConnection, getConnectionManager } from 'typeorm';

import * as Utils from './../../utils/utils';

import { Group } from './../../../src/entities/group';
import { User } from './../../../src/entities/user';
import * as GroupModel from './../../../src/models/group';

chai.use(chaiAsPromised);

describe('GroupModel: Get group info.', async () => {

  before(async () => {
    await createConnection(Utils.testConnectionOptions);
    await Utils.deleteAllGroups();
    await Utils.deleteAllUsers();
    await Utils.initTestGroup();
  });

  after(async () => {
    await Utils.deleteAllGroups();
    await Utils.deleteAllUsers();
    await getConnectionManager().get().close();
  });

  it('should return group info if group exists (by id)', async () => {
    return chai.expect(GroupModel.getGroupInfo(1))
      .to.be.fulfilled
      .and.eventually.deep.include({
        id: 1,
        name: 'ZKWaterQueen',
        description: 'All hail the Queen.',
      }).and.eventually.have.property('owner');
  });

  it('should return group info if group exists (by name)', async () => {
    return chai.expect(GroupModel.getGroupInfo('ZKWaterQueen', 'name'))
      .to.be.fulfilled
      .and.eventually.deep.include({
        id: 1,
        name: 'ZKWaterQueen',
        description: 'All hail the Queen.',
      }).and.eventually.have.property('owner');
  });

  it('should return undefined if group does not exist', async () => {
    return chai.expect(GroupModel.getGroupInfo('ZhangKeFanClub', 'name'))
      .to.be.fulfilled
      .and.eventually.equal(undefined);
  });

  it('should throw error if data is missing', async () => {
    return chai.expect(GroupModel.getGroupInfo('', 'name'))
      .to.be.rejected
      .and.eventually.deep.include({
        status: 500,
        expose: false,
        message: 'Invalid parameters.',
      });
  });

});

describe('GroupModel: Get group member info.', async () => {

  let group: Group;
  let users: User[];

  before(async () => {
    await createConnection(Utils.testConnectionOptions);
    await Utils.deleteAllGroups();
    await Utils.deleteAllUsers();
    users = await Utils.initAllUsers();
    group = await Utils.initTestGroupWithMember(users);
  });

  after(async () => {
    await Utils.deleteAllGroups();
    await Utils.deleteAllUsers();
    await getConnectionManager().get().close();
  });

  it('should return group member info if releationship exists', async () => {

    const groupMemberInfo = await GroupModel.getGroupMemberInfo(users[1], group);

    if (!groupMemberInfo) {
      throw new Error ('Group Member Info does not exist.');
    }

    chai.expect(groupMemberInfo)
      .to.deep.include({
        privilege: 1,
      });

    chai.expect(groupMemberInfo.group)
      .to.deep.include({
        id: 1,
        name: 'ZKWaterQueen',
        description: 'All hail the Queen.',
      });

    chai.expect(groupMemberInfo.user)
      .to.deep.include({
        id: 2,
        username: 'gzf',
        email: 'fuckgzf@codgi.cc',
        privilege: 1,
      });
  });

});

describe('GroupModel: Get group member list.', async () => {

  before(async () => {
    await createConnection(Utils.testConnectionOptions);
    await Utils.deleteAllGroups();
    await Utils.deleteAllUsers();
    const users = await Utils.initAllUsers();
    await Utils.initTestGroupWithMember(users);
  });

  after(async () => {
    await Utils.deleteAllGroups();
    await Utils.deleteAllUsers();
    await getConnectionManager().get().close();
  });

  it('should return group members if group exists (by id)', async () => {

    const groupMemberList = await GroupModel.getGroupMemberList(1);

    chai.expect(groupMemberList[0])
      .to.deep.include({
        privilege: 1,
      });

    chai.expect(groupMemberList[1])
      .to.deep.include({
        privilege: 1,
      });

    chai.expect(groupMemberList[2])
      .to.deep.include({
        privilege: 1,
      });

    chai.expect(groupMemberList[0].user)
      .to.deep.include({
        id: 1,
        email: 'fuckzk@codgi.cc',
        username: 'zk',
        nickname: null,
        sex: null,
        privilege: 1,
      });

    chai.expect(groupMemberList[1].user)
      .to.deep.include({
        id: 2,
        email: 'fuckgzf@codgi.cc',
        username: 'gzf',
        nickname: null,
        sex: null,
        privilege: 1,
      });

    chai.expect(groupMemberList[2].user)
      .to.deep.include({
        id: 3,
        email: 'fuckyyd@codgi.cc',
        username: 'yyd',
        nickname: null,
        sex: null,
        privilege: 1,
      });

  });

});
