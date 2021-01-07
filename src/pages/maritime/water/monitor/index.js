import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import clonedeep from 'lodash.clonedeep';
import { Table, Empty, Button, TreeSelect, Pagination, Spin, Tag, message } from 'antd';
import ReactEcharts from 'echarts-for-react';
import VideoPlayer from '@/components/VideoLive/videoLive';

import styles from '../style.less';

/* eslint react/no-multi-comp:0 */
@connect(({ Live, system, MaritimePoint, loading }) => ({
  Live,
  system,
  MaritimePoint,
  loading: loading.models.MaritimePoint,
}))
class Monitor extends PureComponent {
  // eslint-disable-next-line react/sort-comp
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
    this.videoRef = React.createRef();
    this.autoData = null;
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
      title: '正常水位',
      width: 100,
      dataIndex: 'normalHigh',
    },
    {
      title: '预警水位',
      width: 100,
      dataIndex: 'warningHigh',
    },
    {
      title: '当前水位',
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
    tableData: [],
    chartData: [],
    formValue: [],
    waterPointQuery: {},
    pageBean: { page: 1, pageSize: 10, showTotal: true },
    chartOption: this.getChartOption(),
  });

  componentDidMount() {
    const { pageBean } = this.state;
    this.getList({ pageBean });
  }

  componentWillUnmount() {
    this.myClearInterval();
  }

  myClearInterval = () => {
    if (this.autoData) {
      clearInterval(this.autoData);
    }
  };

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
      type: 'MaritimePoint/fetch',
      payload: params,
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

  setChartOption = data => {
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
        areaStyle: {},
        markLine: {
          silent: true,
          data: [
            {
              yAxis: msg.normalHigh,
              label: {
                show: true,
                position: 'middle',
                formatter: `正常水位线 ${msg.normalHigh}`,
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
                formatter: `水位预警线 ${msg.warningHigh}`,
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
      type: 'MaritimePoint/waterPointList',
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
  getPointInfoForDay = code => {
    const { dispatch } = this.props;
    dispatch({
      type: 'MaritimePoint/pointInfoForDay',
      payload: { ponitCode: code },
      callback: list => {
        this.setState({ chartData: list }, () => this.setChartOption(list.reverse()));
      },
    });
  };

  // getPointInfoByCode = (code,callback) => {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'MaritimePoint/waterMonitoringPointPointInfoByCode',
  //     payload: { ponitCode: code },
  //     callback: list => {
  //       console.log(list);
  //       if(callback)callback(list)
  //     },
  //   });
  // };

  /**
   * @description 渲染点位列表
   * @returns {*}
   */
  renderPointList = () => {
    const {
      MaritimePoint: { data },
    } = this.props;
    const { msg } = this.state;
    if (!data.list.length) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    return data.list.map((item, i) => (
      <li
        onClick={() => this.pointClick(item)}
        className={msg.ponitCode === item.ponitCode ? styles.active : ''}
        key={i}
      >
        {item.addr}
      </li>
    ));
  };

  /**
   * @description 左侧检测点点击
   * @param msg string
   */
  pointClick = msg => {
    const waterPointQuery = {
      property: 'ponitCode',
      value: msg.ponitCode,
      group: 'main',
      operation: 'EQUAL',
      relation: 'AND',
    };
    this.myClearInterval();
    this.setState({ msg, waterPointQuery }, () => {
      // this.getPointInfoByCode(msg.ponitCode);

      // this.getPointInfoForDay(msg.ponitCode);
      // this.getWaterPoint({ pageBean, querys: [waterPointQuery] });
      // this.getDetail(msg.ponitCode);

      this.initData(msg.ponitCode, waterPointQuery);
      this.getDetail(msg.ponitCode);
      this.autoData = setInterval(() => this.initData(msg.ponitCode, waterPointQuery), 300000);
    });
  };

  initData = (ponitCode, waterPointQuery) => {
    const { pageBean } = this.state;
    this.getPointInfoForDay(ponitCode);
    this.getWaterPoint({ pageBean, querys: [waterPointQuery] });
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
   * @description 监测点分页
   * @param page number
   * @param pageSize number
   */
  paginationChange = (page, pageSize) => {
    const { formValue } = this.state;
    this.getList({
      pageBean: {
        page: page,
        pageSize: pageSize,
        showTotal: true,
      },
      querys: formValue,
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
      querys: [waterPointQuery],
    });
  };

  render() {
    const {
      loading,
      system: { treeList },
      MaritimePoint: { data },
    } = this.props;
    const {
      msg,
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
                <h3>水位监控</h3>
                <div style={{ height: '100%', background: '#000', borderRadius: 6 }}>
                  <VideoPlayer ref={e => (this.videoRef = e)} src="" />
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
              columns={this.columns}
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
