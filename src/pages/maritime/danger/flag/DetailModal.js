import React, { PureComponent } from 'react';
import { Modal, Card, Descriptions } from 'antd';
import Zmage from 'react-zmage';
import { imgUrl } from '@/utils/utils';
import {
  formatMaritimeDanger,
  shipCertificate,
  crewCertificate,
  lifeasvingEquipment,
  fireEquipment,
  signalingEquipment,
  rudderSystem,
  anchorEquipment,
  mooring,
  cabin,
} from '@/utils/dictionaries';

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

  renderShipRules = (str, dictionaries = []) => {
    const list = formatMaritimeDanger(str, dictionaries);
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
          <Descriptions title="基本信息" size="small" layout="vertical" bordered>
            <Descriptions.Item label="船舶名称">{detail.shipName}</Descriptions.Item>
            <Descriptions.Item label="船舶所有人">{detail.shipOwner}</Descriptions.Item>
            <Descriptions.Item label="电话">{detail.phone}</Descriptions.Item>
          </Descriptions>
        </Card>

        <Card bordered={false} style={cardMT}>
          <h3 className={styles.title}>船舶证书</h3>
          <p className={styles.des}>船员服务薄持有情况：{}</p>
          <ul className={styles.list}>
            {this.renderShipRules(detail.shipCertificate, shipCertificate)}
          </ul>
        </Card>
        <Card bordered={false} style={cardMT}>
          <h3 className={styles.title}>船员证书</h3>
          <ul className={styles.list}>
            {this.renderShipRules(detail.crewCertificate, crewCertificate)}
          </ul>
        </Card>
        <Card bordered={false} style={cardMT}>
          <h3 className={styles.title}>救生设备</h3>
          <ul className={styles.list}>
            {this.renderShipRules(detail.lifeasvingEquipment, lifeasvingEquipment)}
          </ul>
        </Card>
        <Card bordered={false} style={cardMT}>
          <h3 className={styles.title}>消防设备</h3>
          <p className={styles.des}>灭火器的有效期：{detail.expirationDate}</p>
          <ul className={styles.list}>
            {this.renderShipRules(detail.fireEquipment, fireEquipment)}
          </ul>
        </Card>
        <Card bordered={false} style={cardMT}>
          <h3 className={styles.title}>信号设备</h3>
          <p className={styles.des}>信号灯的配备数量：{detail.semaphoreNumber}</p>
          <ul className={styles.list}>
            {this.renderShipRules(detail.signalingEquipment, signalingEquipment)}
          </ul>
        </Card>
        <Card bordered={false} style={cardMT}>
          <h3 className={styles.title}>舵系统</h3>
          <ul className={styles.list}>{this.renderShipRules(detail.rudderSystem, rudderSystem)}</ul>
        </Card>
        <Card bordered={false} style={cardMT}>
          <h3 className={styles.title}>锚设备</h3>
          <ul className={styles.list}>
            {this.renderShipRules(detail.anchorEquipment, anchorEquipment)}
          </ul>
        </Card>
        <Card bordered={false} style={cardMT}>
          <h3 className={styles.title}>系泊</h3>
          <ul className={styles.list}>{this.renderShipRules(detail.mooring, mooring)}</ul>
        </Card>
        <Card bordered={false} style={cardMT}>
          <h3 className={styles.title}>机舱</h3>
          <ul className={styles.list}>{this.renderShipRules(detail.cabin, cabin)}</ul>
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
