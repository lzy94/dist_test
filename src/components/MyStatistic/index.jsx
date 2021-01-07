import React, {Component} from 'react';
import style from "./index.less";


export default class MyStatistic extends Component {
  render() {
    const {title, value, suffex, bodyStyle} = this.props;
    return (
      <div className={style.statistic}>
        <div className={style.title}>{title || ''}</div>
        <div className={style.statisticBody} style={bodyStyle ? bodyStyle : null}>
          <span className={style.value}>{value || 0}</span>
          <span className={style.suffex}>&nbsp;{suffex || ''}</span>
        </div>
      </div>
    )
  }
}
