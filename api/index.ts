/* /api/index.ts
   Where everything starts. */

import 'reflect-metadata';

import * as Koa from 'koa';

import { getConfig } from './init/config';
import { initJWT } from './init/jwt';
import { initKoa } from './init/koa';
import { initRoutes } from './init/routes';

import { createConnection } from 'typeorm';
import { connectionOptions } from './init/typeorm';

console.log('Establishing database connection.');

createConnection(connectionOptions).then(async (connection) => {
  const app = new Koa();
  const config = getConfig();

  // Initialize everything.
  initKoa(app);
  // initJWT(app, config.api.jwt_secret);
  initRoutes(app);

  // Quit if port is invalid.
  if (typeof (config.api.port) !== 'number') {
    console.error(`Invalid PORT: ${config.api.port}`);
    config.api.port = 8080;
    console.log('Using default PORT: 8080');
  }

  // Start listening!
  app.listen(config.api.port, () => {
      console.log(`Codgic-api listening at port ${config.api.port}`);
  });
}).catch((err) => {
  console.error('Database connection failed.');
  console.error(err);
});
