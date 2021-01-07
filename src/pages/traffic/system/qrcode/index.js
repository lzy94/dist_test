import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Upload, Card, Icon, Form, Button, Input, Modal, message } from 'antd';
import { imageBeforeUpload, getLocalStorage, imgUrl } from '@/utils/utils';
import notImg from '@/assets/notImg.png';
import themeStyle from '@/pages/style/theme.less';

const FormItem = Form.Item;

const UploadModal = Form.create()(props => {
  const { form, fileList, visible, handleVisible, handleAdd, uploadChange, detail } = props;

  const uploadConfig = {
    name: 'files',
    action: '/result/api/file/v1/fileUpload',
    listType: 'picture',
    accept: '.jpg,.jpeg,.png',
    data: {
      type: 9,
      xbType: '',
    },
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    beforeUpload: imageBeforeUpload,
    onChange: uploadChange,
  };

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const value = { ...fieldsValue };
      if (Object.keys(detail).length) {
        value.id = detail.id;
      }
      handleAdd(value, () => form.resetFields());
    });
  };

  return (
    <Modal
      destroyOnClose
      title="上传二维码"
      className={themeStyle.formModal}
      visible={visible}
      onOk={okHandle}
      onCancel={() => handleVisible()}
    >
      <FormItem label="图片">
        {form.getFieldDecorator('qrCode', {
          initialValue: detail.qrCode,
        })(
          <Upload {...uploadConfig} defaultFileList={fileList}>
            {fileList.length > 0 ? null : (
              <Button>
                <Icon type="upload" /> 图片
              </Button>
            )}
          </Upload>,
        )}
      </FormItem>
      <FormItem label="版本号">
        {form.getFieldDecorator('qrVersion', {
          initialValue: detail.qrVersion,
        })(<Input placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
});

@connect(({ QrcodeSystem, loading }) => ({
  QrcodeSystem,
  loading: loading.models.QrcodeSystem,
}))
@Form.create()
class Qrcode extends PureComponent {
  state = {
    visible: false,
    fileList: [],
  };

  componentDidMount() {
    this.getList();
  }

  getList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'QrcodeSystem/fetch',
      payload: {
        pageBean: {
          page: 1,
          pageSize: 1,
          showTotal: true,
        },
      },
      callback: () => {
        const {
          QrcodeSystem: { data },
        } = this.props;
        if (data.length) {
          this.setState({
            fileList: [
              {
                uid: '-1',
                name: 'App 二维码',
                status: 'done',
                url: imgUrl + data[0].qrCode,
                thumbUrl: imgUrl + data[0].qrCode,
              },
            ],
          });
        }
      },
    });
  };

  handleVisible = flag => {
    this.setState({
      visible: !!flag,
    });
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

  handleAdd = fields => {
    const values = { ...fields };
    if (typeof fields.qrCode === 'object') {
      const { response } = fields.qrCode.file;
      values.qrCode = response ? response.filePath : '';
    }

    const { dispatch } = this.props;
    dispatch({
      type: 'QrcodeSystem/saveData',
      payload: values,
      callback: () => {
        this.handleVisible();
        this.getList();
      },
    });
  };

  render() {
    const {
      QrcodeSystem: { data },
    } = this.props;
    const { visible, fileList } = this.state;
    const src = data.length ? imgUrl + data[0].qrCode : notImg;
    return (
      <Card bordered={false} style={{ height: '100%' }}>
        <Button
          style={{ marginBottom: 10 }}
          type="primary"
          onClick={() => this.handleVisible(true)}
        >
          <Icon type="upload" /> 上传二维码
        </Button>
        <br />
        <img style={{ maxWidth: '100%' }} src={src} alt="" />
        {visible && (
          <UploadModal
            visible={visible}
            fileList={fileList}
            detail={data.length ? data[0] : {}}
            handleAdd={this.handleAdd}
            uploadChange={this.uploadChange}
            handleVisible={this.handleVisible}
          />
        )}
      </Card>
    );
  }
}

export default Qrcode;
