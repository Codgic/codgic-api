/* /src/entities/contest.ts */

// UNFINISHED!!!

import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ContestPrivilege } from './../init/privilege';

@Entity()
export class Contest {

  @PrimaryGeneratedColumn()
  @Index()
  public id: number;

  @Column('int', {
    unique: true,
  })
  @Index()
  public contestId: number;

  @Column('varchar')
  public title: string;

  @Column('text', {
    nullable: true,
  })
  public description: string;

  @Column('varchar', {
    nullable: true,
  })
  public additionalInfo: string;

  @Column('datetime')
  public startTime: number;

  @Column('datetime')
  public endTime: number;

  @Column('int')
  public owner: number;

  @Column('int')
  public group: number;

  @Column('tinyint', {
    default: ContestPrivilege.join
            + ContestPrivilege.write
            + ContestPrivilege.read,
  })
  public ownerPrivilege: number;

  @Column('tinyint', {
    default: ContestPrivilege.join
            + ContestPrivilege.write
            + ContestPrivilege.read,
  })
  public groupPrivilege: number;

  @Column('tinyint', {
    default: ContestPrivilege.join
            + ContestPrivilege.read,
  })
  public worldPrivilege: number;

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
