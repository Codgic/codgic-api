/* /src/routes/index.ts */

import * as Router from 'koa-router';

import { v1Router } from './v1/index';

const router = new Router();

router.use('/v1', v1Router.routes());

export { router };
