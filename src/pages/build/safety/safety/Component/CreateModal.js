import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Button, message, Card } from 'antd';

import MyForm from './Form';

import themeStyle from '@/pages/style/theme.less';

@connect(({ BuildSafetySafety, loading }) => ({
  BuildSafetySafety,
  loading: loading.models.BuildSafetySafety,
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

  state = { fileList: [], field: {}, cateIndex: 0 };

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
      field: { ...field, ...changedFields },
    }));
  };

  save = () => {
    this.MyForm.current.validateFields((err, fieldValue) => {
      if (err) return;
      const { dispatch, modalCallback } = this.props;
      const { fileList } = this.state;
      // if (!fileList.length) {
      //   message.error('请选择文件');
      //   return;
      // }

      const values = {
        ...fieldValue,
        annexUrl: fileList.length ? fileList[0].response.filePath : '',
      };

      dispatch({
        type: 'BuildSafetySafety/add',
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

  render() {
    const { loading, modalVisible } = this.props;
    const { fileList, field, cateIndex } = this.state;
    return (
      <Modal
        destroyOnClose
        title="新建质量安全监督"
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
        <div className={themeStyle.formModalBody}>
          <MyForm
            cateIndex={cateIndex}
            setCateIndex={this.setCateIndex}
            onChange={this.fieldChange}
            uploadChange={this.uploadChange}
            fileList={fileList}
            field={field}
            ref={this.MyForm}
          />
        </div>
      </Modal>
    );
  }
}

export default CreateModal;
