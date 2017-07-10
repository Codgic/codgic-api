/* /api/init/routes.ts
   Where the routes get applied. */

import * as Koa from 'koa';
import * as mount from 'koa-mount';

import { problem } from './../routes/problem';
import { root } from './../routes/root';
import { user } from './../routes/user';

export function initRoutes(app: Koa) {
  app.use(mount('/', root.routes()));
  app.use(mount('/problem', problem.routes()));
  app.use(mount('/user', user.routes()));
}
