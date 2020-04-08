import React, { useState, useEffect, useRef } from 'react';
import { Button, Input, message } from 'antd';
import cls from 'classnames';
import { CommentProvider } from '@providers/comment';
import { BfEditor } from './BfEditor';
import style from './index.module.scss';

export const Editor = ({
  hostId,
  isHostInPage = false,
  parentComment,
  replyComment,
  renderFooter = null,
  onSuccess = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [placeholder, setPlaceholder] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    let userInfo: any = window.localStorage.getItem('user');

    try {
      userInfo = JSON.parse(userInfo);
      setName(userInfo.name);
      setEmail(userInfo.email);
    } catch (err) {}
  }, [loading]);

  useEffect(() => {
    if (!parentComment) {
      return;
    }

    if (replyComment) {
      setPlaceholder(`回复 @${replyComment.name} ：`);
    } else {
      setPlaceholder('');
    }
  }, [replyComment, parentComment]);

  const submit = () => {
    let regexp = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;

    if (!regexp.test(email)) {
      message.error('请输入合法邮箱地址');
      return;
    }

    const data = {
      hostId,
      name,
      email,
      content,
      isHostInPage,
    };

    // 父级评论 id
    if (parentComment) {
      if (parentComment.id) {
        Object.assign(data, { parentCommentId: parentComment.id });
      }
    }

    // 回复评论信息
    if (replyComment) {
      Object.assign(data, {
        replyUserName: replyComment.name,
        replyUserEmail: replyComment.email,
      });
    }

    setLoading(true);
    CommentProvider.addComment(data).then(() => {
      message.success('评论成功，已提交审核');
      setLoading(false);
      setContent('');
      let userInfo: any = window.localStorage.getItem('user');
      try {
        userInfo = JSON.parse(userInfo);
        window.localStorage.setItem(
          'user',
          JSON.stringify(Object.assign(userInfo, { name, email }))
        );
      } catch (err) {}
      onSuccess();
    });
  };

  return (
    <div className={cls(style.editor)}>
      <div>
        <BfEditor
          onChange={value => {
            setContent(value);
          }}
          value={''}
        />
        <div className={style.nameAndMail}>
          <Input
            value={name}
            onChange={e => {
              setName(e.target.value);
            }}
            placeholder="请输入您的称呼"
          />
          <Input
            value={email}
            onChange={e => {
              setEmail(e.target.value);
            }}
            placeholder="请输入您的邮箱（不会公开）"
          />
        </div>
      </div>
      <div className={style.footer}>
        {renderFooter ? (
          renderFooter({
            loading,
            submit,
            disabled: !name || !email || !content,
          })
        ) : (
          <Button
            loading={loading}
            onClick={submit}
            type="primary"
            disabled={!name || !email || !content}
          >
            评论
          </Button>
        )}
      </div>
    </div>
  );
};
