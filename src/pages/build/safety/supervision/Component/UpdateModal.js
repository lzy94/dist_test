import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Modal, Button, message, Card } from 'antd';

import MyForm from './Form';

import themeStyle from '@/pages/style/theme.less';

@connect(({ BuildSafetySupervision, loading }) => ({
  BuildSafetySupervision,
  loading: loading.models.BuildSafetySupervision,
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
    detail: {},
    isSet: false,
  };

  static getDerivedStateFromProps(props, state) {
    const { detail } = props;
    const { isSet } = state;
    if (!isSet) {
      return {
        isSet: !isSet,
        detail,
      };
    }
    return null;
  }

  save = () => {
    this.MyForm.current.validateFields((err, fieldValue) => {
      if (err) return;
      const { dispatch, modalCallback } = this.props;
      const { detail } = this.state;
      const values = {
        ...detail,
      };
      const keys = Object.keys(fieldValue);
      for (let i = 0; i < keys.length; i += 1) {
        values[keys[i]] = fieldValue[keys[i]];
      }
      // values.contractDuration = moment(fieldValue.contractDuration).format('YYYY-MM-DD');
      this.setState({ detail: values });
      dispatch({
        type: 'BuildSafetySupervision/add',
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
    const { detail } = this.state;
    return (
      <Modal
        destroyOnClose
        title="编辑监理登记备案"
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
          <MyForm field={detail} ref={this.MyForm} />
        </Card>
      </Modal>
    );
  }
}

export default UpdateModal;
