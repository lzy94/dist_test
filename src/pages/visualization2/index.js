import React, { PureComponent } from 'react';
import { connect } from 'dva';
import ReactParticleLine from 'react-particle-line';
import cloneDeep from 'lodash.clonedeep';
import echarts from 'echarts';
// import 'echarts-gl';

import StandardTable from '@/components/StandardTable';

import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

import { Tabs, Tag } from 'antd';
import ReactEcharts from 'echarts-for-react';
import { getLocalStorage, socketUrl } from '@/utils/utils';
import style from './index.less';
import { areaAllName, areaAllCode } from './area.js';
import logo from '@/assets/dataV/logo.png';

const { TabPane } = Tabs;
const color = [
  "#c1232b",
  "#27727b",
  "#fcce10",
  "#e87c25",
  "#b5c334",
  "#fe8463",
  "#9bca63",
  "#fad860",
  "#f3a43b",
  "#60c0dd",
  "#d7504b",
  "#c6e579",
  "#f4e001",
  "#f0805a",
  "#26c0c0"];

const names = ['动态执法', '静态执法', '案件状态', '站点设备', '轴型', '执法人员', '站点建设', '黑名单'];

let stompClient = null;

/* eslint react/no-multi-comp:0 */
@connect(({ user, BigScreen, loading }) => ({
  BigScreen,
  loading: loading.models.BigScreen,
  currentUser: user.currentUser,
}))
class DataVis extends PureComponent {

  constructor(props) {
    super(props);
    this.tabKeyTime = null;
    // getLocalStorage('organId') 510781
    this.organCode = getLocalStorage('organId') || 51;
    this.state = this.getInitialState();
  }


  getInitialState = () => ({
    tabKey: 0,
    flowCount: 0,  // 道路流量
    count: 0,      // 检测总数
    dyProportion: '0', // 动态占比
    stProportion: '0',  // 静态占比
    dyBarOption: this.getBarOption(), // 动态检测柱状图
    staticBarOption: this.getBarOption(), // 静态检测柱状图
    mapOption: this.getMapOption(), // 地图
    dyLawDataOption: this.getBarOption(), // 类八卦动态执法
    staticLaeDataOption: this.getBarOption(), // 类八卦静态执法
    dyLawCaseOption: this.getBarOption(), // 类八卦案件状态
    siteEquimentOption: this.getBarOption(), // 类八卦设备状态
    bigScreenAxleDataOption: this.getBarOption(), // 类八卦轴型
    personnelLawOption: this.getBarOption(), // 类八卦执法人员
    // siteOverviewOption: this.getPieOption(), // 类八卦站点建设
    dySiteOverviewOption: this.getPieOption(),
    statusSiteOverviewOption: this.getPieOption(),
    sourceSiteOverviewOption: this.getPieOption(),
    busDlackOption: this.getBarOption(), // 类八卦黑名单
    dataList: {
      list: [],
      pagination: {}
    }
  });

  componentDidMount() {
    this.getBigScreenData();
    this.getSiteList();
    this.getOthterData(0, () => {
      this.formatDyLawData();
      setTimeout(() => {
        // this.initWebSocket();
        this.tabKeyTime = setInterval(() => this.changeTabKey(), 10000);
      }, 5000);
    });
  }

  componentWillUnmount = () => {
    if (this.tabKeyTime) {
      clearInterval(this.tabKeyTime);
    }

    if (stompClient) {
      stompClient.disconnect();
      stompClient = null;
    }
  }


  initWebSocket = () => {
    this.connection();
  };

