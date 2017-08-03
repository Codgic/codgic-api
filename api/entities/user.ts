/* /api/entities/user.ts */

// UNFINISHED!!!

import { Column, CreateDateColumn, Entity, Index, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Group } from './group';

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  @Index()
  public id: number;

  @Column('varchar', {
    unique: true,
  })
  @Index()
  public email: string;

  @Column('varchar', {
    unique: true,
    length: 30,
  })
  @Index()
  public username: string;

  @Column('varchar')
  public password: string;

  @Column('varchar')
  public salt: string;

  @Column('varchar', {
    length: 30,
  })
  public nickname: string;

  @Column('tinyint', {
    nullable: true,
  })
  public sex: number;

  @Column('varchar', {
    nullable: true,
  })
  public motto: string;

  @Column('text', {
    nullable: true,
  })
  public description: string;

  @Column('tinyint')
  public privilege: number;

  @ManyToMany((type) => Group, (group) => group.user)
  public group: Group;

  @CreateDateColumn()
  public createdAt: string;

  @UpdateDateColumn()
  public updatedAt: string;
}
