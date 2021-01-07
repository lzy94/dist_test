import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Spin, Pagination, Empty, message, Icon } from 'antd';
import { getPlanObject } from '@/utils/dictionaries';
import VideoLive from '@/components/VideoLive/videoLive';

import styles from './style.less';
import jiuPing from '@/assets/jiuping.png';
import siPing from '@/assets/siping.png';
import shiLiu from '@/assets/shiliu.png';

let planObj = [[], []];

/* eslint react/no-multi-comp:0 */
@connect(({ Live, ConserveMonitor, loading }) => ({
  Live,
  ConserveMonitor,
  loading: loading.models.ConserveMonitor,
}))
@Form.create()
class Video extends PureComponent {
  // eslint-disable-next-line react/sort-comp
  constructor(props) {
    super(props);
    planObj = this.getNewPlanObject();
    this.autoTouch = null;
    this.serialList = [];
    this.fullNumber = [4, 9, 16];
  }

  state = {
    index: -1,
    fullIndex: 0,
    liveVideoList: [],
    formValue: [],
    defaultQuery: {},
    pageBean: { page: 1, pageSize: 15, showTotal: true },
  };

  componentDidMount() {
    const { pageBean } = this.state;
    const defaultQuery = {
      property: 'ponitObj',
      value: planObj[0],
      group: 'main',
      operation: 'IN',
      relation: 'AND',
    };
    this.getList({ pageBean, querys: [defaultQuery] });
    this.setState({ defaultQuery });
  }

  componentWillUnmount() {
    this.clearAutoTouch();
  }

  clearAutoTouch = () => {
    if (this.autoTouch) {
      clearInterval(this.autoTouch);
    }
  };

