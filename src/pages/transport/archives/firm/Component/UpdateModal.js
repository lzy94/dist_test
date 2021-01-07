import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Modal, Form, Input, Button, Row, Col, Radio, message } from 'antd';

import UserModal from '../../../Component/UserModal';

import themeStyle from '@/pages/style/theme.less';

const FormItem = Form.Item;
const statusMap = ['审核中', '通过', '驳回', '申请修改'];

@connect(({ TransportArchivesFirm, loading }) => ({
  TransportArchivesFirm,
  loading: loading.models.TransportArchivesFirm,
}))
@Form.create()
class UpdateModal extends PureComponent {
  static defaultProps = {
    detail: {},
    modalVisible: false,
    handleModalVisible: () => {},
  };

  state = {
    detail: {},
    modalUserVisible: false,
  };

  static getDerivedStateFromProps(props) {
    return {
      detail: props.detail,
    };
  }

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
    const { dispatch, form, modalCallback, handleModalVisible, detail } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const newDetail = JSON.parse(JSON.stringify(detail));
      const keys = Object.keys(fieldsValue);
      for (let i = 0; i < keys.length; i += 1) {
        newDetail[keys[i]] = fieldsValue[keys[i]];
      }
      this.setState({ detail: newDetail });
      dispatch({
        type: 'TransportArchivesFirm/update',
        payload: newDetail,
        callback: () => {
          message.success('编辑成功');
          handleModalVisible();
          setTimeout(() => modalCallback(), 300);
        },
      });
    });
  };

  render() {
    const { form, modalVisible, handleModalVisible, loading } = this.props;
    const { detail, modalUserVisible } = this.state;
    return (
      <Fragment>
        <Modal
          destroyOnClose
          title="编辑"
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
                    initialValue: detail.companyName,
                    rules: [{ required: true, message: '请输入公司名称！' }],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem label="账号">
                  {form.getFieldDecorator('account', {
                    initialValue: detail.account,
                    rules: [{ required: true, message: '请输入账号！' }],
                  })(<Input placeholder="接收短信消息通知的号码" />)}
                </FormItem>
                <FormItem label="密码">
                  {form.getFieldDecorator('password', {
                    initialValue: detail.password,
                    rules: [{ required: true, message: '请输入密码！' }],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem label="详细地址">
                  {form.getFieldDecorator('addr', {
                    initialValue: detail.addr,
                    rules: [{ required: true, message: '请输入详细地址！' }],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem label="状态">
                  {form.getFieldDecorator('status', {
                    initialValue: detail.status,
                    rules: [{ required: true, message: '请选择状态！' }],
                  })(
                    <Radio.Group>
                      {statusMap.map((item, i) => (
                        <Radio value={i + 1} key={i}>
                          {item}
                        </Radio>
                      ))}
                    </Radio.Group>,
                  )}
                </FormItem>
              </Col>
              <Col md={12} sm={24}>
                <FormItem label="联系人">
                  {form.getFieldDecorator('concacts', {
                    initialValue: detail.concacts,
                    rules: [{ required: true, message: '请输入联系人！' }],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem label="联系方式">
                  {form.getFieldDecorator('concactsTel', {
                    initialValue: detail.concactsTel,
                    rules: [{ required: true, message: '请输入联系方式！' }],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem label="信用代码">
                  {form.getFieldDecorator('creditCode', {
                    initialValue: detail.creditCode,
                    rules: [{ required: true, message: '请输入信用代码！' }],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem label="安全督导员">
                  {form.getFieldDecorator('safetySupervisor', {
                    initialValue: detail.safetySupervisor,
                    rules: [{ required: true, message: '请输入安全督导员！' }],
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
export default UpdateModal;
