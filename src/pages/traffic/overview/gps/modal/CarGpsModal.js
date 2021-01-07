import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Modal, Spin, Table } from 'antd';
import { Polyline, Marker, InfoWindow } from 'react-amap';
import BaseMap from '@/components/BaseMap';
import { wgs84togcj02 } from '@/utils/utils';

// import lngLat from './lngLat';

import themeStyle from '@/pages/style/theme.less';
import style from '../index.less';

import carImg from '../car.png';

@connect(({ CarGPS, loading }) => ({
  CarGPS,
  loading: loading.models.CarGPS,
}))
class CarGPSModal extends PureComponent {
  static defaultProps = {
    carGPSParams: {},
    modalVisible: false,
    handleModalVisible: () => {},
  };

  state = {
    linePath: [],
    center: null,
    height: 0,
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
    this.tabRef = React.createRef();
  }

  componentDidMount() {
    this.getVHisTrack();
  }

  getVHisTrack = () => {
    const {
      dispatch,
      carGPSParams: { previewTime, carNo },
    } = this.props;
    const time = moment(previewTime)
      .subtract(1, 'day')
      .format('YYYY-MM-DD HH:mm:ss');
    const params = {
      vclN: carNo,
      qryBtm: time,
      qryEtm: previewTime,
    };

    // const params = {
    //   qryBtm: '2020-09-22 00:00:00',
    //   qryEtm: '2020-09-22 23:59:59',
    //   vclN: '陕YH0009',
    // };

    // const linePath = lngLat.result.map(item => {
    //   const ll = wgs84togcj02(item.lon / 600000, item.lat / 600000);
    //   return { longitude: ll[0], latitude: ll[1] };
    // });

    // const center = linePath[linePath.length - 1];

    // this.setState({ linePath, center });

    dispatch({
      type: 'CarGPS/vHisTrack',
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

  resetMarkerImg = () => <img src={carImg} alt="" width={40} />;

  render() {
    const { modalVisible, handleModalVisible, loading } = this.props;
    const { linePath, center, height } = this.state;

    const carLinePath = linePath.length ? (
      <Polyline
        key="carLinePath"
        showDir
        path={linePath}
        style={{ strokeColor: '#F13D34', strokeWeight: 6 }}
      />
    ) : null;

    const carMarkerPoint = center ? (
      <Marker
        key="carMarkerPoint"
        // extData={carMarlerExtData}
        // icon={carImg}
        render={this.resetMarkerImg}
      />
    ) : null;

    return (
      <Modal
        destroyOnClose
        title="查看车辆轨迹"
        className={`${themeStyle.myModal} ${themeStyle.modalbody}`}
        visible={modalVisible}
        onCancel={() => handleModalVisible()}
        width="1000px"
        footer={null}
      >
        <Spin spinning={!!loading}>
          <div className={style.modalMain}>
            <BaseMap center={center}>{[carLinePath, carMarkerPoint]}</BaseMap>
            <div className={style.rightMain}>
              <Table
                rowKey="gtm"
                size="middle"
                columns={this.columns}
                dataSource={linePath}
                pagination={{ pageSize: 10, simple: true }}
                // scroll={{ y: 800 }}
              />
            </div>
          </div>
        </Spin>
      </Modal>
    );
  }
}

export default CarGPSModal;
