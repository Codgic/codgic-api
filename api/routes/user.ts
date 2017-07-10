/* /api/routes/user.ts */

import * as Router from 'koa-router';

import * as User from './../controllers/user';

const user = new Router();

user.get('/', User.getCurrentInfo);
user.get('/:username', User.getUserInfo);

export { user };
