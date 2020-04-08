import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Spin, message } from 'antd';
import 'braft-editor/dist/index.css';

interface IProps {
  value: string;
  onChange: (arg: any) => void;
}

let BraftEditor;

export const BfEditor: React.FC<IProps> = ({ value = '', onChange }) => {
  const ref = useRef(null);
  const [editorState, setEditorState] = useState();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    setEditorState(BraftEditor.createEditorState(value));
  }, [mounted, value]);

  useEffect(() => {
    Promise.all([import('braft-editor')]).then(res => {
      BraftEditor = res[0].default;
      setMounted(true);
    });

    return () => {
      setMounted(false);
    };
  }, []);

  const controls = [
    'undo',
    'redo',
    'separator',
    'font-size',
    'separator',
    'list-ul',
    'list-ol',
    'blockquote',
    'code',
    'emoji',
    'separator',
    'link',
    'separator',
    'media',
  ];

  return mounted ? (
    <div ref={ref}>
      <BraftEditor
        value={editorState}
        onChange={editorState => {
          setEditorState(editorState);
          const html = editorState.toHTML();
          onChange(html);
        }}
        controls={controls}
        media={{
          validateFn: file => {
            let isLimit = file.size <= 1024 * 200;
            if (!isLimit) {
              message.error('图片大小不允许超过 200K！');
            }
            return isLimit;
          },
        }}
      />
    </div>
  ) : (
    <Spin tip="编辑器努力加载中..." spinning={true}></Spin>
  );
};
