import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import clonedeep from 'lodash.clonedeep';
import { Table, Empty, TreeSelect, Pagination, Spin, Tag, message, Select } from 'antd';
import ReactEcharts from 'echarts-for-react';
// import VideoPlayer from '@/components/VideoLive/videoLive';
import VideoPlayer from '@/components/VideoLive/reVideoLive';
import VideoControl from '@/components/VideoLive/VideoControl';

import styles from './style.less';

const { Option } = Select;

/* eslint react/no-multi-comp:0 */
@connect(({ Live, system, ConservePoint, loading }) => ({
  Live,
  system,
  ConservePoint,
  loading: loading.models.ConservePoint,
}))
class Monitor extends PureComponent {
  // eslint-disable-next-line react/sort-comp
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
    this.videoRef = React.createRef();
    this.autoData = null;
    this.autoTouch = null;
  }

  columns = [
    {
      title: '地点',
      dataIndex: 'addr',
    },
    {
      title: '时间',
      dataIndex: 'createTime',
      width: 170,
      render: val => moment(val).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '保障水位',
      width: 100,
      dataIndex: 'normalHigh',
    },
    {
      title: '预警水位',
      width: 100,
      dataIndex: 'warningHigh',
    },
    {
      title: '水位',
      width: 100,
      dataIndex: 'waterLevel',
    },
    {
      title: '状态',
      width: 130,
      render: (val, record) => {
        return record.warning ? <Tag color="#f50">预警</Tag> : <Tag color="#108ee9">正常</Tag>;
      },
    },
  ];

  plColumns = [
    {
      title: '地点',
      dataIndex: 'addr',
    },
    {
      title: '时间',
      dataIndex: 'createTime',
      width: 170,
      render: val => moment(val).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '预警位移',
      width: 100,
      dataIndex: 'warningHigh',
    },
    {
      title: '当前位移',
      width: 100,
      dataIndex: 'waterLevel',
    },
    {
      title: '状态',
      width: 130,
      render: (val, record) => {
        return record.warning ? <Tag color="#f50">预警</Tag> : <Tag color="#108ee9">正常</Tag>;
      },
    },
  ];

  getInitialState = () => ({
    msg: {},
    serial: '',
    tableData: [],
    chartData: [],
    formValue: [],
    typeValue: [],
    liveUrl: '',
    type: 1,
    waterPointQuery: [],
    pageBean: { page: 1, pageSize: 7, showTotal: true },
    chartOption: this.getChartOption(),
  });

  componentDidMount() {
    const { pageBean } = this.state;
    this.getList({ pageBean });
  }

  componentWillUnmount() {
    this.myClearInterval();
    this.myAuthTouch();
  }

  myClearInterval = () => {
    if (this.autoData) {
      clearInterval(this.autoData);
    }
  };

  myAuthTouch = () => {
    if (this.autoTouch) {
      clearInterval(this.autoTouch);
    }
  };

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
      data: [],
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: [],
    },
    yAxis: [
      {
        type: 'value',
        name: '',
        axisLabel: {
          formatter: '{value} m',
        },
      },
    ],
    series: [
      //   {
      //   smooth: true,
      //   data: [],
      //   type: 'line',
      //   areaStyle: {},
      // }
    ],
  });

  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ConservePoint/fetch',
      payload: params,
    });
  };

  getGBSPath = serial => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Live/GBSPath',
      payload: { serial },
      // payload:{
      //   accessToken:'at.c9rzems6df0qrq6s3r9usklr3lj6634y-8z4r6w7etg-1kvnjmv-z4y2p8i2t',
      //   source:`E27590109:1`
      // },
      callback: url => {
        this.setState({ liveUrl: url });
        // this.videoRef.player.pause();
        // this.videoRef.player.src(url);
        // this.videoRef.player.play();
      },
    });
  };

  getDetail = pointCode => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ConservePoint/detail',
      payload: { pointCode },
      callback: data => {
        const { roadMonitor } = data;
        if (!roadMonitor || !Object.keys(roadMonitor).length) {
          message.error('暂无监控');
        } else {
          const { serial } = data.roadMonitor;
          this.setState({ serial });
          this.getGBSPath(serial);
          this.getTouch(serial);
        }
      },
    });
  };

  setChartOption = (type, data) => {
    const { chartOption, msg } = this.state;
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
      option.yAxis[0].name = '偏移';
      option.legend.data = ['偏移'];
      series[0].name = '偏移';
      option.yAxis[0].axisLabel.formatter = '{value} dm';
    }
    option.series = series;
    this.setState({ chartOption: option });
  };

  renderChart = () => {
    const { chartOption, chartData } = this.state;
    return chartData.length ? (
      <ReactEcharts option={chartOption} style={{ height: '100%' }} />
    ) : (
      <Empty style={{ lineHeight: '200px' }} image={Empty.PRESENTED_IMAGE_SIMPLE} />
    );
  };

  /**
   * @description 监测点水位列表
   * @param params {}
   */
  getWaterPoint = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ConservePoint/waterPointList',
      payload: params,
      callback: data => {
        const { msg } = this.state;
        const list = data.rows.map((item, index) => {
          const values = {
            ...item,
            key: index,
            addr: msg.addr,
            normalHigh: msg.normalHigh,
            warningHigh: msg.warningHigh,
            warning: msg.normalHigh < item.waterLevel,
          };
          return values;
        });
        this.setState({
          tableData: {
            list,
            total: data.total,
            current: data.page,
            pageSize: data.pageSize,
          },
        });
      },
    });
  };

  /**
   * @description 当天时段水位信息
   * @param code {string}
   */
  getPointInfoForDay = (code, type) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ConservePoint/pointInfoForDay',
      payload: { ponitCode: code },
      callback: list => {
        this.setState({ chartData: list }, () => this.setChartOption(type, list.reverse()));
      },
    });
  };

  // getPointInfoByCode = code => {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'ConservePoint/pointInfoByCode',
  //     payload: { pointCode: code },
  //     callback: list => {},
  //   });
  // };

  /**
   * @description 渲染点位列表
   * @returns {*}
   */
  renderPointList = () => {
    const {
      ConservePoint: { data },
    } = this.props;
    const { msg } = this.state;
    if (!data.list.length) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    return data.list.map(item => (
      <li
        onClick={() => this.pointClick(item)}
        className={msg.pointCode === item.pointCode ? styles.active : ''}
        key={item.id_}
      >
        <h4>{item.pointName}</h4>
        <p>{item.addr}</p>
      </li>
    ));
  };

  getTouch = serial => {
    const { dispatch } = this.props;
    this.autoTouch = setInterval(() => {
      dispatch({
        type: 'Live/touch',
        payload: { serial },
      });
    }, 15000);
  };

  /**
   * @description 左侧检测点点击
   * @param msg string
   */
  pointClick = msg => {
    const { pointCode, type } = msg;
    const waterPointQuery = [
      {
        property: 'ponitCode',
        value: pointCode,
        group: 'main',
        operation: 'EQUAL',
        relation: 'AND',
      },
      {
        property: 'type',
        value: type,
        group: 'main',
        operation: 'EQUAL',
        relation: 'AND',
      },
    ];
    this.myClearInterval();
    this.myAuthTouch();
    this.setState({ msg, waterPointQuery, type, liveUrl: '' }, () => {
      this.initData(pointCode, waterPointQuery, type);
      this.getDetail(pointCode);
      this.autoData = setInterval(() => this.initData(pointCode, waterPointQuery, type), 300000);
    });
  };

  initData = (pointCode, waterPointQuery, type) => {
    const { pageBean } = this.state;
    this.getPointInfoForDay(pointCode, type);
    this.getWaterPoint({ pageBean, querys: waterPointQuery });
    // this.getDetail(pointCode);
  };

  treeChange = value => {
    const { pageBean, typeValue } = this.state;
    const arr = [
      {
        property: 'organCode',
        value,
        group: 'main',
        operation: 'RIGHT_LIKE',
        relation: 'AND',
      },
    ];

    const newArr = arr.concat(typeValue).filter(item => item.value);

    this.setState({ formValue: newArr });
    this.getList({ pageBean, querys: arr });
  };

  typeChange = value => {
    const { pageBean, formValue } = this.state;
    const arr = [
      {
        property: 'type',
        value,
        group: 'main',
        operation: 'EQUAL',
        relation: 'AND',
      },
    ];
    const newArr = arr.concat(formValue).filter(item => item.value);
    this.setState({ typeValue: newArr });
    this.getList({ pageBean, querys: arr });
  };

  /**
   * @description 监测点分页
   * @param page number
   * @param pageSize number
   */
  paginationChange = (page, pageSize) => {
    const { formValue, typeValue } = this.state;
    this.getList({
      pageBean: {
        page,
        pageSize,
        showTotal: true,
      },
      querys: formValue.concat(typeValue),
    });
  };

  /**
   * @description 监测点分页
   * @param page number
   * @param pageSize number
   */
  tablePaginationChange = (page, pageSize) => {
    const { waterPointQuery } = this.state;
    this.getWaterPoint({
      pageBean: {
        page,
        pageSize,
        showTotal: true,
      },
      querys: waterPointQuery,
    });
  };

  render() {
    const {
      loading,
      system: { treeList },
      ConservePoint: { data },
    } = this.props;
    const {
      msg,
      type,
      serial,
      liveUrl,
      tableData: { list, total, pageSize, current },
    } = this.state;
    return (
      <div className={styles.main}>
        <div className={styles.leftList}>
          <div className={styles.title}>
            <h3>
              <span>&nbsp;</span>点位
            </h3>
            <TreeSelect
              treeData={treeList}
              placeholder="请选择区域"
              style={{ width: '100%' }}
              onChange={this.treeChange}
            />
            <Select
              style={{ width: '100%', marginTop: 10 }}
              placeholder="请选择点位类型"
              onChange={this.typeChange}
            >
              <Option value={1}>水位</Option>
              <Option value={2}>偏移</Option>
            </Select>
          </div>
          <Spin spinning={loading}>
            <ul className={styles.pointList}>{this.renderPointList()}</ul>
          </Spin>
          <div className={styles.pagination}>
            <Pagination
              size="small"
              simple
              total={data.pagination.total}
              pageSize={data.pagination.pageSize}
              onChange={this.paginationChange}
            />
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.topContent}>
            <div className={styles.title}>{msg.addr}</div>
            <div className={styles.chartContent}>
              <div className={styles.chartPanel}>{this.renderChart()}</div>
              <div className={styles.videoPanel}>
                <h3>点位监控</h3>
                <div className={styles.videoMain}>
                  {liveUrl && <VideoPlayer src={liveUrl} />}
                  {/* <VideoPlayer src="http://hls01open.ys7.com/openlive/cef40ff9cd0b4f2bac32cda433fcd2e8.hd.m3u8" /> */}
                  {/* <VideoControl serial={serial} /> */}
                </div>
              </div>
            </div>
          </div>
          <div className={styles.bottomList}>
            <h3>
              <span>&nbsp;</span>预警信息
            </h3>
            <Table
              size="middle"
              pagination={{
                total,
                current,
                pageSize,
                onChange: this.tablePaginationChange,
              }}
              columns={type === 1 ? this.columns : this.plColumns}
              dataSource={list}
              loading={loading}
              scroll={{ y: 155 }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Monitor;
