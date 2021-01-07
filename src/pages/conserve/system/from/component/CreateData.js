import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Row, Col, Form, Button, Input, DatePicker, message } from 'antd';
import themeStyle from '@/pages/style/theme.less';
import moment from 'moment';

const FormItem = Form.Item;

/* eslint react/no-multi-comp:0 */
@connect(({ ConserveSystemFrom, loading }) => ({
  ConserveSystemFrom,
  loading: loading.models.ConserveSystemFrom,
}))
@Form.create()
class CreateData extends PureComponent {
  static defaultProps = {
    modalVisible: false,
    handleModalVisible: () => {},
  };

  save = () => {
    const { form, dispatch, modalCallback, handleModalVisible } = this.props;
    form.validateFields((err, fieldValue) => {
      if (err) return;

      const values = {
        ...fieldValue,
      };
      values.expirationDate = moment(fieldValue.expirationDate).format('YYYY-MM-DD');
      dispatch({
        type: 'ConserveSystemFrom/AUSave',
        payload: fieldValue,
        callback: () => {
          message.success('添加成功');
          handleModalVisible();
          modalCallback();
        },
      });
    });
  };

  render() {
    const { modalVisible, handleModalVisible, loading, form } = this.props;
    return (
      <Modal
        destroyOnClose
        title="添加"
        className={themeStyle.formModal}
        visible={modalVisible}
        width={800}
        onCancel={() => handleModalVisible()}
        footer={[
          <Button key="back" onClick={() => handleModalVisible()}>
            取消
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={() => this.save()}>
            确定
          </Button>,
        ]}
      >
        <div className={themeStyle.formModalBody}>
          <Row gutter={40}>
            <Col md={12} sm={24}>
              <FormItem label="表号">
                {form.getFieldDecorator('tableNumber', {
                  rules: [{ required: true, message: '请输入表号！' }],
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem label="制表机构">
                {form.getFieldDecorator('tableOrg', {
                  rules: [{ required: true, message: '请输入制表机构！' }],
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem label="审批机构">
                {form.getFieldDecorator('approveOrg', {
                  rules: [{ required: true, message: '请输入审批机构！' }],
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem label="批准文号">
                {form.getFieldDecorator('approveNumber', {
                  rules: [{ required: true, message: '请输入批准文号！' }],
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem label="年份">
                {form.getFieldDecorator('formYears', {
                  rules: [{ required: true, message: '请输入年份！' }],
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem label="有效期">
                {form.getFieldDecorator('expirationDate', {
                  rules: [{ required: true, message: '请选择有效期！' }],
                })(<DatePicker style={{ width: '100%' }} placeholder="请选择" />)}
              </FormItem>
            </Col>
          </Row>
        </div>
      </Modal>
    );
  }
}

export default CreateData;
