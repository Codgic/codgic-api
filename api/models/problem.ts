/* /api/models/problem.js */

import 'reflect-metadata';

import { Connection } from './../init/typeorm';

import { Problem } from './../entities/problem';

export async function getProblemInfo(problemid: string) {
  const problemRepository = Connection.getRepository(Problem);
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

export async function getProblemList(pageid: number) {
  if (typeof(pageid) === 'undefined') {
    pageid = 1;
  }
  const problemRepository = Connection.getRepository(Problem);
  const firstResult = (pageid - 1) * 50;
  const maxResult = firstResult + 50;
  const problemList = await problemRepository
                            .createQueryBuilder('problem')
                            .setFirstResult(firstResult)
                            .setMaxResult(maxResult)
                            .getMany();
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(problemList);
    });
  });
}
