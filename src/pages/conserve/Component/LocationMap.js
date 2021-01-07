import React, { PureComponent, Fragment } from 'react';
import { message, Form, Row, Col, Input, Button } from 'antd';
import { Marker } from 'react-amap';

import BaseMap from './BaseMap';

@Form.create()
class LocationMap extends PureComponent {
  constructor(props) {
    super(props);
    this.mapInstance = null;
  }

  state = {
    address: '',
    value: '',
    center: null,
    markers: {},
    lngLat: '',
  };

  componentWillUnmount() {
    if (this.mapInstance) {
      this.mapInstance.destroy();
    }
  }

  static getDerivedStateFromProps(prevProps, prevState) {
    const lngLatProps = prevProps.lngLat;
    const state = {};
    if (prevProps.address !== prevState.address && prevProps.address) {
      state.value = prevProps.address;
      state.address = prevProps.address;
    }
    if (lngLatProps) {
      if (prevState.lngLat !== JSON.stringify(lngLatProps)) {
        const CM = {
          longitude: lngLatProps.longitude,
          latitude: lngLatProps.latitude,
        };
        state.lngLat = JSON.stringify(lngLatProps);
        state.center = CM;
        state.markers = CM;
      }
    }
    return state;
  }

  inputChange = e => {
    const { getInputValue } = this.props;
    if (getInputValue) getInputValue(e.target.value);
  };

  // changeValue = e => {
  //   console.log(e.target.value);
  //   // this.setState({ value: e.target.value });
  // };

  // getAddress = () => {
  //   const { value } = this.state;
  //   if (!value) return message.error('请输入地址');
  //   this.getLngLatByAddress(value);
  // };

  getAddress = () => {
    const { form } = this.props;
    const lngLat = form.getFieldValue('lngLat');
    if (lngLat) {
      if (/,/.test(lngLat)) {
        const lngLats = lngLat.split(',');
        if (lngLats[0] && lngLats[1]) {
          const ll = {
            longitude: lngLats[0],
            latitude: lngLats[1],
          };
          this.setState(
            {
              center: ll,
              lngLat: ll,
              markers: ll,
            },
            () => this.getAddressByLngLat(lngLats),
          );
        } else {
          message.error('请输入正确格式');
        }
      } else {
        message.error('请输入正确格式');
      }
    } else {
      message.error('请输入经纬度');
    }
  };

  updateState = (data, addr) => {
    const lngLat = {
      longitude: data.lng,
      latitude: data.lat,
    };
    this.setState({
      center: lngLat,
      markers: lngLat,
      value: addr,
    });
  };

  // componentWillReceiveProps(nextProps, nextContext) {
  //   alert()
  //   const { address, lngLat } = this.state;
  //   const lngLatProps = nextProps.lngLat;
  //   console.log(nextProps.address, address, '----');
  //   if (address !== nextProps.address && nextProps.address) {
  //     this.setState({
  //       value: nextProps.address,
  //       address: nextProps.address,
  //     });
  //   }
  //   if (lngLatProps) {
  //     if (lngLat !== JSON.stringify(lngLatProps)) {
  //       const CM = {
  //         longitude: lngLatProps.longitude,
  //         latitude: lngLatProps.latitude,
  //       };
  //       this.setState({
  //         lngLat: JSON.stringify(lngLatProps),
  //         center: CM,
  //         markers: CM,
  //       });
  //     }
  //   }
  // }

  /**
   * 地图加载事件
   * @returns {{created: created, click: click}}
   */
  amapEvents = () => {
    return {
      created: mapInstance => {
        this.mapInstance = mapInstance;
      },
      click: e => {
        const lngLats = [e.lnglat.lng, e.lnglat.lat];
        this.getAddressByLngLat(lngLats);
      },
    };
  };

  /**
   * 地址定位
   * @param address
   */
  getLngLatByAddress = address => {
    this.mapInstance.plugin('AMap.Geocoder', () => {
      const geocoder = new AMap.Geocoder({});
      geocoder.getLocation(address, (status, result) => {
        if (status === 'complete' && result.geocodes.length) {
          const lngLat = result.geocodes[0].location;
          this.props.parentAddress(address, [lngLat.lng, lngLat.lat]);
          this.updateState(lngLat, address);
        } else {
          message.error('定位失败');
        }
      });
    });
  };

  /**
   * 坐标定位
   * @param LngLat
   */
  getAddressByLngLat = LngLat => {
    this.mapInstance.plugin('AMap.Geocoder', () => {
      const geocoder = new AMap.Geocoder({});
      geocoder.getAddress(LngLat, (status, result) => {
        if (status === 'complete' && result.regeocode) {
          const address = result.regeocode.formattedAddress;
          this.props.parentAddress(address, LngLat);
          const { form } = this.props;
          form.setFieldsValue({
            addr: address,
            lngLat: LngLat.join(),
          });
          this.updateState(
            {
              lng: LngLat[0],
              lat: LngLat[1],
            },
            address,
          );
        } else {
          message.error('定位失败');
        }
      });
    });
  };

  lngLat = lngLat => {
    if (lngLat) {
      return `${lngLat.longitude},${lngLat.latitude}`;
    }
    return '';
  };

  render() {
    const { form } = this.props;
    const { markers, center, value } = this.state;
    return (
      <Fragment>
        <Row gutter={40}>
          <Col sm={12}>
            <Form.Item label="地址">
              {form.getFieldDecorator('addr', {
                initialValue: value,
                rules: [{ required: true, message: '请输入地址！' }],
              })(<Input placeholder="请输入" onChange={this.inputChange} />)}
            </Form.Item>
          </Col>
          <Col sm={12}>
            <Form.Item label="经纬度(*,*)">
              <div style={{ display: 'flex' }}>
                <div style={{ flex: 1 }}>
                  {form.getFieldDecorator('lngLat', {
                    initialValue: this.lngLat(center),
                    rules: [{ required: true, message: '请输入经纬度！' }],
                  })(<Input placeholder="请输入" onChange={this.changeValue} />)}
                </div>
                <div style={{ width: 90, marginLeft: 10 }}>
                  <Button type="primary" onClick={() => this.getAddress()}>
                    获取位置
                  </Button>
                </div>
              </div>
            </Form.Item>
          </Col>
        </Row>
        <div style={{ height: 350 }}>
          <BaseMap
            center={center}
            amapEvents={this.amapEvents()}
            children={<Marker position={markers} />}
          />
        </div>
      </Fragment>
    );
  }
}

export default LocationMap;
