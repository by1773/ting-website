import React, { useEffect, useRef } from 'react';
import { NextPage } from 'next';
import { Helmet } from 'react-helmet';
import hljs from 'highlight.js';
import Viewer from 'viewerjs';
import { CommentAndRecommendArticles } from '@components/CommentAndRecommendArticles';
import { PageProvider } from '@providers/page';
import style from './index.module.scss';

interface IProps {
  page: IPage;
}

const Page: NextPage<IProps> = props => {
  const { setting = {}, page } = props as any;

  const ref = useRef(null);

  // 更新阅读量
  useEffect(() => {
    PageProvider.updatePageViews(page.id);
  }, []);

  // 高亮
  useEffect(() => {
    if (ref.current) {
      hljs.initHighlightingOnLoad();
      hljs.highlightBlock(ref.current);
    }
  }, []);

  // 大图插件
  useEffect(() => {
    new Viewer(ref.current, { inline: false });
  }, []);

  return (
    <div>
      {!page ? (
        <div className="container">
          <p>页面不存在</p>
        </div>
      ) : (
        <div className={style.container}>
          <Helmet>
            <title>{page.name + ' | ' + setting.systemTitle}</title>
          </Helmet>
          <div className="container">
            {page.cover && (
              <div className={style.meta}>
                <img className={style.cover} src={page.cover} alt="文章封面" />
              </div>
            )}
            <div className={style.content}>
              <div
                ref={ref}
                className={'markdown'}
                dangerouslySetInnerHTML={{ __html: page.content }}
              ></div>
            </div>
          </div>
          <CommentAndRecommendArticles pageId={page.id} isCommentable={true} />
        </div>
      )}
    </div>
  );
};

Page.getInitialProps = async ctx => {
  const { id } = ctx.query;
  const page = await PageProvider.getPage(id);
  return { page };
};

export default Page;
