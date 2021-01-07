import React, { PureComponent } from 'react';
import { connect } from 'dva';
import clonedeep from 'lodash.clonedeep';
import { BorderBox12, BorderBox7, Loading } from '@jiaminghi/data-view-react';
import BaseChart from '@/components/EchartsBase';
import { colors } from '@/utils/dictionaries';

import dataVPublic from '@/pages/style/dataV.less';

@connect(({ TransportDataV, loading }) => ({
  TransportDataV,
  loading: loading.models.TransportDataV,
}))
class CompanyRank extends PureComponent {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
    this.myChart = React.createRef();
    this.autoTimeInterval = null;
    this.faultByHourIndex = -1;
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
    dispatch({
      type: 'TransportDataV/companySort',
      callback: data => {
        this.setOption(data);
      },
    });
  };

  setOption = data => {
    const { chartOption } = this.state;
    const option = clonedeep(chartOption);
    const xAxisData = data.map(item => item.companyName);
    option.xAxis.data = xAxisData;
    option.legend.data = ['总数', '完成数'];
    const series = [
      {
        name: '总数',
        type: 'bar',
        smooth: true,
        barMaxWidth: 13,
        data: data.map(item => item.count),
      },
      {
        name: '完成数',
        type: 'bar',
        smooth: true,
        barMaxWidth: 13,
        data: data.map(item => item.statusCount),
      },
    ];
    option.series = series;
    this.setState({ chartOption: option }, () => setTimeout(() => this.autoChart(), 2000));
  };

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
      data: [],
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
        name: '督查数',
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
    ],
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
      <BorderBox12 color={['#48A2B3']}>
        <div className={dataVPublic.itemTitle}>企业排名</div>
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
      </BorderBox12>
    );
  }
}
export default CompanyRank;
