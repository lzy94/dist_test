import React, { PureComponent } from 'react';
import { connect } from 'dva';
import clonedeep from 'lodash.clonedeep';
import { BorderBox7, Loading } from '@jiaminghi/data-view-react';
import BaseChart from '@/components/EchartsBase';
import { colors } from '@/utils/dictionaries';

import dataVPublic from '@/pages/style/dataV.less';
import style from '../index.less';
import moment from 'moment';

@connect(({ ChartStatistics, loading }) => ({
  ChartStatistics,
  loading: loading.models.ChartStatistics,
}))
class OverLoadScale extends PureComponent {
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
      type: 'ChartStatistics/overRangeCount',
      payload: { dateOfCount: time, dateType: 3 },
      callback: () => {
        this.setChartOption();
      },
    });
  };

  getCount = (key, list) => {
    let count = 0;
    for (let i = 0; i < list.length; i += 1) {
      count += list[i][key];
    }
    return count;
  };

  setChartOption = () => {
    const {
      ChartStatistics: { overRangeList },
    } = this.props;
    const { chartOption } = this.state;
    const [name, fields, option] = [
      ['10%以下', '10%~20%', '20%~30%', '30%~40%', '40%~50%', '50%~100%', '100%以上'],
      ['LEVEL01', 'LEVEL12', 'LEVEL23', 'LEVEL34', 'LEVEL45', 'LEVEL510', 'LEVEL6'],
      clonedeep(chartOption),
    ];
    option.legend.data = name;

    const series = fields.map((item, i) => ({
      value: this.getCount(item, overRangeList),
      name: name[i],
    }));
    option.series.data = series;
    this.setState({ chartOption: option }, () => setTimeout(() => this.autoChart(), 2000));
  };

  autoChart = () => {
    const { chartOption } = this.state;
    const dataLen = chartOption.series.data.length;
    const { current } = this.myChart;
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

  getChartOption = () => ({
    color: colors,
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)',
    },
    legend: {
      data: [],
      textStyle: {
        color: '#fff',
      },
    },
    series: {
      name: '超限比例',
      type: 'pie',
      radius: ['45%', '65%'],
      avoidLabelOverlap: false,
      label: {
        show: false,
        position: 'center',
        formatter: '{b}\n{c}',
      },
      labelLine: {
        show: false,
      },
      center: ['50%', '65%'],
      data: [],
      emphasis: {
        label: {
          show: true,
          fontSize: '25',
          fontWeight: 'bold',
        },
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
  });

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

export default OverLoadScale;
