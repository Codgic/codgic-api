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

    // Ensure Internal Error messages are not passed to users.
    if (!err.status || err.status === 500) {
      err.message = 'Internal Server Error';
    }

    ctx.body = {
      error: err.message,
    };
    ctx.status = err.status || 500;

  }
}
