/* /src/routes/v1/problem.ts */

import * as Router from 'koa-router';

import * as Problem from './../../controllers/problem';

const problem = new Router();

problem.get('/', Problem.getProblemList);
problem.get('/:problemid', Problem.getProblemInfo);

problem.post('/', Problem.postProblem);

problem.put('/:problemid', Problem.updateProblem);

// Unimplemented:

// problem.delete('/', Problem.deleteProblem);

export { problem };
