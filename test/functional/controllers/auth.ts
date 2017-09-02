/* /test/functional/controllers/auth.ts */

import * as chai from 'chai';
import chaiHttp = require('chai-http');
import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as sinon from 'sinon';

import * as AuthController from './../../../src/controllers/auth';
import * as AuthModel from './../../../src/models/auth';

import * as AuthStub from './../../utils/stubs/auth';

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

    await chai.request(app.listen())
      .post('/')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({
        username: 'zk',
        password: 'CorrectPassword',
      })
      .then((res) => {
        chai.expect(res.status).to.equal(200);
        chai.expect(res.body.token).to.equal('ValidToken');
      });

  });

  it('should throw bad request if username is missing', async () => {

    try {
      await chai.request(app.listen())
        .post('/')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({
          password: 'CorrectPassword',
        })
        .then((res) => {
          chai.expect(res.status).to.equal(400);
          chai.expect(res.body.token).to.equal(undefined);
        });
    } catch (err) {
      chai.expect(err.status).to.equal(400);
      chai.expect(err.message).to.equal('Bad Request');
    }

  });

  it('should throw bad request if password is missing', async () => {

    try {
      await chai.request(app.listen())
        .post('/')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({
          username: 'zk',
        })
        .then((res) => {
          chai.expect(res.status).to.equal(400);
          chai.expect(res.body.token).to.equal(undefined);
        });
    } catch (err) {
      chai.expect(err.status).to.equal(400);
      chai.expect(err.message).to.equal('Bad Request');
    }

  });

});

/* Not ready.
describe('Refresh token', async () => {
});
*/
