/* /test/functional/models/group.ts */

import 'reflect-metadata';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { createConnection, getConnectionManager } from 'typeorm';

import * as Utils from './../../utils/utils';

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

describe('GroupModel: Get group member.', async () => {

  before(async () => {
    await createConnection(Utils.testConnectionOptions);
    await Utils.deleteAllGroups();
    await Utils.deleteAllUsers();
    await Utils.initTestGroupWithMember();
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
        id: 1,
        email: 'fuckzk@codgi.cc',
        username: 'zk',
        nickname: null,
        sex: null,
        privilege: 1,
      });

    chai.expect(groupMemberList[1])
      .to.deep.include({
        id: 2,
        email: 'fuckgzf@codgi.cc',
        username: 'gzf',
        nickname: null,
        sex: null,
        privilege: 1,
      });

    chai.expect(groupMemberList[2])
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
