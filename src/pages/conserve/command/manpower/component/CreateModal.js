import React, { Fragment, PureComponent } from 'react';
import {
  Input,
  Modal,
  Form,
  Button,
  Row,
  Col,
  Select,
  DatePicker,
  Upload,
  Icon,
  message,
} from 'antd';
import themeStyle from '@/pages/style/theme.less';
import { connect } from 'dva';
import { getPlanObject, planRank } from '@/utils/dictionaries';
import { getLocalStorage, imageBeforeUpload, getBase64 } from '@/utils/utils';

import LocationMap from '@/pages/conserve/Component/LocationMap';
import PlanmanagementModal from '@/pages/conserve/Component/PlanmanagementModal';

const FormItem = Form.Item;
const { Option } = Select;

let planObject = [[], []];

/* eslint react/no-multi-comp:0 */
@connect(({ system, Manpower, loading }) => ({
  system,
  Manpower,
  loading: loading.models.Manpower,
}))
@Form.create()
class CreateModal extends PureComponent {
  constructor(props) {
    super(props);
    planObject = getPlanObject();
  }

  state = {
    departmentUserList: [],
    charger: '',
    fileList: [],
    address: '',
    lnglat: [],
    categoryName: '',
    pModalVisible: false,
    planName: '',
    dealType: '',
    chargerId: '',
    previewImage: '',
    previewVisible: false,
  };

  componentDidMount() {
    // this.getDepartmentUser();
  }

  //
  // getDepartmentUser = () => {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'system/departmentUser',
  //     payload: { menuType: -2 },
  //     callback: data => {
  //       this.setState({ departmentUserList: data });
  //     },
  //   });
  // };

  handleChange = ({ fileList }) => this.setState({ fileList });

