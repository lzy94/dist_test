import React, { Fragment, PureComponent } from 'react';
import { Table, Drawer, Icon, Tooltip, Tree, message, Empty, Spin, Tag, Button } from 'antd';
import { connect } from 'dva';

import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

import MyDyModalPublic from '@/components/MyDyModalPublic';
import VideoPlayer from '@/components/VideoLive/videoLive';
import style from './style.less';
import sheXiangTou from '@/assets/shexiangtou.png';
import shiPing from '@/assets/shiping.png';
import { liveUrl, socketUrl } from '@/utils/utils';

const { TreeNode } = Tree;

let stompClient = null;
@connect(({ TrafficApiV2BusData, Live, loading }) => ({
  Live,
  TrafficApiV2BusData,
  apiV2Loading: loading.models.TrafficApiV2BusData,
  loading: loading.models.Live,
}))

/**
 *
 * * @description 车辆实时监控
 */
class RealTime extends PureComponent {
  state = {
    treeList: [],
    selectedKeys: [],
    liveData: [], // 站点监控车道
    imgList: [], // 超限图片
    dataList: [],
    // detail: {}, // 详情
    drawerLiveVisible: false,
    drawerVisible: false,
    detailDrawerVisible: false,
    DynamicLoading: false,
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
      render: val => (val / 1000).toFixed(2) + ' t',
    },
    {
      title: '超载',
      width: 100,
      dataIndex: 'overLoad',
      render: val =>
        val > 0 ? (
          <Tag color="red">{(val / 1000).toFixed(2)} t</Tag>
        ) : (
          (val / 1000).toFixed(2) + ' t'
        ),
    },
    {
      title: '超重比',
      width: 100,
      dataIndex: 'overLoadRate',
      render: val =>
        val > 0.05 ? (
          <Tag color="red">{(val * 100).toFixed(2)} %</Tag>
        ) : (
          (val * 100).toFixed(2) + ' %'
        ),
    },
    {
      title: '操作',
      key: 'operation',
      width: 100,
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

  constructor(props) {
    super(props);
    this.liveIndex = 0; // 监控下标
    this.videoLeft = React.createRef();
    this.videoRight = React.createRef();
  }

  componentDidMount() {
    this.getTreeList();
  }

  componentWillUnmount() {
    this.closeSocket();
  }

  // 关闭socket
  closeSocket = () => {
    if (stompClient) {
      stompClient.disconnect();
      stompClient = null;
    }
  };

  initWebSocket = siteIds => {
    this.closeSocket();
    this.connection(siteIds);
  };

  onMessage = msg => {
    const { dataList, imgList } = this.state;
    const m = JSON.parse(msg.body);
    const newData = m.dynamicDataMsg;
    newData.key = new Date().getTime();
    const list = [newData, ...dataList];
    if (newData.totalLoad >= 10000) {
      const copyImgList = JSON.parse(JSON.stringify(imgList));
      if (copyImgList.length === 3) {
        // 当车辆总重>8000kg 添加到图片区域显示
        copyImgList.slice(2, 1);
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
  connection = siteIds => {
    const socket = new SockJS(socketUrl);
    stompClient = Stomp.over(socket);
    const headers = {
      Authorization: '',
    };
    // stompClient.debug = null;
    // 向服务器发起websocket连接
    stompClient.connect(
      headers,
      () => {
        message.success('连接建立成功');
        stompClient.subscribe(`/topic/${siteIds}`, this.onMessage);
      },
      err => {
        message.error('连接建立失败');
        console.log(err);
      },
    );
  };

  /**
   * 获取详情
   * @param res
   */
  // getDetail = res => {
  //   const { dispatch } = this.props;
  //   this.setState({ DynamicLoading: true });
  //   dispatch({
  //     type: 'Dynamic/detail',
  //     payload: {
  //       id: res.id,
  //     },
  //     callback: () => {
  //       this.closeDetailDrawerVisible(true);
  //     },
  //   });
  //   setTimeout(() => this.setState({ DynamicLoading: false }), 500);
  // };

  getDetail = res => {
    this.setState({ DynamicLoading: true });
    const { dispatch } = this.props;
    dispatch({
      type: 'TrafficApiV2BusData/dyDataDetail',
      payload: res.id,
      callback: () => {
        this.closeDetailDrawerVisible(true);
      },
    });
    setTimeout(() => this.setState({ DynamicLoading: false }), 500);
  };

  /**
   * 请求监控地址
   * @param params 通道号
   * @param callback
   */
  getLiveUrl = (params, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Live/fetch',
      payload: {
        channel: params,
      },
      callback: res => {
        if (res.Header.ErrorNum === '200') {
          callback(liveUrl + res.Body.URL);
          return;
        }
        message.error('路径调用失败');
      },
    });
  };

  /**
   * 树形菜单数据
   */
  getTreeList = () => {
    const { dispatch } = this.props;
    const siteIds = localStorage.getItem('siteIds') || '';
    dispatch({
      type: 'Live/userSite',
      payload: {
        siteIds: siteIds.split(','),
      },
      callback: res => {
        const treeList = this.formatTree(res);
        this.setState({ treeList });
      },
    });
  };

  /**
   * 格式化树形菜单数据
   * @param list
   * @returns {*}
   */
  formatTree = list => {
    return list.map((item, index) => {
      return {
        title: item.siteName,
        key: `${item.siteCode},${index}`,
        type: 0,
        children: [],
        child: item.sysMediaConfs.length ? this.sysMediaConfs(item.sysMediaConfs) : [],
      };
    });
  };

  /**
   * 媒体通道
   * @param list
   * @returns {*}
   */
  sysMediaConfs = list => {
    return list
      .map(item => {
        return {
          title: item.mediaName,
          key: `${item.id}-${item.lanNo}-${item.mediaNo}`,
          type: 1,
          children: [],
        };
      })
      .filter(item => item);
  };

  /**
   * 渲染树形列表
   * @param list
   * @returns {*}
   */
  renderTree = list => {
    return list.map(item => {
      let icon = null;
      if (item.type === 1) {
        icon = {
          icon: <img style={{ width: 15 }} src={sheXiangTou} alt="" />,
        };
      } else {
        icon = {
          icon: <img style={{ width: 15 }} src={shiPing} alt="" />,
        };
      }
      if (item.children.length) {
        return (
          <TreeNode {...icon} title={item.title} key={item.key} dataRef={item}>
            {this.renderTree(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...icon} {...item} key={item.key} />;
    });
  };

  /**
   * 选择树形监控列表
   * @param selectKeys
   * @param e
   */
  treeSelect = (selectKeys, e) => {
    const { treeList } = this.state;
    this.setState({ selectedKeys: selectKeys });
    if (!selectKeys.length) return;
    const value = selectKeys[0];
    if (/-/.test(value)) {
      // 点击站点下的车道 播放监控
      const NO = value.split('-')[2];
      this.getLiveUrl(NO, playerUrl => {
        this.playerLive(playerUrl);
        this.setState({ selectedKeys: [] });
        this.closeLiveDrawer();
      });
      return;
    }
    // 点击站点  启动站点 socket
    const index = value.split(',')[1]; // 获取站点监控列表
    this.setState({
      liveData: treeList[index].child, // 设置监控列表数据
    });
    this.closeDrawer();
    if (stompClient) {
      // 是否有连接
      stompClient.disconnect();
      stompClient = null;
    }
    this.initWebSocket(value.split(',')[0]);
  };

  /**
   * 根据图片区域下标渲染图片
   * @param index
   * @returns {*}
   */
  renderImgItem = index => {
    const { imgList } = this.state;
    if (!imgList.length) return;
    const newImgList = imgList[index];
    if (!newImgList) return;
    return (
      <Fragment>
        <div className={style.imgItem}>
          <p>车牌号：{newImgList.carNo}</p>
          <p>轴数：{newImgList.axleNumber}</p>
          <p>总重：{(newImgList.totalLoad / 1000).toFixed(2)} t</p>
          <p>超载：{newImgList.overLoad > 0 ? (newImgList.overLoad / 1000).toFixed(2) : 0} t</p>
          <p>超重比：{(newImgList.overLoadRate * 100).toFixed(2)} %</p>
        </div>
        <div className={style.imgItem}>
          <img src={newImgList.frontPic} alt="车辆正面" />
        </div>
        <div className={style.imgItem}>
          <img src={newImgList.backtPic} alt="车辆尾部" />
        </div>
        <div className={style.imgItem}>
          <img src={newImgList.leftPic} alt="车辆侧面" />
        </div>
      </Fragment>
    );
  };

  /**
   * 关闭站点抽屉
   */
  closeDrawer = flag => {
    this.setState({ drawerVisible: !!flag, selectedKeys: [] });
  };

  /**
   *
   * 关闭站点通道抽屉
   */
  closeLiveDrawer = flag => {
    this.setState({ drawerLiveVisible: !!flag, selectedKeys: [] });
  };

  closeDetailDrawerVisible = flag => {
    this.setState({ detailDrawerVisible: !!flag });
    if (!flag) {
      this.resetDetail();
    }
  };

  resetDetail = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'TrafficApiV2BusData/resetDetail',
    });
  };

  /**
   * 获取监控下标
   */
  setIndexPlayerLive = index => {
    this.liveIndex = index;
    this.closeLiveDrawer(true);
  };

  /**
   * 播放监控
   */
  playerLive = src => {
    const player = [this.videoLeft, this.videoRight];
    player[this.liveIndex].player.pause();
    player[this.liveIndex].player.src(src);
    // player[this.liveIndex].player.play();
  };

  render() {
    const {
      TrafficApiV2BusData: {
        dyDataDetail: { busDynamicLawDate },
      },
    } = this.props;
    const {
      drawerVisible,
      DynamicLoading,
      detailDrawerVisible,
      dataList,
      treeList,
      liveData,
      drawerLiveVisible,
      selectedKeys,
    } = this.state;

    return (
      <Spin spinning={DynamicLoading}>
        <div className={style.main}>
          {/* 站点选择 */}
          <div className={style.siteMenu} onClick={() => this.closeDrawer(true)}>
            <Tooltip title="站点">
              <Icon type="control" theme="filled" style={{ fontSize: 26 }} />
            </Tooltip>
          </div>
          <div className={style.carMain}>
            {/* 超载图片 》 8 */}
            <div className={style.carImg}>
              <div className={style.item}>{this.renderImgItem(0)}</div>
              <div className={style.item}>{this.renderImgItem(1)}</div>
              <div className={style.item}>{this.renderImgItem(2)}</div>
            </div>
          </div>
          <div className={style.videoMonitor}>
            <div className={style.table}>
              <Table
                size="small"
                dataSource={dataList}
                columns={this.columns}
                scroll={{ y: 300 }}
              />
            </div>
            <div className={style.Monitor}>
              <div className={style.item}>
                <div className={style.mask}>
                  <Icon
                    type="plus-circle"
                    onClick={() => this.setIndexPlayerLive(0)}
                    className={style.icon}
                  />
                  {/*<Icon onClick={() => this.closeVideo(this.videoLeft)} className={style.icon} type="close-circle"/>*/}
                </div>
                {/*//d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8*/}
                <VideoPlayer ref={e => (this.videoLeft = e)} src="" />
              </div>
              <div className={style.item}>
                <div className={style.mask}>
                  <Icon
                    type="plus-circle"
                    onClick={() => this.setIndexPlayerLive(1)}
                    className={style.icon}
                  />
                  {/*<Icon onClick={() => this.closeVideo(this.videoRight)} className={style.icon} type="close-circle"/>*/}
                </div>
                <VideoPlayer ref={e => (this.videoRight = e)} src="" />
              </div>
            </div>
          </div>

          <Drawer
            title="站点列表"
            width={320}
            placement="right"
            onClose={() => this.closeDrawer()}
            visible={drawerVisible}
          >
            {treeList.length ? (
              <Tree
                showLine
                showIcon
                selectedKeys={selectedKeys}
                // defaultExpandedKeys={siteCodeLists}
                onSelect={this.treeSelect}
              >
                {this.renderTree(treeList)}
              </Tree>
            ) : (
              <Empty />
            )}
          </Drawer>

          <Drawer
            title="站点监控"
            width={320}
            placement="right"
            onClose={() => this.closeLiveDrawer()}
            visible={drawerLiveVisible}
          >
            {liveData.length ? (
              <Tree
                showLine
                showIcon
                selectedKeys={selectedKeys}
                // defaultExpandedKeys={siteCodeLists}
                onSelect={this.treeSelect}
              >
                {this.renderTree(liveData)}
              </Tree>
            ) : (
              <Empty description="当前站点没有监控或者您没有选中站点" />
            )}
          </Drawer>
          {/*  详情抽屉  */}
          <Drawer
            title={busDynamicLawDate.carNo || ''}
            width={900}
            placement="right"
            onClose={() => this.closeDetailDrawerVisible()}
            visible={detailDrawerVisible}
          >
            {detailDrawerVisible && JSON.stringify(busDynamicLawDate) !== '{}' ? (
              <MyDyModalPublic detail={busDynamicLawDate} />
            ) : null}
          </Drawer>
        </div>
      </Spin>
    );
  }
}

export default RealTime;
