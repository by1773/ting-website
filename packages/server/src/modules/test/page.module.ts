/*
 * @Descripttion: 
 * @version: 
 * @Author: by1773
 * @Date: 2020-04-07 15:21:37
 * @LastEditors: by1773
 * @LastEditTime: 2020-04-07 15:28:39
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { PageService } from './page.service';
import { PageController } from './page.controller';
import { Page } from './page.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Page]), AuthModule],
  exports: [PageService],
  providers: [PageService],
  controllers: [PageController],
})
export class TestModule {}
