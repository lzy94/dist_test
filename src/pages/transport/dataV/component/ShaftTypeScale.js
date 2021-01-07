import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import clonedeep from 'lodash.clonedeep';
import { BorderBox7, Loading } from '@jiaminghi/data-view-react';
import BaseChart from '@/components/EchartsBase';
import { colors } from '@/utils/dictionaries';

import dataVPublic from '@/pages/style/dataV.less';
import style from '../index.less';

@connect(({ ChartStatistics, loading }) => ({
  ChartStatistics,
  loading: loading.models.ChartStatistics,
}))
class ShaftTypeScale extends PureComponent {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
    this.autoTimeInterval = null;
    this.faultByHourIndex = -1;
    this.myChart = React.createRef();
  }

  getInitialState = () => ({
    chartOption: this.getChartOption(),
  });

  componentDidMount() {
    this.getList();
  }

  componentWillUnmount() {
    if (this.autoTimeInterval) {
      clearInterval(this.autoTimeInterval);
    }
  }

  getList = () => {
    const { dispatch } = this.props;
    const time = moment().format('YYYY');
    dispatch({
      type: 'ChartStatistics/axleCount',
      payload: { dateType: 3, dateOfCount: time },
      callback: () => {
        this.formatData();
      },
    });
  };

  formatData = () => {
    const {
      ChartStatistics: { overRunData },
    } = this.props;
    const { overLimit, total } = overRunData;
    const { chartOption } = this.state;
    const option = clonedeep(chartOption);

    const yAxisData = total.map(item => `${item.AXLE}轴`);
    option.yAxis.data = yAxisData;

    const series = [
      {
        name: '检测数',
        type: 'bar',
        smooth: true,
        barMaxWidth: 13,
        data: total.map(item => item.TOTAL),
      },
      {
        name: '超限数',
        type: 'bar',
        smooth: true,
        barMaxWidth: 13,
        data: overLimit.map(item => item.TOTAL),
      },
      // {
      //   name: '超限率',
      //   type: 'line',
      //   smooth: true,
      //   data: total.map((item, index) =>
      //     ((this.formatData()[index].TOTAL / item.TOTAL) * 100).toFixed(2),
      //   ),
      //   yAxisIndex: 1,
      // },
    ];
    option.series = series;

    this.setState({ chartOption: option }, () => setTimeout(() => this.autoChart(), 2000));
  };

  getChartOption = () => ({
    color: colors,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    // legend: {
    //   data: ['2011年', '2012年'],
    // },
    grid: {
      top: '3%',
      left: '3%',
      right: '0',
      bottom: '2%',
      containLabel: true,
    },
    xAxis: {
      name: '检测数',
      type: 'value',
      boundaryGap: [0, 0.01],
      axisLabel: {
        color: '#5EC4FF',
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#5EC4FF',
        },
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#48A2B3',
          type: 'dashed',
        },
      },
    },
    yAxis: {
      name: '轴数',
      type: 'category',
      data: [],
      nameTextStyle: {
        color: '#5EC4FF',
      },
      axisLabel: {
        color: '#5EC4FF',
      },
      splitLine: {
        lineStyle: {
          color: '#48A2B3',
        },
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#5EC4FF',
        },
      },
    },
    series: [],
  });

  autoChart = () => {
    const { chartOption } = this.state;
    const { current } = this.myChart;
    const dataLen = chartOption.series[0].data.length;
    if (this.autoTimeInterval) {
      clearInterval(this.autoTimeInterval);
    }
    if (current) {
      this.autoTimeInterval = setInterval(() => {
        current.getEchartsInstance().dispatchAction({
          type: 'downplay',
          seriesIndex: 0,
          dataIndex: this.faultByHourIndex,
        });
        this.faultByHourIndex = (this.faultByHourIndex + 1) % dataLen;

        current.getEchartsInstance().dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: this.faultByHourIndex,
        });

        current.getEchartsInstance().dispatchAction({
          type: 'showTip', // 根据 tooltip 的配置项显示提示框。
          seriesIndex: 0,
          dataIndex: this.faultByHourIndex,
        });
      }, 3000);
    }
  };

  render() {
    const { loading } = this.props;
    const { chartOption } = this.state;
    return (
      <BorderBox7 color={['#019EFF']}>
        {loading ? (
          <Loading>
            <span style={{ color: '#fff' }}>Loading...</span>
          </Loading>
        ) : (
          <BaseChart ref={this.myChart} option={chartOption} />
        )}
      </BorderBox7>
    );
  }
}

export default ShaftTypeScale;
