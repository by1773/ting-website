import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import cls from 'classnames';
import { Search } from '@/components/Search';
import style from './index.module.scss';

function throttle(fn, threshhold) {
  var last;
  var timer;
  threshhold || (threshhold = 250);

  return function() {
    var context = this;
    var args = arguments;
    var now = +new Date();

    if (last && now < last + threshhold) {
      clearTimeout(timer);
      timer = setTimeout(function() {
        last = now;
        fn.apply(context, args);
      }, threshhold);
    } else {
      last = now;
      fn.apply(context, args);
    }
  };
}

export const _Header = ({ setting, menus }) => {
  const router = useRouter();
  const asPath = router.asPath;
  const pathname = router.pathname;
  const [affix, setAffix] = useState(false);
  const [affixVisible, setAffixVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    let beforeY = 0;

    const handler = throttle(() => {
      const y = (window as any).scrollY;
      setAffix(y > 65);
      setAffixVisible(beforeY > y);
      beforeY = y;
    }, 200);

    document.addEventListener('scroll', handler);

    return () => {
      document.removeEventListener('scroll', handler);
    };
  }, []);

  return (
    <header className={cls(style.header)}>
      <div
        className={cls(
          style.wrapper,
          affix ? style.isFixed : false,
          affixVisible ? style.visible : false
        )}
      >
        <div className={cls('container')}>
          <div className={style.logo}>
            {/^http/.test(setting.systemLogo) ? (
              <Link href="/">
                <a>
                  <img src={setting.systemLogo} alt="" />
                </a>
              </Link>
            ) : (
              <Link href="/">
                <a dangerouslySetInnerHTML={{ __html: setting.systemLogo }}></a>
              </Link>
            )}
          </div>

          <div
            className={cls(style.mobileTrigger, visible ? style.active : false)}
            onClick={() => setVisible(!visible)}
          >
            <div className={style.stick}></div>
            <div className={style.stick}></div>
            <div className={style.stick}></div>
          </div>

          <nav className={cls(visible ? style.active : false)}>
            <ul>
              <li>
                <a href="javascript:viod(0)" >
                  <img src="/static/images/logo.svg" alt="" width={50} height={50}/>
                </a>
              </li>
              {menus.map(menu => (
                <li
                  key={menu.label}
                  className={cls({
                    [style.active]:
                      pathname === menu.path ||
                      asPath === menu.path ||
                      (menu.dynamicPath && pathname === menu.dynamicPath),
                  })}
                  onClick={() => {
                    if (visible) {
                      setVisible(false);
                    }
                  }}
                >
                  {/page/.test(menu.path) ? (
                    <Link href={'/page/[id]'} as={menu.path}>
                      <a>{menu.label}</a>
                    </Link>
                  ) : (
                    <Link href={menu.path}>
                      <a>{menu.label}</a>
                    </Link>
                  )}
                </li>
              ))}
              <li
                className={style.searchWrapper}
                onClick={() => setShowSearch(true)}
              >
                <a className={style.search}></a>
              </li>
            </ul>
          </nav>

          <Search visible={showSearch} onClose={() => setShowSearch(false)} />
        </div>
      </div>
    </header>
  );
};

export const Header = React.memo(_Header);
