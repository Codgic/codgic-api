/* /api/entities/group.ts */

// UNFINISHED!!!

import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Group {

  @PrimaryGeneratedColumn()
  @Index()
  public id: number;

  @Column('varchar', {
    unique: true,
  })
  @Index()
  public name: string;

  @Column('text', {
    nullable: true,
  })
  public description: string;

  @Column('varchar')
  @Index()
  public owner: number;

  @Column('tinyint')
  public privilege: number;

  @CreateDateColumn()
  public createdAt: string;

  @UpdateDateColumn()
  public updatedAt: string;

}
