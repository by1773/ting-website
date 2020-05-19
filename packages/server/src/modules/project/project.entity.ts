/*
 * @Descripttion: 
 * @version: 
 * @Author: by1773
 * @Date: 2020-05-19 09:33:53
 * @LastEditors: by1773
 * @LastEditTime: 2020-05-19 11:30:37
 */ 
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import { Tag } from '../tag/tag.entity';
import { Category } from '../category/category.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;    //id

  @Column()
  title: string;  //标题

  @Column({ default: null })
  cover: string; // 封面图

  @Column({ type: 'text', default: null })
  summary: string; // 摘要，自动生成

  @Column({ type: 'mediumtext', default: null, charset: 'utf8mb4' })
  content: string; // 原始内容----项目描述

  @ManyToOne(
    () => Category,
    category => category.articles,
    { cascade: true }
  )
  
  @JoinTable()
  category: Category;

  @ManyToMany(
    () => Tag,
    tag => tag.articles,
    { cascade: true }
  )
  @JoinTable()
  tags: Array<Tag>;
  @Column()
  codeUrl:string;//项目代码地址
  @Column()
  viewUrl:string;//预览地址
  @Column()
  date:string;  //项目时间
  @Column()
  scale:string; //项目规模
  @Column('simple-enum', { enum: ['draft', 'publish'] })
  status: string; // 项目状态

  @Column({ type: 'int', default: 0 })
  views: number; // 阅读量

  @Column({ type: 'text', default: null, select: false })
  password: string;

  @Column({ type: 'boolean', default: false })
  needPassword: boolean;

  @Column({ type: 'boolean', default: true })
  isCommentable: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  publishAt: Date; // 发布日期

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
