import React, { PureComponent } from 'react';
import { Polyline, Markers, InfoWindow } from 'react-amap';
import { Checkbox, Button, Form, Modal, Descriptions, Carousel, message } from 'antd';

import { connect } from 'dva';
import moment from 'moment';

import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

import CreateModal from './component/CreateModal';
import BaseMap from '@/pages/conserve/Component/BaseMap';
import RoadProductionTroubleModal from './component/RoadProductionTroubleModal';
import style from './index.less';

import { getRandomColor, imgUrl, conserveSocketUrl } from '@/utils/utils';
import themeStyle from '@/pages/style/theme.less';
import png_1 from '@/assets/conserve/contingencyPlan/1.png';
import png_1_1 from '@/assets/conserve/contingencyPlan/1-1.png';
import png_2 from '@/assets/conserve/contingencyPlan/2.png';
import png_2_1 from '@/assets/conserve/contingencyPlan/2-1.png';
import notImg from '@/assets/notImg.png';
import Zmage from 'react-zmage';
import mapCss from '@/pages/style/map.less';

let stompClient = null;

// 工单详情
const OrderModal = Form.create()(props => {
  const { modalVisible, handleModalVisible, detail } = props;
  const img = detail.imgUrl ? detail.imgUrl.split(',') : [];
  const imgs = img.map(item => ({
    src: imgUrl + item,
    alt: '',
  }));

  return (
    <Modal
      destroyOnClose
      title="工单信息"
      className={themeStyle.myModal + ' ' + themeStyle.modalbody}
      visible={modalVisible}
      onCancel={() => handleModalVisible()}
      footer={null}
    >
      <div className={themeStyle.detailMsg}>
        <div style={{ padding: 20 }}>
          <div className={mapCss.myCarousel}>
            <Carousel autoplay>
              {imgs.length ? (
                imgs.map((item, i) => (
                  <div style={{ height: 200 }} key={i}>
                    <Zmage
                      backdrop="rgba(255,255,255,.3)"
                      defaultPage={i}
                      style={{ width: '100%', height: 200 }}
                      src={item.src}
                      set={imgs}
                    />
                  </div>
                ))
              ) : (
                <img className={mapCss.notImg} src={notImg} alt="" />
              )}
            </Carousel>
          </div>
          <Descriptions bordered size="small" column={1}>
            <Descriptions.Item label="公司名称">{detail.companyName}</Descriptions.Item>
            <Descriptions.Item label="地址">{detail.curingAddr}</Descriptions.Item>
            <Descriptions.Item label="负责人">{detail.curinger}</Descriptions.Item>
            <Descriptions.Item label="限定完成时间">
              {moment(detail.endTime).format('YYYY-MM-DD')}
            </Descriptions.Item>
            <Descriptions.Item label="养护内容">{detail.curingContent}</Descriptions.Item>
            <Descriptions.Item label="工作内容">{detail.workContent}</Descriptions.Item>
          </Descriptions>
        </div>
      </div>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ system, RoadWorkOrdes, ConserveCompany, loading }) => ({
  system,
  RoadWorkOrdes,
  ConserveCompany,
  loading: loading.models.ConserveCompany,
}))
class ContingencyPlan extends PureComponent {
  constructor(props) {
    super(props);
    this.mapInstance = null;
    this.propleMobile = [];
  }

  state = {
    roadInfoVisible: false,
    roadInfoLngLat: null,
    roadInfoMsg: {},
    colors: [],
    markers: [],
    infoLngLat: null,
    orderWinVisible: false,
    orderVisible: true,
    orderWinInfo: {},
    modalVisible: false,
    troubleModalVisible: false,
    longitudeandlatitude: [],
    peopleMarkes: [],
    peopleInfoLngLat: null,
    peopleMarkersInfoVisible: false,
    peopleMsg: {},
    center: null,
    oldAddress: '',
    peopleVisible: true,
    pageBean: { page: 1, pageSize: 10000, showTotal: true },
  };

