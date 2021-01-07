import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Tree, Divider, Row, Col, message } from 'antd';
import VideoPlayer from '@/components/VideoLive/videoLive';
// import VodeoControl from '@/components/VideoLive/VideoControl';
import { liveUrl } from '@/utils/utils';
import liveCss from './videoLive.less';
import jiuPing from '@/assets/jiuping.png';
import siPing from '@/assets/siping.png';
import shiLiu from '@/assets/shiliu.png';
import sheXiangTou from '@/assets/shexiangtou.png';
import shiPing from '@/assets/shiping.png';

const { TreeNode } = Tree;

/* eslint react/no-multi-comp:0 */
@connect(({ Live, loading, user }) => ({
  Live,
  loading: loading.models.Live,
  currentUser: user.currentUser,
}))
class VideoIndex extends PureComponent {
  // liveNumber = [4, 9, 16];
  // colSpan = [12, 8, 6];
  // colHeight = ['50%', '33.33333%', '25%'];
  liveNumber = [2];
  colSpan = [12];
  colHeight = ['100%'];
  serialList = [];
  autoTouch = null;

  state = {
    treeList: [],
    livePathList: [],
    liveNumberIndex: 0,
    liveVideoList: [],
    selectLiveVideo: -1,
  };

  componentDidMount() {
    this.getTreeList();
  }

  componentWillUnmount() {
    this.clearAutoTouch();
  }

  clearAutoTouch = () => {
    if (this.autoTouch) {
      clearInterval(this.autoTouch);
    }
  };

