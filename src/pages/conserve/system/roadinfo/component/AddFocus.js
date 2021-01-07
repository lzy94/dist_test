import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { Button, Modal, Form, message, Input } from 'antd';
import { Polyline, Markers } from 'react-amap';
import clonedeep from 'lodash.clonedeep';
import BaseMap from '@/pages/conserve/Component/BaseMap';

import themeStyle from '@/pages/style/theme.less';

const FormItem = Form.Item;

const MarkersModal = Form.create()(props => {
  const { modalVisible, handleModalVisible, form, focusMessage, handleAdd } = props;
  const handleOk = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
      handleModalVisible();
    });
  };

  return (
    <Modal
      destroyOnClose
      className={themeStyle.formModal}
      title="坐标点描述"
      visible={modalVisible}
      onOk={handleOk}
      onCancel={() => handleModalVisible()}
    >
      <FormItem label="描述">
        {form.getFieldDecorator('focusMessage', {
          initialValue: focusMessage,
          rules: [{ required: true, message: '请输入坐标描述！' }],
        })(<Input.TextArea placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
});

@connect(({ RoadInfo, loading }) => ({
  RoadInfo,
  loading: loading.models.RoadInfo,
}))
@Form.create()
class AddFocus extends PureComponent {
  static defaultProps = {
    modalVisible: false,
    handleModalVisible: () => {},
  };

  constructor(props) {
    super(props);
    this.markerClickTImeOut = null;
  }

  state = {
    center: null,
    markers: [],
    focusMessage: '',
    markersIndex: 0,
    markersModalVisible: false,
    longitudeandlatitude: '',
  };

  componentDidMount() {
    const { dispatch, id } = this.props;
    dispatch({
      type: 'RoadInfo/detail',
      payload: id,
      callback: detail => {
        const center = detail.startlongla ? detail.startlongla.split(',') : null;
        const focusInfo = JSON.parse(detail.focusInfo || '[]');

        const markers = focusInfo.map((item, i) => {
          const lngLat = item.focusPoint.split(',');
          return {
            position: {
              longitude: lngLat[0],
              latitude: lngLat[1],
            },
            focusMessage: item.focusMessage,
            draggable: true,
            index: i,
          };
        });

        this.setState({
          longitudeandlatitude: detail.longitudeandlatitude,
          markers,
          center: center
            ? {
                longitude: center[0],
                latitude: center[1],
              }
            : null,
        });
      },
    });
  }

  componentWillUnmount() {
    if (this.markerClickTImeOut) {
      clearTimeout(this.markerClickTImeOut);
    }
  }

  handleMarkersModalVisible = flag => {
    this.setState({
      markersModalVisible: !!flag,
    });

    if (!flag) {
      this.setState({
        focusMessage: '',
        markersIndex: 0,
      });
    }
  };

  /**
   * @description 添加点
   * @param lngLat
   */
  addMarkers = lngLat => {
    const markers = clonedeep(this.state.markers);
    this.setState({
      markers: [
        ...markers,
        {
          position: {
            longitude: lngLat.lng,
            latitude: lngLat.lat,
          },
          focusMessage: '',
          draggable: true,
          index: markers.length,
        },
      ],
    });
  };

  /**
   * @description 地图事件
   * @returns {{click: click}}
   */
  amapEvents = () => {
    return {
      click: e => {
        const lngLat = e.lnglat;
        this.addMarkers(lngLat);
      },
    };
  };

  /**
   * @description markers 事件
   * @returns {{dblclick: dblclick, dragend: dragend}}
   */
  markersEvent = () => {
    return {
      dragend: e => {
        const markers = clonedeep(this.state.markers);
        const { index } = e.target.getExtData();
        const lngLat = e.lnglat;
        const newMarkers = markers.map(item => {
          if (item.index === index) {
            item.position = {
              longitude: lngLat.lng,
              latitude: lngLat.lat,
            };
            return item;
          }
          return item;
        });
        this.setState({ markers: newMarkers });
      },
      click: (e, marker) => {
        clearTimeout(this.markerClickTImeOut);
        this.markerClickTImeOut = setTimeout(() => {
          const Ext = marker.getExtData();
          const markersIndex = Ext.index;
          const { focusMessage } = Ext;
          this.setState({
            markersIndex,
            focusMessage,
          });
          this.handleMarkersModalVisible(true);
        }, 300);
      },
      dblclick: e => {
        clearTimeout(this.markerClickTImeOut);
        const markers = clonedeep(this.state.markers);
        const { index } = e.target.getExtData();
        markers.splice(index, 1);
        const newMarkers = markers.map((item, i) => {
          item.index = i;
          return item;
        });
        this.setState({ markers: newMarkers });
      },
    };
  };

  /**
   * @description 线事件
   * @returns {{click: click}}
   */
  polylineEvent = () => {
    return {
      click: e => {
        const lngLat = e.lnglat;
        this.addMarkers(lngLat);
      },
    };
  };

  handleAdd = fields => {
    const { markersIndex, markers } = this.state;
    const cloneMarkers = clonedeep(markers);
    const { focusMessage } = fields;
    const newMarkers = cloneMarkers.map(item => {
      if (item.index === markersIndex) {
        item.focusMessage = focusMessage;
        return item;
      }
      return item;
    });
    this.setState({
      markers: newMarkers,
    });
  };

  save = () => {
    const { dispatch, id, handleModalVisible } = this.props;
    const { markers } = this.state;

    const focusInfo = markers.map(item => {
      return {
        focusPoint: `${item.position.longitude},${item.position.latitude}`,
        focusMessage: item.focusMessage,
      };
    });

    dispatch({
      type: 'RoadInfo/addFocus',
      payload: {
        id,
        focusInfo: JSON.stringify(focusInfo),
      },
      callback: () => {
        message.success('添加成功');
        handleModalVisible();
      },
    });
  };

  render() {
    const { modalVisible, handleModalVisible, loading } = this.props;
    const { longitudeandlatitude, center, markers, markersModalVisible, focusMessage } = this.state;

    const polylineDom = longitudeandlatitude ? (
      <Polyline
        path={JSON.parse(longitudeandlatitude)}
        events={this.polylineEvent()}
        key="polylineDom"
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
    ) : null;

    const markersDom = <Markers key="markersDom" markers={markers} events={this.markersEvent()} />;

    return (
      <>
        <Modal
          destroyOnClose
          title="添加关注点"
          className={themeStyle.formModal}
          visible={modalVisible}
          width={700}
          onCancel={() => handleModalVisible()}
          footer={[
            <Button key="back" onClick={() => handleModalVisible()}>
              取消
            </Button>,
            <Button key="submit" type="primary" loading={loading} onClick={() => this.save()}>
              确定
            </Button>,
          ]}
        >
          <div className={themeStyle.formModalBody}>
            <div style={{ height: 400 }}>
              <BaseMap
                amapEvents={this.amapEvents()}
                center={center}
                children={[polylineDom, markersDom]}
              />
            </div>
          </div>
        </Modal>
        {markersModalVisible ? (
          <MarkersModal
            modalVisible={markersModalVisible}
            focusMessage={focusMessage}
            handleAdd={this.handleAdd}
            handleModalVisible={this.handleMarkersModalVisible}
          />
        ) : null}
      </>
    );
  }
}

export default AddFocus;
