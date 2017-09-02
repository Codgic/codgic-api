/* /test/functional/models/auth.ts */

import 'reflect-metadata';

import * as chai from 'chai';
import { createConnection, getConnectionManager } from 'typeorm';

import * as Utils from './../../utils/utils';

import { config } from './../../../src/init/config';
import * as UserModel from './../../../src/models/user';

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

  it('should return user info if user exists (by id)', async () => {
    const userInfo = await UserModel.getUserInfo(1, 'id');
    chai.expect(userInfo).to.deep.include({
      id: 1,
      email: 'fuckzk@codgi.cc',
      username: 'zk',
      privilege: 1,
    });
  });

  it('should return user info if user exists (by username)', async () => {
    const userInfo = await UserModel.getUserInfo('zk', 'username');
    chai.expect(userInfo).to.deep.include({
      id: 1,
      email: 'fuckzk@codgi.cc',
      username: 'zk',
      privilege: 1,
    });
  });

  it('should throw error if user does not exist', async () => {
    try {
      await Utils.deleteTestUser();
      const userInfo = await UserModel.getUserInfo('zk', 'username');
      chai.expect(userInfo).to.equal(undefined);
      await Utils.initTestUser();
    } catch (err) {
      chai.expect(err).to.deep.include({
        status: 404,
        expose: true,
        message: 'User not found.',
      });
    }
  });

  it('should throw error if data is missing', async () => {
    try {
      const userInfo = await UserModel.getUserInfo('');
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

describe('Get user list', async () => {

  before(async () => {
    await createConnection(Utils.testConnectionOptions);
    await Utils.deleteAllUsers();
    await Utils.initAllUsers();
  });

  after(async () => {
    await Utils.deleteAllUsers();
    await getConnectionManager().get().close();
  });

  it('should return user list (default options)', async () => {

    const userList = await UserModel.getUserList();

    chai.expect(userList).to.be.an('array').that.have.lengthOf(3);

    chai.expect(userList[0]).to.deep.equal({
      id: 1,
      email: 'fuckzk@codgi.cc',
      username: 'zk',
      nickname: null,
      sex: null,
      privilege: 1,
    });

    chai.expect(userList[1]).to.deep.equal({
      id: 2,
      email: 'fuckgzf@codgi.cc',
      username: 'gzf',
      nickname: null,
      sex: null,
      privilege: 1,
    });

    chai.expect(userList[2]).to.deep.equal({
      id: 3,
      email: 'fuckyyd@codgi.cc',
      username: 'yyd',
      nickname: null,
      sex: null,
      privilege: 1,
    });

  });

  it('should return user list (DESC order)', async () => {

    // Test order.
    const userList = await UserModel.getUserList('id', 'DESC');

    chai.expect(userList).to.be.an('array').that.have.lengthOf(3);

    chai.expect(userList[0]).to.deep.equal({
      id: 3,
      email: 'fuckyyd@codgi.cc',
      username: 'yyd',
      nickname: null,
      sex: null,
      privilege: 1,
    });

    chai.expect(userList[1]).to.deep.equal({
      id: 2,
      email: 'fuckgzf@codgi.cc',
      username: 'gzf',
      nickname: null,
      sex: null,
      privilege: 1,
    });

    chai.expect(userList[2]).to.deep.equal({
      id: 1,
      email: 'fuckzk@codgi.cc',
      username: 'zk',
      nickname: null,
      sex: null,
      privilege: 1,
    });

  });

  it('should return user list (customized pagination)', async () => {

    const userList = await UserModel.getUserList('id', 'ASC', 1, 2);

    chai.expect(userList).to.be.an('array').that.have.lengthOf(2);

    chai.expect(userList[0]).to.deep.equal({
      id: 1,
      email: 'fuckzk@codgi.cc',
      username: 'zk',
      nickname: null,
      sex: null,
      privilege: 1,
    });

    chai.expect(userList[1]).to.deep.equal({
      id: 2,
      email: 'fuckgzf@codgi.cc',
      username: 'gzf',
      nickname: null,
      sex: null,
      privilege: 1,
    });

  });
});

describe('Search user', async () => {

  before(async () => {
    await createConnection(Utils.testConnectionOptions);
    await Utils.deleteAllUsers();
    await Utils.initAllUsers();
  });

  after(async () => {
    await Utils.deleteAllUsers();
    await getConnectionManager().get().close();
  });

  it('should return search result (default options)', async () => {

    const searchResult = await UserModel.searchUser('z');

    chai.expect(searchResult).to.be.an('array').that.have.lengthOf(2);

    chai.expect(searchResult[0]).to.deep.equal({
      id: 1,
      email: 'fuckzk@codgi.cc',
      username: 'zk',
      nickname: null,
      sex: null,
      privilege: 1,
    });

    chai.expect(searchResult[1]).to.deep.equal({
      id: 2,
      email: 'fuckgzf@codgi.cc',
      username: 'gzf',
      nickname: null,
      sex: null,
      privilege: 1,
    });

  });

  it('should return search result (search email)', async () => {

    const searchResult = await UserModel.searchUser('fuckzk@codgi.cc');

    chai.expect(searchResult).to.be.an('array').that.have.lengthOf(1);

    chai.expect(searchResult[0]).to.deep.equal({
      id: 1,
      email: 'fuckzk@codgi.cc',
      username: 'zk',
      nickname: null,
      sex: null,
      privilege: 1,
    });

  });

  it('should return search result (DESC order)', async () => {

    const searchResult = await UserModel.searchUser('z', 'id', 'DESC');

    chai.expect(searchResult).to.be.an('array').that.have.lengthOf(2);

    chai.expect(searchResult[0]).to.deep.equal({
      id: 2,
      email: 'fuckgzf@codgi.cc',
      username: 'gzf',
      nickname: null,
      sex: null,
      privilege: 1,
    });

    chai.expect(searchResult[1]).to.deep.equal({
      id: 1,
      email: 'fuckzk@codgi.cc',
      username: 'zk',
      nickname: null,
      sex: null,
      privilege: 1,
    });

  });

  it('should return search result (customized pagination)', async () => {

    const searchResult = await UserModel.searchUser('z', 'id', 'ASC', 2, 1);

    chai.expect(searchResult).to.be.an('array').that.have.lengthOf(1);

    chai.expect(searchResult[0]).to.deep.equal({
      id: 2,
      email: 'fuckgzf@codgi.cc',
      username: 'gzf',
      nickname: null,
      sex: null,
      privilege: 1,
    });

  });
});

describe('Post user', async () => {

  before(async () => {
    await createConnection(Utils.testConnectionOptions);
  });

  beforeEach(async () => {
    await Utils.deleteAllUsers();
  });

  it('should return user info if everything goes well (signup.need_confirmation == false)', async () => {

    config.oj.policy.signup.need_confirmation = false;

    const data = {
      email: 'fuckzk@codgi.cc',
      username: 'zk',
      password: 'CorrectPassword',
    };

    const userInfo = await UserModel.postUser(data);

    chai.expect(userInfo).to.deep.include({
      email: 'fuckzk@codgi.cc',
      username: 'zk',
      privilege: 1,
    });

    const correctPwdResult = await Utils.verifyUserPassword('zk', 'CorrectPassword');
    chai.expect(correctPwdResult).to.equal(true);

    const wrongPwdResult = await Utils.verifyUserPassword('zk', 'WrongPassword');
    chai.expect(wrongPwdResult).to.equal(false);

  });

  it('should return user info if everything goes well (signup.need_confirmation == true)', async () => {

    config.oj.policy.signup.need_confirmation = true;

    const data = {
      email: 'fuckzk@codgi.cc',
      username: 'zk',
      password: 'CorrectPassword',
    };

    const userInfo = await UserModel.postUser(data);

    chai.expect(userInfo).to.deep.include({
      email: 'fuckzk@codgi.cc',
      username: 'zk',
      privilege: 0,
    });

    const correctPwdResult = await Utils.verifyUserPassword('zk', 'CorrectPassword');
    chai.expect(correctPwdResult).to.equal(true);

    const wrongPwdResult = await Utils.verifyUserPassword('zk', 'WrongPassword');
    chai.expect(wrongPwdResult).to.equal(false);

  });

  it('should update user info if user already exists', async () => {

    await Utils.initTestUser();

    const data = {
      id: 1,
      email: 'fuckzk@codgi.cc',
      username: 'waterqueen',
      password: 'CorrectPassword',
    };

    const userInfo = await UserModel.postUser(data);

    chai.expect(userInfo).to.deep.include({
      email: 'fuckzk@codgi.cc',
      username: 'waterqueen',
      privilege: 1,
    });

  });

  it('should throw error if username already exists', async () => {

    await Utils.initTestUser();

    const data = {
      email: 'fuckzkagain@codgi.cc',
      username: 'zk',
      password: 'AnotherCorrectPassword',
    };

    try {
      const userInfo = await UserModel.postUser(data);
      chai.expect(userInfo).to.equal(undefined);
    } catch (err) {
      chai.expect(err).to.deep.include({
        status: 400,
        expose: true,
        message: 'Username or email taken.',
      });
    }

  });

  it('should throw error if username already exists', async () => {

    await Utils.initTestUser();

    const data = {
      email: 'fuckzk@codgi.cc',
      username: 'anotherzk',
      password: 'AnotherCorrectPassword',
    };

    try {
      const userInfo = await UserModel.postUser(data);
      chai.expect(userInfo).to.equal(undefined);
    } catch (err) {
      chai.expect(err).to.deep.include({
        status: 400,
        expose: true,
        message: 'Username or email taken.',
      });
    }

  });

  it('should throw error if username is missing', async () => {

    const data = {
      email: 'fuckzk@codgi.cc',
      password: 'CorrectPassword',
    };

    try {
      const userInfo = await UserModel.postUser(data);
      chai.expect(userInfo).to.equal(undefined);
    } catch (err) {
      chai.expect(err).to.deep.include({
        status: 500,
        expose: false,
        message: 'Invalid parameters.',
      });
    }

  });

  it('should throw error if email is missing', async () => {

    const data = {
      username: 'zk',
      password: 'CorrectPassword',
    };

    try {
      const userInfo = await UserModel.postUser(data);
      chai.expect(userInfo).to.equal(undefined);
    } catch (err) {
      chai.expect(err).to.deep.include({
        status: 500,
        expose: false,
        message: 'Invalid parameters.',
      });
    }

  });

  it('should throw error if password is missing', async () => {

    const data = {
      username: 'zk',
      email: 'fuckzk@codgi.cc',
    };

    try {
      const userInfo = await UserModel.postUser(data);
      chai.expect(userInfo).to.equal(undefined);
    } catch (err) {
      chai.expect(err).to.deep.include({
        status: 500,
        expose: false,
        message: 'Invalid parameters.',
      });
    }

  });

/* Not ready.
describe('Validate user info', async () => {
});
*/

});
