/* /api/routes/problem.ts */

import * as Router from 'koa-router';

import * as Problem from './../controllers/problem';

const problem = new Router();

problem.get('/', Problem.getProblemList);
problem.get('/:id', Problem.getProblemInfo);
problem.get('/search/:query', Problem.searchProblem);

export { problem };
