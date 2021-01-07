import React, { PureComponent } from 'react';
import { Modal, Upload, Icon, Form, Button, message } from 'antd';
import { getLocalStorage } from '@/utils/utils';

import themeStyle from '@/pages/style/theme.less';

const FormItem = Form.Item;

@Form.create()
class ExportModal extends PureComponent {
  static defaultProps = {
    modalVisible: false,
    handleModalVisible: () => {},
  };

  state = {
    fileList: [],
  };

  uploadConfig = () => {
    const { path } = this.props;
    return {
      name: 'file',
      action: path,
      listType: 'picture',
      accept: '.xlsx,.xls',
      className: 'upload-list-inline',
      headers: {
        Authorization: `Bearer ${getLocalStorage('token')[0]}`,
        'x-requested-with': 'XMLHttpRequest',
      },
      onChange: this.uploadChange,
    };
  };

  uploadChange = info => {
    if (info.file.status === 'done') {
      if (info.file.response.code === 200) {
        const { handleModalVisible, modalCallback } = this.props;
        message.success('导入成功');
        this.setState({ fileList: info.fileList });
        handleModalVisible();
        setTimeout(() => modalCallback(), 300);
      } else {
        message.error(info.file.response.msg || info.file.response.message);
      }
    } else if (info.file.status === 'error') {
      message.error('上传失败');
    } else if (info.file.status === 'removed') {
      this.setState({ fileList: info.fileList });
    }
  };

  render() {
    const { modalVisible, handleModalVisible } = this.props;
    const { fileList } = this.state;
    return (
      <Modal
        destroyOnClose
        title="导入数据"
        className={themeStyle.formModal}
        visible={modalVisible}
        onCancel={() => handleModalVisible()}
        footer={null}
      >
        <div className={themeStyle.formModalBody}>
          <FormItem label="导入数据">
            <Upload {...this.uploadConfig()}>
              {fileList.length > 0 ? null : (
                <Button>
                  <Icon type="upload" /> 选择文件
                </Button>
              )}
            </Upload>
          </FormItem>
        </div>
      </Modal>
    );
  }
}

export default ExportModal;
