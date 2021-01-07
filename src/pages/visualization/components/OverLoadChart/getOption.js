import cloneDeep from 'lodash.clonedeep';

export default function(option, data) {
  const newOption = cloneDeep(option);

  newOption.legend.data = data.legend;
  newOption.xAxis.data = data.xAxisData.map(item => `${item}日`);
  // const series = data.series;

  // const newSeries = [
  //     {
  //         name: '检测数',
  //         type: 'line',
  //         smooth: true,
  //         barMaxWidth: 13,
  //         data: series[0]
  //     },
  //     {
  //         name: '超限数',
  //         type: 'line',
  //         smooth: true,
  //         barMaxWidth: 13,
  //         data: series[1]
  //     },
  //     // {
  //     //     name: '超限率',
  //     //     type: 'line',
  //     //     smooth: true,
  //     //     data: series[2],
  //     //     yAxisIndex: 1,
  //     // }
  // ];
  newOption.series = data.series;

  // newOption.yAxis = [
  //     {
  //         type: 'value',
  //         axisLabel: {
  //             color: '#5EC4FF'
  //         },
  //         axisLine: {
  //             lineStyle: {
  //                 color: '#3486DA'
  //             }
  //         },
  //         splitLine: {
  //             show: false
  //         },
  //         name: '超限数'
  //     },
  //     {
  //         type: 'value',
  //         name: '超限率',
  //         axisLabel: {
  //             color: '#5EC4FF',
  //             formatter: '{value}%'
  //         },
  //         axisLine: {
  //             lineStyle: {
  //                 color: '#3486DA'
  //             }
  //         },
  //         splitLine: {
  //             show: false
  //         },
  //     }
  // ];

  return newOption;
}
