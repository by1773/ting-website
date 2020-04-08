/*
 * @Descripttion: 
 * @version: 
 * @Author: by1773
 * @Date: 2020-03-31 17:32:55
 * @LastEditors: by1773
 * @LastEditTime: 2020-04-02 15:25:17
 */
import {
  Controller,
  Get,
  Delete,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';
// import { client } from './elasticsearch.client';
import { SearchService } from './search.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@Controller('search')
@UseGuards(RolesGuard)
@ApiTags('搜索管理')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  /**
   * 搜索文章
   * @param keyword
   */
  @Get('/article')
  @ApiOperation({summary:'搜索文章'})
  async searchArticle(@Query('keyword') keyword) {
    const data = await this.searchService.searchArticle('article', keyword);
    return data;
  }

  /**
   * 获取搜索记录
   */
  @Get('/')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({summary:'获取搜索记录'})
  async findAll(@Query() queryParam) {
    return this.searchService.findAll(queryParam);
  }

  /**
   * 删除文件
   * @param id
   */
  @Delete(':id')
  @Roles('admin')
  @ApiOperation({summary:'删除文件'})
  @UseGuards(JwtAuthGuard)
  deleteById(@Param('id') id) {
    return this.searchService.deleteById(id);
  }
}
