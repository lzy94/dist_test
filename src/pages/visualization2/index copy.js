import React, { PureComponent } from 'react';
import { connect } from 'dva';
import ReactParticleLine from 'react-particle-line';
import cloneDeep from 'lodash.clonedeep';
import echarts from 'echarts';
import 'echarts-gl';
import { Progress } from 'antd';
import ReactEcharts from 'echarts-for-react';
import { getLocalStorage } from '@/utils/utils';
import style from './index.less';
import { areaAllName, areaAllCode } from './area.js.js';
import logo from '@/assets/dataV/logo.png';

/* eslint react/no-multi-comp:0 */
@connect(({ BigScreen, loading }) => ({
  BigScreen,
  loading: loading.models.BigScreen,
}))
class DataVis extends PureComponent {

  constructor(props) {
    super(props);
    this.tabKeyTime = null;
    // getLocalStorage('organId')
    this.organCode = getLocalStorage('organId');
    this.state = this.getInitialState();
  }


  getInitialState = () => ({
    tabKey: '0',
    flowCount: 0,  // 道路流量
    count: 0,      // 检测总数
    dyProportion: '0', // 动态占比
    stProportion: '0',  // 静态占比
    dyBarOption: this.getBarOption(), // 动态检测柱状图
    staticBarOption: this.getBarOption(), // 静态检测柱状图
    mapOption: this.getMapOption(), // 地图
  });

  componentDidMount() {
    setTimeout(() => {
      this.tabKeyTime = setInterval(() => this.changeTabKey(), 5000);
    }, 5000);
    this.getBigScreenData();
    this.getSiteList();
  }

  componentWillUnmount = () => {
    if (this.tabKeyTime) {
      clearInterval(this.tabKeyTime);
    }
  }


  getArea = () => {
    // const index = areaAllCode.indexOf(this.organCode);
    const fileName = `${this.organCode}.json`;
    return require(`@/assets/area/${fileName}`);
  }


