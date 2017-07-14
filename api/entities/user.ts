/* /api/entities/user.ts */

// UNFINISHED!!!

import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

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
    unique: true,
  })
  @Index()
  public token: string;

  @Column('varchar', {
    length: 30,
  })
  public nickname: string;

  @Column('tinyint')
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

  @CreateDateColumn()
  public createdAt: string;

  @UpdateDateColumn()
  public updatedAt: string;
}
