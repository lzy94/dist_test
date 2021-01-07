import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Button, Form, Input, InputNumber, message } from 'antd';

import themeStyle from '@/pages/style/theme.less';

const FormItem = Form.Item;

@connect(({ BuildProjectStructural, loading }) => ({
  BuildProjectStructural,
  loading: loading.models.BuildProjectStructural,
}))
@Form.create()
class CreateModal extends PureComponent {
  static defaultProps = {
    modalVisible: false,
    handleModalVisible: () => {},
    modalCallback: () => {},
  };

  save = () => {
    const { dispatch, form, modalCallback } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'BuildProjectStructural/add',
        payload: fieldsValue,
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
        title="新建主要结构物工程"
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
          <FormItem label="合同段">
            {form.getFieldDecorator('contractSegment', {
              rules: [{ required: true, message: '请输入合同段！' }],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem label="结构物名称">
            {form.getFieldDecorator('structureName', {
              rules: [{ required: true, message: '请输入结构物名称！' }],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem label="结构形式">
            {form.getFieldDecorator('structureType', {
              rules: [{ required: true, message: '请输入结构形式！' }],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem label="桩号">
            {form.getFieldDecorator('stake', {
              rules: [{ required: true, message: '请输入桩号！' }],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem label="长度（m）">
            {form.getFieldDecorator('length', {
              rules: [{ required: true, message: '请输入长度！' }],
            })(<InputNumber style={{ width: '100%' }} placeholder="请输入" />)}
          </FormItem>
          <FormItem label="工程主要技术难点、特点">
            {form.getFieldDecorator('technicalDiff', {
              rules: [{ required: true, message: '请输入工程主要技术难点、特点！' }],
            })(<Input.TextArea placeholder="请输入" />)}
          </FormItem>
        </div>
      </Modal>
    );
  }
}

export default CreateModal;
