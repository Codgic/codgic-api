/* /api/entities/problem.ts */

// UNFINISHED!!!

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Problem {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column('varchar', {
    unique: true,
  })
  public readonly uuid: string;

  @Column('varchar', {
    unique: true,
  })
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

  @Column('varchar')
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

  @Column('varchar')
  public uploader: number;

  @Column('datetime')
  public createdAt: string;

  @Column('datetime')
  public updatedAt: string;
}
