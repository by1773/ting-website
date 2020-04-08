/*
 * @Descripttion: 这是系统设置控制器
 * @version: 
 * @Author: by1773
 * @Date: 2020-03-31 17:32:55
 * @LastEditors: by1773
 * @LastEditTime: 2020-04-02 15:24:02
 */
import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { SettingService } from './setting.service';
import { Setting } from './setting.entity';
import { UserService } from '../user/user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@Controller('setting')
@UseGuards(RolesGuard)
@ApiTags('系统设置管理')
export class SettingController {
  constructor(
    private readonly settingService: SettingService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) {}

  /**
   * 更新设置
   * @param tag
   */
  @Post()
  @Roles('admin')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({summary:'更新设置'})
  update(@Body() setting) {
    return this.settingService.update(setting);
  }

  /**
   * 获取设置
   */
  @Post('/get')
  @ApiOperation({summary:'获取设置'})
  @HttpCode(HttpStatus.OK)
  async findAll(@Request() req): Promise<Setting> {
    let token = req.headers.authorization;

    if (/Bearer/.test(token)) {
      // 不需要 Bearer，否则验证失败
      token = token.split(' ').pop();
    }

    try {
      const tokenUser = this.jwtService.decode(token) as any;
      const id = tokenUser.id;
      const exist = await this.userService.findById(id);
      const isAdmin = id && exist.role === 'admin';
      return this.settingService.findAll(false, isAdmin);
    } catch (e) {
      return this.settingService.findAll(false, false);
    }
  }
}
