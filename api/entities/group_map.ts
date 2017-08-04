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

import { GroupPrivilege } from './../init/privilege';

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
    default: GroupPrivilege.isMember,
  })
  @Index()
  public privilege: number;

  @CreateDateColumn()
  public createdAt: string;

  @UpdateDateColumn()
  public updatedAt: string;
}
