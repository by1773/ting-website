/*
 * @Descripttion: 
 * @version: 
 * @Author: by1773
 * @Date: 2020-05-19 09:33:53
 * @LastEditors: by1773
 * @LastEditTime: 2020-05-19 09:40:35
 */ 
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { ProjectService } from './project.service';
import { TagModule } from '../tag/tag.module';
import { CategoryModule } from '../category/category.module';
import {  ProjectController } from './project.controller';
import { Project } from './project.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project]),
    CategoryModule,
    TagModule,
    UserModule,
    AuthModule,
  ],
  exports: [ProjectService],
  providers: [ProjectService],
  controllers: [ProjectController],
})
export class ProjectModule {}
