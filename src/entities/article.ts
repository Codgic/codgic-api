/* /src/entities/article.ts */

import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ArticlePrivilege, ArticleType } from './../init/privilege';

@Entity()
export class Article {

  @PrimaryGeneratedColumn()
  @Index()
  public id: number;

  @Column('varchar')
  public title: string;

  @Column('text', {
    nullable: true,
  })
  public content: string;

  @Column('tinyint', {
    default: ArticleType.global,
  })
  public type: number;

  @Column('int', {
    nullable: true,
  })
  public bindId: number;

  @Column('tinyint', {
    default: 0,
  })
  public option: number;

  @Column('int')
  public owner: number;

  @Column('int')
  public group: number;

  @Column('tinyint', {
    default: ArticlePrivilege.comment
             + ArticlePrivilege.write
             + ArticlePrivilege.read,
  })
  public ownerPrivilege: number;

  @Column('tinyint', {
    default: ArticlePrivilege.comment
             + ArticlePrivilege.write
             + ArticlePrivilege.read,
  })
  public groupPrivilege: number;

  @Column('tinyint', {
    default: ArticlePrivilege.comment
             + ArticlePrivilege.read,
  })
  public worldPrivilege: number;

  @CreateDateColumn()
  public createdAt: string;

  @UpdateDateColumn()
  public updatedAt: string;

}
