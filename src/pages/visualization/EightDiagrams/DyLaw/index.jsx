import React, { PureComponent } from 'react';
import { connect } from 'dva';
import echarts from 'echarts';
import cloneDeep from 'lodash.clonedeep';
import DyLaw from '../../components/DyLawData/index';
import { getLocalStorage } from '@/utils/utils';
import { areaAllName, areaAllCode } from '../../area.js';

/* eslint react/no-multi-comp:0 */
@connect(({ user, TrafficApiV2Count, BigScreen, loading }) => ({
  TrafficApiV2Count,
  loading: loading.models.TrafficApiV2Count,
  currentUser: user.currentUser,
}))
export default class MyDyLaw extends PureComponent {
  constructor(props) {
    super(props);
    this.organCode = getLocalStorage('organId') || 51;
  }
  state = {
    dyLawDataOption: {},
  };

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'TrafficApiV2Count/bigScreenLawDataCount',
      payload: { organCode: this.organCode },
      callback: () => {
        // callback && callback();
        this.formatDyLawData();
      },
    });
  };

  /**
   * @description 格式化动态检测
   */
  formatDyLawData = () => {
    const {
      TrafficApiV2Count: { bigScreenLawData },
    } = this.props;
    console.log(bigScreenLawData);
    const option = cloneDeep(this.state.dyLawDataOption);

    const legendData = ['总数', '未审核', '免处罚', '初审', '复审', '结案', '无效'];
    const legendField = [
      'total',
      'notCheck',
      'notPunish',
      'oneCheck',
      'twoCheck',
      'closeCase',
      'invalidData',
    ];
    option.legend = legendData;
    option.xAxisData = bigScreenLawData.map(item => item.siteName);

    const series = [
      {
        name: '总数',
        type: 'line',
        smooth: true,
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(
              0,
              0,
              0,
              1,
              [
                {
                  offset: 0,
                  color: '#eb64fb',
                },
                {
                  offset: 1,
                  color: '#3fbbff0d',
                },
              ],
              false,
            ),
          },
        },
        data: [],
      },
    ];

    const dySeries = cloneDeep(series);

    for (let i = 1; i < legendData.length; i++) {
      dySeries.push({
        name: legendData[i],
        type: 'bar',
        barMaxWidth: 10,
        data: bigScreenLawData.map(item => item[legendField[i]]),
      });
    }
    dySeries[0].data = bigScreenLawData.map(item => item.TOTAL);
    option.series = dySeries;
    this.setState({
      dyLawDataOption: option,
    });
  };

  render() {
    const { dyLawDataOption } = this.state;
    return JSON.stringify(dyLawDataOption) !== '{}' ? (
      <DyLaw data={this.state.dyLawDataOption} />
    ) : null;
  }
}
