import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Redirect } from 'umi';
import { Form, Row, Col, Card, Progress, Spin, Tabs, Empty, Tree, Icon } from 'antd';
import ReactEcharts from 'echarts-for-react';
import { ChartCard } from 'ant-design-pro/lib/Charts';
import 'ant-design-pro/dist/ant-design-pro.css';
import { checkAuth, getLocalStorage } from '@/utils/utils';

import CountTwelveMDataChart from './Component/CountTwelveMData';
import DyCountByNowDataChart from './Component/DyCountByNowData';
import StaticCountByNowData from './Component/StaticCountByNowData';


import style from '@/pages/style/public.less';
import mapCss from '@/pages/style/map.less';
import myCss from './index.less';
import dyIcon from '@/assets/dy-icon.png';
import staticIcon from '@/assets/static-icon.png';
import sourceIcon from '@/assets/source-icon.png';

const authority = ['/overview/command'];

const { TabPane } = Tabs;
const { TreeNode } = Tree;

const colors = ['#68B0F3', '#FF9F68', '#C0EBD7', '#facc14'];

/* eslint react/no-multi-comp:0 */
@connect(({ ChartStatistics, loading }) => ({
  ChartStatistics,
  loading: loading.models.ChartStatistics,
}))
@Form.create()
class Command extends PureComponent {

  constructor(props) {
    super(props);
    this.siteCodeList = [];
    this.leftMainRef = React.createRef();
  }

  state = {
    isLeftClose: false,
    treeList: [],
    siteCodeLists: [],
    leftTop: 0,
    siteCode: '',
    organCode: '',
  };


  componentDidMount() {
    this.getAllSite();
    this.getHomePageData();
    this.getDyCountByNow();
    this.getStaticCountByNow();
    this.getCountDataForYear();
    // 监听窗口滚动
    window.addEventListener('scroll', this.throttle(this.handleScroll, 300));

  };

  componentWillUnmount() {
    window.removeEventListener('scroll', this.throttle(this.handleScroll, 300));
  }

  /**
   * @description 滚动
   */
  handleScroll = () => {
    if (this.leftMainRef) {
      const leftTop = this.leftMainRef.getBoundingClientRect().top - 64;
      this.setState({ leftTop: Math.abs(leftTop) });
    }
  };

  /**
   * @description
   */
  throttle = (func, wait) => {
    let timeout;
    return () => {
      if (!timeout) {
        const arg = window.arguments;
        timeout = setTimeout(() => {
          timeout = null;
          func.apply(this, arg);
        }, wait);
      }
    };
  };


