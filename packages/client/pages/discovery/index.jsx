/*
 * @Descripttion: 
 * @version: 
 * @Author: by1773
 * @Date: 2020-04-07 17:34:10
 * @LastEditors: by1773
 * @LastEditTime: 2020-04-08 10:10:17
 */
import React from 'react';
import ReactDOM from 'react-dom';
import AutoResponsive from '../../src/components/AutoResponsive';
import { httpProvider } from '@/providers/http';
import cls from 'classnames';
import style from './index.module.scss';
import './index.module.scss'
const noop = () => {};

class WaterfallExampleComponent extends React.Component {
  constructor(props) {
    super(props);
    this.container = undefined
    this.state = {
    };
  }

  componentWillMount() {
    this.getData();
  }

   getData= async () =>{
    
      httpProvider.get('/test/data').then((d)=>{
        this.setState({data:d})
     
      }).catch(()=>{
        this.setState({data:[]})
      })
     
   
  }



  componentDidMount() {
    window.addEventListener('resize', () => {
      this.setState({
        containerWidth: ReactDOM.findDOMNode(this.container).clientWidth
      });
    }, false);
  }

  getAutoResponsiveProps() {
    return {
      itemMargin: 10,
      containerWidth: this.state.containerWidth || document.body.clientWidth,
      itemClassName: style['album'],
      gridWidth: 100,
      transitionDuration: '.5'
    };
  }

  render() {
    if (!this.state.data) {
      return <div>loading...</div>;
    }
     console.log(style);
     
    return (
      <div className={style["wrapper"]}>
      <div className={style["albumPanel"]}>
        <AutoResponsive ref={
          (node)=>this.container = node
        }
         {...this.getAutoResponsiveProps()}>
          {
            this.state.data.map((i, index) => {
              const styles = {
                width: i.w === 'w1' ? 190 : 390,
                height: i.w === 'w1' ? 240 : 490
              };
              return (
                  <a 
                   className={cls(style[i.w],style['album'],style['item'])}
                   style={{...styles,position:'absolute',top:0,bottom:0,right:0,left:0}}
                  >
                  <img className={cls(style["a-cont"] ,style["j_ACont"])} 
                  src={'/static/images/a.jpg'}
                  />
                  <img className={style["a-cover"]} src={i.src}/>
                  <p className={style["a-mask"]}>{index}<i></i></p>
                  <p className={style["a-layer"]}>
                    <span className={style["al-brand"]}>{i.brand}</span>
                    <span className={style["al-title"]}>{i.title}</span>
                    <span className={style["al-count"]}>{i.count}件商品</span>
                  </p>
                  <p className={cls(style["a-more"] ,style["j_ALMore"])}></p>
                </a>
                // </div>
              );
            })
          }
        </AutoResponsive>
      </div>
      </div>
    );
  }
}

export default  WaterfallExampleComponent;
