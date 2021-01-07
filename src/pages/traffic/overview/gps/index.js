import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Polyline, Marker, InfoWindow } from 'react-amap';
import { Form, Input, Button, DatePicker, Table, Radio, Spin, message, Divider } from 'antd';
import BaseMap from '@/components/BaseMap';

import { wgs84togcj02 } from '@/utils/utils';
import style from './index.less';
import carImg from './car.png';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const format = 'YYYY-MM-DD HH:mm:ss';

@connect(({ CarGPS, loading }) => ({
  CarGPS,
  loading: loading.models.CarGPS,
}))
@Form.create()
class Index extends PureComponent {
  state = {
    carDetail: {},
    linePath: [],
    center: null,
    carMarker: {},
    carMarlerExtData: {},
    carInfoVisible: false,
  };

  columns = [
    {
      title: '时间',
      dataIndex: 'gtm',
      render: val => {
        if (val) {
          const newVal = val.replace('/', ' ');
          const time = moment(newVal).format('YYYY-MM-DD HH:mm:ss');
          return time;
        }
        return '';
      },
    },
    {
      title: '速度(km/h)',
      dataIndex: 'spd',
    },
    // {
    //   title: '状态',
    //   dataIndex: 'state',
    // },
  ];

  constructor(props) {
    super(props);
    this.carNo = '';
  }

  componentDidMount() {}

