/* /api/index.ts
   Where everything starts. */

import 'reflect-metadata';

import * as Koa from 'koa';
import { createConnection } from 'typeorm';

import { config } from './init/config';
import { initKoa } from './init/koa';
import { connectionOptions } from './init/typeorm';

console.log('Establishing database connection...');

createConnection(connectionOptions).then(async (connection) => {

  const app = new Koa();

  // Initialize everything.
  initKoa(app);

  // Throw error if port is not a number.
  if (isNaN(config.api.port) || config.api.port < 0) {
    throw new Error(`Invalid PORT: ${config.api.port}`);
  }

  // Start listening!
  app.listen(config.api.port, () => {
    console.log(`Codgic-api listening at port ${config.api.port}`);
  });

}).catch((err) => {

  console.error('Database connection failed!');
  console.error(err);

});
