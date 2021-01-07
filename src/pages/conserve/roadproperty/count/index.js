import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Spin, Icon, Alert, Empty, Carousel } from 'antd';
import { Markers, Polyline, InfoWindow } from 'react-amap';
import { getRandomColor } from '@/utils/utils';
import clonedeep from 'lodash.clonedeep';
import ReactEcharts from 'echarts-for-react';
import BaseMap from '@/pages/conserve/Component/BaseMap';
import { planRank } from '@/utils/dictionaries';
import LevelModal from '../../command/emergency/component/DetailModal';

import iconStyle from '@/assets/font/conserve/iconfont.css';
import style from './index.less';
import normal from '@/assets/water/waterPoint.png';
import warning from '@/assets/water/waterWarin.gif';
import bpNormal from '@/assets/water/bp-normal.png';
import bpWarning from '@/assets/water/bp-warning.gif';
import yjzh from '@/assets/water/yjzh.gif';

/* eslint react/no-multi-comp:0 */
@connect(({ system, ConservePoint, RoadProductionCategory, ConserveGIS, loading }) => ({
  system,
  ConserveGIS,
  RoadProductionCategory,
  ConservePoint,
  loading: loading.models.ConserveGIS,
  waterLoading: loading.models.ConservePoint,
}))
class Count extends PureComponent {
  constructor(props) {
    super(props);
    this.mapInstance = null;
    this.cateIDS = [];
    this.state = this.getInitialState();
    this.waterTimeInterval = null;
  }

  getInitialState = () => ({
    roadInfoVisible: false,
    roadInfoLngLat: {},
    roadInfoMsg: {},
    roadColors: [],
    cateColors: [],
    polyMarkers: [],
    roadFocusMarkersInfo: '',
    roadFocusMarkersInfoVisible: '',
    markersLnglat: [],
    longitudeandlatitude: [],
    normalMarkers: [],
    warnMarkers: [],
    pyNormalMarkers: [],
    pyWarnMarkers: [],
    chartData: [],
    levelData: [],
    levelMarkers: [],
    levelMarkersInfoLngLat: null,
    levelMarkersInfoVisible: false,
    waterMsg: {},
    waterMarkersInfoLngLat: null,
    waterMarkersInfoVisible: false,
    levelModalVisible: false,
    levelMsg: {},
    center: null,
    oldAddress: '',
    chartOption: this.getChartOption(),
    pageBean: { page: 1, pageSize: 1000, showTotal: true },
  });

  componentDidMount() {
    // this.getCateList();
    // this.getRoadCount();
    // this.getOtherCount();
    // this.getWaterPoint({ pageBean: this.state.pageBean });
    // this.getAllByLevel();
  }

  componentWillReceiveProps(nextProps) {
    const {
      system: { address },
    } = nextProps;
    const { oldAddress } = this.state;
    if (oldAddress !== address) {
      setTimeout(() => {
        try {
          this.getLngLatByAddress(address, lnglat => {
            this.setState({ center: lnglat, oldAddress: address });
          });
        } catch (e) {}
      }, 3000);
    }
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
    if (this.mapInstance) {
      this.mapInstance.destroy();
    }
    if (this.waterTimeInterval) {
      clearInterval(this.waterTimeInterval);
    }
  }

