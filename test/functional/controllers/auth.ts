/* /test/functional/controllers/auth.ts */

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import chaiHttp = require('chai-http');
import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as sinon from 'sinon';

import * as AuthController from './../../../src/controllers/auth';
import * as AuthModel from './../../../src/models/auth';
import * as UserModel from './../../../src/models/user';

import * as AuthStub from './../../utils/stubs/models/auth';
import * as UserStub from './../../utils/stubs/models/user';

chai.use(chaiAsPromised);
chai.use(chaiHttp);

describe('Verify authentication information', async () => {

  let app: Koa;
  let stubGetUserInfoWithAuth: sinon.SinonStub;
  let stubGenerateToken: sinon.SinonStub;

  before(async () => {

    app = new Koa();
    app.use(bodyParser());

    // Stub getUserInfoWithAuth()
    stubGetUserInfoWithAuth = await sinon.stub(AuthModel, 'getUserInfoWithAuth')
      .callsFake(AuthStub.fakeGetUserInfoWithAuth);

    // Stub generateToken()
    stubGenerateToken = await sinon.stub(AuthModel, 'generateToken')
      .callsFake(AuthStub.fakeGenerateToken);

    app.use(AuthController.verifyAuthInfo);

  });

  after (async () => {

    await stubGetUserInfoWithAuth.restore();
    await stubGenerateToken.restore();

  });

  it('should return a valid jwt if authentication info is correct', async () => {

    return chai.expect(chai.request(app.listen())
      .post('/')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({
        username: 'zk',
        password: 'CorrectPassword',
      })).to.be.fulfilled.and.eventually.deep.include({
        status: 200,
        body: {
          token: 'ValidToken',
        },
      });

  });

  it('should throw bad request if username is missing', async () => {

    return chai.expect(chai.request(app.listen())
      .post('/')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({
        password: 'CorrectPassword',
      })).to.be.rejected.and.eventually.deep.include({
        status: 400,
        message: 'Bad Request',
      });

  });

  it('should throw bad request if password is missing', async () => {

    return chai.expect(chai.request(app.listen())
      .post('/')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({
        username: 'zk',
      })).to.be.rejected.and.eventually.deep.include({
        status: 400,
        message: 'Bad Request',
      });

  });

});

describe('Refresh token', async () => {

  let app: Koa;
  let stubGetUserInfo: sinon.SinonStub;
  let stubGenerateToken: sinon.SinonStub;

  before(async () => {

    // Stub getUserInfoWithAuth()
    stubGetUserInfo = await sinon.stub(UserModel, 'getUserInfo')
      .callsFake(UserStub.fakeGetUserInfo);

    // Stub generateToken()
    stubGenerateToken = await sinon.stub(AuthModel, 'generateToken')
      .callsFake(AuthStub.fakeGenerateToken);

  });

  beforeEach(async () => {
    app = new Koa();
    app.use(bodyParser());
  });

  after (async () => {

    await stubGetUserInfo.restore();
    await stubGenerateToken.restore();

  });

  it('should return a new jwt if given token is valid', async () => {
    // We don't really have to provide a valid jwt here.
    // Validating jwt is koa-jwt's job, and koa-jwt has passed his own tests.
    // So let's assume koa-jwt has successfully decrypted the given jwt.
    app.use(async (ctx, next) => {
      ctx.state.user = {
        id: 1,
        email: 'fuckzk@codgi.cc',
        username: 'zk',
        privilege: 1,
      };
      await next();
    });

    app.use(AuthController.refreshToken);

    return chai.expect(chai.request(app.listen()).get('/'))
      .to.be.fulfilled.and.eventually.deep.include({
        status: 200,
        body: {
          token: 'ValidToken',
        },
      });
  });

  it('should throw error if given token is invalid or has expired', async () => {

    app.use(AuthController.refreshToken);

    return chai.expect(chai.request(app.listen()).get('/'))
      .to.be.rejected.and.eventually.deep.include({
        status: 401,
        message: 'Unauthorized',
      });
  });

});
