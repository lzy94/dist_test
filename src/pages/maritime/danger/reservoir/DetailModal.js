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
          <Descriptions title="机构" column={1} size="small" layout="vertical" bordered>
            <Descriptions.Item label="有专门的机构、配备了专门管理人员、人员职责明确、人员的经费有保障">
              {detail.proOrgan}
            </Descriptions.Item>
          </Descriptions>
        </Card>
        <Card bordered={false} style={cardMT}>
          <Descriptions title="基础台账" column={1} size="small" layout="vertical" bordered>
            <Descriptions.Item label="辖区渡口、船舶、船员记录台账">
              {detail.recordLedger}
            </Descriptions.Item>
          </Descriptions>
        </Card>
        <Card bordered={false} style={cardMT}>
          <Descriptions title="安全制度" column={1} size="small" layout="vertical" bordered>
            <Descriptions.Item label="建立了船舶管理机构安全责任制，与船主、村（居委会）、签单员签订安全目标管理责任书">
              {detail.managementRespon}
            </Descriptions.Item>
            <Descriptions.Item label="建立了安全检查制度，并有相关检查工作台账记录">
              {detail.securitySystem}
            </Descriptions.Item>
            <Descriptions.Item label="建立隐患整改制度，并严格执行">
              {detail.rectificaSystem}
            </Descriptions.Item>
            <Descriptions.Item label="建立客渡船舶签单发航管理制度，并严格执行">
              {detail.shipManagementSystem}
            </Descriptions.Item>
            <Descriptions.Item label="建立安全值守制度，并有相关值守工作记录">
              {detail.safeDutySystem}
            </Descriptions.Item>
            <Descriptions.Item label="建立安全教育培训制度，并有相关教育培训工作记录">
              {detail.educationTrainingSystem}
            </Descriptions.Item>
            <Descriptions.Item label="建立信息传递机制，并有相关气象水文传递信息记录">
              {detail.informationTransferMechanism}
            </Descriptions.Item>
          </Descriptions>
        </Card>
        <Card bordered={false} style={cardMT}>
          <Descriptions title="应急与演练" column={1} size="small" layout="vertical" bordered>
            <Descriptions.Item label="制定了安全与防污染应急预案">
              {detail.emergencyPlan}
            </Descriptions.Item>
            <Descriptions.Item label="有应急演练记录与总结">
              {detail.recordSummary}
            </Descriptions.Item>
          </Descriptions>
        </Card>
        <Card bordered={false} style={cardMT}>
          <Descriptions title="日常安全管理" column={1} size="small" layout="vertical" bordered>
            <Descriptions.Item label="有年度安全资金投入记录">{detail.safeMoney}</Descriptions.Item>
            <Descriptions.Item label="配置了一定量的安全应急物资">
              {detail.safetyEmergencySupplies}
            </Descriptions.Item>
            <Descriptions.Item label="水域分布图、组织体系图、工作岗位职责、船舶动态情况、安全制度上墙情况">
              {detail.institutionalWall}
            </Descriptions.Item>
            <Descriptions.Item label="每月召开一次安全例会，船管站人员、村（社）干部、签单员参加，有相应记录">
              {detail.regularMeeting}
            </Descriptions.Item>
            <Descriptions.Item label="安全档案齐备">{detail.securityFile}</Descriptions.Item>
            <Descriptions.Item label="积极开展安全教育宣传">
              {detail.safetyEducation}
            </Descriptions.Item>
          </Descriptions>
        </Card>
        <Card bordered={false} style={cardMT}>
          <Descriptions column={2} size="small" layout="vertical" bordered>
            <Descriptions.Item label="督查人员签字">
              {this.renderImg(detail.inspectors)}
            </Descriptions.Item>
            <Descriptions.Item label="管船机构签字">
              {this.renderImg(detail.inspectedPerson)}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Modal>
    );
  }
}
