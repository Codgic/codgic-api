/* /init/error.ts
  A middleware that handles all errors. */

import { Context } from 'koa';

export async function handleError(ctx: Context, next: () => Promise<any>) {

  try {

    await next();

  } catch (err) {

    if (!err.message) {
      switch (err.status) {

        case 400:
        err.message = 'Bad request.';
        break;

      case 401:
        err.message = 'Unauthorized.';
        break;

      case 402:
        err.message = 'Too much requests.';
        break;

      case 403:
        err.message = 'Forbidden.';
        break;

      case 404:
        err.message = 'Not Found.';
        break;

      case 500:
        err.message = 'Internal Server Error.';
        break;

      default:
        console.error('Unrecognized error status.');
        err.status = 500;
        err.message = 'Internal Server Error.';
        break;

      }

    }

    ctx.body = {
      error: err.message,
    };
    ctx.status = err.status;

  }

}
