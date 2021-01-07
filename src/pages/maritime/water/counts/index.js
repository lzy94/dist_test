/* eslint-disable react/sort-comp */
import React, { PureComponent } from 'react';
import BaseMap from '@/pages/conserve/Component/BaseMap';
import { connect } from 'dva';
import { Spin, Checkbox, Empty, TreeSelect, Pagination, Icon, message } from 'antd';
import clonedeep from 'lodash.clonedeep';
import ReactEcharts from 'echarts-for-react';
import { Markers, InfoWindow } from 'react-amap';
import { accSubtract } from '@/utils/utils';
import VideoPlayer from '@/components/VideoLive/videoLive';

import styles from '../style.less';
import normal from '@/assets/water/waterPoint.png';
import warning from '@/assets/water/waterWarin.gif';

/* eslint react/no-multi-comp:0 */
@connect(({ Live, system, MaritimePoint, loading }) => ({
  Live,
  system,
  MaritimePoint,
  loading: loading.models.MaritimePoint,
}))
class Index extends PureComponent {
  constructor(props) {
    super(props);
    this.mapInstance = null;
    this.state = this.getInitialState();
    this.videoRef = React.createRef();
  }

  getInitialState = () => ({
    msg: {},
    markersInfoVisible: false,
    markersInfoLngLat: null,
    normalChecked: true,
    warningChecked: true,
    chartData: [],
    normalMarkers: [],
    warnMarkers: [],
    center: null,
    oldAddress: '',
    pointCode: '',
    isLeftClose: true,
    pageBean: { page: 1, pageSize: 15, showTotal: true },
    chartOption: this.getChartOption(),
  });

