import React from 'react';
import { connect } from 'dva';
import clonedeep from 'lodash.clonedeep';
import { Empty, Select } from 'antd';
import BaseChart from '@/components/EchartsBase';
import { BorderBox12, BorderBox7, Loading } from '@jiaminghi/data-view-react';

import dataVPublic from '@/pages/style/dataV.less';
import style from '../index.less';

const { Option } = Select;

/**
 * @description 水位统计
 */
@connect(({ ConservePoint, loading }) => ({
  ConservePoint,
  loading: loading.models.ConservePoint,
}))
// eslint-disable-next-line react/prefer-stateless-function
class WaterChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
    this.autoTimeInterval = null;
    this.autoWaterList = null;
    this.faultByHourIndex = -1;
    this.myChart = React.createRef();
  }

  getInitialState = () => ({
    chartOption: this.getChartOption(),
    name: '',
    code: '',
    type: 0,
    chartData: [],
  });

  componentDidMount() {
    this.getWaterList();
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
    if (this.autoTimeInterval) {
      clearInterval(this.autoTimeInterval);
    }
    this.clearWaterList();
  }

  clearWaterList = () => {
    if (this.autoWaterList) {
      clearInterval(this.autoWaterList);
    }
  };

  getChartOption = () => ({
    color: ['#2498E4'],
    grid: {
      top: '3%',
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
    xAxis: {
      type: 'category',
      boundaryGap: false,
      axisLabel: {
        color: '#5EC4FF',
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
    yAxis: {
      type: 'value',
      name: '水位',
      nameTextStyle: {
        color: '#5EC4FF',
      },
      axisLabel: {
        color: '#5EC4FF',
        formatter: '{value} m',
      },
      splitLine: {
        lineStyle: {
          color: '#48A2B3',
        },
      },
    },
    series: [],
  });

  renderChart = () => {
    const { chartOption, chartData } = this.state;
    return chartData.length ? (
      <BaseChart ref={this.myChart} option={chartOption} />
    ) : (
      <Empty className={dataVPublic.empty} image={Empty.PRESENTED_IMAGE_SIMPLE} />
    );
  };

  getPointInfo = () => {
    const {
      ConservePoint: { data },
    } = this.props;
    const { code } = this.state;
    let msg = {};
    for (let i = 0; i < data.list.length; i += 1) {
      if (code === data.list[i].pointCode) {
        msg = data.list[i];
        break;
      }
    }
    return msg;
  };

  setChartOption = data => {
    const { normalHigh, warningHigh, type } = this.getPointInfo();
    const { chartOption } = this.state;
    const option = clonedeep(chartOption);
    const xAxisData = data.map(item => item['HOUR']);
    option.xAxis.data = xAxisData;
    const series = [
      {
        name: '水位',
        smooth: true,
        data: data.map(item => item['WATERLEVEL']),
        type: 'line',
        areaStyle: {
          color: '#48A2B3',
        },
      },
    ];
    if (type === 1) {
      option.yAxis.name = '水位';
      series[0].markLine = {
        silent: true,
        data: [
          {
            yAxis: normalHigh || 0,
            label: {
              show: true,
              position: 'middle',
              formatter: `正常水位线 ${normalHigh || 0}`,
            },
            lineStyle: {
              color: '#516b91',
            },
          },
          {
            yAxis: warningHigh || 0,
            label: {
              show: true,
              position: 'middle',
              formatter: `水位预警线 ${warningHigh || 0}`,
            },
            lineStyle: {
              color: '#F9787C',
            },
          },
        ],
      };
    } else {
      option.yAxis.name = '位移';
      series[0].name = '位移';
    }
    option.series = series;

    this.setState({ chartOption: option, type }, () => setTimeout(() => this.autoChart(), 2000));
  };

  getPointInfoForDay = code => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ConservePoint/pointInfoForDay',
      payload: { ponitCode: code },
      callback: list => {
        this.setState({ chartData: list }, () => this.setChartOption(list.reverse()));
      },
    });
  };

  /**
   * @description 水位点
   */
  getWaterList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ConservePoint/fetch',
      payload: { page: 1, pageSize: 20, showTotal: true },
      callback: () => {
        const {
          ConservePoint: { data },
        } = this.props;
        const { list } = data;
        if (list.length) {
          this.setState({ name: list[0].addr, code: list[0].pointCode });
          this.getPointInfoForDay(list[0].pointCode);
          this.autoWaterList = setInterval(
            () => this.getPointInfoForDay(list[0].pointCode),
            300000,
          );
        }
      },
    });
  };

  changeEvent = (value, option) => {
    if (this.autoTimeInterval) {
      clearInterval(this.autoTimeInterval);
      this.faultByHourIndex = -1;
    }
    this.clearWaterList();
    this.setState({ code: value, name: option.props.children }, () => {
      this.getPointInfoForDay(value);
      this.autoWaterList = setInterval(() => this.getPointInfoForDay(value), 300000);
    });
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
    const {
      ConservePoint: { data },
      loading,
    } = this.props;
    const { name, code, type } = this.state;
    return (
      <BorderBox12 color={['#48A2B3']}>
        <div className={style.search}>
          <div className={dataVPublic.itemTitle}> {`${type === 1 ? '水位' : '位移'}`}统计</div>
          <div className={style.form}>
            <span>{name}</span>
            <Select
              size="small"
              value={code}
              dropdownMatchSelectWidth={false}
              style={{ width: '30%' }}
              onChange={this.changeEvent}
            >
              {data.list &&
                data.list.map(item => (
                  <Option value={item.pointCode} key={item.pointCode}>
                    {item.addr}
                  </Option>
                ))}
            </Select>
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

export default WaterChart;
