import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Input, Button, Form, message } from 'antd';
import PlanmanagementModal from '@/pages/conserve/Component/PlanmanagementModal';

import styles from './style.less';

@connect(({ ConserveDataMessage, loading }) => ({
  ConserveDataMessage,
  loading: loading.models.ConserveDataMessage,
}))
@Form.create()
class MessageIndex extends PureComponent {
  constructor(props) {
    super(props);
    this.input = React.createRef();
  }

  state = { modalVisible: false, planId: '' };

  componentDidMount() {
    this.getList();
  }

  handleModalVisible = flag => {
    this.setState({ modalVisible: !!flag });
  };

  selectData = data => {
    const { form } = this.props;
    form.setFieldsValue({ planName: data.planName });
    this.setState({ planId: data.id_ });
  };

  setInputSelection = (startPos, endPos) => {
    const { textAreaRef } = this.input.current;
    textAreaRef.focus();
    if (typeof textAreaRef.selectionStart !== 'undefined') {
      textAreaRef.selectionStart = startPos;
      textAreaRef.selectionEnd = endPos;
    }
  };

  checkPhone = data => {
    let isAll = true;
    if (!data) {
      return isAll;
    }
    const regPhone = /^1(?:70\d|(?:9[89]|8[0-24-9]|7[135-8]|66|5[0-35-9])\d|3(?:4[0-8]|[0-35-9]\d))\d{7}$/;
    const arr = data.split(',');
    for (let i = 0; i < arr.length; i += 1) {
      if (!regPhone.test(arr[i])) {
        isAll = false;
        message.error(`${arr[i]}输入不正确`);
        const len = this.getValueLength(arr, i);
        this.setInputSelection(len[0], len[1]);
        break;
      }
    }
    return isAll;
  };

  getValueLength = (arr, index) => {
    let [start, end] = [0, 0];
    if (index === 0) {
      start = 0;
      end = arr[index].length;
    } else {
      for (let i = 0; i < index; i += 1) {
        start += arr[i].length;
      }
      start += index;
      end = start + arr[index].length;
    }
    return [start, end];
  };

  getList = () => {
    const { dispatch } = this.props;
    const pageBean = {
      pageBean: {
        page: 1,
        pageSize: 10,
        showTotal: true,
      },
    };
    dispatch({
      type: 'ConserveDataMessage/fetch',
      payload: pageBean,
      callback: () => {
        const {
          form,
          ConserveDataMessage: { data },
        } = this.props;
        const { phoneNumbers, planName, planId } = data;
        form.setFieldsValue({ phoneNumbers, planName });
        this.setState({ planId });
      },
    });
  };

  send = () => {
    const {
      form,
      dispatch,
      ConserveDataMessage: { data },
    } = this.props;
    form.validateFields((err, fieldValue) => {
      if (err) return;
      const { planId } = this.state;
      const value = { ...data, ...fieldValue, planId };
      const check = this.checkPhone(value.phoneNumbers);
      if (check) {
        dispatch({
          type: 'ConserveDataMessage/dataSave',
          payload: value,
          callback: response => {
            message.success(response.message);
            this.getList();
          },
        });
      }
    });
  };

  testSend = () => {
    const { form, dispatch } = this.props;
    form.validateFields((err, fieldValue) => {
      if (err) return;
      const value = { phones: fieldValue.phoneNumbers, content: fieldValue.planName };
      const check = this.checkPhone(value.phones);
      if (check) {
        dispatch({
          type: 'ConserveDataMessage/tSend',
          payload: value,
          callback: response => {
            message.success(response.message);
            this.getList();
          },
        });
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const he = {
      heihgt: '100%',
    };
    const { modalVisible } = this.state;
    return (
      <Fragment>
        <Card title="水位，位移短信预警" bordered={false} style={he} bodyStyle={he}>
          <div className={styles.main}>
            <Form layout="vertical">
              <Form.Item label="预案">
                {getFieldDecorator('planName', {
                  rules: [{ required: true, message: '请选择预案' }],
                })(<Input readOnly placeholder="请选择预案" onClick={this.handleModalVisible} />)}
              </Form.Item>
              <Form.Item label="手机号码 多个用英文 ,  隔开">
                {getFieldDecorator('phoneNumbers', {
                  // rules: [{ required: true, message: '请输入手机号码' }],
                })(<Input.TextArea ref={this.input} placeholder="手机号码 多个用 , 隔开" />)}
              </Form.Item>
              <Button type="primary" onClick={this.send}>
                保存
              </Button>
              &nbsp;
              <Button onClick={this.testSend}>测试发送</Button>
            </Form>
          </div>
        </Card>
        {modalVisible && (
          <PlanmanagementModal
            modalVisible={modalVisible}
            handleModalVisible={this.handleModalVisible}
            selectData={this.selectData}
          />
        )}
      </Fragment>
    );
  }
}

export default MessageIndex;
