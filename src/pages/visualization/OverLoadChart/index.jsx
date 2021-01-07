/**
 * @description 超限统计
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import ReactEcharts from 'echarts-for-react';
import clonedeep from 'lodash.clonedeep';
import defaultOption from '../components/option';

/* eslint react/no-multi-comp:0 */
@connect(({ TrafficApiV2Count, loading }) => ({
  TrafficApiV2Count,
  loading: loading.models.TrafficApiV2Count,
}))
class MyOverLoadChart extends PureComponent {
  constructor(props) {
    super(props);
    this.reloadTime = null;
    this.timeOut = null;
  }

  state = {
    option: {},
    data: [],
  };

  componentDidMount() {
    this.getList();
    this.timeOut = setTimeout(() => {
      this.reloadTime = setInterval(() => {
        this.getList();
      }, 30000);
    }, 30000);
  }

  componentWillUnmount() {
    if (this.reloadTime) {
      clearInterval(this.reloadTime);
    }
    if (this.timeOut) {
      clearTimeout(this.timeOut);
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      TrafficApiV2Count: { overData },
    } = nextProps;
    const { data } = prevState;
    if (JSON.stringify(data) !== JSON.stringify(overData)) {
      return { data: overData };
    }
    return null;
  }

  getList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'TrafficApiV2Count/overCount',
    });
  };

  formatData = () => {
    const { data } = this.state;
    const newOption = clonedeep(defaultOption);
    newOption.legend.data = ['检测数', '超限数', '货车超限数'];
    newOption.xAxis.data = data.map(item => item.day);
    const series = [
      {
        name: '检测数',
        type: 'bar',
        smooth: true,
        barMaxWidth: 13,
        data: data.map(item => item.total),
      },
      {
        // name: '货车总数',
        name: '超限数',
        type: 'bar',
        smooth: true,
        barMaxWidth: 13,
        data: data.map(item => item.overTotal),
      },
      {
        name: '货车超限数',
        type: 'bar',
        smooth: true,
        barMaxWidth: 13,
        data: data.map(item => item.totalTrucks),
      },
    ];
    newOption.series = series;
    // this.setState({ option: newOption });
    return <ReactEcharts style={{ height: '100%' }} option={newOption} />;
  };

  render() {
    // const { option } = this.state;
    return this.formatData();
  }
}

export default MyOverLoadChart;
