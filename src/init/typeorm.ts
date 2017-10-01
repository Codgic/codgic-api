/* /src/init/typeorm.ts
   Let's set up our database connection. */

import { ConnectionOptions } from 'typeorm';

import { config } from './config';

export const connectionOptions: ConnectionOptions = {

  type: config.database.type,
  host: config.database.host,
  port: config.database.port,
  database: config.database.database,
  username: config.database.username,
  password: config.database.password,
  logging: config.database.logging,
  synchronize: true,
  entities: [
    __dirname + '/../entities/*.ts',
  ],
  /*
  subscribers: [
    __dirname + '/../subscribers/.js',
  ] */

};
