import React, { PureComponent } from 'react';
import { Carousel, Col, Icon, Row } from 'antd';
import Zmage from 'react-zmage';
import { imgUrl } from '@/utils/utils';
import { BigPlayButton, LoadingSpinner, Player } from 'video-react';
import publicCss from '@/pages/style/public.less';
import themeStyle from '@/pages/style/theme.less';
import MyStatistic from '@/components/MyStatistic';

class DetailModal extends PureComponent {
  static defaultProps = {
    handleModalVisible: () => {},
  };

  constructor(props) {
    super(props);
    this.myCarousel = React.createRef();
  }

  componentDidMount() {}

  prevCarousel = () => {
    this.myCarousel.current.prev();
  };

  nextCarousel = () => {
    this.myCarousel.current.next();
  };

  renderImg = () => {
    const { detail } = this.props;
    const img = detail.imgUrl ? detail.imgUrl.split(',') : [];
    const imgs = img.map(item => ({
      src: imgUrl + item,
      alt: '',
    }));
    return imgs.map((item, index) => (
      <div key={item.src}>
        <Zmage
          backdrop="rgba(255,255,255,.3)"
          defaultPage={index}
          style={{ width: '100%', height: '400px' }}
          src={item.src}
          set={imgs}
        />
      </div>
    ));
  };

  render() {
    const { detail } = this.props;
    const danger = {
      background: '#FFD7D7',
      color: '#F75A5A',
    };

    return (
      <div className={themeStyle.detailMsg}>
        <div className={themeStyle.detailMsgTitle} style={{ marginTop: 16 }}>
          <Icon type="car" />
          &nbsp;车辆静态检测信息
        </div>
        <Row gutter={{ md: 8, lg: 8, xl: 16 }}>
          <Col md={12} sm={24}>
            <div className={themeStyle.videoImg}>
              <Player fluid={false} height={400} width="100%" src={detail.url} autoPlay>
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
                {this.renderImg()}
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
            <MyStatistic title="轴数" value={detail.axleNumber} suffex="轴" />
          </Col>
          <Col md={4}>
            <MyStatistic
              title="总重"
              value={((detail.totalLoad || 0) / 1000).toFixed(2)}
              suffex="t"
            />
          </Col>
          <Col md={4}>
            <MyStatistic
              title="超重"
              value={((detail.overLoad || 0) / 1000).toFixed(2)}
              suffex="t"
              bodyStyle={danger}
            />
          </Col>
          <Col md={4}>
            <MyStatistic
              title="超重比"
              value={((detail.overLoadRate || 0) * 1).toFixed(2)}
              suffex="%"
              bodyStyle={danger}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default DetailModal;