  /**
   * @description 类八卦图案 自动选择
   */
  changeTabKey = () => {
    const tabKey = this.state.tabKey === '3' ? '-1' : this.state.tabKey;
    this.setState({
      tabKey: `${parseInt(tabKey) + 1}`
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

    dyOption.yAxis.type = 'category';
    dyOption.xAxis.type = 'value';
    dyOption.yAxis.data = dynamicScreen.map(item => {
      if (item.ORGAN_CODE) {
        return areaAllName[areaAllCode.indexOf(parseInt(item.ORGAN_CODE))];
      }
      return item.SITE_NAME;
    });

    staticOption.yAxis.type = 'value';
    staticOption.xAxis.type = 'category';
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
      // type: 'value',
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
      // type: 'category',
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

  /**
   * 雷达图
   */
  // renderRadar = () => {
  //   const data = [{
  //     name: '涪城区',
  //     value: 30
  //   }, {
  //     name: '高新区',
  //     value: 65
  //   }, {
  //     name: '其他地区',
  //     value: 50
  //   }, {
  //     name: '安州区',
  //     value: 88
  //   }, {
  //     name: '游仙区',
  //     value: 76
  //   }];
  //   const option = {
  //     title: {},
  //     tooltip: {
  //       show: false
  //       // formatter: '{b}{a}'
  //     },
  //     legend: {
  //       show: false,
  //       data: ['超限率统计']
  //     },
  //     radar: {
  //       // shape: 'circle',
  //       name: {
  //         formatter: name => {
  //           let value = '';
  //           for (let i = 0; i < data.length; i++) {
  //             if (name === data[i].name) {
  //               value = data[i].value;
  //             }
  //           }
  //           const arr = [
  //             '{a|' + value + '(%)}',
  //             '{b|' + name + '}',
  //           ];
  //           return arr.join('\n');
  //         },
  //         textStyle: {
  //           lineHeight: 18,
  //           rich: {
  //             a: {
  //               color: '#1EFF60',
  //               fontSize: 16
  //             },
  //             b: {
  //               color: '#A9DDEE',
  //             }
  //           }
  //         },
  //       },
  //       axisLine: {
  //         lineStyle: {
  //           color: '#316AC8'
  //         }
  //       },
  //       splitLine: {
  //         lineStyle: {
  //           color: '#2565D6'
  //         }
  //       },
  //       splitArea: {
  //         show: false
  //       },
  //       radius: '65%',
  //       center: ['50%', '60%'],
  //       indicator: [
  //         { name: '涪城区', max: 100 },
  //         { name: '高新区', max: 100 },
  //         { name: '其他地区', max: 100 },
  //         { name: '安州区', max: 100 },
  //         { name: '游仙区', max: 100 },
  //       ]
  //     },
  //     series: [{
  //       name: '超限率统计',
  //       type: 'radar',
  //       itemStyle: {
  //         normal: {
  //           areaStyle: {
  //             color: '#70EEFC',
  //           }
  //         }
  //       },
  //       lineStyle: {
  //         color: '#fff'
  //       },
  //       data: [
  //         {
  //           value: data.map(item => item.value),
  //           // name: '超限率统计'
  //         },

  //       ]
  //     }]
  //   };
  //   return <ReactEcharts
  //     option={option}
  //     style={{ height: '100%' }}
  //   />
  // }

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

  getMapOption = () => ({
    // geo: {
    //   type: 'map',			  // 系列类型
    //   name: 'Map',			  // 系列名称
    //   map: 'areaMap',           // 地图类型。echarts-gl 中使用的地图类型同 geo 组件相同(ECharts 中提供了两种格式的地图数据，一种是可以直接 script 标签引入的 js 文件，引入后会自动注册地图名字和数据。还有一种是 JSON 文件，需要通过 AJAX 异步加载后手动注册。)
    //   label: {
    //     show: true,
    //     textStyle: {
    //       color: '#BFF4FF',
    //       fontSize: 17,
    //       fontWeight: 500,
    //       backgroundColor: 'transparent'
    //     }
    //   },

    // itemStyle: {// 三维图形的视觉属性
    //   color: '#053750',
    //   borderWidth: 1,
    //   borderColor: '#01BDE5'
    // },

    // emphasis: {             // 鼠标 hover 高亮时图形和标签的样式 (当鼠标放上去时  label和itemStyle 的样式) 
    //   label: {                // label高亮时的配置
    //     show: true,
    //     textStyle: {
    //       color: '#fff',      // 高亮时标签颜色变为 白色
    //       fontSize: 15,       // 高亮时标签字体 变大
    //     }
    //   },
    //   itemStyle: {            // itemStyle高亮时的配置
    //     areaColor: '#66ffff',   // 高亮时地图板块颜色改变
    //   }
    // },

    // groundPlane: {			// 地面可以让整个组件有个“摆放”的地方，从而使整个场景看起来更真实，更有模型感。
    //   show: false,				// 是否显示地面。[ default: false ]
    //   color: '#  '			// 地面颜色。[ default: '#aaa' ]
    // },



    // light: {                    // 光照相关的设置。在 shading 为 'color' 的时候无效。  光照的设置会影响到组件以及组件所在坐标系上的所有图表。合理的光照设置能够让整个场景的明暗变得更丰富，更有层次。
    //   main: {                     // 场景主光源的设置，在 globe 组件中就是太阳光。
    //     color: '#fff',              //主光源的颜色。[ default: #fff ] 
    //     intensity: 1.2,             //主光源的强度。[ default: 1 ]
    //     shadow: false,              //主光源是否投射阴影。默认关闭。    开启阴影可以给场景带来更真实和有层次的光照效果。但是同时也会增加程序的运行开销。
    //     shadowQuality: 'high',      // 阴影的质量。可选'low', 'medium', 'high', 'ultra' [ default: 'medium' ]
    //     alpha: 55,                  // 主光源绕 x 轴，即上下旋转的角度。配合 beta 控制光源的方向。[ default: 40 ]
    //     beta: 10                    // 主光源绕 y 轴，即左右旋转的角度。[ default: 40 ]
    //   },
    //   ambient: {                  // 全局的环境光设置。
    //     color: '#fff',              // 环境光的颜色。[ default: #fff ]
    //     intensity: 0.5              // 环境光的强度。[ default: 0.2 ]
    //   }
    // },

    // viewControl: {			// 用于鼠标的旋转，缩放等视角控制。
    //   damping: 0,						// 鼠标进行旋转，缩放等操作时的迟滞因子，在大于等于 1 的时候鼠标在停止操作后，视角仍会因为一定的惯性继续运动（旋转和缩放）。[ default: 0.8 ]
    //   // distance: 130,					// [ default: 100 ] 默认视角距离主体的距离，对于 grid3D 和 geo3D 等其它组件来说是距离中心原点的距离,对于 globe 来说是距离地球表面的距离。在 projection 为'perspective'的时候有效。
    //   minDistance: 40,				// [ default: 40 ] 视角通过鼠标控制能拉近到主体的最小距离。在 projection 为'perspective'的时候有效。
    //   maxDistance: 400,				// [ default: 400 ] 视角通过鼠标控制能拉远到主体的最大距离。在 projection 为'perspective'的时候有效。
    //   // beta: -90,						// 视角绕 y 轴，即左右旋转的角度。[ default: 0 ]
    //   minAlpha: -360,					// 上下旋转的最小 alpha 值。即视角能旋转到达最上面的角度。[ default: 5 ]
    //   maxAlpha: 360,					// 上下旋转的最大 alpha 值。即视角能旋转到达最下面的角度。[ default: 90 ]
    //   minBeta: -360,					// 左右旋转的最小 beta 值。即视角能旋转到达最左的角度。[ default: -80 ]
    //   maxBeta: 360,					// 左右旋转的最大 beta 值。即视角能旋转到达最右的角度。[ default: 80 ]
    //   center: [0, 0, 0],				// 视角中心点，旋转也会围绕这个中心点旋转，默认为[0,0,0]。
    // },
    // },
    geo: {
      show: true,
      map: 'areaMap',
      label: {
        normal: {
          show: true,
          color: '#BFF4FF',
          fontSize: 17,
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
          // areaColor: '#66ffff',// 地图背景
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
        name: '散点',
        type: 'scatter',
        coordinateSystem: 'geo',
        data: [],
        // symbolSize: function (val) {
        //   return val[2] / 10;
        // },
        symbol: 'circle',
        symbolSize: 10,
        itemStyle: {
          color: 'purple',
          borderColor: '#fff',
          borderWidth: 1
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
        // label: {
        //   show: false,
        //   formatter: '{b}',
        //   position: 'bottom',
        //   textStyle: {
        //     color: '#000',
        //     backgroundColor: '#fff',
        //   }
        // }
      },
      // {
      //   type: 'scatter3D',
      //   coordinateSystem: 'geo3D',
      //   data: [],
      //   symbol: 'circle',
      //   symbolSize: 10,
      //   itemStyle: {
      //     color: 'purple',
      //     borderColor: '#fff',
      //     borderWidth: 1
      //   },
      //   label: {
      //     show: true,
      //     formatter: '{b}',
      //     position: 'bottom',
      //     textStyle: {
      //       color: '#000',
      //       backgroundColor: '#fff',
      //     }
      //   }
      // },
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
        <div className={`${style.menuItem} ${tabKey === '0' ? style.action : ''}`}>
          <span></span>
          <p>动态执法</p>
        </div>
        <div className={style.menuItem}>&nbsp;</div>
        <div className={`${style.menuItem} ${tabKey === '1' ? style.action : ''}`}>
          <span></span>
          <p>静态执法</p>
        </div>
        <div className={style.menuItem}>&nbsp;</div>
        <div className={`${style.menuItem} ${tabKey === '2' ? style.action : ''}`}>
          <span></span>
          <p>案件状态</p>
        </div>
        <div className={style.menuItem}>&nbsp;</div>
        <div className={`${style.menuItem} ${tabKey === '3' ? style.action : ''}`}>
          <span></span>
          <p>站点设备</p>
        </div>
        <div className={style.menuItem}>&nbsp;</div>
        <div className={style.centerPanel}>
          <div className={style.rotate}></div>
        </div>
      </div>
    )
  }

  render() {

    const { count, flowCount, dyProportion, stProportion } = this.state;

    return (
      // <ReactParticleLine>
      <div className={style.dataMain}>
        <div className={style.bg}>
          <div className={style.header}>
            <div className={style.logo}>
              <img src={logo} alt="智慧交通治理平台" />
            </div>
            <div className={style.title}>
              综合交通执法管理平台
            </div>
            <div className={style.rightBtnGroup}>
              <a href="javascript:void(0)" title="数据统计" className={style.action}>数据统计</a>
              <a href="javascript:void(0)" title="四川">四川</a>
              <a href="javascript:void(0)" title="绵阳">绵阳</a>
              <a href="javascript:void(0)" title="涪城区">涪城区</a>
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
                    <div className={style.map}>
                      {this.renderMap()}
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
                      {/* <div className={`${style.dataItem} ${style.radarMsg}`}> */}
                      <h3 className={`${style.itemTitle} ${style.position}`}>静态检测</h3>
                      {this.renderStaticBar()}
                      {/* <div className={style.radar}>
                        {this.renderRadar()}
                      </div> */}
                      {/* <div className={style.msg}>
                        <div className={style.btn}>绵阳市总超限
                          <span>1877次</span>
                        </div>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
              <div className={style.rihgtBottom}>
                <div className={style.borderTB}>
                  {this.renderBorder()}
                  <div className={`${style.dataItem} ${style.radarMsg}`}>
                    <h3 className={style.itemTitle}>执法数据</h3>
                    <div className={style.lawMain} style={{ height: 'calc(100% - 36px)' }}>
                      <div className={style.lawItem}>
                        {this.renderEightDiagrams()}
                      </div>
                      <div className={style.lawItem}>
                        <div className={style.lawMain}>
                          <div className={style.lawItem}>
                            <div className={style.lawData}>
                              {this.renderProgress('动态执法占比')}
                            </div>
                            <div className={style.btn}>
                              已完成审核总数量
                              <p>1430458</p>
                            </div>
                          </div>
                          <div className={style.lawItem}>
                            <div className={style.lawData}>
                              {this.renderProgress('静态执法占比')}
                            </div>
                            <div className={style.btn}>
                              待完成审核总数量
                              <p>30458</p>
                            </div>
                          </div>
                        </div>
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
