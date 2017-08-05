/* /api/models/problem.ts */

import * as Koa from 'koa';

import { getRepository } from 'typeorm';
import { getConfig } from './../init/config';
import { isInGroup } from './group';

import { Problem } from './../entities/problem';

const config = getConfig();

// Verify problem privilege.
export async function verifyProblemPrivilege(
  operation: number,
  userid: number,
  userPrivilege: number,
  problemPrivilegeInfo: {
    owner: number,
    group: number,
    ownerPrivilege: number,
    groupPrivilege: number,
    othersPrivilege: number,
}) {
  try {
    if (!operation || !problemPrivilegeInfo) {
      throw new Error('Invalid request.');
    }

    let result: boolean = false;

    if (userid) {
      if (userPrivilege & operation) {
        // Check user's admin privilege first.
        result = true;
      } else if (userid === problemPrivilegeInfo.owner) {
        // If user is the problem owner.
        result = (problemPrivilegeInfo.ownerPrivilege & operation) === 1 ? true : false;
      } else if (isInGroup(userid, problemPrivilegeInfo.group)) {
        // If user belongs to the problem owner group.
        result = (problemPrivilegeInfo.groupPrivilege & operation) === 1 ? true : false;
      } else {
        result = (problemPrivilegeInfo.othersPrivilege & operation) === 1 ? true : false;
      }
    } else {
      result = (problemPrivilegeInfo.othersPrivilege & operation) === 1 ? true : false;
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(result);
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

// Get maxium problem id.
export async function getMaxProblemId() {
  try {
    const problemRepository = await getRepository(Problem);

    let result: number;

    // Get maximum problem id.
    const maxProblemInfo = await problemRepository
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

    if (maxProblemInfo) {
      result = maxProblemInfo.problemid;
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(result);
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

    if (!problemInfo) {
      throw new Error('Problem does not exist.');
    }

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
export async function getProblemList(
  sort: string = 'problemid',
  order: 'ASC' | 'DESC' = 'ASC',
  page: number = 1,
  num: number = config.oj.default.page.problem) {
  try {
    if (page < 1 || num < 1) {
      throw new Error('Invalid request.');
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
                              .getMany()
                              .catch((err) => {
                                console.error(err);
                                throw new Error('Database operation failed.');
                              });

    if (!problemList) {
      throw new Error('No problem available.');
    }

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

export async function searchProblem(
  sort: 'problemid' | 'title' | 'createdAt' | 'updatedAt' = 'problemid',
  order: 'ASC' | 'DESC'  = 'ASC',
  keyword: string,
  page: number = 1,
  num: number = config.oj.default.page.problem) {
  try {
    if (page < 1 || num < 1) {
      throw new Error('Invalid request.');
    }
    if (!keyword) {
      throw new Error('Keyword can not be blank.');
    }

    const firstResult = (page - 1) * num;
    const problemRepository = await getRepository(Problem);
    const searchResult = await problemRepository
                                .createQueryBuilder('problem')
                                .select([
                                  'problem.id',
                                  'problem.problemid',
                                  'problem.title',
                                ])
                                .where(`problem.title LIKE '%${keyword}%'`)
                                .orWhere(`problem.description LIKE '%${keyword}%'`)
                                .setFirstResult(firstResult)
                                .setMaxResults(num)
                                .orderBy(`problem.${sort}`, order)
                                .getMany()
                                .catch((err) => {
                                  console.error(err);
                                  throw new Error('Database operation failed.');
                                });

    if (!searchResult) {
      throw new Error('No matching result.');
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(searchResult);
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

// Post or update problem to temporary table.
export async function postProblemTemp(problemid: number, data: Problem, userid: number) {
  try {
    if (!data.title || !data.memoryLimit || !data.timeLimit || !userid) {
      throw new Error('Required information not provided.');
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('Coming Soon...');
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

// Post or update problem directly.
export async function postProblem(problemid: number, data: Problem, userid: number) {
  try {
    if (!data.title || !data.memoryLimit || !data.timeLimit || !userid) {
      throw new Error('Required information not provided.');
    }

    const problem = new Problem();

    problem.problemid = problemid;
    problem.title = data.title;
    problem.description = data.description;
    problem.inputFormat = data.inputFormat;
    problem.outputFormat = data.outputFormat;
    problem.sample = data.sample;
    problem.additionalInfo = data.additionalInfo;
    problem.timeLimit = data.timeLimit;
    problem.memoryLimit = data.memoryLimit;
    problem.createdBy = userid;
    problem.owner = userid;

    const problemRepository = await getRepository(Problem);

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
