import React from "react";
import { NextPage } from "next";
import RSS from "@/rss/index.js";
import { ArticleProvider } from "@providers/article";
import { SettingProvider } from "@providers/setting";
import { CategoryProvider } from "@providers/category";
const url = require("url");

const Rss: NextPage = () => {
  return null;
};

// 服务端预取数据
Rss.getInitialProps = async ctx => {
  const { res } = ctx;
  res.setHeader("Content-Type", "text/xml");

  let [articles, setting, categories] = await Promise.all([
    ArticleProvider.getArticles({ page: 1, pageSize: 99, status: "publish" }),
    SettingProvider.getSetting(),
    CategoryProvider.getCategory()
  ]);
  articles = articles[0];

  const feed = new RSS({
    title: setting.systemTitle,
    description: setting.seoDesc,
    feed_url: url.resolve(setting.systemUrl, "rss"),
    site_url: setting.systemUrl,
    author: "https://github.com/zhxuc",
    categories: categories.map(c => c.label)
  });

  articles.forEach(article => {
    feed.item({
      title: article.title,
      description: article.summary,
      url: url.resolve(setting.systemUrl, "article/" + article.id),
      date: article.publishAt,
      categories: [(article.category || {}).label]
    });
  });

  res.write(feed.xml());
  res.end();
};

export default Rss;
