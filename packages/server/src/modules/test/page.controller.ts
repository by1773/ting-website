/*
 * @Descripttion: 
 * @version: 
 * @Author: by1773
 * @Date: 2020-03-31 17:32:55
 * @LastEditors: by1773
 * @LastEditTime: 2020-04-07 15:23:49
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

@Controller('test')
@UseGuards(RolesGuard)
@ApiTags('测试管理')
export class PageController {
  constructor(private readonly pageService: PageService) {}



  /**
   * 获取所有文章
   */
  @Get('data')
  @ApiOperation({summary:'获取所有文章'})
  findAll(@Query() queryParams) {
    // return this.pageService.findAll(queryParams);
    return [
      {
        "w": "w1",
        "src": "/static/images/a.jpg",
        "brand": "衣香丽影",
        "title": "夏日潮女必备",
        "count": "38"
      },{
        "w": "w1",
        "src": "/static/images/b.jpg",
        "brand": "BUOU BUOU",
        "title": "摩登裙正流行",
        "count": "38"
      },{
        "w": "w2",
        "src": "/static/images/c.jpg",
        "brand": "埃斯普利特",
        "title": "经典旅行穿搭",
        "count": "38"
      },{
        "w": "w1",
        "src": "/static/images/d.jpg",
        "brand": "音儿",
        "title": "经选蕾丝衫情",
        "count": "38"
      },{
        "w": "w1",
        "src": "/static/images/e.jpg",
        "brand": "BUOU BUOU",
        "title": "文艺青年必备",
        "count": "38"
      },{
        "w": "w1",
        "src": "/static/images/f.jpg",
        "brand": "秋水伊人",
        "title": "蕾丝还是蕾丝",
        "count": "38"
      },{
        "w": "w1",
        "src": "/static/images/g.jpg",
        "brand": "white collar",
        "title": "穿出你的色彩",
        "count": "38"
      },{
        "w": "w2",
        "src": "/static/images/h.jpg",
        "brand": "PEACEBIRD",
        "title": "梦幻的时光机",
        "count": "38"
      },{
        "w": "w1",
        "src": "/static/images/i.jpg",
        "brand": "Five Plus",
        "title": "潮流新趋势",
        "count": "38"
      },{
        "w": "w1",
        "src": "/static/images/j.jpg",
        "brand": "INMAN",
        "title": "夏日潮女必备",
        "count": "38"
      },{
        "w": "w2",
        "src": "/static/images/k.jpg",
        "brand": "BELLE MAISON",
        "title": "春夏潮流搭配",
        "count": "38"
      },{
        "w": "w1",
        "src": "/static/images/l.jpg",
        "brand": "韩都衣舍",
        "title": "变身夏日新宠",
        "count": "38"
      },{
        "w": "w1",
        "src": "/static/images/m.jpg",
        "brand": "蔻驰",
        "title": "经典永不落幕",
        "count": "38"
      },{
        "w": "w1",
        "src": "/static/images/n.jpg",
        "brand": "裂帛",
        "title": "朦胧诱惑新感觉",
        "count": "38"
      },{
        "w": "w2",
        "src": "/static/images/subjectc10585.jpg",
        "title": "碎花浪漫",
        "count": "16",
        "brand": "Lesies/蓝色倾情"
      },{
        "w": "w1",
        "src": "/static/images/subjectc10364.jpg",
        "title": "乐町.流行热看点の最搭配",
        "count": "38",
        "brand": "leding/乐町"
      },{
        "w": "w1",
        "src": "/static/images/subjectc10674.jpg",
        "title": "三彩盛夏清色调",
        "count": "12",
        "brand": "三彩"
      },{
        "w": "w1",
        "src": "/static/images/subjectc10831.jpg",
        "productPicUrl": "/static/images/subjectc10831(1).jpg",
        "title": "假两件 享受变化的美感",
        "count": "12",
        "brand": "INMAN茵曼/茵曼"
      },{
        "w": "w2",
        "src": "/static/images/subjectc10116.jpg",
        "title": "OSA没有图纹就辜负夏天",
        "count": "35",
        "brand": "OSA/欧莎"
      },{
        "w": "w1",
        "src": "/static/images/subjectc10975.jpg",
        "title": "这个季节，我要惊艳全城",
        "count": "11",
        "brand": "JUST MODE"
      },{
        "w": "w1",
        "src": "/static/images/subjectc10466.jpg",
        "title": "停不下的美梦",
        "count": "16",
        "brand": "粉红大布娃娃"
      },{
        "w": "w1",
        "src": "/static/images/subjectc9810.jpg",
        "title": "棉意",
        "brandPicUrl": "",
        "count": "21",
        "brand": "LESS"
      },{
        "w": "w2",
        "src": "/static/images/subjectc10861.jpg",
        "productPicUrl": "/static/images/subjectc10861(1).jpg",
        "title": "七分裤装白色单品系列",
        "count": "12",
        "brand": "Ming Mei Fashion/名美服饰"
      },{
        "w": "w1",
        "src": "/static/images/subjectc10777.jpg",
        "title": "新潮的蕾丝系列",
        "count": "12",
        "brand": "Oece"
      },{
        "w": "w1",
        "src": "/static/images/subjectc11083.jpg",
        "title": "青春甜美！",
        "count": "13",
        "brand": "EMINU/依米奴"
      },{
        "w": "w1",
        "src": "/static/images/subjectc10280.jpg",
        "productPicUrl": "/static/images/subjectc10280(1).jpg",
        "title": "MOCo.桑蚕丝",
        "count": "19",
        "brand": "摩珂/Mo＆Co．"
      },{
        "w": "w1",
        "src": "/static/images/subjectc10885.jpg",
        "title": "礼尚自由的小礼服",
        "count": "12",
        "brand": "LieBo/裂帛"
      },{
        "w": "w1",
        "src": "/static/images/subjectc10753.jpg",
        "title": "玩转色彩几何",
        "count": "16",
        "brand": "STYLEWOMAN/白翎风采"
      },{
        "w": "w1",
        "src": "/static/images/subjectc9953.jpg",
        "title": "裙子的夏时光",
        "count": "17",
        "brand": "初语"
      }]
  }






}
