/* /test/functional/models/auth.ts */

import * as chai from 'chai';
import * as jwt from 'jsonwebtoken';
import * as mocha from 'mocha';
import { createConnection, getConnectionManager } from 'typeorm';

import { config } from './../../../src/init/config';
import * as Utils from './../../utils';

import * as User from './../../../src/models/user';

describe('Get user info', async () => {

  before(async () => {
    await createConnection(Utils.testConnectionOptions);
    await Utils.deleteAllUsers();
    await Utils.initTestUser();
  });

  after(async () => {
    await Utils.deleteAllUsers();
    await getConnectionManager().get().close();
  });

  it('should return user info if user exists', async () => {
    const userInfo = await User.getUserInfo('test');
    chai.expect(userInfo.id).to.equal(1);
    chai.expect(userInfo.username).to.equal('test');
    chai.expect(userInfo.email).to.equal('fuckzk@codgi.cc');
    chai.expect(userInfo.privilege).to.equal(1);
  });

  it('should throw error if user does not exist', async () => {
    try {
      await Utils.deleteTestUser();
      const userInfo = await User.getUserInfo('test');
      Utils.initTestUser();
    } catch (err) {
      chai.expect(err.status).to.equal(404);
      chai.expect(err.expose).to.equal(true);
      chai.expect(err.message).to.equal('User not found.');
    }
  });

  it('should throw error if parameters are incomplete', async () => {
    try {
      const userInfo = await User.getUserInfo('');
    } catch (err) {
      chai.expect(err.status).to.equal(500);
      chai.expect(err.expose).to.equal(false);
      chai.expect(err.message).to.equal('Invalid parameters.');
    }
  });

});

/* Not ready.
describe('Get user list', async () => {
});

describe('Search user', async () => {
});
*/

describe('Post user', async () => {

  before(async () => {
    await createConnection(Utils.testConnectionOptions);
  });

  beforeEach(async () => {
    await Utils.deleteAllUsers();
  });

  it('should return user info if everything goes well', async () => {

    const data = {
      username: 'test',
      email: 'fuckzk@codgi.cc',
      password: 'CorrectPassword',
    };

    const userInfo = await User.postUser(data);

    chai.expect(userInfo.username).to.equal('test');
    chai.expect(userInfo.email).to.equal('fuckzk@codgi.cc');

    const correctPwdResult = await Utils.verifyUserPassword('test', 'CorrectPassword');
    chai.expect(correctPwdResult).to.equal(true);

    const wrongPwdResult = await Utils.verifyUserPassword('test', 'WrongPassword');
    chai.expect(wrongPwdResult).to.equal(false);

  });

  it('should throw error if requried fields are missing', async () => {

    const data = {
      username: 'test',
      email: 'fuckzk@codgi.cc',
      password: 'CorrectPassword',
    };

    // If username is missing.
    delete data.username;

    try {
      const userInfo = await User.postUser(data);
    } catch (err) {
      chai.expect(err.status).to.equal(500);
      chai.expect(err.expose).to.equal(false);
      chai.expect(err.message).to.equal('Invalid parameters.');
    }

    data.username = 'test';

    // If email is missing.
    delete data.email;

    try {
      const userInfo = await User.postUser(data);
    } catch (err) {
      chai.expect(err.status).to.equal(500);
      chai.expect(err.expose).to.equal(false);
      chai.expect(err.message).to.equal('Invalid parameters.');
    }

    data.email = 'fuckzk@codgi.cc';

    // If password is missing.
    delete data.password;

    try {
      const userInfo = await User.postUser(data);
    } catch (err) {
      chai.expect(err.status).to.equal(500);
      chai.expect(err.expose).to.equal(false);
      chai.expect(err.message).to.equal('Invalid parameters.');
    }

    data.password = 'CorrectPassword';

  });

/* Not ready.
describe('Validate user info', async () => {
});
*/

});
