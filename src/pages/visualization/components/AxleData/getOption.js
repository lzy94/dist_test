export default function (option, data) {
    option.legend.data = data.legend;
    option.xAxis.data = data.xAxisData;
    option.series = data.series;

    return option;
}