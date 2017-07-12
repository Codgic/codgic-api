/* /api/init/typeorm.ts
   Let's set up our database connection. */

import { ConnectionOptions } from 'typeorm';

import { getConfig } from './config';

const config = getConfig();

const connectionOptions: ConnectionOptions = {
  type: config.database.type,
  host: config.database.host,
  port: config.database.port,
  database: config.database.database,
  username: config.database.username,
  password: config.database.password,
  logging: {
    logQueries: true,
    logFailedQueryError: true,
  },
  autoSchemaSync: true,
  entities: [
    __dirname + '/../entities/*.js',
  ],
  /*
  subscribers: [
    __dirname + '/../subscribers/.js',
  ] */
};

export {connectionOptions};
