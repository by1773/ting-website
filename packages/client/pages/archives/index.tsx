import React from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import cls from 'classnames';
import { Row, Col } from 'antd';
import * as dayjs from 'dayjs';
import { ArticleProvider } from '@providers/article';
import { RecommendArticles } from '@components/RecommendArticles';
import { Tags } from '@components/Tags';
import style from './index.module.scss';

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

  return (
    <div className={style.wrapper}>
      <div className={cls('container', style.container)}>
        <Row>
          <Col sm={16} className={style.main}>
            <div className={style.content}>
              {Object.keys(articles).map(year => {
                return (
                  <div className={style.list}>
                    <h2>{year}</h2>
                    {Object.keys(articles[year]).map(month => {
                      return (
                        <ArchiveItem
                          key={year}
                          month={month}
                          articles={articles[year][month]}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </Col>
          <Col sm={8} className={style.aside}>
            <RecommendArticles mode="inline" />
            <Tags tags={tags} />
          </Col>
        </Row>
      </div>
    </div>
  );
};

// 服务端预取数据
Archives.getInitialProps = async () => {
  const articles = await ArticleProvider.getArchives();
  return { articles };
};

export default Archives;
