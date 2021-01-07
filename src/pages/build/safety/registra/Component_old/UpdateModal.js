import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Modal, Button, Form, Input, DatePicker, message, InputNumber } from 'antd';

import themeStyle from '@/pages/style/theme.less';

const FormItem = Form.Item;

@connect(({ BuildSafetyRegistra, loading }) => ({
  BuildSafetyRegistra,
  loading: loading.models.BuildSafetyRegistra,
}))
@Form.create()
class CreateModal extends PureComponent {
  static defaultProps = {
    dtail: {},
    modalVisible: false,
    handleModalVisible: () => {},
    modalCallback: () => {},
  };

  state = { detail: {}, isSet: false };

  static getDerivedStateFromProps(props, state) {
    const { detail } = props;
    const { isSet } = state;
    if (!isSet) {
      return {
        isSet: !isSet,
        detail,
      };
    }
    return null;
  }

  save = () => {
    const { dispatch, form, modalCallback } = this.props;
    const { detail } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...detail,
      };

      const keys = Object.keys(fieldsValue);
      for (let i = 0; i < keys.length; i += 1) {
        values[keys[i]] = fieldsValue[keys[i]];
      }

      this.setState({ detail: values });
      dispatch({
        type: 'BuildSafetyRegistra/add',
        payload: values,
        callback: () => {
          message.success('编辑成功');
          modalCallback();
          this.cancelClick();
        },
      });
    });
  };

  cancelClick = () => {
    const { handleModalVisible } = this.props;
    handleModalVisible();
  };

  render() {
    const { loading, modalVisible, form } = this.props;
    const { detail } = this.state;
    return (
      <Modal
        destroyOnClose
        title="编辑质量责任登记"
        className={themeStyle.formModal}
        visible={modalVisible}
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
        <div className={themeStyle.formModalBody}>
          <FormItem label="批准概算（预算）">
            {form.getFieldDecorator('budget', {
              initialValue: detail.budget,
              rules: [{ required: true, message: '请输入批准概算（预算）！' }],
            })(<InputNumber style={{ width: '100%' }} placeholder="请输入" />)}
          </FormItem>
          <FormItem label="	施工许可批准时间">
            {form.getFieldDecorator('constructionPermitTime', {
              initialValue: moment(new Date(detail.constructionPermitTime), 'YYYY-MM-DD HH:mm:ss'),
              rules: [{ required: true, message: '请选择施工许可批准时间！' }],
            })(<DatePicker showTime style={{ width: '100%' }} placeholder="请选择" />)}
          </FormItem>
          <FormItem label="工期与起讫时间">
            {form.getFieldDecorator('startConstructionTime', {
              initialValue: moment(new Date(detail.startConstructionTime), 'YYYY-MM-DD HH:mm:ss'),
              rules: [{ required: true, message: '请选择工期与起讫时间！' }],
            })(<DatePicker showTime style={{ width: '100%' }} placeholder="请选择" />)}
          </FormItem>
          <FormItem label="质量目标">
            {form.getFieldDecorator('qualityGoal', {
              initialValue: detail.qualityGoal,
              rules: [{ required: true, message: '请输入质量目标' }],
            })(<Input.TextArea placeholder="请输入" />)}
          </FormItem>
        </div>
      </Modal>
    );
  }
}

export default CreateModal;