  getChartOption = () => ({
    color: ['#6687FD'],
    grid: {
      left: '0',
      right: '3%',
      bottom: '0',
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999',
        },
      },
    },
    legend: {
      data: ['水位'],
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: [],
    },
    yAxis: [
      {
        type: 'value',
        name: '水位',
        axisLabel: {
          formatter: '{value} m',
        },
      },
    ],
    series: [],
  });

  /**
   * @description 指挥预警
   */
  getAllByLevel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ConserveGIS/allByLevel',
      callback: list => {
        const levelMarkers = list.map(item => {
          if (item.longitude) {
            return {
              position: {
                longitude: item.longitude,
                latitude: item.latitudel,
              },
              ...item,
            };
          }
          return {
            position: null,
            ...item,
          };
        });
        this.setState({ levelData: list, levelMarkers });
      },
    });
  };

  /**
   * @description 获取水位点
   * @param params
   */
  getWaterPoint = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ConservePoint/fetch',
      payload: params,
      callback: () => {
        this.getMarkers();
      },
    });
  };

  /**
   * @description 格式化点
   */
  getMarkers = () => {
    const {
      ConservePoint: { data },
    } = this.props;
    const markers = data.list.map(item => {
      if (item.longitudeandlatitude) {
        const lngLat = item.longitudeandlatitude.split(',');
        return {
          position: {
            longitude: lngLat[0],
            latitude: lngLat[1],
          },
          ...item,
        };
      }
      return {
        position: null,
        ...item,
      };
    });
    const [normalMarkers, warnMarkers, pyNormalMarkers, pyWarnMarkers] = [[], [], [], []];
    for (let i = 0; i < markers.length; i += 1) {
      const { roadOnitoringPointData, type } = markers[i];
      if (roadOnitoringPointData) {
        if (roadOnitoringPointData.waterLevel - markers[i].warningHigh > 0) {
          if (type === 1) {
            warnMarkers.push(markers[i]);
          } else {
            pyWarnMarkers.push(markers[i]);
          }
        } else {
          if (type === 1) {
            normalMarkers.push(markers[i]);
          } else {
            pyNormalMarkers.push(markers[i]);
          }
        }
      } else {
        if (type === 1) {
          warnMarkers.push(markers[i]);
        } else {
          pyWarnMarkers.push(markers[i]);
        }
      }
    }

    this.setState({ normalMarkers, warnMarkers, pyNormalMarkers, pyWarnMarkers });
  };

  getColors = list => {
    return list.map(() => getRandomColor());
  };

  /**
   * @description 路产分类
   * @param params
   */
  getCateList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'RoadProductionCategory/fetch',
      payload: {
        pageBean: { page: 1, pageSize: 100000000, showTotal: true },
      },
    });
  };

  renderMarkerCate = () => {
    const {
      RoadProductionCategory: { data },
    } = this.props;
    if (!data.list) return null;
    data.list.map((item, i) => {
      this.cateIDS.push(item.id);
    });
    const cateColors = this.getColors(data.list);
    this.setState({ cateColors });
  };

  getRoadCount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ConserveGIS/roadCount',
    });
  };

  getOtherCount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ConserveGIS/otherCount',
      callback: () => {
        setTimeout(() => this.renderMarkersLine(), 1500);
      },
    });
  };

  renderMarkersLine = () => {
    const {
      ConserveGIS: { otherCountData },
    } = this.props;
    this.renderMarkerCate();
    const { ROAD_PRODUCTION, ROAD_INFO } = otherCountData;
    let markersLnglat = [];
    if (ROAD_PRODUCTION.length) {
      markersLnglat = ROAD_PRODUCTION.map(item => ({
        position: {
          longitude: item.longitude,
          latitude: item.latitude,
        },
        ...item,
      }));
    }

    const polyMarkers = [];
    for (let i = 0; i < ROAD_INFO.length; i += 1) {
      const focusInfo = JSON.parse(ROAD_INFO[i].focusInfo || '[]');
      for (let j = 0; j < focusInfo.length; j += 1) {
        const lngLat = focusInfo[j].focusPoint.split(',');
        polyMarkers.push({
          position: {
            longitude: lngLat[0],
            latitude: lngLat[1],
          },
          cursor: 'move',
          index: i,
          // color: `#${roadColors[i]}`,
          focusMessage: focusInfo[j].focusMessage,
        });
      }
    }

    this.setState({
      polyMarkers,
      roadColors: this.getColors(ROAD_INFO),
      markersLnglat,
      longitudeandlatitude: ROAD_INFO,
    });
  };

  renderTool = () => {
    const {
      ConserveGIS: { roadCountData },
    } = this.props;
    if (!roadCountData.length) return '';

    return (
      <div className={style.toolMain}>
        <div className={style.list}>
          <i className={`${iconStyle.iconfont} ${iconStyle['icon-luduanpaihang']}`}>&nbsp;</i>
          <div className={style.content}>
            <h3>
              {roadCountData[0].ROAD_MILEAGE}&nbsp;&nbsp;<small>km</small>
            </h3>
            <p>公里数</p>
          </div>
        </div>
        <div className={style.list}>
          <i className={`${iconStyle.iconfont} ${iconStyle['icon-xiandao']}`}>&nbsp;</i>
          <div className={style.content}>
            <h3>
              {roadCountData[0].THE_WAY}&nbsp;&nbsp;<small>条</small>
            </h3>
            <p>道路条数</p>
          </div>
        </div>
        <div className={style.list}>
          <i className={`${iconStyle.iconfont} ${iconStyle['icon-luduanpaihang']}`}>&nbsp;</i>
          <div className={style.content}>
            <h3>
              {roadCountData[0].PROPRIETARY_ROAD}&nbsp;&nbsp;<small>条</small>
            </h3>
            <p>专有道路</p>
          </div>
        </div>
        <div className={style.list}>
          <i className={`${iconStyle.iconfont} ${iconStyle['icon-qiaoliang']}`}>&nbsp;</i>
          <div className={style.content}>
            <h3>
              {roadCountData[0].BRIDGE}&nbsp;&nbsp;<small>座</small>
            </h3>
            <p>桥梁</p>
          </div>
        </div>
        <div className={style.list}>
          <i className={`${iconStyle.iconfont} ${iconStyle['icon-tiaozheng']}`}>&nbsp;</i>
          <div className={style.content}>
            <h3>
              {roadCountData[1].ROAD_PROPERTY}&nbsp;&nbsp;<small>处</small>
            </h3>
            <p>路产</p>
          </div>
        </div>
      </div>
    );
  };

  renderPolyMarkerLayout = data => {
    const { roadColors } = this.state;
    const { index } = data;
    return (
      <a title={data.focusMessage}>
        <Icon
          className={style.localMarker}
          style={{ fontSize: 25, color: `#${roadColors[index]}` }}
          type="environment"
          theme="filled"
        />
      </a>
    );
  };

  renderMarkerLayout = data => {
    const ID = data.categoryId.toString();
    const index = this.cateIDS.indexOf(ID);

    const styles = {
      background: `#${this.state.cateColors[index]}`,
      display: 'inline-block',
      padding: '2px 8px',
      color: '#fff',
      fontSize: 12,
      borderRadius: 13,
      boxShadow: '0 5px 5px rgba(0,0,0,.3)',
    };
    return (
      <a title={data.productionName}>
        <span style={styles}>{data.productionCode}</span>
      </a>
    );
  };

  getLngLatByAddress = (address, callback) => {
    this.mapInstance.plugin('AMap.Geocoder', () => {
      const geocoder = new AMap.Geocoder({});
      geocoder.getLocation(address, (status, result) => {
        if (status === 'complete' && result.geocodes.length) {
          const lngLat = result.geocodes[0].location;
          callback(lngLat);
        }
      });
    });
  };

  /**
   * @description 地图事件
   * @returns {{created: created}}
   */
  amapEvents = () => {
    return {
      created: mapInstance => {
        this.mapInstance = mapInstance;
        // setTimeout(() => {
        //   this.getLngLatByAddress(localStorage.getItem('addr'), lnglat => {
        //     this.setState({ center: lnglat });
        //   });
        // }, 1000);

        const { pageBean } = this.state;
        this.getCateList();
        this.getRoadCount();
        this.getOtherCount();
        this.getWaterPoint({ pageBean });
        this.getAllByLevel();

        this.waterTimeInterval = setInterval(() => {
          this.getWaterPoint({ pageBean });
        }, 300000);

        // setTimeout(() => {
        // this.renderMarkersLine();
        // this.renderMarkerCate();
        // }, 1500);
      },
    };
  };

  /**
   * @description 设置线路窗口值
   * @param roadInfoVisible
   * @param roadInfoMsg
   * @param roadInfoLngLat
   */
  setRoadInfoWindow = (roadInfoVisible = false, roadInfoMsg = {}, roadInfoLngLat = null) => {
    this.setState({
      roadInfoVisible,
      roadInfoMsg,
      roadInfoLngLat,
    });
  };

  /**
   * @description 路线事件
   * @returns {{mouseout: mouseout, click: click}}
   */
  polylineEvent = () => {
    return {
      click: e => {
        const info = e.target.getExtData();
        const lngLat = e.lnglat;
        this.setRoadInfoWindow(true, info, {
          longitude: lngLat.lng,
          latitude: lngLat.lat,
        });
      },
      mouseout: e => {
        this.setRoadInfoWindow();
      },
    };
  };

  polyMarkesDomEvent = () => {
    return {
      click: e => {
        const info = e.target.getExtData();
        const lngLat = e.lnglat;

        this.setState({
          roadFocusMarkersInfo: info.focusMessage,
          roadFocusMarkersInfoVisible: true,
          roadInfoLngLat: {
            longitude: lngLat.lng,
            latitude: lngLat.lat,
          },
        });
      },
      mouseout: () => {
        this.setState({
          roadFocusMarkersInfo: '',
          roadFocusMarkersInfoVisible: false,
          roadInfoLngLat: null,
        });
      },
    };
  };

  // ----- 指挥预警点位--- start----------

  handleLevelModalVisible = (flag, info) => {
    this.setState({
      levelModalVisible: !!flag,
      levelMsg: info || {},
    });
  };

  renderLevelMarkersImg = data => {
    return <img style={{ width: 50 }} src={yjzh} alt="" />;
  };

  levelMarkersEvent = () => ({
    click: (e, marker) => {
      const info = marker.getExtData();
      this.handleLevelModalVisible(true, info);
      // const lngLat = marker.lnglat;
      // this.setState({
      //   waterMarkersInfoLngLat: lngLat,
      //   waterMarkersInfoVisible: true,
      // });
    },
    // mouseout: () => {
    //   this.setState({
    //     waterMarkersInfoLngLat: null,
    //     waterMarkersInfoVisible: true,
    //   });
    // },
  });
  // -------end------

  // -------水位点-修改图标-- start---------
  renderNormalImg = () => {
    return <img style={{ width: 35 }} src={normal} alt="" />;
  };

  renderWarnImg = () => {
    return <img style={{ width: 35 }} src={warning} alt="" />;
  };

  // ---------- 位移点  --------------
  renderPyWarnImg = () => <img style={{ width: 35 }} src={bpWarning} alt="" />;

  renderPyNormalImg = () => <img style={{ width: 35 }} src={bpNormal} alt="" />;

  getPointInfoForDay = (code, msg) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ConservePoint/pointInfoForDay',
      payload: { ponitCode: code },
      callback: list => {
        this.setState({ chartData: list }, () => this.setChartOption(list.reverse(), msg));
      },
    });
  };

  /**
   * @description 初始化图表配置
   * @param data
   */
  setChartOption = (data, msg) => {
    const { type } = msg;
    const { chartOption } = this.state;
    const option = clonedeep(chartOption);
    const xAxisData = data.map(item => item['HOUR']);
    option.xAxis.data = xAxisData;
    const series = [
      {
        name: '水位',
        smooth: true,
        data: data.map(item => item['WATERLEVEL']),
        type: 'line',
        areaStyle: {
          color: '#A8BAFE',
        },
      },
    ];
    if (type === 1) {
      option.legend.data = ['水位'];
      option.yAxis[0].name = '水位';
      option.yAxis[0].axisLabel.formatter = '{value} m';
      series[0].markLine = {
        silent: true,
        data: [
          {
            yAxis: msg.normalHigh || 0,
            label: {
              show: true,
              position: 'middle',
              formatter: `保障水位线 ${msg.normalHigh || 0}`,
            },
            lineStyle: {
              color: '#516b91',
            },
          },
          {
            yAxis: msg.warningHigh || 0,
            label: {
              show: true,
              position: 'middle',
              formatter: `水位预警线 ${msg.warningHigh || 0}`,
            },
            lineStyle: {
              color: '#F9787C',
            },
          },
        ],
      };
    } else {
      option.yAxis[0].name = '位移';
      option.legend.data = ['位移'];
      series[0].name = '位移';
      option.yAxis[0].axisLabel.formatter = '{value} dm';
    }
    option.series = series;

    this.setState({ chartOption: option, waterMsg: msg });
  };

  renderChart = () => {
    const { chartData, chartOption } = this.state;
    return chartData.length ? (
      <ReactEcharts option={chartOption} style={{ height: '100%' }} />
    ) : (
      <Empty style={{ lineHeight: '250px', marginTop: 0 }} image={Empty.PRESENTED_IMAGE_SIMPLE} />
    );
  };

  waterMarkersEvent = () => {
    return {
      click: (e, marker) => {
        const extData = marker.getExtData();
        this.getPointInfoForDay(extData.pointCode, extData);
        this.setState({
          waterMarkersInfoLngLat: extData.position,
          waterMarkersInfoVisible: true,
        });
      },
      mouseout: () => {
        this.setState({
          chartData: [],
          waterMarkersInfoLngLat: null,
          waterMarkersInfoVisible: false,
        });
      },
    };
  };

  renderWaterMarkerInfoWindow = () => {
    const { waterMarkersInfoVisible, waterMarkersInfoLngLat, waterMsg } = this.state;
    const { waterLoading } = this.props;
    return (
      <InfoWindow
        key="waterMarkerInfoWindow"
        position={waterMarkersInfoLngLat}
        visible={waterMarkersInfoVisible}
        isCustom
        offset={[8, -25]}
      >
        <Spin spinning={waterLoading}>
          <div className={style.waterInfo}>
            <p>点位：{waterMsg.pointName}</p>
            <p>地址：{waterMsg.addr}</p>
            <div className={style.chart}>{this.renderChart()}</div>
          </div>
        </Spin>
      </InfoWindow>
    );
  };

  // ------end-------

  render() {
    const {
      loading,
      RoadProductionCategory: { data },
    } = this.props;
    const {
      polyMarkers,
      markersLnglat,
      longitudeandlatitude,
      roadInfoVisible,
      roadInfoLngLat,
      roadInfoMsg,
      roadColors,
      cateColors,
      roadFocusMarkersInfo,
      roadFocusMarkersInfoVisible,
      normalMarkers,
      warnMarkers,
      pyNormalMarkers,
      pyWarnMarkers,
      levelData,
      levelMarkers,
      levelModalVisible,
      levelMsg,
      center,
    } = this.state;
    const PolylineDom = longitudeandlatitude.length
      ? longitudeandlatitude.map((item, i) => (
          <Polyline
            style={{
              isOutline: true,
              outlineColor: '#000',
              borderWeight: 2,
              strokeWeight: 6,
              strokeColor: `#${roadColors[i]}`,
              lineJoin: 'round',
              showDir: true,
              extData: {
                ...item,
              },
            }}
            key={i}
            path={JSON.parse(item.longitudeandlatitude || '[]')}
            events={this.polylineEvent()}
          />
        ))
      : null;

    const polyMarkesDom = polyMarkers.length ? (
      <Markers
        key="polyMarkesDom"
        markers={polyMarkers}
        render={this.renderPolyMarkerLayout}
        events={this.polyMarkesDomEvent()}
      />
    ) : null;

    const markersDom = markersLnglat.length ? (
      <Markers key="marker" markers={markersLnglat} render={this.renderMarkerLayout} />
    ) : null;

    // 公路信息窗口
    const roadInfoWindowDom = (
      <InfoWindow
        position={roadInfoLngLat}
        visible={roadInfoVisible}
        isCustom
        showShadow
        key="roadInfoWindowDom"
      >
        <p>公路名称：{roadInfoMsg.roadName}</p>
        <p>公路编号：{roadInfoMsg.roadCode}</p>
        <p>里程：{roadInfoMsg.roadMileage} km</p>
        <p>起点：{roadInfoMsg.startAddr}</p>
        <p>终点：{roadInfoMsg.endAddr}</p>
      </InfoWindow>
    );

    // 公路关注点信息窗口
    const roadFocusMarkersInfoWindowDom = (
      <InfoWindow
        position={roadInfoLngLat}
        visible={roadFocusMarkersInfoVisible}
        isCustom
        showShadow
        offset={[5, -10]}
        key="roadFocusMarkersInfoWindowDom"
      >
        <p>{roadFocusMarkersInfo}</p>
      </InfoWindow>
    );

    // 指挥预警点
    const levelMarkersDOM = (
      <Markers
        key="levelMarkersDOM"
        markers={levelMarkers}
        render={this.renderLevelMarkersImg}
        events={this.levelMarkersEvent()}
      />
    );

    // 水位点
    const normalMarkersDom = (
      <Markers
        key="normalMarkers"
        markers={normalMarkers}
        render={this.renderNormalImg}
        events={this.waterMarkersEvent()}
      />
    );

    const warnMarkersDom = (
      <Markers
        key="warnMarkers"
        markers={warnMarkers}
        render={this.renderWarnImg}
        events={this.waterMarkersEvent()}
      />
    );

    // 偏移
    const pyWarnMarkersDom = (
      <Markers
        key="pyWarnMarkers"
        markers={pyWarnMarkers}
        render={this.renderPyWarnImg}
        events={this.waterMarkersEvent()}
      />
    );

    const pyNormalMarkersDom = (
      <Markers
        key="pyNormalMarkers"
        markers={pyNormalMarkers}
        render={this.renderPyNormalImg}
        events={this.waterMarkersEvent()}
      />
    );

    return (
      <Spin spinning={loading}>
        <div
          style={{
            height: 'calc(100vh - 140px)',
            margin: '-20px -20px -20px -20px',
            background: '#fff',
            position: 'relative',
          }}
        >
          <div className={style.msgScroll}>
            <Carousel dotPosition="left" dots={false} autoplay>
              {levelData.map((item, i) => {
                if (item.emergencyLevel === 2) {
                  return (
                    <div key={i} onClick={() => this.handleLevelModalVisible(true, item)}>
                      <Alert
                        message={`${item.categoryName || ''} | 等级：${
                          planRank[item.emergencyLevel - 1]
                        } | 下达时间：${moment(item.sendTime).format(
                          'YYYY-MM-DD HH:mm:ss',
                        )}  | 地址：${item.addr}`}
                        type="warning"
                        showIcon
                      />
                    </div>
                  );
                }
                return (
                  <div key={i} onClick={() => this.handleLevelModalVisible(true, item)}>
                    <Alert
                      message={`${item.categoryName || ''}   | 等级：${
                        planRank[item.emergencyLevel - 1]
                      }  | 下达时间：${moment(item.sendTime).format(
                        'YYYY-MM-DD HH:mm:ss',
                      )} |   地址：${item.addr}`}
                      type="error"
                      showIcon
                      icon={<Icon type="exclamation-circle" />}
                    />
                  </div>
                );
              })}
            </Carousel>
          </div>
          <BaseMap
            amapEvents={this.amapEvents()}
            center={center}
            // eslint-disable-next-line react/no-children-prop
            children={[
              PolylineDom,
              markersDom,
              roadInfoWindowDom,
              polyMarkesDom,
              roadFocusMarkersInfoWindowDom,
              normalMarkersDom,
              warnMarkersDom,
              this.renderWaterMarkerInfoWindow(),
              levelMarkersDOM,
              pyWarnMarkersDom,
              pyNormalMarkersDom,
            ]}
          />
          {this.renderTool()}

          <div className={style.tagPanel}>
            <h3>
              <span />
              地图信息
            </h3>
            <div className={style.tagContent}>
              <div className={style.otherTag}>
                <h3 className={style.title}>预警指挥点</h3>
                <div className={style.tagCateContent}>
                  <div className={style.tagList}>
                    <img src={yjzh} alt="" />
                    预警指挥点
                  </div>
                </div>
              </div>
              <div className={style.otherTag} style={{ paddingBottom: 0 }}>
                <h3 className={style.title}>水位点</h3>
                <div className={style.tagCateContent}>
                  <div className={style.tagList}>
                    <img src={normal} alt="" />
                    正常水位点
                  </div>
                  <div className={style.tagList}>
                    <img src={warning} alt="" />
                    异常水位点
                  </div>
                </div>
              </div>
              <div className={style.otherTag} style={{ padding: '0 10px ', height: 90 }}>
                <h3 className={style.title}>位移</h3>
                <div className={style.tagCateContent}>
                  <div className={style.tagList}>
                    <img src={bpNormal} alt="" />
                    正常位移
                  </div>
                  <div className={style.tagList}>
                    <img src={bpWarning} alt="" />
                    异常位移
                  </div>
                </div>
              </div>
              <div className={style.main}>
                <div className={style.tagCate}>
                  <h3 className={style.title}>路产分类</h3>
                  <div className={style.tagCateContent}>
                    {data.list
                      ? data.list.map((item, i) => (
                          <div className={style.tagList} key={i}>
                            <span style={{ background: `#${cateColors[i]}` }}>&nbsp;</span>
                            {item.categoryName}
                          </div>
                        ))
                      : null}
                  </div>
                </div>
                <div className={style.roadInfoMsg}>
                  <h3 className={style.title}>公路信息</h3>
                  <div className={style.roadInfoMsgContent}>
                    {longitudeandlatitude.map((item, i) => (
                      <div key={i} className={style.roadList}>
                        <span style={{ background: `#${roadColors[i]}` }}>&nbsp;</span>
                        {item.roadName}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {levelModalVisible && Object.keys(levelMsg).length ? (
          <LevelModal
            detail={levelMsg}
            handleModalVisible={this.handleLevelModalVisible}
            modalVisible={levelModalVisible}
          />
        ) : null}
      </Spin>
    );
  }
}

export default Count;
