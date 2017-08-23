/* /api/models/problem.ts */

import * as createError from 'http-errors';
import * as Koa from 'koa';
import { getRepository } from 'typeorm';

import { Problem } from './../entities/problem';
import { config } from './../init/config';
import { isInGroup } from './group';

// Get maxium problem id.
export async function getMaxProblemId() {

  const problemRepository = getRepository(Problem);
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
                        throw createError(500, 'Database operation failed.');
                      });

  return maxProblemInfo ? maxProblemInfo.problemid : null;

}

// Get problem info
export async function getProblemInfo(problemid: number) {

  // Validate parameters.
  if (!problemid) {
    throw createError(500, 'Invalid parameters.');
  }

  const problemRepository = getRepository(Problem);
  const problemInfo = await problemRepository
                  .createQueryBuilder('problem')
                  .where(`problem.problemid = '${problemid}'`)
                  .getOne()
                  .catch((err) => {
                    console.error(err);
                    throw createError(500, 'Database operation failed.');
                  });

  if (!problemInfo) {
    throw createError(404, 'Problem not found.');
  }

  return problemInfo;

}

// Get problem list
export async function getProblemList(
  sort: 'problemid' | 'title' | 'createdAt' | 'updatedAt' = 'problemid',
  order: 'ASC' | 'DESC' = 'ASC',
  page: number = 1,
  num: number = config.oj.default.page.problem) {

  // Validate parameters.
  if (page < 1 || num < 1) {
    throw createError(500, 'Invalid parameters.');
  }

  const firstResult = (page - 1) * num;
  const problemRepository = getRepository(Problem);
  const problemList = await problemRepository
                  .createQueryBuilder('problem')
                  .select([
                    'problem.id',
                    'problem.problemid',
                    'problem.title',
                  ])
                  .setFirstResult(firstResult)
                  .setMaxResults(num)
                  .orderBy(`problem.${sort}`, order)
                  .getMany()
                  .catch((err) => {
                    console.error(err);
                    throw createError(500, 'Database operation failed.');
                  });

  if (!problemList) {
    throw createError(404, 'No problem available.');
  }

  return problemList;

}

export async function searchProblem(
  sort: 'problemid' | 'title' | 'createdAt' | 'updatedAt' = 'problemid',
  order: 'ASC' | 'DESC'  = 'ASC',
  keyword: string,
  page: number = 1,
  num: number = config.oj.default.page.problem) {

  // Validate parameters.
  if (page < 1 || num < 1 || !keyword) {
    throw createError(500, 'Invalid parameters.');
  }

  const firstResult = (page - 1) * num;
  const problemRepository = getRepository(Problem);
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
                      throw createError(500, 'Database operation failed.');
                    });

  if (!searchResult) {
    throw createError(404, 'No matching result.');
  }

  return searchResult;

}

// Post or update problem to temporary table.
export async function postProblemTemp(problemid: number, data: Problem, userid: number) {

  // Validate parameters.
  if (!data.title || !data.memoryLimit || !data.timeLimit || !userid) {
    throw createError(500, 'Invalid parameters.');
  }

  return 'Coming Soon...';

}

// Post or update problem directly.
export async function postProblem(problemid: number, data: Problem, userid: number) {

  // Validate parameters.
  if (!data.title || !data.memoryLimit || !data.timeLimit || !userid) {
    throw createError(500, 'Invalid parameters.');
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

  const problemRepository = getRepository(Problem);

  await problemRepository
      .persist(problem)
      .catch((err) => {
        console.error(err);
        throw createError(500, 'Database operation failed.');
      });

  return problem;

}

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

  // Validate parameters.
  if (
    !operation ||
    !problemPrivilegeInfo.owner ||
    !problemPrivilegeInfo.group ||
    !problemPrivilegeInfo.ownerPrivilege ||
    !problemPrivilegeInfo.groupPrivilege ||
    !problemPrivilegeInfo.othersPrivilege
  ) {
    throw createError(500, 'Invalid parameters.');
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

  return result;

}
