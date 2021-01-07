import React, { PureComponent } from 'react';
import { connect } from 'dva';
import echarts from 'echarts';
import cloneDeep from 'lodash.clonedeep';
import StaticLawData from '../../components/StaticLawData/index';
import { getLocalStorage } from '@/utils/utils';
import { areaAllName, areaAllCode } from '../../area.js';

/* eslint react/no-multi-comp:0 */
@connect(({ user, BigScreen, loading }) => ({
  BigScreen,
  loading: loading.models.BigScreen,
  currentUser: user.currentUser,
}))
class MyStaticLawData extends PureComponent {
  constructor(props) {
    super(props);
    this.organCode = getLocalStorage('organId') || 51;
  }
  state = {
    staticLaeDataOption: {},
  };

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'BigScreen/bigScreenStaticLawData',
      payload: { organCode: this.organCode },
      callback: () => {
        // callback && callback();
        this.formatStaticLawData();
      },
    });
  };

  /**
   * @description 格式化静态执法
   */
  formatStaticLawData = () => {
    const {
      BigScreen: { staticLaeData },
    } = this.props;
    const option = cloneDeep(this.state.staticLaeDataOption);

    const legendData = ['总数', '未审核', '已审核', '未签批', '已签批', '已作废'];
    const legendField = ['TOTAL', 'NOTCKECK', 'CKECKED', 'NOTENDORSEMENT', 'ENDORSEMENT', 'TOVOID'];

    option.legend = legendData;

    option.xAxisData = staticLaeData.map(item => {
      if (item.ORGAN_CODE) {
        return areaAllName[areaAllCode.indexOf(parseInt(item.ORGAN_CODE))];
      }
      return item.SITE_NAME;
    });

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
        data: staticLaeData.map(item => item[legendField[i]]),
      });
    }
    dySeries[0].data = staticLaeData.map(item => item.TOTAL);
    option.series = dySeries;
    this.setState({
      staticLaeDataOption: option,
    });
  };

  render() {
    const { staticLaeDataOption } = this.state;

    return JSON.stringify(staticLaeDataOption) !== '{}' ? (
      <StaticLawData data={staticLaeDataOption} />
    ) : null;
  }
}

export default MyStaticLawData;
