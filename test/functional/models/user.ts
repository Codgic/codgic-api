/* /test/functional/models/auth.ts */

import 'reflect-metadata';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { createConnection, getConnectionManager } from 'typeorm';

import * as Utils from './../../utils/utils';

import { config } from './../../../src/init/config';
import * as UserModel from './../../../src/models/user';

chai.use(chaiAsPromised);

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
    return chai.expect(UserModel.getUserInfo(1, 'id'))
      .to.be.fulfilled.and.eventually.deep.include({
        id: 1,
        email: 'fuckzk@codgi.cc',
        username: 'zk',
        privilege: 1,
      });
  });

  it('should return user info if user exists (by username)', async () => {
    return chai.expect(UserModel.getUserInfo('zk', 'username'))
      .to.be.fulfilled.and.eventually.deep.include({
        id: 1,
        email: 'fuckzk@codgi.cc',
        username: 'zk',
        privilege: 1,
      });
  });

  it('should return user info if user exists (by email)', async () => {
    return chai.expect(UserModel.getUserInfo('fuckzk@codgi.cc', 'email'))
      .to.be.fulfilled.and.eventually.deep.include({
        id: 1,
        email: 'fuckzk@codgi.cc',
        username: 'zk',
        privilege: 1,
      });
  });

  it('should throw error if user does not exist', async () => {
    await Utils.deleteTestUser();
    return chai.expect(UserModel.getUserInfo('zk', 'username'))
      .to.be.rejected.and.eventually.deep.include({
        status: 404,
        expose: true,
        message: 'User not found.',
      })
      .then(async () => {
        await Utils.initTestUser();
      });
  });

  it('should throw error if data is missing', async () => {
    return chai.expect(UserModel.getUserInfo(''))
      .to.be.rejected.and.eventually.deep.include({
        status: 500,
        expose: false,
        message: 'Invalid parameters.',
      });
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

  it('should throw error if keyword is blank', async () => {
    return chai.expect(UserModel.searchUser(''))
      .to.be.rejected.and.eventually.deep.include({
        status: 500,
        expose: false,
        message: 'Invalid parameters.',
      });
  });

  it('should throw error if pagination is invalid (invalid page)', async () => {
    return chai.expect(UserModel.searchUser('z', 'id', 'ASC', 0, 1))
      .to.be.rejected.and.eventually.deep.include({
        status: 500,
        expose: false,
        message: 'Invalid parameters.',
      });
  });

  it('should throw error if pagination is invalid (invalid num)', async () => {
    return chai.expect(UserModel.searchUser('z', 'id', 'ASC', 1, 0))
      .to.be.rejected.and.eventually.deep.include({
        status: 500,
        expose: false,
        message: 'Invalid parameters.',
      });
  });
});

describe('Post user', async () => {

  before(async () => {
    await createConnection(Utils.testConnectionOptions);
  });

  afterEach(async () => {
    await Utils.deleteAllUsers();
  });

  it('should return user info if everything goes well (signup.need_confirmation == false)', async () => {

    config.oj.policy.signup.need_confirmation = false;

    const data = {
      email: 'fuckzk@codgi.cc',
      username: 'zk',
      password: 'CorrectPassword',
    };

    return Promise.all([
      await chai.expect(UserModel.postUser(data))
        .to.be.fulfilled.and.eventually.deep.include({
          email: 'fuckzk@codgi.cc',
          username: 'zk',
          privilege: 1,
        }),
      chai.expect(Utils.verifyUserPassword('zk', 'CorrectPassword'))
        .to.be.fulfilled.and.eventually.equal(true),
      chai.expect(Utils.verifyUserPassword('zk', 'WrongPassword'))
        .to.be.fulfilled.and.eventually.equal(false),
    ]);

  });

  it('should return user info if everything goes well (signup.need_confirmation == true)', async () => {

    config.oj.policy.signup.need_confirmation = true;

    const data = {
      email: 'fuckzk@codgi.cc',
      username: 'zk',
      password: 'CorrectPassword',
    };

    return Promise.all([
      await chai.expect(UserModel.postUser(data))
        .to.be.fulfilled.and.eventually.deep.include({
          email: 'fuckzk@codgi.cc',
          username: 'zk',
          privilege: 0,
        }),
      chai.expect(Utils.verifyUserPassword('zk', 'CorrectPassword'))
        .to.be.fulfilled.and.eventually.equal(true),
      chai.expect(Utils.verifyUserPassword('zk', 'WrongPassword'))
        .to.be.fulfilled.and.eventually.equal(false),
    ]);

  });

  it('should update user info if user already exists', async () => {

    await Utils.initTestUser();

    const data = {
      id: 1,
      email: 'fuckwaterqueen@codgi.cc',
      username: 'waterqueen',
      password: 'CorrectPassword',
    };

    return chai.expect(UserModel.postUser(data))
      .to.be.fulfilled.and.eventually.deep.include({
        id: 1,
        email: 'fuckwaterqueen@codgi.cc',
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

    return chai.expect(UserModel.postUser(data))
      .to.be.rejected.and.eventually.deep.include({
        status: 400,
        expose: true,
        message: 'Username or email taken.',
      });

  });

  it('should throw error if email already exists', async () => {

    await Utils.initTestUser();

    const data = {
      email: 'fuckzk@codgi.cc',
      username: 'anotherzk',
      password: 'AnotherCorrectPassword',
    };

    return chai.expect(UserModel.postUser(data))
      .to.be.rejected.and.eventually.deep.include({
        status: 400,
        expose: true,
        message: 'Username or email taken.',
      });

  });

  it('should throw error if username is missing', async () => {

    const data = {
      email: 'fuckzk@codgi.cc',
      password: 'CorrectPassword',
    };

    return chai.expect(UserModel.postUser(data))
      .to.be.rejected.and.eventually.deep.include({
        status: 500,
        expose: false,
        message: 'Invalid parameters.',
      });

  });

  it('should throw error if email is missing', async () => {

    const data = {
      username: 'zk',
      password: 'CorrectPassword',
    };

    return chai.expect(UserModel.postUser(data))
      .to.be.rejected.and.eventually.deep.include({
        status: 500,
        expose: false,
        message: 'Invalid parameters.',
      });

  });

  it('should throw error if password is missing', async () => {

    const data = {
      username: 'zk',
      email: 'fuckzk@codgi.cc',
    };

    return chai.expect(UserModel.postUser(data))
      .to.be.rejected.and.eventually.deep.include({
        status: 500,
        expose: false,
        message: 'Invalid parameters.',
      });
  });

/* Not ready.
describe('Validate user info', async () => {
});
*/

});
