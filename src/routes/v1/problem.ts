/* /src/routes/v1/problem.ts */

import * as Router from 'koa-router';

import * as Problem from './../../controllers/problem';

const problem = new Router();

problem.get('/', Problem.getProblemList);
problem.get('/:problemId', Problem.getProblemInfo);

problem.post('/', Problem.postProblem);

problem.put('/:problemId', Problem.updateProblem);

problem.patch('/:problemId', Problem.updateProblem);

// Unimplemented:

// problem.delete('/', Problem.deleteProblem);

export { problem };
