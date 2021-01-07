import React from 'react';
import { connect } from 'dva';
import ReVideoLive from '@/components/VideoLive/videoLive';
import { Select, message } from 'antd';
import { BorderBox12, BorderBox7 } from '@jiaminghi/data-view-react';
import dataVPublic from '@/pages/style/dataV.less';
import styles from '../index.less';

const { Option } = Select;

@connect(({ Live, MaritimePoint, loading }) => ({
  Live,
  MaritimePoint,
  loading: loading.models.MaritimePoint,
}))
class VideoLive extends React.Component {
  constructor(props) {
    super(props);
    this.videoRef = React.createRef();
  }

  state = {
    name: '',
    code: '',
    oldList: [],
  };

  componentDidMount() {
    // this.getWaterList();
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      MaritimePoint: {
        data: { list },
      },
    } = prevProps;
    const { oldList } = prevState;
    if (JSON.stringify(list) !== JSON.stringify(oldList)) {
      this.initData(list);
    }
  }

  initData = list => {
    if (list.length) {
      this.setState({ oldList: list, name: list[0].addr, code: list[0].ponitCode });
      this.getDetail(list[0].ponitCode);
    }
  };

  /**
   * @description 水位点
   */
  // getWaterList = () => {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'MaritimePoint/fetch',
  //     payload: { page: 1, pageSize: 20, showTotal: true },
  //     callback: () => {
  //       const {
  //         MaritimePoint: { data },
  //       } = this.props;
  //       const { list } = data;
  //       if (list.length) {
  //         this.setState({ name: list[0].addr, code: list[0].ponitCode });
  //       }
  //     },
  //   });
  // };

  changeEvent = (code, e) => {
    this.setState({ code, name: e.props.children });
    this.getDetail(code);
  };

  getDetail = ponitCode => {
    const { dispatch } = this.props;
    dispatch({
      type: 'MaritimePoint/detail',
      payload: { ponitCode },
      callback: data => {
        const { roadMonitor } = data;
        if (!roadMonitor || !Object.keys(roadMonitor).length) {
          message.error('暂无监控');
        } else {
          this.getGBSPath(data.roadMonitor.serial);
        }
      },
    });
  };

  getGBSPath = serial => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Live/GBSPath',
      payload: { serial },
      callback: url => {
        this.videoRef.player.src(url);
        this.videoRef.player.play();
      },
    });
  };

  render() {
    const { name, code, oldList } = this.state;
    return (
      <BorderBox12 color={['#48A2B3']}>
        <div className={dataVPublic.search}>
          <div className={dataVPublic.itemTitle}>视频监控</div>
          <div className={dataVPublic.form}>
            <span>{name}</span>
            <Select
              size="small"
              value={code}
              dropdownMatchSelectWidth={false}
              style={{ width: '30%' }}
              onChange={this.changeEvent}
            >
              {oldList.map(item => (
                <Option value={item.ponitCode} key={item.ponitCode}>
                  {item.addr}
                </Option>
              ))}
            </Select>
          </div>
        </div>
        <div className={`${dataVPublic.chartPanel} ${styles.video}`}>
          <BorderBox7 color={['#019EFF']}>
            <ReVideoLive ref={e => (this.videoRef = e)} src="" />
          </BorderBox7>
        </div>
      </BorderBox12>
    );
  }
}

export default VideoLive;
