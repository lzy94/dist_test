import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Button, message, Card } from 'antd';

import MyForm from './Form';

import themeStyle from '@/pages/style/theme.less';

@connect(({ BuildSafetyRegistra, loading }) => ({
  BuildSafetyRegistra,
  loading: loading.models.BuildSafetyRegistra,
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
      dispatch({
        type: 'BuildSafetyRegistra/add',
        payload: fieldValue,
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
        title="新建从业质量责任人"
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
