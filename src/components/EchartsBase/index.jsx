/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import ReactEcharts from 'echarts-for-react';

/**
 * @description 图表父类
 * @export
 * @class BaseChart
 * @extends {PureComponent}
 */
// class BaseChart extends React.Component {
//   static defaultProps = {
//     option: {},
//     event: {},
//   };

//   render() {
//     const { option, event } = this.props;
//     return <ReactEcharts option={option} style={{ height: '100%' }} onEvents={event} />;
//   }
// }
// export default BaseChart;
const BaseChart = React.forwardRef((props, ref) => {
  const { option, chartReady, event } = props;
  return (
    <ReactEcharts
      ref={ref}
      option={option}
      style={{ height: '100%' }}
      onEvents={event || {}}
      onChartReady={chartReady}
    />
  );
});
export default BaseChart;
