import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button, Icon, Avatar } from 'antd';
import { format } from 'timeago.js';
import cls from 'classnames';
import Viewer from 'viewerjs';
import { CommentProvider } from '@providers/comment';
import { Editor } from './Editor';
import style from './index.module.scss';

const colors = [
  '#52c41a',
  '#f5222d',
  '#1890ff',
  '#faad14',
  '#ff0064',
  '#722ed1',
];
const getRandomColor = (() => {
  let cache = {};

  return (key): string => {
    if (!cache[key]) {
      let color = colors[Math.floor(Math.random() * colors.length)];
      cache[key] = color;
      return color;
    } else {
      return cache[key];
    }
  };
})();

export const CommentItem = ({
  comment,
  parentComment,
  hostId,
  isHostInPage,
  onReply = () => {},
  subComments = [],
  isChildren = false,
}) => {
  const [visible, setVisible] = useState(false);
  const [replyComment, setReplyComment] = useState(null);

  return (
    <div className={style.commentItem}>
      <header>
        <Avatar
          size={isChildren ? 24 : 32}
          style={{ backgroundColor: getRandomColor(comment.name) }}
        >
          {('' + comment.name).charAt(0).toUpperCase()}
        </Avatar>
        <span className={style.info}>
          <strong>{comment.name}</strong>
          {comment.replyUserName ? (
            <>
              <span>回复</span>
              <strong className={style.replyUser}>
                {comment.replyUserName}
              </strong>
            </>
          ) : null}
        </span>
      </header>
      <main style={{ paddingLeft: isChildren ? 24 + 10 : 32 + 10 }}>
        <div
          className={cls('markdown', style.content)}
          dangerouslySetInnerHTML={{ __html: comment.html }}
        ></div>
        <div className={style.meta}>
          {comment.userAgent ? <span>{comment.userAgent}</span> : null}
          <span>{format(comment.createAt, 'zh_CN')}</span>
          <span
            className={style.reply}
            onClick={() => {
              if (isChildren) {
                onReply();
              } else {
                setReplyComment(comment);
              }

              setVisible(true);
            }}
          >
            <Icon type="message" />
            回复
          </span>
        </div>
        {subComments && subComments.length ? (
          <div className={style.subComments}>
            {subComments.map(subComment => (
              <CommentItem
                key={subComment.id}
                comment={subComment}
                parentComment={comment}
                hostId={hostId}
                isHostInPage={isHostInPage}
                onReply={() => {
                  setReplyComment(subComment);
                  setVisible(true);
                }}
                isChildren={true}
              />
            ))}
          </div>
        ) : null}
      </main>
      {isChildren ? null : (
        <div
          className={cls(
            style.editorContainer,
            visible ? style.isActive : false
          )}
          style={{ paddingLeft: isChildren ? 24 + 10 : 32 + 10 }}
        >
          <Editor
            hostId={hostId}
            isHostInPage={isHostInPage}
            parentComment={comment}
            replyComment={replyComment}
            onSuccess={() => setReplyComment(null)}
            renderFooter={({ loading, disabled, submit }) => {
              return [
                <Button
                  style={{ marginRight: 16 }}
                  onClick={() => setVisible(false)}
                >
                  收起
                </Button>,
                <Button
                  loading={loading}
                  onClick={submit}
                  type="primary"
                  disabled={disabled}
                >
                  评论
                </Button>,
              ];
            }}
          />
        </div>
      )}
    </div>
  );
};

interface IProps {
  articleId: string;
  isInPage?: boolean;
}

let viewer: any = null;

export const MyComment: React.FC<IProps> = ({
  articleId,
  isInPage = false,
}) => {
  const ref = useRef(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(6);
  const [comments, setComments] = useState<IComment[]>([]);
  const [loading, setLoading] = useState(false);

  const getComments = useCallback(
    (page, pageSize, loadMore = false) => {
      setLoading(true);
      CommentProvider.getArticleComments(articleId, {
        page,
        pageSize,
      })
        .then(res => {
          setLoading(false);

          if (!loadMore) {
            setComments(res[0]);
          } else {
            setComments(comments => [...comments, ...res[0]]);
          }

          setTotal(res[1]);

          if (!viewer) {
            viewer = new Viewer(ref.current, { inline: false });
          } else {
            viewer.update();
          }
        })
        .catch(err => {
          setLoading(false);
        });
    },
    [articleId]
  );

  const loadMore = () => {
    setPage(page + 1);
    getComments(page + 1, pageSize, true);
  };

  useEffect(() => {
    setPage(1);
    getComments(1, pageSize, false);
  }, [articleId]);

  return (
    <div className={style.commentWrapper} ref={ref}>
      <Editor
        hostId={articleId}
        isHostInPage={isInPage}
        parentComment={null}
        replyComment={null}
      />
      <div className={style.commentContainer}>
        {comments.map(comment => {
          return (
            <CommentItem
              key={comment.id}
              comment={comment}
              parentComment={[]}
              subComments={comment.children}
              hostId={articleId}
              isHostInPage={isInPage}
            />
          );
        })}
      </div>
      <div className={style.pagination}>
        {page * pageSize < total ? (
          <Button
            type="primary"
            onClick={loadMore}
            disabled={loading}
            loading={loading}
          >
            加载更多
          </Button>
        ) : (
          <span>共 {total} 组</span>
        )}
      </div>
    </div>
  );
};
