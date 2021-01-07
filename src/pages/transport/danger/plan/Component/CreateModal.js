import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Modal, Button, Form, Input, Row, Col, message, InputNumber, Upload, Icon } from 'antd';
import { getLocalStorage, filePDZ } from '@/utils/utils';

import TemplateModal from '../../../Component/TemplateModal';
import FirmMultipleModal from '../../../Component/FirmMultipleModal';

import themeStyle from '@/pages/style/theme.less';

const FormItem = Form.Item;

/* eslint react/no-multi-comp:0 */
@connect(({ TransportDangerPlan, loading }) => ({
  TransportDangerPlan,
  loading: loading.models.TransportDangerPlan,
}))
@Form.create()
class CreateModal extends PureComponent {
  static defaultProps = {
    modalVisible: false,
    handleModalVisible: () => {},
  };

  state = {
    templateVisible: false,
    firmMultipleVisbile: false,
    tempId: '',
    companyId: '',
    fileList: [],
  };

  handleTemplateVisible = flag => {
    this.setState({
      templateVisible: !!flag,
    });
  };

  handleFirmMultipleVisbile = flag => {
    this.setState({ firmMultipleVisbile: !!flag });
  };

  setSelectData = (tempId, name) => {
    const { form } = this.props;
    this.setState({ tempId });
    form.setFieldsValue({
      tempName: name,
    });
  };

  setSelectFirm = (companyId, name) => {
    const { form } = this.props;
    this.setState({ companyId });
    form.setFieldsValue({
      companyName: name,
    });
  };

  handleChange = ({ fileList }) => this.setState({ fileList });

  uploadConfig = () => {
    return {
      name: 'files',
      action: '/result/api/file/v1/fileUpload',
      // listType: 'picture-card',
      // className: 'upload-list-inline',
      accept: '.pdf,.doc,.docx,.zip',
      data: {
        type: 9,
      },
      headers: {
        Authorization: `Bearer ${getLocalStorage('token')[0]}`,
        'x-requested-with': 'XMLHttpRequest',
      },
      beforeUpload: filePDZ,
      onChange: this.handleChange,
      // onPreview: this.handlePreview,
    };
  };

  save = () => {
    const { dispatch, form, modalCallback, handleModalVisible } = this.props;
    const { tempId, companyId, fileList } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        tempId,
        companyId,
        status: 1,
      };

      const paths = fileList.map(item => item.response.filePath);
      const names = fileList.map(item => item.response.fileName);
      values.fielUrls = paths.join();
      values.fileName = names.join();
      dispatch({
        type: 'TransportDangerPlan/UAData',
        payload: values,
        callback: () => {
          message.success('添加成功');
          handleModalVisible();
          this.setState({ fileList: [] });
          setTimeout(() => modalCallback(), 300);
        },
      });
    });
    return null;
  };

  cancelClick = () => {
    const { handleModalVisible } = this.props;
    this.setState({ fileList: [] });
    handleModalVisible();
  };

  render() {
    const { form, modalVisible, loading } = this.props;
    const { fileList, templateVisible, firmMultipleVisbile } = this.state;
    return (
      <Fragment>
        <Modal
          destroyOnClose
          title="添加专项督查"
          className={themeStyle.formModal}
          visible={modalVisible}
          width={700}
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
            <Row gutter={20}>
              <Col md={12} sm={24}>
                <FormItem label="名称">
                  {form.getFieldDecorator('name', {
                    rules: [{ required: true, message: '请输入名称！' }],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem label="模板">
                  {form.getFieldDecorator('tempName', {
                    rules: [{ required: true, message: '请选择模板！' }],
                  })(
                    <Input
                      readOnly
                      placeholder="请选择"
                      onClick={() => this.handleTemplateVisible(true)}
                    />,
                  )}
                </FormItem>
              </Col>
              <Col md={12} sm={24}>
                <FormItem label="标题">
                  {form.getFieldDecorator('title', {
                    rules: [{ required: true, message: '请输入标题！' }],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem label="期限天数">
                  {form.getFieldDecorator('term', {
                    rules: [{ required: true, message: '请输入期限天数！' }],
                  })(<InputNumber style={{ width: '100%' }} placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={24} sm={24}>
                <FormItem label="督查对象">
                  {form.getFieldDecorator('companyName', {
                    rules: [{ required: true, message: '请选择督查对象！' }],
                  })(
                    <Input.TextArea
                      readOnly
                      placeholder="请选择"
                      onClick={() => this.handleFirmMultipleVisbile(true)}
                    />,
                  )}
                </FormItem>
              </Col>
              <Col md={24} sm={24}>
                <FormItem label="情况说明概要">
                  {form.getFieldDecorator('desc', {
                    rules: [{ required: true, message: '请输入情况说明概要！' }],
                  })(<Input.TextArea placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={24} sm={24}>
                <FormItem label="附件">
                  {form.getFieldDecorator('fielUrls', {})(
                    <Upload {...this.uploadConfig()} fileList={fileList}>
                      {fileList.length > 0 ? null : (
                        <Button>
                          <Icon type="upload" /> 选择附件！(pdf , doc, docx, zip)
                        </Button>
                      )}
                    </Upload>,
                  )}
                </FormItem>
              </Col>
            </Row>
          </div>
        </Modal>
        {templateVisible && (
          <TemplateModal
            setSelectData={this.setSelectData}
            handleModalVisible={this.handleTemplateVisible}
            modalVisible={templateVisible}
          />
        )}
        {firmMultipleVisbile && (
          <FirmMultipleModal
            setSelectData={this.setSelectFirm}
            handleModalVisible={this.handleFirmMultipleVisbile}
            modalVisible={firmMultipleVisbile}
          />
        )}
      </Fragment>
    );
  }
}

export default CreateModal;
