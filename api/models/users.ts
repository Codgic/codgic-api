/* /api/models/users.js */

import { createConnection } from 'typeorm';
import { connectionOptions } from './../init/typeorm';

import { Users } from './../entities/users';

export function getUserInfo() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('{ "msg": "Comming Soon!" }');
    });
  });
}

createConnection(connectionOptions).then(async (connection) => {
  // To be finished.
}).catch((err) => {
  console.error('Database operation failure.');
  console.error(err);
});
