import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Modal, Form, Input, Button, Row, Col, message, Upload, Icon, Radio } from 'antd';
import { getLocalStorage, checkPhone, imageBeforeUpload, checkIdCard } from '@/utils/utils';

import FirmModal from '../../../Component/FirmModal';

import themeStyle from '@/pages/style/theme.less';

const FormItem = Form.Item;

@connect(({ TransportArchivesPersonnel, loading }) => ({
  TransportArchivesPersonnel,
  loading: loading.models.TransportArchivesPersonnel,
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
    companyId: '',
  };

  handleFirmModalVisible = flag => {
    this.setState({ modalFirmVisible: !!flag });
  };

  setSelectData = detail => {
    const { form } = this.props;
    // eslint-disable-next-line no-underscore-dangle
    this.setState({ companyId: detail.id_ });
    form.setFieldsValue({
      companyName: detail.companyName,
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
    const { fileList, companyId } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (!fileList.length) {
        return message.error('请选择图片');
      }
      const values = {
        ...fieldsValue,
        companyId,
        img: fileList.length ? fileList[0].response.filePath : '',
        status: 2,
      };
      delete values.imgPath;
      dispatch({
        type: 'TransportArchivesPersonnel/add',
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
                <FormItem label="姓名">
                  {form.getFieldDecorator('userName', {
                    rules: [{ required: true, message: '请输入姓名！' }],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem label="性别">
                  {form.getFieldDecorator('sex', {
                    initialValue: 1,
                    rules: [{ required: true, message: '请选择性别！' }],
                  })(
                    <Radio.Group>
                      <Radio value={1}>男</Radio>
                      <Radio value={2}>女</Radio>
                    </Radio.Group>,
                  )}
                </FormItem>
                <FormItem label="联系方式">
                  {form.getFieldDecorator('tel', {
                    rules: [
                      {
                        required: true,
                        validator: checkPhone,
                      },
                    ],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem label="身份证号码">
                  {form.getFieldDecorator('idcard', {
                    rules: [{ required: true, validator: checkIdCard }],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem label="职务">
                  {form.getFieldDecorator('position', {
                    rules: [{ required: true, message: '请输入职务！' }],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem label="照片">
                  {form.getFieldDecorator('imgPath', {
                    rules: [{ required: true, message: '请上传照片！' }],
                  })(
                    <Upload {...this.uploadConfig()} defaultFileList={fileList}>
                      {fileList.length > 0 ? null : (
                        <Button>
                          <Icon type="upload" /> 请上传照片(.jpg,.jpeg,.png)
                        </Button>
                      )}
                    </Upload>,
                  )}
                </FormItem>
              </Col>
              <Col md={12} sm={24}>
                <FormItem label="人员类别">
                  {form.getFieldDecorator('type', {
                    initialValue: 1,
                    rules: [{ required: true, message: '请选择人员类别！' }],
                  })(
                    <Radio.Group>
                      <Radio value={1}>管理员</Radio>
                      <Radio value={2}>驾驶员</Radio>
                    </Radio.Group>,
                  )}
                </FormItem>
                <FormItem label="学历（驾驶员可不填）">
                  {form.getFieldDecorator('education', {
                    rules: [{ message: '请输入学历！' }],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem label="从业资格证号（管理员可不填）">
                  {form.getFieldDecorator('practitionLicense', {
                    rules: [{ message: '请输入从业资格证号！' }],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
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
                <FormItem label="公司联系电话">
                  {form.getFieldDecorator('companyTel', {
                    rules: [{ required: true, message: '请输入公司联系电话码！' }],
                  })(<Input placeholder="请输入" />)}
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
