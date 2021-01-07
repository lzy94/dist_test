import React, { PureComponent } from 'react';
import { Modal, Card, Descriptions } from 'antd';
import Zmage from 'react-zmage';
import { imgUrl } from '@/utils/utils';

import themeStyle from '@/pages/style/theme.less';

export default class DetailModal extends PureComponent {
  static defaultProps = {
    detail: {},
    modalVisible: false,
    handleModalVisible: () => {},
  };

  renderImg = item => {
    return (
      <Zmage
        backdrop="rgba(255,255,255,.3)"
        src={`${imgUrl}${item}`}
        alt="图片"
        style={{
          width: '200px',
          height: '200px',
        }}
      />
    );
  };

  render() {
    const { modalVisible, handleModalVisible, detail } = this.props;
    const cardMT = {
      marginTop: 5,
    };
    return (
      <Modal
        destroyOnClose
        title="详情"
        className={themeStyle.formModal}
        visible={modalVisible}
        onCancel={() => handleModalVisible()}
        footer={null}
        width={1000}
      >
        <Card bordered={false}>
          <Descriptions title="环境" column={1} size="small" layout="vertical" bordered>
            <Descriptions.Item label="是否存在漂浮物">{detail.floatingObject}</Descriptions.Item>
            <Descriptions.Item label="是否有沉船、采砂等碍航情况">
              {detail.obstructNavigation}
            </Descriptions.Item>
            <Descriptions.Item label="是否存在未按规定进行水上水下活动情形">
              {detail.waterActivity}
            </Descriptions.Item>
            <Descriptions.Item label="航路、锚地、停泊区、安全作业水域情况">
              {detail.operatingWaters}
            </Descriptions.Item>
          </Descriptions>
        </Card>
        <Card bordered={false} style={cardMT}>
          <Descriptions title="秩序" column={1} size="small" layout="vertical" bordered>
            <Descriptions.Item label="违反定线制、避碰规则、交通管理的航行行为">
              {detail.irregularities}
            </Descriptions.Item>
            <Descriptions.Item label="船名标识不齐">{detail.unidentified}</Descriptions.Item>
            <Descriptions.Item label="船体明显破损">{detail.hullDamage}</Descriptions.Item>
            <Descriptions.Item label="有超速、超越航线行驶">
              {detail.speedingBeyond}
            </Descriptions.Item>
            <Descriptions.Item label="船舶明显超载">{detail.overload}</Descriptions.Item>
            <Descriptions.Item label="未按规定停泊">{detail.notMooring}</Descriptions.Item>
          </Descriptions>
        </Card>
        <Card bordered={false} style={cardMT}>
          <Descriptions title="助导航标志" column={1} size="small" layout="vertical" bordered>
            <Descriptions.Item label="助导航标志设置情况">
              {detail.navigationMark}
            </Descriptions.Item>
            <Descriptions.Item label="航标附件未设置有碍航行安全或影响航标正常效能的灯光或音响装置">
              {detail.lightSound}
            </Descriptions.Item>
            <Descriptions.Item label="有没擅自设置或撤除的航标、改变航标的其他状况">
              {detail.brokenBeacon}
            </Descriptions.Item>
          </Descriptions>
        </Card>
        <Card bordered={false} style={cardMT}>
          <Descriptions title="交通安全标示" column={1} size="small" layout="vertical" bordered>
            <Descriptions.Item label="形状、尺寸、图案、反光和照明以及制作、设置和安装等符合标准要求">
              {detail.safatySigns}
            </Descriptions.Item>
            <Descriptions.Item label="文字应书写规范、正确、工整，颜色符合《安全色》相关要求">
              {detail.textRequirements}
            </Descriptions.Item>
            <Descriptions.Item label="设置位置、内容满足航道畅通和交通安全的目的，并符合标准相关要求">
              {detail.standardsCompliant}
            </Descriptions.Item>
            <Descriptions.Item label="外观完好，结构无损坏，位置无明显移位，附近未设置有碍正常效能的建筑物、构筑物或种植植物或其他障碍物">
              {detail.intactAppearance}
            </Descriptions.Item>
            <Descriptions.Item label="没有危害、破坏安全标志或影响其工作效能的行为">
              {detail.noHarm}
            </Descriptions.Item>
          </Descriptions>
        </Card>
        <Card bordered={false} style={cardMT}>
          <Descriptions
            title="安全措施与防污染措施"
            column={1}
            size="small"
            layout="vertical"
            bordered
          >
            <Descriptions.Item label="库区码头有无生活固体垃圾和液体生活废水回收装置">
              {detail.wastewaterRecovery}
            </Descriptions.Item>
            <Descriptions.Item label="是否有船舶非法排污行为">
              {detail.illegalSewage}
            </Descriptions.Item>
          </Descriptions>
        </Card>
        <Card bordered={false} style={cardMT}>
          <Descriptions column={2} size="small" layout="vertical" bordered>
            <Descriptions.Item label="检查人员签字">
              {this.renderImg(detail.inspectors)}
            </Descriptions.Item>
            <Descriptions.Item label="被检查人员签字">
              {this.renderImg(detail.inspectedPerson)}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Modal>
    );
  }
}
