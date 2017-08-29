/* /test/functional/middlewares/error.ts */

import * as chai from 'chai';
import chaiHttp = require('chai-http');
import * as createError from 'http-errors';
import * as Koa from 'koa';

import { errorHandler } from './../../../src/middlewares/error';

chai.use(chaiHttp);

describe('Error handler middleware', async () => {

  let app: Koa;

  beforeEach(async () => {

    app = new Koa();
    app.use(errorHandler);

  });

  it('should return error in json with correct message', async () => {

    app.use(async () => {
      throw createError(400, 'You should be fucking zk!');
    });

    chai.request(app.listen())
      .get('/')
      .then((res) => {
        chai.expect(res.type).to.equal('application/json');
        chai.expect(res.status).to.equal(400);
        chai.expect(res.body.error).to.equal('You should be fucking zk!');
      })
      .catch((err) => {
        chai.expect(err.message).to.equal('Bad Request');
      });

  });

  it('should handle error 404 successfully', async () => {

    chai.request(app.listen())
      .get('/i/do/not/exist')
      .then((res) => {
        chai.expect(res.status).to.equal(404);
        chai.expect(res.body.error).to.equal('Not Found');
      })
      .catch((err) => {
        chai.expect(err.message).to.equal('Not Found');
      });

  });

  it('should hide error message by default if status > 500', async () => {

    app.use(async () => {
      throw createError(500, 'Server failed to fuck zk.');
    });

    chai.request(app.listen())
      .get('/')
      .then((res) => {
        chai.expect(res.status).to.equal(500);
        chai.expect(res.body.error).to.equal('Internal Server Error');
      })
      .catch((err) => {
        chai.expect(err.message).to.equal('Internal Server Error');
      });

  });

  it('should return status 500 if status code is undefined', async () => {

    app.use(async () => {
      throw createError();
    });

    chai.request(app.listen())
      .get('/')
      .then((res) => {
        chai.expect(res.status).to.equal(500);
        chai.expect(res.body.error).to.equal('Internal Server Error');
      })
      .catch((err) => {
        chai.expect(err.message).to.equal('Internal Server Error');
      });

  });

});