  /**
   * @description 进度条统计
   */
  getHomePageData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ChartStatistics/overviewOfHomePage',
    });
  };

  /**
   * @description 动态检测今日
   */
  getDyCountByNow = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ChartStatistics/dyCountByNow',
      payload: params,
    });
  };

  /**
   * @description 静态检测今日
   */
  getStaticCountByNow = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ChartStatistics/staticCountByNow',
      payload: params,
    });
  };

  /**
   * @description 非现场近12月检测数据统计
   */
  getCountDataForYear = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ChartStatistics/countDataForYear',
      // payload: params,
    });
  };


  /**
   * @description 获取所有
   */
  getAllSite = () => {
    const organId = getLocalStorage('organId');
    const { dispatch } = this.props;
    dispatch({
      type: 'GisMap/allSite',
      payload: { cityCode: organId },
      callback: res => {
        const treeList = this.formatTree(res);
        this.setState({ treeList });
      },
    });
  };

  /**
   * 处理数据
   * @param list
   * @returns {*}
   */
  formatTree = list => {
    return list.map(item => {
      return {
        title: item.areaName,
        key: item.code,
        siteType: 0,
        children: item.children.length ? this.formatTree(item.children).concat(this.formatSite(item.siteList)) : [].concat(this.formatSite(item.siteList)),
      };
    });
  };


  /**
   * 处理站点  添加到树形图中
   * @param list
   * @returns {*}
   */
  formatSite = list => {
    return list.map(item => {

      if (this.siteCodeList.indexOf(item.siteCode + '-' + item.siteType) < 0) {
        const { siteCodeLists } = this.state;
        this.siteCodeList.push(item.siteCode + '-' + item.siteType);
        this.setState({
          siteCodeLists: [item.siteCode + '-' + item.siteType, ...siteCodeLists],
        });
      }

      return {
        siteType: item.siteType,
        title: item.siteName,
        key: item.siteCode + '-' + item.siteType,
        children: [],
      };
    });
  };

  /**
   * 渲染树形
   */
  renderTree = () => {
    const { treeList } = this.state;
    return this.renderTreeNodes(treeList);
  };

  /**
   * 将数据处理为 nodes
   * @param list
   * @returns {*}
   */
  renderTreeNodes = list => {
    return list.map(item => {
      let icon = null;
      if (item.siteType === '1') {
        icon = {
          icon: <img style={{ width: 15 }} src={dyIcon} alt=''/>,
        };
      } else if (item.siteType === '2') {
        icon = {
          icon: <img style={{ width: 15 }} src={staticIcon} alt=''/>,
        };
      } else if (item.siteType === '3') {
        icon = {
          icon: <img style={{ width: 15 }} src={sourceIcon} alt=''/>,
        };
      }
      if (item.children.length) {
        return (
          <TreeNode {...icon} title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...icon} {...item} key={item.key}/>;
    });
  };


  treeSelect = e => {
    const code = e[0];
    let [siteCode, organCode] = ['', ''];
    if (/-/.test(code)) {
      const cityCode = code.split('-')[0];
      siteCode = cityCode;
    } else {
      organCode = code;
    }
    this.setState({
      siteCode,
      organCode,
    });
    this.getDyCountByNow({
      siteCode,
      organCode,
    });
    this.getStaticCountByNow({
      siteCode,
      organCode,
    });
    // this.getCountDataForYear({
    //   siteCode,
    //   organCode,
    // });
  };


  getYearTotal = () => {
    const { ChartStatistics: { countDataForYearData } } = this.props;
    if (!Object.keys(countDataForYearData).length) return <Empty
      style={{ height: 236, lineHeight: '230px' }}
      image={Empty.PRESENTED_IMAGE_SIMPLE}
    />;
    const chartData = [
      { value: countDataForYearData.sourceCompanyYearTotal.TOTAL, name: '源头数据' },
      { value: countDataForYearData.dynamicYearTotal.TOTAL, name: '动态数据' },
      { value: countDataForYearData.staticYearTotal.TOTAL, name: '精检数据' },
    ];
    let total = 0;
    for (let i = 0; i < chartData.length; i++) {
      total += chartData[i].value;
    }
    const option = this.optionUtil(chartData, total, `超限率()`, colors);
    return <ReactEcharts
      option={option}
    />;
  };

  getDynamicYearTotal = () => {
    const { ChartStatistics: { dyCountByNowData } } = this.props;
    if (!dyCountByNowData.length) return <Empty
      style={{ height: 236, lineHeight: '230px' }}
      image={Empty.PRESENTED_IMAGE_SIMPLE}
    />;
    const total = dyCountByNowData.map(item => item.TOTAL);
    const truckOverTotal = dyCountByNowData.map(item => item.TRUCKOVERTOTAL);
    const truckTotal = dyCountByNowData.map(item => item.TRUCKTOTAL);

    let [allTotal, allTruckOverTotal, allTruckTotal] = [0, 0, 0];
    for (let i = 0; i < total.length; i++) {
      allTotal += total[i];
    }

    for (let i = 0; i < truckOverTotal.length; i++) {
      allTruckOverTotal += truckOverTotal[i];
    }
    for (let i = 0; i < truckTotal.length; i++) {
      allTruckTotal += truckTotal[i];
    }

    const chartData = [
      { value: allTruckTotal, name: '货车总数' },
      { value: allTruckOverTotal, name: '货车超限' },
    ];
    const option = this.optionUtil(chartData, allTotal, '动态检测(今日)', colors);
    return <ReactEcharts
      option={option}
    />;
  };

  getStaticYearTotal = () => {
    const { ChartStatistics: { staticCountByNowData } } = this.props;
    if (!staticCountByNowData.length) return <Empty
      style={{ height: 236, lineHeight: '230px' }}
      image={Empty.PRESENTED_IMAGE_SIMPLE}
    />;
    const staticNowTotalOver = staticCountByNowData.map(item => item.TOTAL);
    const staticNowTotal = staticCountByNowData.map(item => item.TRUCKOVERTOTAL);
    let [total, nowTotal] = [0, 0];
    for (let i = 0; i < staticNowTotalOver.length; i++) {
      total += staticNowTotalOver[i];
    }
    for (let i = 0; i < staticNowTotal.length; i++) {
      nowTotal += staticNowTotal[i];
    }

    const chartData = [
      { value: staticNowTotalOver, name: '货车总数' },
      { value: staticNowTotal, name: '货车超限总数' },
    ];
    const option = this.optionUtil(chartData, total, '静态检测(今日)', colors);
    return <ReactEcharts
      option={option}
    />;
  };

  optionUtil = (chartData, total, title, color) => {
    const options = {
      color,
      title: {
        text: `${title}`,
        x: 'left',
        textStyle: {
          // fontSize: '15px'
          fontWeight: 400,
        },
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: <br/>{c} ({d}%)',
        // position:(pos, params, dom, rect, size)=> {
        //   const obj = {top: 60};
        //   obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
        //   return obj;
        // }
      },
      legend: {
        bottom: 0,
        data: chartData.map(item => item.name),
        show: true,
        itemHeight: 12,
        itemWidth: 12,
        formatter: name => {
          let value = '';
          for (let i = 0; i < chartData.length; i++) {
            if (name === chartData[i].name) {
              value = chartData[i].value || 0;
              break;
            }
          }
          const arr = [
            '\n',
            '{a|' + name + '}',
            '{b|' + (total ? (value / total * 100).toFixed(2) : 0) + '%}',
            '{a|' + value + '(辆)}',
          ];
          return arr.join('\n');
        },
        textStyle: {
          color: '#999',
          lineHeight: 20,
          rich: {
            a: {
              fontSize: 12,
            },
            b: {
              fontSize: 18,
              color: '#333',
            },
          },
        },
      },
      series: [
        {
          name: '',
          type: 'pie',
          radius: ['48%', '60%'],
          center: ['50%', '45%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: true,
              position: 'center',
              lineHeight: 25,
              formatter: () => {
                const arr = [
                  `{a|${total || 0}}`,
                  `{b|总检测数(辆)}`,
                ];
                return arr.join('\n');
              },
              rich: {
                a: {
                  color: '#333',
                  fontSize: 28,
                },
                b: {
                  color: '#666',
                  fontSize: 12,
                  fontWeight: 400,
                },
              },
            },

          },
          data: chartData,
        },
      ],
    };
    return options;
  };

  caseChart = () => {
    const { ChartStatistics: { data } } = this.props;
    if (JSON.stringify(data) === '{}') return <Empty style={{ height: 62, lineHeight: '50px' }}
                                                     image={Empty.PRESENTED_IMAGE_SIMPLE}/>;

    const toClose = data.caseCount.TOCLOSE;
    const closed = data.caseCount.CLOSED;
    return this.progressChart(<span
      style={{ color: '#333' }}>案卷总数</span>, (toClose + closed), closed, toClose, ['待归档', '已归档']);
  };

  lawChart = () => {
    const { ChartStatistics: { data } } = this.props;
    if (JSON.stringify(data) === '{}') return <Empty style={{ height: 62, lineHeight: '50px' }}
                                                     image={Empty.PRESENTED_IMAGE_SIMPLE}/>;
    const todeal = data.lawDataCount.TODEAL;
    const dealed = data.lawDataCount.DEALED;
    return this.progressChart(<span
      style={{ color: '#333' }}>执法总数</span>, dealed + todeal, dealed, todeal, ['待处理', '已处理']);
  };

  /**
   * 进度表
   * @param title 标题
   * @param total 总数
   * @param dealTotal 已处理
   * @param notDealTotal 未处理
   * @returns {*}
   */
  progressChart = (title, total, dealTotal, notDealTotal, smallTitle) => {
    return (
      <ChartCard
        bordered={false}
        bodyStyle={{ padding: 0 }}
        title={<span style={{ fontSize: 18 }}>{title}</span>}
      >
        <h3 style={{ fontSize: 14, margin: '8px 0', color: '#EF7575' }}><span
          style={{ display: 'inline-block', marginRight: 30 }}>{smallTitle[0]}</span> {notDealTotal}
        </h3>
        <Progress strokeWidth={13} strokeColor='#EF7575' strokeLinecap="square" percent={notDealTotal / total * 100}
                  showInfo={false}/>
        <h3 style={{ fontSize: 14, margin: '8px 0', color: '#6686C4' }}><span
          style={{ display: 'inline-block', marginRight: 30 }}>{smallTitle[1]}</span> {dealTotal} </h3>
        <Progress strokeWidth={13} strokeColor='#82A5ED' strokeLinecap="square" percent={dealTotal / total * 100}
                  showInfo={false}/>
      </ChartCard>
    );
  };

  render() {
    const { loading, ChartStatistics: { dyCountByNowData, staticCountByNowData } } = this.props;
    const { isLeftClose, treeList, siteCodeLists, leftTop, organCode, siteCode } = this.state;
    const topColResponsiveProps = {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 12,
      xl: 6,
      style: { marginBottom: 8 },
    };
    const topColResponsiveProps2 = {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 12,
      xl: 7,
      style: { marginBottom: 8 },
    };
    const topColResponsiveProps3 = {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 12,
      xl: 5,
      style: { marginBottom: 8 },
    };
    const borderRadius = {
      borderRadius: 4,
    };
    return (
      <div
        ref={e => this.leftMainRef = e}
        style={{
          margin: -20,
          padding: 20,
          position: 'relative',
        }}>
        {/*{checkAuth(authority[0]) ? null : <Redirect to="/exception/403"/>}*/}
        <div

          style={{ top: leftTop }}
          className={`${mapCss.mapLeft} ${myCss.leftSuspension} ${isLeftClose ? '' : mapCss.onClose}`}
        >
          <div className={mapCss.treeList}>
            {treeList.length ? <Tree
              showLine
              showIcon
              defaultExpandedKeys={siteCodeLists}
              onSelect={this.treeSelect}
            >
              {this.renderTree()}
            </Tree> : null}
          </div>
          <div className={mapCss.leftClose} onClick={() => this.setState({ isLeftClose: !isLeftClose })}>
            {isLeftClose ? <Icon className={mapCss.closeBtn} type="double-left"/> :
              <Icon className={mapCss.closeBtn} type="double-right"/>}
          </div>

          {/* <div className={mapCss.printType}>
            <div className={mapCss.printTypeItem}>
              <img src={dyIcon} alt='' />动态站点
            </div>
            <div className={mapCss.printTypeItem}>
              <img src={staticIcon} alt='' />静态站点
            </div>
            <div className={mapCss.printTypeItem}>
              <img src={sourceIcon} alt='' />源头企业
            </div>
          </div> */}
        </div>


        <div className={style.commandCard}>
          <Row gutter={8}>
            <Col {...topColResponsiveProps2}>
              <Spin spinning={loading}>
                <Card bordered={false} style={borderRadius}>
                  <Card.Grid style={{ width: '100%', ...borderRadius }}>
                    {this.getYearTotal()}
                  </Card.Grid>
                </Card>
              </Spin>
            </Col>
            <Col  {...topColResponsiveProps}>
              <Spin spinning={loading}>
                <Card bordered={false} style={borderRadius}>
                  <Card.Grid style={{ width: '100%', ...borderRadius }}>
                    {this.getDynamicYearTotal()}
                  </Card.Grid>
                </Card>
              </Spin>
            </Col>
            <Col {...topColResponsiveProps}>
              <Spin spinning={loading}>
                <Card bordered={false} style={borderRadius}>
                  <Card.Grid style={{ width: '100%', ...borderRadius }}>
                    {this.getStaticYearTotal()}
                  </Card.Grid>
                </Card>
              </Spin>
            </Col>
            <Col {...topColResponsiveProps3}>
              <Spin spinning={loading}>
                <Card bordered={false} style={borderRadius}>
                  <Card.Grid style={{ width: '100%', ...borderRadius, height: 174 }}>
                    {this.caseChart()}
                  </Card.Grid>
                  <Card.Grid style={{ width: '100%', ...borderRadius, height: 174 }}>
                    {this.lawChart()}
                  </Card.Grid>
                </Card>
              </Spin>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col span={24}>
              <Spin spinning={loading}>
                <Card bordered={false} style={{ ...borderRadius }}>
                  <Card.Grid style={{ width: '100%', ...borderRadius, paddingTop: 0 }}>
                    <Tabs defaultActiveKey="1">
                      <TabPane tab="动态检测(今日)" key="1">
                        {dyCountByNowData.length ? <DyCountByNowDataChart data={dyCountByNowData}/> : <Empty
                          style={{ height: 336, lineHeight: '330px' }}
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />}

                      </TabPane>
                      <TabPane tab="静态检测(今日)" key="2">
                        <StaticCountByNowData data={staticCountByNowData}/>
                      </TabPane>
                    </Tabs>
                  </Card.Grid>
                </Card>
              </Spin>
            </Col>
          </Row>
          <Row gutter={8} style={{ marginTop: 8 }}>
            <Col span={24}>
              <Spin spinning={loading}>
                <Card bordered={false} style={borderRadius}>
                  <Card.Grid style={{ width: '100%', ...borderRadius }}>
                    <CountTwelveMDataChart organCode={organCode} siteCode={siteCode}/>
                  </Card.Grid>
                </Card>
              </Spin>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default Command;
