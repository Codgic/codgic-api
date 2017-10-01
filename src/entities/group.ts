/* /src/entities/group.ts */

// UNFINISHED!!!

import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { GroupMap } from './group_map';
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

  @ManyToOne(() => User)
  @Index()
  public owner: User;

  @OneToMany(() => GroupMap, (groupMap) => groupMap.group)
  public member: GroupMap;

  @Column('tinyint', {
    default: 0,
  })
  public privilege: number;

  @CreateDateColumn()
  public createdAt: string;

  @UpdateDateColumn()
  public updatedAt: string;

}
