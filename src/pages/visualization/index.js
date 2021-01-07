/* eslint-disable react/jsx-indent */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Tooltip, Tag, Empty } from 'antd';

import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { ScrollBoard } from '@jiaminghi/data-view-react';
import StandardTable from '@/components/StandardTable';
import { getLocalStorage, socketUrl } from '@/utils/utils';

import MyMap from './Map/index';
import EightDiagrams from './EightDiagrams/index';
import MyOverLoadChart from './OverLoadChart/index';
import ScrollTip from './components/ScrollTip/index';
import style from './style.less';

import logo from '@/assets/dataV/logo.png';

let stompClient = null;

/* eslint react/no-multi-comp:0 */
@connect(({ TrafficApiV2Count, user, BigScreen, loading, TrafficApiV2Static }) => ({
  TrafficApiV2Count,
  BigScreen,
  TrafficApiV2Static,
  loading: loading.models.BigScreen,
  currentUser: user.currentUser,
}))
class DataV extends PureComponent {
  state = {
    tableLTHeight: 0,
    tableRTRHeight: 0,
    tableRTLHeight: 0,
    tableLBLHeight: 0,
    tableCenterHeight: 0,
    tipMsg: '',
    personnelLawData: {
      list: [],
      pagination: {},
    },
    dataList: {
      list: [],
      pagination: {},
    },
  };

  columnsRL = [
    {
      title: '车牌号码',
      dataIndex: 'carNo',
    },
    {
      title: '动态数据',
      dataIndex: 'dynamicTotalLoad',
      render: val => `${((val || 0) / 1000).toFixed(2)}t`,
    },
    {
      title: '静态数据',
      dataIndex: 'staticTotalLoad',
      render: val => `${(val / 1000).toFixed(2)}t`,
    },
    {
      title: '误差原因',
      dataIndex: 'q',
      render: () => '异常行驶',
    },
  ];

