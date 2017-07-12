/* /api/entities/user.ts */

// UNFINISHED!!!

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column('varchar', {
    unique: true,
  })
  public email: string;

  @Column('varchar', {
    unique: true,
    length: 30,
  })
  public username: string;

  @Column('varchar')
  public password: string;

  @Column('varchar', {
    unique: true,
  })
  public salt: string;

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

  @Column('datetime')
  public createdAt: string;

  @Column('datetime')
  public updatedAt: string;
}
