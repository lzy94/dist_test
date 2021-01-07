import React from 'react';
import { connect } from 'dva';
import clonedeep from 'lodash.clonedeep';
import { BorderBox7, Loading } from '@jiaminghi/data-view-react';

import dataVPublic from '@/pages/style/dataV.less';
import style from '../index.less';
import BaseChart from '@/components/EchartsBase';

@connect(({ MaritimeDataV, loading }) => ({
  MaritimeDataV,
  loading: loading.models.MaritimeDataV,
}))
class MonitorScale extends React.PureComponent {
  constructor(props) {
    super(props);
    this.myChart = React.createRef();
    this.state = this.getInitialState();

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
      type: 'MaritimeDataV/monitorScale',
      callback: data => {
        this.setChartOption(data);
      },
    });
  };

  setChartOption = data => {
    const { chartOption } = this.state;
    const option = clonedeep(chartOption);
    const [fields, fieldName] = [
      ['roadMonitor', 'waterMonitoringPoint', 'seaPortInfo'],
      ['道路', '水位', '港口'],
    ];
    const list = fields.map((item, index) => ({ value: data[item], name: fieldName[index] }));
    option.legend.data = fieldName;
    option.series.data = list;
    this.setState({ chartOption: option }, () => setTimeout(() => this.autoChart(), 2000));
  };

  getChartOption = () => ({
    color: ['#ffb980', '#d87a80', '#8d98b3'],
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      right: 50,
      top: '30%',
      bottom: 20,
      data: [],
      textStyle: {
        color: '#fff',
      },
    },
    series: {
      name: '检测比例',
      type: 'pie',
      radius: ['50%', '70%'],
      center: ['30%', '50%'],
      data: [],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
  });

  autoChart = () => {
    const { chartOption } = this.state;
    const { current } = this.myChart;
    const dataLen = chartOption.series.data.length;
    if (this.autoTimeMapInterval) {
      clearInterval(this.autoTimeMapInterval);
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

  renderChart = () => {
    const { chartOption } = this.state;
    return <BaseChart ref={this.myChart} option={chartOption} />;
  };

  render() {
    const { loading } = this.props;
    return (
      <div className={style.leftContainerBottomTop}>
        <div className={dataVPublic.itemTitle}>监测比例</div>
        <div className={dataVPublic.chartPanel}>
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
      </div>
    );
  }
}

export default MonitorScale;