  // handleChange = info => {
  //   console.log(info);
  //   if (info.file.status === 'done') {
  //     if (info.file.response.code === 200) {
  //       message.success('上传成功');
  //       this.setState({ fileList: info.fileList });
  //     } else {
  //       message.error(info.file.response.code.msg);
  //     }
  //   } else if (info.file.status === 'error') {
  //     message.error('上传失败');
  //   } else if (info.file.status === 'removed') {
  //     this.setState({ fileList: info.fileList });
  //   }
  // };

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
      onPreview: this.handlePreview,
    };
  };

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
    });
    this.handleCancel(true);
  };

  //
  // chargerChange = (value, option) => {
  //   this.setState({ charger: option.props.children });
  // };

  handleCancel = flag => this.setState({ previewVisible: !!flag });

  categoryChange = (value, option) => {
    this.setState({ categoryName: option.props.children });
  };

  parentAddress = (address, lnglat) => {
    this.setState({ address, lnglat });
  };

  getInputValue = address => this.setState({ address });

  selectData = data => {
    this.setState({
      planName: data.planName,
      dealType: data.dealType,
      chargerId: data.chargerId,
      charger: data.charger,
    });
  };

  save = () => {
    const { form, dispatch, modalSuccess } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
      };
      const { charger, fileList, lnglat, categoryName, address, chargerId, dealType } = this.state;
      if (!fileList.length) {
        message.error('请选择图片');
        return;
      }
      if (!address) {
        message.error('请获取地址');
        return;
      }
      values.dealType = dealType;
      values.charger = charger;
      values.chargerId = chargerId;
      values.categoryName = categoryName;
      values.addr = address;
      // values.charger = charger;
      values.longitude = lnglat[0];
      values.latitudel = lnglat[1];
      values.state = 2;
      const paths = fileList.map(item => item.response.filePath);
      values.imgUrl = paths.join();
      dispatch({
        type: 'Manpower/add',
        payload: values,
        callback: () => {
          message.success('添加成功');
          modalSuccess();
          this.cancelClick();
        },
      });
    });
  };

  handlePModalVisible = flag => {
    this.setState({ pModalVisible: !!flag });
  };

  cancelClick = () => {
    const { handleModalVisible } = this.props;
    handleModalVisible();
    this.setState({ fileList: [] });
  };

  render() {
    const { modalVisible, form, loading, cateList } = this.props;
    const { fileList, planName, pModalVisible, previewVisible, previewImage } = this.state;
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
          title="新建人员调动"
          className={themeStyle.formModal}
          visible={modalVisible}
          onCancel={this.cancelClick}
          width={800}
          footer={[
            <Button key="back" onClick={this.cancelClick}>
              取消
            </Button>,
            <Button key="submit" type="primary" loading={loading} onClick={this.save}>
              下发任务
            </Button>,
          ]}
        >
          <div className={themeStyle.formModalBody}>
            <h3>填写信息</h3>
            <Row gutter={40}>
              <Col md={12} sm={24}>
                <FormItem label="对象">
                  {form.getFieldDecorator('planObject', {
                    rules: [{ required: true, message: '请选择对象！' }],
                  })(
                    <Select style={{ width: '100%' }} placeholder="请选择">
                      {planObject[1].map((item, index) => (
                        <Option key={planObject[0][index]} value={planObject[0][index]}>
                          {item}
                        </Option>
                      ))}
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col md={12} sm={24}>
                <FormItem label="类型">
                  {form.getFieldDecorator('categoryId', {
                    rules: [{ required: true, message: '请选择类型！' }],
                  })(
                    <Select
                      placeholder="请选择"
                      style={{ width: '100%' }}
                      onChange={this.categoryChange}
                    >
                      {cateList.list.map(item => (
                        <Option key={item.id_} value={item.id_}>
                          {item.categoryName}
                        </Option>
                      ))}
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col md={12} sm={24}>
                <FormItem label="时间">
                  {form.getFieldDecorator('sendTime', {
                    rules: [{ required: true, message: '请选择时间！' }],
                  })(<DatePicker showTime placeholder="请选择" style={{ width: '100%' }} />)}
                </FormItem>
              </Col>
              <Col md={12} sm={24}>
                <FormItem label="等级">
                  {form.getFieldDecorator('emergencyLevel', {
                    rules: [{ required: true, message: '请选择等级！' }],
                  })(
                    <Select placeholder="请选择" style={{ width: '100%' }}>
                      {planRank.map((item, index) => (
                        <Option key={index} value={index + 1}>
                          {item}
                        </Option>
                      ))}
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col md={12} sm={24}>
                <FormItem label="预案">
                  {form.getFieldDecorator('yuan', {
                    initialValue: planName,
                    rules: [{ required: true, message: '请选择预案！' }],
                  })(
                    <Input
                      readOnly
                      placeholder="请选择"
                      onClick={() => this.handlePModalVisible(true)}
                    />,
                  )}
                </FormItem>
              </Col>
              <Col md={24} sm={24}>
                <LocationMap
                  getInputValue={this.getInputValue}
                  parentAddress={this.parentAddress}
                />
              </Col>
            </Row>
          </div>
          {/*<div className={themeStyle.formModalBody} style={{ marginTop: 10 }}>*/}
          {/*  <h3>处理方案</h3>*/}
          {/*  <Row gutter={40}>*/}
          {/*    <Col md={12} sm={24}>*/}
          {/*      <FormItem label="处置人员">*/}
          {/*        {form.getFieldDecorator('chargerId', {*/}
          {/*          rules: [{ required: true, message: '请选择处置人员！' }],*/}
          {/*        })(*/}
          {/*          <Select placeholder='请选择' style={{ width: '100%' }} onChange={this.chargerChange}>*/}
          {/*            {departmentUserList.map((item, index) =>*/}
          {/*              <Option*/}
          {/*                key={index}*/}
          {/*                value={item.id}*/}
          {/*              >{item.fullname}</Option>)}*/}
          {/*          </Select>,*/}
          {/*        )}*/}
          {/*      </FormItem>*/}
          {/*    </Col>*/}
          {/*    <Col md={12} sm={24}>*/}
          {/*      <FormItem label="处置方式">*/}
          {/*        {form.getFieldDecorator('dealType', {*/}
          {/*          rules: [{ required: true, message: '请输入处置方式！' }],*/}
          {/*        })(<Input.TextArea placeholder="请输入"/>)}*/}
          {/*      </FormItem>*/}
          {/*    </Col>*/}
          {/*  </Row>*/}
          {/*</div>*/}
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
        {pModalVisible ? (
          <PlanmanagementModal
            modalVisible={pModalVisible}
            handleModalVisible={this.handlePModalVisible}
            selectData={this.selectData}
          />
        ) : null}

        <Modal visible={previewVisible} footer={null} onCancel={() => this.handleCancel(false)}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </Fragment>
    );
  }
}

export default CreateModal;
