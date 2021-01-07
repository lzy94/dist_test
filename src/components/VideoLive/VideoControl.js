import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Icon, message } from 'antd';
import styles from './video.less';

@connect(({ Live, loading }) => ({
  Live,
  loading: loading.models.Live,
}))
class VideoControl extends PureComponent {
  static defaultProps = {
    series: '',
  };

  ptzControl = command => {
    const { dispatch, serial } = this.props;
    if (serial) {
      // dispatch({
      //   type: 'Live/ys7Control',
      //   payload: {
      //     accessToken: 'at.c9rzems6df0qrq6s3r9usklr3lj6634y-8z4r6w7etg-1kvnjmv-z4y2p8i2t',
      //     deviceSerial: 'E27590109',
      //     channelNo: 1,
      //     direction: command,
      //     speed: 2,
      //   },
      // });
      // setTimeout(() => {
      //   dispatch({
      //     type: 'Live/ys7ControlStop',
      //     payload: {
      //       accessToken: 'at.c9rzems6df0qrq6s3r9usklr3lj6634y-8z4r6w7etg-1kvnjmv-z4y2p8i2t',
      //       deviceSerial: 'E27590109',
      //       channelNo: 1,
      //       direction: command,
      //     },
      //   });
      // }, 500);

      dispatch({
        type: 'Live/control',
        payload: {
          serial,
          command,
        },
        callback: () => {
          console.log('ok');
          message.success('操作成功-请等待视频变化后再次操作');
        },
      });
      if (command !== 'zoomout' && command !== 'zoomin') {
        setTimeout(() => {
          dispatch({
            type: 'Live/control',
            payload: {
              serial,
              command: 'stop',
            },
          });
        }, 300);
      }
    } else {
      message.error('失败-无设备编号');
    }
  };

  render() {
    return (
      <div className={styles.videoControl}>
        <Button onClick={() => this.ptzControl('zoomin')} size="small" shape="circle" icon="plus" />
        <div className={styles.TBZR}>
          <Button className={styles.center} disabled shape="circle" icon="drag" />
          <Icon
            onClick={() => this.ptzControl('up')}
            className={`${styles.controlBtn} ${styles.up}`}
            type="up"
          />
          <Icon
            onClick={() => this.ptzControl('right')}
            className={`${styles.controlBtn} ${styles.right}`}
            type="right"
          />
          <Icon
            onClick={() => this.ptzControl('down')}
            className={`${styles.controlBtn} ${styles.down}`}
            type="down"
          />
          <Icon
            onClick={() => this.ptzControl('left')}
            className={`${styles.controlBtn} ${styles.left}`}
            type="left"
          />
        </div>
        <Button
          onClick={() => this.ptzControl('zoomout')}
          size="small"
          shape="circle"
          icon="minus"
        />
      </div>
    );
  }
}

export default VideoControl;
