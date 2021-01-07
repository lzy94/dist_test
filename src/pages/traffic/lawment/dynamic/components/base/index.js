import React, { PureComponent } from 'react';
import { Modal, Form, Input, message, Select } from 'antd';
import { connect } from 'dva';

import themeStyle from '@/pages/style/theme.less';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ TrafficApiV2BusData, loading, user }) => ({
  currentUser: user.currentUser,
  TrafficApiV2BusData,
  loading: loading.models.TrafficApiV2BusData,
}))
@Form.create()
class FocusDataModal extends PureComponent {
  static defaultProps = {
    handleModalVisible: () => {},
  };

  state = {
    registerInfo: {},
    busDynamicLawDate: {},
  };

  componentDidMount() {
    const { detail } = this.props;
    const registerInfo = detail.registerInfo || {};
    this.setState({
      registerInfo,
      busDynamicLawDate: detail.busDynamicLawDate,
    });
  }

  okHandle = () => {
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.sendFocusData(fieldsValue, () => form.resetFields());
    });
  };

  sendFocusData = (field, callback) => {
    const {
      registerInfo: { vehicleOwnerAddr, truckBelong, registAddr, phone },
      busDynamicLawDate: { carNo, previewCode, id },
    } = this.state;
    const {
      dispatch,
      handleModalVisible,
      modalSuccess,
      currentUser: { fullname },
    } = this.props;
    const address = truckBelong === 1 ? vehicleOwnerAddr : registAddr;
    const values = {
      ...field,
      busDataId: id,
      carNo,
      mobile: phone,
      previewCode,
      address,
      source: '',
      createBy: fullname,
    };
    dispatch({
      type: 'TrafficApiV2BusData/focusData',
      payload: values,
      callback: () => {
        message.success('操作成功');
        setTimeout(() => {
          handleModalVisible();
          modalSuccess();
          if (callback) {
            callback();
          }
        }, 500);
      },
    });
  };

  render() {
    const { form, modalVisible, handleModalVisible } = this.props;
    return (
      <Modal
        destroyOnClose
        title="重点关注"
        className={themeStyle.formModal}
        visible={modalVisible}
        onOk={() => this.okHandle()}
        onCancel={() => handleModalVisible()}
      >
        <div className={themeStyle.formModalBody}>
          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="重点关注理由">
            {form.getFieldDecorator('reson', {
              initialValue: '车辆使用假牌、套牌等',
            })(
              <Select dropdownMatchSelectWidth={false} style={{ width: '100%' }}>
                <Option value="车辆使用假牌、套牌等">车辆使用假牌、套牌等</Option>
              </Select>,
            )}
          </FormItem>
          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="描述">
            {form.getFieldDecorator('bewrite', {
              initialValue: '疑似套牌车辆',
            })(<Input.TextArea rows={3} autosize placeholder="请输入" />)}
          </FormItem>
        </div>
      </Modal>
    );
  }
}

export default FocusDataModal;
