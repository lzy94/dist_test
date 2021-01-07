import React from 'react';
import { Map } from 'react-amap';

/**
 * @description 地图父组件
 * @param {*} props
 */
const BaseMap = props => {
  const { center, zoom, amapEvents, isUseAMapUI, children } = props;
  return (
    <Map
      center={center}
      amapkey="33d3572b08475f40fbec1241868fcbb8"
      zoom={zoom}
      events={amapEvents}
      useAMapUI={isUseAMapUI}
    >
      {children}
    </Map>
  );
};

BaseMap.defaultProps = {
  center: null,
  zoom: 12,
  isUseAMapUI: false,
  amapEvents: () => ({}),
};

export default BaseMap;
