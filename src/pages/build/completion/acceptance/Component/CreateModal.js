import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Button, message, Card } from 'antd';

import MyForm from './Form';

import themeStyle from '@/pages/style/theme.less';

@connect(({ BuildCompletionAcceptance, loading }) => ({
  BuildCompletionAcceptance,
  loading: loading.models.BuildCompletionAcceptance,
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

  state = { fileList: [], field: {} };

  uploadChange = info => {
    if (info.file.status === 'done') {
      if (info.file.response.code === 200) {
        message.success('上传成功');
        this.setState({ fileList: info.fileList });
      } else {
        message.error(info.file.response.code.msg);
      }
    } else if (info.file.status === 'error') {
      message.error('上传失败');
    } else if (info.file.status === 'removed') {
      this.setState({ fileList: info.fileList });
    }
  };

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
      const { fileList } = this.state;
      if (!fileList.length) {
        message.error('请选择文件');
        return;
      }

      const values = {
        ...fieldValue,
        annexUrl: fileList.length ? fileList[0].response.filePath : '',
      };

      if (fieldValue.startDate > fieldValue.completionDate) {
        message.error('完工时间必须大于开工时间');
        return;
      }

      dispatch({
        type: 'BuildCompletionAcceptance/add',
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
    const { fileList, field } = this.state;
    return (
      <Modal
        destroyOnClose
        title="新建验收情况登记"
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
          <MyForm
            onChange={this.fieldChange}
            uploadChange={this.uploadChange}
            fileList={fileList}
            field={field}
            ref={this.MyForm}
          />
        </Card>
      </Modal>
    );
  }
}

export default CreateModal;
