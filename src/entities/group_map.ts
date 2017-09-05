/* /src/entities/group_map.ts
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

@Entity()
@Index('userid_groupid', ['userId', 'groupId'])
export class GroupMap {

  @PrimaryColumn('int')
  @Index()
  public groupId: number;

  @PrimaryColumn('int')
  @Index()
  public userId: number;

  @Column('tinyint', {
    default: GroupMemberPrivilege.isMember || 0,
  })
  @Index()
  public privilege: number;

  @CreateDateColumn()
  public createdAt: string;

  @UpdateDateColumn()
  public updatedAt: string;
}
