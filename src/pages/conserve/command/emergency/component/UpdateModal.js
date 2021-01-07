import React, { PureComponent, Fragment } from 'react';
import { Input, Modal, Form, Button, Row, Col, Select, DatePicker, message, Upload } from 'antd';
import themeStyle from '@/pages/style/theme.less';
import { connect } from 'dva';
import { planObject, planObjectNumber, planRank } from '@/utils/dictionaries';
import Map from '@/pages/conserve/system/roadproduction/component/Map';
import { getLocalStorage, imgUrl } from '@/utils/utils';
import LocationMap from '@/pages/conserve/Component/LocationMap';
import PlanmanagementModal from '@/pages/conserve/Component/PlanmanagementModal';

const FormItem = Form.Item;
const Option = Select.Option;

/* eslint react/no-multi-comp:0 */
@connect(({ ListPlanCategory, Emergency, loading }) => ({
  Emergency,
  ListPlanCategory,
  loading: loading.models.Emergency,
}))
@Form.create()
class UpdateModal extends PureComponent {
  state = {
    departmentUserList: [],
    charger: '',
    fileList: [],
    address: '',
    value: '',
    lnglat: [],
    categoryName: '',
    pModalVisible: false,
    detail: {},
    planName: '',
    dealType: '',
    chargerId: '',
  };

  componentDidMount() {
    this.getDepartmentUser();
    const { detail } = this.props;
    this.setState({
      detail,
      value: detail.addr,
      charger: detail.charger,
      categoryName: detail.categoryName,
      lnglat: [detail.longitude, detail.latitudel],
    });
    if (detail.imgUrl) {
      const fileList = detail.imgUrl.split(',').map((item, i) => ({
        uid: i,
        name: '当前图片',
        status: 'done',
        url: imgUrl + item,
        path: item,
      }));
      this.setState({ fileList });
    }
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

  chargerChange = (value, option) => {
    this.setState({ charger: option.props.children });
  };

  categoryChange = (value, option) => {
    this.setState({ categoryName: option.props.children });
  };

  parentAddress = (address, lnglat) => {
    this.setState({ address, lnglat });
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
      onChange: this.handleChange,
      // onPreview: this.handlePreview,
    };
  };

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
      const {
        charger,
        fileList,
        lnglat,
        categoryName,
        detail,
        address,
        chargerId,
        dealType,
      } = this.state;
      const values = {
        ...fieldsValue,
      };
      const newDetail = { ...detail };
      if (!lnglat[0]) return message.error('请选择位置');
      values.dealType = dealType;
      values.charger = charger;
      values.addr = address;
      values.chargerId = chargerId;
      values.categoryName = categoryName;
      values.longitude = lnglat[0];
      values.latitudel = lnglat[1];
      values.state = 2;
      let paths = '';
      if (typeof values.imgUrl === 'object') {
        paths = fileList.map(item => item.response.filePath);
      } else {
        paths = fileList.map(item => item.path);
      }
      values.imgUrl = paths.join();

      for (let i in values) {
        newDetail[i] = values[i];
      }
      this.setState({ detail: newDetail });
      dispatch({
        type: 'Emergency/update',
        payload: newDetail,
        callback: () => {
          message.success('下发成功');
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
    const { fileList, departmentUserList, detail, pModalVisible, planName } = this.state;

    // const uploadButton = (
    //   <div>
    //     <Icon type="plus"/>
    //     <div className="ant-upload-text">请选择图片</div>
    //   </div>
    // );

    return (
      <Fragment>
        <Modal
          destroyOnClose
          title="编辑下发"
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
                    initialValue: detail.planObject,
                    rules: [{ required: true, message: '请选择对象！' }],
                  })(
                    <Select style={{ width: '100%' }} placeholder="请选择">
                      {planObject.map((item, index) => (
                        <Option key={index} value={planObjectNumber[index]}>
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
                    initialValue: detail.categoryId,
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
                    initialValue: detail.emergencyLevel,
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
                {Object.keys(detail).length ? (
                  <LocationMap
                    lngLat={
                      detail.longitude
                        ? {
                            longitude: detail.longitude,
                            latitude: detail.latitudel,
                          }
                        : null
                    }
                    address={detail.addr}
                    parentAddress={this.parentAddress}
                  />
                ) : null}
              </Col>
            </Row>
          </div>
          <div className={themeStyle.formModalBody} style={{ marginTop: 10 }}>
            <h3>上报图片</h3>
            <div className="clearfix">
              <FormItem>
                {form.getFieldDecorator('imgUrl', {
                  initialValue: detail.imgUrl,
                  rules: [{ required: true, message: '请上传照片！' }],
                })(
                  <Upload {...this.uploadConfig()} fileList={fileList}>
                    {/*{fileList.length >= 3 ? null : uploadButton}*/}
                  </Upload>,
                )}
              </FormItem>
            </div>
          </div>
          {/* <div className={themeStyle.formModalBody} style={{ marginTop: 10 }}>
          <h3>选择信息</h3>
          <Row gutter={40}>
            <Col md={12} sm={24}>
              <FormItem label="处置人员">
                {form.getFieldDecorator('chargerId', {
                  initialValue: detail.chargerId,
                  rules: [{ required: true, message: '请选择处置人员！' }],
                })(
                  <Select placeholder='请选择' style={{ width: '100%' }} onChange={this.chargerChange}>
                    {departmentUserList.map((item, index) =>
                      <Option
                        key={index}
                        value={item.id}
                      >{item.fullname}</Option>)}
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem label="处置方式">
                {form.getFieldDecorator('dealType', {
                  initialValue: detail.dealType,
                  rules: [{ required: true, message: '请输入处置方式！' }],
                })(<Input.TextArea placeholder="请输入"/>)}
              </FormItem>
            </Col>
          </Row>
        </div> */}
        </Modal>
        {pModalVisible ? (
          <PlanmanagementModal
            modalVisible={pModalVisible}
            handleModalVisible={this.handlePModalVisible}
            selectData={this.selectData}
          />
        ) : null}
      </Fragment>
    );
  }
}

export default UpdateModal;
