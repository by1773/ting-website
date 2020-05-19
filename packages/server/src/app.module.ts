/*
 * @Descripttion: 
 * @version: 
 * @Author: by1773
 * @Date: 2020-03-31 17:32:55
 * @LastEditors: by1773
 * @LastEditTime: 2020-05-19 09:45:59
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// 鉴权模块
import { AuthModule } from './modules/auth/auth.module';
// 用户模块
import { UserModule } from './modules/user/user.module';
import { User } from './modules/user/user.entity';
// 文件模块
import { FileModule } from './modules/file/file.module';
import { File } from './modules/file/file.entity';
// 文章模块
import { ArticleModule } from './modules/article/article.module';
import { Article } from './modules/article/article.entity';
// 分类模块
import { CategoryModule } from './modules/category/category.module';
import { Category } from './modules/category/category.entity';
// 标签模块
import { TagModule } from './modules/tag/tag.module';
import { Tag } from './modules/tag/tag.entity';
// 评论模块
import { CommentModule } from './modules/comment/comment.module';
import { Comment } from './modules/comment/comment.entity';
// 系统模块
import { SettingModule } from './modules/setting/setting.module';
import { Setting } from './modules/setting/setting.entity';
// 邮件模块
import { SMTPModule } from './modules/smtp/smtp.module';
import { SMTP } from './modules/smtp/smtp.entity';
// 页面模块
import { PageModule } from './modules/page/page.module';
import { Page } from './modules/page/page.entity';
// 访问统计模块
import { ViewModule } from './modules/view/view.module';
import { View } from './modules/view/view.entity';
// 搜索模块
import { Search } from './modules/search/search.entity';
import { SearchModule } from './modules/search/search.module';
import { TestModule} from './modules/test/page.module'
// 配置文件
import { config } from './config';
// 项目管理
import { Project } from './modules/project/project.entity';
import { ProjectModule } from './modules/project/project.module';

@Module({
  imports: [
    // 数据库关系实体对应关系<链接数据库>  链接mysql数据库
    TypeOrmModule.forRoot({
      type: 'mysql',
      ...config.mysql,
      entities: [
        User,
        File,
        Tag,
        Article,
        Project,
        Category,
        Comment,
        Setting,
        SMTP,
        Page,
        View,
        Search,
      ],
      synchronize: true,
    }),
    UserModule,
    FileModule,
    TagModule,
    ArticleModule,
    ProjectModule,
    CategoryModule,
    CommentModule,
    SettingModule,
    SMTPModule,
    AuthModule,
    PageModule,
    ViewModule,
    SearchModule,
    TestModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
