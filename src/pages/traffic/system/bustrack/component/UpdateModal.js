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

  state = { field: {}, detail: {}, isSet: false };

  static getDerivedStateFromProps({ detail }, { isSet }) {
    const newDetail = { ...detail, nextTryTime: detail.nextTryTime / 3600 };
    if (!isSet) {
      const keys = Object.keys(newDetail);
      const values = {};
      for (let i = 0; i < keys.length; i += 1) {
        values[keys[i]] = {
          value: newDetail[keys[i]],
        };
      }
      return {
        isSet: !isSet,
        detail: values,
        field: newDetail,
      };
    }
    return null;
  }

  cancelClick = () => {
    const { handleModalVisible } = this.props;
    handleModalVisible();
  };

  onChange = changedFields => {
    this.setState(({ detail }) => ({
      detail: { ...detail, ...changedFields },
    }));
  };

  save = () => {
    this.MyForm.current.validateFields((err, fieldValue) => {
      if (err) return;
      const { dispatch, modalCallback } = this.props;
      const { field, detail } = this.state;
      const values = {
        ...field,
        ...fieldValue,
        nextTryTime: fieldValue.nextTryTime * 3600,
      };

      const newDetail = { ...detail };
      const keys = Object.keys(fieldValue);
      for (let i = 0; i < keys.length; i += 1) {
        newDetail[keys[i]] = {
          value: fieldValue[keys[i]],
        };
      }
      this.setState({ detail: newDetail });

      dispatch({
        type: 'CarGPS/update',
        payload: values,
        callback: () => {
          message.success('编辑成功');
          modalCallback();
          this.cancelClick();
        },
      });
    });
  };

  render() {
    const { loading, modalVisible } = this.props;
    const { detail } = this.state;
    return (
      <Modal
        destroyOnClose
        title="编辑"
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
          <MyForm type="edit" field={detail} ref={this.MyForm} onChange={this.onChange} />
        </div>
      </Modal>
    );
  }
}

export default CreateModal;
