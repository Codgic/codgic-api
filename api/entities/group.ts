/* /api/entities/group.ts */

// UNFINISHED!!!

import { Column, CreateDateColumn, Entity, Index, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

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

  @ManyToMany((type) => User, (user) => user.group)
  public user: User;

  @Column('tinyint')
  public privilege: number;

  @CreateDateColumn()
  public createdAt: string;

  @UpdateDateColumn()
  public updatedAt: string;
}
