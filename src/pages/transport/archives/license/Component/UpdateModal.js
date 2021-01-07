import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Modal,
  Form,
  Input,
  Button,
  Row,
  Col,
  message,
  Upload,
  DatePicker,
  Icon,
  Radio,
} from 'antd';
import { getLocalStorage, imgUrl, imageBeforeUpload } from '@/utils/utils';

import FirmModal from '../../../Component/FirmModal';

import themeStyle from '@/pages/style/theme.less';

const FormItem = Form.Item;
const statusMap = ['待审核', '审核通过', '驳回'];

@connect(({ TransportArchivesLicense, loading }) => ({
  TransportArchivesLicense,
  loading: loading.models.TransportArchivesLicense,
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
    companyId: '',
  };

  static getDerivedStateFromProps(props, state) {
    const { detail } = props;
    const { isSet } = state;
    if (!isSet) {
      const { companyId, licenceImg } = detail;
      return {
        isSet: !isSet,
        detail,
        companyId,
        fileList: licenceImg
          ? [
              {
                uid: '-1',
                name: '当前图片',
                status: 'done',
                url: /http/.test(licenceImg) ? licenceImg : imgUrl + licenceImg,
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
    // eslint-disable-next-line no-underscore-dangle
    this.setState({ companyId: detail.id_ });
    form.setFieldsValue({
      companyName: detail.companyName,
      addr: detail.addr,
      companyTel: detail.account,
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
    const { companyId, detail, fileList } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (!fileList.length) {
        return message.error('请选择图片');
      }
      const values = {
        ...fieldsValue,
        companyId,
      };

      if (typeof values.img === 'object') {
        const { response } = values.licenceImg.file;
        values.licenceImg = response ? response.filePath : '';
      }
      delete values.img;
      const newDetail = JSON.parse(JSON.stringify(detail));
      const keys = Object.keys(values);
      for (let i = 0; i < keys.length; i += 1) {
        newDetail[keys[i]] = values[keys[i]];
      }
      dispatch({
        type: 'TransportArchivesLicense/update',
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
    const { form, modalVisible, loading } = this.props;
    const { modalFirmVisible, fileList, detail } = this.state;
    return (
      <Fragment>
        <Modal
          destroyOnClose
          title="编辑"
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
                <FormItem label="许可证名称">
                  {form.getFieldDecorator('licenceName', {
                    initialValue: detail.licenceName,
                    rules: [{ required: true, message: '请输入许可证名称！' }],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem label="许可证编号">
                  {form.getFieldDecorator('licenceNo', {
                    initialValue: detail.licenceNo,
                    rules: [{ required: true, message: '请输入许可证编号！' }],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem label="核发机关">
                  {form.getFieldDecorator('issuingAuth', {
                    initialValue: detail.issuingAuth,
                    rules: [{ required: true, message: '请输入核发机关！' }],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem label="许可证有效期">
                  {form.getFieldDecorator('termValidity', {
                    initialValue: moment(detail.termValidity, 'YYYY-MM-DD'),
                    rules: [{ required: true, message: '请选择许可证有效期！' }],
                  })(<DatePicker style={{ width: '100%' }} />)}
                </FormItem>
                <FormItem label="许可证照">
                  {form.getFieldDecorator('img', {
                    initialValue: detail.licenceImg,
                    rules: [{ required: true, message: '请上传营业执照' }],
                  })(
                    <Upload {...this.uploadConfig()} defaultFileList={fileList}>
                      {fileList.length > 0 ? null : (
                        <Button>
                          <Icon type="upload" /> 请上传营业执照(jpg,jpeg,png)
                        </Button>
                      )}
                    </Upload>,
                  )}
                </FormItem>
              </Col>
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
                <FormItem label="公司联系电话">
                  {form.getFieldDecorator('companyTel', {
                    initialValue: detail.companyTel,
                    rules: [{ required: true, message: '请输入公司联系电话！' }],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem label="地址">
                  {form.getFieldDecorator('addr', {
                    initialValue: detail.addr,
                    rules: [{ required: true, message: '请输入地址！' }],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem label="经营范围">
                  {form.getFieldDecorator('businessScop', {
                    initialValue: detail.businessScop,
                    rules: [{ required: true, message: '请输入经营范围！' }],
                  })(<Input.TextArea placeholder="请输入" />)}
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
