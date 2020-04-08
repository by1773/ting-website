/*
 * @Descripttion: 
 * @version: 
 * @Author: by1773
 * @Date: 2020-03-31 17:32:55
 * @LastEditors: by1773
 * @LastEditTime: 2020-04-02 15:33:20
 */
import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@Controller('file')
@UseGuards(RolesGuard)
@ApiTags('文件管理')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  /**
   * 上传文件
   * @param file
   */
  @Post('upload')
  @ApiOperation({summary:'文件上传'})
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fieldSize: 50 * 1024 * 1024,
      },
    })
  )
  @UseGuards(JwtAuthGuard)
  uploadFile(@UploadedFile() file) {
    return this.fileService.uploadFile(file);
  }

  /**
   * 获取所有文件
   */
  @Get()
  @ApiOperation({summary:'获取所有文件'})
  findAll(@Query() queryParam) {
    return this.fileService.findAll(queryParam);
  }

  /**
   * 获取指定文件
   * @param id
   */
  @Get(':id')
  @ApiOperation({summary:'获取指定文件'})
  findById(@Param('id') id) {
    return this.fileService.findById(id);
  }

  /**
   * 删除文件   只有admin角色才可以删除
   * @param id
   */
  @Delete(':id') 
  @Roles('admin')
  @ApiOperation({summary:'删除文件'})
  @UseGuards(JwtAuthGuard)
  deleteById(@Param('id') id) {
    return this.fileService.deleteById(id);
  }
}
