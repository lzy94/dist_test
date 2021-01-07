import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Modal,
  Button,
  Form,
  Input,
  Row,
  Col,
  message,
  InputNumber,
  Upload,
  Icon,
  Select,
} from 'antd';
import { getLocalStorage, fileUrl, filePDZ } from '@/utils/utils';
import { typeNames, frequency } from '@/utils/dictionaries';

import TemplateModal from '../../../Component/TemplateModal';
import FirmleModal from '../../../Component/FirmModal';

import themeStyle from '@/pages/style/theme.less';

const FormItem = Form.Item;
const { Option } = Select;

/* eslint react/no-multi-comp:0 */
@connect(({ TransportDangerPeriodic, loading }) => ({
  TransportDangerPeriodic,
  loading: loading.models.TransportDangerPeriodic,
}))
@Form.create()
class UpdateModal extends PureComponent {
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
    fileName: '',
    detail: {},
  };

  static getDerivedStateFromProps(props, state) {
    const { detail } = props;
    const { isSet } = state;
    const fileName = detail.fileName ? detail.fileName.split(',') : [];
    const fileList = detail.fielUrls
      ? detail.fielUrls.split(',').map((item, i) => ({
          uid: i,
          name: fileName[i],
          status: 'done',
          url: `${fileUrl}${item}`,
          path: item,
        }))
      : [];
    if (!isSet) {
      return {
        detail,
        tempId: detail.tempId,
        companyId: detail.companyId,
        fileName: detail.fileName,
        fileList,
        isSet: !isSet,
      };
    }
    return null;
  }

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

  setSelectFirm = detail => {
    const { form } = this.props;
    this.setState({ companyId: detail.id_ });
    form.setFieldsValue({
      companyName: detail.companyName,
    });
  };

  handleChange = ({ fileList }) => this.setState({ fileList });

  uploadConfig = () => {
    return {
      name: 'files',
      accept: 'pdf,doc,docx,zip',
      action: '/result/api/file/v1/fileUpload',
      // listType: 'picture-card',
      // className: 'upload-list-inline',
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
    const { tempId, companyId, detail, fileName } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        tempId,
        companyId,
        fileName,
      };
      if (typeof values.fielUrls === 'object') {
        const paths = values.fielUrls.fileList.map(item => item.response.filePath);
        const names = values.fielUrls.fileList.map(item => item.response.fileName);
        values.fielUrls = paths.join();
        values.fileName = names.join();
      }
      const newDetail = JSON.parse(JSON.stringify(detail));
      const keys = Object.keys(values);
      for (let i = 0; i < keys.length; i += 1) {
        newDetail[keys[i]] = values[keys[i]];
      }
      this.setState({ detail: newDetail });
      dispatch({
        type: 'TransportDangerPeriodic/UAData',
        payload: newDetail,
        callback: () => {
          message.success('编辑成功');
          handleModalVisible();
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
    const { fileList, templateVisible, firmMultipleVisbile, detail } = this.state;
    return (
      <Fragment>
        <Modal
          destroyOnClose
          title="编辑周期性督查"
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
                    initialValue: detail.name,
                    rules: [{ required: true, message: '请输入名称！' }],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem label="督查类别">
                  {form.getFieldDecorator('type', {
                    initialValue: parseInt(detail.type, 10),
                    rules: [{ required: true, message: '请选择督查类别！' }],
                  })(
                    <Select style={{ width: '100%' }} placeholder="请选择">
                      {typeNames.map((item, i) => (
                        <Option value={i + 1} key={i}>
                          {item}
                        </Option>
                      ))}
                    </Select>,
                  )}
                </FormItem>
                <FormItem label="模板">
                  {form.getFieldDecorator('tempName', {
                    initialValue: detail.tempName,
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
                    initialValue: detail.title,
                    rules: [{ required: true, message: '请输入标题！' }],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem label="频率">
                  {form.getFieldDecorator('frequency', {
                    initialValue: detail.frequency,
                    rules: [{ required: true, message: '请选择频率！' }],
                  })(
                    <Select style={{ width: '100%' }} placeholder="请选择">
                      {frequency.map((item, i) => (
                        <Option value={item} key={i}>
                          {item}
                        </Option>
                      ))}
                    </Select>,
                  )}
                </FormItem>
                <FormItem label="期限天数">
                  {form.getFieldDecorator('term', {
                    initialValue: detail.term,
                    rules: [{ required: true, message: '请输入期限天数！' }],
                  })(<InputNumber style={{ width: '100%' }} placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={24} sm={24}>
                <FormItem label="督查对象">
                  {form.getFieldDecorator('companyName', {
                    initialValue: detail.companyName,
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
                    initialValue: detail.desc,
                    rules: [{ required: true, message: '请输入情况说明概要！' }],
                  })(<Input.TextArea placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={24} sm={24}>
                <FormItem label="附件">
                  {form.getFieldDecorator('fielUrls', {
                    initialValue: detail.fielUrls,
                  })(
                    <Upload {...this.uploadConfig()} fileList={fileList}>
                      {fileList.length > 0 ? null : (
                        <Button>
                          <Icon type="upload" /> 选择附件！(pdf,doc,docx,zip)
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
          <FirmleModal
            setSelectData={this.setSelectFirm}
            handleModalVisible={this.handleFirmMultipleVisbile}
            modalVisible={firmMultipleVisbile}
          />
        )}
      </Fragment>
    );
  }
}

export default UpdateModal;
