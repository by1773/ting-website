/*
 * @Descripttion: 
 * @version: 
 * @Author: by1773
 * @Date: 2020-03-31 17:32:55
 * @LastEditors: by1773
 * @LastEditTime: 2020-05-15 11:13:08
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Article } from '../article/article.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  scope: string;

  @Column()
  label: string;

  @Column()
  value: string;

  @OneToMany(
    () => Article,
    article => article.category
  )
  articles: Array<Article>;

  @CreateDateColumn({
    type: 'datetime',
    comment: '创建时间',
    name: 'create_at',
  })
  createAt: Date;

  @UpdateDateColumn({
    type: 'datetime',
    comment: '更新时间',
    name: 'update_at',
  })
  updateAt: Date;
}
