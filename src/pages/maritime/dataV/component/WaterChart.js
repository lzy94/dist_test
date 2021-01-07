import React from 'react';
import { connect } from 'dva';
import { Empty, Select } from 'antd';
import BaseChart from '@/components/EchartsBase';
import clonedeep from 'lodash.clonedeep';
import { BorderBox12, BorderBox7, Loading } from '@jiaminghi/data-view-react';
import dataVPublic from '@/pages/style/dataV.less';

const { Option } = Select;

@connect(({ MaritimePoint, loading }) => ({
  MaritimePoint,
  loading: loading.models.MaritimePoint,
}))
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
    chartData: [],
    oldList: [],
  });

  componentDidMount() {
    // this.getWaterList();
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      MaritimePoint: {
        data: { list },
      },
    } = prevProps;
    const { oldList } = prevState;
    if (JSON.stringify(list) !== JSON.stringify(oldList)) {
      this.initData(list);
    }
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

  initData = list => {
    if (list.length) {
      this.setState({ oldList: list, name: list[0].addr, code: list[0].ponitCode });
      this.getPointInfoForDay(list[0].ponitCode);
      this.autoWaterList = setInterval(() => this.getPointInfoForDay(list[0].ponitCode), 300000);
    }
  };

  getPointInfo = () => {
    const {
      MaritimePoint: { data },
    } = this.props;
    const { code } = this.state;
    let msg = {};
    for (let i = 0; i < data.list.length; i += 1) {
      if (code === data.list[i].ponitCode) {
        msg = data.list[i];
        break;
      }
    }
    return msg;
  };

  setChartOption = data => {
    const msg = this.getPointInfo();
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
        markLine: {
          silent: true,
          data: [
            {
              yAxis: msg.normalHigh || 0,
              label: {
                show: true,
                position: 'middle',
                formatter: `正常水位线 ${msg.normalHigh || 0}`,
              },
              lineStyle: {
                color: '#5176FD',
              },
            },
            {
              yAxis: msg.warningHigh || 0,
              label: {
                show: true,
                position: 'middle',
                formatter: `水位预警线 ${msg.warningHigh || 0}`,
              },
              lineStyle: {
                color: '#F9787C',
              },
            },
          ],
        },
      },
    ];
    option.series = series;
    this.setState({ chartOption: option }, () => setTimeout(() => this.autoChart(), 2000));
  };

  /**
   * @description 水位点
   */
  // getWaterList = () => {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'MaritimePoint/fetch',
  //     payload: { page: 1, pageSize: 20, showTotal: true },
  //     callback: () => {
  //       const {
  //         MaritimePoint: { data },
  //       } = this.props;
  //       const { list } = data;
  //       if (list.length) {
  //         this.setState({ name: list[0].addr, code: list[0].ponitCode });
  //         this.getPointInfoForDay(list[0].ponitCode);
  //       }
  //     },
  //   });
  // };

  getPointInfoForDay = code => {
    const { dispatch } = this.props;
    dispatch({
      type: 'MaritimePoint/pointInfoForDay',
      payload: { ponitCode: code },
      callback: list => {
        this.setState({ chartData: list }, () => this.setChartOption(list.reverse()));
      },
    });
  };

  renderChart = () => {
    const { chartOption, chartData } = this.state;
    return chartData.length ? (
      <BaseChart ref={this.myChart} option={chartOption} />
    ) : (
      <Empty className={dataVPublic.empty} image={Empty.PRESENTED_IMAGE_SIMPLE} />
    );
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
    const { loading } = this.props;
    const { name, code, oldList } = this.state;
    return (
      <BorderBox12 color={['#48A2B3']}>
        <div className={dataVPublic.search}>
          <div className={dataVPublic.itemTitle}>水位监测</div>
          <div className={dataVPublic.form}>
            <span>{name}</span>
            <Select
              size="small"
              value={code}
              dropdownMatchSelectWidth={false}
              style={{ width: '30%' }}
              onChange={this.changeEvent}
              dropdownClassName={dataVPublic.rightSelect}
            >
              {oldList.map(item => (
                <Option value={item.ponitCode} key={item.ponitCode}>
                  {item.addr}
                </Option>
              ))}
            </Select>
          </div>
        </div>
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
      </BorderBox12>
    );
  }
}
export default WaterChart;
