/* /src/entities/comment.ts */

import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Comment {

  @PrimaryGeneratedColumn()
  @Index()
  public id: number;

  @Column('int')
  public userId: number;

  @Column('int')
  public articleId: number;

  @Column('text', {
    nullable: true,
  })
  public content: string;

  @Column('int', {
    nullable: true,
  })
  public bindId: number;

  @Column('tinyint', {
    default: 0,
  })
  public option: number;

  @CreateDateColumn()
  public createdAt: string;

  @UpdateDateColumn()
  public updatedAt: string;

}