  onMessage = msg => {
    // console.log(msg.body); // msg.body存放的是服务端发送给我们的信息
    this.getBigScreenData();
    this.getSiteList();

    const m = JSON.parse(msg.body);
    let newData = m.data;
    newData.id = new Date().getTime();
    const list = [newData, ...this.state.dataList.list];
    if (list.length > 10) {
      list.splice(9, 10);
    }
    this.setState({
      dataList: {
        list: list,
        pagination: {}
      }
    })
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
        siteIds ? siteIds.split(',').map(item => {
          stompClient.subscribe(`/topic/${item}`, this.onMessage);
        }) : null;
      },
      err => {
        console.log('失败');
        console.log(err);
        // this.connection();
      },
    );
  };


  getArea = () => {
    // const index = areaAllCode.indexOf(this.organCode);
    const fileName = `${this.organCode}.json`;
    return require(`@/assets/area/${fileName}`);
  }


  /**
   * @description 类八卦图案 自动选择
   */
  changeTabKey = () => {
    const tabKey = this.state.tabKey === 7 ? -1 : this.state.tabKey;
    const newKey = tabKey + 1;
    this.getOthterData(newKey, () => {
      switch (newKey) {
        case 0:
          this.formatDyLawData();
          break;
        case 1:
          this.formatStaticLawData();
          break;
        case 2:
          this.formatDyLawCase();
          break;
        case 3:
          this.formatSiteEquiment();
          break;
        case 4:
          this.formatBigScreenAxleData();
          break;
        case 5:
          this.formatPersonnelLawData()
          break;
        case 6:
          this.formatSiteOverviewData1();
          this.formatSiteOverviewData2();
          this.formatSiteOverviewData3();
          break;
        case 7:
          this.formatBusDlackData();
          break;
        default:
      }
    })

    this.setState({
      tabKey: newKey
    })
  }


  /**
   * @description 获取检测数据
   */
  getBigScreenData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'BigScreen/bigScreenData',
      payload: {
        organCode: this.organCode
      },
      callback: () => {
        this.getDyStData();
      }
    })
  }

  /**
   * @description 获取地图站点列表
   */
  getSiteList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'BigScreen/siteList',
      payload: { organCode: this.organCode },
      callback: res => {
        this.formDataSiteList(res.siteList)
      }
    })
  }


  /**
   * @description 格式化站点数据
   * @param {*} list
   */
  formDataSiteList = list => {
    const siteList = list.map(item => ({
      name: item.SITE_NAME,
      value: [parseFloat(item.LONGITUDE), parseFloat(item.LATITUDE)]
    }));

    const option = cloneDeep(this.state.mapOption);
    option.series[0].data = siteList;
    this.setState({ mapOption: option })
  }


  /**
   * @description 获取八卦数据
   * @param {*} key
   */
  getOthterData = (key, callback) => {
    // [获取动态执法数据,获取静态执法数据,案件状态数据,站点设备状态]
    const path = ['bigScreenDyLawData', 'bigScreenStaticLawData', 'bigScreenDyLawCaseData', 'bigScreenSiteEquiment', 'bigScreenAxleData', 'personnelLaw', 'siteOverview', 'busDlack'];
    const { dispatch } = this.props;
    let organCode = this.organCode;
    if (key === 2) {
      organCode = organCode.toString().substring(0, 4);
    }
    dispatch({
      type: `BigScreen/${path[key]}`,
      payload: { organCode },
      callback: () => {
        callback && callback();
      }
    })
  }


  /**
   * @description 计算总数
   * @param {*} list
   * @returns
   */
  getCount = list => {
    let count = 0;
    for (let i = 0; i < list.length; i++) {
      count += list[i].TOTAL;
    }
    return count;
  }

  /**
   * @description
   */
  getDyStData = () => {
    const { BigScreen: { data } } = this.props;
    const { dyBarOption, staticBarOption } = this.state;
    const [dynamicScreen, staticScreen] = [data.dynamicScreen || [], data.staticScreen || []];

    // [动态总数,静态总数,检测]
    const [dynamicScreenCount, staticScreenCount] = [this.getCount(dynamicScreen), this.getCount(staticScreen)];
    const count = dynamicScreenCount + staticScreenCount;  // 检测总数

    const dyProportion = (dynamicScreenCount / count * 100).toFixed(2); // 动态占比
    const stProportion = (staticScreenCount / count * 100).toFixed(2);  // 静态占比

    // [动态Option,静态Option]  拷贝对象
    const [dyOption, staticOption] = [cloneDeep(dyBarOption), cloneDeep(staticBarOption)];

    dyOption.legend.data = staticOption.legend.data = ['总数', '超限数'];

    // dyOption.yAxis.type = 'category';
    // dyOption.xAxis.type = 'value';
    dyOption.xAxis.data = dynamicScreen.map(item => {
      if (item.ORGAN_CODE) {
        return areaAllName[areaAllCode.indexOf(parseInt(item.ORGAN_CODE))];
      }
      return item.SITE_NAME;
    });

    // staticOption.yAxis.type = 'value';
    // staticOption.xAxis.type = 'category';
    staticOption.xAxis.data = staticScreen.map(item => {
      if (item.ORGAN_CODE) {
        return areaAllName[areaAllCode.indexOf(parseInt(item.ORGAN_CODE))];
      }
      return item.SITE_NAME;

    });


    const series = [
      {
        name: '总数',
        type: 'line',
        smooth: true,
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(
              0, 0, 1, 0,
              [
                { offset: 0, color: '#FF8400' },
                { offset: 1, color: '#FFC000' }
              ]
            )
          },
        },
        data: []
      },
      {
        name: '超限数',
        type: 'bar',
        barMaxWidth: 10,
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(
              0, 0, 1, 0,
              [
                { offset: 0, color: '#0167E8' },
                { offset: 1, color: '#00C6FF' }
              ]
            )
          },
        },
        data: []
      },
    ];

    // 动态检测
    const dySeries = cloneDeep(series);
    dySeries[0].data = dynamicScreen.map(item => item.TOTAL);
    dySeries[1].data = dynamicScreen.map(item => item.OVERLOAD);
    dyOption.series = dySeries;

    // 静态检测
    const staticSeries = cloneDeep(series);
    staticSeries[0].data = staticScreen.map(item => item.TOTAL);
    staticSeries[1].data = staticScreen.map(item => item.OVERLOAD);
    staticOption.series = staticSeries;

    this.setState({
      flowCount: dynamicScreenCount,
      count: count,
      dyProportion: dyProportion,
      stProportion: stProportion,
      dyBarOption: dyOption,
      staticBarOption: staticOption
    })
  }


  // static getDerivedStateFromProps(nextProps, prevState) {
  //   console.log(nextProps, prevState)
  // }


  numsArr = num => {
    const arr = num.toString().split('');
    return arr;
  }

  /**
   * @description 渲染数字
   * @param {*} num
   * @returns
   */
  renderNumber = num => {
    const str = num.toString().split('');
    return <div className={style.numbers}>
      {str.map((item, i) => <span key={i}>{item}</span>)}
    </div>
  }


  getPieOption = () => ({
    color: color,
    tooltip: {
      trigger: 'item',
      formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
      x: 'center',
      itemWidth: 16,
      itemHeight: 10,
      textStyle: {
        color: '#59BAF2'
      },
      data: []
    },
  });


  getBarOption = () => ({
    title: {},
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      x: 'right',
      itemWidth: 16,
      itemHeight: 10,
      textStyle: {
        color: '#59BAF2'
      },
      data: []
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      axisLabel: {
        color: '#5EC4FF'
      },
      axisLine: {
        lineStyle: {
          color: '#3486DA'
        }
      },
      splitLine: {
        show: false
      },
      data: []
      // boundaryGap: [0, 0.01]
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#5EC4FF'
      },
      axisLine: {
        lineStyle: {
          color: '#3486DA'
        }
      },
      splitLine: {
        show: false
      },
      data: []
    },
    series: []
  });



  /**
   * @description 动态检测
   * @returns
   */
  renderDymanicBar = () => {
    return <ReactEcharts
      option={this.state.dyBarOption}
      style={{ height: '100%' }}
    />
  }

  /**
   * @description 静态检测
   * @returns
   */
  renderStaticBar = () => {
    return <ReactEcharts
      option={this.state.staticBarOption}
      style={{ height: '100%' }}
    />
  }

  renderProgress = title => {
    const option = {
      color: ['#05496D', '#FFDE00'],
      title: {
        text: title,
        x: 'center',
        textStyle: {
          color: '#A2D4E6',
          fontSize: 18,
          fontWeight: 500,
        }
      },
      tooltip: {
        show: false
      },
      series: [{
        name: '任务进度',
        type: 'pie',
        radius: ['60%', '70%'],
        label: {
          normal: {
            position: 'center'
          }
        },
        hoverAnimation: false,
        data: [{
          value: 20,
          name: '任务进度',
          itemStyle: {
            normal: {
            }
          },
          label: {
            normal: {
              formatter: '{d}%',
              textStyle: {
                color: '#FFEB00',
                fontSize: 40,
              }
            }
          },
        }, {
          value: 80,
          itemStyle: {
            normal: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: '#05496D' // 0% 处的颜色
                }, {
                  offset: 1, color: '#FFDE00' // 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
              }
            }
          },
        }]
      }]
    };

    return <ReactEcharts
      option={option}
      style={{ height: '100%' }}
    />
  }


  /**
   * @description 地图Option
   */
  getMapOption = () => ({
    geo: {
      show: true,
      map: 'areaMap',
      left: 'left',
      label: {
        normal: {
          show: true,
          color: '#BFF4FF',
          fontSize: 15,
          fontWeight: 500,
        },
        emphasis: {
          show: true,
          textStyle: {
            color: '#BFF4FF',
          }
        }
      },
      roam: true,
      itemStyle: {
        normal: {
          color: '#053750',
          borderColor: '#01BDE5',
          borderWidth: 1
        },
        emphasis: {
          areaColor: 'rgba(5,55,80,0.7)',
        }
      }
    },
    series: [
      {
        name: '地点',
        type: 'effectScatter',
        coordinateSystem: 'geo',
        zlevel: 1,
        rippleEffect: {
          brushType: 'stroke',
          period: 5,
          scale: 3
        },
        label: {
          normal: {
            show: false,
            position: 'bottom',
            formatter: '{b}',
            textStyle: {
              fontSize: 17
            }
          },
          emphasis: {
            show: true,
            position: 'right',
            formatter: '{b}',
            textStyle: {
              color: '#000',
              padding: 5,
              backgroundColor: '#fff'
            }
          }
        },
        symbolSize: 10,
        showEffectOn: 'render',
        itemStyle: {
          normal: {
            color: '#46bee9'
          }
        },
        data: []
      }
    ]
  })

  renderMap = () => {
    const area = this.getArea();
    echarts.registerMap('areaMap', area); // 地图注册

    return <ReactEcharts
      option={this.state.mapOption}
      style={{ height: '100%' }}
      onEvents={{
        'click': this.mapClick
      }}
    />
  }

  mapClick = (e, i) => {
    console.log(e, i)
  }


  /**
   * @description 格式化动态检测
   */
  formatDyLawData = () => {
    const { BigScreen: { dyLawData } } = this.props;
    const option = cloneDeep(this.state.dyLawDataOption);

    const legendData = ['总数', '未审核', '免处罚', '初审', '复审', '结案', '无效'];
    const legendField = ['TOTAL', 'NOTCHECK', 'NOTPUNISH', 'ONECHECK', 'TWOCHECK', 'CLOSECASE', 'INVALIDATA'];

    option.legend.data = legendData;

    option.color = color;
    // option.yAxis.type = 'value';
    // option.xAxis.type = 'category';
    option.xAxis.data = dyLawData.map(item => {
      if (item.ORGAN_CODE) {
        return areaAllName[areaAllCode.indexOf(parseInt(item.ORGAN_CODE))];
      }
      return item.SITE_NAME;
    });

    const series = [
      {
        name: '总数',
        type: 'line',
        smooth: true,
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: '#eb64fb'
            },
            {
              offset: 1,
              color: '#3fbbff0d'
            }
            ], false),
          }
        },
        data: []
      }
    ];

    const dySeries = cloneDeep(series);

    for (let i = 1; i < legendData.length; i++) {
      dySeries.push({
        name: legendData[i],
        type: 'bar',
        barMaxWidth: 10,
        data: dyLawData.map(item => item[legendField[i]])
      })
    }
    dySeries[0].data = dyLawData.map(item => item.TOTAL);
    option.series = dySeries;
    this.setState({
      dyLawDataOption: option
    })
  }

  /**
   * @description 类八卦动态执法
   * @returns
   */
  renderDyLawData = () => {
    return <ReactEcharts
      option={this.state.dyLawDataOption}
      style={{ height: '100%' }}
    />
  }


  /**
  * @description 格式化静态执法
  */
  formatStaticLawData = () => {
    const { BigScreen: { staticLaeData } } = this.props;
    const option = cloneDeep(this.state.staticLaeDataOption);

    const legendData = ['总数', '未审核', '已审核', '未签批', '已签批', '已作废'];
    const legendField = ['TOTAL', 'NOTCKECK', 'CKECKED', 'NOTENDORSEMENT', 'ENDORSEMENT', 'TOVOID'];

    option.legend.data = legendData;

    option.color = color;
    // option.yAxis.type = 'value';
    // option.xAxis.type = 'category';
    option.xAxis.data = staticLaeData.map(item => {
      if (item.ORGAN_CODE) {
        return areaAllName[areaAllCode.indexOf(parseInt(item.ORGAN_CODE))];
      }
      return item.SITE_NAME;
    });

    const series = [
      {
        name: '总数',
        type: 'line',
        smooth: true,
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: '#eb64fb'
            },
            {
              offset: 1,
              color: '#3fbbff0d'
            }
            ], false),
          }
        },
        data: []
      }
    ];

    const dySeries = cloneDeep(series);

    for (let i = 1; i < legendData.length; i++) {
      dySeries.push({
        name: legendData[i],
        type: 'bar',
        barMaxWidth: 10,
        data: staticLaeData.map(item => item[legendField[i]])
      })
    }
    dySeries[0].data = staticLaeData.map(item => item.TOTAL);
    option.series = dySeries;
    this.setState({
      staticLaeDataOption: option
    })
  }

  /**
    * @description 类八卦静态执法
    * @returns
    */
  renderStaticLawData = () => {
    return <ReactEcharts
      option={this.state.staticLaeDataOption}
      style={{ height: '100%' }}
    />
  }



  /**
   * @description 格式化案件状态
   */
  formatDyLawCase = () => {
    const { BigScreen: { dyLawCase } } = this.props;
    const option = cloneDeep(this.state.dyLawCaseOption);

    const legendData = ['总数', '未签批', '已签批', '已归档'];
    const legendField = ['TOTAL', 'NOTDORSEMENT', 'DORSEMENT', 'FILED'];

    option.legend.data = legendData;

    option.color = color;
    // option.yAxis.type = 'value';
    // option.xAxis.type = 'category';
    option.xAxis.data = dyLawCase.map(item => {
      if (item.ORGAN_CODE) {
        return areaAllName[areaAllCode.indexOf(parseInt(item.ORGAN_CODE))];
      }
      return item.SITE_NAME;
    });

    const series = [
      {
        name: '总数',
        type: 'line',
        smooth: true,
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: '#eb64fb'
            },
            {
              offset: 1,
              color: '#3fbbff0d'
            }
            ], false),
          }
        },
        data: []
      }
    ];

    const dySeries = cloneDeep(series);

    for (let i = 1; i < legendData.length; i++) {
      dySeries.push({
        name: legendData[i],
        type: 'bar',
        barMaxWidth: 10,
        data: dyLawCase.map(item => item[legendField[i]])
      })
    }
    dySeries[0].data = dyLawCase.map(item => item.TOTAL);
    option.series = dySeries;
    this.setState({
      dyLawCaseOption: option
    })
  }


  /**
    * @description 类八卦案件状态
    * @returns
    */
  renderDyLawCase = () => {
    return <ReactEcharts
      option={this.state.dyLawCaseOption}
      style={{ height: '100%' }}
    />
  }

  /**
    * @description 格式化设备状态
    */
  formatSiteEquiment = () => {
    const { BigScreen: { siteEquiment } } = this.props;
    const option = cloneDeep(this.state.siteEquimentOption);

    const legendData = ['总数', '维修', '禁用', '正常'];
    const legendField = ['TOTAL', 'REPAIRING', 'PROHIBIT', 'NORMAL'];

    option.legend.data = legendData;

    option.color = color;
    // option.yAxis.type = 'value';
    // option.xAxis.type = 'category';
    option.xAxis.data = siteEquiment.map(item => {
      if (item.ORGAN_CODE) {
        return areaAllName[areaAllCode.indexOf(parseInt(item.ORGAN_CODE))];
      }
      return item.SITE_NAME;
    });

    const series = [
      {
        name: '总数',
        type: 'line',
        smooth: true,
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: '#eb64fb'
            },
            {
              offset: 1,
              color: '#3fbbff0d'
            }
            ], false),
          }
        },
        data: []
      }
    ];

    const dySeries = cloneDeep(series);

    for (let i = 1; i < legendData.length; i++) {
      dySeries.push({
        name: legendData[i],
        type: 'bar',
        barMaxWidth: 10,
        data: siteEquiment.map(item => item[legendField[i]])
      })
    }
    dySeries[0].data = siteEquiment.map(item => item.TOTAL);
    option.series = dySeries;
    this.setState({
      siteEquimentOption: option
    })
  }


  /**
    * @description 类八卦案件状态
    * @returns
    */
  renderSiteEquiment = () => {
    return <ReactEcharts
      option={this.state.siteEquimentOption}
      style={{ height: '100%' }}
    />
  }

  formatBigScreenAxleData = () => {
    const { BigScreen: { bigScreenAxleData } } = this.props;
    const option = cloneDeep(this.state.bigScreenAxleDataOption);
    const newData = bigScreenAxleData.sort((a, b) => a.AXLE_NUMBER - b.AXLE_NUMBER);
    option.legend.data = ['总数', '超限数'];
    option.xAxis.data = newData.map(item => `${item.AXLE_NUMBER}轴`);

    const series = [
      {
        name: '总数',
        type: 'line',
        smooth: true,
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: '#eb64fb'
            },
            {
              offset: 1,
              color: '#3fbbff0d'
            }
            ], false),
          }
        },
        data: newData.map(item => item.TOTAL)
      },
      {
        name: '超限数',
        type: 'bar',
        barMaxWidth: 10,
        data: newData.map(item => item.OVERLOAD)
      }
    ];
    option.series = series;
    this.setState({ bigScreenAxleDataOption: option })

  }

  /**
    * @description 类八卦轴型
    * @returns
    */
  renderBigScreenAxleData = () => {
    return <ReactEcharts
      option={this.state.bigScreenAxleDataOption}
      style={{ height: '100%' }}
    />
  }


  getSiteCount = (list, field) => {
    let total = 0;
    for (let i = 0; i < list.length; i++) {
      total += list[i][field];
    }

    return total;
  }

  formatSiteOverviewData1 = () => {
    const { BigScreen: { siteOverviewData } } = this.props;
    const dySites = siteOverviewData.dySites;
    const option = cloneDeep(this.state.dySiteOverviewOption);
    const legendData = ['报废', '在用', '检修']; // 0 1 2
    const legendField = ['DISTORYED', 'WORKING', 'NOTWORKING'];
    option.legend.data = legendData;

    const newDySites = legendField.map((item, index) => ({
      name: legendData[index],
      value: this.getSiteCount(dySites, item)
    }));

    const series = [{
      name: '动态站',
      type: 'pie',
      selectedMode: 'single',
      radius: ['55%', '65%'],
      label: {
        normal: {
          show: true,
          position: 'center',
          lineHeight: 25,
          formatter: () => {
            const arr = [
              `{a|${this.getSiteCount(dySites, 'TOTAL')}}`,
              `{b|动态站总数}`
            ];
            return arr.join('\n');
          },
          rich: {
            a: {
              color: '#A2D4E6',
              fontSize: 28
            },
            b: {
              color: '#666',
              fontSize: 12,
              fontWeight: 400
            }
          }
        },
      },

      // label: {
      //   show: false
      // },
      // label: {
      //   normal: {
      //     position: 'inner'
      //   }
      // },
      // labelLine: {
      //   normal: {
      //     show: false
      //   }
      // },
      data: newDySites
    }];

    option.series = series;

    this.setState({ dySiteOverviewOption: option })

  }


  formatSiteOverviewData2 = () => {
    const { BigScreen: { siteOverviewData } } = this.props;
    const staticSites = siteOverviewData.staticSites;
    const option = cloneDeep(this.state.statusSiteOverviewOption);
    const legendData = ['报废', '在用', '检修']; // 0 1 2
    const legendField = ['DISTORYED', 'WORKING', 'NOTWORKING'];
    option.legend.data = legendData;

    const newStaticSites = legendField.map((item, index) => ({
      name: legendData[index],
      value: this.getSiteCount(staticSites, item)
    }))

    const series = [{
      name: '静态站',
      type: 'pie',
      selectedMode: 'single',
      radius: ['55%', '65%'],
      label: {
        normal: {
          show: true,
          position: 'center',
          lineHeight: 25,
          formatter: () => {
            const arr = [
              `{a|${this.getSiteCount(staticSites, 'TOTAL')}}`,
              `{b|静态站总数}`
            ];
            return arr.join('\n');
          },
          rich: {
            a: {
              color: '#A2D4E6',
              fontSize: 28
            },
            b: {
              color: '#666',
              fontSize: 12,
              fontWeight: 400
            }
          }
        },
      },
      data: newStaticSites
    }];


    option.series = series;

    this.setState({ statusSiteOverviewOption: option })

  }


  formatSiteOverviewData3 = () => {
    const { BigScreen: { siteOverviewData } } = this.props;
    const sourceConpany = siteOverviewData.sourceConpany;
    const option = cloneDeep(this.state.sourceSiteOverviewOption);
    const legendData = ['报废', '在用', '检修']; // 0 1 2
    const legendField = ['DISTORYED', 'WORKING', 'NOTWORKING'];
    option.legend.data = legendData;

    const newSourceConpany = legendField.map((item, index) => ({
      name: legendData[index],
      value: this.getSiteCount(sourceConpany, item)
    }))

    const series = [{
      name: '源头',
      type: 'pie',
      selectedMode: 'single',
      radius: ['55%', '65%'],
      label: {
        normal: {
          show: true,
          position: 'center',
          lineHeight: 25,
          formatter: () => {
            const arr = [
              `{a|${this.getSiteCount(sourceConpany, 'TOTAL')}}`,
              `{b|源头总数}`
            ];
            return arr.join('\n');
          },
          rich: {
            a: {
              color: '#A2D4E6',
              fontSize: 28
            },
            b: {
              color: '#666',
              fontSize: 12,
              fontWeight: 400
            }
          }
        },
      },
      data: newSourceConpany
    }];

    option.series = series;

    this.setState({ sourceSiteOverviewOption: option })

  }


  formatPersonnelLawData = () => {
    const { BigScreen: { personnelLawData } } = this.props;
    const option = cloneDeep(this.state.personnelLawOption);

    const legendData = ['总数', '初审', '复审', '签批', '结案', '免处罚', '无效数据'];
    const legendField = ['TOTAL', 'PENDINGVERIFY', 'VERIFYPASS', 'SIGNINGPASS', 'ARCHIVEDATE', 'PENALTYDATE', 'INCALIDDATE'];
    const keys = personnelLawData.map(item => Object.keys(item).join())

    const newData = keys.map((item, index) => personnelLawData[index][item][0]);

    option.xAxis.data = keys;
    option.legend.data = legendData;

    const series = legendData.map((item, index) => ({
      name: legendData[index],
      smooth: true,
      type: index === 0 ? 'line' : 'bar',
      barMaxWidth: 10,
      data: newData.map((item2) => item2[legendField[index]])
    }))

    series[0].areaStyle = {
      normal: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          offset: 0,
          color: '#eb64fb'
        },
        {
          offset: 1,
          color: '#3fbbff0d'
        }
        ], false),
      }
    };

    option.series = series;
    this.setState({ personnelLawOption: option });
  }

  /**
    * @description 类八卦执法人员
    * @returns
    */
  renderPersonnelLaw = () => {
    return <ReactEcharts
      option={this.state.personnelLawOption}
      style={{ height: '100%' }}
    />
  }

  /**
    * @description 类八卦站点建设
    * @returns
    */
  renderDySiteOverview = () => {
    return <ReactEcharts
      option={this.state.dySiteOverviewOption}
      style={{ height: '100%' }}
    />
  }

  renderStatusSiteOverview = () => {
    return <ReactEcharts
      option={this.state.statusSiteOverviewOption}
      style={{ height: '100%' }}
    />
  }

  renderSourceSiteOverview = () => {
    return <ReactEcharts
      option={this.state.sourceSiteOverviewOption}
      style={{ height: '100%' }}
    />
  }

  formatBusDlackData = () => {
    const { BigScreen: { busDlackData } } = this.props;
    const option = cloneDeep(this.state.busDlackOption);

    option.legend.data = ['总数'];

    option.xAxis.data = busDlackData.map(item => {
      return areaAllName[areaAllCode.indexOf(parseInt(item.ORGAN_CODE))];
    });

    const series = [{
      name: '总数',
      type: 'line',
      smooth: true,
      areaStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: '#eb64fb'
          },
          {
            offset: 1,
            color: '#3fbbff0d'
          }
          ], false),
        }
      },
      data: busDlackData.map(item => item.TOTAL)
    }];
    option.series = series;

    this.setState({ busDlackOption: option })

  }

  /**
   * @description 类八卦黑名单
   * @returns
   */
  renderBusDlack = () => {
    return <ReactEcharts
      option={this.state.busDlackOption}
      style={{ height: '100%' }}
    />
  }


  /**
   * @description: 渲染每项的四个边角
   * @param {type}
   * @return: <node>
   */
  renderBorder = () => {
    return (
      <>
        <span className={style.tl}></span>
        <span className={style.tr}></span>
        <span className={style.bl}></span>
        <span className={style.br}></span>
      </>
    )
  }

  renderEightDiagrams = () => {
    const { tabKey } = this.state;
    return (
      <div className={style.eightDiagramsMain}>
        {names.map((item, index) => <div key={index} className={`${style.menuItem} ${tabKey === index ? style.action : ''}`}>
          <span></span>
          <p>{item}</p>
        </div>)}
        <div className={style.centerPanel}>
          <div className={style.rotate}></div>
        </div>
      </div>
    )
  }

  columns = [
    {
      title: '站点名称',
      dataIndex: 'siteName',
      render: val => val.length > 6 ? (val.substring(0, 6) + '...') : val
    }, {
      title: '车牌号',
      dataIndex: 'carNo'
    }, {
      title: '总重(t)',
      dataIndex: 'totalLoad',
      render: val => (val / 1000).toFixed(2)
    }, {
      title: '超载(t)',
      dataIndex: 'overLoad',
      render: val => val > 0 ? <Tag color='red'>{(val / 1000).toFixed(2)}</Tag> : (val / 1000).toFixed(2)
    }, {
      title: '超重比(%)',
      dataIndex: 'overLoadRate',
      render: val => val > 0.05 ? <Tag color='red'>{(val * 100).toFixed(2)}</Tag> : (val * 100).toFixed(2)
    }]

  render() {

    const { dataList, count, flowCount, dyProportion, stProportion, tabKey } = this.state;
    return (
      // <ReactParticleLine>
      <div className={style.dataMain}>
        <div className={style.bg}>
          <div className={style.header}>
            <div className={style.logo}>
              <img src={logo} alt="四川奇石缘" />
            </div>
            <div className={style.title}>
              综合交通执法管理平台
            </div>
            <div className={style.rightBtnGroup}>
              {/* <a href="javascript:void(0)" title="数据统计" className={style.action}>数据统计</a>
              <a href="javascript:void(0)" title="四川">四川</a>
              <a href="javascript:void(0)" title="绵阳">绵阳</a>
              <a href="javascript:void(0)" title="涪城区">涪城区</a> */}
            </div>
          </div>
          <div className={style.content}>
            <div className={style.dataCell}>
              <div className={style.leftMain}>
                <div className={style.borderTB}>
                  {this.renderBorder()}
                  <div className={style.dataItem}>
                    <h3 className={style.itemTitle}>绵阳市综合交通管理概况</h3>
                    <ul className={style.numberStatistics}>
                      <li>
                        <h3>道路流量</h3>
                        <div className={style.body}>
                          {this.renderNumber(flowCount)}
                          {/* <span className={style.unit}>次</span> */}
                        </div>
                      </li>
                      <li>
                        <h3>检测总数</h3>
                        <div className={style.body}>
                          {this.renderNumber(count)}
                          {/* <span className={style.unit}>次</span> */}
                        </div>
                      </li>
                      <li>
                        <h3>动态占比</h3>
                        <div className={style.body}>
                          <div className={style.numbers}>
                            <span>{dyProportion}%</span>
                          </div>
                        </div>
                      </li>
                      <li>
                        <h3>静态占比</h3>
                        <div className={style.body}>
                          <div className={style.numbers}>
                            <span>{stProportion}%</span>
                          </div>
                        </div>
                      </li>
                    </ul>
                    <div className={style.map} style={{ position: 'relative' }}>
                      {this.renderMap()}

                      <div className={style.table}>
                        <StandardTable
                          size='small'
                          selectedRows={0}
                          rowSelection={null}
                          data={dataList}
                          columns={this.columns}
                          pagination={false}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={style.dataCell}>
              <div className={style.rightTop}>
                <div className={style.itemLeft}>
                  <div className={style.borderTB}>
                    {this.renderBorder()}
                    <div className={style.dataItem}>
                      <h3 className={`${style.itemTitle} ${style.position}`}>动态检测</h3>
                      {this.renderDymanicBar()}
                    </div>
                  </div>
                </div>
                <div className={style.itemRight}>
                  <div className={style.borderTB}>
                    {this.renderBorder()}
                    <div className={`${style.dataItem}`}>
                      <h3 className={`${style.itemTitle} ${style.position}`}>静态检测</h3>
                      {this.renderStaticBar()}
                    </div>
                  </div>
                </div>
              </div>
              <div className={style.rihgtBottom}>
                <div className={style.borderTB}>
                  {this.renderBorder()}
                  <div className={`${style.dataItem} ${style.radarMsg}`}>
                    <h3 className={style.itemTitle}>{names[tabKey]}</h3>
                    <div className={style.lawMain} style={{ height: 'calc(100% - 36px)' }}>
                      <div className={style.lawItem}>
                        {this.renderEightDiagrams()}
                      </div>
                      <div className={style.lawItem}>


                        <div className={style.myTabs}>
                          <div className={`${style.myTabPane} ${tabKey === 0 ? style.active : ''}`}>
                            {this.renderDyLawData()}
                          </div>
                          <div className={`${style.myTabPane} ${tabKey === 1 ? style.active : ''}`}>
                            {this.renderStaticLawData()}
                          </div>
                          <div className={`${style.myTabPane} ${tabKey === 2 ? style.active : ''}`}>
                            {this.renderDyLawCase()}
                          </div>
                          <div className={`${style.myTabPane} ${tabKey === 3 ? style.active : ''}`}>
                            {this.renderSiteEquiment()}
                          </div>
                          <div className={`${style.myTabPane} ${tabKey === 4 ? style.active : ''}`}>
                            {this.renderBigScreenAxleData()}
                          </div>
                          <div className={`${style.myTabPane} ${tabKey === 5 ? style.active : ''}`}>
                            {this.renderPersonnelLaw()}
                          </div>
                          <div className={`${style.myTabPane} ${tabKey === 6 ? style.active : ''}`}>
                            <div style={{ display: 'flex', height: '100%', flexWrap: 'wrap' }}>
                              <div style={{ width: '50%', height: '50%' }}>
                                {this.renderDySiteOverview()}
                              </div>
                              <div style={{ width: '50%', height: '50%' }}>
                                {this.renderStatusSiteOverview()}
                              </div>
                              <div style={{ width: '100%', height: '50%' }}>
                                {this.renderSourceSiteOverview()}
                              </div>
                            </div>
                          </div>
                          <div className={`${style.myTabPane} ${tabKey === 7 ? style.active : ''}`}>
                            {this.renderBusDlack()}
                          </div>
                        </div>


                        {/* <Tabs activeKey={tabKey.toString()}>
                          <TabPane tab="Tab 0" key="0">
                            {this.renderDyLawData()}
                          </TabPane>
                          <TabPane tab="Tab 1" key="1">
                            {this.renderStaticLawData()}
                          </TabPane>
                          <TabPane tab="Tab 2" key="2">
                            {this.renderDyLawCase()}
                          </TabPane>
                          <TabPane tab="Tab 3" key="3">
                            {this.renderSiteEquiment()}
                          </TabPane>
                          <TabPane tab="Tab 4" key="4">
                            {this.renderBigScreenAxleData()}
                          </TabPane>
                          <TabPane tab="Tab 5" key="5">
                            {this.renderPersonnelLaw()}
                          </TabPane>
                          <TabPane tab="Tab 6" key="6">
                            <div style={{ display: 'flex', height: '100%', flexWrap: 'wrap' }}>
                              <div style={{ width: '50%', height: '50%' }}>
                                {this.renderDySiteOverview()}
                              </div>
                              <div style={{ width: '50%', height: '50%' }}>
                                {this.renderStatusSiteOverview()}
                              </div>
                              <div style={{ width: '100%', height: '50%' }}>
                                {this.renderSourceSiteOverview()}
                              </div>
                            </div>
                          </TabPane>
                          <TabPane tab="Tab 7" key="7">
                            {this.renderBusDlack()}
                          </TabPane>
                        </Tabs> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      // </ReactParticleLine>
    );
  }

}

export default DataVis;
