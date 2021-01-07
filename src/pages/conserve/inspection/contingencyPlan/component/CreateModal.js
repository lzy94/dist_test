import React, { PureComponent, Fragment } from 'react';
import {
  Input,
  Modal,
  Form,
  Button,
  Row,
  Col,
  Select,
  message,
  Upload,
  Icon,
  DatePicker,
} from 'antd';
import { connect } from 'dva';
import { getLocalStorage, imageBeforeUpload } from '@/utils/utils';
import themeStyle from '@/pages/style/theme.less';
import LocationMap from '@/pages/conserve/Component/LocationMap';
import CompanyModal from './Company';

const FormItem = Form.Item;
const { Option } = Select;

/* eslint react/no-multi-comp:0 */
@connect(({ RoadWorkOrdes, system, ContingencyPlan, loading }) => ({
  system,
  RoadWorkOrdes,
  ContingencyPlan,
  loading: loading.models.ContingencyPlan,
}))
@Form.create()
class CreateModal extends PureComponent {
  state = {
    departmentUserList: [],
    curinger: '',
    companyModalVisible: false,
    value: '',
    lnglat: [],
    fileList: [],
    companyName: '',
    companyId: '',
  };

  componentDidMount() {
    this.getDepartmentUser();
  }

  getDepartmentUser = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'system/departmentUser',
      payload: { menuType: -2 },
      callback: data => {
        this.setState({ departmentUserList: data });
      },
    });
  };

  companyHandleModalVisible = flag => {
    this.setState({
      companyModalVisible: !!flag,
    });
  };

  selectDataCate = data => {
    this.setState({
      companyId: data.id,
      companyName: data.companyName,
    });
  };

  curingerChange = (value, option) => {
    this.setState({ curinger: option.props.children });
  };

  parentAddress = (value, lnglat) => {
    this.setState({ value, lnglat });
  };

  inputValue = value => {
    this.setState({ value });
  };

  handleChange = ({ fileList }) => this.setState({ fileList });

  uploadConfig = () => {
    return {
      name: 'files',
      action: '/result/api/file/v1/fileUpload',
      listType: 'picture-card',
      accept: '.jpg,.jpeg,.png',
      // className: 'upload-list-inline',
      data: {
        type: 9,
      },
      headers: {
        Authorization: `Bearer ${getLocalStorage('token')[0]}`,
        'x-requested-with': 'XMLHttpRequest',
      },
      beforeUpload: imageBeforeUpload,
      onChange: this.handleChange,
      // onPreview: this.handlePreview,
    };
  };

  save = () => {
    const { form, dispatch, handleModalVisible, modalSuccess } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { lnglat, curinger, fileList, companyId, value } = this.state;
      if (!fileList.length) return message.error('请选择图片');
      const values = {
        ...fieldsValue,
      };
      if (values.checkTime > values.endTime) {
        return message.error('限定完成时间应大于开始时间');
      }
      values.curinger = curinger;
      values.longlat = lnglat.join();
      if (!value || !lnglat.join()) {
        message.error('请获取位置');
        return;
      }
      values.curingAddr = value;
      values.state = 1;
      const paths = fileList.map(item => item.response.filePath);
      values.imgUrl = paths.join();
      values.companyId = companyId;
      dispatch({
        type: 'RoadWorkOrdes/saveData',
        payload: values,
        callback: () => {
          message.success('下发成功');
          handleModalVisible();
          // modalSuccess();
        },
      });
    });
  };

  cancelModal = () => {
    const { handleModalVisible } = this.props;
    handleModalVisible();
    this.setState({ fileList: [] });
  };

  render() {
    const { form, modalVisible, loading } = this.props;
    const { departmentUserList, fileList, companyModalVisible, companyName } = this.state;

    const parentMethods = {
      selectData: this.selectDataCate,
      handleModalVisible: this.companyHandleModalVisible,
    };

    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">请选择图片</div>
      </div>
    );

    return (
      <Fragment>
        <Modal
          destroyOnClose
          title="新建养护工单"
          className={themeStyle.formModal}
          visible={modalVisible}
          onCancel={this.cancelModal}
          width={800}
          footer={[
            <Button key="back" onClick={this.cancelModal}>
              取消
            </Button>,
            <Button key="submit" type="primary" loading={loading} onClick={this.save}>
              下发任务
            </Button>,
          ]}
        >
          <div className={themeStyle.formModalBody}>
            <Row gutter={40}>
              <Col md={12} sm={24}>
                <FormItem label="巡查人员">
                  {form.getFieldDecorator('curingerId', {
                    rules: [{ required: true, message: '请选择巡查人员！' }],
                  })(
                    <Select
                      placeholder="请选择"
                      style={{ width: '100%' }}
                      onChange={this.curingerChange}
                    >
                      {departmentUserList.map(item => (
                        <Option key={item.id} value={item.id}>
                          {item.fullname}
                        </Option>
                      ))}
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col md={12} sm={24}>
                <FormItem label="养护企业">
                  {form.getFieldDecorator('companyName', {
                    initialValue: companyName,
                    rules: [{ required: true, message: '请选择养护企业！' }],
                  })(
                    <Input
                      readOnly
                      placeholder="请选择养护企业"
                      onClick={() => this.companyHandleModalVisible(true)}
                    />,
                  )}
                </FormItem>
              </Col>
              <Col md={12} sm={24}>
                <FormItem label="开始时间">
                  {form.getFieldDecorator('checkTime', {
                    rules: [{ required: true, message: '请选择开始时间！' }],
                  })(<DatePicker style={{ width: '100%' }} placeholder="请选择" />)}
                </FormItem>
              </Col>
              <Col md={12} sm={24}>
                <FormItem label="限定完成时间">
                  {form.getFieldDecorator('endTime', {
                    rules: [{ required: true, message: '请选择限定完成时间！' }],
                  })(<DatePicker style={{ width: '100%' }} placeholder="请选择" />)}
                </FormItem>
              </Col>
              <Col md={12} sm={24}>
                <FormItem label="养护原因">
                  {form.getFieldDecorator('curingContent', {
                    rules: [{ required: true, message: '请输入养护原因！' }],
                  })(<Input.TextArea autosize placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={12} sm={24}>
                <FormItem label="工作内容">
                  {form.getFieldDecorator('workContent', {
                    rules: [{ required: true, message: '请输入工作内容！' }],
                  })(<Input.TextArea autosize placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={24} sm={24}>
                <LocationMap parentAddress={this.parentAddress} getInputValue={this.inputValue} />
              </Col>
            </Row>
          </div>

          <div className={themeStyle.formModalBody} style={{ marginTop: 10 }}>
            <h3>上传照片</h3>
            <div className="clearfix">
              <FormItem>
                {form.getFieldDecorator('imgUrl', {
                  rules: [{ required: true, message: '请上传照片！' }],
                })(
                  <Upload {...this.uploadConfig()} fileList={fileList}>
                    {fileList.length >= 3 ? null : uploadButton}
                  </Upload>,
                )}
              </FormItem>
            </div>
          </div>
        </Modal>
        {companyModalVisible ? (
          <CompanyModal modalVisible={companyModalVisible} {...parentMethods} />
        ) : null}
      </Fragment>
    );
  }
}

export default CreateModal;
