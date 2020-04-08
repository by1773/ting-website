/*
 * @Descripttion: 这是标签管理控制器
 * @version: 
 * @Author: by1773
 * @Date: 2020-03-31 17:32:55
 * @LastEditors: by1773
 * @LastEditTime: 2020-04-02 15:20:41
 */
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';
import { TagService } from './tag.service';
import { Tag } from './tag.entity';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@Controller('tag')
@UseGuards(RolesGuard)
@ApiTags('标签管理')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  /**
   * 添加标签
   * @param tag
   */
  @Post()
  @Roles('admin')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary:'新增标签'  })
  create(@Body() tag) {
    return this.tagService.create(tag);
  }

  /**
   * 获取所有标签
   */
  @Get()
  @ApiOperation({ summary:'查询标签'  })
  findAll(): Promise<Tag[]> {
    return this.tagService.findAll();
  }

  /**
   * 获取指定标签
   * @param id
   */
  @Get(':id')
  @ApiOperation({ summary:'根据ID获取指定标签'  })
  findById(@Param('id') id) {
    return this.tagService.findById(id);
  }

  /**
   * 获取指定标签，包含相关文章信息
   * @param id
   */
  @Get(':id/article')
  @ApiOperation({ summary:'获取指定标签所有内容'  })
  getArticleById(@Param('id') id, @Query('status') status) {
    return this.tagService.getArticleById(id, status);
  }

  /**
   * 更新标签
   * @param id
   * @param tag
   */
  @Patch(':id')
  @Roles('admin')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary:'更具ID更新标签'  })
  updateById(@Param('id') id, @Body() tag) {
    return this.tagService.updateById(id, tag);
  }

  /**
   * 删除标签
   * @param id
   */
  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary:'删除标签'  })
  @UseGuards(JwtAuthGuard)
  deleteById(@Param('id') id) {
    return this.tagService.deleteById(id);
  }
}
