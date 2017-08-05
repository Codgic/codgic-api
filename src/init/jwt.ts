import * as Koa from 'koa';
import * as koaJwt from 'koa-jwt';

import { UserPrivilege } from './privilege';

import { getConfig } from './config';

const config = getConfig();

function allowGuard(ctx: Koa.Context) {
  return ctx.url === '/' || ctx.url === '/auth' || (ctx.url === '/user' && ctx.method === 'POST');
}

export function initJWT(app: Koa) {

  // Initialize koa-jwt middleware.
  const jwt = koaJwt({
    secret: config.api.jwt.secret,
    debug: config.api.jwt.debug,
    passthrough: !config.oj.policy.access.need_login,
  });

  if (config.oj.policy.access.need_login) {
    app.use(jwt.unless(allowGuard));
  } else {
    app.use(jwt);
  }

}
