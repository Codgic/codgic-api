/* /api/routes/root.ts */

import * as Router from 'koa-router';

import { hi, index } from './../controllers/root';

const root = new Router();

root.get('/:text', index);
root.get('/', hi);

export { root };
