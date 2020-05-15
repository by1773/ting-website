import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import cls from 'classnames';
import style from './index.module.scss';

export const CategoryMenu = ({ categories = [], scope = undefined }) => {
  const router = useRouter();
  const { category: routerCategory } = router.query;

  return (
    <div className={cls(style.wrapper)}>
      <div className={cls('container')}>
        <ul>
          <li
            key={'all'}
            className={cls(
              style.tagItem,
              !routerCategory && !/tag/.test(router.pathname)
                ? style.active
                : false
            )}
          >
            <Link
              href={Number(scope) ==0 ? `/content` : `/projects`}
            // href="/"
            >
              <a>
                <span>全部</span>
              </a>
            </Link>
          </li>
          {categories.map(t => {
            return (
              t && t.scope == scope ? <li
                key={t.id}
                className={cls(
                  style.tagItem,
                  routerCategory === t.value ? style.active : false
                )}
              >
                <Link
                  href={t.scope == 0 ? `/content/[category]` : `/projects/[category]`}
                  // as={`/content/` + t.value} 
                  as={t.scope == 0 ? `/content/` + t.value : `/projects/` + t.value}
                  shallow={false}>
                  <a>
                    <span>{t.label}</span>
                  </a>
                </Link>
              </li> : null
            );
          })}
        </ul>
      </div>
    </div>
  );
};
