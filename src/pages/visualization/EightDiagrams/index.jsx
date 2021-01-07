/* eslint-disable no-useless-constructor */
import React, { PureComponent, Fragment } from 'react';
import MyDyLaw from './DyLaw/index';
import MyStaticLawData from './MyStaticLawData';
import MyDyLawCase from './MyDyLawCase/index';
import MySiteEquiment from './MySiteEquiment/index';
import MyAxleData from './MyAxleData/index';
import MyPersonnelLaw from './MyPersonnelLaw/index';
import MyBusDlack from './MyBusDlack/index';
import MySiteOverview from './MySiteOverview/index';
import style from '../style.less';

const names = [
  '动态执法',
  '静态执法',
  '案件状态',
  '站点设备',
  '轴型',
  '执法人员',
  '站点建设',
  '黑名单',
];

/**
 * @description 执法统计
 * @export
 * @class EightDiagrams
 * @extends {PureComponent}
 */
class EightDiagrams extends PureComponent {
  constructor(props) {
    super(props);
    this.tabKeyTime = null;
    this.tabKeyTimeOut = null;
  }

  state = {
    tabKey: 0,
  };

  componentDidMount() {
    this.tabKeyTimeOut = setTimeout(() => {
      this.tabKeyTime = setInterval(() => this.changeTabKey(), 30000);
    }, 50000);
  }

  componentWillUnmount() {
    if (this.tabKeyTimeOut) {
      clearTimeout(this.tabKeyTimeOut);
    }
    if (this.tabKeyTime) {
      clearInterval(this.tabKeyTime);
    }
  }

  /**
   * @description 类八卦图案 自动选择
   */
  changeTabKey = () => {
    const tabKey = this.state.tabKey === 7 ? -1 : this.state.tabKey;
    const newKey = tabKey + 1;
    this.setState({
      tabKey: newKey,
    });
  };

  render() {
    const { tabKey } = this.state;
    return (
      <Fragment>
        <h3 className={style.itemTitle}>{names[tabKey]}</h3>
        <div className={style.lawMain}>
          <div className={style.lawItem}>
            <div className={style.eightDiagramsMain}>
              {names.map((item, index) => (
                <div
                  key={item}
                  className={`${style.menuItem} ${tabKey === index ? style.action : ''}`}
                >
                  <span />
                  <p>{item}</p>
                </div>
              ))}
              <div className={style.centerPanel}>
                <div className={style.rotate} />
              </div>
            </div>
          </div>
          <div className={style.lawItem}>
            <div className={style.myTabs}>
              <div className={`${style.myTabPane} ${tabKey === 0 ? style.active : ''}`}>
                {tabKey === 0 ? <MyDyLaw /> : null}
              </div>
              <div className={`${style.myTabPane} ${tabKey === 1 ? style.active : ''}`}>
                {tabKey === 1 ? <MyStaticLawData /> : null}
              </div>
              <div className={`${style.myTabPane} ${tabKey === 2 ? style.active : ''}`}>
                {tabKey === 2 ? <MyDyLawCase /> : null}
              </div>
              <div className={`${style.myTabPane} ${tabKey === 3 ? style.active : ''}`}>
                {tabKey === 3 ? <MySiteEquiment /> : null}
              </div>
              <div className={`${style.myTabPane} ${tabKey === 4 ? style.active : ''}`}>
                {tabKey === 4 ? <MyAxleData /> : null}
              </div>
              <div className={`${style.myTabPane} ${tabKey === 5 ? style.active : ''}`}>
                {tabKey === 5 ? <MyPersonnelLaw /> : null}
              </div>
              <div className={`${style.myTabPane} ${tabKey === 6 ? style.active : ''}`}>
                {tabKey === 6 ? <MySiteOverview /> : null}
              </div>
              <div className={`${style.myTabPane} ${tabKey === 7 ? style.active : ''}`}>
                {tabKey === 7 ? <MyBusDlack /> : null}
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}
export default EightDiagrams;
