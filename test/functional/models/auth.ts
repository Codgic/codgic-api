/* /test/functional/models/auth.ts */

import 'reflect-metadata';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as jwt from 'jsonwebtoken';
import { createConnection, getConnectionManager } from 'typeorm';

import * as Utils from './../../utils/utils';

import { config } from './../../../src/init/config';
import * as AuthModel from './../../../src/models/auth';

chai.use(chaiAsPromised);

describe('AuthModel: Validate user credentials', async () => {

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
    return chai.expect(AuthModel.validateUserCredential('fuckzk@codgi.cc', 'CorrectPassword'))
      .to.be.fulfilled
      .and.eventually.deep.include({
        id: 1,
        username: 'zk',
        email: 'fuckzk@codgi.cc',
        privilege: 1,
      });
  });

  it('should return user info if password is correct (by username)', async () => {
    return chai.expect(AuthModel.validateUserCredential('zk', 'CorrectPassword'))
      .to.be.fulfilled
      .and.eventually.deep.include({
        id: 1,
        username: 'zk',
        email: 'fuckzk@codgi.cc',
        privilege: 1,
      });
  });

  it('should throw error if user does not exist', async () => {
    return chai.expect(AuthModel.validateUserCredential('hellozk', 'CorrectPassword'))
      .to.be.rejected
      .and.eventually.deep.include({
        status: 403,
        expose: true,
        message: 'Incorrect username or password.',
      });
  });

  it('should throw error if password is incorrect', async () => {
    return chai.expect(AuthModel.validateUserCredential('zk', 'WrongPassword'))
      .to.be.rejected
      .and.eventually.deep.include({
        status: 403,
        expose: true,
        message: 'Incorrect username or password.',
      });
  });

  it('should throw error if user is disabled', async () => {
    await Utils.updateTestUserPrivilege('zk', 0);

    return chai.expect(AuthModel.validateUserCredential('zk', 'CorrectPassword'))
      .to.be.rejected
      .and.eventually.deep.include({
        status: 403,
        expose: true,
        message: 'User is disabled.',
      })
      .then(async () => {
        await Utils.updateTestUserPrivilege('zk', 1);
      });
  });

  it('should throw error if username is missing', async () => {
    chai.expect(AuthModel.validateUserCredential('', 'CorrectPassword'))
      .to.be.rejected
      .and.eventually.deep.include({
        status: 500,
        expose: false,
        message: 'Invalid parameters.',
      });
  });

  it('should throw error if password is missing', async () => {
    chai.expect(AuthModel.validateUserCredential('zk', ''))
      .to.be.rejected
      .and.eventually.deep.include({
        status: 500,
        expose: false,
        message: 'Invalid parameters.',
      });
  });

});

describe('AuthModel: Generate token', async () => {
  it('should return a valid json web token', async () => {
    // Generate token.
    const accessToken = await AuthModel.generateToken(1, 'zk', 'fuckzk@codgi.cc', 1);

    // Verify token.
    chai.expect(jwt.verify(accessToken, config.api.jwt.secret))
      .to.deep.include({
        id: 1,
        email: 'fuckzk@codgi.cc',
        username: 'zk',
        privilege: 1,
      });

  });

  it('should throw error if jwt secret is not valid', async () => {

    config.api.jwt.secret = '';

    return chai.expect(AuthModel.generateToken(1, 'zk', 'fuckzk@codgi.cc', 1))
      .to.be.rejected
      .and.eventually.deep.include({
        status: 500,
        expose: false,
        message: 'Invalid jwt secret.',
      });

  });
});
