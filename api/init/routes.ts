/* /api/init/routes.ts
   Where the routes get applied. */

import * as Koa from 'koa';
import * as mount from 'koa-mount';

import { root } from './../routes/root';
import { users } from './../routes/users';

export function initRoutes(app: Koa) {
  app.use(mount('/', root.routes()));
  app.use(mount('/users/', users.routes()));
}
