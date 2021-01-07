const colors = [
    "#c1232b",
    "#27727b",
    "#fcce10",
    "#e87c25",
    "#b5c334",
    "#fe8463",
    "#9bca63",
    "#fad860",
    "#f3a43b",
    "#60c0dd",
    "#d7504b",
    "#c6e579",
    "#f4e001",
    "#f0805a",
    "#26c0c0"];
export default {
    color:colors,
    title: {},
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    legend: {
        x: 'right',
        itemWidth: 16,
        itemHeight: 10,
        textStyle: {
            color: '#59BAF2'
        },
        data: []
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        axisLabel: {
            color: '#5EC4FF'
        },
        axisLine: {
            lineStyle: {
                color: '#3486DA'
            }
        },
        splitLine: {
            show: false
        },
        data: []
        // boundaryGap: [0, 0.01]
    },
    yAxis: {
        type: 'value',
        axisLabel: {
            color: '#5EC4FF'
        },
        axisLine: {
            lineStyle: {
                color: '#3486DA'
            }
        },
        splitLine: {
            show: false
        },
        data: []
    },
    series: []
}