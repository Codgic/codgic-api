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

  app.on('error', (err: string) => {
    console.error(err);
  });

  app.use((ctx, next) => {
    return next().catch((err) => {

      switch (err.status) {
        case 401:
          if (!err.message) {
            err.message = 'Unauthorized.';
          }
          break;
        case 402:
          if (!err.message) {
            err.message = 'Too much requests.';
          }
          break;
        case 403:
          if (!err.message) {
            err.message = 'Forbidden.';
          }
          break;
        case 404:
          if (!err.message) {
            err.message = 'Not Found.';
          }
          break;
        case 500:
          // Never reveal error message to users.
          console.error(err.message);
          err.message = 'Internal Server Error.';
          break;
        }

      ctx.body = {
        error: err.message,
      };
      ctx.status = err.status;

    });
  });
}
