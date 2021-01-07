import React, { PureComponent, Fragment } from 'react';
import {
  Input,
  Modal,
  Form,
  Button,
  Row,
  Col,
  Select,
  DatePicker,
  message,
  Upload,
  Icon,
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
@connect(({ ListPlanCategory, Emergency, loading }) => ({
  Emergency,
  ListPlanCategory,
  loading: loading.models.Emergency,
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
  //
  //
  // chargerChange = (value, option) => {
  //   this.setState({ charger: option.props.children });
  // };

  categoryChange = (value, option) => {
    this.setState({ categoryName: option.props.children });
  };

  parentAddress = (address, lnglat) => {
    this.setState({ address, lnglat });
  };

  getInputValue = address => this.setState({ address });

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

  handleCancel = flag => this.setState({ previewVisible: !!flag });

  selectData = data => {
    this.setState({
      planName: data.planName,
      dealType: data.dealType,
      chargerId: data.chargerId,
      charger: data.charger,
    });
  };

  save = () => {
    const { form, dispatch, handleModalVisible, modalSuccess } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { charger, fileList, lnglat, categoryName, address, chargerId, dealType } = this.state;
      if (!fileList.length) {
        message.error('请选择图片');
        return;
      }
      if (!address) {
        message.error('请获取地址');
        return;
      }
      const values = {
        ...fieldsValue,
      };
      values.dealType = dealType;
      values.charger = charger;
      values.chargerId = chargerId;
      values.addr = address;
      values.categoryName = categoryName;
      values.longitude = lnglat[0];
      values.latitudel = lnglat[1];
      values.state = 2;
      const paths = fileList.map(item => item.response.filePath);
      values.imgUrl = paths.join();
      dispatch({
        type: 'Emergency/add',
        payload: values,
        callback: () => {
          message.success('添加成功');
          handleModalVisible();
          modalSuccess();
        },
      });
    });
  };

  handlePModalVisible = flag => {
    this.setState({ pModalVisible: !!flag });
  };

  render() {
    const { form, modalVisible, handleModalVisible, loading, cateList } = this.props;
    const {
      fileList,
      departmentUserList,
      pModalVisible,
      planName,
      previewVisible,
      previewImage,
    } = this.state;

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
          title="新建调度"
          className={themeStyle.formModal}
          visible={modalVisible}
          onCancel={() => handleModalVisible()}
          width={800}
          footer={[
            <Button key="back" onClick={() => handleModalVisible()}>
              取消
            </Button>,
            <Button key="submit" type="primary" loading={loading} onClick={() => this.save()}>
              下发任务
            </Button>,
          ]}
        >
          <div className={themeStyle.formModalBody}>
            <h3>上报信息</h3>
            <Row gutter={40}>
              <Col md={12} sm={24}>
                <FormItem label="对象">
                  {form.getFieldDecorator('planObject', {
                    rules: [{ required: true, message: '请选择对象！' }],
                  })(
                    <Select style={{ width: '100%' }} placeholder="请选择">
                      {planObject[1].map((item, index) => (
                        <Option key={index} value={planObject[0][index]}>
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
                      {cateList.list.map((item, index) => (
                        <Option key={index} value={item.id_}>
                          {item.categoryName}
                        </Option>
                      ))}
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col md={12} sm={24}>
                <FormItem label="处置时间">
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
              <Col md={12} sm={24}>
                <FormItem label="上报内容">
                  {form.getFieldDecorator('workContent', {
                    rules: [{ required: true, message: '请输入上报内容！' }],
                  })(<Input.TextArea placeholder="请输入" />)}
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
          <div className={themeStyle.formModalBody} style={{ marginTop: 10 }}>
            <h3>上报图片</h3>
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
          {/*<div className={themeStyle.formModalBody} style={{ marginTop: 10 }}>*/}
          {/*  <h3>选择信息</h3>*/}
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
