import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Button, message, Card } from 'antd';

import { imgUrl } from '@/utils/utils';

import MyForm from './Form';

import themeStyle from '@/pages/style/theme.less';

@connect(({ BuildSafetySafety, loading }) => ({
  BuildSafetySafety,
  loading: loading.models.BuildSafetySafety,
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
    cateIndex: 0,
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
        field: detail,
        detail: values,
        // field: detail,
        fileList: detail.annexUrl
          ? [
              {
                uid: '-1',
                name: '当前文件',
                status: 'done',
                url: imgUrl + detail.annexUrl,
              },
            ]
          : [],
      };
    }
    return null;
  }

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
    this.setState(({ detail }) => ({
      detail: {
        ...detail,
        ...changedFields,
      },
    }));
  };

  save = () => {
    this.MyForm.current.validateFields((err, fieldValue) => {
      if (err) return;
      const { dispatch, modalCallback } = this.props;
      const { field, detail } = this.state;
      // if (!fileList.length) {
      //   message.error('请选择文件');
      //   return;
      // }
      const values = {
        ...field,
        ...fieldValue,
      };
      const newDetail = { ...detail };
      const keys = Object.keys(fieldValue);
      for (let i = 0; i < keys.length; i += 1) {
        // values[keys[i]] = fieldValue[keys[i]];/
        newDetail[keys[i]] = {
          value: fieldValue[keys[i]],
        };
      }

      if (typeof fieldValue.annexUrl === 'object') {
        const { response } = fieldValue.annexUrl.file;
        values.annexUrl = response ? response.filePath : '';
      }
      this.setState({ detail: newDetail });
      dispatch({
        type: 'BuildSafetySafety/add',
        payload: values,
        callback: () => {
          message.success('编辑成功');
          modalCallback();
          this.cancelClick();
        },
      });
    });
  };

  setCateIndex = index => {
    this.setState({ cateIndex: index });
  };

  cancelClick = () => {
    const { handleModalVisible } = this.props;
    handleModalVisible();
  };

  render() {
    const { loading, modalVisible } = this.props;
    const { detail, fileList, cateIndex } = this.state;
    return (
      <Modal
        destroyOnClose
        title="编辑质量安全监督"
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
            onChange={this.fieldChange}
            uploadChange={this.uploadChange}
            cateIndex={cateIndex}
            setCateIndex={this.setCateIndex}
            fileList={fileList}
            field={detail}
            ref={this.MyForm}
          />
        </div>
      </Modal>
    );
  }
}

export default UpdateModal;
