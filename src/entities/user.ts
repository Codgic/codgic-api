/* /api/entities/user.ts */

// UNFINISHED!!!

import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import * as crypto from 'crypto';

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

  @Column('varchar')
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

  @CreateDateColumn()
  public createdAt: string;

  @UpdateDateColumn()
  public updatedAt: string;

  @Column('varchar')
  private password: string;

  @Column('varchar')
  private salt: string;

  public verifyPassword(retrievedPassword: string) {
    return this.password === crypto
                            .createHash('sha512')
                            .update(retrievedPassword + this.salt)
                            .digest('hex');
  }

  public async updatePassword(retrievedPassword: string) {
    try {
      crypto.randomBytes(32, (err, buf) => {
        if (err) {
          console.error(err);
          throw new Error('Failed to generate salt.');
        } else {
          this.salt = buf.toString('hex');
          this.password = crypto
                          .createHash('sha512')
                          .update(retrievedPassword + this.salt)
                          .digest('hex');
        }
      });

      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        });
      });
    } catch (err) {
      return new Promise((reject) => {
        setTimeout(() => {
          reject({
            error: err.message,
          });
        });
      });
    }
  }

}
