import React, { PureComponent } from "react";
import { Form, Modal, Input, message } from 'antd';
import { connect } from 'dva';
import themeStyle from '@/pages/style/theme.less';

const FormItem = Form.Item;

/* eslint react/no-multi-comp:0 */
@connect(({ LawmentStatic, loading }) => ({
  LawmentStatic,
  loading: loading.models.LawmentStatic,
}))
@Form.create()
class InvalidDataModal extends PureComponent {

  static defaultProps = {
    handleModalVisible: () => {
    }
  };

  state = {};

  componentDidMount() {

  }

  handleInvalidData = (field, callback) => {
    const { dispatch, handleModalVisible, detailID, modalSuccess } = this.props;
    field.id = detailID;
    dispatch({
      type: 'LawmentStatic/invalidData',
      payload: field,
      callback: () => {
        handleModalVisible();
        message.success('操作成功');
        modalSuccess();
        callback && callback();
      }
    })
  };

  handOk = () => {
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (err) return;
      this.handleInvalidData(values, () => form.resetFields());
    })
  };

  render() {
    const { modalVisible, handleModalVisible, form } = this.props;
    return <Modal
      destroyOnClose
      title='数据作废'
      className={themeStyle.formModal}
      onOk={this.handOk}
      visible={modalVisible}
      onCancel={() => handleModalVisible()}
    >
      <div className={themeStyle.formModalBody}>
        <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="作废理由">
          {form.getFieldDecorator('reson', {
            rules: [{ required: true, message: '请输入作废理由' }]
          })(
            <Input.TextArea autosize />
          )}
        </FormItem>
      </div>
    </Modal>
  }

}

export default InvalidDataModal;
