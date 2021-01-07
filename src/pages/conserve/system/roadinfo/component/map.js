import React, { PureComponent } from 'react';
import { Row, Col, Form, Input, Button, message } from 'antd';
import { Map, Markers, Polyline } from 'react-amap';
import { connect } from 'dva';

let route = null;
const FormItem = Form.Item;

@connect(({ system }) => ({
  system,
}))
@Form.create()
class DiyMap extends PureComponent {
  static defaultProps = {
    line: [],
  };

  constructor(props) {
    super(props);
    this.mapInstance = null;
  }

  state = {
    markers: [],
    lnglat: [],
    lines: [],
    startAddr: '',
    endAddr: '',
    center: null,
  };

  componentDidMount() {}

  componentWillUnmount() {
    if (this.mapInstance) {
      this.mapInstance.destroy();
    }
    route = null;
  }

  getStartAddress = () => {
    const { form } = this.props;
    const startAddr = form.getFieldValue('startAddr');
    if (startAddr) {
      this.setAddr('startAddr', startAddr);
      this.getLngLatByAddress(startAddr, lngLat => {
        this.renderRoad(lngLat);
      });
    } else {
      message.error('请输入起始地');
    }
  };

  getEndAddress = () => {
    const { form } = this.props;
    const { startAddr, markers } = this.state;
    // const newStartAddr = form.getFieldValue('startAddr');
    const endAddr = form.getFieldValue('endAddr');
    if (startAddr && markers.length) {
      if (endAddr) {
        this.setAddr('endAddr', endAddr);
        this.getLngLatByAddress(endAddr, lngLat => {
          this.renderRoad(lngLat);
        });
      } else {
        message.error('请输入结束地');
      }
    } else {
      message.error('请获取起始地');
    }
  };

  setAddr = (key, val) => {
    this.setState({
      [key]: val,
    });
  };

