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

      const values = {
        ...fieldValue,
        construcTelephone: `${fieldValue.jsdw}/${fieldValue.jsdwLxdh}`,
        totalTelephone: `${fieldValue.zbdw}/${fieldValue.zbdwLxdh}`,
        startTime: `${moment(fieldValue.startTime[0]).format('YYYY-MM-DD')} ~ ${moment(
          fieldValue.startTime[1],
        ).format('YYYY-MM-DD')}`,
      };
      dispatch({
        type: 'BuildWageFunds/add',
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

  render() {
    const { loading, modalVisible } = this.props;
    const { field } = this.state;
    return (
      <Modal
        destroyOnClose
        title="新建项目资金"
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

export default CreateModal;
