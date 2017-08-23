/* /api/routes/v1/root.ts */

import * as Router from 'koa-router';

import { hi } from './../../controllers/root';

const root = new Router();

root.get('/', hi);

export { root };