  /**
   * 地址定位
   * @param address
   */
  getLngLatByAddress = (address, callback) => {
    this.mapInstance.plugin('AMap.Geocoder', () => {
      const geocoder = new AMap.Geocoder({});
      geocoder.getLocation(address, (status, result) => {
        if (status === 'complete' && result.geocodes.length) {
          const lngLat = result.geocodes[0].location;
          // this.renderRoad(lngLat);
          callback(lngLat);
          // this.props.parentAddress(address, [lngLat.lng, lngLat.lat]);
          // this.updateState(lngLat, address);
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
  getAddressByLngLat = (LngLat, callback) => {
    this.mapInstance.plugin('AMap.Geocoder', () => {
      const geocoder = new AMap.Geocoder({});
      geocoder.getAddress(LngLat, (status, result) => {
        if (status === 'complete' && result.regeocode) {
          const { form } = this.props;
          const address = result.regeocode.formattedAddress;
          const { markers } = this.state;
          if (markers.length === 0) {
            form.setFieldsValue({
              startAddr: address,
            });
            this.setAddr('startAddr', address);
          }
          if (markers.length === 1) {
            form.setFieldsValue({
              endAddr: address,
            });
            this.setAddr('endAddr', address);
          }
          if (callback) {
            callback();
          }
        } else {
          message.error('定位失败');
        }
      });
    });
  };

  getAddressByLngLatCallAddr = (LngLat, callback) => {
    this.mapInstance.plugin('AMap.Geocoder', () => {
      const geocoder = new AMap.Geocoder({});
      geocoder.getAddress(LngLat, (status, result) => {
        if (status === 'complete' && result.regeocode) {
          const address = result.regeocode.formattedAddress;
          callback(address);
        } else {
          message.error('定位失败');
        }
      });
    });
  };

  drawLine = () => {
    const { line, endAddr, startAddr } = this.props;
    if (!line.length) return;
    this.setState({
      lines: line,
      startAddr,
      endAddr,
    });
  };

  renderRoad = ll => {
    // , startAddr, endAddr
    const { markers, lnglat } = this.state;
    const { lng, lat } = ll;
    const newMarers = JSON.parse(JSON.stringify(markers));
    const newLngLat = JSON.parse(JSON.stringify(lnglat));
    newMarers.push({
      position: {
        longitude: lng,
        latitude: lat,
      },
    });
    newLngLat.push([lng, lat]);
    this.setState({
      markers: newMarers,
      lnglat: newLngLat,
      // lines:[]
    });
    if (newMarers.length >= 2) {
      if (route) {
        route.destroy();
      }
      this.mapInstance.plugin('AMap.DragRoute', () => {
        route = new AMap.DragRoute(this.mapInstance, newLngLat, AMap.DrivingPolicy.LEAST_FEE); //构造拖拽导航类
        route.search(); // 查询导航路径并开启拖拽导航
        route.on('complete', data => {
          const result = data.data;

          const [startPosition, endPosition] = [
            route.getStart().getPosition(),
            route.getEnd().getPosition(),
          ];
          const sn_lnglat = [
            [startPosition.lng, startPosition.lat],
            [endPosition.lng, endPosition.lat],
          ];
          const { form, getMapData } = this.props;
          // this.props.getLngLat(route.getRoute(), result.routes[0].distance, startAddr, endAddr);

          this.getAddressByLngLatCallAddr(sn_lnglat[0], startAddr => {
            this.getAddressByLngLatCallAddr(sn_lnglat[1], endAddr => {
              getMapData({
                line: route.getRoute(),
                distance: result.routes[0].distance,
                startAddr,
                endAddr,
                sn_lnglat,
              });
              form.setFieldsValue({
                startAddr,
                endAddr,
              });
              this.setState({
                markers: [],
                lnglat: [],
                // startAddr: '',
                // endAddr: '',
              });
            });
          });
        });
      });
    }
  };

  amapEvents = () => {
    return {
      created: mapInstance => {
        this.mapInstance = mapInstance;
        const {
          system: { address },
        } = this.props;
        this.getLngLatByAddress(address, lngLat => {
          this.setState(
            {
              center: lngLat,
            },
            () => this.drawLine(),
          );
        });
      },
      click: e => {
        this.getAddressByLngLat([e.lnglat.getLng(), e.lnglat.getLat()], () => {
          this.renderRoad({
            lng: e.lnglat.getLng(),
            lat: e.lnglat.getLat(),
          });
        });
        // const newMarers = JSON.parse(JSON.stringify(this.state.markers));
        // const lnglat = JSON.parse(JSON.stringify(this.state.lnglat));
        // const [lng, lat] = [e.lnglat.getLng(), e.lnglat.getLat()];
        // newMarers.push({
        //   position: {
        //     longitude: lng,
        //     latitude: lat,
        //   },
        // });
        // lnglat.push([lng, lat]);
        // this.setState({
        //   markers: newMarers,
        //   lnglat,
        //   // lines:[]
        // });
        // if (newMarers.length >= 2) {
        //   const path = [lnglat[0], lnglat[1]];
        //   if (route) {
        //     route.destroy();
        //   }
        //   this.mapInstance.plugin('AMap.DragRoute', () => {
        //     route = new AMap.DragRoute(this.mapInstance, path, AMap.DrivingPolicy.LEAST_FEE); //构造拖拽导航类
        //     route.search(); // 查询导航路径并开启拖拽导航
        //     route.on('complete', data => {
        //       const result = data.data;
        //       this.props.getLngLat(route.getRoute(), result.routes[0].distance);
        //       this.setState({
        //         markers: [],
        //         lnglat: [],
        //       });
        //     });
        //   });
        // }
      },
    };
  };

  render() {
    const { lines, markers, startAddr, endAddr, center } = this.state;
    const { form } = this.props;
    return (
      <div>
        <Row gutter={40}>
          <Col md={12} sm={24}>
            <FormItem label="起始地">
              <div style={{ display: 'flex' }}>
                <div style={{ flex: 1 }}>
                  {form.getFieldDecorator('startAddr', {
                    initialValue: startAddr,
                    rules: [{ required: true, message: '请输入起始地！' }],
                  })(<Input placeholder="请输入" />)}
                </div>
                <div style={{ width: 90, marginLeft: 10 }}>
                  <Button type="primary" onClick={() => this.getStartAddress()}>
                    获取位置
                  </Button>
                </div>
              </div>
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="结束地">
              <div style={{ display: 'flex' }}>
                <div style={{ flex: 1 }}>
                  {form.getFieldDecorator('endAddr', {
                    initialValue: endAddr,
                    rules: [{ required: true, message: '请选择结束地！' }],
                  })(<Input placeholder="请输入" />)}
                </div>
                <div style={{ width: 90, marginLeft: 10 }}>
                  <Button type="primary" onClick={() => this.getEndAddress()}>
                    获取位置
                  </Button>
                </div>
              </div>
            </FormItem>
          </Col>
        </Row>
        <div style={{ height: 350 }}>
          <Map
            amapkey="33d3572b08475f40fbec1241868fcbb8"
            events={this.amapEvents()}
            center={center}
          >
            <Markers markers={markers} />
            {lines.length ? (
              <Polyline
                path={lines}
                style={{
                  isOutline: true,
                  outlineColor: '#ffeeee',
                  borderWeight: 2,
                  strokeWeight: 6,
                  strokeColor: '#0091ff',
                  lineJoin: 'round',
                  showDir: true,
                }}
              />
            ) : null}
          </Map>
        </div>
      </div>
    );
  }
}

export default DiyMap;