  getLiveUrl = (serial, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Live/GBSPath',
      payload: { serial },
      callback: url => {
        callback(url);
      },
    });
  };

  getTreeList = () => {
    const { dispatch } = this.props;
    const itemSiteID = localStorage.getItem('siteIds');
    const siteIds = itemSiteID ? itemSiteID.split(',') : [];
    dispatch({
      type: 'Live/userSite',
      payload: {
        siteIds,
      },
      callback: res => {
        const treeList = this.formatTree(res);
        this.setState({ treeList });
      },
    });
  };

  renderTree = list => {
    return list.map((item, index) => {
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

  formatTree = list => {
    return list.map((item, index) => {
      return {
        title: item.siteName,
        key: item.id,
        type: 0,
        children: item.sysMediaConfs.length ? this.sysMediaConfs(item.sysMediaConfs) : [],
      };
    });
  };

  sysMediaConfs = list => {
    return list
      .map(item => {
        // if (item.lanNo === 500) {
        return {
          title: item.mediaName,
          key: `${item.id}-${item.lanNo}-${item.mediaNo}`,
          type: 1,
          children: [],
        };
        // }
      })
      .filter(item => item);

    // ({
    //   title: item.mediaName,
    //   key: item.id + '-' + item.lanNo + '-' + item.mediaNo,
    //   type: 1,
    //   children: [],
    // }));
  };

  // sysMediaConfs = list => list.map((item, index) => ({
  //   title: item.mediaName,
  //   key: item.id + '-' + item.lanNo + '-' + item.mediaNo,
  //   type: 1,
  //   children: [],
  // }));

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

  /**
   * 选择树形监控列表
   * @param selectKeys
   * @param e
   */
  treeSelect = (selectKeys, e) => {
    const { selectLiveVideo, liveVideoList, liveNumberIndex, livePathList } = this.state;
    this.clearAutoTouch();
    if (/-/.test(selectKeys[0])) {
      // 判断数据是否存在‘-’
      const keys = selectKeys[0].split('-');
      const { title } = e.selectedNodes[0].props;
      this.getLiveUrl(keys[2], res => {
        // if (livePathList.indexOf(res) > -1) return message.error(`已在播放列表中,播放位置：第${livePathList.indexOf(res) + 1}格`);
        if (selectLiveVideo === -1) {
          // 判断当前有选中的格子 -1 没有选中。如果没有选中按顺序添加视频，选中则将视频添加到已选中的格子中
          // 没有选中
          if (liveVideoList.length === this.liveNumber[liveNumberIndex])
            return message.error('播放位置已满');
          this.serialList.push(keys[2]);
          this.setState(
            {
              livePathList: [...livePathList, res],
              liveVideoList: [
                ...liveVideoList,
                {
                  title,
                  node: <VideoPlayer src={res} />,
                },
              ],
            },
            () => this.autoTouchFun(),
          );
        } else {
          // 已选中
          const arr = Object.assign([], liveVideoList);
          // 判断 当前选中的格子下表是否正在播放
          if (arr[selectLiveVideo]) {
            // 删除当前正在播放的视频
            delete arr[selectLiveVideo];
          }
          if (this.serialList[selectLiveVideo]) {
            delete this.serialList[selectLiveVideo];
          }
          // // 添加视频播放
          // arr[selectLiveVideo] = {
          //   title,
          //   node: <VideoPlayer src={res} />,
          // };
          this.setState(
            {
              livePathList: [...livePathList, res],
              liveVideoList: arr,
            },
            () => {
              const newList = Object.assign([], this.state.liveVideoList);
              this.serialList[selectLiveVideo] = keys[2];
              newList[selectLiveVideo] = {
                title,
                node: <VideoPlayer src={res} />,
              };
              this.setState({ liveVideoList: newList }, () => this.autoTouchFun());
            },
          );
        }
      });
    }
  };

  /**
   * 切换视频显示个数
   * @param e
   */
  // getScreen = e => {
  //   const { liveVideoList } = this.state;
  //   const newArr = Object.assign([], liveVideoList);
  //   if (liveVideoList.length > this.liveNumber[e]) {
  //     this.setState({ liveVideoList: newArr.slice(0, this.liveNumber[e]) });
  //   }
  //   this.setState({ liveNumberIndex: e, selectLiveVideo: -1 });
  // };

  /**
   * 获取视频、格子下标
   * @param e
   */
  getVideoCellIndex = e => {
    this.setState({ selectLiveVideo: e });
  };

  renderLive = () => {
    const { liveNumberIndex, liveVideoList, selectLiveVideo } = this.state;
    const arr = [];
    for (let i = 0; i < this.liveNumber[liveNumberIndex]; i++) {
      arr.push(
        <Col
          key={i}
          span={this.colSpan[liveNumberIndex]}
          style={{
            height: `calc(${this.colHeight[liveNumberIndex]} - 2px)`,
            marginBottom: 2,
            overflow: 'hidden',
          }}
        >
          <div
            className={liveCss.videoPanel + ' ' + (selectLiveVideo === i ? liveCss.showBorder : '')}
            style={{ height: '100%', background: '#000', position: 'relative' }}
          >
            <div className={liveCss.mask} onClick={() => this.getVideoCellIndex(i)}>
              <h3 className={liveCss.liveTitle}>
                {liveVideoList[i] ? liveVideoList[i].title : null}
              </h3>
            </div>
            {liveVideoList[i] ? liveVideoList[i].node : null}
          </div>
        </Col>,
      );
    }
    return arr;
  };

  render() {
    const { loading } = this.props;
    const { treeList } = this.state;
    return (
      <div className={liveCss.card}>
        <div className={liveCss.liveMain}>
          <div className={liveCss.leftTree}>
            {treeList.length ? (
              <Tree
                showLine
                showIcon
                // defaultExpandedKeys={siteCodeLists}
                onSelect={this.treeSelect}
              >
                {this.renderTree(treeList)}
              </Tree>
            ) : null}
          </div>
          <Divider style={{ height: 'auto' }} type="vertical" />
          <div className={liveCss.liveList}>
            <div className={liveCss.liveListCell}>
              <Row gutter={2} style={{ height: '100%' }}>
                {this.renderLive()}
              </Row>
            </div>
            {/* <div className={liveCss.liveToolBar}>
              <img src={shiLiu} alt="十六屏" onClick={() => this.getScreen(2)} />
              <img src={jiuPing} alt="九屏" onClick={() => this.getScreen(1)} />
              <img src={siPing} alt="四屏" onClick={() => this.getScreen(0)} />
            </div> */}
          </div>
          {/*<Divider style={{height: 'auto'}} type="vertical"/>*/}
          {/*<div className={liveCss.controlPanel}>*/}

          {/*</div>*/}
        </div>
      </div>
    );
  }
}

export default VideoIndex;
