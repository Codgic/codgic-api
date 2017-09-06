/* /test/functional/middlewares/error.ts */

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import chaiHttp = require('chai-http');
import * as createError from 'http-errors';
import * as Koa from 'koa';

import { errorHandler } from './../../../src/middlewares/error';

chai.use(chaiAsPromised);
chai.use(chaiHttp);

describe('Middleware: errorHandler', async () => {

  let app: Koa;

  beforeEach(async () => {

    app = new Koa();
    app.use(errorHandler);

  });

  it('should return error in json with correct message', async () => {

    app.use(async () => {
      throw createError(400, 'You should be fucking zk!');
    });

    return chai.expect(chai.request(app.listen()).get('/').catch((err) => {
      return err.response;
    })).to.be.fulfilled.and.eventually.deep.include({
      status: 400,
      body: {
        error: 'You should be fucking zk!',
      },
    });

  });

  it('should handle error 404 successfully', async () => {

    return chai.expect(chai.request(app.listen()).get('/i/do/not/exist').catch((err) => {
      return err.response;
    })).to.be.fulfilled.and.eventually.deep.include({
      status: 404,
      body: {
        error: 'Not Found',
      },
    });

  });

  it('should hide error message by default if status > 500', async () => {

    app.use(async () => {
      throw createError(500, 'Server failed to fuck zk.');
    });

    return chai.expect(chai.request(app.listen()).get('/').catch((err) => {
      return err.response;
    })).to.be.fulfilled.and.eventually.deep.include({
      status: 500,
      body: {
        error: 'Internal Server Error',
      },
    });

  });

  it('should return status 500 if status code is undefined', async () => {

    app.use(async () => {
      throw createError();
    });

    return chai.expect(chai.request(app.listen()).get('/').catch((err) => {
      return err.response;
    })).to.be.fulfilled.and.eventually.deep.include({
      status: 500,
      body: {
        error: 'Internal Server Error',
      },
    });

  });

});
