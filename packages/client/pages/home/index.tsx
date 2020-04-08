import React from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import cls from 'classnames';
import { Input, Carousel } from 'antd';
import * as dayjs from 'dayjs';
import { ArticleProvider } from '@providers/article';
import { RecommendArticles } from '@components/RecommendArticles';
import { Tags } from '@components/Tags';
import style from './index.module.scss';
const { Search } = Input;
interface IProps {
  articles: { [key: string]: { [key: string]: IArticle[] } };
}

const ArchiveItem = ({ month, articles = [] }) => {
  return (
    <div className={style.item}>
      <h3>{month}</h3>
      <ul>
        {articles.map(article => (
          <li key={article.id}>
            <Link href={`/article/[id]`} as={`/article/${article.id}`}>
              <a>
                <span className={style.meta}>
                  {dayjs.default(article.publishAt).format('MM-DD')}
                </span>
                <span className={style.title}>{article.title}</span>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Archives: NextPage<IProps> = props => {
  const { articles = [], tags = [] } = props as any;
  // let map = new MapProvider('map')
  return (
    <div className={style.wrapper}>
      <div className={style.index_background}>
        <Carousel effect="fade" autoplay>
          <div>
            <img src="/static/images/home_bg_01.jpg" alt=""/>
          </div>
          <div>
          <img src="/static/images/home_bg_02.jpg" alt=""/>
          </div>
          <div>
          <img src="/static/images/home_bg_02.jpg" alt=""/>
          </div>
          <div>
          <img src="/static/images/home_bg_01.jpg" alt=""/>
          </div>
        </Carousel>
      </div>
      <div className={cls('container', style.container)}>
        <div className={style.index_box}>
          <div className={style.title}>优画，陪你做生活的设计师</div>
          <div className={style.description}>
            现在每天超过 100 专业画师和生活的设计师们使用
          <a href="/about/goodies/">优话浏览器采集工具</a>
          从全球网站采集超过 200 万灵感图片，在优画上线以来，
          已有超过 20 亿的采集被数千万优画用户采集到优画上，他们是优画真正的创造者。
          </div>
          <div className={style.search_box}>
            <Search
              placeholder="每天超过 3000 人次通过优画搜索灵感"
              onSearch={value => console.log(value)}
              style={{ width: 536, height: 40 }} />
          </div>
          <div className={style.explore_tags_index}>
            <div className={style.explore_tags_box}>
              <ul className={style.explore_tags}>
                <li>
                  <a
                    className={cls(style.explore_tag, style.fixed_tag)}
                    href="/discovery/">最新</a>
                </li>
                <li><a className={style.explore_tag} href="/explore/fangzhenhua">仿真</a>
                </li>
                <li><a className={style.explore_tag} href="/explore/baijian">摆件</a>
                </li>
                <li><a className={style.explore_tag} href="/explore/sailormoon">风景</a>
                </li>
                <li><a className={style.explore_tag} href="/explore/baisefenggezhuangxiu">建筑</a>
                </li>
                <li><a className={style.explore_tag} href="/explore/oushiketing">人物</a></li>
                <li><a className={style.explore_tag} href="/explore/naruto">写生</a></li>
                <li><a className={style.explore_tag} href="/explore/fanggujiaju">古典</a></li>
                <li><a className={style.explore_tag} href="/explore/oushiketing">现代</a></li>
                <li><a className={style.explore_tag} href="/explore/naruto">印象</a></li>
                <li><a className={style.explore_tag} href="/explore/fanggujiaju">家居</a></li>
              </ul>
              <div className={style.clear_float}></div>
              <div className={style.explore_refresh}>
                <a className={style.refresh}>
                  <i className={style.icon}></i>
                  <span>换一批</span></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 服务端预取数据
Archives.getInitialProps = async () => {
  const articles = await ArticleProvider.getArchives();
  return { articles, needLayoutFooter: false };
};

export default Archives;
