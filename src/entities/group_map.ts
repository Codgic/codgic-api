/* /api/entities/group_map.ts
  Let's map everything together. */

import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { GroupMemberPrivilege } from './../init/privilege';
import { Group } from './group';
import { User } from './user';

@Entity()
@Index('userid_groupid', ['userid', 'groupid'])
export class GroupMap {

  @PrimaryColumn('int')
  @Index()
  public groupid: number;

  @PrimaryColumn('int')
  @Index()
  public userid: number;

  @Column('tinyint', {
    default: GroupMemberPrivilege.isMember,
  })
  @Index()
  public privilege: number;

  @CreateDateColumn()
  public createdAt: string;

  @UpdateDateColumn()
  public updatedAt: string;
}
