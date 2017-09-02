/* /test/functional/models/auth.ts */

import 'reflect-metadata';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as jwt from 'jsonwebtoken';
import { createConnection, getConnectionManager } from 'typeorm';

import { config } from './../../../src/init/config';
import * as Utils from './../../utils/utils';

import * as AuthModel from './../../../src/models/auth';

chai.use(chaiAsPromised);

describe('Get user info with Authentication', async () => {

  before(async () => {
    await createConnection(Utils.testConnectionOptions);
    await Utils.deleteAllUsers();
    await Utils.initAllUsers();
  });

  after(async () => {
    await Utils.deleteAllUsers();
    await getConnectionManager().get().close();
  });

  it('should return user info if password is correct (by email)', async () => {
    return chai.expect(AuthModel.getUserInfoWithAuth('fuckzk@codgi.cc', 'CorrectPassword'))
      .to.eventually.deep.include({
        id: 1,
        username: 'zk',
        email: 'fuckzk@codgi.cc',
        privilege: 1,
      });
  });

  it('should return user info if password is correct (by username)', async () => {
    return chai.expect(AuthModel.getUserInfoWithAuth('zk', 'CorrectPassword'))
      .to.eventually.deep.include({
        id: 1,
        username: 'zk',
        email: 'fuckzk@codgi.cc',
        privilege: 1,
      });
  });

  it('should throw error if user does not exist', async () => {
    return chai.expect(AuthModel.getUserInfoWithAuth('hellozk', 'CorrectPassword'))
      .to.be.rejected.and.eventually.deep.include({
        status: 403,
        expose: true,
        message: 'Incorrect username or password.',
      });
  });

  it('should throw error if password is incorrect', async () => {
    return chai.expect(AuthModel.getUserInfoWithAuth('zk', 'WrongPassword'))
      .to.be.rejected.and.eventually.deep.include({
        status: 403,
        expose: true,
        message: 'Incorrect username or password.',
      });
  });

  it('should throw error if user is disabled', async () => {
    await Utils.updateTestUserPrivilege('zk', 0);
    return chai.expect(AuthModel.getUserInfoWithAuth('zk', 'CorrectPassword'))
      .to.be.rejected.and.eventually.deep.include({
        status: 403,
        expose: true,
        message: 'User is disabled.',
      })
      .then(async () => {
        await Utils.updateTestUserPrivilege('zk', 1);
      });
  });

  it('should throw error if username is missing', async () => {
    chai.expect(AuthModel.getUserInfoWithAuth('', 'CorrectPassword'))
      .to.be.rejected.and.eventually.deep.include({
        status: 500,
        expose: false,
        message: 'Invalid parameters.',
      });
  });

  it('should throw error if password is missing', async () => {
    chai.expect(AuthModel.getUserInfoWithAuth('zk', ''))
      .to.be.rejected.and.eventually.deep.include({
        status: 500,
        expose: false,
        message: 'Invalid parameters.',
      });
  });

});

describe('Generate token', async () => {
  it('should return a valid json web token', async () => {
    // Generate token.
    const accessToken = await AuthModel.generateToken(1, 'zk', 'fuckzk@codgi.cc', 1);

    // Verify token.
    jwt.verify(accessToken, config.api.jwt.secret, (err: any, decoded: any) => {
      chai.expect(err).to.equal(undefined);
      chai.expect(decoded).to.deep.include({
        id: 1,
        email: 'fuckzk@codgi.cc',
        username: 'zk',
        privilege: 1,
      });
    });
  });
});
