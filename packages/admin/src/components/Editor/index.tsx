import React, { useState, useEffect, useRef } from 'react';
import cls from 'classnames';
import { Spin, Upload, Icon, message } from 'antd';
import { FileProvider } from '@providers/file';
import style from './index.module.scss';
import { ContentUtils } from 'braft-utils';
import 'braft-editor/dist/index.css';
import 'braft-extensions/dist/table.css';

interface IProps {
  value: string;
  onChange: (arg: any) => void;
}

let BraftEditor;

export const Editor: React.FC<IProps> = ({ value = '', onChange }) => {
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
    Promise.all([
      import('braft-editor'),
      import('braft-extensions/dist/table'),
      import('braft-extensions/dist/markdown'),
    ]).then(res => {
      BraftEditor = res[0].default;
      const Table = res[1].default;
      const Markdown = res[2].default;
      const options = {
        defaultColumns: 3, // 默认列数
        defaultRows: 3, // 默认行数
        withDropdown: false, // 插入表格前是否弹出下拉菜单
        columnResizable: false, // 是否允许拖动调整列宽，默认false
        exportAttrString: '', // 指定输出HTML时附加到table标签上的属性字符串
      };
      BraftEditor.use(Table(options));
      BraftEditor.use(Markdown({}));
      setMounted(true);
    });

    return () => {
      setMounted(false);
    };
  }, []);

  const upload = param => {
    if (!param.file) {
      return false;
    }

    let size = param.file.size || 0;

    let hide = () => {};
    if (size > 1024 * 1024 * 4) {
      hide = message.loading('文件上传中...', 0);
    }

    FileProvider.uploadFile(param.file)
      .then(res => {
        hide();
        setEditorState(
          ContentUtils.insertMedias(editorState, [
            {
              type: 'IMAGE',
              url: res.url,
            },
          ])
        );
      })
      .catch(() => {
        hide();
        message.error('文件上传失败，可能过大！');
      });
  };

  const controls = [
    'undo',
    'redo',
    'separator',
    'headings',
    'font-size',
    // 'line-height',
    // 'letter-spacing',
    'separator',
    'list-ul',
    'list-ol',
    'blockquote',
    'code',
    'emoji',
    'separator',
    'link',
    'separator',

    'text-color',
    'bold',
    'italic',
    'underline',
    'strike-through',
    'separator',
    'superscript',
    'subscript',
    'remove-styles',
    'separator',
    'text-indent',
    'text-align',
    'separator',

    'hr',
    'separator',
    'table',
  ];
  const extendControls = [
    {
      key: 'antd-uploader',
      type: 'component',
      component: (
        <Upload accept="image/*" showUploadList={false} customRequest={upload}>
          <button
            type="button"
            className="control-item button upload-button"
            data-title="插入图片"
          >
            <Icon type="picture" theme="filled" />
          </button>
        </Upload>
      ),
    },
  ];

  return mounted ? (
    <div className={cls(style.wrapper, '')} ref={ref}>
      <BraftEditor
        value={editorState}
        onChange={editorState => {
          setEditorState(editorState);
          const html = editorState.toHTML();
          onChange(html);
        }}
        controls={controls}
        extendControls={extendControls}
      />
    </div>
  ) : (
    <Spin tip="编辑器努力加载中..." spinning={true}></Spin>
  );
};
