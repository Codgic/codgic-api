/* /api/routes/auth.ts */

import * as Router from 'koa-router';

import * as Auth from './../controllers/auth';

const auth = new Router();

auth.post('/', Auth.verifyAuthInfo);

export { auth };