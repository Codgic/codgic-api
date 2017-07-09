/* /api/routes/user.ts */

import * as Router from 'koa-router';

import { getCurrentInfo, getUserInfo } from './../controllers/users';

const users = new Router();

users.get('/', getCurrentInfo);
users.get('/:username', getUserInfo);

export { users };
