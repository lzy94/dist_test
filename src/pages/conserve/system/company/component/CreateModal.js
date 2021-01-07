import React, { PureComponent } from 'react';
import {
  Input,
  Modal,
  Form,
  Row,
  Col,
  Button,
  DatePicker,
  Upload,
  message,
  Icon,
  Checkbox,
} from 'antd';
import { connect } from 'dva';
import { checkPhone, getLocalStorage, imageBeforeUpload } from '@/utils/utils';
import themeStyle from '@/pages/style/theme.less';

const { RangePicker } = DatePicker;

const FormItem = Form.Item;

@connect(({ RoadConserveTag, ConserveCompany, loading }) => ({
  RoadConserveTag,
  ConserveCompany,
  loading: loading.models.ConserveCompany,
}))
@Form.create()
class CreateModal extends PureComponent {
  state = {
    fileList: [],
  };

  componentDidMount() {
    this.getTag();
  }

  getTag = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'RoadConserveTag/fetch',
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
    const { form, dispatch, handleModalVisible, modalSuccess } = this.props;
    const { fileList } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
      };
      if (!fileList.length) {
        message.error('请选择图片');
        return;
      }

      values.contractPicture = values.contractPicture
        ? values.contractPicture.file.response.filePath
        : '';
      values.agreementBeginTime = values.time[0];
      values.agreementEndTime = values.time[1];
      values.conserveCategoryId = values.conserveCategoryId.join();
      dispatch({
        type: 'ConserveCompany/add',
        payload: values,
        callback: () => {
          message.success('添加成功');
          handleModalVisible();
          modalSuccess();
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
    const {
      RoadConserveTag: { data },
      modalVisible,
      handleModalVisible,
      form,
      loading,
    } = this.props;
    const { fileList } = this.state;

    return (
      <Modal
        destroyOnClose
        title="新建企业"
        className={themeStyle.formModal}
        visible={modalVisible}
        width={800}
        // onOk={okHandle}
        onCancel={() => handleModalVisible()}
        footer={[
          <Button key="back" onClick={() => handleModalVisible()}>
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
              <FormItem label="企业名称">
                {form.getFieldDecorator('companyName', {
                  rules: [{ required: true, message: '请输入企业名称！' }],
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem label="企业编号">
                {form.getFieldDecorator('companyCode', {
                  rules: [{ required: true, message: '请输入企业编号！' }],
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem label="法人代表">
                {form.getFieldDecorator('companyHeader', {
                  rules: [{ required: true, message: '请输入法人代表！' }],
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem label="联系方式">
                {form.getFieldDecorator('companyTel', {
                  rules: [
                    {
                      required: true,
                      validator: checkPhone,
                    },
                  ],
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem label="合约签订时间">
                {form.getFieldDecorator('time', {
                  rules: [{ required: true, message: '请选择合约签订时间！' }],
                })(<RangePicker />)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem label="合同上传">
                {form.getFieldDecorator('contractPicture', {
                  rules: [{ required: true, message: '请上传合约附件！' }],
                })(
                  <Upload {...this.uploadConfig()} defaultFileList={fileList}>
                    {fileList.length > 0 ? null : (
                      <Button>
                        <Icon type="upload" /> 请上传合约附件
                      </Button>
                    )}
                  </Upload>,
                )}
              </FormItem>
            </Col>
            <Col md={24} sm={24}>
              <FormItem label="合同签订内容">
                {form.getFieldDecorator('agreement', {
                  rules: [{ required: true, message: '请输入合同签订内容！' }],
                })(<Input.TextArea rows={4} />)}
              </FormItem>
            </Col>
            <Col md={24} sm={24}>
              <FormItem label="企业介绍">
                {form.getFieldDecorator('companyDesc', {
                  rules: [{ required: true, message: '请输入企业介绍！' }],
                })(<Input.TextArea rows={4} />)}
              </FormItem>
            </Col>
            <Col md={24} sm={24}>
              <FormItem label="企业标签">
                {form.getFieldDecorator('conserveCategoryId', {
                  rules: [{ required: true, message: '请选择企业标签！' }],
                })(
                  <Checkbox.Group>
                    {data.list.map((item, index) => (
                      <Checkbox value={item.id} key={index}>
                        {item.tagName}
                      </Checkbox>
                    ))}
                  </Checkbox.Group>,
                )}
              </FormItem>
            </Col>
          </Row>
        </div>
      </Modal>
    );
  }
}

export default CreateModal;
