/* /api/init/koa.ts
   Where koa gets initialized. */

import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as compress from 'koa-compress';
import * as logger from 'koa-logger';

import { config } from './../init/config';
import { handleError } from './../init/error';
import { router } from './../routes/index';

export function initKoa(app: Koa) {

  app.use(handleError);

  app.on('error', (err: string) => {
    console.error(err);
  });

  app.use(bodyParser());
  app.use(compress());
  app.use(logger());

  app.use(router.routes());

}
