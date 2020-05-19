import React, { useState, useEffect, useCallback } from 'react';
import cls from 'classnames';
import { NextPage } from 'next';
import { Helmet } from 'react-helmet';
import { Button, Input, message, PageHeader } from 'antd';
import { Editor as CKEditor } from '@components/Editor';
import { FileSelectDrawer } from '@/components/FileSelectDrawer';
import { ArticleSettingDrawer } from '@/components/ArticleSettingDrawer';
import { ProjectProvider } from '@providers/project';
import { useSetting } from '@/hooks/useSetting';
import style from './index.module.scss';
const url = require('url');

interface IProps {
  id: any;
}

const Editor: NextPage<IProps> = ({ id }) => {
  const setting = useSetting();
  const [fileDrawerVisible, setFileDrawerVisible] = useState(false);
  const [settingDrawerVisible, setSettingDrawerVisible] = useState(false);
  const [article, setArticle] = useState<any>({});
  const [title, setArticleTitle] = useState<any>(null);

  useEffect(() => {
    ProjectProvider.getArticle(id).then(res => {
      setArticle(res);
      setArticleTitle(res.title);
    });
  }, [id]);

  const save = useCallback(() => {
    if (!article.title) {
      message.warn('至少输入项目标题');
      return;
    }

    if (article.tags) {
      try {
        article.tags = article.tags.map(t => t.id).join(',');
      } catch (e) {
        console.log(e);
      }
    }

    if (id) {
      ProjectProvider.updateArticle(id, article).then(res => {
        message.success(
          res.status === 'draft' ? '项目已保存为草稿' : '项目已发布'
        );
      });
    } else {
      ProjectProvider.addArticle(article).then(res => {
        message.success(
          res.status === 'draft' ? '项目已保存为草稿' : '项目已发布'
        );
      });
    }
  }, [article, id]);

  const preview = useCallback(() => {
    if (id) {
      window.open(url.resolve(setting.systemUrl || '', '/article/' + id));
    } else {
      message.warn('请先保存');
    }
  }, [id, setting.systemUrl]);

  const publish = useCallback(() => {
    let canPublish = true;
    void [
      ['title', '请输入项目标题'],
      ['content', '请输入项目内容'],
    ].forEach(([key, msg]) => {
      if (!article[key]) {
        message.warn(msg);
        canPublish = false;
      }
    });

    if (!canPublish) {
      return;
    }

    setSettingDrawerVisible(true);
  }, [article, id]);

  const saveOrPublish = patch => {
    const data = Object.assign({}, article, patch);

    const handle = res => {
      message.success(data.status === 'draft' ? '项目已保存' : '项目已发布');
    };

    if (id) {
      ProjectProvider.updateArticle(id, data).then(handle);
    } else {
      ProjectProvider.addArticle(data).then(handle);
    }
  };

  return (
    <div className={style.wrapper}>
      <Helmet>
        <title>编辑项目</title>
      </Helmet>
      <header className={style.header}>
        <PageHeader
          style={{
            borderBottom: '1px solid rgb(235, 237, 240)',
          }}
          onBack={() => window.close()}
          title={
            <Input
              placeholder="请输入项目标题"
              value={title}
              onChange={e => {
                setArticleTitle(e.target.value);
              }}
            />
          }
          extra={[
            <Button
              type="dashed"
              onClick={() => {
                setFileDrawerVisible(true);
              }}
            >
              文件库
            </Button>,
            <Button onClick={save}>更新</Button>,
            <Button onClick={preview}>预览</Button>,
            <Button type="primary" onClick={publish}>
              发布
            </Button>,
          ]}
        />
      </header>
      <div className={cls('container', style.content)}>
        <article>
          <CKEditor
            value={article.content}
            onChange={value => {
              setArticle(article => {
                article.content = value;
                return article;
              });
            }}
          />
        </article>
      </div>
      <FileSelectDrawer
        isCopy={true}
        closeAfterClick={true}
        visible={fileDrawerVisible}
        onClose={() => {
          setFileDrawerVisible(false);
        }}
      />
      <ArticleSettingDrawer
        type={`1`}
        article={article}
        visible={settingDrawerVisible}
        onClose={() => setSettingDrawerVisible(false)}
        onChange={saveOrPublish}
      />
    </div>
  );
};

Editor.getInitialProps = async ctx => {
  const { id } = ctx.query;
  return { id };
};

export default Editor;