  getNewPlanObject = () => {
    const planObjects = getPlanObject();
    const [planObject, planObjectNumber] = [planObjects[1], planObjects[0]];
    if (planObject.indexOf('路政') > -1) {
      planObject.splice(planObject.indexOf('路政'), 1);
    }
    if (planObjectNumber.indexOf(-1) > -1) {
      planObjectNumber.splice(planObjectNumber.indexOf(-1), 1);
    }
    return [planObjectNumber, planObject];
  };

  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ConserveMonitor/fetch',
      payload: params,
    });
  };

  getVideoUrl = (serial, pointName) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Live/GBSPath',
      payload: { serial },
      callback: url => {
        this.setLiveVideo(url, pointName, serial);
      },
    });
  };

  getTouch = serial => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Live/touch',
      payload: { serial },
    });
  };

  autoTouchFun = () => {
    this.autoTouch = setInterval(() => {
      for (let i = 0; i < this.serialList.length; i += 1) {
        this.getTouch(this.serialList[i]);
      }
    }, 12000);
  };

  setLiveVideo = (url, pointName, serial) => {
    const { liveVideoList, index, fullIndex } = this.state;
    this.clearAutoTouch();
    if (index === -1) {
      if (liveVideoList.length < this.fullNumber[fullIndex]) {
        this.serialList.push(serial);
        this.setState(
          {
            liveVideoList: [
              ...liveVideoList,
              {
                title: pointName,
                node: <VideoLive src={url} />,
              },
            ],
          },
          () => this.autoTouchFun(),
        );
      } else {
        message.error('没有播放位置');
      }
    } else {
      const newList = Object.assign([], liveVideoList);
      if (newList[index]) {
        delete newList[index];
      }
      if (this.serialList[index]) {
        delete this.serialList[index];
      }
      this.setState({ liveVideoList: newList }, () => {
        const newLists = Object.assign([], this.state.liveVideoList);
        this.serialList[index] = serial;
        newLists[index] = {
          title: pointName,
          node: <VideoLive src={url} />,
        };
        this.setState({ liveVideoList: newLists, index: -1 }, () => this.autoTouchFun());
      });
    }
  };

  /**
   * @description 分页
   * @param page
   * @param pageSize
   */
  paginationChange = (page, pageSize) => {
    const { formValue, defaultQuery } = this.state;
    this.getList({
      pageBean: {
        page,
        pageSize,
        showTotal: true,
      },
      querys: [...formValue, defaultQuery],
    });
  };

  search = value => {
    const { pageBean, defaultQuery } = this.state;
    const arr = [
      {
        property: 'pointName',
        value,
        group: 'main',
        operation: 'LIKE',
        relation: 'AND',
      },
    ].filter(item => item.value);
    this.setState({ formValue: arr });
    this.getList({ pageBean, querys: [...arr, defaultQuery] });
  };

  itemClick = item => {
    const { serial, pointName } = item;
    this.getVideoUrl(serial, pointName);
  };

  /**
   * @description 渲染公路
   * @returns {*}
   */
  renderList = () => {
    const {
      ConserveMonitor: { data },
    } = this.props;
    // const { id } = this.state;
    if (!data.list.length) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    return data.list.map(item => {
      const option = !item.cameraStatus
        ? {
            className: styles.disable,
          }
        : { className: styles.nomal, onClick: () => this.itemClick(item) };

      return (
        <li
          // className={id === item.id_ ? styles.active : null}
          key={item.id_}
          {...option}
          // className={!item.cameraStatus ? styles.nomal : styles.disable}
          // onClick={() => this.itemClick(item)}
        >
          {item.pointName}
          <span />
        </li>
      );
    });
  };

  renderLive = () => {
    const { liveVideoList, index, fullIndex } = this.state;
    const arr = [];
    for (let i = 0; i < this.fullNumber[fullIndex]; i += 1) {
      arr.push(
        <div
          key={i}
          className={`${styles.videoCell} ${
            fullIndex === 0 ? styles.videoCell : fullIndex === 1 ? styles.nine : styles.sixteen
          }`}
        >
          <div className={`${styles.video} ${index === i ? styles.selectCell : null}`}>
            <div className={styles.mask} onClick={() => this.getIndex(i)}>
              <div className={styles.title}>
                {liveVideoList[i] ? liveVideoList[i].title : null}
                {/* <Icon
                  onClick={() => this.videoClose(i)}
                  style={{ fontSize: 18 }}
                  className={styles.close}
                  type="close-circle"
                /> */}
              </div>
            </div>
            {liveVideoList[i] ? liveVideoList[i].node : null}
          </div>
        </div>,
      );
    }
    return arr;
  };

  getIndex = index => {
    this.setState({ index });
  };

  // fullscreen = false;

  handleFullScreen = () => {
    const element = document.documentElement;
    if (this.fullscreen) {
      // if (document.exitFullscreen) {
      //   document.exitFullscreen();
      // } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
      // } else if (document.mozCancelFullScreen) {
      //   document.mozCancelFullScreen();
      // } else if (document.msExitFullscreen) {
      //   document.msExitFullscreen();
      // }
      console.log('已还原！');
    } else {
      // 否则，进入全屏
      // if (element.requestFullscreen) {
      //   element.requestFullscreen();
      // } else if (element.webkitRequestFullScreen) {
      element.webkitRequestFullScreen();
      // } else if (element.mozRequestFullScreen) {
      //   element.mozRequestFullScreen();
      // } else if (element.msRequestFullscreen) {
      //   // IE11
      //   element.msRequestFullscreen();
      // }
      console.log('已全屏！');
    }
    // // 改变当前全屏状态
    this.fullscreen = !this.fullscreen;
  };

  getFullIndex = e => {
    const { liveVideoList } = this.state;
    let newList = [...liveVideoList];
    if (liveVideoList.length > this.fullNumber[e]) {
      newList = newList.slice(0, e);
    }
    this.setState({ fullIndex: e, liveVideoList: newList });
  };

  // videoClose = index => {
  //   // const { liveVideoList } = this.state;
  //   // const newList = Object.assign([], liveVideoList);
  //   // newList.splice(0, index, null);
  //   // this.setState({ index, liveVideoList: newList });
  // };

  render() {
    const {
      loading,
      ConserveMonitor: { data },
    } = this.props;
    return (
      <div className={styles.videoPage}>
        <div className={styles.left}>
          <div className={styles.search}>
            <Input.Search
              placeholder="请输入路段名称"
              onSearch={this.search}
              style={{ width: '100%' }}
            />
          </div>
          <div className={styles.listMain}>
            <Spin spinning={loading}>
              <ul className={styles.list}>{this.renderList()}</ul>
            </Spin>
          </div>
          <div className={styles.pagination}>
            <Pagination
              size="small"
              simple
              total={data.pagination.total}
              pageSize={15}
              onChange={this.paginationChange}
            />
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.header}>
            分屏：
            <div className={styles.tool}>
              <img width={20} src={siPing} alt="" onClick={() => this.getFullIndex(0)} />
              <img width={20} src={jiuPing} alt="" onClick={() => this.getFullIndex(1)} />
              <img width={20} src={shiLiu} alt="" onClick={() => this.getFullIndex(2)} />

              {/* <img src={shiLiu} alt="" onClick={this.handleFullScreen} /> */}
            </div>
          </div>
          <div className={styles.videoMain}>{this.renderLive()}</div>
        </div>
      </div>
    );
  }
}
export default Video;
