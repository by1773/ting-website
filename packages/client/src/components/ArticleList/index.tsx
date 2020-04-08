import React from "react";
import Link from "next/link";
import cls from "classnames";
import LazyLoad from "react-lazyload";
import * as dayjs from "dayjs";
import style from "./index.module.scss";

interface IProps {
  articles: IArticle[];
  bordered?: boolean;
  asCard?: boolean;
}

export const ArticleList: React.FC<IProps> = ({
  articles = [],
  bordered = false,
  asCard = false
}) => {
  return (
    <div
      style={{ width: "100%" }}
      className={cls(style.wrapper, asCard ? style.asCard : false)}
    >
      {articles && articles.length ? (
        articles.map(article => {
          return (
            <div
              key={article.id}
              className={cls(
                style.articleListItem,
                bordered ? style.isBordered : false,
                asCard ? style.asCard : false
              )}
            >
              <Link href={`/article/[id]`} as={`/article/${article.id}`}>
                <a>
                  {article.cover && (
                    <LazyLoad height={180}>
                      <div className={style.imgWrapper}>
                        <img src={article.cover} alt="cover" />
                      </div>
                    </LazyLoad>
                  )}
                  <div className={style.info}>
                    <p className={style.title}>{article.title}</p>
                    <p className={style.desc}>{article.summary}</p>
                    <p className={style.meta}>
                      {dayjs
                        .default(article.publishAt)
                        .format("YYYY-MM-DD HH:mm:ss")}
                    </p>
                  </div>
                </a>
              </Link>
            </div>
          );
        })
      ) : (
        <div className={style.empty}>暂无数据</div>
      )}
    </div>
  );
};
