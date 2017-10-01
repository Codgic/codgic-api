/* /src/entities/problem.ts */

// UNFINISHED!!!

import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { config } from './../init/config';
import { ProblemPrivilege } from './../init/privilege';

import { Group } from './group';
import { User } from './user';

@Entity()
export class Problem {

  @PrimaryGeneratedColumn()
  @Index()
  public id: number;

  @Column('int', {
    unique: true,
  })
  @Index()
  public problemId: number;

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
    default: config.oj.default.problem.time_limit || 1000,
  })
  public timeLimit: number;

  @Column('int', {
    default: config.oj.default.problem.memory_limit || 256,
  })
  public memoryLimit: number;

  @OneToOne(() => User)
  @JoinColumn({
    name: 'owner',
    referencedColumnName: 'id',
  })
  public owner: User;

  @ManyToOne(() => Group)
  @JoinColumn({
    name: 'group',
    referencedColumnName: 'id',
  })
  public group: Group;

  @Column('tinyint', {
    default: ProblemPrivilege.submit
             + ProblemPrivilege.write
             + ProblemPrivilege.read,
  })
  public ownerPrivilege: number;

  @Column('tinyint', {
    default: ProblemPrivilege.submit
             + ProblemPrivilege.write
             + ProblemPrivilege.read,
  })
  public groupPrivilege: number;

  @Column('tinyint', {
    default: ProblemPrivilege.submit
             + ProblemPrivilege.read,
  })
  public worldPrivilege: number;

  @CreateDateColumn()
  public createdAt: string;

  @UpdateDateColumn()
  public updatedAt: string;

}
