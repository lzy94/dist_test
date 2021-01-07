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
          <Descriptions column={3} size="small" layout="vertical" bordered>
            <Descriptions.Item label="单面名称">{detail.companyName}</Descriptions.Item>
            <Descriptions.Item label="法人代表">{detail.legalRepresentative}</Descriptions.Item>
            <Descriptions.Item label="联系方式">{detail.phone}</Descriptions.Item>
          </Descriptions>
        </Card>

        <Card bordered={false} style={cardMT}>
          <Descriptions title="检查详情" column={1} size="small" layout="vertical" bordered>
            <Descriptions.Item label="企业安全生产主体责任落实情况，所经营的船舶是否发生安全责任事故">{detail.securityIncident}</Descriptions.Item>
            <Descriptions.Item label="企业安全生产投入、安全生产培训及效果情况">{detail.safeProduction}</Descriptions.Item>
            <Descriptions.Item label="企业所设立的满足经营资质需要和安全管理要求的组织机构和人员是否保持">{detail.enterpriseOrgan}</Descriptions.Item>
            <Descriptions.Item label="企业所经营的船舶是否签订安全责任书并对船物履行安全生产指导">{detail.safetyGuidance}</Descriptions.Item>
            <Descriptions.Item label="是否接受船舶非法挂靠的经营行为">{detail.illegalCall}</Descriptions.Item>
            <Descriptions.Item label="企业是否按国家有关规定要求建立、实施并保持安全管理体系">{detail.managementSystem}</Descriptions.Item>
            <Descriptions.Item label="对所属船舶提供资源和岸基支持情况">{detail.resourceShore}</Descriptions.Item>
            <Descriptions.Item label="主要管理人员的资质保持情况">{detail.personnelQualification}</Descriptions.Item>
            <Descriptions.Item label="所属船舶是否持有运政部门核发的《船舶营业运输证》且是否有效">{detail.shipBusinessLicense}</Descriptions.Item>
            <Descriptions.Item label="安全教育培训制度及落实情况">{detail.educationTraining}</Descriptions.Item>
            <Descriptions.Item label="隐患排查记录整改情况">{detail.hiddenTroubleHooting}</Descriptions.Item>
            <Descriptions.Item label="发生事故重大险情或者被滞留情况">{detail.majorDanger}</Descriptions.Item>
            <Descriptions.Item label="应急预案及演习情况">{detail.emergencyPlan}</Descriptions.Item>
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
