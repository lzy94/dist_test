import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Button, message } from 'antd';

import MyForm from './Form';

import themeStyle from '@/pages/style/theme.less';

@connect(({ CarGPS, loading }) => ({
  CarGPS,
  loading: loading.models.CarGPS,
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

  state = { field: {} };

  cancelClick = () => {
    const { handleModalVisible } = this.props;
    handleModalVisible();
  };

  onChange = changedFields => {
    this.setState(({ field }) => ({
      field: { ...field, ...changedFields },
    }));
  };

  save = () => {
    this.MyForm.current.validateFields((err, fieldValue) => {
      if (err) return;
      const { dispatch, modalCallback } = this.props;
      const values = {
        ...fieldValue,
        nextTryTime: fieldValue.nextTryTime * 3600,
      };
      dispatch({
        type: 'CarGPS/update',
        payload: values,
        callback: () => {
          message.success('添加成功');
          modalCallback();
          this.cancelClick();
        },
      });
    });
  };

  render() {
    const { loading, modalVisible } = this.props;
    const { field } = this.state;
    return (
      <Modal
        destroyOnClose
        title="新建"
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
          <MyForm field={field} ref={this.MyForm} onChange={this.onChange} />
        </div>
      </Modal>
    );
  }
}

export default CreateModal;
