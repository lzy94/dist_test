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
  Radio,
} from 'antd';
import { getLocalStorage, imgUrl, imageBeforeUpload } from '@/utils/utils';

import FirmModal from '../../../Component/FirmModal';

import themeStyle from '@/pages/style/theme.less';

const FormItem = Form.Item;
const statusMap = ['审核中', '已审核', '已驳回', '已报废', '已删除'];

@connect(({ TransportArchivesCar, loading }) => ({
  TransportArchivesCar,
  loading: loading.models.TransportArchivesCar,
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
    companyTel: '',
    isSet: false,
  };

  static getDerivedStateFromProps(props, state) {
    const { detail } = props;
    const { isSet } = state;
    if (!isSet) {
      const { companyTel, carImg } = detail;
      return {
        isSet: !isSet,
        detail,
        companyTel,
        fileList: carImg
          ? [
              {
                uid: '-1',
                name: '当前图片',
                status: 'done',
                url: /http/.test(carImg) ? carImg : imgUrl + carImg,
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
    this.setState({ companyTel: detail.account });
    form.setFieldsValue({
      companyName: detail.companyName,
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
    const { companyTel, detail, fileList } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (!fileList.length) {
        return message.error('请选择图片');
      }
      const values = {
        ...fieldsValue,
        companyTel,
      };

      if (typeof values.img === 'object') {
        const { response } = values.img.file;
        values.carImg = response ? response.filePath : '';
      }

      delete values.img;

      const newDetail = JSON.parse(JSON.stringify(detail));
      const keys = Object.keys(values);
      for (let i = 0; i < keys.length; i += 1) {
        newDetail[keys[i]] = values[keys[i]];
      }
      dispatch({
        type: 'TransportArchivesCar/AUData',
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
                <FormItem label="车牌号">
                  {form.getFieldDecorator('carNo', {
                    initialValue: detail.carNo,
                    rules: [{ required: true, message: '请输入车牌号！' }],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem label="吨位(kg)">
                  {form.getFieldDecorator('tonnage', {
                    initialValue: detail.tonnage,
                    rules: [{ required: true, message: '请输入吨位！' }],
                  })(<InputNumber min={0} style={{ width: '100%' }} placeholder="请输入" />)}
                </FormItem>
                <FormItem label="座位">
                  {form.getFieldDecorator('seat', {
                    initialValue: detail.seat,
                    rules: [{ required: true, message: '请输入座位！' }],
                  })(<InputNumber min={1} style={{ width: '100%' }} placeholder="请输入" />)}
                </FormItem>
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
                <FormItem label="照片">
                  {form.getFieldDecorator('img', {
                    initialValue: detail.carImg,
                    rules: [{ required: true, message: '请上传照片' }],
                  })(
                    <Upload {...this.uploadConfig()} defaultFileList={fileList}>
                      {fileList.length > 0 ? null : (
                        <Button>
                          <Icon type="upload" /> 请上传照片(jpg,jpeg,png)
                        </Button>
                      )}
                    </Upload>,
                  )}
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
              <Col md={12} sm={24}>
                <FormItem label="车辆类型">
                  {form.getFieldDecorator('carType', {
                    initialValue: detail.carType,
                    rules: [{ required: true, message: '请输入车辆类型！' }],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem label="道路运输证号">
                  {form.getFieldDecorator('transportLicense', {
                    initialValue: detail.transportLicense,
                    rules: [{ required: true, message: '请输入道路运输证号！' }],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem label="车辆状态">
                  {form.getFieldDecorator('type', {
                    initialValue: detail.type,
                    rules: [{ required: true, message: '请选择！' }],
                  })(
                    <Radio.Group>
                      <Radio value={0}>营运</Radio>
                      <Radio value={1}>停运</Radio>
                    </Radio.Group>,
                  )}
                </FormItem>
                <FormItem label="GPS入网">
                  {form.getFieldDecorator('isAccessNetwork', {
                    initialValue: detail.isAccessNetwork,
                    rules: [{ required: true, message: '请选择！' }],
                  })(
                    <Radio.Group>
                      <Radio value={1}>是</Radio>
                      <Radio value={2}>否</Radio>
                    </Radio.Group>,
                  )}
                </FormItem>
                <FormItem label="经营范围">
                  {form.getFieldDecorator('businessScope', {
                    initialValue: detail.businessScope,
                    rules: [{ required: true, message: '请输入经营范围！' }],
                  })(<Input.TextArea placeholder="请输入" />)}
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
