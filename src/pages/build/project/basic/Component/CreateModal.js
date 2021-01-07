import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Modal, message, Button, Card } from 'antd';
import MyForm from './MyForm';

import themeStyle from '@/pages/style/theme.less';

@connect(({ BuildProjectBasic, loading }) => ({
  BuildProjectBasic,
  loading: loading.models.BuildProjectBasic,
}))
class CreateModal extends PureComponent {
  static defaultProps = {
    modalVisible: false,
    handleModalVisible: () => {},
    modalCallback: () => {},
  };

  state = {
    field: {
      approvalPeriod: 0,
      bigBridge_1: 0,
      bigBridge_2: 0,
      bridgeTunnelRatio: 0,
      buildMileage: 0,
      buildUnit: '',
      constructionFee: 0,
      contractDuration: 0,
      contractPrice: 0,
      contractSection: 0,
      contractUnit: 0,
      designReview_1: '',
      designReview_2: '',
      designReview_3: null,
      designSpeed: 0,
      designUnit: '',
      engineeringBudget: 0,
      extraLargeBridge_1: 0,
      extraLargeBridge_2: 0,
      extraLongTunnel_1: 0,
      extraLongTunnel_2: 0,
      longTunnel_1: 0,
      longTunnel_2: 0,
      middleBridge_1: 0,
      middleBridge_2: 0,
      middleTunnel_1: 0,
      middleTunnel_2: 0,
      plannedStartTime: null,
      projectApproval_1: '',
      projectApproval_2: '',
      projectApproval_3: null,
      projectName: '',
      projectType: '',
      proposedDeliveryTime: null,
      shortTunnel_1: 0,
      shortTunnel_2: 0,
      subgradeWidth: 0,
      superContractSection: 0,
      superUnit: 0,
      workersApprove_1: '',
      workersApprove_2: '',
      workersApprove_3: null,
      workingDrawingReview_1: '',
      workingDrawingReview_2: '',
      workingDrawingReview_3: null,
    },
  };

  fieldChange = changedFields => {
    const key = Object.keys(changedFields).join();
    this.setState(({ field }) => ({
      field: {
        ...field,
        [key]:
          typeof changedFields[key] === 'object'
            ? moment(changedFields[key]).format('YYYY-MM-DD')
            : changedFields[key],
      },
    }));
  };

  save = () => {
    const { dispatch, handleModalVisible, modalCallback } = this.props;
    const { field } = this.state;
    const values = { ...field };
    values.projectApproval = `${field.projectApproval_1},${field.projectApproval_2},${field.projectApproval_3}`;
    values.workersApprove = `${field.workersApprove_1},${field.workersApprove_2},${field.workersApprove_3}`;
    values.designReview = `${field.designReview_1},${field.designReview_2},${field.designReview_3}`;
    values.workingDrawingReview = `${field.workingDrawingReview_1},${field.workingDrawingReview_2},${field.workingDrawingReview_3}`;

    values.extraLargeBridge = `${field.extraLargeBridge_1},${field.extraLargeBridge_2}`;
    values.bigBridge = `${field.bigBridge_1},${field.bigBridge_2}`;
    values.middleBridge = `${field.middleBridge_1},${field.middleBridge_2}`;

    values.extraLongTunnel = `${field.extraLongTunnel_1},${field.extraLongTunnel_2}`;
    values.longTunnel = `${field.longTunnel_1},${field.longTunnel_2}`;
    values.middleTunnel = `${field.middleTunnel_1},${field.middleTunnel_2}`;
    values.shortTunnel = `${field.shortTunnel_1},${field.shortTunnel_2}`;

    dispatch({
      type: 'BuildProjectBasic/add',
      payload: values,
      callback: () => {
        message.success('添加成功');
        this.resetField(() => {
          handleModalVisible();
          modalCallback();
        });
      },
    });
  };

  resetField = callback => {
    this.setState({ field: {} }, callback);
  };

  cancelClick = () => {
    const { handleModalVisible } = this.props;
    this.resetField(() => {
      handleModalVisible();
    });
  };

  render() {
    const { loading, modalVisible } = this.props;
    const { field } = this.state;
    return (
      <Modal
        destroyOnClose
        title="新建项目基本情况"
        className={themeStyle.formModal}
        visible={modalVisible}
        width={1200}
        onCancel={this.cancelClick}
        footer={[
          <Button key="back" onClick={this.cancelClick}>
            取消
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={this.save}>
            确定
          </Button>,
        ]}
      >
        <Card bordered={false}>
          <MyForm field={field} onChange={this.fieldChange} />
        </Card>
      </Modal>
    );
  }
}

export default CreateModal;
