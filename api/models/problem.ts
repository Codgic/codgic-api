/* /api/models/problem.ts */

import { getRepository } from 'typeorm';

import { getConfig } from './../init/config';

import { Problem } from './../entities/problem';

const config = getConfig();

// Get problem info
export async function getProblemInfo(problemid: number) {
  try {
    if (!problemid) {
      throw new Error('Invalid problem id.');
    }

    const problemRepository = await getRepository(Problem);
    const problemInfo = await problemRepository
                              .createQueryBuilder('problem')
                              .where(`problem.problemid = '${problemid}'`)
                              .getOne()
                              .catch((err) => {
                                console.error(err);
                                throw new Error('Database operation failed.');
                              });

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(problemInfo);
      });
    });
  } catch (err) {
    console.error(err);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          error: err.message,
        });
      });
    });
  }
}

// Get problem list
export async function getProblemList(keyword: string, page: number = 1, num: number = config.oj.default.page.problem) {
  try {
    if (page < 1 || num < 1) {
      throw new Error('Invalid request.');
    }

    if (!keyword) {
      keyword = '';
    }

    const firstResult = (page - 1) * num;
    const problemRepository = await getRepository(Problem);
    const problemList = await problemRepository
                              .createQueryBuilder('problem')
                              .select([
                                'problem.id',
                                'problem.problemid',
                                'problem.title',
                              ])
                              .setFirstResult(firstResult)
                              .setMaxResults(num)
                              .orderBy('problem.problemid', 'ASC')
                              .where(`problem.title LIKE '%${keyword}%'`)
                              .orWhere(`problem.description LIKE '%${keyword}%'`)
                              .getMany()
                              .catch((err) => {
                                console.error(err);
                                throw new Error('Database operation failed.');
                              });

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(problemList);
      });
    });
  } catch (err) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          error: err.message,
        });
      });
    });
  }
}

// Post problem.
export async function postProblem(data: any) {

  // **Should verify token first.

  try {
    if (!data.title || !data.memoryLimit || !data.timeLimit) {
      throw new Error('Required information not provided.');
    }

    const problemRepository = await getRepository(Problem);

    // If no problem exists, default problem id is 1000.
    let nextId: number = 1000;

    // Get maximum problem id.
    const maxProblem = await problemRepository
          .createQueryBuilder('problem')
          .select([
              'problem.id',
              'problem.problemid',
          ])
          .orderBy('problem.problemid', 'DESC')
          .getOne()
          .catch((err) => {
            console.error(err);
            throw new Error('Database operation failed.');
          });

    if (maxProblem !== undefined && maxProblem.problemid !== undefined) {
      nextId = maxProblem.problemid + 1;
    }

    const problem = new Problem();

    problem.problemid = nextId;

    problem.title = data.title;
    problem.description = data.description;
    problem.inputFormat = data.inputFormat;
    problem.outputFormat = data.outputFormat;
    problem.sample = data.sample;
    problem.additionalInfo = data.additionalInfo;
    problem.timeLimit = data.timeLimit;
    problem.memoryLimit = data.memoryLimit;

    problem.createdBy = 1; // **Should be obtained automatically!

    await problemRepository
      .persist(problem)
      .catch((err) => {
        console.error(err);
        throw new Error('Database operation failed.');
      });

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(problem);
      });
    });
  } catch (err) {
    console.error(err);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          error: err.message,
        });
      });
    });
  }
}

// Update Problem
export async function updateProblem(problemid: number, data: any) {

  // **Should verify token first!

  try {
    if (!data.problemid || !data.title || !data.memoryLimit || !data.timeLimit) {
      throw new Error('Required information not provided.');
    }

    const problemRepository = await getRepository(Problem);

    const thisProblem = await problemRepository
          .createQueryBuilder('problem')
          .select([
              'problem.id',
          ])
          .where(`problem.problemid = ${problemid}`)
          .getOne()
          .catch((err) => {
            console.error(err);
            throw new Error('Database operation failed.');
          });

    if (!thisProblem) {
      throw new Error('Problem does not exist.');
    }

    const problem = new Problem();

    problem.id = thisProblem.id;
    problem.title = data.title;
    problem.description = data.description;
    problem.inputFormat = data.inputFormat;
    problem.outputFormat = data.outputFormat;
    problem.sample = data.sample;
    problem.additionalInfo = data.additionalInfo;
    problem.timeLimit = data.timeLimit;
    problem.memoryLimit = data.memoryLimit;

    problem.updatedBy = 1; // **Should be obtained automatically.

    await problemRepository
      .persist(problem)
      .catch((err) => {
        console.error(err);
        throw new Error('Database operation failed.');
      });

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(problem);
      });
    });

  } catch (err) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          error: err.message,
        });
      });
    });
  }
}
