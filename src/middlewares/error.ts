/* /src/middlewares/error.ts
  A middleware that handles all errors. */

import * as createError from 'http-errors';
import { Context } from 'koa';

export async function errorHandler(ctx: Context, next: () => Promise<any>) {
  try {

    await next();

    // Handle Error 404.
    if (ctx.status === 404) {
      throw createError(404);
   }

  } catch (err) {

    if (!err.status) {

      console.error('Error status is undefined!');
      console.error(err);
      err.status = 500;

    } else if (err.status === 500) {

      console.error(err);
      err.message = err.expose ? err.message : 'Internal Server Error';

    }

    ctx.body = {
      error: err.message,
    };
    ctx.status = err.status;

  }
}
