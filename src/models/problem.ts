/* /src/models/problem.ts */

import * as createError from 'http-errors';
import { getRepository } from 'typeorm';

import { Problem } from './../entities/problem';
import { User } from './../entities/user';
import { config } from './../init/config';
import { ProblemPrivilege } from './../init/privilege';

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
export async function getProblemInfo(data: number, by: 'id' | 'problemId' = 'problemId') {

  // Validate parameters.
  if (!data || (by !== 'id' && by !== 'problemId')) {
    throw createError(500, 'Invalid parameters.');
  }

  const problemInfo = await getRepository(Problem)
    .createQueryBuilder('problem')
    .leftJoinAndSelect('problem.group', 'problemGroup')
    .leftJoinAndSelect('problem.owner', 'problemOwner')
    .where(`problem.${by} = :data`)
    .setParameter('data', data)
    .getOne()
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
    .leftJoinAndSelect('problem.group', 'problemGroup')
    .leftJoinAndSelect('problem.owner', 'problemOwner')
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

// Experimental!
// Actual performance is untested!
export async function getProblemListWithFilter(
  userId: number = -1,
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
      .leftJoinAndSelect('problem.group', 'problemGroup')
      .leftJoin('problemGroup.member', 'problemGroupMember')
      .leftJoin('problemGroupMember.user', 'problemGroupMemberUser', 'problemGroupMemberUser.id = :userId')
      .leftJoinAndSelect('problem.owner', 'problemOwner')
      .where('(problemOwner.id = :userId AND problem.ownerPrivilege & :operation <> 0)')
      .orWhere('(problemGroupMemberUser.id = :userId AND problem.groupPrivilege & :operation <> 0)')
      .orWhere('(problemOwner.id <> :userId AND problemGroupMemberUser.id IS NULL AND problem.worldPrivilege & :operation <> 0)')
      .setParameters({
        userId,
        operation: ProblemPrivilege.read,
      })
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
    .leftJoinAndSelect('problem.group', 'problemGroup')
    .leftJoinAndSelect('problem.owner', 'problemOwner')
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

  return searchResult;

}

// Experimental!
// Actual performance is untested!
export async function searchProblemWithFilter(
  userId: number = -1,
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
    .leftJoinAndSelect('problem.group', 'problemGroup')
    .leftJoin('problemGroup.member', 'problemGroupMember')
    .leftJoin('problemGroupMember.user', 'problemGroupMemberUser', 'problemGroupMemberUser.id = :userId')
    .leftJoinAndSelect('problem.owner', 'problemOwner')
    .where('(problemOwner.id = :userId AND problem.ownerPrivilege & :operation <> 0)')
    .orWhere('(problemGroupMemberUser.id = :userId AND problem.groupPrivilege & :operation <> 0)')
    .orWhere('(problemOwner.id <> :userId AND problemGroupMemberUser.id IS NULL AND problem.worldPrivilege & :operation <> 0)')
    .where('problem.title LIKE :keyword')
    .orWhere('problem.description LIKE :keyword')
    .setParameters({
      userId,
      operation: ProblemPrivilege.read,
      keyword: `%${keyword}`,
    })
    .offset(firstResult)
    .limit(perPage)
    .orderBy(`problem.${sort}`, direction)
    .getMany()
    .catch((err) => {
      console.error(err);
      throw createError(500, 'Database operation failed.');
    });

  return searchResult;

}

// Post or update problem to temporary table.
export async function postProblemTemp(data: Problem, user: User) {

  // Validate parameters.
  if (!data.title || typeof user !== 'object') {
    throw createError(500, 'Invalid parameters.');
  }

  return 'Coming Soon...';

}

// Post or update problem directly.
export async function postProblem(data: Problem, user: User) {

  // Validate parameters.
  if (isNaN(data.problemId) || !data.title || typeof user !== 'object') {
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
  if (problemInfo === undefined) {
    problem.owner = user;
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
    .save(problem)
    .catch((err) => {
      console.error(err);
      throw createError(500, 'Database operation failed.');
    });

  return problem;

}
