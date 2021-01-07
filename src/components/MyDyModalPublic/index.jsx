import React, { Component } from 'react';
import Zmage from 'react-zmage';
import { Carousel, Col, Icon, Row } from 'antd';
import { BigPlayButton, LoadingSpinner, Player } from 'video-react';
import MyStatistic from '@/components/MyStatistic';
import publicCss from '@/pages/style/public.less';
import themeStyle from '@/pages/style/theme.less';

export default class MyDyModalPublic extends Component {
  constructor(props) {
    super(props);
    this.myCarousel = React.createRef();
  }

  prevCarousel = () => {
    this.myCarousel.current.prev();
  };

  nextCarousel = () => {
    this.myCarousel.current.next();
  };

  render() {
    const { detail, isTitle } = this.props;

    const danger = {
      background: '#FFD7D7',
      color: '#F75A5A',
    };

    const primary = {
      background: '#D7E1FD',
      color: '#6678FF',
    };

    const imgs = [
      {
        src: detail.frontPic,
        alt: '前抓拍图片',
      },
      {
        src: detail.frontPic2,
        alt: '前抓拍图片',
      },
      {
        src: detail.backtPic,
        alt: '车尾抓拍图片',
      },
      {
        src: detail.backtPic2,
        alt: '车尾抓拍图片',
      },
      {
        src: detail.leftPic,
        alt: '左侧抓拍图片',
      },
      {
        src: detail.rightPic,
        alt: '右侧抓拍图片',
      },
      {
        src: detail.secreemPic,
        alt: '大屏抓拍图片',
      },
      {
        src: detail.wholePic,
        alt: '全景抓拍图片',
      },
      {
        src: detail.wholePic2,
        alt: '全景抓拍图片',
      },
    ].filter(item => item.src);
    const img = imgs.map((item, index) => {
      return (
        <div key={item}>
          <Zmage
            backdrop="rgba(255,255,255,.3)"
            defaultPage={index}
            style={{ width: '100%', height: '400px' }}
            src={item.src}
            set={imgs}
          />
        </div>
      );
    });
    // const videoPath = `${videoUrl}dynamic/vedio/${detail.siteCode}/${moment(
    //   detail.previewTime,
    // ).format('YYYY/M/D')}/${detail.previewCode}.mp4`;
    const videoPath = detail.picPath;
    return (
      <div className={themeStyle.detailMsg}>
        {isTitle ? (
          <div className={themeStyle.detailMsgTitle} style={{ marginTop: 16 }}>
            <Icon type="car" />
            &nbsp;车辆动态检测信息
          </div>
        ) : null}
        <Row gutter={{ md: 8, lg: 8, xl: 16 }}>
          <Col md={12} sm={24}>
            <div className={themeStyle.videoImg}>
              <Player fluid={false} height={400} width="100%" src={videoPath} autoPlay>
                <BigPlayButton position="center" />
                <LoadingSpinner />
              </Player>
            </div>
          </Col>
          <Col md={12} sm={24}>
            <div className={themeStyle.videoImg}>
              <Icon
                theme="filled"
                type="left-circle"
                className={publicCss.carouselIcon}
                onClick={() => this.prevCarousel()}
              />
              <Carousel
                autoplay
                dotPosition="bottom"
                className={publicCss.carousel}
                ref={this.myCarousel}
              >
                {img}
              </Carousel>
              <Icon
                theme="filled"
                type="right-circle"
                className={`${publicCss.carouselIcon} ${publicCss.next}`}
                onClick={() => this.nextCarousel()}
              />
            </div>
          </Col>
        </Row>

        <Row style={{ marginTop: 25, padding: '0 30px 15px' }} gutter={40}>
          <Col md={4}>
            <MyStatistic
              title="轴型"
              value={
                detail.truckCode
                  ? detail.truckCode === '未知'
                    ? '未知'
                    : detail.truckCode.split('-')[0]
                  : '未知'
              }
            />
            <MyStatistic title="轴数" value={detail.axleNumber} />
            <MyStatistic
              title="轴距"
              value={parseInt(detail.wheelbase || 0, 10).toLocaleString()}
              suffex="mm"
            />
          </Col>
          <Col md={4}>
            <MyStatistic title="速度" value={detail.speed} suffex="km/h" />
            <MyStatistic title="超速" value={detail.overSpeed} suffex="km/h" bodyStyle={danger} />
            <MyStatistic
              title="超速比"
              value={((detail.overSpeedRate || 0) * 100).toFixed(2)}
              suffex="%"
              bodyStyle={danger}
            />
          </Col>
          <Col md={4}>
            <MyStatistic title="总重" value={(detail.totalLoad / 1000).toFixed(2)} suffex="t" />
            <MyStatistic
              title="超重"
              value={(detail.overLoad / 1000).toFixed(2)}
              suffex="t"
              bodyStyle={danger}
            />
            <MyStatistic
              title="超重比"
              value={(detail.overLoadRate * 100).toFixed(2)}
              suffex="%"
              bodyStyle={danger}
            />
          </Col>

          <Col md={4}>
            <MyStatistic
              title="宽"
              value={(detail.width / 100).toFixed(2)}
              suffex="m"
              bodyStyle={primary}
            />
            <MyStatistic title="超宽" value={(detail.overWidth / 100).toFixed(2)} suffex="m" />
          </Col>
          <Col md={4}>
            <MyStatistic
              title="高"
              value={(detail.high / 100).toFixed(2)}
              suffex="m"
              bodyStyle={primary}
            />
            <MyStatistic title="超高" value={(detail.overHigh / 100).toFixed(2)} suffex="m" />
          </Col>
          <Col md={4}>
            <MyStatistic
              title="长"
              value={(detail.length / 100).toFixed(2)}
              suffex="m"
              bodyStyle={primary}
            />
            <MyStatistic title="超长" value={(detail.overLength / 100).toFixed(2)} suffex="m" />
          </Col>
        </Row>
      </div>
    );
  }
}
