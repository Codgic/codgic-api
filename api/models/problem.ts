/* /api/models/problem.ts */

import 'reflect-metadata';

import { getRepository } from 'typeorm';
// import { Connection } from './../init/typeorm';

import { Problem } from './../entities/problem';

// Get problem info.
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

// Get problem list.
export async function getProblemList(pageid: number) {
  if (typeof(pageid) === 'undefined') {
    pageid = 1;
  }
  const problemRepository = await getRepository(Problem);
  const firstResult = (pageid - 1) * 50;
  const maxResult = firstResult + 50;
  const problemList = await problemRepository
                            .createQueryBuilder('problem')
                            /*.select([
                              'problem.problemid',
                              'problem.title',
                            ])*/
                            .setFirstResult(firstResult)
                            .setMaxResults(maxResult)
                            .orderBy('problem.problemid', 'ASC')
                            .getMany();
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(problemList);
    });
  });
}
