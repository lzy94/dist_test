import React, { PureComponent } from 'react';
import { Modal, Card, Descriptions } from 'antd';
import Zmage from 'react-zmage';
import { imgUrl } from '@/utils/utils';
import { pumpShipRules, formatMaritimeDanger } from '@/utils/dictionaries';

import themeStyle from '@/pages/style/theme.less';
import styles from '../style.less';

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

  renderShipRules = str => {
    const list = formatMaritimeDanger(str, pumpShipRules);
    return list.map((item, i) => {
      return (
        <li key={i} className={item.isError ? styles.error : null}>
          {item.name}
        </li>
      );
    });
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
          <Descriptions size="small" layout="vertical" bordered>
            <Descriptions.Item label="趸船名称">{detail.pumpShipName}</Descriptions.Item>
            <Descriptions.Item label="所有人">{detail.shipOwner}</Descriptions.Item>
            <Descriptions.Item label="联系方式">{detail.phone}</Descriptions.Item>
            <Descriptions.Item label="停泊地点">{detail.parkingPlace}</Descriptions.Item>
            <Descriptions.Item label="用途">{detail.use}</Descriptions.Item>
            <Descriptions.Item label="趸船材质">{detail.pumpShipMaterial}</Descriptions.Item>
          </Descriptions>
          <Descriptions size="small" layout="vertical" bordered>
            <Descriptions.Item label="趸船参数" span={3}>
              长(m)：{detail.length}&nbsp;&nbsp;*&nbsp;&nbsp;宽(m)：{detail.width}
              &nbsp;&nbsp;*&nbsp;&nbsp;高(m)：{detail.height}&nbsp;&nbsp;*&nbsp;&nbsp;型深：
              {detail.deep}
            </Descriptions.Item>
          </Descriptions>
        </Card>
        <Card bordered={false} style={cardMT}>
          <Descriptions title="趸船系缆情况" column={2} size="small" layout="vertical" bordered>
            <Descriptions.Item label="首">{detail.pumpShipHead}</Descriptions.Item>
            <Descriptions.Item label="尾">{detail.pumpShipTail}</Descriptions.Item>
          </Descriptions>
        </Card>
        <Card bordered={false} style={cardMT}>
          <Descriptions title="锚口数" column={1} size="small" layout="vertical" bordered>
            <Descriptions.Item label="首">{detail.anchorHead}</Descriptions.Item>
            <Descriptions.Item label="链米及规格">{detail.chainRice}</Descriptions.Item>
            <Descriptions.Item label="尾">{detail.anchorTail}</Descriptions.Item>
          </Descriptions>
        </Card>
        <Card bordered={false} style={cardMT}>
          <Descriptions title="船舶运营详情" column={1} size="small" layout="vertical" bordered>
            <Descriptions.Item label="主要经营项目">
              {detail.shipOperationProject}
            </Descriptions.Item>
            <Descriptions.Item label="船舶检验证书薄情况">
              {detail.shipInspectionCertificate}
            </Descriptions.Item>
            <Descriptions.Item label="船舶防污设备齐全有效">
              {detail.antifoulingInstruments}
            </Descriptions.Item>
            <Descriptions.Item label="船舶配员情况">{detail.shipManning}</Descriptions.Item>
          </Descriptions>
        </Card>
        <Card bordered={false} style={cardMT}>
          {/* <Descriptions title="船舶规范详情" column={1} size="small" layout="vertical" bordered>
            <Descriptions.Item label="主要经营项目">
            </Descriptions.Item>
          </Descriptions> */}
          <h3 className={styles.title}>船舶规范详情</h3>
          <ul className={styles.list}>{this.renderShipRules(detail.shipRules)}</ul>
        </Card>
        <Card bordered={false} style={cardMT}>
          <Descriptions column={2} size="small" layout="vertical" bordered>
            <Descriptions.Item label="检查单位签字">
              {this.renderImg(detail.inspectors)}
            </Descriptions.Item>
            <Descriptions.Item label="检查人员签字">
              {this.renderImg(detail.inspectedPerson)}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Modal>
    );
  }
}
