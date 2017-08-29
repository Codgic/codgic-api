/* /src/init/koa.ts
   Where koa gets initialized. */

import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as compress from 'koa-compress';
import * as helmet from 'koa-helmet';
import * as logger from 'koa-logger';

import { errorHandler } from './../middlewares/error';
import { jwt } from './../middlewares/jwt';
import { router } from './../routes/index';

export function initKoa(app: Koa) {

  app.use(errorHandler);

  app.on('error', (err) => {
    console.error(err);
  });

  app.use(helmet());
  app.use(bodyParser());
  app.use(compress());
  app.use(logger());

  app.use(jwt);
  app.use(router.routes());

}
