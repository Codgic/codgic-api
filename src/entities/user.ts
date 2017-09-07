/* /src/entities/user.ts */

import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { GroupMap } from './group_map';

import { UserPrivilege } from './../init/privilege';

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
  })
  @Index()
  public username: string;

  @Column('varchar', {
    nullable: true,
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

  @Column('tinyint', {
    default: UserPrivilege.isEnabled,
  })
  @Index()
  public privilege: number;

  @OneToMany(() => GroupMap, (groupMap) => groupMap.user)
  public groups: GroupMap[];

  @CreateDateColumn()
  public createdAt: string;

  @UpdateDateColumn()
  public updatedAt: string;

}
