/* /src/models/problem.ts */

import * as createError from 'http-errors';
import { getRepository } from 'typeorm';

import { Problem } from './../entities/problem';
import { config } from './../init/config';

// Get maxium problem id.
export async function getMaxProblemId() {

  const maxProblemInfo = await getRepository(Problem)
    .createQueryBuilder('problem')
    .select([
      'problem.id',
      'problem.problemId',
    ])
    .orderBy('problem.problemId', 'DESC')
    .getOne()
    .catch((err) => {
      console.error(err);
      throw createError(500, 'Database operation failed.');
    });

  return maxProblemInfo ? maxProblemInfo.problemId : null;

}

// Get problem info
export async function getProblemInfo(problemId: number) {

  // Validate parameters.
  if (!problemId) {
    throw createError(500, 'Invalid parameters.');
  }

  const problemInfo = await getRepository(Problem)
    .findOne({
      where: {
        problemId,
      },
    })
    .catch((err) => {
      console.error(err);
      throw createError(500, 'Database operation failed.');
    });

  return problemInfo;

}

// Get problem list
// To-do: add affiliation.
export async function getProblemList(
  sort: 'problemId' | 'title' | 'createdAt' | 'updatedAt' = 'problemId',
  direction: 'ASC' | 'DESC' = 'ASC',
  page: number = 1,
  perPage: number = config.oj.default.page.problem || 50,
) {

  // Validate parameters.
  if (page < 1 || perPage < 1) {
    throw createError(500, 'Invalid parameters.');
  }

  const firstResult = (page - 1) * perPage;

  const problemList = await getRepository(Problem)
    .createQueryBuilder('problem')
    .select([
      'problem.id',
      'problem.problemId',
      'problem.title',
    ])
    .offset(firstResult)
    .limit(perPage)
    .orderBy(`problem.${sort}`, direction)
    .getMany()
    .catch((err) => {
      console.error(err);
      throw createError(500, 'Database operation failed.');
    });

  if (!problemList || problemList.length === 1) {
    throw createError(404, 'No problem available.');
  }

  return problemList;

}

// Get problem list
export async function getProblemListWithFilter(
  userId: number,
  sort: 'problemId' | 'title' | 'createdAt' | 'updatedAt' = 'problemId',
  direction: 'ASC' | 'DESC' = 'ASC',
  page: number = 1,
  perPage: number = config.oj.default.page.problem || 50,
) {

  // Validate parameters.
  if (page < 1 || perPage < 1) {
    throw createError(500, 'Invalid parameters.');
  }

  const firstResult = (page - 1) * perPage;

  const problemList = await getRepository(Problem)
    .createQueryBuilder('problem')
    .innerJoin('problem.group', 'problemGroup')
    .innerJoin('problemGroup.member', 'problemGroupMember', 'problemGroupMember.user = :currentUserId')
    .setParameter('currentUserId', userId)
    .offset(firstResult)
    .limit(perPage)
    .orderBy(`problem.${sort}`, direction)
    .getMany()
    .catch((err) => {
      console.error(err);
      throw createError(500, 'Database operation failed.');
    });

  return problemList;

}

export async function searchProblem(
  sort: 'problemId' | 'title' | 'createdAt' | 'updatedAt' = 'problemId',
  direction: 'ASC' | 'DESC'  = 'ASC',
  keyword: string,
  page: number = 1,
  perPage: number = config.oj.default.page.problem || 50) {

  // Validate parameters.
  if (page < 1 || perPage < 1 || !keyword) {
    throw createError(500, 'Invalid parameters.');
  }

  const firstResult = (page - 1) * perPage;
  const searchResult = await getRepository(Problem)
    .createQueryBuilder('problem')
    .select([
      'problem.id',
      'problem.problemId',
      'problem.title',
    ])
    .where('problem.title LIKE :keyword')
    .orWhere('problem.description LIKE :keyword')
    .setParameter('keyword', `%${keyword}%`)
    .offset(firstResult)
    .limit(perPage)
    .orderBy(`problem.${sort}`, direction)
    .getMany()
    .catch((err) => {
      console.error(err);
      throw createError(500, 'Database operation failed.');
    });

  if (!searchResult || searchResult.length === 0) {
    throw createError(404, 'No matching result.');
  }

  return searchResult;

}

// Post or update problem to temporary table.
export async function postProblemTemp(data: Problem, userId: number) {

  // Validate parameters.
  if (!(data.title && userId)) {
    throw createError(500, 'Invalid parameters.');
  }

  return 'Coming Soon...';

}

// Post or update problem directly.
export async function postProblem(data: Problem, userId: number) {

  console.log(data);

  // Validate parameters.
  if (!(data.problemId && data.title && userId)) {
    throw createError(500, 'Invalid parameters.');
  }

  const problemRepository = getRepository(Problem);
  const problemInfo = await problemRepository
    .findOne({
      where: {
        problemId: data.problemId,
      },
    })
    .catch((err) => {
      console.error(err);
      throw createError(500, 'Database operation failed.');
    });

  const problem = problemInfo ? problemInfo : new Problem();

  // Set owner.
  if (!problemInfo) {
    problem.owner = userId;
  }

  problem.problemId = data.problemId || problem.problemId;
  problem.title = data.title || problem.title;
  problem.description = data.description || problem.description;
  problem.inputFormat = data.inputFormat || problem.inputFormat;
  problem.outputFormat = data.outputFormat || problem.outputFormat;
  problem.sample = data.sample || problem.sample;
  problem.additionalInfo = data.additionalInfo || problem.additionalInfo;
  problem.timeLimit = data.timeLimit || problem.timeLimit;
  problem.memoryLimit = data.memoryLimit || problem.memoryLimit;

  await problemRepository
    .persist(problem)
    .catch((err) => {
      console.error(err);
      throw createError(500, 'Database operation failed.');
    });

  return problem;

}
