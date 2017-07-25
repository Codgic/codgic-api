/* /api/entities/problem.ts
  Privilege System:
  SUBMIT = 1, WRITE = 2, READ = 4, DOWNLOAD_DATA = 8, UPLOAD_DATA = 16
*/

// UNFINISHED!!!

import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

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

  @Column('int')
  public timeLimit: number;

  @Column('int')
  public memoryLimit: number;

  @Column('int')
  public owner: number;

  @Column('int')
  public group: number;

  @Column('tinyint', {
    default: 31,
  })
  public ownerPrivilege: number;

  @Column('tinyint', {
    default: 31,
  })
  public groupPrivilege: number;

  @Column('tinyint', {
    default: 4,
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
  @Index()
  public createdAt: string;

  @UpdateDateColumn()
  @Index()
  public updatedAt: string;
}
