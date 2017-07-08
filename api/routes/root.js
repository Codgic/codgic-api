/* /api/routes/root.js */

'use strict';

import router from 'koa-router';

import { index, hi } from './../controllers/root';

const root = router();

root.get('/:text', index);
root.get('/', hi);

export default root;
