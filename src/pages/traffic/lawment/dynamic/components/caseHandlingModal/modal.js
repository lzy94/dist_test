import React, { PureComponent, Fragment } from 'react';
import {
  Button,
  Col,
  Form,
  Icon,
  Input,
  InputNumber,
  Modal,
  Radio,
  Row,
  message,
  Upload,
  Select,
  Spin,
  Skeleton,
} from 'antd';
import 'video-react/dist/video-react.css';
import { connect } from 'dva';
import {
  checkPhone,
  getLocalStorage,
  checkAuth,
  checkLicensePlate,
  checkIdCard,
} from '@/utils/utils';
import moment from 'moment';
import MyDyModalPublic from '@/components/MyDyModalPublic';
import MyStaticModalPublic from '@/components/MyStaticModalPublic/staticModal';
import RecordList from '@/components/MyDyModalPublic/recordList';
import LawCaseReturnModal from '../base/LawCaseReturnModal';
import FocusDataModal from '../base';
import themeStyle from '@/pages/style/theme.less';

const authority = [
  '/lawment/dynamic/casehand/addBusInfo',
  '/lawment/dynamic/casehand/focusData',
  '/lawment/dynamic/casehand/lawCaseRevoke',
  '/lawment/dynamic/casehand/lawCaseReturn',
];

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { Option } = Select;

/**
 * 撤销处罚
 * @type {ConnectedComponentClass<function(*): *, Omit<FormComponentProps<any>, keyof WrappedFormInternalProps>>}
 */
const LawCaseRevokeModal = Form.create()(props => {
  const {
    modalVisible,
    form,
    handleModalVisible,
    sendLawCaseRevoke,
    fileListIdCard,
    fileListCancelProof,
    fileListCard,
    fileListDriveLicense,
    IdCardImgChange,
    cancelProofChange,
    cardChange,
    loading,
    driveLicenseChange,
  } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      sendLawCaseRevoke(fieldsValue, () => form.resetFields());
    });
  };
  const uploadBase = {
    name: 'files',
    action: '/result/api/file/v1/fileUpload',
    listType: 'picture',
    accept: '.jpg,.jpeg,.png',
    data: {
      type: 5,
      xbType: '',
    },
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
  };

  return (
    <Modal
      destroyOnClose
      title="撤销处罚"
      className={themeStyle.formModal}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <div className={themeStyle.formModalBody}>
        <Spin spinning={!!loading}>
          <Form layout="vertical">
            <FormItem label="免处罚原因">
              {form.getFieldDecorator('reason', {
                initialValue: '本次超限运输行为已经办理了超限运输许可，且按许可要求合法运输',
              })(
                <Select dropdownMatchSelectWidth={false} style={{ width: '100%' }}>
                  <Option value="本次超限运输行为已经办理了超限运输许可，且按许可要求合法运输">
                    本次超限运输行为已经办理了超限运输许可，且按许可要求合法运输
                  </Option>
                  <Option value="本次违法行为通过检测点后，已被其他公路管理机构依法查处">
                    本次违法行为通过检测点后，已被其他公路管理机构依法查处
                  </Option>
                  <Option value="因称重检测设备出现异常情况导致称重数据与事实不符">
                    因称重检测设备出现异常情况导致称重数据与事实不符
                  </Option>
                  <Option value="因车辆使用假牌、套牌等原因，导致处罚主体或事实错误">
                    因车辆使用假牌、套牌等原因，导致处罚主体或事实错误
                  </Option>
                  <Option value="法律法规规定的其他不予处罚的情形">
                    法律法规规定的其他不予处罚的情形
                  </Option>
                  <Option value="公路管理机构认为应当撤销处罚的其他情形">
                    公路管理机构认为应当撤销处罚的其他情形
                  </Option>
                </Select>,
              )}
            </FormItem>
            <Row gutter={{ md: 8, lg: 8, xl: 8 }}>
              <Col md={12} sm={24}>
                <FormItem label="委托代理人身份证">
                  {form.getFieldDecorator('agentIdcardUrl', {
                    rules: [{ required: true, message: '请选择委托代理人身份证照片' }],
                  })(
                    <Upload
                      {...uploadBase}
                      defaultFileList={fileListIdCard}
                      onChange={IdCardImgChange}
                    >
                      {fileListIdCard.length ? null : (
                        <Button>
                          <Icon type="upload" /> 选择图片
                        </Button>
                      )}
                    </Upload>,
                  )}
                </FormItem>
              </Col>
              <Col md={12} sm={24}>
                <FormItem label="撤销凭证">
                  {form.getFieldDecorator('cancelProofUrl', {
                    rules: [{ required: true, message: '请选择撤销凭证照片' }],
                  })(
                    <Upload
                      {...uploadBase}
                      defaultFileList={fileListCancelProof}
                      onChange={cancelProofChange}
                    >
                      {fileListCancelProof.length ? null : (
                        <Button>
                          <Icon type="upload" /> 选择图片
                        </Button>
                      )}
                    </Upload>,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 8, xl: 8 }}>
              <Col md={12} sm={24}>
                <FormItem label="当事人身份证/企业营业执照">
                  {form.getFieldDecorator('cardUrl', {
                    rules: [{ required: true, message: '请选择当事人身份证/企业营业执照' }],
                  })(
                    <Upload {...uploadBase} defaultFileList={fileListCard} onChange={cardChange}>
                      {fileListCard.length ? null : (
                        <Button>
                          <Icon type="upload" /> 选择图片
                        </Button>
                      )}
                    </Upload>,
                  )}
                </FormItem>
              </Col>
              <Col md={12} sm={24}>
                <FormItem label="车辆行驶证图片">
                  {form.getFieldDecorator('driveLicenseUrl', {
                    rules: [{ required: true, message: '请选择车辆行驶证图片' }],
                  })(
                    <Upload
                      {...uploadBase}
                      defaultFileList={fileListDriveLicense}
                      onChange={driveLicenseChange}
                    >
                      {fileListDriveLicense.length ? null : (
                        <Button>
                          <Icon type="upload" /> 选择图片
                        </Button>
                      )}
                    </Upload>,
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Spin>
      </div>
    </Modal>
  );
});

