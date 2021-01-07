import React, { PureComponent } from 'react';
import themeStyle from '@/pages/style/theme.less';
import { Col, Row } from 'antd';
import MyStatistic from '@/components/MyStatistic';
import Zmage from 'react-zmage';
import { imgUrl } from '@/utils/utils';

class MyStaticModalPublic extends PureComponent {
  render() {
    const { detail } = this.props;
    const danger = {
      background: '#FFD7D7',
      color: '#F75A5A',
    };
    return (
      <div className={themeStyle.detailMsg}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <MyStatistic title="轴数" value={detail.axleNumber} suffex="轴" />
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
          <Col md={18} sm={24}>
            <div style={{ background: '#000', minHeight: '200px' }}>
              <Zmage
                backdrop="rgba(255,255,255,.3)"
                style={{ width: '100%' }}
                src={imgUrl + detail.imgUrl}
                alt="图片"
              />
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
export default MyStaticModalPublic;
