import React, { PureComponent } from 'react';
import { Modal, Card, Descriptions } from 'antd';
import Zmage from 'react-zmage';
import { imgUrl } from '@/utils/utils';
import {
  formatMaritimeDanger,
  overallInspection,
  checkingShipCertificate,
  shipInspectionCertificate,
  shipInstruments,
  crewPaperwork,
  antifoulingInstruments,
  crewConfiguration,
  shipEntryReport,
  focusShips,
  sailing,
  cargoCustomerSituation,
  checkingMooring,
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
          <h3 className={styles.title}>总体检查</h3>
          <ul className={styles.list}>
            {this.renderShipRules(detail.overallInspection, overallInspection)}
          </ul>
        </Card>
        <Card bordered={false} style={cardMT}>
          <Descriptions column={1} title="证书检查" size="small" layout="vertical" bordered>
            <Descriptions.Item label="船舶证书">
              <ul className={styles.list}>
                {this.renderShipRules(detail.shipCertificate, checkingShipCertificate)}
              </ul>
            </Descriptions.Item>
            <Descriptions.Item label="船舶检验证书">
              <ul className={styles.list}>
                {this.renderShipRules(detail.shipInspectionCertificate, shipInspectionCertificate)}
              </ul>
            </Descriptions.Item>
            <Descriptions.Item label="船舶文书">
              <ul className={styles.list}>
                {this.renderShipRules(detail.shipInstruments, shipInstruments)}
              </ul>
            </Descriptions.Item>
            <Descriptions.Item label="船员文书">
              <ul className={styles.list}>
                {this.renderShipRules(detail.crewPaperwork, crewPaperwork)}
              </ul>
            </Descriptions.Item>
            <Descriptions.Item label="防污文书">
              <ul className={styles.list}>
                {this.renderShipRules(detail.antifoulingInstruments, antifoulingInstruments)}
              </ul>
            </Descriptions.Item>
          </Descriptions>
        </Card>
        <Card bordered={false} style={cardMT}>
          <h3 className={styles.title}>船员配置</h3>
          <ul className={styles.list}>
            {this.renderShipRules(detail.crewConfiguration, crewConfiguration)}
          </ul>
        </Card>
        <Card bordered={false} style={cardMT}>
          <h3 className={styles.title}>船舶进出港报告</h3>
          <ul className={styles.list}>
            {this.renderShipRules(detail.shipEntryReport, shipEntryReport)}
          </ul>
        </Card>
        <Card bordered={false} style={cardMT}>
          <h3 className={styles.title}>重点跟踪船舶</h3>
          <ul className={styles.list}>{this.renderShipRules(detail.focusShips, focusShips)}</ul>
        </Card>
        <Card bordered={false} style={cardMT}>
          <h3 className={styles.title}>载客、载货情况</h3>
          <ul className={styles.list}>
            {this.renderShipRules(detail.cargoCustomerSituation, cargoCustomerSituation)}
          </ul>
        </Card>
        <Card bordered={false} style={cardMT}>
          <h3 className={styles.title}>航行</h3>
          <ul className={styles.list}>{this.renderShipRules(detail.sailing, sailing)}</ul>
        </Card>
        <Card bordered={false} style={cardMT}>
          <h3 className={styles.title}>停泊</h3>
          <ul className={styles.list}>{this.renderShipRules(detail.mooring, checkingMooring)}</ul>
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
