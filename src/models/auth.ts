/* /api/models/auth.ts */

import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import * as jwtKoa from 'koa-jwt';

import { getRepository } from 'typeorm';

import { getConfig } from './../init/config';

import { UserPrivilege } from './../init/privilege';

import { User } from './../entities/user';

const config = getConfig();

export async function verifyPassword(retrievedPassword: string, password: string, salt: string) {
  try {
    if (!password) {
      throw new Error('Invalid username or password.');
    }

    // Verify password.
    const passwordHash = crypto
                          .createHash('sha512')
                          .update(password + salt)
                          .digest('hex');

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(passwordHash === password);
      });
    });

  } catch (err) {
    return new Promise((reject) => {
      setTimeout(() => {
        reject({
          error: err.message,
        });
      });
    });
  }
}

export async function generateToken(userid: number, username: string, email: string, privilege: number) {
  try {

    // Sign jwt token.
    const accessToken = jwt.sign({
      id: userid,
      email: `${email}`,
      username: `${username}`,
      privilege: `${privilege}`,
    }, config.api.jwt.secret, {
      expiresIn: config.api.jwt.expire_time,
    });

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          token: accessToken,
        });
      });
    });

  } catch (err) {
    return new Promise((reject) => {
      setTimeout(() => {
        reject({
          error: err.message,
        });
      });
    });
  }
}
