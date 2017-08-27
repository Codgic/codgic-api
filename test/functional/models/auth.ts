/* /test/functional/models/auth.ts */

import * as chai from 'chai';
import * as jwt from 'jsonwebtoken';
import * as mocha from 'mocha';
import { createConnection } from 'typeorm';

import { config } from './../../../src/init/config';
import * as Utils from './../../utils';

import * as Auth from './../../../src/models/auth';

describe('Get User Info with Authentication.', async () => {

  before(async () => {
    await createConnection(Utils.testConnectionOptions);
    await Utils.initTestUser();
  });

  after(async () => {
    await Utils.deleteTestUser();
  });

  it('should return user info if password is correct.', async () => {
    const userInfo = await Auth.getUserInfoWithAuth('test', 'CorrectPassword');
    chai.expect(userInfo.username).to.equal('test');
    chai.expect(userInfo.email).to.equal('fuckzk@codgi.cc');
    chai.expect(userInfo.privilege).to.equal(1);
  });

  it('should throw error if password is incorrect.', async () => {
    try {
      const userInfo = await Auth.getUserInfoWithAuth('test', 'WrongPassword');
    } catch (err) {
      chai.expect(err.message).to.equal('Incorrect username or password.');
    }
  });

  it('should throw error if user is disabled.', async () => {
    try {
      Utils.updateTestUserPrivilege('test', 0);
      const userInfo = await Auth.getUserInfoWithAuth('test', 'CorrectPassword');
    } catch (err) {
      chai.expect(err.message).to.equal('User is disabled.');
    }
  });

});

describe('Generate token.', async () => {
  it('should return a valid json web token.', async () => {
    // Generate token.
    const accessToken = await Auth.generateToken(1, 'codgic', 'fuckzk@codgi.cc', 1);

    // Verify token.
    jwt.verify(accessToken, config.api.jwt.secret, (err: any, decoded: any) => {
      chai.expect(err).to.equal(undefined);
      chai.expect(decoded.id).to.equal(1);
      chai.expect(decoded.username).to.equal('codgic');
      chai.expect(decoded.email).to.equal('fuckzk@codgi.cc');
      chai.expect(decoded.privilege).to.equal(1);
    });
  });
});
