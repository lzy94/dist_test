import React from 'react';
import { connect } from 'dva';
import { Empty } from 'antd';
import clonedeep from 'lodash.clonedeep';
import { BorderBox12, BorderBox7, Loading } from '@jiaminghi/data-view-react';
import BaseChart from '@/components/EchartsBase';
import * as echarts from 'echarts';
import dataVPublic from '@/pages/style/dataV.less';
import style from '../index.less';

@connect(({ ConserveDataV, loading }) => ({
  ConserveDataV,
  loading: loading.models.ConserveDataV,
}))
class MaintainChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
    this.autoTimeInterval = null;
    this.faultByHourIndex = -1;
    this.myChart = React.createRef();
  }

  getInitialState = () => ({
    time: '',
    dataLen: 0,
    chartOption: this.getChartOption(),
  });

  componentDidMount() {
    this.getData();
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
    if (this.autoTimeInterval) {
      clearInterval(this.autoTimeInterval);
    }
  }

  getChartOption = () => ({
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
      data: ['完成', '未完成'],
      textStyle: {
        color: '#55C1FF',
      },
    },
    xAxis: {
      type: 'category',
      // boundaryGap: false,
      axisLabel: {
        color: '#5EC4FF',
      },
      axisLine: {
        lineStyle: {
          color: '#019EFF',
        },
      },
      data: [],
    },
    yAxis: {
      type: 'value',
      name: '次数',
      nameTextStyle: {
        color: '#5EC4FF',
      },
      axisLabel: {
        color: '#5EC4FF',
        formatter: '{value} m',
      },
      axisLine: {
        lineStyle: {
          color: '#019EFF',
        },
      },
      splitLine: {
        lineStyle: {
          color: '#48A2B3',
        },
      },
    },
    series: [],
  });

  getData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ConserveDataV/conserveCount',
      callback: list => {
        const dataLen = list.length;
        let time = '';
        if (dataLen) {
          time = `${list[0].createtime} 至 ${list[dataLen - 1].createtime}`;
        }
        this.setState({ dataLen, time }, () => {
          this.setOption(list);
        });
      },
    });
  };

  setOption = list => {
    const { chartOption } = this.state;
    const option = clonedeep(chartOption);
    const xAxisData = list.map(item => item['createtime']);
    option.xAxis.data = xAxisData;
    const series = [
      {
        name: '完成',
        type: 'bar',
        data: list.map(item => item['completed']),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#5ED8E3' },
            { offset: 1, color: '#1388E8' },
          ]),
        },
      },
      {
        name: '未完成',
        type: 'bar',
        data: list.map(item => item['undone']),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#F99800' },
            { offset: 1, color: '#F9D600' },
          ]),
        },
      },
    ];
    option.series = series;
    this.setState({ chartOption: option }, () => setTimeout(() => this.autoChart(), 2000));
  };

  renderChart = () => {
    const { dataLen, chartOption } = this.state;
    return dataLen ? (
      <BaseChart ref={this.myChart} option={chartOption} />
    ) : (
      <Empty className={dataVPublic.empty} image={Empty.PRESENTED_IMAGE_SIMPLE} />
    );
  };

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
    const { time } = this.state;
    return (
      <BorderBox12 color={['#48A2B3']}>
        <div className={style.search}>
          <div className={dataVPublic.itemTitle}>养护统计</div>
          <div className={style.form}>
            <span style={{ width: '100%' }}>{time}&nbsp;&nbsp;&nbsp;&nbsp;近 7 天</span>
          </div>
        </div>
        <div className={style.chartPanel}>
          <BorderBox7 color={['#019EFF']}>
            {loading ? (
              <Loading>
                <span style={{ color: '#fff' }}>Loading...</span>
              </Loading>
            ) : (
              this.renderChart()
            )}
          </BorderBox7>
        </div>
      </BorderBox12>
    );
  }
}

export default MaintainChart;
