/* /api/models/group.ts */

import * as Koa from 'koa';

import { getRepository } from 'typeorm';

import { getConfig } from './../init/config';

import { Problem } from './../entities/problem';

const config = getConfig();

// Judge whether user is in group.
export async function isInGroup(userid: number, groupid: number) {
  try {

    // To be finished.
    if (!userid || !groupid) {
      throw new Error('Invalid request.');
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      });
    });
  } catch (err) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          error: err.message,
        });
      });
    });
  }
}