  componentDidMount() {
    const { pageBean } = this.state;
    this.getList({ pageBean });
    this.getOrderByState();
    this.initWebSocket();
  }

  componentWillReceiveProps(nextProps) {
    const {
      system: { address },
    } = nextProps;
    const { oldAddress } = this.state;
    if (oldAddress !== address) {
      setTimeout(() => {
        try {
          this.getLngLatByAddress(address, lnglat => {
            this.setState({ center: lnglat, oldAddress: address });
          });
        } catch (e) {}
      }, 3000);
    }
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
    if (stompClient) {
      try {
        stompClient.disconnect();
      } catch (e) {}
      stompClient = null;
    }
  }

  getLngLatByAddress = (address, callback) => {
    this.mapInstance.plugin('AMap.Geocoder', () => {
      const geocoder = new AMap.Geocoder({});
      geocoder.getLocation(address, (status, result) => {
        if (status === 'complete' && result.geocodes.length) {
          const lngLat = result.geocodes[0].location;
          callback(lngLat);
        }
      });
    });
  };

  // 开启socket
  initWebSocket = () => {
    this.connection();
  };

  /**
   * @description socket 消息处理
   * @param msg
   */
  onMessage = msg => {
    const { peopleMarkes } = this.state;
    const body = JSON.parse(msg.body);
    const markers = [...peopleMarkes];
    body.forEach(item => {
      const { mobileId, longlatitude, userName, phone } = JSON.parse(item);
      const lngLat = longlatitude ? longlatitude.split(',') : [0, 0];
      const obj = {
        position: {
          longitude: lngLat[0],
          latitude: lngLat[1],
        },
        userName,
        phone,
      };
      if (this.propleMobile.includes(mobileId)) {
        const index = this.propleMobile.indexOf(mobileId);
        markers[index] = obj;
      } else {
        this.propleMobile.push(mobileId);
        markers.push(obj);
      }
    });
    this.setState({ peopleMarkes: markers });
  };

  /**
   * @description 创建socket 链接
   */
  connection = () => {
    // const { currentUser } = this.props;
    const socket = new SockJS(conserveSocketUrl);
    stompClient = Stomp.over(socket);
    const headers = {
      Authorization: '',
      // 'x-requested-with': 'authorization',
    };
    stompClient.debug = null;
    // 向服务器发起websocket连接
    stompClient.connect(
      headers,
      () => {
        stompClient.subscribe('/topic/mobilePhone', this.onMessage);
      },
      err => {
        message.error('socket连接失败');
        console.log(err);
        // this.connection();
      },
    );
  };

  /**
   * @description 下达任务  刷新
   */
  modalSuccess = () => {
    this.getOrderByState();
  };

