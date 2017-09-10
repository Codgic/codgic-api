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
    await Utils.initTestGroup();
  });

  after(async () => {
    await Utils.deleteAllGroups();
    await getConnectionManager().get().close();
  });

  it('should return group info if group exists (by id)', async () => {
    return chai.expect(GroupModel.getGroupInfo(1))
      .to.be.fulfilled.and.eventually.deep.include({
        id: 1,
        name: 'ZKWaterQueen',
        description: 'All hail the Queen.',
      }).and.eventually.have.property('owner');
  });

  it('should return group info if group exists (by name)', async () => {
    return chai.expect(GroupModel.getGroupInfo('ZKWaterQueen', 'name'))
      .to.be.fulfilled.and.eventually.deep.include({
        id: 1,
        name: 'ZKWaterQueen',
        description: 'All hail the Queen.',
      }).and.eventually.have.property('owner');
  });

  it('should return group info if group exists (by id)', async () => {
    return chai.expect(GroupModel.getGroupInfo(1, 'id'))
      .to.be.fulfilled.and.eventually.deep.include({
        id: 1,
        name: 'ZKWaterQueen',
        description: 'All hail the Queen.',
      }).and.eventually.have.property('owner');
  });

  it('should return undefined if group does not exist', async () => {
    return chai.expect(GroupModel.getGroupInfo('ZhangKeFanClub', 'name'))
      .to.be.fulfilled.and.eventually.equal(undefined);
  });

  it('should throw error if data is missing', async () => {
    return chai.expect(GroupModel.getGroupInfo('', 'name'))
      .to.be.rejected.and.eventually.deep.include({
        status: 500,
        expose: false,
        message: 'Invalid parameters.',
      });
  });

});
