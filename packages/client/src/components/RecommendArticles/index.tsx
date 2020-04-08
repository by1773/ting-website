import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { ArticleProvider } from '@providers/article';
import { ArticleList } from '@components/ArticleList';
import { format } from 'timeago.js';
import style from './index.module.scss';

interface IProps {
  articleId?: string;
  mode?: 'inline' | 'vertical';
  needTitle?: boolean;
  asCard?: boolean;
}

export const RecommendArticles: React.FC<IProps> = ({
  mode = 'vertical',
  articleId = null,
  needTitle = true,
  asCard = false,
}) => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    ArticleProvider.getRecommend(articleId).then(res => {
      setArticles(res);
    });
  }, [articleId]);

  return (
    <div className={style.wrapper}>
      {needTitle && <div className={style.title}>推荐文章</div>}
      {mode === 'inline' ? (
        <ul>
          {(articles || []).map(article => {
            return (
              <li key={article.id}>
                <div>
                  <Link href={`/article/[id]`} as={`/article/${article.id}`}>
                    <a>
                      <p className={style.articleTitle}>
                        <strong>{article.title}</strong>
                        {' · '}
                        <span>{format(article.publishAt, 'zh_CN')}</span>
                      </p>
                    </a>
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <ArticleList articles={articles || []} asCard={asCard} />
      )}
    </div>
  );
};
