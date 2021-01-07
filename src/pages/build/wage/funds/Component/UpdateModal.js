import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Modal, Button, message, Card } from 'antd';

import MyForm from './Form';

import themeStyle from '@/pages/style/theme.less';

@connect(({ BuildWageFunds, loading }) => ({
  BuildWageFunds,
  loading: loading.models.BuildWageFunds,
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
    const { construcTelephone, totalTelephone } = detail;
    const [construcTelephones, totalTelephones] = [
      construcTelephone.split('/'),
      totalTelephone.split('/'),
    ];
    const { isSet } = state;
    const values = {
      ...detail,
      jsdw: construcTelephones[0],
      jsdwLxdh: construcTelephones[1],
      zbdw: totalTelephones[0],
      zbdwLxdh: totalTelephones[1],
    };
    if (!isSet) {
      return {
        isSet: !isSet,
        field: values,
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

      values.construcTelephone = `${fieldValue.jsdw}/${fieldValue.jsdwLxdh}`;
      values.totalTelephone = `${fieldValue.zbdw}/${fieldValue.zbdwLxdh}`;
      values.startTime = `${moment(fieldValue.startTime[0]).format('YYYY-MM-DD')} ~ ${moment(
        fieldValue.startTime[1],
      ).format('YYYY-MM-DD')}`;

      this.setState({ field: values });

      dispatch({
        type: 'BuildWageFunds/add',
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
        title="编辑项目资金"
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
