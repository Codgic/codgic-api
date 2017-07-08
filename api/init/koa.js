/* /api/init/koa.js
   Where koa gets initialized. */

'use strict';

import bodyParser from 'koa-bodyparser';
import compress from 'koa-compress';
import logger from 'koa-logger';

export default function initKoa(app) {
  app.use(compress());
  app.use(logger());
  app.use(bodyParser());

  app.on('error', err => console.error(`[koa] ${err}`));

  app.use((ctx, next) => {
    ctx.body = ctx.request.body;
    return next();
  });
}
