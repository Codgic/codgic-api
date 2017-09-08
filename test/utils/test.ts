/* /test/functional/models/auth.ts */

import 'reflect-metadata';

import { createConnection, getConnectionManager } from 'typeorm';

import * as Utils from './utils';

createConnection(Utils.testConnectionOptions).then(async () => {

  await Utils.initAllUsers();

  getConnectionManager().get().close();

});
