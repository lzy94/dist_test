import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import clonedeep from 'lodash.clonedeep';
import { BorderBox7, Loading, BorderBox12 } from '@jiaminghi/data-view-react';
import BaseChart from '@/components/EchartsBase';
import { colors } from '@/utils/dictionaries';

import dataVPublic from '@/pages/style/dataV.less';
import style from '../index.less';

@connect(({ ChartStatistics, loading }) => ({
  ChartStatistics,
  loading: loading.models.ChartStatistics,
}))
class OverLoadChart extends PureComponent {
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

  getChartOption = () => ({
    color: colors,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },
    legend: {
      // right: '0',
      textStyle: {
        color: '#fff',
      },
      data: ['检测数', '货车总数', '货车超限数', '货车超限率'],
    },
    grid: {
      left: '3%',
      right: '3%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
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
      data: [],
    },
    yAxis: [
      {
        type: 'value',
        name: '超限数',
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
      {
        type: 'value',
        name: '超限率',
        axisLabel: {
          color: '#5EC4FF',
          formatter: '{value}%',
        },
        nameTextStyle: {
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
    ],
    series: [],
  });

  getList = () => {
    const { dispatch } = this.props;
    const time = moment(new Date()).format('YYYY');
    dispatch({
      type: 'ChartStatistics/overLimitCount',
      payload: {
        dateOfCount: time,
        dateType: 3,
        siteCode: null,
      },
      callback: () => {
        this.formatData();
      },
    });
  };

  formatData = () => {
    const {
      ChartStatistics: {
        overRunData: { overLimit },
      },
    } = this.props;
    const { chartOption } = this.state;
    const option = clonedeep(chartOption);
    const xAxisData = overLimit.map(item => `${item.MONTH}月`);
    option.xAxis.data = xAxisData;
    const series = [
      {
        name: '检测数',
        type: 'bar',
        smooth: true,
        barMaxWidth: 13,
        data: overLimit.map(item => item.TOTAL),
      },
      {
        name: '货车总数',
        type: 'bar',
        smooth: true,
        barMaxWidth: 13,
        data: overLimit.map(item => item.TRUCKTOTAL),
      },
      {
        name: '货车超限数',
        type: 'bar',
        smooth: true,
        barMaxWidth: 13,
        data: overLimit.map(item => item.TRUCKOVERTOTAL),
      },
      {
        name: '货车超限率',
        type: 'line',
        smooth: true,
        data: overLimit.map(item =>
          item.TRUCKTOTAL ? ((item.TRUCKOVERTOTAL / item.TRUCKTOTAL) * 100).toFixed(2) : 0,
        ),
        yAxisIndex: 1,
      },
    ];
    option.series = series;

    this.setState({ chartOption: option }, () => setTimeout(() => this.autoChart(), 2000));
  };

  autoChart = () => {
    const { chartOption } = this.state;
    const { current } = this.myChart;
    if (this.autoTimeInterval) {
      clearInterval(this.autoTimeInterval);
    }
    if (current) {
      const dataLen = chartOption.series[0].data.length;
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
      <BorderBox12 color={['#48A2B3']}>
        {/* <div className={style.centerContainerTopChart} > */}
        <div className={dataVPublic.search}>
          <div className={dataVPublic.itemTitle}>超限统计</div>
          {/* <div className={dataVPublic.form}>
            <span style={{ width: '100%' }}>
              2020-02-10 至 02-17&nbsp;&nbsp;&nbsp;&nbsp;近 7 日
            </span>
          </div> */}
        </div>
        <div className={dataVPublic.chartPanel}>
          <BorderBox7 color={['#019EFF']}>
            {loading ? (
              <Loading>
                <span style={{ color: '#fff' }}>Loading...</span>
              </Loading>
            ) : (
              <BaseChart ref={this.myChart} option={chartOption} />
            )}
          </BorderBox7>
        </div>
        {/*  </div> */}
      </BorderBox12>
    );
  }
}

export default OverLoadChart;
