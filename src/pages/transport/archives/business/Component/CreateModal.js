import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Modal,
  Form,
  Input,
  Button,
  Row,
  Col,
  message,
  Upload,
  InputNumber,
  Icon,
  DatePicker,
} from 'antd';
import moment from 'moment';
import { getLocalStorage, imageBeforeUpload } from '@/utils/utils';

import FirmModal from '../../../Component/FirmModal';

import themeStyle from '@/pages/style/theme.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

@connect(({ TransportArchivesBusiness, loading }) => ({
  TransportArchivesBusiness,
  loading: loading.models.TransportArchivesBusiness,
}))
@Form.create()
class CreateModal extends PureComponent {
  static defaultProps = {
    modalVisible: false,
    handleModalVisible: () => {},
  };

  state = {
    modalFirmVisible: false,
    fileList: [],
    companyAccount: '',
  };

  handleFirmModalVisible = flag => {
    this.setState({ modalFirmVisible: !!flag });
  };

  setSelectData = detail => {
    const { form } = this.props;
    this.setState({ companyAccount: detail.account });
    form.setFieldsValue({
      companyName: detail.companyName,
      companyAddr: detail.addr,
    });
  };

  uploadConfig = () => {
    return {
      name: 'files',
      action: '/result/api/file/v1/fileUpload',
      listType: 'picture',
      accept: '.jpg,.jpeg,.png',
      className: 'upload-list-inline',
      data: {
        type: 9,
      },
      headers: {
        Authorization: `Bearer ${getLocalStorage('token')[0]}`,
        'x-requested-with': 'XMLHttpRequest',
      },
      beforeUpload: imageBeforeUpload,
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

  save = () => {
    const { dispatch, form, modalCallback, handleModalVisible } = this.props;
    const { fileList, companyAccount } = this.state;
    const format = 'YYYY-MM-DD';
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (!fileList.length) {
        return message.error('请选择图片');
      }
      const values = {
        ...fieldsValue,
        companyAccount,
        businessLicenseImg: fileList.length ? fileList[0].response.filePath : '',
        status: 2,
        businessTerm: `${moment(fieldsValue.time[0]).format(format)} 至 ${moment(
          fieldsValue.time[1],
        ).format(format)}`,
      };
      delete values.img;
      delete values.time;
      dispatch({
        type: 'TransportArchivesBusiness/add',
        payload: values,
        callback: () => {
          message.success('添加成功');
          handleModalVisible();
          setTimeout(() => modalCallback(), 300);
        },
      });
    });
  };

  cancelClick = () => {
    const { handleModalVisible } = this.props;
    this.setState({ fileList: [] });
    handleModalVisible();
  };

  render() {
    const { form, modalVisible, loading } = this.props;
    const { modalFirmVisible, fileList } = this.state;
    return (
      <Fragment>
        <Modal
          destroyOnClose
          title="添加"
          className={themeStyle.formModal}
          visible={modalVisible}
          width={800}
          onCancel={this.cancelClick}
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
            <Row gutter={40}>
              <Col md={12} sm={24}>
                <FormItem label="公司名称">
                  {form.getFieldDecorator('companyName', {
                    rules: [{ required: true, message: '请输入公司名称！' }],
                  })(
                    <Input
                      readOnly
                      placeholder="请输入"
                      onClick={() => this.handleFirmModalVisible(true)}
                    />,
                  )}
                </FormItem>
                <FormItem label="详细地址">
                  {form.getFieldDecorator('companyAddr', {
                    rules: [{ required: true, message: '请输入详细地址！' }],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem label="法人代表">
                  {form.getFieldDecorator('legalRepresentative', {
                    rules: [{ required: true, message: '请输入法人代表！' }],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem label="营业执照号">
                  {form.getFieldDecorator('businessLicense', {
                    rules: [{ required: true, message: '请输入营业执照号！' }],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem label="营业执照">
                  {form.getFieldDecorator('img', {
                    rules: [{ required: true, message: '请上传营业执照' }],
                  })(
                    <Upload {...this.uploadConfig()} defaultFileList={fileList}>
                      {!fileList.length && (
                        <Button>
                          <Icon type="upload" /> 请上传营业执照（jpg,jpeg,png）
                        </Button>
                      )}
                    </Upload>,
                  )}
                </FormItem>
              </Col>
              <Col md={12} sm={24}>
                <FormItem label="注册资本(万元)">
                  {form.getFieldDecorator('registeredCapital', {
                    rules: [{ required: true, message: '请输入注册资本！' }],
                  })(<InputNumber style={{ width: '100%' }} placeholder="请输入" />)}
                </FormItem>
                <FormItem label="上年营收(万元)">
                  {form.getFieldDecorator('lastYearRevenue', {
                    rules: [{ required: true, message: '请输入上年营收！' }],
                  })(<InputNumber style={{ width: '100%' }} placeholder="请输入" />)}
                </FormItem>
                <FormItem label="营业期限">
                  {form.getFieldDecorator('time', {
                    rules: [{ required: true, message: '请输入营业期限！' }],
                  })(<RangePicker />)}
                </FormItem>
                <FormItem label="经营范围">
                  {form.getFieldDecorator('businessScope', {
                    rules: [{ required: true, message: '请输入经营范围！' }],
                  })(<Input.TextArea autosize placeholder="请输入" />)}
                </FormItem>
              </Col>
            </Row>
          </div>
        </Modal>
        {modalFirmVisible ? (
          <FirmModal
            modalVisible={modalFirmVisible}
            setSelectData={this.setSelectData}
            handleModalVisible={this.handleFirmModalVisible}
          />
        ) : null}
      </Fragment>
    );
  }
}
export default CreateModal;