  getOrderByState = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'RoadWorkOrdes/orderByState',
      callback: res => {
        this.formatMarkers(res);
      },
    });
  };

  /**
   * @description 格式化坐标点
   * @param list
   */
  formatMarkers = list => {
    const markers = list.map(item => {
      if (item.longlat) {
        const longlat = item.longlat.split(',');
        return {
          position: {
            longitude: longlat[0],
            latitude: longlat[1],
          },
          ...item,
        };
      }
      return {
        position: null,
        ...item,
      };
    });
    this.setState({ markers });
  };

  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ConserveCompany/getAllRoadCompanyConserveData',
      payload: params,
      callback: list => {
        // const longitudeandlatitude = list.map(item => JSON.parse(item.longitudeandlatitude));
        const colors = [];
        for (let i = 0; i < list.length; i++) {
          colors.push(`#${getRandomColor()}`);
        }
        this.setState({ longitudeandlatitude: list, colors });
      },
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  troubleHandleModalVisible = flag => {
    this.setState({
      troubleModalVisible: !!flag,
    });
  };

  /**
   * @description 更改工单坐标图片
   * @param data
   * @returns {*}
   */
  renderOrderMarkers = data => {
    return <img src={png_2_1} />;
  };

  handleOrderWinVisible = flag => {
    this.setState({
      orderWinVisible: !!flag,
    });
  };

  orderMarkersEvent = () => {
    return {
      click: (e, marker) => {
        const extData = marker.getExtData();
        // const lngLat = extData.position;
        this.setState({ orderWinInfo: extData });
        this.handleOrderWinVisible(true);
        // this.setState({ infoLngLat: lngLat, orderWinInfo: extData, orderWinVisible: true });
      },
      mouseout: () => {
        this.handleOrderWinVisible();
        this.setState({ orderWinInfo: {} });
        // this.setState({ infoLngLat: null, orderWinInfo: {}, orderWinVisible: false });
      },
    };
  };

  /**
   * @description 巡查人员
   * @returns {{mouseout: mouseout, click: click}}
   */
  peopleMarkersEvent = () => {
    return {
      click: (e, marker) => {
        const extData = marker.getExtData();
        const lngLat = extData.position;
        this.setState({
          peopleMsg: extData,
          peopleInfoLngLat: lngLat,
          peopleMarkersInfoVisible: true,
        });
      },
      mouseout: () => {
        this.setState({
          peopleMsg: {},
          peopleInfoLngLat: null,
          peopleMarkersInfoVisible: false,
        });
      },
    };
  };

  renderPeopleMarkers = data => {
    return <img src={png_1_1} style={{ width: 20 }} alt="" />;
  };

  /**
   * @description 地图事件
   * @returns {{created: created}}
   */
  amapEvents = () => {
    return {
      created: mapInstance => {
        this.mapInstance = mapInstance;
      },
    };
  };

  peopleChange = e => {
    this.setState({
      peopleVisible: e.target.checked,
    });
  };

  /**
   * @description 图例进行中事件
   */
  orderChange = e => {
    this.setState({
      orderVisible: e.target.checked,
    });
  };

  /**
   * @description 路线事件
   * @returns {{mouseout: mouseout, click: click}}
   */
  polylineEvent = () => {
    return {
      click: e => {
        const info = e.target.getExtData();
        const lngLat = e.lnglat;
        this.setRoadInfoWindow(true, info, {
          longitude: lngLat.lng,
          latitude: lngLat.lat,
        });
      },
      mouseout: e => {
        this.setRoadInfoWindow();
      },
    };
  };

  /**
   * @description 设置线路窗口值
   * @param roadInfoVisible
   * @param roadInfoMsg
   * @param roadInfoLngLat
   */
  setRoadInfoWindow = (roadInfoVisible = false, roadInfoMsg = {}, roadInfoLngLat = null) => {
    this.setState({
      roadInfoVisible,
      roadInfoMsg,
      roadInfoLngLat,
    });
  };

  render() {
    const {
      modalVisible,
      troubleModalVisible,
      longitudeandlatitude,
      colors,
      orderVisible,
      markers,
      orderWinVisible,
      infoLngLat,
      orderWinInfo,
      peopleMarkes,
      peopleVisible,
      peopleInfoLngLat,
      peopleMarkersInfoVisible,
      peopleMsg,
      roadInfoVisible,
      roadInfoLngLat,
      roadInfoMsg,
      center,
    } = this.state;

    const PolylineDom = longitudeandlatitude.length
      ? longitudeandlatitude.map((item, index) => (
          <Polyline
            style={{
              isOutline: true,
              outlineColor: '#000',
              borderWeight: 2,
              strokeWeight: 6,
              strokeColor: colors[index],
              lineJoin: 'round',
              showDir: true,
              extData: {
                ...item,
              },
            }}
            key={index}
            path={JSON.parse(item.longitudeandlatitude || '[]')}
            // path={item}
            events={this.polylineEvent()}
          />
        ))
      : null;

    // 进行中坐标点
    const markersOrderDOM = (
      <Markers
        key="markersDOM"
        markers={orderVisible ? markers : []}
        render={this.renderOrderMarkers}
        events={this.orderMarkersEvent()}
      />
    );

    // 巡查人员
    const markersPeopleDOM = (
      <Markers
        key="markersPeopleDOM"
        markers={peopleVisible ? peopleMarkes : []}
        render={this.renderPeopleMarkers}
        events={this.peopleMarkersEvent()}
      />
    );

    // 巡查人员信息窗口
    const markersPeopleInfoDOM = (
      <InfoWindow
        position={peopleInfoLngLat}
        visible={peopleMarkersInfoVisible}
        isCustom
        showShadow
        offset={[1, -30]}
        key="markersPeopleInfoDOM"
      >
        <div style={{ width: 200 }}>
          <p>姓名：{peopleMsg.userName}</p>
          <p>电话：{peopleMsg.phone}</p>
        </div>
      </InfoWindow>
    );

    const roadMarkerInfo = (
      <InfoWindow
        position={roadInfoLngLat}
        visible={roadInfoVisible}
        isCustom
        showShadow
        key="roadInfoWindowDom"
      >
        <p>路段名称：{roadInfoMsg.roadName}</p>
        <p>里程：{roadInfoMsg.roadMileage} km</p>
        <p>起点：{roadInfoMsg.startAddr}</p>
        <p>终点：{roadInfoMsg.endAddr}</p>
        <p>内容：{roadInfoMsg.content}</p>
      </InfoWindow>
    );

    const parentMethods = {
      modalSuccess: this.modalSuccess,
      handleModalVisible: this.handleModalVisible,
    };

    const troubleMethods = {
      // modalSuccess: this.modalSuccess,
      handleModalVisible: this.troubleHandleModalVisible,
    };

    return (
      <div
        style={{
          height: 'calc(100vh - 140px)',
          margin: '-20px -20px -20px -20px',
          background: '#fff',
          position: 'relative',
        }}
      >
        <div className={style.legend}>
          <div className={style.header}>图例</div>
          <div className={style.body}>
            <div className={style.list}>
              <p>
                <img src={png_1} alt="" /> 巡查人员
              </p>
              <Checkbox checked={peopleVisible} onChange={this.peopleChange} />
            </div>
            <div className={style.list}>
              <p>
                <img src={png_2} alt="" /> 进行中
              </p>
              <Checkbox checked={orderVisible} onChange={this.orderChange} />
            </div>
          </div>
        </div>

        <div className={style.statistics}>
          <div className={style.header}>统计</div>
          <div className={style.body}>
            <div className={style.list}>
              <h3>巡查人员</h3>
              <p>当前共有{peopleMarkes.length}人在巡查</p>
            </div>
            <div className={style.list}>
              <h3>养护记录</h3>
              <div className={style.listBody}>
                <p>
                  进行中<span>({markers.length})</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className={style.buttonGroup}>
          <Button
            type="primary"
            icon="profile"
            onClick={() => this.troubleHandleModalVisible(true)}
          >
            巡查上报记录
          </Button>
          &nbsp;&nbsp;
          <Button type="primary" icon="plus" onClick={() => this.handleModalVisible(true)}>
            下达任务
          </Button>
        </div>

        <BaseMap
          amapEvents={this.amapEvents()}
          center={center}
          children={[
            roadMarkerInfo,
            PolylineDom,
            markersOrderDOM,
            markersPeopleDOM,
            markersPeopleInfoDOM,
          ]}
        />

        {/* 工单详情窗口 */}
        {orderWinVisible && Object.keys(orderWinInfo).length ? (
          <OrderModal
            modalVisible={orderWinVisible}
            detail={orderWinInfo}
            handleModalVisible={this.handleOrderWinVisible}
          />
        ) : null}

        <CreateModal {...parentMethods} modalVisible={modalVisible} />
        {troubleModalVisible ? (
          <RoadProductionTroubleModal {...troubleMethods} modalVisible={troubleModalVisible} />
        ) : null}
      </div>
    );
  }
}

export default ContingencyPlan;
