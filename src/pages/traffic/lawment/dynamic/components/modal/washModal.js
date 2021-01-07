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
  Spin,
  Select,
  Skeleton,
} from 'antd';
import { connect } from 'dva';
import 'video-react/dist/video-react.css';
import moment from 'moment';
import {
  checkPhone,
  checkAuth,
  checkIdCard,
  checkLicensePlate,
  checkPhoneV2,
  checkLicensePlateV2,
} from '@/utils/utils';
import FocusDataModal from '../base';
import MyDyModalPublic from '@/components/MyDyModalPublic';
import MyStaticModalPublic from '@/components/MyStaticModalPublic/staticModal';
import themeStyle from '@/pages/style/theme.less';
import RecordList from '@/components/MyDyModalPublic/recordList';

import LicenseModal from './LicenseModal';

const authority = [
  '/lawment/dynamic/check/addBusInfo',
  '/lawment/dynamic/check/getPrintLetter',
  '/lawment/dynamic/check/verifyPass',
  '/lawment/dynamic/check/send',
  '/lawment/dynamic/check/invalidData',
  '/lawment/dynamic/check/focusData',
];

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { Option } = Select;

const InvalidDataModal = Form.create()(props => {
  const { modalVisible, form, handleModalVisible, sendInvalidData } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      sendInvalidData(fieldsValue, () => form.resetFields());
    });
  };

  return (
    <Modal
      destroyOnClose
      title="无效数据处理"
      visible={modalVisible}
      className={themeStyle.formModal}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <div className={themeStyle.formModalBody}>
        <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="无效处理理由">
          {form.getFieldDecorator('reson', {
            initialValue: '无车牌号(故意遮挡车牌)',
          })(
            <Select dropdownMatchSelectWidth={false} style={{ width: '100%' }}>
              <Option value="无车牌号(故意遮挡车牌)">无车牌号(故意遮挡车牌)</Option>
              <Option value="无车辆照片或无车辆视频">无车辆照片或无车辆视频</Option>
              <Option value="检测车辆与抓拍不匹配">检测车辆与抓拍不匹配</Option>
              <Option value="特种运输车辆(包括水泥罐，工程车、军用车辆、国防科研任务车辆等)">
                特种运输车辆(包括水泥罐，工程车、军用车辆、国防科研任务车辆等)
              </Option>
              <Option value="车速超过检定证书确定范围的">车速超过检定证书确定范围的</Option>
              <Option value="测试数据或设备维护期间数据">测试数据或设备维护期间数据</Option>
              <Option value="无车牌号(号牌未安装)">无车牌号(号牌未安装)</Option>
              <Option value="无车牌号(号码不全或其他原因无法识别)">
                无车牌号(号码不全或其他原因无法识别)
              </Option>
            </Select>,
          )}
        </FormItem>
      </div>
    </Modal>
  );
});

@connect(({ TrafficApiV2BusData, DynamicLaw, loading, user }) => ({
  TrafficApiV2BusData,
  api2Loading: loading.models.TrafficApiV2BusData,
  DynamicLaw,
  loading: loading.models.DynamicLaw,
  currentUser: user.currentUser,
}))
@Form.create()
class washModal extends PureComponent {
  phoneInput = React.createRef();

  static defaultProps = {
    showSave: false,
    handleModalVisible: () => {},
  };

