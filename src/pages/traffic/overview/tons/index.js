import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Table, Tooltip, Button, Tag, message, Drawer, Spin, Skeleton } from 'antd';

import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

import MyDyModalPublic from '@/components/MyDyModalPublic';
import { socketUrl } from '@/utils/utils';

import styles from './index.less';

let stompClient = null;

@connect(({ TrafficApiV2BusData, Live, loading }) => ({
  Live,
  TrafficApiV2BusData,
  loading: loading.models.TrafficApiV2BusData,
}))
class Index extends PureComponent {
  state = {
    dataList: [],
    imgList: [],
    detailDrawerVisible: false,
  };

  columns = [
    {
      title: '站点名称',
      dataIndex: 'siteName',
      width: 200,
    },
    {
      title: '车牌号',
      dataIndex: 'carNo',
      width: 150,
    },
    {
      title: '轴数',
      dataIndex: 'axleNumber',
      width: 100,
    },
    {
      title: '总重',
      dataIndex: 'totalLoad',
      width: 100,
      render: val => `${(val / 1000).toFixed(2)} t`,
    },
    {
      title: '超载',
      width: 100,
      dataIndex: 'overLoad',
      render: val => (val > 0 ? <Tag color="red">{(val / 1000).toFixed(2)} t</Tag> : 0),
    },
    {
      title: '超重比',
      width: 100,
      dataIndex: 'overLoadRate',
      render: val =>
        val > 0.05 ? (
          <Tag color="red">{(val * 100).toFixed(2)} %</Tag>
        ) : (
          `${(val / 1000).toFixed(2)} %`
        ),
    },
    {
      title: '操作',
      key: 'operation',
      width: 10,
      render: (text, record) => (
        <Tooltip>
          <Button
            onClick={() => this.getDetail(record)}
            type="primary"
            shape="circle"
            icon="eye"
            size="small"
          />
        </Tooltip>
      ),
    },
  ];

  componentDidMount() {
    this.connection();
  }

  componentWillUnmount() {
    if (stompClient) {
      try {
        stompClient.disconnect();
        // eslint-disable-next-line no-empty
      } catch (error) {}
      stompClient = null;
    }
  }

  /**
   * 获取详情
   * @param res
   */
  getDetail = res => {
    const { dispatch } = this.props;
    dispatch({
      type: 'TrafficApiV2BusData/dyDataDetail',
      payload: res.id,
      callback: () => {
        this.closeDetailDrawerVisible(true);
      },
    });
  };

  onMessage = msg => {
    const { dataList, imgList } = this.state;
    const m = JSON.parse(msg.body);
    const newData = m.dynamicDataMsg;
    newData.key = new Date().getTime();
    const list = [newData, ...dataList];
    if (newData.totalLoad >= 100000) {
      const copyImgList = JSON.parse(JSON.stringify(imgList));
      if (copyImgList.length === 4) {
        copyImgList.slice(3, 1);
      }
      const newImgList = [newData, ...copyImgList];
      this.setState({ imgList: newImgList });
    }
    this.setState({
      dataList: list,
    });
  };

  /**
   * socket 连接
   */
  connection = () => {
    const siteIds = localStorage.getItem('siteIds');
    const socket = new SockJS(socketUrl);
    stompClient = Stomp.over(socket);
    const headers = {
      Authorization: '',
    };
    // stompClient.debug = null;s
    // 向服务器发起websocket连接
    stompClient.connect(
      headers,
      () => {
        // eslint-disable-next-line no-unused-expressions
        siteIds
          ? siteIds.split(',').map(item => {
              stompClient.subscribe(`/topic/${item}`, this.onMessage);
              return null;
            })
          : null;
      },
      () => {
        message.error('连接失败');
      },
    );
  };

  /**
   * 根据图片区域下标渲染图片
   * @param index
   * @returns {*}
   */
  renderImgItem = index => {
    const { imgList } = this.state;
    if (!imgList.length) return null;
    const newImgList = imgList[index];
    if (!newImgList) return null;
    return (
      <Fragment>
        <div className={styles.imgItem}>
          <p>站点名称：{newImgList.siteName}</p>
          <p>车牌号：{newImgList.carNo}</p>
          <p>轴数：{newImgList.axleNumber}</p>
          <p>总重：{(newImgList.totalLoad / 1000).toFixed(2)} t</p>
          <p>超载：{(newImgList.overLoad / 1000).toFixed(2)} t</p>
          <p>超重比：{(newImgList.overLoadRate * 100).toFixed(2)} %</p>
        </div>
        <div className={styles.imgItem}>
          <img src={newImgList.frontPic} alt="车辆正面" />
        </div>
        <div className={styles.imgItem}>
          <img src={newImgList.backtPic} alt="车辆尾部" />
        </div>
        <div className={styles.imgItem}>
          <img src={newImgList.leftPic} alt="车辆侧面" />
        </div>
      </Fragment>
    );
  };

  closeDetailDrawerVisible = flag => {
    this.setState({ detailDrawerVisible: !!flag });
  };

  render() {
    const {
      // Dynamic: { detail },
      TrafficApiV2BusData: {
        dyDataDetail: { busDynamicLawDate },
      },
      loading,
    } = this.props;
    const { dataList, detailDrawerVisible } = this.state;
    return (
      <div className={styles.main}>
        <div className={styles.photoList}>
          <div className={styles.photoItem}>{this.renderImgItem(0)}</div>
          <div className={styles.photoItem}>{this.renderImgItem(1)}</div>
          <div className={styles.photoItem}>{this.renderImgItem(2)}</div>
          <div className={styles.photoItem}>{this.renderImgItem(3)}</div>
        </div>
        <div className={styles.tableList}>
          <Table size="small" dataSource={dataList} columns={this.columns} scroll={{ y: 390 }} />
        </div>

        <Drawer
          title={busDynamicLawDate.carNo || ''}
          width={900}
          placement="right"
          onClose={() => this.closeDetailDrawerVisible()}
          visible={detailDrawerVisible}
        >
          <Spin spinning={loading}>
            {detailDrawerVisible && JSON.stringify(busDynamicLawDate) !== '{}' ? (
              <MyDyModalPublic detail={busDynamicLawDate} />
            ) : (
              <Skeleton active />
            )}
          </Spin>
        </Drawer>
      </div>
    );
  }
}

export default Index;
