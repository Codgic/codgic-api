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
      let errorMsg: string = err.message;

      if (!errorMsg) {
        switch (err.status) {
          case 401:
            ctx.status = 401;
            if (!errorMsg) {
              errorMsg = 'Unauthorized.';
            }
            break;
          case 402:
            ctx.status = 402;
            if (!errorMsg) {
              errorMsg = 'Too much requests.';
            }
            break;
          case 403:
            ctx.status = 403;
            if (!errorMsg) {
              errorMsg = 'Forbidden.';
            }
            break;
          case 404:
            ctx.status = 404;
            if (!errorMsg) {
              errorMsg = 'Not Found.';
            }
            break;
          case 500:
            ctx.status = 500;
            if (!errorMsg) {
              errorMsg = 'Internal Server Error.';
            }
            break;
        }
      }

      ctx.body = {
        error: errorMsg,
      };

    });
  });
}
