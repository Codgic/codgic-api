/* /api/entities/problem.ts */

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
