/* /test/functional/controllers/user.ts */

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import chaiHttp = require('chai-http');
import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as sinon from 'sinon';

import * as UserController from './../../../src/controllers/user';
import { errorHandler } from './../../../src/middlewares/error';
import * as UserModel from './../../../src/models/user';

import * as UserStub from './../../utils/stubs/models/user';

chai.use(chaiAsPromised);
chai.use(chaiHttp);

describe('UserController: Get user info', async () => {

  let app: Koa;
  let stubGetUserInfo: sinon.SinonStub;

  before(async () => {
    stubGetUserInfo = await sinon.stub(UserModel, 'getUserInfo')
      .callsFake(UserStub.fakeGetUserInfo);
  });

  beforeEach(async () => {

    app = new Koa();
    app.use(errorHandler);
    app.use(bodyParser());

  });

  after(async () => {

    await stubGetUserInfo.restore();

  });

  it('should return current user info if no username is provided', async () => {

    // Mock koa-jwt and koa-router.
    app.use(async (ctx, next) => {
      ctx.params = {};
      ctx.state.user = {
        username: 'zk',
      };
      await next();
    });

    app.use(UserController.getUserInfo);

    return chai.expect(chai.request(app.listen()).get('/'))
      .to.be.fulfilled.and.eventually.deep.include({
        status: 200,
        body: {
          id: 1,
          email: 'fuckzk@codgi.cc',
          username: 'zk',
          privilege: 1,
        },
      });

  });

  it('should return user info if user exists', async () => {

    // Mock koa-router.
    app.use(async (ctx, next) => {
      ctx.params = {
        username: 'zk',
      };
      await next();
    });

    app.use(UserController.getUserInfo);

    return chai.expect(chai.request(app.listen()).get('/'))
      .to.be.fulfilled.and.eventually.deep.include({
        status: 200,
        body: {
          id: 1,
          email: 'fuckzk@codgi.cc',
          username: 'zk',
          privilege: 1,
        },
      });

  });

  it('should throw error if user does not exist', async () => {

    // Mock koa-router.
    app.use(async (ctx, next) => {
      ctx.params = {
        username: 'zml',
      };
      await next();
    });

    app.use(UserController.getUserInfo);

    return chai.expect(chai.request(app.listen()).get('/zml').catch((err) => {
      return err.response;
    })).to.be.fulfilled.and.eventually.deep.include({
      status: 404,
      body: {
        error: 'User not found.',
      },
    });

  });

});
