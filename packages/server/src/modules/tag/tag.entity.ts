/*
 * @Descripttion: 
 * @version: 
 * @Author: by1773
 * @Date: 2020-03-31 17:32:55
 * @LastEditors: by1773
 * @LastEditTime: 2020-05-15 11:30:40
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Article } from '../article/article.entity';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  scope: string;
  @Column()
  label: string;

  @Column()
  value: string;

  @ManyToMany(
    () => Article,
    article => article.tags
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
