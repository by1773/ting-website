/*
 * @Descripttion: 
 * @version: 
 * @Author: by1773
 * @Date: 2020-03-31 17:32:55
 * @LastEditors: by1773
 * @LastEditTime: 2020-04-02 15:22:25
 */
import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';
import { SMTPService } from './smtp.service';
import { SMTP } from './smtp.entity';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@Controller('smtp')
@UseGuards(RolesGuard)
@ApiTags('邮件管理')
export class SMTPController {
  constructor(private readonly smtpService: SMTPService) {}

  /**
   * 发送邮件
   * @param data
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({summary:'发送邮件'})
  create(@Body() data) {
    return this.smtpService.create(data);
  }

  /**
   * 获取所有邮件记录
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({summary:'获取所有邮件记录'})
  findAll(@Query() queryParam) {
    return this.smtpService.findAll(queryParam);
  }

  /**
   * 删除邮件记录
   * @param id
   */
  @Delete(':id')
  @Roles('admin')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({summary:'删除邮件记录'})
  deleteById(@Param('id') id) {
    return this.smtpService.deleteById(id);
  }
}
