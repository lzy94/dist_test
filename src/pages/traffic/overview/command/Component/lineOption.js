export default {
  color: ['#EF7575', '#82A5ED', '#EB8146', '#BCD2EE', '#facc14'],
  title: {
    text: '',
    textStyle: {
      fontSize: '15px',
    },
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
    },
  },
  legend: {
    right: 0,
    itemHeight: 12,
    itemWidth: 12,
    data: [],
  },
  grid: {
    left: '20px',
    right: '20px',
    bottom: 0,
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    // boundaryGap: false,
    data: [],
    axisTick: {
      alignWithLabel: true,
    },
  },
  yAxis: {
    type: 'value',
  },
  series: [],
};