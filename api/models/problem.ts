/* /api/models/problem.ts */

import { getRepository } from 'typeorm';

import { Problem } from './../entities/problem';

// Get problem info
export async function getProblemInfo(problemid: number) {
  const problemRepository = await getRepository(Problem);
  const problemInfo = await problemRepository
                            .createQueryBuilder('problem')
                            .where(`problem.problemid = '${problemid}'`)
                            .getOne();
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(problemInfo);
    });
  });
}

// Get problem list
export async function getProblemList(page: number = 1, num: number = 50) {
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
                            .getMany();
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(problemList);
    });
  });
}

export async function searchProblem(query: string, page: number = 1, num: number = 50) {
  const firstResult = (page - 1) * num;
  const problemRepository = await getRepository(Problem);
  const searchResult = await problemRepository
                              .createQueryBuilder('problem')
                              .select([
                                'problem.id',
                                'problem.problemid',
                                'problem.title',
                              ])
                              .where(`problem.title LIKE '%${query}%'`)
                              .orWhere(`problem.description LIKE '%${query}%'`)
                              .setFirstResult(firstResult)
                              .setMaxResults(num)
                              .orderBy('problem.problemid', 'ASC')
                              .getMany();
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(searchResult);
    });
  });
}
