/* /src/middlewares/jwt.ts
  A middleware that handles JWT. */

import { Context } from 'koa';
import * as KoaJwt from 'koa-jwt';

import { config } from './../init/config';

let koaJwt = KoaJwt({
  secret: config.api.jwt.secret,
  debug: config.api.jwt.debug,
  passthrough: !config.oj.policy.access.need_login,
});

if (config.oj.policy.access.need_login) {
  koaJwt = koaJwt.unless((ctx: Context) => {
    // Exclude login and sign up.
    return (ctx.url === '/' || '/v1' || '/v1/auth') || (ctx.url === '/v1/user' && ctx.method === 'POST');
  });
}

export const jwt = koaJwt;
