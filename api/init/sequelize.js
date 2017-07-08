/* /api/database/index.js
   Let's get connected! */

'use strict';

import Sequelize from 'sequelize';
import getConfig from './config';

// Read config
const config = getConfig();

// Establish connection
const sequelize = new Sequelize(
  config.DATABASE.NAME,
  config.DATABASE.USERNAME,
  config.DATABASE.PASSWORD, {
    host: config.DATABASE.HOST,
    dialect: config.DATABASE.DIALECT,
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
  });

// Test connection
sequelize
  .authenticate()
  .then(() => {
    console.log('[Database] Connection established.');
  })
  .catch((err) => {
    console.error('[Database] Failed to establish database connection.');
    console.error(`[Database] ${err}`);
  });

export default sequelize;