@connect(({ DynamicLaw, loading, TrafficApiV2BusData, user }) => ({
  DynamicLaw,
  loading: loading.models.DynamicLaw,
  TrafficApiV2BusData,
  apiV2Loading: loading.models.TrafficApiV2BusData,
  currentUser: user.currentUser,
}))
@Form.create()
class washModal extends PureComponent {
  static defaultProps = {
    handleModalVisible: () => {},
  };

  state = {
    truckBelong: 1,
    previewCode: '',
    focusDataVisible: false,
    lawCaseReturnVisible: false,
    lawCaseRevokeVisible: false,
    registerInfo: {},
    busDynamicLawDate: {},
    openRecord: [],
    fileListIdCard: [],
    fileListCancelProof: [],
    fileListCard: [],
    fileListDriveLicense: [],
    busStaticData: {},
    detail: {},
  };

  columns = [
    {
      title: '操作员',
      dataIndex: 'executor',
    },
    {
      title: '办理时间',
      dataIndex: 'executorTime',
    },
    {
      title: '状态',
      dataIndex: 'logType',
    },
    {
      title: '原因',
      dataIndex: 'remark',
    },
  ];

  constructor(props) {
    super(props);
    this.myCarousel = React.createRef();
  }

  componentDidMount() {
    setTimeout(() => this.getDetail(), 100);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      TrafficApiV2BusData: { dyDataDetail },
    } = nextProps;
    const { detail } = prevState;
    if (JSON.stringify(detail) !== JSON.stringify(dyDataDetail)) {
      const { registerInfo, openRecord, busDynamicLawDate } = dyDataDetail;
      const reg = registerInfo || {};
      return {
        detail: dyDataDetail,
        busDynamicLawDate,
        openRecord,
        registerInfo: reg,
        truckBelong: reg.truckBelong || 1,
        previewCode: busDynamicLawDate.previewCode,
        busStaticData: busDynamicLawDate.busStaticData || {},
      };
    }
    return null;
  }

  getDetail = () => {
    const { dispatch, detailID } = this.props;
    dispatch({
      type: 'TrafficApiV2BusData/dyDataDetail',
      payload: detailID,
    });
  };

  // getDetail = () => {
  //   const { dispatch, detailID } = this.props;
  //   dispatch({
  //     type: 'DynamicLaw/detail',
  //     payload: { id: detailID },
  //     callback: res => {
  //       const registerInfo = res.registerInfo || {};
  //       this.setState({
  //         detail: res,
  //         truckBelong: registerInfo.truckBelong || 1,
  //         previewCode: res.busDynamicLawDate.previewCode,
  //         registerInfo,
  //         busDynamicLawDate: res.busDynamicLawDate,
  //         openRecord: res.openRecord,
  //         busStaticData: res.busStaticData || {},
  //       });
  //     },
  //   });
  // };

  truckBelongChange = e => {
    this.setState({ truckBelong: e.target.value });
  };

  handleAdd = (fields, callback) => {
    const { dispatch } = this.props;
    const { registerInfo, previewCode } = this.state;
    const values = { ...fields, previewCode };
    if (JSON.stringify(registerInfo) !== '{}') {
      values.id = registerInfo.id;
    }
    dispatch({
      type: 'DynamicLaw/add',
      payload: values,
      callback: () => {
        message.success('操作成功');
        callback();
        this.getDetail();
      },
    });
  };

  handleFocusDataVisible = flag => {
    this.setState({ focusDataVisible: !!flag });
  };

  handleLawCaseReturnVisible = flag => {
    this.setState({ lawCaseReturnVisible: !!flag });
  };

  handLawCaseRevokeVisible = flag => {
    this.setState({ lawCaseRevokeVisible: !!flag });
  };

  sendLawCaseRevoke = (field, callback) => {
    // const { previewCode } = this.state;
    const {
      dispatch,
      modalSuccess,
      handleModalVisible,
      detailID,
      currentUser: { id, fullname },
    } = this.props;
    const values = {
      ...field,
      busDataId: detailID,
      userName: fullname,
      userId: id,
      // previewCode,
      cardUrl: field.cardUrl ? field.cardUrl.file.response.filePath : '',
      agentIdcardUrl: field.agentIdcardUrl ? field.agentIdcardUrl.file.response.filePath : '',
      cancelProofUrl: field.cancelProofUrl ? field.cancelProofUrl.file.response.filePath : '',
      driveLicenseUrl: field.driveLicenseUrl ? field.driveLicenseUrl.file.response.filePath : '',
    };
    // field.agentIdcardUrl = field.agentIdcardUrl ? field.agentIdcardUrl.file.response.filePath : '';
    // field.cancelProofUrl = field.cancelProofUrl ? field.cancelProofUrl.file.response.filePath : '';
    // field.cardUrl = field.cardUrl ? field.cardUrl.file.response.filePath : '';
    // field.driveLicenseUrl = field.driveLicenseUrl
    //   ? field.driveLicenseUrl.file.response.filePath
    //   : '';
    dispatch({
      type: 'TrafficApiV2BusData/lawCaseRevoke',
      payload: values,
      callback: () => {
        setTimeout(() => {
          if (callback) {
            callback();
          }
          this.handLawCaseRevokeVisible();
          handleModalVisible();
          modalSuccess();
        }, 500);
      },
    });
  };

  prevCarousel = () => {
    this.myCarousel.prev();
  };

  nextCarousel = () => {
    this.myCarousel.next();
  };

  focusDataClick = () => {
    this.handleFocusDataVisible(true);
  };

  lawCaseReturnClick = () => {
    this.handleLawCaseReturnVisible(true);
  };

  lawCaseRevokeClick = () => {
    this.handLawCaseRevokeVisible(true);
  };

  IdCardImgChange = info => {
    this.imgChangeUtil(info, fileList => {
      this.setState({ fileListIdCard: fileList });
    });
  };

  cardChange = info => {
    this.imgChangeUtil(info, fileList => {
      this.setState({ fileListCard: fileList });
    });
  };

  cancelProofChange = info => {
    this.imgChangeUtil(info, fileList => {
      this.setState({ fileListCancelProof: fileList });
    });
  };

  driveLicenseChange = info => {
    this.imgChangeUtil(info, fileList => {
      this.setState({ fileListDriveLicense: fileList });
    });
  };

  imgChangeUtil = (info, callback) => {
    if (info.file.status === 'done') {
      if (info.file.response.code === 200) {
        message.success('上传成功');
        callback(info.fileList);
      } else {
        message.error(info.file.response.code.msg);
      }
    } else if (info.file.status === 'error') {
      message.error('上传失败');
    } else if (info.file.status === 'removed') {
      callback(info.fileList);
    }
  };

  modalSuccess = () => {
    const { modalSuccess, handleModalVisible } = this.props;
    modalSuccess();
    handleModalVisible();
  };

  modalTitle = () => {
    const { form, isRegist } = this.props;
    const { busDynamicLawDate } = this.state;
    const style = {
      color: '#fff',
      marginLeft: 5,
    };
    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        this.handleAdd(fieldsValue, () => form.resetFields());
      });
    };
    return (
      <div className={themeStyle.modalHeader}>
        <div className={themeStyle.title}>
          <span className={themeStyle.value}>{busDynamicLawDate.carNo}</span>
          <span className={themeStyle.time}>
            {moment(busDynamicLawDate.previewTime).format('YYYY-M-D HH:mm:ss')}
          </span>
        </div>
        <div>
          {checkAuth(authority[0]) ? (
            !isRegist ? (
              <Button type="primary" onClick={okHandle}>
                确认车辆信息
              </Button>
            ) : null
          ) : null}
          {checkAuth(authority[1]) ? (
            <Button
              style={{ background: '#f1a325', borderColor: '#f1a325', ...style }}
              onClick={() => this.focusDataClick()}
            >
              重点关注
            </Button>
          ) : null}
          {checkAuth(authority[2]) ? (
            <Button
              onClick={() => this.lawCaseRevokeClick()}
              style={{ background: '#ea644a', borderColor: '#ea644a', ...style }}
            >
              撤销处罚
            </Button>
          ) : null}
          {checkAuth(authority[3]) ? (
            <Button
              onClick={() => this.lawCaseReturnClick()}
              style={{ background: '#38b03f', borderColor: '#38b03f', ...style }}
            >
              退回重审
            </Button>
          ) : null}
        </div>
      </div>
    );
  };

  renderForm() {
    const { form } = this.props;
    const { truckBelong, registerInfo, busDynamicLawDate } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 8 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 16 },
        sm: { span: 16 },
      },
    };
    return (
      <Fragment>
        <div className={themeStyle.inputGroup}>
          <Row gutter={8}>
            <Col md={6} sm={12}>
              <FormItem label="车牌号码" {...formItemLayout}>
                {form.getFieldDecorator('carNo', {
                  initialValue: registerInfo.carNo || busDynamicLawDate.carNo,
                  rules: [{ required: true, validator: checkLicensePlate }],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col md={6} sm={12}>
              <FormItem label="车主姓名" {...formItemLayout}>
                {form.getFieldDecorator('vehicleOwner', {
                  initialValue: registerInfo.vehicleOwner,
                  rules: [{ required: true, message: '请输入车主姓名！' }],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col md={6} sm={12}>
              <FormItem label="车辆类型" {...formItemLayout}>
                {form.getFieldDecorator('carType', {
                  initialValue: registerInfo.carType,
                })(<Input />)}
              </FormItem>
            </Col>
            <Col md={6} sm={12}>
              <FormItem label="核定载重" {...formItemLayout}>
                {form.getFieldDecorator('weightLimited', {
                  initialValue: registerInfo.weightLimited,
                })(<InputNumber min={0} placeholder="单位(kg)" style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={6} sm={12}>
              <FormItem label="手机号码" {...formItemLayout}>
                {form.getFieldDecorator('phone', {
                  initialValue: registerInfo.phone,
                  rules: [{ required: true, validator: checkPhone }],
                })(<Input />)}
              </FormItem>
            </Col>
            {truckBelong === 2 ? (
              <Col md={6} sm={12}>
                <FormItem label="统一信用码" {...formItemLayout}>
                  {form.getFieldDecorator('creditCode', {
                    initialValue: registerInfo.creditCode,
                  })(<Input />)}
                </FormItem>
              </Col>
            ) : (
              <Col md={6} sm={12}>
                <FormItem label="身份证号" {...formItemLayout}>
                  {form.getFieldDecorator('idCard', {
                    initialValue: registerInfo.idCard,
                    rules: [{ required: true, validator: checkIdCard }],
                  })(<Input />)}
                </FormItem>
              </Col>
            )}

            <Col md={6} sm={12}>
              <FormItem label="外廓尺寸" {...formItemLayout}>
                {form.getFieldDecorator('externalDimensions', {
                  initialValue: registerInfo.externalDimensions,
                })(<Input placeholder="输入格式(XX-XX-XX)" />)}
              </FormItem>
            </Col>
            <Col md={6} sm={12}>
              <FormItem label="车辆总重" {...formItemLayout}>
                {form.getFieldDecorator('totalWeight', {
                  initialValue: registerInfo.totalWeight,
                })(<InputNumber placeholder="单位(kg)" min={0} style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={6} sm={12}>
              <FormItem label="车辆厂牌" {...formItemLayout}>
                {form.getFieldDecorator('brandName', {
                  initialValue: registerInfo.brandName,
                })(<Input />)}
              </FormItem>
            </Col>
            {truckBelong === 2 ? (
              <Fragment>
                <Col md={6} sm={12}>
                  <FormItem label="法人姓名" {...formItemLayout}>
                    {form.getFieldDecorator('legalRepresentative', {
                      initialValue: registerInfo.legalRepresentative,
                    })(<Input />)}
                  </FormItem>
                </Col>
                <Col md={6} sm={12}>
                  <FormItem label="注册地址" {...formItemLayout}>
                    {form.getFieldDecorator('registAddr', {
                      initialValue: registerInfo.registAddr,
                    })(<Input />)}
                  </FormItem>
                </Col>
              </Fragment>
            ) : (
              <Col md={6} sm={12}>
                <FormItem label="车主地址" {...formItemLayout}>
                  {form.getFieldDecorator('vehicleOwnerAddr', {
                    initialValue: registerInfo.vehicleOwnerAddr,
                    rules: [
                      {
                        required: true,
                        message: '请输入车主地址',
                      },
                    ],
                  })(<Input />)}
                </FormItem>
              </Col>
            )}
            <Col md={6} sm={12}>
              <FormItem label="轴数" {...formItemLayout}>
                {form.getFieldDecorator('axleNumber', {
                  initialValue: registerInfo.axleNumber || busDynamicLawDate.axleNumber,
                  rules: [{ required: true, message: '请输入轴数' }],
                })(<InputNumber min={0} placeholder="" style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
          </Row>
        </div>
      </Fragment>
    );
  }

  // 数据监测 综合查询 行政执法
  render() {
    const { modalVisible, handleModalVisible, form, loading, detailID, apiV2Loading } = this.props;
    const {
      truckBelong,
      focusDataVisible,
      lawCaseReturnVisible,
      lawCaseRevokeVisible,
      busDynamicLawDate,
      fileListCancelProof,
      fileListCard,
      fileListDriveLicense,
      fileListIdCard,
      openRecord,
      busStaticData,
      detail,
    } = this.state;
    const focusDataMethods = {
      handleModalVisible: this.handleFocusDataVisible,
      detail,
      modalSuccess: this.modalSuccess,
    };

    const lawCaseReturnMethods = {
      detailID,
      modalSuccess: this.modalSuccess,
      handleModalVisible: this.handleLawCaseReturnVisible,
    };

    const lawCaseRevokeMethods = {
      handleModalVisible: this.handLawCaseRevokeVisible,
      sendLawCaseRevoke: this.sendLawCaseRevoke,
      fileListIdCard,
      fileListCancelProof,
      fileListCard,
      loading: apiV2Loading,
      fileListDriveLicense,
      IdCardImgChange: this.IdCardImgChange,
      cancelProofChange: this.cancelProofChange,
      cardChange: this.cardChange,
      driveLicenseChange: this.driveLicenseChange,
    };

    return (
      <Fragment>
        <Modal
          destroyOnClose
          className={themeStyle.modalStyle}
          title={this.modalTitle()}
          visible={modalVisible}
          footer={null}
          onCancel={() => handleModalVisible()}
          width={1150}
        >
          <Spin spinning={apiV2Loading}>
            <div className={themeStyle.detailMsg}>
              <div className={themeStyle.detailMsgTitle}>
                <Icon type="profile" />
                &nbsp;车辆基本信息
                <FormItem
                  style={{
                    display: 'inline-block',
                    marginBottom: 0,
                    verticalAlign: 'middle',
                    marginLeft: 20,
                  }}
                >
                  {form.getFieldDecorator('truckBelong', {
                    initialValue: truckBelong,
                  })(
                    <RadioGroup onChange={this.truckBelongChange}>
                      <Radio value={1}>个人</Radio>
                      <Radio value={2}>企业</Radio>
                    </RadioGroup>,
                  )}
                </FormItem>
                <Button
                  style={{ float: 'right' }}
                  size="small"
                  href="http://www.gsxt.gov.cn/index.html"
                  target="_blank"
                >
                  企业法人查询
                </Button>
              </div>
              <div style={{ padding: '0 20px 20px' }}>{this.renderForm()}</div>
            </div>
            {Object.keys(busDynamicLawDate).length ? (
              <MyDyModalPublic detail={busDynamicLawDate} isTitle={true} />
            ) : (
              <Skeleton active />
            )}

            {JSON.stringify(busStaticData) !== '{}' ? (
              <MyStaticModalPublic detail={busStaticData} />
            ) : null}
            <div className={themeStyle.detailMsg} style={{ marginTop: 16 }}>
              <div className={themeStyle.detailMsgTitle}>
                <Icon type="table" />
                &nbsp;操作记录
              </div>
              <div className={themeStyle.recordList} style={{ padding: '0 20px 20px' }}>
                <RecordList loading={loading} list={openRecord} columns={this.columns} />
              </div>
            </div>
          </Spin>
        </Modal>
        {focusDataVisible && (
          <FocusDataModal {...focusDataMethods} modalVisible={focusDataVisible} />
        )}
        {lawCaseReturnVisible && (
          <LawCaseReturnModal {...lawCaseReturnMethods} modalVisible={lawCaseReturnVisible} />
        )}
        {lawCaseRevokeVisible && (
          <LawCaseRevokeModal {...lawCaseRevokeMethods} modalVisible={lawCaseRevokeVisible} />
        )}
      </Fragment>
    );
  }
}

export default washModal;
