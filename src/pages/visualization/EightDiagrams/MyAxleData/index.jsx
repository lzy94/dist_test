import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';
// import cloneDeep from 'lodash.clonedeep';
// import AxleData from '../../components/AxleData/index';
import { getLocalStorage } from '@/utils/utils';
// import { areaAllName, areaAllCode } from '../../area.js';

/* eslint react/no-multi-comp:0 */
@connect(({ user, BigScreen, loading, TrafficApiV2Count }) => ({
  // BigScreen,
  TrafficApiV2Count,
  // loading: loading.models.BigScreen,
  currentUser: user.currentUser,
}))
class MyAxleData extends PureComponent {
  constructor(props) {
    super(props);
    this.organCode = getLocalStorage('organId') || 51;
  }

  state = {
    // bigScreenAxleDataOption: {},
  };

  componentDidMount() {
    this.getList({
      dateStr: moment().format('YYYY-MM-DD'),
      dateType: 1,
      siteCode: '',
    });
    // this.getData();
  }

  getList = (params = {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'TrafficApiV2Count/axleCount',
      payload: params,
    });
  };

  getLineChart = () => {
    const {
      TrafficApiV2Count: { axleData },
    } = this.props;
    const xAxisData = axleData.map(item => `${item.axle}轴`);
    const series = [
      {
        name: '检测数',
        type: 'bar',
        smooth: true,
        barMaxWidth: 13,
        data: axleData.map(item => item.total),
      },
      {
        name: '超限数',
        type: 'bar',
        smooth: true,
        barMaxWidth: 13,
        data: axleData.map(item => item.overTotal),
      },
      {
        name: '超限率',
        type: 'line',
        smooth: true,
        data: axleData.map(item => `${((item.overTotal / (item.total || 1)) * 100).toFixed(2)}`),
        yAxisIndex: 1,
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(
              0,
              0,
              0,
              1,
              [
                {
                  offset: 0,
                  color: '#eb64fb',
                },
                {
                  offset: 1,
                  color: '#3fbbff0d',
                },
              ],
              false,
            ),
          },
        },
      },
    ];

    const option = {
      color: [
        '#c1232b',
        '#27727b',
        '#fcce10',
        '#e87c25',
        '#b5c334',
        '#fe8463',
        '#9bca63',
        '#fad860',
        '#f3a43b',
        '#60c0dd',
        '#d7504b',
        '#c6e579',
        '#f4e001',
        '#f0805a',
        '#26c0c0',
      ],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
      },
      legend: {
        x: 'right',
        itemWidth: 16,
        itemHeight: 10,
        textStyle: {
          color: '#59BAF2',
        },
        data: ['检测数', '超限数', '超限率'],
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        axisLabel: {
          color: '#5EC4FF',
        },
        axisLine: {
          lineStyle: {
            color: '#3486DA',
          },
        },
        splitLine: {
          show: false,
        },
        // boundaryGap: false,
        data: xAxisData,
      },
      yAxis: [
        {
          type: 'value',
          name: '超限数',
          axisLabel: {
            color: '#5EC4FF',
          },
          axisLine: {
            lineStyle: {
              color: '#3486DA',
            },
          },
          splitLine: {
            show: false,
          },
        },
        {
          type: 'value',
          name: '超限率',
          axisLine: {
            lineStyle: {
              color: '#3486DA',
            },
          },
          splitLine: {
            show: false,
          },
          axisLabel: {
            color: '#5EC4FF',
            formatter: '{value}%',
          },
        },
      ],
      series,
    };
    return axleData.length ? <ReactEcharts option={option} style={{ height: '100%' }} /> : null;
  };

  // getData = () => {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'BigScreen/bigScreenAxleData',
  //     payload: { organCode: this.organCode },
  //     callback: () => {
  //       // callback && callback();
  //       this.formatBigScreenAxleData();
  //     },
  //   });
  // };

  // formatBigScreenAxleData = () => {
  //   const {
  //     BigScreen: { bigScreenAxleData },
  //   } = this.props;
  //   const option = cloneDeep(this.state.bigScreenAxleDataOption);
  //   const newData = bigScreenAxleData.sort((a, b) => a.AXLE_NUMBER - b.AXLE_NUMBER);
  //   option.legend = ['总数', '超限数'];
  //   option.xAxisData = newData.map(item => `${item.AXLE_NUMBER}轴`);

  //   const series = [
  //     {
  //       name: '总数',
  //       type: 'line',
  //       smooth: true,
  //       areaStyle: {
  //         normal: {
  //           color: new echarts.graphic.LinearGradient(
  //             0,
  //             0,
  //             0,
  //             1,
  //             [
  //               {
  //                 offset: 0,
  //                 color: '#eb64fb',
  //               },
  //               {
  //                 offset: 1,
  //                 color: '#3fbbff0d',
  //               },
  //             ],
  //             false,
  //           ),
  //         },
  //       },
  //       data: newData.map(item => item.TOTAL),
  //     },
  //     {
  //       name: '超限数',
  //       type: 'bar',
  //       barMaxWidth: 10,
  //       data: newData.map(item => item.OVERLOAD),
  //     },
  //   ];
  //   option.series = series;
  //   this.setState({ bigScreenAxleDataOption: option });
  // };

  render() {
    // const { bigScreenAxleDataOption } = this.state;

    return this.getLineChart();
  }
}
export default MyAxleData;
