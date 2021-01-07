import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Modal, Form, Input, Button, Row, Col, message } from 'antd';

import UserModal from '../../../Component/UserModal';

import themeStyle from '@/pages/style/theme.less';

const FormItem = Form.Item;

@connect(({ TransportArchivesFirm, loading }) => ({
  TransportArchivesFirm,
  loading: loading.models.TransportArchivesFirm,
}))
@Form.create()
class CreateModal extends PureComponent {
  static defaultProps = {
    modalVisible: false,
    handleModalVisible: () => {},
  };

  state = {
    modalUserVisible: false,
  };

  handleUserModalVisible = flag => {
    this.setState({ modalUserVisible: !!flag });
  };

  setSelectData = detail => {
    const { form } = this.props;
    form.setFieldsValue({
      safetySupervisor: detail.fullname,
    });
  };

  save = () => {
    const { dispatch, form, modalCallback, handleModalVisible } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        createType: 2,
        status: 2,
      };
      dispatch({
        type: 'TransportArchivesFirm/add',
        payload: values,
        callback: () => {
          message.success('添加成功');
          handleModalVisible();
          setTimeout(() => modalCallback(), 300);
        },
      });
    });
  };

  render() {
    const { form, modalVisible, handleModalVisible, loading } = this.props;
    const { modalUserVisible } = this.state;
    return (
      <Fragment>
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
                <FormItem label="公司名称">
                  {form.getFieldDecorator('companyName', {
                    rules: [{ required: true, message: '请输入公司名称！' }],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem label="账号">
                  {form.getFieldDecorator('account', {
                    rules: [{ required: true, message: '请输入账号！' }],
                  })(<Input placeholder="接收短信消息通知的号码" />)}
                </FormItem>
                <FormItem label="密码">
                  {form.getFieldDecorator('password', {
                    rules: [{ required: true, message: '请输入密码！' }],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem label="详细地址">
                  {form.getFieldDecorator('addr', {
                    rules: [{ required: true, message: '请输入详细地址！' }],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={12} sm={24}>
                <FormItem label="联系人">
                  {form.getFieldDecorator('concacts', {
                    rules: [{ required: true, message: '请输入联系人！' }],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem label="联系方式">
                  {form.getFieldDecorator('concactsTel', {
                    rules: [{ required: true, message: '请输入联系方式！' }],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem label="信用代码">
                  {form.getFieldDecorator('creditCode', {
                    rules: [{ required: true, message: '请输入信用代码！' }],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem label="安全督导员">
                  {form.getFieldDecorator('safetySupervisor', {
                    rules: [{ required: true, message: '请选择安全督导员！' }],
                  })(
                    <Input
                      readOnly
                      placeholder="请选择"
                      onClick={() => this.handleUserModalVisible(true)}
                    />,
                  )}
                </FormItem>
              </Col>
            </Row>
          </div>
        </Modal>
        {modalUserVisible ? (
          <UserModal
            modalVisible={modalUserVisible}
            setSelectData={this.setSelectData}
            handleModalVisible={this.handleUserModalVisible}
          />
        ) : null}
      </Fragment>
    );
  }
}
export default CreateModal;
