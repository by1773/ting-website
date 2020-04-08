import React from "react";
import { Icon } from "antd";
import style from "./index.module.scss";

const RSS = () => {
  return (
    <Icon
      component={() => (
        <svg
          viewBox="0 0 1024 1024"
          version="1.1"
          p-id="4788"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          width="24"
          height="24"
        >
          <defs>
            <style type="text/css"></style>
          </defs>
          <path
            d="M512 0C230.4 0 0 230.4 0 512s230.4 512 512 512 512-230.4 512-512S793.6 0 512 0z m-182.4 768C288 768 256 736 256 694.4s32-73.6 73.6-73.6 73.6 32 73.6 73.6-32 73.6-73.6 73.6z m185.6 0c0-144-115.2-259.2-259.2-259.2v-80c185.6 0 339.2 150.4 339.2 339.2h-80z m172.8 0c0-240-195.2-432-432-432V256c281.6 0 512 230.4 512 512h-80z"
            fill="currentColor"
          ></path>
        </svg>
      )}
    />
  );
};

export const Footer = ({ setting, className = "" }) => {
  return (
    <footer className={className}>
      {/* <ul> */}
        {/* 这里是备案信息 */}
        <div className={style.index_footer}>
          &copy;Ting.com  Walker资讯网站 &nbsp;&nbsp;
          <span className={style.divider}>|</span>   
          &nbsp;&nbsp;
          <img src="/static/images/ic_record.png" alt="备案图标" 
          
          data-baiduimageplus-ignore="1"></img>
   
           <a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=33010602001880">贵州公网安备 33010602001880号 &nbsp;&nbsp;</a>
           <span className={style.divider}>|</span>   
          &nbsp;&nbsp;
           <a target="_blank" href="http://www.beian.miit.gov.cn">备案信息: 贵B2-20110282-7 &nbsp;&nbsp;</a>
           <span className={style.divider}>|</span>   
          &nbsp;&nbsp;
           <a target="_blank" href="https://faq.huaban.com/faq/%E7%BD%91%E7%BB%9C%E4%BF%A1%E6%81%AF%E6%9C%8D%E5%8A%A1%E4%BF%A1%E7%94%A8%E6%89%BF%E8%AF%BA%E4%B9%A6/">网络信息服务信用承诺书 &nbsp;&nbsp;</a>
        </div>
      {/* </ul> */}
      <ul className={style.icons}>
        <li>
          <a className={style.github} href="/rss" target="_blank">
            <RSS />
          </a>
        </li>
        <li>
          <a
            className={style.github}
            href="https://github.com/by1773"
            target="_blank"
          >
            <Icon type="github" />
          </a>
        </li>
      </ul>
      {setting && setting.systemFooterInfo && (
        <div
          className={style.copyright}
          dangerouslySetInnerHTML={{
            __html: setting.systemFooterInfo
          }}
        ></div>
      )}
    </footer>
  );
};
