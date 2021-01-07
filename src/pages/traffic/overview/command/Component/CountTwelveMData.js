import React, { PureComponent } from 'react';
import { Empty } from 'antd';
import { connect } from 'dva';
import clonedeep from 'lodash.clonedeep';
import BaseChart from '@/components/EchartsBase';
import baseOption from './lineOption';


/* eslint react/no-multi-comp:0 */
@connect(({ ChartStatistics, loading }) => ({
  ChartStatistics,
  loading: loading.models.ChartStatistics,
}))
class CountTwelveMData extends PureComponent {

  static defaultProps = {
    organCode: '',
    siteCode: '',
  };

  state = {
    option: {},
    dataLength: 0,
    organCode: '',
    siteCode: '',
  };


  componentDidMount() {
    this.getData();
  }


  componentWillReceiveProps(nextProps, nextContext) {
    const { organCode, siteCode } = this.state;
    const [propOrganCode, propSiteCode] = [nextProps.organCode, nextProps.siteCode];
    if (propOrganCode) {
      if (propOrganCode !== organCode) {
        this.getData({ organCode: propOrganCode });
        this.setState({ organCode: propOrganCode });
      }
    }
    if (propSiteCode) {
      if (propSiteCode !== siteCode) {
        this.getData({ siteCode: propSiteCode });
        this.setState({ siteCode: propSiteCode });
      }
    }
  }

  getData = (params = {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ChartStatistics/countTwelveMData',
      payload: params,
      callback: data => {
        this.setState({ dataLength: data.length });
        // 排序
        const newData = data.sort((a, b) => (`${a.YEAR}${a.MONTH}`) - (`${b.YEAR}${b.MONTH}`));
        this.formatData(newData);
      },
    });
  };

  /**
   * @description 处理数据
   * @param data []
   */
  formatData = data => {
    const option = clonedeep(baseOption);
    const xAxisData = data.map(item => `${item.YEAR}-${item.MONTH}`);
    option.title.text = '超限率(近12个月)';
    option.xAxis.data = xAxisData;
    option.legend.data = ['检测总数', '货车总数', '货车超限', '货车超限率'];
    const yAxis = [{
      type: 'value',
      name: '超限',
      axisLabel: {
        formatter: ' {value}辆',
      },
    }, {
      type: 'value',
      name: '超速率',
      axisLabel: {
        formatter: ' {value}%',
      },
    }];

    const series = [
      {
        name: '检测总数',
        type: 'line',
        smooth: true,
        data: data.map(item => item.TOTAL),
      },
      {
        name: '货车总数',
        type: 'bar',
        smooth: true,
        barMaxWidth: 13,
        data: data.map(item => item.TRUCKTOTAL),
      },
      {
        name: '货车超限',
        type: 'bar',
        smooth: true,
        barMaxWidth: 13,
        data: data.map(item => item.TRUCKOVERTOTAL),
      },
      {
        name: '货车超限率',
        type: 'line',
        smooth: true,
        yAxisIndex: 1,
        data: data.map(item => (item.TRUCKOVERTOTAL / item.TRUCKTOTAL).toFixed(2) * 100),
      },
    ];

    option.series = series;
    option.yAxis = yAxis;

    this.setState({ option });
  };


  render() {
    const { option, dataLength } = this.state;
    return (
      <div style={{ height: 400 }}>
        {dataLength ? <BaseChart
          option={option}
        />
          :
          // eslint-disable-next-line react/jsx-indent
          <Empty
            style={{ height: 336, lineHeight: '330px' }}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        }
      </div>
    );
  }
}


export default CountTwelveMData;