/* /api/init/koa.ts
   Where koa gets initialized. */

import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as compress from 'koa-compress';
import * as logger from 'koa-logger';

export function initKoa(app: Koa) {
  app.use(compress());
  app.use(logger());
  app.use(bodyParser());

  app.on('error', (err: string) => console.error(err));

  app.use((ctx, next) => {
    return next().catch((err) => {
      // Common error handler
      switch (err) {
        case 401:
          ctx.status = 401;
          ctx.body = {
            error: 'Unauthorized.',
          };
          break;
        case 404:
          ctx.status = 404;
          ctx.body = {
            error: 'Not found.',
          };
          break;
        case 500:
          ctx.status = 500;
          ctx.body = {
            error: 'Internal Server Error.',
          };
          break;
      }
    });
  });
}
