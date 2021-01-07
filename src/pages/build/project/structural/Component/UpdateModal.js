import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Button, Form, Input, InputNumber, message, Spin } from 'antd';

import themeStyle from '@/pages/style/theme.less';

const FormItem = Form.Item;

@connect(({ BuildProjectStructural, loading }) => ({
  BuildProjectStructural,
  loading: loading.models.BuildProjectStructural,
}))
@Form.create()
class UpdateModal extends PureComponent {
  static defaultProps = {
    modalVisible: false,
    handleModalVisible: () => {},
    modalCallback: () => {},
  };

  state = { detail: {} };

  componentDidMount() {
    this.getDetail();
  }

  getDetail = () => {
    const { detailID, dispatch } = this.props;
    dispatch({
      type: 'BuildProjectStructural/detail',
      payload: detailID,
      callback: detail => {
        this.setState({ detail });
      },
    });
  };

  save = () => {
    const { dispatch, form, modalCallback } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { detail } = this.state;
      const values = { ...detail };

      const key = Object.keys(fieldsValue);

      for (let i = 0; i < key.length; i += 1) {
        values[key[i]] = fieldsValue[key[i]];
      }
      this.setState({ detail: values });

      dispatch({
        type: 'BuildProjectStructural/add',
        payload: values,
        callback: () => {
          message.success('编辑成功');
          modalCallback('edit');
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
        title="编辑主要结构物工程"
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
          <Spin spinning={loading}>
            <FormItem label="合同段">
              {form.getFieldDecorator('contractSegment', {
                initialValue: detail.contractSegment,
                rules: [{ required: true, message: '请输入合同段！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem label="结构物名称">
              {form.getFieldDecorator('structureName', {
                initialValue: detail.structureName,
                rules: [{ required: true, message: '请输入结构物名称！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem label="结构形式">
              {form.getFieldDecorator('structureType', {
                initialValue: detail.structureType,
                rules: [{ required: true, message: '请输入结构形式！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem label="桩号">
              {form.getFieldDecorator('stake', {
                initialValue: detail.stake,
                rules: [{ required: true, message: '请输入桩号！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem label="长度（m）">
              {form.getFieldDecorator('length', {
                initialValue: detail.length,
                rules: [{ required: true, message: '请输入长度！' }],
              })(<InputNumber style={{ width: '100%' }} placeholder="请输入" />)}
            </FormItem>
            <FormItem label="工程主要技术难点、特点">
              {form.getFieldDecorator('technicalDiff', {
                initialValue: detail.technicalDiff,
                rules: [{ required: true, message: '请输入工程主要技术难点、特点！' }],
              })(<Input.TextArea placeholder="请输入" />)}
            </FormItem>
          </Spin>
        </div>
      </Modal>
    );
  }
}

export default UpdateModal;
