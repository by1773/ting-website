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
  Request,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';
import { UserService } from '../user/user.service';
import { ProjectService } from './project.service';
import { Project } from './project.entity';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@Controller('project')
@ApiTags('项目管理')
@UseGuards(RolesGuard)
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,

    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) {}

  /**
   * 创建项目
   * @param article
   */
  @Post()
  @Roles('admin')
  @ApiOperation({summary:'创建文章'})
  @UseGuards(JwtAuthGuard)
  create(@Body() article) {
    return this.projectService.create(article);
  }

  /**
   * 获取所有项目
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({summary:'获取所有项目'})
  findAll(@Query() queryParams) {
    return this.projectService.findAll(queryParams);
  }

  /**
   * 获取标签下所有项目
   */
  @Get('/category/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({summary:'获取标签下所有项目'})
  findArticlesByCategory(@Param('id') category, @Query() queryParams) {
    return this.projectService.findProjectsByCategory(category, queryParams);
  }

  /**
   * 获取标签下所有文章
   */
  @Get('/tag/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({summary:'获取标签下所有项目'})
  findArticlesByTag(@Param('id') tag, @Query() queryParams) {
    return this.projectService.findProjectsByTag(tag, queryParams);
  }

  /**
   * 获取所有项目归档
   */
  @Get('/archives')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({summary:'获取所有项目归档'})
  getArchives(): Promise<{ [key: string]: Project[] }> {
    return this.projectService.getArchives();
  }

  /**
   * 推荐项目
   */
  @Get('/recommend')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({summary:'推荐项目'})
  recommend(@Query('articleId') articleId) {
    return this.projectService.recommend(articleId);
  }

  /**
   * 获取指定项目
   * @param id
   */
  @Get(':id')
  @ApiOperation({summary:'获取指定项目'})
  async findById(@Request() req, @Param('id') id, @Query('status') status) {
    let token = req.headers.authorization;

    if (/Bearer/.test(token)) {
      // 不需要 Bearer，否则验证失败
      token = token.split(' ').pop();
    }

    try {
      const tokenUser = this.jwtService.decode(token) as any;
      const userId = tokenUser.id;
      const exist = await this.userService.findById(userId);
      const isAdmin = userId && exist.role === 'admin';
      return this.projectService.findById(id, status, isAdmin);
    } catch (e) {
      return this.projectService.findById(id, status);
    }
  }

  /**
   * 校验项目密码
   * @param id
   * @param article
   */
  @Post(':id/checkPassword')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({summary:'校验项目密码'})
  checkPassword(@Param('id') id, @Body() article) {
    return this.projectService.checkPassword(id, article);
  }

  /**
   *项目访问量 +1
   */
  @Post(':id/views')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({summary:'项目访问量'})
  updateViewsById(@Param('id') id) {
    return this.projectService.updateViewsById(id);
  }

  /**
   * 更新文章
   * @param id
   * @param article
   */
  @Patch(':id')
  @Roles('admin')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({summary:'更新项目'})
  updateById(@Param('id') id, @Body() article) {
    return this.projectService.updateById(id, article);
  }

  /**
   * 删除文章
   * @param id
   */
  @Delete(':id')
  @Roles('admin')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({summary:'删除项目'})
  deleteById(@Param('id') id) {
    return this.projectService.deleteById(id);
  }
}
