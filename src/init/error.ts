/* /init/error.ts
  Customized Error Classes here. */

import { Context } from 'koa';

export class ModelError extends Error {

  public code: number;

  constructor(code: number, message: string) {

    // Call parent.
    super();
    Object.setPrototypeOf(this, ModelError.prototype);

    this.code = code;

    // Set default error message if message is not defined.
    if (message) {
      this.message = message;
    } else {
      switch (code) {
        case 401:
          this.message = 'Unauthorized.';
          break;
        case 402:
          this.message = 'Too much requests.';
          break;
        case 403:
          this.message = 'Forbidden.';
          break;
        case 404:
          this.message = 'Not Found.';
          break;
        case 500:
          this.message = 'Internal Server Error.';
          break;
      }
    }

    this.stack = (new Error(this.message)).stack;
    this.name = this.constructor.name;

  }

}

export function handleKoaError(ctx: Context, next: () => Promise<any>) {

  return next().catch((err) => {

    // Never reveal real message to users if code is 500.
    if (err.code === 500) {
      err.message = 'Internal Server Error.';
    }

    ctx.body = {
      error: err.message,
    };
    ctx.status = err.status;

  });

}
