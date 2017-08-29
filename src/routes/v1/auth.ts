/* /src/routes/v1/auth.ts */

import * as Router from 'koa-router';

import * as Auth from './../../controllers/auth';

const auth = new Router();

auth.get('/', Auth.refreshToken);

auth.post('/', Auth.verifyAuthInfo);

export { auth };
