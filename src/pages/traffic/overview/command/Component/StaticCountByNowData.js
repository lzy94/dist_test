import React, { PureComponent } from 'react';
import { Empty } from 'antd';
import clonedeep from 'lodash.clonedeep';
import BaseChart from '@/components/EchartsBase';
import BaseOption from './lineOption';



export default class StaticCountByNowData extends PureComponent {

  static defaultProps = {
    data: []
  }

  state = {
    option: {}
  }


  componentDidMount() {
    this.formatData();
  }


  formatData = () => {
    const { data } = this.props;
    if (!data.length) return <Empty
      style={{ height: 336, lineHeight: '330px' }}
      image={Empty.PRESENTED_IMAGE_SIMPLE}
    />;
    const option = clonedeep(BaseOption);
    const xAxisData = data.map(item => item.HOUR);
    option.xAxis.data = xAxisData;
    option.legend.data = ['总数', '货车超限数'];
    option.title.text = '超限数(今日)';
    const yAxis = {
      type: 'value',
      name: '超限',
      axisLabel: {
        formatter: ' {value}辆',
      },
    };

    const series = [
      {
        name: '总数',
        type: 'line',
        smooth: true,
        data: data.map(item => item.TOTAL),
      },
      {
        name: '货车超限数',
        type: 'bar',
        smooth: true,
        barMaxWidth: 13,
        data: data.map(item => item.TRUCKOVERTOTAL),
      },
    ];
    option.yAxis = yAxis;
    option.series = series;
    this.setState({ option })
  }

  render() {

    const { option } = this.state;
    return (
      <div style={{ height: 400 }}>
        <BaseChart
          option={option}
        />
      </div>
    );

  }
}