  state = {
    truckBelong: 1,
    previewCode: '',
    licenseData: [],
    licenseVisible: false,
    invalidDataVisible: false,
    focusDataVisible: false,
    registerInfo: {},
    busDynamicLawDate: {},
    downLoading: false,
    detail: {},
    openRecord: [],
    busStaticData: {},
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

  componentDidMount() {
    this.getDetail();
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
        previewCode: busDynamicLawDate.previewCode,
        truckBelong: reg.truckBelong || 1,
        busStaticData: dyDataDetail.busStaticData || {},
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

  truckBelongChange = e => {
    this.setState({ truckBelong: e.target.value });
  };

  handleAdd = (fields, callback) => {
    const { dispatch, modalSuccess, showSave } = this.props;
    const { busDynamicLawDate, registerInfo } = this.state;
    if (!checkPhoneV2(fields.phone)) {
      message.error('请输入正确的电话号码');
      return;
    }
    const values = { ...fields, previewCode: busDynamicLawDate.previewCode };
    if (JSON.stringify(registerInfo) !== '{}') {
      values.id = registerInfo.id;
    }
    dispatch({
      type: 'DynamicLaw/add',
      payload: values,
      callback: () => {
        this.setAfterRegister(() => {
          if (busDynamicLawDate.isEntry === 1 && showSave) {
            modalSuccess();
          } else {
            message.success('保存成功');
            callback();
            setTimeout(() => {
              this.getDetail();
            }, 300);
          }
        });
      },
    });
  };

  sendBusSms = () => {
    Modal.confirm({
      title: '提示',
      content: '是否发送短信？',
      onOk: () => {
        const { dispatch, form } = this.props;
        const {
          busDynamicLawDate: { previewCode, siteName, totalLoad, overLoad, previewTime },
        } = this.state;
        const fieldValue = form.getFieldsValue(['carNo', 'phone', 'totalWeight']);
        if (!fieldValue.phone) {
          message.error('请在车辆基本信息中填写手机号码!');
          this.phoneInput.current.focus();
          return;
        }

        if (!checkPhoneV2(fieldValue.phone)) {
          message.error('请输入正确的电话号码');
          return;
        }

        const hide = message.loading('短信发送中······', 0);

        dispatch({
          type: 'DynamicLaw/sendBusSms',
          payload: {
            content: siteName,
            previewCode,
            previewTime,
            phone: fieldValue.phone,
            name: fieldValue.carNo,
            overload: overLoad,
            total: fieldValue.totalWeight || totalLoad,
          },
          callback: res => {
            hide();
            if (res === 200) {
              message.success('发送成功');
            } else {
              message.error('发送失败');
            }
          },
        });
      },
    });
  };

  handleInvalidDataVisible = flag => {
    this.setState({
      invalidDataVisible: !!flag,
    });
  };

  handleFocusDataVisible = flag => {
    this.setState({ focusDataVisible: !!flag });
  };

  handleLicenseVisible = flag => {
    this.setState({ licenseVisible: !!flag });
    if (!flag) {
      this.setState({
        licenseData: [],
      });
    }
  };

  sendInvalidData = (field, callback) => {
    const { dispatch, modalSuccess, handleModalVisible } = this.props;
    const { previewCode } = this.state;
    const values = { ...field, previewCode };
    dispatch({
      type: 'DynamicLaw/invalidData',
      payload: values,
      callback: () => {
        modalSuccess();
        if (callback) callback();
        setTimeout(() => {
          this.handleInvalidDataVisible();
          handleModalVisible();
        }, 500);
      },
    });
  };

  // 证据保存成功后更改检测数据状态
  setAfterRegister = callback => {
    const { dispatch, detailID } = this.props;
    dispatch({
      type: 'TrafficApiV2BusData/afterRegister',
      payload: detailID,
      callback: callback(),
    });
  };

  modalSuccess = () => {
    const { modalSuccess, handleModalVisible } = this.props;
    modalSuccess();
    handleModalVisible();
  };

  checkMsg = callback => {
    const { form } = this.props;
    form.validateFields(err => {
      if (err)
        return Modal.error({
          title: '系统提示',
          content: '请先保存车辆信息',
          okText: '确定',
        });

      const { registerInfo } = this.state;
      if (JSON.stringify(registerInfo) === '{}') {
        return Modal.error({
          title: '系统提示',
          content: '请先保存车辆信息',
          okText: '确定',
        });
      }
      callback();
    });
  };

  verifyPassClick = () => {
    const {
      dispatch,
      modalSuccess,
      handleModalVisible,
      detailID,
      currentUser: { id, fullname },
    } = this.props;
    // const { previewCode } = this.state;
    this.checkMsg(() => {
      dispatch({
        type: 'TrafficApiV2BusData/verifyPass',
        payload: {
          busDataId: detailID,
          userId: id,
          userName: fullname,
        },
        callback: () => {
          modalSuccess();
          setTimeout(() => handleModalVisible(), 500);
        },
      });
    });
  };

  focusDataClick = () => {
    this.handleFocusDataVisible(true);
  };

  invalidDataClick = () => {
    this.handleInvalidDataVisible(true);
  };

  printLetterClick = () => {
    const { dispatch } = this.props;
    const { busDynamicLawDate } = this.state;
    this.setState({ downLoading: true });
    dispatch({
      type: 'DynamicLaw/printLetter',
      payload: {
        carNo: busDynamicLawDate.carNo,
        previewCode: busDynamicLawDate.previewCode,
        XbTypeId: '33333',
      },
      callback: status => {
        if (status === 404) {
          message.error('告知函异常，无法下载');
        }
        this.setState({ downLoading: false });
      },
    });
  };

  /**
   * @description 推送交警
   */
  setSubmitEntry = () => {
    Modal.confirm({
      title: '提示',
      content: '是否推送至推送交警录入？',
      onOk: () => {
        const { dispatch, detailID, handleModalVisible, modalSuccess } = this.props;
        dispatch({
          type: 'TrafficApiV2BusData/submitEntry',
          payload: {
            id: detailID,
          },
          callback: () => {
            modalSuccess();
            setTimeout(() => handleModalVisible(), 500);
          },
        });
      },
    });
  };

  notDev = () => {
    Modal.warning({
      title: '该功能尚未开通',
      okText: '确定',
    });
  };

  /**
   * @description 获取车辆行驶证信息
   */
  getVQueryLicenseV2 = () => {
    const { dispatch, form } = this.props;
    const { busDynamicLawDate } = this.state;
    const { id, carNoColor } = busDynamicLawDate;
    const carColor = carNoColor === '蓝' ? '1' : '2';
    const carNo = form.getFieldValue('carNo');
    if (carNo === '未识别') {
      message.error('车牌未识别，无法获取信息');
      return;
    }
    if (!checkLicensePlateV2(carNo)) {
      message.error('请输入正确的车牌');
      return;
    }
    const params = { previewCode: id, vclN: carNo, vco: carColor };

    dispatch({
      type: 'CarGPS/vQueryLicenseV2',
      payload: params,
      callback: res => {
        if (!Array.isArray(res)) {
          this.licenseSetForm(res);
        } else {
          this.setState({ licenseData: res }, () => this.handleLicenseVisible(true));
        }
      },
    });
  };

  licenseCallback = data => {
    this.licenseSetForm(data, () => this.handleLicenseVisible());
  };

  licenseSetForm = (data, callback) => {
    const { form } = this.props;
    const { cmpNm, vclWnrPhn, ldTn, vclLng, vclWdt, vclHgt, vclTpNm, vbrndCdNm } = data;
    form.setFieldsValue(
      {
        brandName: vbrndCdNm,
        carType: vclTpNm,
        vehicleOwner: cmpNm,
        phone: vclWnrPhn,
        weightLimited: ldTn,
        externalDimensions: `${vclLng}-${vclWdt}-${vclHgt}`,
      },
      () => {
        if (callback) callback();
      },
    );
  };
  //-------------------------

  modalTitle = () => {
    const { busDynamicLawDate } = this.state;

    return (
      <div className={themeStyle.modalHeader}>
        <div className={themeStyle.title}>
          <span className={themeStyle.value}>{busDynamicLawDate.carNo}</span>
          <span className={themeStyle.time}>
            {moment(busDynamicLawDate.previewTime).format('YYYY-M-D HH:mm:ss')}
          </span>
        </div>
        {this.renderTitleButton()}
      </div>
    );
  };

  renderTitleButton = () => {
    const { form, showSave } = this.props;
    const {
      downLoading,
      busDynamicLawDate: { isEntry },
    } = this.state;
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
      <div>
        {isEntry === 0 ? (
          <Fragment>
            <Button disabled={downLoading} type="primary" onClick={this.setSubmitEntry}>
              {/* 推送交警录入 */}
              推送交警录入处罚
            </Button>
            {checkAuth(authority[0]) ? (
              <Button disabled={downLoading} type="primary" onClick={okHandle} style={{ ...style }}>
                证据保存
              </Button>
            ) : null}
          </Fragment>
        ) : null}
        {/* eslint-disable-next-line no-nested-ternary */}
        {isEntry === 1 && showSave ? (
          checkAuth(authority[0]) ? (
            <Button disabled={downLoading} type="primary" onClick={okHandle} style={{ ...style }}>
              证据保存
            </Button>
          ) : null
        ) : null}
        {isEntry !== 1 ? (
          <Fragment>
            {checkAuth(authority[1]) ? (
              <Button
                disabled={downLoading}
                style={{ background: '#f1a325', borderColor: '#f1a325', ...style }}
                onClick={() => this.printLetterClick()}
              >
                打印告知函
              </Button>
            ) : null}
            {checkAuth(authority[2]) ? (
              <Button
                disabled={downLoading}
                style={{ background: '#38b03f', borderColor: '#38b03f', ...style }}
                onClick={() => this.verifyPassClick()}
              >
                审核通过
              </Button>
            ) : null}
            {checkAuth(authority[3]) ? (
              <Button
                disabled={downLoading}
                style={{ background: '#3280fc', borderColor: '#3280fc', ...style }}
                onClick={() => this.sendBusSms()}
              >
                发送短信
              </Button>
            ) : null}
            {checkAuth(authority[4]) ? (
              <Button
                disabled={downLoading}
                style={{ background: '#ea644a', borderColor: '#ea644a', ...style }}
                onClick={() => this.invalidDataClick()}
              >
                无效数据处理
              </Button>
            ) : null}
            {checkAuth(authority[5]) ? (
              <Button
                disabled={downLoading}
                style={{ background: '#f1a325', borderColor: '#f1a325', ...style }}
                onClick={() => this.focusDataClick()}
              >
                重点关注
              </Button>
            ) : null}
          </Fragment>
        ) : null}
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
                  rules: [{ required: true, message: '请输入核定载重' }],
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
                })(<Input ref={this.phoneInput} />)}
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
                  rules: [{ required: true, message: '请输入车辆总重' }],
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

