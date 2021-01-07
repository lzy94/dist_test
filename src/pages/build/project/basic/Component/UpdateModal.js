import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Modal, message, Button, Card, Spin } from 'antd';
import MyForm from './MyForm';

import themeStyle from '@/pages/style/theme.less';

@connect(({ BuildProjectBasic, loading }) => ({
  BuildProjectBasic,
  loading: loading.models.BuildProjectBasic,
}))
class UpdateModal extends PureComponent {
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

  componentDidMount() {
    this.getDetail();
  }

  splitFieldValue = (field, name) => {
    const arr = field.split(',');
    const obj = {};
    for (let i = 0; i < arr.length; i += 1) {
      obj[`${name}_${i + 1}`] = arr[i] === 'null' ? null : arr[i];
    }
    return obj;
  };

  getDetail = () => {
    const { dispatch, detailID } = this.props;
    dispatch({
      type: 'BuildProjectBasic/detail',
      payload: detailID,
      callback: detail => {
        const {
          projectApproval,
          workersApprove,
          designReview,
          workingDrawingReview,
          extraLargeBridge,
          bigBridge,
          middleBridge,
          extraLongTunnel,
          longTunnel,
          middleTunnel,
          shortTunnel,
        } = detail;
        const obj = {
          ...this.splitFieldValue(projectApproval, 'projectApproval'),
          ...this.splitFieldValue(workersApprove, 'workersApprove'),
          ...this.splitFieldValue(designReview, 'designReview'),
          ...this.splitFieldValue(workingDrawingReview, 'workingDrawingReview'),
          ...this.splitFieldValue(extraLargeBridge, 'extraLargeBridge'),
          ...this.splitFieldValue(bigBridge, 'bigBridge'),
          ...this.splitFieldValue(middleBridge, 'middleBridge'),
          ...this.splitFieldValue(extraLongTunnel, 'extraLongTunnel'),
          ...this.splitFieldValue(longTunnel, 'longTunnel'),
          ...this.splitFieldValue(middleTunnel, 'middleTunnel'),
          ...this.splitFieldValue(shortTunnel, 'shortTunnel'),
        };

        this.setState({
          field: {
            ...detail,
            ...obj,
          },
        });
      },
    });
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
    const { dispatch, modalCallback } = this.props;
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
        message.success('编辑成功');
        this.cancelClick();
        modalCallback('edit');
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
        title="修改项目基本情况"
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
          <Spin spinning={loading}>
            <MyForm field={field} onChange={this.fieldChange} />
          </Spin>
        </Card>
      </Modal>
    );
  }
}

export default UpdateModal;
