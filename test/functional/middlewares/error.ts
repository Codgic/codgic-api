/* /test/functional/middlewares/error.ts */

import * as chai from 'chai';
import chaiHttp = require('chai-http');
import * as http from 'http';
import * as createError from 'http-errors';
import * as Koa from 'koa';
import { createConnection, getConnectionManager } from 'typeorm';

import { config } from './../../../src/init/config';
import * as Utils from './../../utils';

import { errorHandler } from './../../../src/middlewares/error';

chai.use(chaiHttp);

describe('Error handler middleware', async () => {

  let app: Koa;

  beforeEach(async () => {

    app = new Koa();
    app.use(errorHandler);

  });

  it('should return error in json', async () => {

    app.use(async (ctx, next) => {
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

  it('should hide error message by default if status > 500', async () => {

    app.use(async (ctx, next) => {
      throw createError(500, 'Server failed to fuck zk.');
    });

    chai.request(app.listen())
      .get('/')
      .then((res) => {
        chai.expect(res.type).to.equal('application/json');
        chai.expect(res.status).to.equal(500);
        chai.expect(res.body.error).to.equal('Internal Server Error');
      })
      .catch((err) => {
        chai.expect(err.message).to.equal('Internal Server Error');
      });

  });

  it('should return status 500 if status code is undefined', async () => {

    if (app === undefined) {
      throw new Error('Failed to initialize koa.');
    }

    app.use(async (ctx, next) => {
      throw createError();
    });

    chai.request(app.listen())
      .get('/')
      .then((res) => {
        chai.expect(res.type).to.equal('application/json');
        chai.expect(res.status).to.equal(500);
        chai.expect(res.body.error).to.equal('Internal Server Error');
      })
      .catch((err) => {
        chai.expect(err.message).to.equal('Internal Server Error');
      });

  });

});
