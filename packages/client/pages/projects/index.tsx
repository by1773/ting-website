import React, { useState, useCallback, useEffect } from 'react';
import { NextPage } from 'next';
import cls from 'classnames';
import InfiniteScroll from 'react-infinite-scroller';
import { ProjectProvider } from '@providers/project';
import { CategoryMenu } from '@components/CategoryMenu';
import { ProjectList } from '@components/ProjectList';
import { RecommendArticles } from '@components/RecommendArticles';
import { Tags } from '@components/Tags';
import { Footer } from '@components/Footer';
import style from './index.module.scss';

interface IHomeProps {
  articles: IArticle[];
  total: number;
}

const pageSize = 12;

const Home: NextPage<IHomeProps> = props => {
  const {
    articles: defaultArticles = [],
    total = 0,
    setting = {},
    categories = [],
    tags = [],
    scope = 1,
  } = props as any;
  const [affix, setAffix] = useState(false);
  const [page, setPage] = useState(1);
  const [articles, setArticles] = useState<IArticle[]>(defaultArticles);

  useEffect(() => {
    const handler = () => {
      const y = (window as any).scrollY;
      setAffix(y > 100);
    };

    document.addEventListener('scroll', handler);

    return () => {
      document.removeEventListener('scroll', handler);
    };
  }, []);

  useEffect(() => {
    setArticles(defaultArticles);
  }, [defaultArticles]);

  const getArticles = useCallback(page => {
    ProjectProvider.getArticles({
      page,
      pageSize,
      status: 'publish',
    }).then(res => {
      setPage(page);
      setArticles(articles => [...articles, ...res[0]]);
    });
  }, []);

  return (
    <div className={style.wrapper}>
      <CategoryMenu categories={categories} scope={scope}/>
      <div className={cls('container', style.container)}>
        <div className={style.content}>
          <InfiniteScroll
            pageStart={1}
            loadMore={getArticles}
            hasMore={page * pageSize < total}
            loader={
              <div className={style.loading} key={0}>
                正在获取项目...
              </div>
            }
          >
            <ProjectList articles={articles} />
          </InfiniteScroll>

          {/* <aside className={cls(style.aside)}>
            9999
            <div className={cls(affix ? style.isFixed : false)}>
              <RecommendArticles mode="inline" />
              <Tags tags={tags} />
              <Footer className={style.footer} setting={setting} />
            </div>
          </aside> */}
        </div>
      </div>
    </div>
  );
};

// 服务端预取数据
Home.getInitialProps = async () => {
  const [articles] = await Promise.all([
    ProjectProvider.getArticles({ page: 1, pageSize, status: 'publish' }),
  ]);
  console.log('=================',articles);
  
  return { articles: articles[0], total: articles[1], needLayoutFooter: false };
};

export default Home;
