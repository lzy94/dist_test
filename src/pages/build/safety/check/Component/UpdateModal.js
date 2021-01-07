import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Button, message, Card } from 'antd';

import MyForm from './Form';

import themeStyle from '@/pages/style/theme.less';

@connect(({ BuildSafetyCheck, loading }) => ({
  BuildSafetyCheck,
  loading: loading.models.BuildSafetyCheck,
}))
class UpdateModal extends PureComponent {
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
    field: {},
    detail: {},
    cateIndex: 0,
    isSet: false,
  };

  static getDerivedStateFromProps(props, state) {
    const { detail } = props;
    const { isSet } = state;
    if (!isSet) {
      const keys = Object.keys(detail);
      const values = {};
      for (let i = 0; i < keys.length; i += 1) {
        values[keys[i]] = {
          value: detail[keys[i]],
        };
      }
      return {
        isSet: !isSet,
        detail: values,
        field: detail,
      };
    }
    return null;
  }

  save = () => {
    this.MyForm.current.validateFields((err, fieldValue) => {
      if (err) return;
      if (fieldValue.passNum > fieldValue.checkNum) {
        message.error('检测数需大于等于合格数');
        return;
      }
      const { dispatch, modalCallback } = this.props;
      const { field, detail } = this.state;
      const values = {
        ...field,
        ...fieldValue,
        passPercent: ((fieldValue.passNum / (fieldValue.checkNum || 1)) * 100).toFixed(1),
      };
      delete values.createBy;
      delete values.createTime;
      const newDetail = { ...detail };
      const keys = Object.keys(fieldValue);
      for (let i = 0; i < keys.length; i += 1) {
        newDetail[keys[i]] = {
          value: fieldValue[keys[i]],
        };
      }
      this.setState({ detail: newDetail });
      dispatch({
        type: 'BuildSafetyCheck/add',
        payload: values,
        callback: () => {
          message.success('编辑成功');
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
    this.setState(({ detail }) => ({
      detail: { ...detail, ...changedFields },
    }));
  };

  render() {
    const { loading, modalVisible } = this.props;
    const { detail, cateIndex } = this.state;
    return (
      <Modal
        destroyOnClose
        title="编辑监督抽检"
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
        <MyForm
          field={detail}
          ref={this.MyForm}
          cateIndex={cateIndex}
          setCateIndex={this.setCateIndex}
          onChange={this.onChange}
        />
      </Modal>
    );
  }
}

export default UpdateModal;
