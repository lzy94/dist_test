import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Button, message, Card } from 'antd';

import MyForm from './Form';

import themeStyle from '@/pages/style/theme.less';

@connect(({ BuildProgressControl, loading }) => ({
  BuildProgressControl,
  loading: loading.models.BuildProgressControl,
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
    fileList: [],
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

  save = () => {
    this.MyForm.current.validateFields((err, fieldValue) => {
      if (err) return;
      const { dispatch, modalCallback } = this.props;
      const { field } = this.state;
      const values = {
        ...field,
      };
      const keys = Object.keys(fieldValue);
      for (let i = 0; i < keys.length; i += 1) {
        values[keys[i]] = fieldValue[keys[i]];
      }

      if (typeof fieldValue.improveUrl === 'object') {
        const { response } = fieldValue.improveUrl.file;
        values.improveUrl = response ? response.filePath : '';
      }

      this.setState({ field: values });

      dispatch({
        type: 'BuildProgressControl/add',
        payload: values,
        callback: () => {
          message.success('编辑成功');
          modalCallback('edit');
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
        title="编辑项目进度"
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
          <MyForm onChange={this.fieldChange} field={field} ref={this.MyForm} />
        </Card>
      </Modal>
    );
  }
}

export default UpdateModal;
