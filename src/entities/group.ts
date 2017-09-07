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

  @Column('tinyint', {
    default: 0,
  })
  public privilege: number;

  @OneToMany(() => GroupMap, (groupMap) => groupMap.group, {
    cascadeInsert: true,
    cascadeUpdate: true,
  })
  public users: GroupMap[];

  @CreateDateColumn()
  public createdAt: string;

  @UpdateDateColumn()
  public updatedAt: string;

}