  /**
   * @description 车辆轨迹
   * @param {*} params
   */
  getVHisTrack24 = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'CarGPS/vHisTrack24',
      payload: params,
      callback: res => {
        if (res) {
          const { result } = JSON.parse(res);

          const linePath = result.map(item => {
            const lngLat = wgs84togcj02(item.lon / 600000, item.lat / 600000);
            return { ...item, longitude: lngLat[0], latitude: lngLat[1] };
          });
          const center = linePath[linePath.length - 1];
          this.setState({ linePath, center });
        }
      },
    });
  };

  /**
   * @description 最新位置
   * @param {*} params
   */
  getOpGpVclPosColor = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'CarGPS/opGpVclPosColor',
      payload: params,
      callback: res => {
        if (res) {
          const { result } = JSON.parse(res);
          const lngLat = wgs84togcj02(result.lon / 600000, result.lat / 600000);
          const position = { longitude: lngLat[0], latitude: lngLat[1] };
          this.setState({
            carMarker: position,
            carMarlerExtData: result,
            center: position,
            carInfoVisible: true,
          });
        }
      },
    });
  };

  /**
   * @description 车辆完整信息
   * @param {*} params
   */
  getVehicleInfoCompleteV21 = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'CarGPS/vehicleInfoCompleteV21',
      payload: params,
      callback: res => {
        if (res) {
          // const { result } = JSON.parse(res);
          this.setState({ carDetail: res });
        }
      },
    });
  };

  // 陕YH0009 陕YH0008
  handleSearch = e => {
    e.preventDefault();
  };

  /**
   * @description 轨迹按钮点击
   */
  handleTrajectory = () => {
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (!fieldsValue.vclN) {
        message.error('请输入车牌号');
        return;
      }
      if (!fieldsValue.timeNearby) {
        message.error('请选择时间');
        return;
      }
      this.carNo = fieldsValue.vclN;
      // const vclN = `${fieldsValue.vclN}_${fieldsValue.vco}`;
      const vclN = `${fieldsValue.vclN}`;
      const time = fieldsValue.timeNearby
        ? {
            qryBtm: moment(fieldsValue.timeNearby[0]).format(format),
            qryEtm: moment(fieldsValue.timeNearby[1]).format(format),
          }
        : {};
      const GJ = {
        vclN,
        ...time,
      };
      this.getVHisTrack24(GJ);
    });
  };

  /**
   * @description 最新位置点击
   */
  handlePosition = () => {
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (!fieldsValue.vclN) {
        message.error('请输入车牌号');
        return;
      }
      this.carNo = fieldsValue.vclN;
      const vclN = `${fieldsValue.vclN}_${fieldsValue.vco}`;
      const newAddr = { vclN: fieldsValue.vclN, vco: fieldsValue.vco };
      this.getOpGpVclPosColor(newAddr);
      this.getVehicleInfoCompleteV21(vclN);
    });
  };

  resetForm = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      carDetail: {},
      linePath: [],
      center: null,
      carMarker: {},
      carMarlerExtData: {},
      carInfoVisible: false,
    });
  };

  // /**
  //  * @description 车辆详情
  //  */
  // handleCarDetail = () => {
  //   const { form } = this.props;
  //   form.validateFields((err, fieldsValue) => {
  //     if (err) return;
  //   });
  // };

  resetMarkerImg = () => <img src={carImg} alt="" width={40} />;

  renderSearch = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;

    const formItemStyle = {
      marginBottom: 10,
    };
    return (
      <div className={style.search}>
        <h3>车辆查询</h3>
        <Form>
          {/*  onSubmit={this.handleSearch} */}
          <FormItem style={formItemStyle}>
            {getFieldDecorator('vco', {
              initialValue: '2',
            })(
              <Radio.Group>
                <Radio value="2">黄色</Radio>
                <Radio value="1">蓝色</Radio>
              </Radio.Group>,
            )}
          </FormItem>
          <FormItem style={formItemStyle}>
            {getFieldDecorator('vclN')(<Input placeholder="请输入车牌号" />)}
          </FormItem>
          <FormItem style={formItemStyle}>
            {getFieldDecorator('timeNearby')(
              <RangePicker
                style={{ width: '100%' }}
                showTime={{
                  defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment(new Date(), 'HH:mm:ss')],
                }}
                format="YYYY-MM-DD HH:mm:ss"
              />,
            )}
          </FormItem>
        </Form>
        <div className={style.btnGroup}>
          <Button type="primary" onClick={this.handleTrajectory}>
            轨迹查询
          </Button>
          <Button type="primary" onClick={this.handlePosition}>
            实时位置
          </Button>
          <Button onClick={this.resetForm}>重置</Button>
        </div>
      </div>
    );
  };

  render() {
    const { loading } = this.props;
    const { linePath, carMarker, center, carMarlerExtData, carInfoVisible, carDetail } = this.state;

    const carLinePath = linePath.length ? (
      <Polyline
        key="carLinePath"
        showDir
        path={linePath}
        style={{ strokeColor: '#F13D34', strokeWeight: 6 }}
      />
    ) : null;

    const carMarkerPoint = Object.keys(carMarker).length ? (
      <Marker
        key="carMarkerPoint"
        position={center}
        // extData={carMarlerExtData}
        // icon={carImg}
        render={this.resetMarkerImg}
      />
    ) : null;

    const carInfoWin = (
      <InfoWindow
        key="carInfoWin"
        offset={[12, -30]}
        position={center}
        visible={carInfoVisible}
        isCustom
        showShadow
      >
        <Spin spinning={loading}>
          <div className={style.infoWIn}>
            <h3>{this.carNo}</h3>
            <span className={style.time}>
              {moment(parseInt(carMarlerExtData.utc, 10)).format('YYYY-MM-DD HH:mm:ss')}
            </span>
            <p>地址：{carMarlerExtData.adr}</p>
            <p>时速：{carMarlerExtData.spd}km/h</p>
            <Divider style={{ margin: '10px 0' }} />
            {Object.keys(carDetail).length && (
              <div>
                <p>车籍地：{carDetail.areaName}</p>
                <p>
                  <span>总质量：{carDetail.vclTn}kg</span>
                  &nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;
                  <span>额定载质量：{carDetail.ldTn}kg</span>
                </p>
                <p>
                  <span>轴数：{carDetail.vclAxs}</span>
                  &nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;
                  <span>车辆类型：{carDetail.vehicleType}</span>
                </p>
                <p>
                  外廓长*宽*高：
                  {`${carDetail.vclLng || 0}mm * ${carDetail.vclWdt || 0}mm * ${carDetail.vclHgt ||
                    0}mm`}
                </p>
              </div>
            )}
          </div>
        </Spin>
      </InfoWindow>
    );

    return (
      <Spin spinning={!!loading}>
        <div className={style.main}>
          <BaseMap center={center}>{[carLinePath, carMarkerPoint, carInfoWin]}</BaseMap>

          <div className={style.rightMain}>
            {this.renderSearch()}
            <div className={style.list}>
              <Table
                rowKey="gtm"
                size="middle"
                columns={this.columns}
                dataSource={linePath}
                pagination={{ pageSize: 10 }}
              />
            </div>
          </div>
        </div>
        {/* <CarModal modalVisible={true} /> */}
      </Spin>
    );
  }
}

export default Index;
