/* /api/routes/v1/search.ts */

import * as Router from 'koa-router';

import { searchProblem } from './../../controllers/problem';
import { searchUser } from './../../controllers/user';

const search = new Router();

search.get('/problem', searchProblem);
search.get('/user', searchUser);

// Unimplemented:

// search.get('/contest', searchContest);

export { search };
