/* /test/utils.ts
  Utilities here. Happy testing! */

import { ConnectionOptions, getRepository } from 'typeorm';

import { User } from './../src/entities/user';
import { config } from './../src/init/config';

export const testConnectionOptions: ConnectionOptions = {

  type: config.database.type,
  host: config.database.host,
  port: config.database.port,
  database: config.database.database + '_test',
  username: config.database.username,
  password: config.database.password,
  logging: {
    logQueries: true,
    logFailedQueryError: true,
  },
  autoSchemaSync: true,
  entities: [
    __dirname + '/../src/entities/*.js',
  ],
  /*
  subscribers: [
    __dirname + '/../subscribers/.js',
  ] */

};
