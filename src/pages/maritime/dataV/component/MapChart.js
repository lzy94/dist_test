import React, { PureComponent } from 'react';
import { connect } from 'dva';
import echarts from 'echarts';
import clonedeep from 'lodash.clonedeep';
import BaseChart from '@/components/EchartsBase';
import { getLocalStorage } from '@/utils/utils';

const icon = [
  'image://data:image/png;base64,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',
  'image://data:image/gif;base64,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',
];

@connect(({ MaritimePoint, loading }) => ({
  MaritimePoint,
  loading: loading.models.MaritimePoint,
}))
class MapChart extends PureComponent {
  constructor(props) {
    super(props);
    this.organCode = getLocalStorage('organId') || 51;
    this.state = this.getInitialState();
    this.myMap = React.createRef();
    this.autoTimeMapInterval = null;
    this.faultByHourIndex = -1;
  }

  getInitialState = () => ({
    mapOption: this.initOption(),
    oldList: [],
  });

  componentDidMount() {
    const area = this.getArea();
    echarts.registerMap('areaMap', area); // 地图注册
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      MaritimePoint: {
        data: { list },
      },
    } = prevProps;
    const { oldList } = prevState;
    if (JSON.stringify(list) !== JSON.stringify(oldList)) {
      this.formatData(list);
    }
  }

  componentWillUnmount() {
    if (this.autoTimeMapInterval) {
      clearInterval(this.autoTimeMapInterval);
    }
  }

  autoTooltip = () => {
    const { mapOption } = this.state;
    const { current } = this.myMap;
    if (this.autoTimeMapInterval) {
      clearInterval(this.autoTimeMapInterval);
    }

    if (current) {
      const dataLen = mapOption.series[1].data.length;
      this.autoTimeMapInterval = setInterval(() => {
        current.getEchartsInstance().dispatchAction({
          type: 'downplay',
          seriesIndex: 1,
          dataIndex: this.faultByHourIndex,
        });

        this.faultByHourIndex = (this.faultByHourIndex + 1) % dataLen;

        current.getEchartsInstance().dispatchAction({
          type: 'highlight',
          seriesIndex: 1,
          dataIndex: this.faultByHourIndex,
        });

        current.getEchartsInstance().dispatchAction({
          type: 'showTip', // 根据 tooltip 的配置项显示提示框。
          seriesIndex: 1,
          dataIndex: this.faultByHourIndex,
        });
      }, 3000);
    }
  };

  formatData = list => {
    const [nomal, warn] = [[], []];
    for (let i = 0; i < list.length; i += 1) {
      const { waterOnitoringPointData, longitudeandlatitude, ponitName, id_ } = list[i];
      const lngLat = longitudeandlatitude ? longitudeandlatitude.split(',') : [0, 0];
      if (waterOnitoringPointData) {
        if (waterOnitoringPointData.waterLevel - list[i].warningHigh > 0) {
          warn.push({
            name: `${ponitName}_${id_}`,
            value: lngLat,
          });
        } else {
          nomal.push({
            name: `${ponitName}_${id_}`,
            value: lngLat,
          });
        }
      } else {
        warn.push({
          name: `${ponitName}_${id_}`,
          value: lngLat,
        });
      }
    }

    this.setState({ oldList: list });
    this.getOption(nomal, warn);
  };

  /**
   * @description 根据用户地区 显示相应的地图 ( 省，市，县区 )
   */
  getArea = () => {
    const fileName = `${this.organCode}.json`;
    const area = require(`@/assets/area/${fileName}`);
    return area;
  };

  initOption = () => ({
    tooltip: {
      formatter: params => {
        const {
          seriesName,
          data: { name },
        } = params;
        const { oldList } = this.state;
        let html = '';
        const names = name.split('_');
        for (let i = 0; i < oldList.length; i += 1) {
          if (oldList[i].id_ === names[1]) {
            const { waterOnitoringPointData } = oldList[i];
            html = `${seriesName}
            <br />
            点    位：${names[0]}
            <br />
            地    址：${oldList[i].addr}
            <br />
            当前水位：${waterOnitoringPointData ? waterOnitoringPointData.waterLevel : '无数据'}
            <br />
            预警水位：${oldList[i].warningHigh}
            `;
            break;
          }
        }
        return html;
      },
    },
    legend: {
      // orient: 'vertical',
      y: 'bottom',
      // x: 'right',
      itemWidth: 30,
      itemHeight: 33,
      data: [
        {
          name: '正常水位点',
          icon: icon[0],
        },
        {
          name: '异常水位点',
          icon: icon[1],
        },
      ],
      textStyle: {
        color: '#fff',
      },
    },
    geo: {
      show: true,
      map: 'areaMap',
      // left: 'left',
      label: {
        normal: {
          show: true,
          color: '#BFF4FF',
          fontSize: 15,
          fontWeight: 500,
        },
        emphasis: {
          show: true,
          textStyle: {
            color: '#BFF4FF',
          },
        },
      },
      roam: true,
      itemStyle: {
        normal: {
          color: '#053750',
          borderColor: '#01BDE5',
          borderWidth: 1,
        },
        emphasis: {
          areaColor: 'rgba(5,55,80,0.7)',
        },
      },
    },
  });

  getOption = (list, list2) => {
    const { mapOption } = this.state;
    const option = clonedeep(mapOption);
    option.legend.data = this.legendData;
    const series = [this.setSeries('正常水位点', list, 0), this.setSeries('异常水位点', list2, 1)];
    option.series = series;
    this.setState({ mapOption: option }, () => setTimeout(() => this.autoTooltip(), 2000));
  };

  setSeries = (name, data, i) => ({
    name,
    type: 'scatter',
    coordinateSystem: 'geo',
    data,
    symbol: icon[i],
    symbolSize: 35,
    label: {
      normal: {
        show: false,
        position: 'bottom',
        formatter: '{b}',
        textStyle: {
          fontSize: 17,
        },
      },
      emphasis: {
        show: false,
        position: 'right',
        formatter: '{b}',
        textStyle: {
          color: '#000',
          padding: 5,
          backgroundColor: '#fff',
        },
      },
    },
    showEffectOn: 'render',
    // itemStyle: {
    //   normal: {
    //     color: '#46bee9',
    //   },
    // },
  });

  render() {
    const { mapOption } = this.state;
    return (
      <div style={{ height: '100%', position: 'relative' }}>
        <BaseChart ref={this.myMap} option={mapOption} />
      </div>
    );
  }
}

export default MapChart;
