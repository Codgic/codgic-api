/* /api/models/users.js */

import { createConnection } from 'typeorm';
import { connectionOptions } from './../init/typeorm';

const users = createConnection(connectionOptions);

export function usersFirstRun() {
  // To be finished.
}

export function usersQuery() {
  // To be finished.
}

users.catch((err) => {
  console.error('Database operation failure.');
  console.error(err);
});

/*
import Sequelize from 'sequelize';
import sequelize from './../init/sequelize';

// Define users Table Structure
const Users = sequelize.define('users', {
  uuid: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    unique: true,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  salt: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  nickname: {
    type: Sequelize.STRING,
  },
  token: {
    type: Sequelize.STRING,
    unique: true,
  },
});

// Create users table at first run
export function usersFirstRun() {
  try {
    Users
    .sync({ force: true })
    .then(() => {
      Users.create({
        username: 'codgician',
        password: 'bug@osuyou',
        salt: rand(128, 25),
        nicname: 'Codgician',
      });
    });
  } catch (err) {
    console.error('[sequelize] Failed to create users table.');
    console.error(err);
  }
}

// Get user info from users table
export function usersQuery(items) {
  Users.find({where:{name: USERNAME}})
}
*/
