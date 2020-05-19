import React, { useState, useEffect } from 'react';
import { Drawer, Button, Input, Switch, Select } from 'antd';
import { FileSelectDrawer } from '@/components/FileSelectDrawer';
import { CategoryProvider } from '@/providers/category';
import { TagProvider } from '@/providers/tag';
import style from './index.module.scss';

interface IProps {
  visible: boolean;
  article?: IArticle;
  // project?:IProject;
  type:string;
  onClose: () => void;
  onChange?: (arg: any) => void;
}

const FormItem = ({ label, content }) => {
  return (
    <div className={style.formItem}>
      <span>{label}</span>
      <div>{content}</div>
    </div>
  );
};

export const ArticleSettingDrawer: React.FC<IProps> = ({
  article = {},
  type,
  visible,
  onClose,
  onChange,
}) => {
  const [fileVisible, setFileVisible] = useState(false);
  const [summary, setSummary] = useState(article.summary || null);
  const [categorys, setCategorys] = useState<Array<ICategory>>([]);
  const [tags, setTags] = useState<Array<ITag>>([]);
  const [password, setPassWord] = useState(article.password || null);
  // 新增的字段
  const [codeUrl, setCodeUrl] = useState(article.codeUrl || null);
  const [viewUrl, setViewUrl] = useState(article.viewUrl || null);
  const [date, setDate] = useState(article.date || null);
  const [scale, setScale] = useState(article.scale || null);
  // 新增的字段结束
  const [isCommentable, setCommentable] = useState(
    article.isCommentable || true
  );
  const [selectedCategory, setSelectedCategory] = useState(
    (article.category && article.category.id) || null
  );
  const [selectedTags, setSelectedTags] = useState(
    (article.tags && article.tags.map(tag => tag.id)) || []
  );
  const [cover, setCover] = useState(article.cover || null);

  useEffect(() => {
    setSummary(article.summary);
    setCommentable(article.isCommentable || true);
    setSelectedCategory((article.category && article.category.id) || null);
    setSelectedTags((article.tags && article.tags.map(tag => tag.id)) || []);
    setCover(article.cover || null);
    // ---
    setCodeUrl(article.codeUrl),
    setViewUrl(article.viewUrl),
    setDate(article.date),
    setScale(article.scale)
  }, [article.isCommentable, article.category, article.tags, article.cover,
    article.codeUrl,
    article.viewUrl,
    article.date,
    article.scale
  ]);

  useEffect(() => {
    CategoryProvider.getCategory().then(
      res => {
      const temp =  res.filter((e)=>e.scope == type.toString())
        setCategorys(temp)
      });
    TagProvider.getTags().then(tags => {
      const temp =  tags.filter((e)=>e.scope == type.toString())
      setTags(tags)
    });
  }, []);

  const save = () => {
    onChange({
      summary,
      password,
      isCommentable,
      category: selectedCategory,
      tags: selectedTags.join(','),
      cover,
      status: 'draft',
      codeUrl,//项目代码地址
      viewUrl,//预览地址
      date,  //项目时间
      scale, //项目规模
    });
  };

  const publish = () => {
    onChange({
      summary,
      password,
      isCommentable,
      tags: selectedTags.join(','),
      category: selectedCategory,
      cover,
      status: 'publish',
      codeUrl,//项目代码地址
      viewUrl,//预览地址
      date,  //项目时间
      scale, //项目规模
    });
  };

  return (
    <Drawer
      width={480}
      placement="right"
      title={type=='0'?'文章设置':'项目设置'}
      closable={true}
      onClose={onClose}
      visible={visible}
    >
      <FormItem
        // label="文章摘要"
        label={type=='0'?'文章摘要':'项目摘要'}
        content={
          <Input.TextArea
            className={style.formItem}
            // placeholder="请输入文章摘要"
            placeholder={type=='0'?'请输入文章摘要':'请输入项目摘要'}
            autoSize={{ minRows: 6, maxRows: 8 }}
            value={summary}
            onChange={e => {
              setSummary(e.target.value);
            }}
          />
        }
      />
      {
        type=='1'?<>
          <FormItem
          label="预览地址"
          content={
            <Input
              value={viewUrl}
              onChange={e => {
                setViewUrl(e.target.value);
              }}
              placeholder="输入预览地址"
            />
          }
        />
        <FormItem
        label="代码地址"
        content={
          <Input
            value={codeUrl}
            onChange={e => {
              setCodeUrl(e.target.value);
            }}
            placeholder="输入代码地址"
          />
        }
      />
      <FormItem
      label="项目规模"
      content={
        <Input
          value={scale}
          onChange={e => {
            setScale(e.target.value);
          }}
          placeholder="输入项目规模"
        />
      }
    />
    <FormItem
    label="项目时间"
    content={
      <Input
        value={date}
        onChange={e => {
          setDate(e.target.value);
        }}
        placeholder="输入项目时间"
      />
    }
  />
        </>:null
      }
      <FormItem
        label="访问密码"
        content={
          <Input.Password
            value={password}
            onChange={e => {
              setPassWord(e.target.value);
            }}
            placeholder="输入后查看需要密码"
          />
        }
      />
      <FormItem
        label="开启评论"
        content={<Switch checked={isCommentable} onChange={setCommentable} />}
      />

      <FormItem
        label="选择分类"
        content={
          <Select
            value={selectedCategory}
            onChange={setSelectedCategory}
            style={{ width: '100%' }}
          >
            {categorys.map(t => (
              <Select.Option key={t.id} value={t.id}>
                {t.label}
              </Select.Option>
            ))}
          </Select>
        }
      />
      <FormItem
        label="选择标签"
        content={
          <Select
            mode="tags"
            value={selectedTags}
            onChange={setSelectedTags}
            style={{ width: '100%' }}
          >
            {tags.map(tag => (
              <Select.Option key={tag.id} value={tag.id}>
                {tag.label}
              </Select.Option>
            ))}
          </Select>
        }
      />
      <FormItem
        // label="文章封面"
        label={type=='0'?'文章封面':'项目封面'}
        content={
          <div className={style.cover}>
            <div onClick={() => setFileVisible(true)} className={style.preview}>
              <img src={cover} alt="预览图" />
            </div>

            <Input
              placeholder="或输入外部链接"
              value={cover}
              onChange={e => {
                setCover(e.target.value);
              }}
            />
            <Button onClick={() => setCover(null)}>移除</Button>
          </div>
        }
      />
      <FileSelectDrawer
        closeAfterClick={true}
        visible={fileVisible}
        onClose={() => setFileVisible(false)}
        onChange={url => setCover(url)}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e8e8e8',
          padding: '10px 16px',
          textAlign: 'right',
          left: 0,
          background: '#fff',
          borderRadius: '0 0 4px 4px',
        }}
      >
        <Button
          style={{
            marginRight: 8,
          }}
          onClick={save}
        >
          保存草稿
        </Button>
        <Button type="primary" onClick={publish}>
          发布
        </Button>
      </div>
    </Drawer>
  );
};
