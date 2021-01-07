export default function(option, data) {
  option.legend = data.legend;
  option.color = data.color;
  // option.xAxis.data = data.xAxisData;
  option.series = data.series;

  return option;
}
