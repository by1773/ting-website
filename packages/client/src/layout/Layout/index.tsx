import React from 'react';
import { BackTop } from 'antd';
import { Helmet } from 'react-helmet';
import { Header } from '@components/Header';
import { Footer } from '@components/Footer';

const defaultMenus = [
  {
    label: '首页',
    path: '/',
    // dynamicPath: '/[tag]',
  },

  {
    label: '发现',
    path: '/discovery',
  },
  {
    label: '文章',
    path: '/content',
    dynamicPath: '/[tag]',
  },
  {
    label: '项目',
    path: '/projects',
  },
];

interface Iprops {
  backgroundColor?: string;
  needFooter?: boolean;
  setting: any;
  pages: any;
}

export const Layout: React.FC<Iprops> = ({
  children,
  needFooter = true,
  setting = {},
  pages = [],
}) => {
  const menus = [
    ...defaultMenus,
    ...pages.map(r => ({
      path: `/page/` + r.path,
      label: r.name,
    })),
  ];

  return (
    <div>
      <Helmet>
        <title>{setting.systemTitle}</title>
        <meta name="keyword" content={setting.seoKeyword} />
        <meta name="description" content={setting.seoDesc} />
        <link rel="shortcut icon" href={setting.systemFavicon} />
        <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0"></meta>
        <link
          href="//fonts.googleapis.com/css?family=Nunito:400,400i,700,700i&amp;display=swap"
          rel="stylesheet"
        ></link>
      </Helmet>
      <Header setting={setting} menus={menus} />
      <main>{children}</main>
      <BackTop />
      {needFooter && <Footer setting={setting} />}
    </div>
  );
};
