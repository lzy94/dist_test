import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Button, message } from 'antd';

import MyForm from './Form';

import themeStyle from '@/pages/style/theme.less';

@connect(({ BuildSafetyCheck, loading }) => ({
  BuildSafetyCheck,
  loading: loading.models.BuildSafetyCheck,
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

  state = {
    cateIndex: 0,
    field: {},
  };

  save = () => {
    this.MyForm.current.validateFields((err, fieldValue) => {
      if (err) return;
      if (fieldValue.passNum > fieldValue.checkNum) {
        message.error('检测数需大于等于合格数');
        return;
      }
      const { dispatch, modalCallback } = this.props;
      const values = {
        ...fieldValue,
        passPercent: ((fieldValue.passNum / (fieldValue.checkNum || 1)) * 100).toFixed(1),
      };
      dispatch({
        type: 'BuildSafetyCheck/add',
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

  setCateIndex = index => {
    this.setState({ cateIndex: index });
  };

  onChange = changedFields => {
    this.setState(({ field }) => ({
      field: { ...field, ...changedFields },
    }));
  };

  render() {
    const { loading, modalVisible } = this.props;
    const { cateIndex, field } = this.state;
    return (
      <Modal
        destroyOnClose
        title="新建监督抽检"
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
          <MyForm
            field={field}
            ref={this.MyForm}
            cateIndex={cateIndex}
            setCateIndex={this.setCateIndex}
            onChange={this.onChange}
          />
        </div>
      </Modal>
    );
  }
}

export default CreateModal;
