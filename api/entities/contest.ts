/* /api/entities/contest.ts
  Privilege System:
  SUBMIT = 1, WRITE = 2, READ = 4, DOWNLOAD_DATA = 8, UPLOAD_DATA = 16
*/

// UNFINISHED!!!

import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ContestPrivilege } from './../init/privilege';

@Entity()
export class Contest {

  @PrimaryGeneratedColumn()
  @Index()
  public id: number;

  @PrimaryColumn('int', {
    unique: true,
  })
  @Index()
  public contestid: number;

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
