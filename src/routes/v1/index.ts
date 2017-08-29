/* /src/routes/v1/index.ts */

import * as Router from 'koa-router';

import { auth } from './auth';
import { group } from './group';
import { problem } from './problem';
import { root } from './root';
import { search } from './search';
import { user } from './user';

const v1Router = new Router();

// Load routes.
v1Router.use('/auth', auth.routes());
v1Router.use('/group', group.routes());
v1Router.use('/problem', problem.routes());
v1Router.use('/root', root.routes());
v1Router.use('/search', search.routes());
v1Router.use('/user', user.routes());

export { v1Router };
