import React, { PureComponent } from 'react';
import { Map, Marker, Markers } from 'react-amap';
import { message } from 'antd';


class Maps extends React.Component {

  constructor(props) {
    super(props);
    this.mapInstance = null;
  }

  state = {
    markers: [],
    address: '',
    lnglat: '',
  };


  componentWillReceiveProps(nextProps, nextContext) {
    const { address, lnglat } = this.state;
    if (nextProps.lnglat) {
      if (lnglat !== nextProps.lnglat.join()) {
        this.setState({ lnglat: nextProps.lnglat.join() });
        setTimeout(() => this.getAddressLngLat(nextProps.lnglat), 1500);
      }
    } else {
      if (address !== nextProps.address && nextProps.address) {
        this.setState({ address: nextProps.address });
        setTimeout(() => this.getAddress(nextProps.address), 1500);
      }
    }
  }

  componentWillUnmount() {
    if (this.mapInstance) {
      this.mapInstance.destroy();
    }
  }


  getAddress = address => {
    this.mapInstance.plugin('AMap.Geocoder', () => {
      const geocoder = new AMap.Geocoder({});
      geocoder.getLocation(address, (status, result) => {
        if (status === 'complete' && result.geocodes.length) {
          const lnglat = result.geocodes[0].location;
          this.props.parentAddress(address, [lnglat.lng, lnglat.lat]);
          this.setState({
            markers: [{
              position: lnglat,
            }],
          });
        } else {
          message.error('定位失败');
        }
      });
    });
  };

  getAddressLngLat = LngLat => {
    this.mapInstance.plugin('AMap.Geocoder', () => {
      const geocoder = new AMap.Geocoder({});
      geocoder.getAddress(LngLat, (status, result) => {
        if (status === 'complete' && result.regeocode) {
          const address = result.regeocode.formattedAddress;
          this.props.parentAddress(address, LngLat);
          this.setState({
            address,
            markers: [{
              position: {
                lng: LngLat[0],
                lat: LngLat[1],
              },
            }],
          });
        } else {
          message.error('定位失败');
        }
      });
    });
  };


  amapEvents = () => {
    return {
      created: mapInstance => {
        this.mapInstance = mapInstance;
      },
      click: e => {
        this.getAddressLngLat([e.lnglat.lng, e.lnglat.lat]);
        // this.mapInstance.plugin('AMap.Geocoder', () => {
        //   const geocoder = new AMap.Geocoder({});
        //   geocoder.getAddress([e.lnglat.lng, e.lnglat.lat], (status, result) => {
        //     if (status === 'complete' && result.regeocode) {
        //       const address = result.regeocode.formattedAddress;
        //       this.props.parentAddress(address, [e.lnglat.lng, e.lnglat.lat]);
        //       this.setState({
        //         address,
        //         markers: [{
        //           position: {
        //             lng: e.lnglat.lng,
        //             lat: e.lnglat.lat,
        //           },
        //         }],
        //       });
        //     } else {
        //       message.error('定位失败');
        //     }
        //   });
        // });
      },
    };
  };

  render() {
    return (
      <Map amapkey='33d3572b08475f40fbec1241868fcbb8' events={this.amapEvents()}>
        <Markers markers={this.state.markers}/>
      </Map>
    );
  }

}

export default Maps;
