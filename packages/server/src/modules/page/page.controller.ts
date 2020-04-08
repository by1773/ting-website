/*
 * @Descripttion: 
 * @version: 
 * @Author: by1773
 * @Date: 2020-03-31 17:32:55
 * @LastEditors: by1773
 * @LastEditTime: 2020-04-02 15:30:14
 */
import {
  Controller,
  Get,
  HttpStatus,
  HttpCode,
  Post,
  Delete,
  Patch,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';
import { PageService } from './page.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@Controller('page')
@UseGuards(RolesGuard)
@ApiTags('页面管理')
export class PageController {
  constructor(private readonly pageService: PageService) {}

  /**
   * 创建页面
   * @param page
   */
  @Post()
  @Roles('admin')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({summary:'创建页面'})
  create(@Body() page) {
    return this.pageService.create(page);
  }

  /**
   * 获取所有文章
   */
  @Get()
  @ApiOperation({summary:'获取所有文章'})
  findAll(@Query() queryParams) {
    return this.pageService.findAll(queryParams);
  }

  /**
   * 获取指定页面
   * @param id
   */
  @Get(':id')
  @ApiOperation({summary:'根据id获取指定页面'})
  findById(@Param('id') id) {
    return this.pageService.findById(id);
  }

  /**
   * 更新页面
   * @param id
   * @param page
   */
  @Patch(':id')
  @Roles('admin')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({summary:'更新页面'})
  updateById(@Param('id') id, @Body() page) {
    return this.pageService.updateById(id, page);
  }

  /**
   * 文章访问量 +1
   */
  @Post(':id/views')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({summary:'文章访问量'})
  updateViewsById(@Param('id') id) {
    return this.pageService.updateViewsById(id);
  }

  /**
   * 删除文章
   * @param id
   */
  @Delete(':id')
  @Roles('admin')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({summary:'删除文章'})
  deleteById(@Param('id') id) {
    return this.pageService.deleteById(id);
  }
}
