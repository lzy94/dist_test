import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Modal,
  Form,
  Input,
  Button,
  Row,
  Col,
  Radio,
  message,
  Upload,
  InputNumber,
  Icon,
  DatePicker,
} from 'antd';
import moment from 'moment';
import { getLocalStorage, imgUrl, imageBeforeUpload } from '@/utils/utils';

import FirmModal from '../../../Component/FirmModal';

import themeStyle from '@/pages/style/theme.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const statusMap = ['审核中', '已审核', '驳回'];

@connect(({ TransportArchivesBusiness, loading }) => ({
  TransportArchivesBusiness,
  loading: loading.models.TransportArchivesBusiness,
}))
@Form.create()
class UpdateModal extends PureComponent {
  static defaultProps = {
    detail: {},
    modalVisible: false,
    handleModalVisible: () => {},
  };

  state = {
    modalFirmVisible: false,
    fileList: [],
    companyAccount: '',
    detail: {},
    isSet: false,
  };

  static getDerivedStateFromProps(props, state) {
    const { detail } = props;
    const { isSet } = state;
    if (!isSet) {
      const { companyAccount, businessLicenseImg } = detail;
      return {
        isSet: !isSet,
        detail,
        companyAccount,
        fileList: businessLicenseImg
          ? [
              {
                uid: '-1',
                name: '当前图片',
                status: 'done',
                url: /http/.test(businessLicenseImg)
                  ? businessLicenseImg
                  : imgUrl + businessLicenseImg,
              },
            ]
          : [],
      };
    }
    return null;
  }

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
    const { companyAccount, detail, fileList } = this.state;
    const format = 'YYYY-MM-DD';
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (!fileList.length) {
        message.error('请选择图片');
        return;
      }
      const values = {
        ...fieldsValue,
        companyAccount,
        businessLicenseImg: fieldsValue.img,
        businessTerm: `${moment(fieldsValue.time[0]).format(format)} 至 ${moment(
          fieldsValue.time[1],
        ).format(format)}`,
      };
      delete values.img;
      delete values.time;

      if (typeof values.businessLicenseImg === 'object') {
        const { response } = values.businessLicenseImg.file;
        values.businessLicenseImg = response ? response.filePath : '';
      }
      const newDetail = JSON.parse(JSON.stringify(detail));
      const keys = Object.keys(values);
      for (let i = 0; i < keys.length; i += 1) {
        newDetail[keys[i]] = values[keys[i]];
      }
      dispatch({
        type: 'TransportArchivesBusiness/update',
        payload: newDetail,
        callback: () => {
          message.success('编辑成功');
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
    const { form, modalVisible, handleModalVisible, loading } = this.props;
    const { modalFirmVisible, fileList, detail } = this.state;
    let time = [];
    if (/至/.test(detail.businessTerm)) {
      time = detail.businessTerm.split(' 至 ');
    } else {
      time = detail.businessTerm.split('-');
    }
    const times = [
      moment(new Date(time[0]), 'YYYY-MM-DD'),
      moment(new Date(time[1]), 'YYYY-MM-DD'),
    ];
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
                    initialValue: detail.companyName,
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
                    initialValue: detail.companyAddr,
                    rules: [{ required: true, message: '请输入详细地址！' }],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem label="法人代表">
                  {form.getFieldDecorator('legalRepresentative', {
                    initialValue: detail.legalRepresentative,
                    rules: [{ required: true, message: '请输入法人代表！' }],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem label="营业执照号">
                  {form.getFieldDecorator('businessLicense', {
                    initialValue: detail.businessLicense,
                    rules: [{ required: true, message: '请输入营业执照号！' }],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem label="营业执照">
                  {form.getFieldDecorator('img', {
                    initialValue: detail.businessLicenseImg,
                    rules: [{ required: true, message: '请上传营业执照！' }],
                  })(
                    <Upload {...this.uploadConfig()} defaultFileList={fileList}>
                      {!fileList.length && (
                        <Button>
                          <Icon type="upload" /> 请上传营业执照（.jpg,.jpeg,.png）
                        </Button>
                      )}
                    </Upload>,
                  )}
                </FormItem>
              </Col>
              <Col md={12} sm={24}>
                <FormItem label="注册资本(万元)">
                  {form.getFieldDecorator('registeredCapital', {
                    initialValue: detail.registeredCapital,
                    rules: [{ required: true, message: '请输入注册资本！' }],
                  })(<InputNumber style={{ width: '100%' }} placeholder="请输入" />)}
                </FormItem>
                <FormItem label="上年营收(万元)">
                  {form.getFieldDecorator('lastYearRevenue', {
                    initialValue: detail.lastYearRevenue,
                    rules: [{ required: true, message: '请输入上年营收！' }],
                  })(<InputNumber style={{ width: '100%' }} placeholder="请输入" />)}
                </FormItem>
                <FormItem label="营业期限">
                  {form.getFieldDecorator('time', {
                    initialValue: times,
                    rules: [{ required: true, message: '请输入营业期限！' }],
                  })(<RangePicker />)}
                </FormItem>
                <FormItem label="经营范围">
                  {form.getFieldDecorator('businessScope', {
                    initialValue: detail.businessScope,
                    rules: [{ required: true, message: '请输入经营范围！' }],
                  })(<Input.TextArea autosize placeholder="请输入" />)}
                </FormItem>
                <FormItem label="状态">
                  {form.getFieldDecorator('status', {
                    initialValue: detail.status,
                    rules: [{ required: true, message: '请选择状态！' }],
                  })(
                    <Radio.Group>
                      {statusMap.map((item, i) => (
                        <Radio value={i + 1} key={i}>
                          {item}
                        </Radio>
                      ))}
                    </Radio.Group>,
                  )}
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
export default UpdateModal;
