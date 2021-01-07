/**
 * @description 退回重审
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Form, Input } from 'antd';

import themeStyle from '@/pages/style/theme.less';

const FormItem = Form.Item;

@connect(({ loading, TrafficApiV2BusData, user }) => ({
  TrafficApiV2BusData,
  loading: loading.models.TrafficApiV2BusData,
  currentUser: user.currentUser,
}))
@Form.create()
class LawCaseReturnModal extends PureComponent {
  static defaultProps = {
    modalVisible: false,
    handleModalVisible: () => {},
  };

  state = {};

  okHandle = () => {
    const {
      form,
      detailID,
      dispatch,
      modalSuccess,
      handleModalVisible,
      currentUser: { id, fullname },
    } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = { ...fieldsValue, busDataId: detailID, userId: id, userName: fullname };
      dispatch({
        type: 'TrafficApiV2BusData/lawCaseReturn',
        payload: values,
        callback: () => {
          handleModalVisible();
          modalSuccess();
        },
      });
    });
  };

  render() {
    const { modalVisible, handleModalVisible, form } = this.props;
    return (
      <Modal
        destroyOnClose
        title="退回重审"
        visible={modalVisible}
        className={themeStyle.formModal}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
      >
        <div className={themeStyle.formModalBody}>
          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="退回重审原因">
            {form.getFieldDecorator('reason', {
              initialValue: '车辆检测信息与实际不符或照片缺失',
              rules: [{ required: true, message: '请输入重审原因' }],
            })(<Input.TextArea rows={3} autosize placeholder="请输入" />)}
          </FormItem>
        </div>
      </Modal>
    );
  }
}

export default LawCaseReturnModal;