  getChartOption = () => ({
    color: ['#516b91', '#59c4e6', '#edafda', '#93b7e3', '#a5e7f0', '#cbb0e3'],
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

  componentDidMount() {
    const { pageBean } = this.state;
    this.getList({ pageBean });
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
  }

  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'MaritimePoint/fetch',
      payload: params,
      callback: () => {
        this.getMarkers();
      },
    });
  };

  getGBSPath = serial => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Live/GBSPath',
      payload: { serial },
      callback: url => {
        this.videoRef.player.src(url);
        this.videoRef.player.play();
      },
    });
  };

  getDetail = ponitCode => {
    const { dispatch } = this.props;
    dispatch({
      type: 'MaritimePoint/detail',
      payload: { ponitCode },
      callback: data => {
        const { roadMonitor } = data;
        if (!roadMonitor || !Object.keys(roadMonitor).length) {
          message.error('暂无监控');
        } else {
          this.getGBSPath(data.roadMonitor.serial);
        }
      },
    });
  };

  /**
   * @description 初始化图表配置
   * @param data
   */
  setChartOption = (data, msg) => {
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
        areaStyle: {},
        markLine: {
          silent: true,
          data: [
            {
              yAxis: msg.normalHigh,
              label: {
                show: true,
                position: 'middle',
                formatter: '保障水位线 ' + msg.normalHigh,
              },
              lineStyle: {
                color: '#5176FD',
              },
            },
            {
              yAxis: msg.warningHigh,
              label: {
                show: true,
                position: 'middle',
                formatter: '水位预警线 ' + msg.warningHigh,
              },
              lineStyle: {
                color: '#F9787C',
              },
            },
          ],
        },
      },
    ];
    option.series = series;
    this.setState({ chartOption: option });
  };

  getPointInfoForDay = (code, msg) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'MaritimePoint/pointInfoForDay',
      payload: { ponitCode: code },
      callback: list => {
        this.setState({ chartData: list }, () => this.setChartOption(list.reverse(), msg));
      },
    });
  };

  paginationChange = page => {
    const { formValue } = this.state;
    this.getList({
      pageBean: {
        page,
        pageSize: 15,
        showTotal: true,
      },
      querys: formValue,
    });
  };

  treeChange = value => {
    const { pageBean } = this.state;
    const arr = [
      {
        property: 'organCode',
        value,
        group: 'main',
        operation: 'RIGHT_LIKE',
        relation: 'AND',
      },
    ].filter(item => item.value);
    this.setState({ formValue: arr });
    this.getList({ pageBean, querys: arr });
  };

  /**
   * @description 渲染点位
   * @returns {*}
   */
  renderPointList = () => {
    const {
      MaritimePoint: { data },
    } = this.props;
    const { pointCode } = this.state;
    if (!data.list.length) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    // this.setMarkersMsg(data.list[0]);
    return data.list.map((item, i) => {
      let isErr = false;
      const { waterOnitoringPointData } = item;
      if (!waterOnitoringPointData) {
        isErr = true;
      } else {
        if (waterOnitoringPointData.waterLevel - item.warningHigh > 0) {
          isErr = true;
        }
      }

      return (
        <li
          className={`${pointCode === item.ponitCode ? styles.active : null} ${
            isErr ? styles.error : null
          }`}
          key={i}
          onClick={() => this.pointClick(item)}
        >
          <h3>{item.ponitName}</h3>
          <p>{item.addr}</p>
        </li>
      );
    });
  };

  /**
   * @description 列表点击
   * @param msg
   */
  pointClick = msg => {
    this.setMarkersMsg(msg);
  };

  /**
   * @description 获取并设置点位信息
   * @param data
   */
  setMarkersMsg = data => {
    let position = null;
    if (data.longitudeandlatitude) {
      const lngLat = data.longitudeandlatitude.split(',');
      position = {
        longitude: lngLat[0],
        latitude: lngLat[1],
      };
    }
    this.getDetail(data.ponitCode);
    this.getPointInfoForDay(data.ponitCode, data);
    this.markersState(data, data.ponitCode, position, true);
  };

  markersState = (msg, pointCode, position, flag) => {
    this.setState({
      msg,
      pointCode,
      markersInfoLngLat: position,
      markersInfoVisible: !!flag,
    });
  };

  // getPointInfoByCode = code => {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'MaritimePoint/pointInfoByCode',
  //     payload: { pointCode: code },
  //     callback: list => {
  //       this.setState({ newMsg: list });
  //     },
  //   });
  // };

  renderChart = () => {
    const { chartData, chartOption } = this.state;
    return chartData.length ? (
      <ReactEcharts option={chartOption} style={{ height: '100%' }} />
    ) : (
      <Empty style={{ lineHeight: '250px', marginTop: 0 }} image={Empty.PRESENTED_IMAGE_SIMPLE} />
    );
  };

  /**
   * @description 格式化点
   */
  getMarkers = () => {
    const {
      MaritimePoint: { data },
    } = this.props;
    if (data.list.length) {
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
      const [normalMarkers, warnMarkers] = [[], []];
      for (let i = 0; i < markers.length; i += 1) {
        const { waterOnitoringPointData } = markers[i];
        if (waterOnitoringPointData) {
          if (waterOnitoringPointData.waterLevel - markers[i].warningHigh > 0) {
            warnMarkers.push(markers[i]);
          } else {
            normalMarkers.push(markers[i]);
          }
        } else {
          warnMarkers.push(markers[i]);
        }
      }
      this.setState({ normalMarkers, warnMarkers });
      setTimeout(() => this.setMarkersMsg(data.list[0]), 500);
    }
  };

  normalChange = e => {
    this.setState({
      normalChecked: e.target.checked,
    });
  };

  warnChange = e => {
    this.setState({
      warningChecked: e.target.checked,
    });
  };

  renderNormalImg = data => {
    return <img style={{ width: 35 }} src={normal} alt="" />;
  };

  renderWarnImg = data => {
    return <img style={{ width: 35 }} src={warning} alt="" />;
  };

  markersEvent = () => {
    return {
      click: (e, marker) => {
        const extData = marker.getExtData();
        this.getPointInfoForDay(extData.ponitCode, extData);
        this.markersState(extData, extData.ponitCode, extData.position, true);
      },
      mouseout: () => {
        this.setState({
          msg: {},
          // newMsg: {},
          markersInfoLngLat: null,
          markersInfoVisible: false,
        });
      },
    };
  };

  renderMarkerInfoWindow = () => {
    const { markersInfoLngLat, markersInfoVisible, msg } = this.state;
    const { loading } = this.props;
    const waterOnitoringPointData = msg.waterOnitoringPointData || {};

    return (
      <InfoWindow
        key="markerInfoWindow"
        position={markersInfoLngLat}
        visible={markersInfoVisible}
        isCustom
        offset={[8, -30]}
      >
        <Spin spinning={loading}>
          <div className={styles.infoWin}>
            <h3>
              <span>&nbsp;</span>
              {msg.ponitName}
            </h3>
            <p>地址：{msg.addr}</p>
            <p>
              当前水位：
              <span className={styles.normal}>{waterOnitoringPointData.waterLevel || 0} m</span>
            </p>
            <p>
              超出水位：
              <span className={styles.warn}>
                {accSubtract(waterOnitoringPointData.waterLevel || 0, msg.warningHigh || 0)} m
              </span>
            </p>
          </div>
        </Spin>
      </InfoWindow>
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

  amapEvents = () => {
    return {
      created: mapInstance => {
        this.mapInstance = mapInstance;
      },
    };
  };

  render() {
    const {
      loading,
      MaritimePoint: { data },
      system: { treeList },
    } = this.props;
    const {
      center,
      normalChecked,
      warningChecked,
      normalMarkers,
      warnMarkers,
      isLeftClose,
    } = this.state;

    const normalMarkersDom = (
      <Markers
        key="normalMarkers"
        markers={normalChecked ? normalMarkers : []}
        render={this.renderNormalImg}
        events={this.markersEvent()}
      />
    );

    const warnMarkersDom = (
      <Markers
        key="warnMarkers"
        markers={warningChecked ? warnMarkers : []}
        render={this.renderWarnImg}
        events={this.markersEvent()}
      />
    );

    return (
      <div
        style={{
          height: 'calc(100vh - 140px)',
          margin: '-20px -20px -20px -20px',
          background: '#fff',
          position: 'relative',
        }}
      >
        <div className={styles.leftMainList + ' ' + (isLeftClose ? '' : styles.onClose)}>
          <div
            className={styles.leftClose}
            onClick={() => this.setState({ isLeftClose: !isLeftClose })}
          >
            {isLeftClose ? (
              <Icon className={styles.closeBtn} type="double-left" />
            ) : (
              <Icon className={styles.closeBtn} type="double-right" />
            )}
          </div>

          <div className={styles.title}>
            <h3>点位</h3>
            <TreeSelect
              treeData={treeList}
              placeholder="请选择区域"
              style={{ width: '100%' }}
              onChange={this.treeChange}
            />
          </div>
          <div className={styles.listPanel}>
            <Spin spinning={loading}>
              <ul className={styles.list}>{this.renderPointList()}</ul>
            </Spin>
          </div>
          <div className={styles.pagination}>
            <Pagination
              size="small"
              simple
              total={data.pagination.total}
              pageSize={15}
              onChange={this.paginationChange}
            />
          </div>
        </div>
        <div className={styles.mapLegend + ' ' + (isLeftClose ? '' : styles.onClose)}>
          <h3>图例</h3>
          <div className={styles.legengContent}>
            <div className={styles.legendCell}>
              <img src={normal} alt="" />
              正常水位
              <Checkbox
                onChange={this.normalChange}
                style={{ marginLeft: 10 }}
                checked={normalChecked}
              />
            </div>
            <div className={styles.legendCell}>
              <img src={warning} alt="" />
              预警水位
              <Checkbox
                onChange={this.warnChange}
                style={{ marginLeft: 10 }}
                checked={warningChecked}
              />
            </div>
          </div>
        </div>
        <BaseMap
          amapEvents={this.amapEvents()}
          center={center}
          children={[normalMarkersDom, warnMarkersDom, this.renderMarkerInfoWindow()]}
        />
        <div className={styles.mapRight}>
          <div className={styles.video}>
            <VideoPlayer ref={e => (this.videoRef = e)} src="" />
          </div>
          <div className={styles.chartsPanel}>
            <Spin spinning={loading}>
              <div className={styles.charts}>{this.renderChart()}</div>
            </Spin>
          </div>
        </div>
      </div>
    );
  }
}

export default Index;
