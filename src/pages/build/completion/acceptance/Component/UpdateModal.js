import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Button, message, Card } from 'antd';

import { imgUrl } from '@/utils/utils';

import MyForm from './Form';

import themeStyle from '@/pages/style/theme.less';

@connect(({ BuildCompletionAcceptance, loading }) => ({
  BuildCompletionAcceptance,
  loading: loading.models.BuildCompletionAcceptance,
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
    // const key = Object.keys(changedFields).join();
    this.setState(({ field }) => ({
      field: {
        ...field,
        ...changedFields,
        // [key]:
        //   typeof changedFields[key] === 'object'
        //     ? moment(changedFields[key]).format('YYYY-MM-DD')
        //     : changedFields[key],
      },
    }));
  };

  save = () => {
    this.MyForm.current.validateFields((err, fieldValue) => {
      if (err) return;
      const { dispatch, modalCallback } = this.props;
      const { field, fileList } = this.state;
      if (!fileList.length) {
        message.error('请选择文件');
        return;
      }
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
        type: 'BuildCompletionAcceptance/add',
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
    const { field, fileList } = this.state;
    return (
      <Modal
        destroyOnClose
        title="编辑验收情况登记"
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

export default UpdateModal;
