import React from 'react';
import { connect } from 'dva';
import echarts from 'echarts';
import clonedeep from 'lodash.clonedeep';
import { BorderBox7 } from '@jiaminghi/data-view-react';
import BaseChart from '@/components/EchartsBase';
import { getLocalStorage, getRandomColor } from '@/utils/utils';

import iconStyle from '@/assets/font/conserve/iconfont.css';
import style from '../index.less';
import { Icon } from 'antd';

@connect(({ RoadProductionCategory, ConserveGIS, loading }) => ({
  ConserveGIS,
  RoadProductionCategory,
  loading: loading.models.ConserveGIS,
}))
class MapChart extends React.Component {
  constructor(props) {
    super(props);
    this.organCode = getLocalStorage('organId') || 51;
    this.state = this.getInitialState();
    this.colors = [];
    this.cateIds = [];
    this.legendData = [];
  }

  componentDidMount() {
    const area = this.getArea();
    echarts.registerMap('areaMap', area); // 地图注册
    this.getCateList();
    this.getRoadCount();
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  getInitialState = () => ({
    mapOption: this.initOption(),
  });

  getRoadCount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ConserveGIS/roadCount',
    });
  };

  /**
   * @description 路产分类
   * @param params
   */
  getCateList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'RoadProductionCategory/fetch',
      payload: {
        pageBean: { page: 1, pageSize: 100000000, showTotal: true },
      },
      callback: () => {
        const {
          RoadProductionCategory: { data },
        } = this.props;
        if (data.list) {
          for (let i = 0; i < data.list.length; i += 1) {
            const color = `#${getRandomColor()}`;
            this.colors.push(color);
            this.cateIds.push(data.list[i].id);
            this.legendData.push(data.list[i].categoryName);
          }
          this.getList();
        }
      },
    });
  };

  getList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ConserveGIS/otherCount',
      callback: () => {
        const {
          ConserveGIS: {
            otherCountData: { ROAD_PRODUCTION },
          },
        } = this.props;
        const list = this.formatData(ROAD_PRODUCTION);
        this.getOption(list);
      },
    });
  };

  formatData = list => {
    const data = [];
    for (let i = 0; i < this.cateIds.length; i += 1) {
      const item = [];
      for (let j = 0; j < list.length; j += 1) {
        if (this.cateIds[i] === list[j].categoryId.toString()) {
          item.push({
            name: list[j].productionName,
            value: [list[j].longitude, list[j].latitude],
          });
        }
      }
      data.push(item);
    }
    return data;
  };

  getOption = list => {
    const { mapOption } = this.state;
    const option = clonedeep(mapOption);
    option.color = this.colors;
    option.legend.data = this.legendData;
    const series = list.map((item, i) => ({
      name: this.legendData[i],
      type: 'effectScatter',
      coordinateSystem: 'geo',
      data: item,
      symbolSize: 12,
      label: {
        normal: {
          show: true,
          position: 'bottom',
          formatter: '{b}',
          textStyle: {
            fontSize: 17,
          },
        },
        emphasis: {
          show: true,
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
    }));
    option.series = series;
    this.setState({ mapOption: option });
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
    legend: {
      // orient: 'vertical',
      y: 'bottom',
      // x: 'right',
      itemWidth: 15,
      data: [],
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

  renderTool = () => {
    const {
      ConserveGIS: { roadCountData },
    } = this.props;
    if (!roadCountData.length) return null;

    return (
      <BorderBox7 color={['#019EFF']}>
        <div className={style.otherMain}>
          <div className={style.item}>
            <i className={`${iconStyle.iconfont} ${iconStyle['icon-luduanpaihang']}`} />
            <div className={style.content}>
              <p>公里数</p>
              <h3>
                {roadCountData[0].ROAD_MILEAGE}
                <small>km</small>
              </h3>
            </div>
          </div>
          <div className={style.item}>
            <i className={`${iconStyle.iconfont} ${iconStyle['icon-xiandao']}`} />
            <div className={style.content}>
              <p>道路条数</p>
              <h3>
                {roadCountData[0].THE_WAY}
                <small>条</small>
              </h3>
            </div>
          </div>
          <div className={style.item}>
            <i className={`${iconStyle.iconfont} ${iconStyle['icon-luduanpaihang']}`} />
            <div className={style.content}>
              <p>专有道路</p>
              <h3>
                {roadCountData[0].PROPRIETARY_ROAD}
                <small>条</small>
              </h3>
            </div>
          </div>
          <div className={style.item}>
            <i className={`${iconStyle.iconfont} ${iconStyle['icon-qiaoliang']}`} />
            <div className={style.content}>
              <p>桥梁</p>
              <h3>
                {roadCountData[0].BRIDGE}
                <small>座</small>
              </h3>
            </div>
          </div>
          <div className={style.item}>
            <i className={`${iconStyle.iconfont} ${iconStyle['icon-tiaozheng']}`} />
            <div className={style.content}>
              <p>路产</p>
              <h3>
                {roadCountData[1].ROAD_PROPERTY}
                <small>处</small>
              </h3>
            </div>
          </div>
        </div>
      </BorderBox7>
    );
  };

  render() {
    const { mapOption } = this.state;
    return (
      <div style={{ height: '100%', position: 'relative' }}>
        <div className={style.otherMsg}>{this.renderTool()}</div>

        <BaseChart option={mapOption} />
      </div>
    );
  }
}

export default MapChart;
