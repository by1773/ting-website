/*
 * @Descripttion: 
 * @version: 
 * @Author: by1773
 * @Date: 2020-03-31 17:32:55
 * @LastEditors: by1773
 * @LastEditTime: 2020-04-02 14:59:48
 */
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { ApiProperty } from '@nestjs/swagger';
@Entity()
export class User {
  /**
   * 检测密码是否一致
   * @param password0 加密前密码
   * @param password1 加密后密码
   */
  static async comparePassword(password0, password1) {
    return bcrypt.compareSync(password0, password1);
  }

  static encryptPassword(password) {
    return bcrypt.hashSync(password, 10);
  }

  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: number;

  @Column({ length: 500 })
  @ApiProperty({
    description: 'The age of a cat',
    minimum: 1,
    default: 1,
  })
  name: string;

  @Exclude()
  @Column({ length: 500 })
  password: string;

  @Column({ length: 500, default: null })
  @ApiProperty({
    
  })
  avatar: string; // 头像

  @Column({ length: 500, default: null })
  @ApiProperty()
  email: string; // 邮箱

  @Column('simple-enum', { enum: ['admin', 'visitor'], default: 'visitor' })
  @ApiProperty()
  role: string; // 用户角色

  @Column('simple-enum', { enum: ['locked', 'active'], default: 'active' })
  @ApiProperty()
  status: string; // 用户状态

  @CreateDateColumn({
    type: 'datetime',
    comment: '创建时间',
    name: 'create_at',
  })
  @ApiProperty()
  createAt: Date;

  @UpdateDateColumn({
    type: 'datetime',
    comment: '更新时间',
    name: 'update_at',
  })
  updateAt: Date;

  /**
   * 插入数据前，对密码进行加密
   */
  @BeforeInsert()
  encrypt() {
    this.password = bcrypt.hashSync(this.password, 10);
  }
}
