/* /api/init/routes.js
   Where the routes get applied. */

'use strict';

import mount from 'koa-mount';

import root from './../routes/root';
import users from './../routes/users';

export default function initRoutes(app) {
  app.use(mount('/', root.routes()));
  app.use(mount('/users/', users.routes()));
}