  render() {
    const { modalVisible, handleModalVisible, form, loading } = this.props;
    const {
      detail,
      truckBelong,
      invalidDataVisible,
      busDynamicLawDate,
      focusDataVisible,
      downLoading,
      openRecord,
      busStaticData,
      licenseVisible,
      licenseData,
    } = this.state;

    const invalidDataMehtods = {
      handleModalVisible: this.handleInvalidDataVisible,
      sendInvalidData: this.sendInvalidData,
    };
    const focusDataMethods = {
      handleModalVisible: this.handleFocusDataVisible,
      detail,
      modalSuccess: this.modalSuccess,
    };

    return (
      <Fragment>
        {JSON.stringify(busDynamicLawDate) !== '{}' ? (
          <Modal
            destroyOnClose
            className={themeStyle.modalStyle}
            title={this.modalTitle()}
            visible={modalVisible}
            footer={null}
            onCancel={() => handleModalVisible()}
            width={1150}
          >
            <Spin tip="正在下载告知函······" spinning={downLoading}>
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
                  <div style={{ float: 'right' }}>
                    <Button
                      size="small"
                      style={{ marginRight: 5 }}
                      onClick={this.getVQueryLicenseV2}
                    >
                      获取车辆行驶证信息
                    </Button>
                    {/* <Button size="small" style={{ marginRight: 5 }} onClick={this.notDev}>
                      交警系统查询
                    </Button>
                    <Button size="small" style={{ marginRight: 5 }} onClick={this.notDev}>
                      运政系统查询
                    </Button> */}
                    <Button size="small" href="http://www.gsxt.gov.cn/index.html" target="_blank">
                      企业法人查询
                    </Button>
                  </div>
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
              {openRecord.length ? (
                <div className={themeStyle.detailMsg} style={{ marginTop: 16 }}>
                  <div className={themeStyle.detailMsgTitle}>
                    <Icon type="table" />
                    &nbsp;操作记录
                  </div>
                  <div className={themeStyle.recordList} style={{ padding: '0 20px 20px' }}>
                    <RecordList loading={loading} list={openRecord} columns={this.columns} />
                  </div>
                </div>
              ) : null}
            </Spin>
          </Modal>
        ) : null}
        {invalidDataVisible && (
          <InvalidDataModal {...invalidDataMehtods} modalVisible={invalidDataVisible} />
        )}
        {focusDataVisible && (
          <FocusDataModal {...focusDataMethods} modalVisible={focusDataVisible} />
        )}

        {licenseVisible && licenseData.length && (
          <LicenseModal
            data={licenseData}
            modalVisible={licenseVisible}
            handleModalVisible={this.handleLicenseVisible}
            modalCallback={this.licenseCallback}
          />
        )}
      </Fragment>
    );
  }
}

export default washModal;
