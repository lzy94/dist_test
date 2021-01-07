/* eslint-disable react/jsx-filename-extension */
import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';

/**
 * @description 图表父类
 * @export
 * @class BaseChart
 * @extends {PureComponent}
 */
export default class BaseChart extends PureComponent {
  render() {
    const { option, data, getOption, event } = this.props;
    const newOption = getOption(option, data);
    return (
      <ReactEcharts
        option={newOption}
        style={{ height: '100%' }}
        // onEvents={event ? event : null}
      />
    );
  }
}
