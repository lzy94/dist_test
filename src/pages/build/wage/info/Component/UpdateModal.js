import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Modal, Button, message, Card } from 'antd';

import MyForm from './Form';

import themeStyle from '@/pages/style/theme.less';

@connect(({ BuildWageInfo, loading }) => ({
  BuildWageInfo,
  loading: loading.models.BuildWageInfo,
}))
class UpdateModal extends PureComponent {
  static defaultProps = {
    detail: {},
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
        type: 'BuildWageInfo/add',
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
        title="编辑工资详情"
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
