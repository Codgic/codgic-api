/* /api/init/typeorm.ts
   Let's set up our database connection. */

import { ConnectionOptions } from 'typeorm';
import { getConfig } from './config';

const config = getConfig();

const connectionOptions: ConnectionOptions = {
  type: config.DATABASE.TYPE,
  host: config.DATABASE.HOST,
  port: config.DATABASE.PORT,
  database: config.DATABASE.NAME,
  username: config.DATABASE.USERNAME,
  password: config.DATABASE.PASSWORD,
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

export { connectionOptions };
