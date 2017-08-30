/* /test/functional/models/auth.ts */

import 'reflect-metadata';

import * as chai from 'chai';
import * as jwt from 'jsonwebtoken';
import { createConnection, getConnectionManager } from 'typeorm';

import { config } from './../../../src/init/config';
import * as Utils from './../../utils';

import * as Auth from './../../../src/models/auth';

describe('Get user info with Authentication', async () => {

  before(async () => {
    await createConnection(Utils.testConnectionOptions);
    await Utils.deleteAllUsers();
    await Utils.initAllUsers();
  });

  after(async () => {
    await Utils.deleteAllUsers();
    getConnectionManager().get().close();
  });

  it('should return user info if password is correct (by email)', async () => {
    const userInfo = await Auth.getUserInfoWithAuth('zk', 'CorrectPassword');
    chai.expect(userInfo.username).to.equal('zk');
    chai.expect(userInfo.email).to.equal('fuckzk@codgi.cc');
    chai.expect(userInfo.privilege).to.equal(1);
  });

  it('should return user info if password is correct (by username)', async () => {
    const userInfo = await Auth.getUserInfoWithAuth('zk', 'CorrectPassword');
    chai.expect(userInfo.username).to.equal('zk');
    chai.expect(userInfo.email).to.equal('fuckzk@codgi.cc');
    chai.expect(userInfo.privilege).to.equal(1);
  });

  it('should throw error if password is incorrect', async () => {
    try {
      const userInfo = await Auth.getUserInfoWithAuth('zk', 'WrongPassword');
      chai.expect(userInfo).to.equal(undefined);
    } catch (err) {
      chai.expect(err.status).to.equal(403);
      chai.expect(err.expose).to.equal(true);
      chai.expect(err.message).to.equal('Incorrect username or password.');
    }
  });

  it('should throw error if user is disabled', async () => {
    try {
      Utils.updateTestUserPrivilege('zk', 0);
      const userInfo = await Auth.getUserInfoWithAuth('zk', 'CorrectPassword');
      chai.expect(userInfo).to.equal(undefined);
    } catch (err) {
      chai.expect(err.status).to.equal(403);
      chai.expect(err.expose).to.equal(true);
      chai.expect(err.message).to.equal('User is disabled.');
    }
  });

  it('should throw error if parameters are incomplete', async () => {

    // If username is missing.
    try {
      const userInfo = await Auth.getUserInfoWithAuth('', 'CorrectPassword');
      chai.expect(userInfo).to.equal(undefined);
    } catch (err) {
      chai.expect(err).to.deep.include({
        status: 500,
        expose: false,
        message: 'Invalid parameters.',
      });
    }

    // If password is missing.
    try {
      const userInfo = await Auth.getUserInfoWithAuth('zk', '');
      chai.expect(userInfo).to.equal(undefined);
    } catch (err) {
      chai.expect(err).to.deep.include({
        status: 500,
        expose: false,
        message: 'Invalid parameters.',
      });
    }
  });

});

describe('Generate token', async () => {
  it('should return a valid json web token', async () => {
    // Generate token.
    const accessToken = await Auth.generateToken(1, 'zk', 'fuckzk@codgi.cc', 1);

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
