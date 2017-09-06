/* /src/entities/group.ts */

// UNFINISHED!!!

import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from './user';

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

  @Column('tinyint', {
    default: 0,
  })
  public privilege: number;

  @ManyToMany(() => User)
  @JoinTable()
  public users: User[];

  @CreateDateColumn()
  public createdAt: string;

  @UpdateDateColumn()
  public updatedAt: string;

}
