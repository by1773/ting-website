import React from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import cls from 'classnames';
import { Row, Col } from 'antd';
import * as dayjs from 'dayjs';
import { ArticleProvider } from '@providers/article';
import { RecommendArticles } from '@components/RecommendArticles';
import { Tags } from '@components/Tags';
import  style from "./index.module.scss";

import AutoResponsive from "autoresponsive-react";
import { httpProvider } from '@/providers/http';

interface IProps {
  articles: { [key: string]: { [key: string]: IArticle[] } };
}

const ArchiveItem = () => {
  
  
    [20,10,20,30,40,50,60,7,15,32,10,11,20,30,40,25,26].map((e,i)=>{
      console.log('.......',e);
    return (
      <div style={{height:e+'px'}}>
        <h3>{1212221}</h3>
       <div>
         {e}
       </div>
      </div>
    );
   })
};
const getAutoResponsiveProps= ()=> {
  return {
    itemMargin: 10,
    // containerWidth: this.state.containerWidth || document.body.clientWidth,
    itemClassName: 'item',
    gridWidth: 100,
    transitionDuration: '.5'
  };
}
const Archives: NextPage<IProps> = props => {
  const { articles = [], data = [] } = props as any;
  
  
  
  return (
    <div className={style['wrapper']}>
      <div className={style['albumPanel']}>
      <AutoResponsive  {...getAutoResponsiveProps()}>
          {
            data.map((i, index) => {
              let styles = {
                width:i.w  === 'w1' ? 190 : 390,
                height: i.w === 'w1' ? 240 : 490
              };
              
              
              return (
                <a key={index} href="#" 
                // className={cls(style[i.w],style['album'])}
                className={style[i.w]}
                // className={`${i.w} album item`} 
                style={styles}>
                  {/* <img className="a-cont j_ACont" src="images/a.jpg"/> */}
                  <img className={style['a-cover']} src={i.src}/>
                  <p className={style['a-mask']}>{index}<i></i></p>
                  {/* <p className={'a-layer'}>
                    <span className={'al-brand'}>{i.brand}</span>
                    <span className={'al-title'}>{i.title}</span>
                    <span className={'al-count'}>{i.count}件商品</span>
                  </p>
                  <p className={'a-more j_ALMore'}></p> */}
                </a>
              );
            })
          }
        </AutoResponsive>
        </div>
     </div>
  );
};
const getData= async () =>{
  console.log('httpProvider',httpProvider);
  
  return new Promise((resolve,reject)=>{
    httpProvider.get('/test/data').then((d)=>{
      console.log(d);
      resolve(d)
    }).catch(()=>{
      reject([])
    })
   
  })
 
}
// 服务端预取数据
Archives.getInitialProps = async () => {
  const articles = await ArticleProvider.getArchives();
  const data =  await getData()
  return { articles ,data,  needLayoutFooter: false,};
};

export default Archives;
