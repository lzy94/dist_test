import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Map, Markers, Polyline } from 'react-amap';
import { getRandomColor } from '@/utils/utils';

import iconStyle from '@/assets/font/conserve/iconfont.css';
import style from './index.less';


/* eslint react/no-multi-comp:0 */
@connect(({ ConserveGIS, loading }) => ({
  ConserveGIS,
  loading: loading.models.ConserveGIS,
}))
class Count extends PureComponent {
  constructor(props) {
    super(props);
    this.mapInstance = null;
  }

  state = {
    markersLnglat: [],
    longitudeandlatitude: [],
  };

  componentDidMount() {
    this.getRoadCount();
    this.getOtherCount();
  }

  componentWillUnmount() {
    if (this.mapInstance) {
      this.mapInstance.destroy();
    }
  }

  // getRandomColor = () => {
  //   const rand = Math.floor(Math.random() * 0xFFFFFF).toString(16);
  //   if (rand.length === 6) {
  //     return rand;
  //   }
  //   return this.getRandomColor();
  // };

  getRoadCount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ConserveGIS/roadCount',
    });
  };

  getOtherCount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ConserveGIS/otherCount',
    });
  };

  renderMarkersLine = () => {
    const {
      ConserveGIS: {
        otherCountData,
      },
    } = this.props;
    const ROAD_PRODUCTION = otherCountData.ROAD_PRODUCTION;
    const ROAD_INFO = otherCountData.ROAD_INFO;
    let markersLnglat = [], longitudeandlatitude = [];
    if (ROAD_PRODUCTION.length) {
      markersLnglat = ROAD_PRODUCTION.map(item => ({
        position: {
          longitude: item.longitude,
          latitude: item.latitude,
        },
      }));
    }

    if (ROAD_INFO.length) {
      longitudeandlatitude = ROAD_INFO.map(item => JSON.parse(item.longitudeandlatitude));
    }
    this.setState({ markersLnglat, longitudeandlatitude });
  };


  renderTool = () => {
    const {
      ConserveGIS: {
        roadCountData,
      },
    } = this.props;
    if (!roadCountData.length) return '';

    return (
      <div className={style.toolMain}>
        <div className={style.list}>
          <i className={`${iconStyle.iconfont} ${iconStyle['icon-luduanpaihang']}`}>&nbsp;</i>
          <div className={style.content}>
            <h3>{roadCountData[0].ROAD_MILEAGE}&nbsp;&nbsp;<small>km</small></h3>
            <p>公里数</p>
          </div>
        </div>
        <div className={style.list}>
          <i className={`${iconStyle.iconfont} ${iconStyle['icon-xiandao']}`}>&nbsp;</i>
          <div className={style.content}>
            <h3>{roadCountData[0].THE_WAY}&nbsp;&nbsp;<small>条</small></h3>
            <p>道路条数</p>
          </div>
        </div>
        <div className={style.list}>
          <i className={`${iconStyle.iconfont} ${iconStyle['icon-luduanpaihang']}`}>&nbsp;</i>
          <div className={style.content}>
            <h3>{roadCountData[0].PROPRIETARY_ROAD}&nbsp;&nbsp;<small>条</small></h3>
            <p>专有道路</p>
          </div>
        </div>
        <div className={style.list}>
          <i className={`${iconStyle.iconfont} ${iconStyle['icon-qiaoliang']}`}>&nbsp;</i>
          <div className={style.content}>
            <h3>{roadCountData[0].BRIDGE}&nbsp;&nbsp;<small>座</small></h3>
            <p>桥梁</p>
          </div>
        </div>
        <div className={style.list}>
          <i className={`${iconStyle.iconfont} ${iconStyle['icon-tiaozheng']}`}>&nbsp;</i>
          <div className={style.content}>
            <h3>{roadCountData[1].ROAD_PROPERTY}&nbsp;&nbsp;<small>处</small></h3>
            <p>路产</p>
          </div>
        </div>
      </div>
    );
  };

  amapEvents = () => {
    return {
      created: mapInstance => {
        this.mapInstance = mapInstance;
        setTimeout(() => this.renderMarkersLine(), 1500);
      },
    };
  };

  render() {
    const { markersLnglat, longitudeandlatitude } = this.state;
    // const events = {
    //   created: (ins) => {
    //     this.mapInstance = ins;
    //     setTimeout(() => this.renderMarkersLine(), 1500);
    //   },
    // };
    //
    return (
      <div style={{
        height: 'calc(100vh - 140px)',
        margin: '-20px -20px -20px -20px',
        background: '#fff',
        position: 'relative',
      }}>
        <Map events={this.amapEvents()} zoom={12} amapkey='33d3572b08475f40fbec1241868fcbb8'>
          {markersLnglat.length ? <Markers
            markers={this.state.markersLnglat}
          /> : null}
          {longitudeandlatitude.length ? longitudeandlatitude.map((item, index) =>
            <Polyline
              style={{
                isOutline: true,
                outlineColor: '#000',
                borderWeight: 2,
                strokeWeight: 5,
                strokeColor: `#${getRandomColor()}`,
                lineJoin: 'round',
              }}
              key={index}
              path={item}
            />,
          ) : null}

        </Map>
        {this.renderTool()}
      </div>
    );
  }

}

export default Count;
