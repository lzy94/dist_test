import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Modal, Button, message, Card } from 'antd';

import MyForm from './Form';

import themeStyle from '@/pages/style/theme.less';

@connect(({ BuildSafetySupervision, loading }) => ({
  BuildSafetySupervision,
  loading: loading.models.BuildSafetySupervision,
}))
class CreateModal extends PureComponent {
  static defaultProps = {
    modalVisible: false,
    handleModalVisible: () => {},
    modalCallback: () => {},
  };

  constructor(props) {
    super(props);
    this.MyForm = React.createRef();
  }

  state = {};

  save = () => {
    this.MyForm.current.validateFields((err, fieldValue) => {
      if (err) return;
      const { dispatch, modalCallback } = this.props;
      const values = {
        ...fieldValue,
        // contractDuration: moment(fieldValue.contractDuration).format('YYYY-MM-DD'),
      };
      dispatch({
        type: 'BuildSafetySupervision/add',
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
    const { loading, modalVisible } = this.props;
    return (
      <Modal
        destroyOnClose
        title="新建监理登记备案"
        className={themeStyle.formModal}
        visible={modalVisible}
        onCancel={this.cancelClick}
        width={1000}
        footer={[
          <Button key="back" onClick={this.cancelClick}>
            取消
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={this.save}>
            确定
          </Button>,
        ]}
      >
        <Card bordered={false}>
          <MyForm ref={this.MyForm} />
        </Card>
      </Modal>
    );
  }
}

export default CreateModal;
