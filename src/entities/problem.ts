/* /src/entities/problem.ts */

// UNFINISHED!!!

import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { config } from './../init/config';
import { ProblemPrivilege } from './../init/privilege';

@Entity()
export class Problem {

  @PrimaryGeneratedColumn()
  @Index()
  public id: number;

  @Column('int', {
    unique: true,
  })
  @Index()
  public problemid: number;

  @Column('varchar')
  public title: string;

  @Column('text', {
    nullable: true,
  })
  public description: string;

  @Column('varchar', {
    nullable: true,
  })
  public inputFormat: string;

  @Column('varchar', {
    nullable: true,
  })
  public outputFormat: string;

  @Column('varchar', {
    nullable: true,
  })
  public sample: string;

  @Column('varchar', {
    nullable: true,
  })
  public additionalInfo: string;

  @Column('int', {
    default: config.oj.default.problem.time_limit,
  })
  public timeLimit: number;

  @Column('int', {
    default: config.oj.default.problem.memory_limit,
  })
  public memoryLimit: number;

  @Column('int')
  public owner: number;

  @Column('int')
  public group: number;

  @Column('tinyint', {
    default: ProblemPrivilege.submit
             + ProblemPrivilege.write
             + ProblemPrivilege.read
             + ProblemPrivilege.downloadData
             + ProblemPrivilege.uploadData,
  })
  public ownerPrivilege: number;

  @Column('tinyint', {
    default: ProblemPrivilege.submit
             + ProblemPrivilege.write
             + ProblemPrivilege.read
             + ProblemPrivilege.downloadData
             + ProblemPrivilege.uploadData,
  })
  public groupPrivilege: number;

  @Column('tinyint', {
    default: ProblemPrivilege.submit
             + ProblemPrivilege.read,
  })
  public othersPrivilege: number;

  @Column('int', {
    nullable: true,
  })
  public createdBy: number;

  @Column('int', {
    nullable: true,
  })
  public updatedBy: number;

  @CreateDateColumn()
  public createdAt: string;

  @UpdateDateColumn()
  public updatedAt: string;

}
