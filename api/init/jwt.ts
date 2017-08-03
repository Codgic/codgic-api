import * as Koa from 'koa';
import * as jwt from 'koa-jwt';

import { UserPrivilege } from './privilege';

import { getConfig } from './config';

const config = getConfig();

export function initJWT(app: Koa) {
  // Initialize JWT secret.
  app.use(jwt({
    secret: config.api.jwt.secret,
    debug: config.api.jwt.debug,
    passthrough: true,
  }));
}
