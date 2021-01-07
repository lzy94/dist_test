import React, { PureComponent } from 'react';
import { Modal, Form, Input, Upload, Button, Icon, message } from 'antd';

import { filePDZ, getLocalStorage, fileUrl } from '@/utils/utils';

import themeStyle from '@/pages/style/theme.less';

const FormItem = Form.Item;

@Form.create()
class AddModal extends PureComponent {
  static defaultProps = {
    modalVisible: false,
    detail: {},
    handleModalVisible: () => {},
    modalCallback: () => {},
    getData: () => {},
    saveData: () => {},
  };

  state = {
    detail: {},
    fileList: [],
    isSet: false,
  };

  static getDerivedStateFromProps(props, state) {
    const { detail } = props;
    const { isSet } = state;
    if (!isSet) {
      return {
        isSet: !isSet,
        detail,
        fileList: detail.publicData
          ? [
              {
                uid: '-1',
                name: '当前文件',
                status: 'done',
                url: fileUrl + detail.publicData,
              },
            ]
          : [],
      };
    }
    return null;
  }

  save = () => {
    const { form, getData, type, saveData } = this.props;
    form.validateFields((err, fieldVlaue) => {
      if (err) return;
      const { fileList, detail } = this.state;
      if (!fileList.length) {
        message.error('请选择文件');
        return;
      }
      const values = { ...fieldVlaue, key: new Date().getTime() };
      if (typeof fieldVlaue.publicData === 'object') {
        const { response } = fieldVlaue.publicData.file;
        values.publicData = response ? response.filePath : '';
      }
      if (type === 'add') {
        getData(values, type);
      } else if (type === 'edit_add') {
        getData(values, type);
      } else {
        values.id = detail.id;
        saveData(values, type);
      }
      this.cancelClick();
    });
  };

  uploadConfig = () => {
    return {
      name: 'files',
      action: '/result/api/file/v1/fileUpload',
      listType: 'picture',
      accept: '.pdf,.doc,.docx,.zip',
      className: 'upload-list-inline',
      data: {
        type: 9,
      },
      headers: {
        Authorization: `Bearer ${getLocalStorage('token')[0]}`,
        'x-requested-with': 'XMLHttpRequest',
      },
      beforeUpload: filePDZ,
      onChange: this.uploadChange,
    };
  };

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

  cancelClick = () => {
    const { handleModalVisible } = this.props;
    this.setState({ fileList: [] });
    handleModalVisible();
  };

  render() {
    const { modalVisible, form, type } = this.props;
    const { fileList, detail } = this.state;
    return (
      <Modal
        destroyOnClose
        title={type === 'add' ? '添加' : '编辑'}
        className={themeStyle.formModal}
        visible={modalVisible}
        onCancel={this.cancelClick}
        onOk={this.save}
      >
        <div className={themeStyle.formModalBody}>
          <FormItem label="项目名称">
            {form.getFieldDecorator('projectName', {
              initialValue: detail.projectName || '',
              rules: [{ required: true, message: '请输入项目名称' }],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem label="公开内容">
            {form.getFieldDecorator('publicContent', {
              initialValue: detail.publicContent || '',
              rules: [{ required: true, message: '请输入公开内容' }],
            })(<Input.TextArea placeholder="请输入" />)}
          </FormItem>
          <FormItem label="公开主题">
            {form.getFieldDecorator('publicTopic', {
              initialValue: detail.publicTopic || '',
              rules: [{ required: true, message: '请输入公开主题' }],
            })(<Input.TextArea placeholder="请输入" />)}
          </FormItem>
          <FormItem label="公开资料">
            {form.getFieldDecorator('publicData', {
              initialValue: detail.publicData || '',
              rules: [{ required: true, message: '公开资料' }],
            })(
              <Upload {...this.uploadConfig()} defaultFileList={fileList}>
                {!fileList.length && (
                  <Button>
                    <Icon type="upload" /> 公开资料( pdf , doc, docx, zip)
                  </Button>
                )}
              </Upload>,
            )}
          </FormItem>
        </div>
      </Modal>
    );
  }
}

export default AddModal;
