/* /api/routes/user.ts */

import * as Router from 'koa-router';

import { getCurrentInfo, getUserInfo } from './../controllers/users';

const users = new Router();

users.get('/user/', getCurrentInfo);
users.get('/user/:username', getUserInfo);

export { users };
