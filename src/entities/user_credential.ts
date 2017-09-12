/* /src/entities/user_credential.ts
  Password and salt are stored separately here. */

import * as crypto from 'crypto';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  UpdateDateColumn,
} from 'typeorm';

import { User } from './user';

@Entity()
export class UserCredential {

  @OneToOne(() => User, {
    primary: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'id',
    referencedColumnName: 'id',
  })
  @Index()
  public user: User;

  @CreateDateColumn()
  public createdAt: string;

  @UpdateDateColumn()
  public updatedAt: string;

  @Column('varchar')
  private password: string;

  @Column('varchar')
  private salt: string;

  public async verifyPassword(retrievedPassword: string) {
    return this.password === crypto
      .createHash('sha512')
      .update(retrievedPassword + this.salt)
      .digest('hex');
  }

  public async updatePassword(retrievedPassword: string) {
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
    return true;
  }

}