  columnsRR = [
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '已处理',
      dataIndex: 'Processed',
    },
    {
      title: '待处理',
      dataIndex: 'pendingDisposal',
    },
    {
      title: '处理率',
      dataIndex: 'rate',
      render: (val, e) => `${((e.Processed / (e.total || 1)) * 100).toFixed(2)}%`,
    },
  ];

  columnsCenter = [
    {
      title: '站点名称',
      dataIndex: 'siteName',
      render: val => (val.length > 6 ? `${val.substring(0, 6)}...` : val),
      width: 150,
    },
    {
      title: ' 车牌号',
      dataIndex: 'carNo',
      width: 100,
    },
    {
      title: '总重',
      dataIndex: 'totalLoad',
      render: val => `${(val / 1000).toFixed(2)}t`,
    },
    {
      title: '超载',
      dataIndex: 'overLoad',
      render: val =>
        val > 0 ? (
          <Tag color="red">{(val / 1000).toFixed(2)} t</Tag>
        ) : (
          `${(val / 1000).toFixed(2)}t`
        ),
    },
    {
      title: '超重比',
      dataIndex: 'overLoadRate',
      render: val =>
        val > 0.05 ? (
          <Tag color="red">{(val * 100).toFixed(2)} %</Tag>
        ) : (
          `${(val * 100).toFixed(2)}%`
        ),
    },
  ];

  columnsLBO = [
    {
      title: '序列',
      dataIndex: 'id',
      width: '20%',
      align: 'center',
    },
    {
      title: '车牌号',
      dataIndex: 'key',
      width: '50%',
      align: 'center',
    },
    {
      title: '频次',
      dataIndex: 'doc_count',
      width: '30%',
      align: 'center',
    },
  ];

  columnsLBT = [
    {
      title: '序列',
      dataIndex: 'id',
      width: '20%',
      align: 'center',
    },
    {
      title: '车牌号',
      dataIndex: 'carNo',
      width: '40%',
      align: 'center',
    },
    {
      title: '幅度',
      width: '40%',
      align: 'center',
      dataIndex: 'overLoadRate',
      render: val => `${(val * 100).toFixed(2)}%`,
    },
  ];

  constructor(props) {
    super(props);
    this.organCode = getLocalStorage('organId') || 51;
    this.tableLT = React.createRef();
    this.tableRTR = React.createRef();
    this.tableRTL = React.createRef();
    this.tableLBL = React.createRef();
    this.tableLBR = React.createRef();
    this.tableCenter = React.createRef();

    this.reloadTime = null;
    this.timeOut = null;

    window.onresize = () => {
      setTimeout(() => {
        this.setHeight();
      }, 300);
    };
  }

  componentDidMount() {
    this.initWebSocket();
    this.setHeight(() => {
      this.getPeakValue();
      this.getPersonnelLaw();
      this.getBusFocusTop();
      this.getCompare();
      this.timeOut = setTimeout(() => {
        this.reloadTime = setInterval(() => {
          this.getPeakValue();
          this.getBusFocusTop();
          this.getCompare();
        }, 30000);
      }, 30000);
    });
  }

  componentWillUnmount() {
    if (this.reloadTime) {
      clearInterval(this.reloadTime);
    }
    if (stompClient) {
      try {
        stompClient.disconnect();
      } catch (error) {}
      stompClient = null;
    }
    if (this.timeOut) {
      clearTimeout(this.timeOut);
    }
    window.onresize = null;
  }

  initWebSocket = () => {
    this.connection();
  };

  onMessage = msg => {
    // console.log(msg.body); // msg.body存放的是服务端发送给我们的信息

    const m = JSON.parse(msg.body);
    const newData = m.dynamicDataMsg;
    newData.id = new Date().getTime();
    const list = [newData, ...this.state.dataList.list];
    if (list.length > 10) {
      list.splice(9, 10);
    }
    if (m.isWaring === 1) {
      this.setState({ tipMsg: m.msg });
    }
    this.setState({
      dataList: {
        list,
        pagination: {},
      },
    });
  };

  connection = () => {
    // const { currentUser } = this.props;
    const siteIds = localStorage.getItem('siteIds');
    const socket = new SockJS(socketUrl);
    stompClient = Stomp.over(socket);
    const headers = {
      Authorization: '',
    };
    stompClient.debug = null;
    // 向服务器发起websocket连接
    stompClient.connect(
      headers,
      () => {
        siteIds
          ? siteIds.split(',').map(item => {
              stompClient.subscribe(`/topic/${item}`, this.onMessage);
            })
          : null;
      },
      err => {
        console.log('失败');
        console.log(err);
        // this.connection();
      },
    );
  };

  /**
   * @description 获取表格高度
   */
  setHeight = callback => {
    const tableLTHeight = this.tableLT.current.getBoundingClientRect().height - 40;
    const tableRTRHeight = this.tableRTR.current.getBoundingClientRect().height - 40;
    const tableRTLHeight = this.tableRTL.current.getBoundingClientRect().height - 40;
    const tableLBRHeight = this.tableLBR.current.getBoundingClientRect().height - 60;
    const tableLBLHeight = this.tableLBL.current.getBoundingClientRect().height - 60;
    const tableCenterHeight = this.tableCenter.current.getBoundingClientRect().height - 60;
    this.setState(
      {
        tableLTHeight,
        tableRTRHeight,
        tableRTLHeight,
        tableLBRHeight,
        tableLBLHeight,
        tableCenterHeight,
      },
      () => callback && callback(),
    );
  };

  /**
   * @description 格式化执法人员列表
   */
  formatPersonnelLaw = () => {
    const {
      BigScreen: { personnelLawData },
    } = this.props;
    const keys = personnelLawData.map(item => Object.keys(item).join());
    const newData = keys.map((item, index) => {
      const data = personnelLawData[index][item][0];
      return {
        id: index,
        name: item,
        total: data.TOTAL,
        pendingDisposal: data.PENDINGVERIFY,
        Processed: data.VERIFYPASS + data.SIGNINGPASS + data.ARCHIVEDATE,
      };
    });
    this.setState({
      personnelLawData: {
        list: newData,
        pagination: {},
      },
    });
  };

  /**
   * @description 执法人员
   */
  getPersonnelLaw = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'BigScreen/personnelLaw',
      payload: {
        organCode: this.organCode,
      },
      callback: () => {
        this.formatPersonnelLaw();
      },
    });
  };

  /**
   * @description 重点关注
   */
  getBusFocusTop = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'TrafficApiV2Count/busFocusTop',
    });
  };

  /**
   * @description 争议
   */
  getCompare = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'TrafficApiV2Static/dynamicAndStaticCompare',
      payload: {
        pageNo: 1,
        pageSize: 20,
        dispute: 1,
      },
    });
  };

  /**
   * @description 峰值
   */
  getPeakValue = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'TrafficApiV2Count/siteView',
      // type: 'BigScreen/peakValue',
      // payload: {
      //   organCode: this.organCode,
      // },
    });
  };

  /**
   * @description: 渲染每项的四个边角
   * @param {type}
   * @return: <node>
   */
  renderBorder = () => {
    return (
      <>
        <span className={style.tl} />
        <span className={style.tr} />
        <span className={style.bl} />
        <span className={style.br} />
      </>
    );
  };

  configTime = str => {
    if (!str) return '';
    const startTime = str.slice(0, 2);
    const endTime = startTime >= '23' ? '00' : parseInt(startTime, 10) + 1;
    return `${startTime}:00~${endTime}:00`;
  };

  lTConfig = siteData => {
    const data = siteData.map(item => {
      const { siteName, doc_count, overLoadTime, overMoreAlxe, truckLoadTime } = item;

      return [
        `<span title='${siteName}' style="color:#33B5FF">${siteName}</span>`,
        `<span style="color:#33B5FF">${doc_count}</span>`,
        `<span style="color:#33B5FF">${this.configTime(overLoadTime)}</span>`,
        `<span style="color:#33B5FF">${overMoreAlxe}</span>`,
        `<span style="color:#33B5FF">${this.configTime(truckLoadTime)}</span>`,
      ];
    });
    return {
      header: [
        `<span style="color:#33B5FF">站点名称</span>`,
        `<span style="color:#33B5FF">超限总数</span>`,
        `<span style="color:#33B5FF">超限峰值</span>`,
        `<span style="color:#33B5FF">超限轴数</span>`,
        `<span style="color:#33B5FF">货车超限峰值</span>`,
      ],
      data,
      headerBGC: 'transparent',
      oddRowBGC: 'transparent',
      evenRowBGC: 'transparent',
      // carousel: 'page',
      // hoverPause: true,
    };
  };

  render() {
    const {
      TrafficApiV2Count: { focusData, siteData },
      // BigScreen: { compareValue },
      TrafficApiV2Static: { dyAndStCompareData },
    } = this.props;
    const {
      personnelLawData,
      tableRTLHeight,
      tableRTRHeight,
      tableLBLHeight,
      tableLBRHeight,
      tableCenterHeight,
      tipMsg,
      dataList,
    } = this.state;
    return (
      <div className={style.dataMain}>
        <div className={style.earth}>&nbsp;</div>
        <div className={style.dataBody}>
          <div className={style.header}>
            <div className={style.logo} />
            <div className={style.title}>综合交通执法管理平台</div>
            <div className={style.rightBtnGroup}>
              {/* <a href="javascript:void(0)" title="数据统计" className={style.action}>数据统计</a>
                            <a href="javascript:void(0)" title="四川">四川</a>
                            <a href="javascript:void(0)" title="绵阳">绵阳</a>
                            <a href="javascript:void(0)" title="涪城区">涪城区</a> */}
            </div>
          </div>

          <div className={style.content}>
            <div className={style['col-l']}>
              <div className={style.top}>
                <div className={style.bodyTB}>
                  <div className={style.bodyLR}>
                    {this.renderBorder()}
                    <div className={style.itemCell}>
                      <h3 className={style.itemTitle}>站点概况</h3>
                      <div
                        className={style.table}
                        style={{ height: 'calc(100% - 36px)' }}
                        ref={this.tableLT}
                      >
                        {siteData.length ? (
                          <ScrollBoard config={this.lTConfig(siteData)} />
                        ) : (
                          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={style.bottom}>
                <div className={style.bodyTB}>
                  <div className={style.bodyLR}>
                    {this.renderBorder()}
                    <div className={style.itemCell}>
                      <div style={{ height: '55%' }}>
                        <h3 className={`${style.itemTitle} ${style.position}`}>超限统计</h3>
                        <div className={style.itemCell} style={{ padding: '0 0 10px 0' }}>
                          <MyOverLoadChart />
                        </div>
                      </div>
                      <div style={{ height: '45%', display: 'flex', flexDirection: 'column' }}>
                        <h3 className={style.itemTitle}>重点关注（30日超限）</h3>
                        <div className={`${style.itemCell} ${style.tableLB}`}>
                          <div className={style.table} ref={this.tableLBL}>
                            <StandardTable
                              size="small"
                              tableAlert={false}
                              selectedRows={0}
                              data={{ list: focusData.carCount }}
                              rowSelection={null}
                              columns={this.columnsLBO}
                              pagination={false}
                              scroll={{ y: tableLBLHeight }}
                            />
                          </div>
                          <div className={style.table} ref={this.tableLBR}>
                            <StandardTable
                              size="small"
                              tableAlert={false}
                              selectedRows={0}
                              data={{ list: focusData.overLoad }}
                              rowSelection={null}
                              columns={this.columnsLBT}
                              pagination={false}
                              scroll={{ y: tableLBRHeight }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={style['col-c']}>
              <div className={style.map}>
                <MyMap />
              </div>
              <div className={style.bottom}>
                <ScrollTip tipMsg={tipMsg} />
                <div
                  className={style.table}
                  style={{ height: 'calc(100% - 50px)' }}
                  ref={this.tableCenter}
                >
                  <StandardTable
                    size="small"
                    tableAlert={false}
                    selectedRows={0}
                    rowSelection={null}
                    data={dataList}
                    columns={this.columnsCenter}
                    pagination={false}
                    scroll={{ y: tableCenterHeight }}
                  />
                </div>
                {/* </div> */}
              </div>
            </div>
            <div className={style['col-r']}>
              <div className={style.top}>
                <div className={style.left}>
                  <div className={style.bodyTB}>
                    <div className={style.bodyLR}>
                      {this.renderBorder()}
                      <div className={style.itemCell}>
                        <h3 className={style.itemTitle}>争议统计</h3>
                        <div className={style.tableMain}>
                          <div className={style.itemCell} style={{ padding: 0 }}>
                            <div className={style.table} ref={this.tableRTL}>
                              <StandardTable
                                size="small"
                                tableAlert={false}
                                selectedRows={0}
                                rowSelection={null}
                                data={dyAndStCompareData}
                                columns={this.columnsRL}
                                pagination={false}
                                scroll={{ y: tableRTLHeight }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={style.right}>
                  <div className={style.bodyTB}>
                    <div className={style.bodyLR}>
                      {this.renderBorder()}
                      <div className={style.itemCell}>
                        <h3 className={style.itemTitle}>案件办理统计</h3>
                        <div className={style.tableMain}>
                          <div className={style.itemCell} style={{ padding: 0 }}>
                            <div className={style.table} ref={this.tableRTR}>
                              <StandardTable
                                size="small"
                                tableAlert={false}
                                selectedRows={0}
                                rowSelection={null}
                                data={personnelLawData}
                                columns={this.columnsRR}
                                pagination={false}
                                scroll={{ y: tableRTRHeight }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={style.bottom}>
                <div className={style.bodyTB}>
                  <div className={style.bodyLR}>
                    {this.renderBorder()}
                    <div className={style.itemCell}>
                      <EightDiagrams />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DataV;
