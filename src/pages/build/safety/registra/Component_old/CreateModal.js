import React, { PureComponent } from 'react';
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
    modalVisible: false,
    handleModalVisible: () => {},
    modalCallback: () => {},
  };

  state = {};

  save = () => {
    const { dispatch, form, modalCallback } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
      };

      dispatch({
        type: 'BuildSafetyRegistra/add',
        payload: values,
        callback: () => {
          message.success('添加成功');
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
    return (
      <Modal
        destroyOnClose
        title="新建质量责任登记"
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
              rules: [{ required: true, message: '请输入批准概算（预算）！' }],
            })(<InputNumber style={{ width: '100%' }} placeholder="请输入" />)}
          </FormItem>
          <FormItem label="	施工许可批准时间">
            {form.getFieldDecorator('constructionPermitTime', {
              rules: [{ required: true, message: '请选择施工许可批准时间！' }],
            })(<DatePicker showTime style={{ width: '100%' }} placeholder="请选择" />)}
          </FormItem>
          <FormItem label="工期与起讫时间">
            {form.getFieldDecorator('startConstructionTime', {
              rules: [{ required: true, message: '请选择工期与起讫时间！' }],
            })(<DatePicker showTime style={{ width: '100%' }} placeholder="请选择" />)}
          </FormItem>
          <FormItem label="质量目标">
            {form.getFieldDecorator('qualityGoal', {
              rules: [{ required: true, message: '请输入质量目标' }],
            })(<Input.TextArea placeholder="请输入" />)}
          </FormItem>
        </div>
      </Modal>
    );
  }
}

export default CreateModal;
