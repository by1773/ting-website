/*
 * @Descripttion: 
 * @version: 
 * @Author: by1773
 * @Date: 2020-03-31 17:32:55
 * @LastEditors: by1773
 * @LastEditTime: 2020-04-02 15:38:48
 */
import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  UseGuards,
  Body,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';
import { ViewService } from './view.service';
import { View } from './view.entity';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

function getClientIP(req) {
  const ip =
    req.headers['x-real-ip'] ||
    req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
    (req.connection && req.connection.remoteAddress) || // 判断 connection 的远程 IP
    (req.socket && req.socket.remoteAddress) || // 判断后端的 socket 的 IP
    (req.connection &&
      req.connection.socket &&
      req.connection.socket.remoteAddress);

  return ip.split(':').pop();
}

@Controller('view')
@UseGuards(RolesGuard)
@ApiTags('页面管理')
export class ViewController {
  constructor(private readonly viewService: ViewService) {}

  /**
   * 添加访问
   * @param tag
   */
  @Post()
  @ApiOperation({summary:'添加访问'})
  create(@Request() req, @Body() data) {
    const userAgent = req.headers['user-agent'];
    const url = data.url;
    return this.viewService.create(getClientIP(req), userAgent, url);
  }

  /**
   * 获取所有访问
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({summary:'获取所有访问'})
  findAll(@Query() queryParam) {
    return this.viewService.findAll(queryParam);
  }

  /**
   * 获取指定访问
   * @param id
   */
  @Get('/url')
  @ApiOperation({summary:'获取指定访问'})
  findByUrl(@Query('url') url) {
    return this.viewService.findByUrl(url);
  }

  /**
   * 获取指定访问
   * @param id
   */
  @Get(':id')
  @ApiOperation({summary:'获取指定访问'})
  @UseGuards(JwtAuthGuard)
  findById(@Param('id') id) {
    return this.viewService.findById(id);
  }

  /**
   * 删除访问
   * @param id
   */
  @Delete(':id')
  @Roles('admin')
  @ApiOperation({summary:'删除访问'})
  @UseGuards(JwtAuthGuard)
  deleteById(@Param('id') id) {
    return this.viewService.deleteById(id);
  }
}
