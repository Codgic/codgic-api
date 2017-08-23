/* /src/middlewares/jwt.ts
  A middleware that handles JWT. */

import { Context } from 'koa';
import * as koaJwt from 'koa-jwt';

import { config } from './../init/config';

const jwt = koaJwt({
  secret: config.api.jwt.secret,
  debug: config.api.jwt.debug,
  passthrough: !config.oj.policy.access.need_login,
});

if (config.oj.policy.access.need_login) {
  jwt.unless((ctx: Context) => {
    return ctx.url === '/' || ctx.url === '/auth' || (ctx.url === '/user' && ctx.method === 'POST');
  });
}

export { jwt };
