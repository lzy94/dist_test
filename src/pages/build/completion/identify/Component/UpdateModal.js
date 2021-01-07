import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Button, message, Card } from 'antd';

import MyForm from './Form';

import themeStyle from '@/pages/style/theme.less';

@connect(({ BuildCompletionIdentify, loading }) => ({
  BuildCompletionIdentify,
  loading: loading.models.BuildCompletionIdentify,
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
    isSet: false,
  };

  static getDerivedStateFromProps(props, state) {
    const { detail } = props;
    const { isSet } = state;
    if (!isSet) {
      return {
        isSet: !isSet,
        field: detail,
      };
    }
    return null;
  }

  fieldChange = changedFields => {
    this.setState(({ field }) => ({
      field: {
        ...field,
        ...changedFields,
      },
    }));
  };

  save = () => {
    this.MyForm.current.validateFields((err, fieldValue) => {
      if (err) return;
      const { dispatch, modalCallback } = this.props;
      const { field } = this.state;
      const values = {
        ...field,
      };
      if (fieldValue.startDate > fieldValue.completionDate) {
        message.error('完工时间必须大于开工时间');
        return;
      }
      const keys = Object.keys(fieldValue);
      for (let i = 0; i < keys.length; i += 1) {
        values[keys[i]] = fieldValue[keys[i]];
      }

      if (typeof fieldValue.annexUrl === 'object') {
        const { response } = fieldValue.annexUrl.file;
        values.annexUrl = response ? response.filePath : '';
      }

      this.setState({ field: values });

      dispatch({
        type: 'BuildCompletionIdentify/add',
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

  render() {
    const { loading, modalVisible } = this.props;
    const { field } = this.state;
    return (
      <Modal
        destroyOnClose
        title="编辑验收鉴定情况登记"
        className={themeStyle.formModal}
        visible={modalVisible}
        onCancel={this.cancelClick}
        width={800}
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
          <MyForm onChange={this.fieldChange} field={field} ref={this.MyForm} />
        </Card>
      </Modal>
    );
  }
}

export default UpdateModal;
