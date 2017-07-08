/* /api/entities/users.ts */

// UNFINISHED!!!

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Users {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column('uuid')
  public uuid: string;

  @Column({
    length: 30,
  })
  public username: string;

  @Column()
  public password: string;

  @Column()
  public salt: string;

  @Column({
    length: 30,
  })
  public nickname: string;

  @Column()
  public motto: string;
}
