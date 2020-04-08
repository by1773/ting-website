import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { NextPage } from 'next';
import Router from 'next/router';
import Link from 'next/link';
import cls from 'classnames';
import Viewer from 'viewerjs';
import { Modal, Form, Input, message } from 'antd';
import * as dayjs from 'dayjs';
import hljs from 'highlight.js';
import { ArticleProvider } from '@providers/article';
import { CommentAndRecommendArticles } from '@components/CommentAndRecommendArticles';
import style from './index.module.scss';
const url = require('url');

interface IProps {
  article: IArticle;
}

const Article: NextPage<IProps> = props => {
  const { setting = {}, article } = props as any;
  const ref = useRef(null);
  const content = useRef(null);
  const [password, setPassword] = useState(null);
  const [shouldCheckPassWord, setShouldCheckPassword] = useState(
    article && article.needPassword
  );

  // 检查文章密码
  const checkPassWord = useCallback(() => {
    ArticleProvider.checkPassword(article.id, password).then(res => {
      if (res.pass) {
        Object.assign(article, res);
        setShouldCheckPassword(false);
      } else {
        message.error('密码错误');
        setShouldCheckPassword(true);
      }
    });
  }, [article.id, password]);

  const back = useCallback(() => {
    Router.push('/');
  }, []);

  useEffect(() => {
    setShouldCheckPassword(article && article.needPassword);
  }, [article.id]);

  // 更新阅读量
  useEffect(() => {
    if (!shouldCheckPassWord) {
      ArticleProvider.updateArticleViews(article.id);
    }
  }, [shouldCheckPassWord]);

  // 高亮
  useEffect(() => {
    if (!shouldCheckPassWord) {
      hljs.initHighlightingOnLoad();
      hljs.highlightBlock(ref.current);
    }
  }, [shouldCheckPassWord]);

  // 大图插件
  useEffect(() => {
    if (!shouldCheckPassWord) {
      new Viewer(ref.current, { inline: false });
    }
  }, [shouldCheckPassWord]);

  return (
    <div>
      {/* S 密码检验 */}
      <Modal
        title="文章受保护，请输入访问密码"
        cancelText={'回首页'}
        okText={'确认'}
        visible={shouldCheckPassWord}
        onOk={checkPassWord}
        onCancel={back}
      >
        <Form.Item label={'密码'}>
          <Input.Password
            value={password}
            onChange={e => {
              setPassword(e.target.value);
            }}
          />
        </Form.Item>
      </Modal>
      {/* E 密码检验 */}

      <div>
        <Helmet>
          <title>{article.title + ' | ' + setting.systemTitle}</title>
        </Helmet>
        <article className={cls('container', style.container)}>
          {setting.systemUrl && (
            <meta
              itemProp="url"
              content={url.resolve(setting.systemUrl, `/article/${article.id}`)}
            />
          )}
          <meta itemProp="headline" content={article.title} />
          {article.tags && (
            <meta
              itemProp="keywords"
              content={article.tags.map(tag => tag.label).join(' ')}
            />
          )}
          <meta itemProp="dataPublished" content={article.publishAt} />
          {article.cover && <meta itemProp="image" content={article.cover} />}
          <div className={style.meta}>
            {article.cover && (
              <img className={style.cover} src={article.cover} alt="文章封面" />
            )}
            <h1 className={style.title}>{article.title}</h1>
            <p className={style.desc}>
              <span>
                发布于{' '}
                {dayjs.default(article.publishAt).format('YYYY-MM-DD HH:mm:ss')}
              </span>
              <span> • </span>
              <span>阅读量 {article.views}</span>
            </p>
          </div>
          <div className={style.contentWrapper} ref={content}>
            <div className={style.content}>
              <div
                ref={ref}
                className={cls('markdown', style.markdown)}
                dangerouslySetInnerHTML={{ __html: article.content }}
              ></div>
              <div className={style.articleFooter}>
                {article.tags && article.tags.length ? (
                  <div className={style.tags}>
                    <div>
                      <span>标签：</span>
                      {article.tags.map(tag => {
                        return (
                          <div className={style.tag} key={tag.id}>
                            <Link href={'/tag/[tag]'} as={'/tag/' + tag.value}>
                              <a>
                                <span>{tag.label}</span>
                              </a>
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
                <div>
                  版权信息：
                  <a
                    href="https://creativecommons.org/licenses/by-nc/3.0/cn/deed.zh"
                    target="_blank"
                  >
                    非商用-署名-自由转载
                  </a>
                </div>
              </div>
            </div>
          </div>
        </article>
        <CommentAndRecommendArticles
          articleId={article.id}
          isCommentable={article.isCommentable}
        />
      </div>
    </div>
  );
};

Article.getInitialProps = async ctx => {
  const { id } = ctx.query;
  const article = await ArticleProvider.getArticle(id);
  return { article };
};

export default Article;
