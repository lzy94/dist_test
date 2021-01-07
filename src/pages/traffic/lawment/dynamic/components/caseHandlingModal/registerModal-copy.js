import React, {PureComponent, Fragment} from 'react';
import {
  Form,
  Icon,
  Modal,
  Divider,
  Upload,
  Button,
  Row,
  Col,
  Radio,
  Input,
  Select,
  InputNumber,
  DatePicker, Tooltip, Popover, message, Spin,
} from "antd";
import {connect} from "dva";
import moment from 'moment'
import publicCss from '@/pages/style/public.less';
import {getLocalStorage, checkPhone, imgUrl, checkAuth} from '@/utils/utils';
import themeStyle from "@/pages/style/theme.less";

const authority = ['/lawment/dynamic/casehand/lawCaseRegist'];

const {RangePicker} = DatePicker;
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const formItemStyle = {
  marginBottom: 0
};


@connect(({DynamicLaw, loading}) => ({
  DynamicLaw,
  loading: loading.models.DynamicLaw,
}))

@Form.create()
class RegisterModal extends PureComponent {
  static defaultProps = {
    handleModalVisible: () => {
    }
  };

  state = {
    detail: {},
    registerInfo: {},
    busDynamicLawDate: {},
    openRecord: {},
    previewCode: '',
    partyRadio: 1,
    isAgent: 0,
    fileListCardUrl: [],
    fileListDriveLicense: [],
    fileListDriverLicense: [],
    fileListAgentIdCard: [],
    fileListTransportLicense: [],
    fileListPractitioner: []
  };

  componentDidMount() {
    this.getDetail();
  }

  // 案件初始化数据
  getDetail = () => {
    const {dispatch, detailID} = this.props;
    dispatch({
      type: 'DynamicLaw/detail',
      payload: {id: detailID},
      callback: res => {
        const registerInfo = res.registerInfo || {};
        this.setState({
          truckBelong: registerInfo.truckBelong || 1,
          previewCode: res.busDynamicLawDate.previewCode,
          registerInfo: registerInfo,
          busDynamicLawDate: res.busDynamicLawDate,
          openRecord: res.openRecord,
          partyRadio: registerInfo.truckBelong
        })
      }
    })
  };

  partyRadioChange = e => {
    const value = e.target.value;
    this.setState({partyRadio: value});
  };

  isAgentChange = e => {
    const value = e.target.value;
    this.setState({isAgent: value});
  };

  // 当事人  个人
  renderParty = () => {
    const {form} = this.props;
    const {registerInfo} = this.state;
    return (
      <Form labelCol={{span: 6}} wrapperCol={{span: 18}}>
        <Row gutter={{md: 8, lg: 16, xl: 16}}>
          <Col md={8} sm={24}>
            <FormItem style={formItemStyle} label='姓名'>
              {form.getFieldDecorator('partyName', {
                initialValue: registerInfo.vehicleOwner
              })(
                <Input readOnly/>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem style={formItemStyle} label='性别'>
              {form.getFieldDecorator('partySex', {
                initialValue: 1
              })(
                <Select style={{width: '100%'}}>
                  <Option value={1}>男</Option>
                  <Option value={2}>女</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem style={formItemStyle} label='身份证号'>
              {form.getFieldDecorator('partyIdcard', {
                initialValue: registerInfo.idCard
              })(
                <Input readOnly/>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem style={formItemStyle} label='联系方式'>
              {form.getFieldDecorator('partyTel', {
                initialValue: registerInfo.phone
              })(
                <Input readOnly/>
              )}
            </FormItem>
          </Col>
          <Col md={16} sm={24}>
            <FormItem style={formItemStyle} label='住址' labelCol={{span: 3}} wrapperCol={{span: 21}}>
              {form.getFieldDecorator('partyAddr', {
                initialValue: registerInfo.vehicleOwnerAddr
              })(
                <Input readOnly/>
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  };

  // 当事人 企业
  renderPartyEnterprise = () => {
    const {form} = this.props;
    const {registerInfo} = this.state;
    return (
      <Form labelCol={{span: 6}} wrapperCol={{span: 18}}>
        <Row gutter={{md: 8, lg: 16, xl: 16}}>
          <Col md={8} sm={24}>
            <FormItem style={formItemStyle} label='企业名称'>
              {form.getFieldDecorator('partyName', {
                initialValue: registerInfo.vehicleOwner
              })(
                <Input readOnly/>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem style={formItemStyle} label='法定代表人'>
              {form.getFieldDecorator('legalMan', {
                initialValue: registerInfo.legalRepresentative
              })(
                <Input/>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{span: 7}} wrapperCol={{span: 17}} style={formItemStyle} label='统一信用代码'>
              {form.getFieldDecorator('creditCode', {
                initialValue: registerInfo.creditCode
              })(
                <Input/>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem style={formItemStyle} label='企业电话'>
              {form.getFieldDecorator('companyTel', {
                initialValue: ''
              })(
                <Input/>
              )}
            </FormItem>
          </Col>
          <Col md={16} sm={24}>
            <FormItem labelCol={{span: 3}} wrapperCol={{span: 21}} style={formItemStyle} label='注册地址'>
              {form.getFieldDecorator('companyAddr', {
                initialValue: registerInfo.registAddr
              })(
                <Input/>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem style={formItemStyle} label='法人手机'>
              {form.getFieldDecorator('legalManTel', {
                initialValue: registerInfo.phone
              })(
                <Input readOnly/>
              )}
            </FormItem>
          </Col>
          <Col md={16} sm={24}>
            <FormItem labelCol={{span: 4}} wrapperCol={{span: 20}} style={formItemStyle} label='法人家庭住址'>
              {form.getFieldDecorator('legalManAddr', {
                initialValue: ''
              })(
                <Input/>
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  };

  // 委托
  renderAgent = () => {
    const {form} = this.props;
    return (
      <Form labelCol={{span: 6}} wrapperCol={{span: 18}}>
        <Row gutter={{md: 8, lg: 16, xl: 16}}>
          <Col md={8} sm={24}>
            <FormItem style={formItemStyle} label='代理人姓名'>
              {form.getFieldDecorator('agentName', {
                initialValue: ''
              })(
                <Input/>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem style={formItemStyle} label='性别'>
              {form.getFieldDecorator('agentSex', {
                initialValue: 1
              })(
                <Select>
                  <Option value={1}>男</Option>
                  <Option value={2}>女</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem style={formItemStyle} label='身份证号'>
              {form.getFieldDecorator('agentIdcard', {
                initialValue: ''
              })(
                <Input/>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem style={formItemStyle} label='联系方式'>
              {form.getFieldDecorator('agentTel', {
                initialValue: '',
                rules: [{
                  validator: checkPhone,
                }],
              })(
                <Input/>
              )}
            </FormItem>
          </Col>
          <Col md={16} sm={24}>
            <FormItem labelCol={{span: 3}} wrapperCol={{span: 21}} style={formItemStyle} label='住址'>
              {form.getFieldDecorator('agentAddr', {
                initialValue: ''
              })(
                <Input/>
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  };

  // 驾驶员
  renderDriver = () => {
    const {form} = this.props;
    const {partyRadio} = this.state;
    const registerInfo = partyRadio === 1 ? this.state.registerInfo : {};

    return (
      <Form labelCol={{span: 6}} wrapperCol={{span: 18}}>
        <Row gutter={{md: 8, lg: 16, xl: 16}}>
          <Col md={8} sm={24}>
            <FormItem style={formItemStyle} label='驾驶员姓名'>
              {form.getFieldDecorator('driverName', {
                initialValue: registerInfo.vehicleOwner
              })(
                <Input/>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem style={formItemStyle} label='性别'>
              {form.getFieldDecorator('driverSex', {
                initialValue: 1
              })(
                <Select>
                  <Option value={1}>男</Option>
                  <Option value={2}>女</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem style={formItemStyle} label='身份证号'>
              {form.getFieldDecorator('driverIdcard', {
                initialValue: registerInfo.idCard
              })(
                <Input/>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem style={formItemStyle} label='联系方式'>
              {form.getFieldDecorator('driverTel', {
                initialValue: registerInfo.phone,
                rules: [{
                  required: true,
                  validator: checkPhone,
                }],
              })(
                <Input/>
              )}
            </FormItem>
          </Col>
          <Col md={16} sm={24}>
            <FormItem labelCol={{span: 3}} wrapperCol={{span: 21}} style={formItemStyle} label='住址'>
              {form.getFieldDecorator('driverAddr', {
                initialValue: registerInfo.vehicleOwnerAddr
              })(
                <Input/>
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  };

  toops = () => {
    return <div style={{width: 400}}>
      <h3>非现场执法处罚优惠规则</h3>
      <p>
        1、违法超限超载<span style={{color: 'red'}}>5吨</span>以上-<span style={{color: 'red'}}>10吨</span>以下的，按《超限运输车辆行驶公路管理规定》的处罚标准减轻80%实施处罚。<br/>
        2、违法超限超载<span style={{color: 'red'}}>10吨</span>以上-<span style={{color: 'red'}}>20吨</span>以下的，按《超限运输车辆行驶公路管理规定》的处罚标准减轻75%实施处罚。<br/>
        3、违法超限超载<span style={{color: 'red'}}>20吨</span>以上-<span style={{color: 'red'}}>30吨</span>以下的，按《超限运输车辆行驶公路管理规定》的处罚标准减轻70%实施处罚。<br/>
        4、违法超限超载<span style={{color: 'red'}}>30吨</span>以上-<span style={{color: 'red'}}>40吨</span>以下的，按《超限运输车辆行驶公路管理规定》的处罚标准减轻65%实施处罚。<br/>
        5、违法超限超载<span style={{color: 'red'}}>40吨</span>以上的，按《超限运输车辆行驶公路管理规定》的处罚标准减轻60%实施处罚。<br/>
        6、1年内同一车辆经动态自动称重设备记录多次违法行为且主动前来接受调查处理的，按《超限运输车辆行驶公路管理规定》的处罚标准，累计罚款不超过<span style={{color: 'red'}}>3万元</span>。
      </p>
    </div>
  }

  // 案件信息
  renderCaseInfo = () => {
    const {form} = this.props;
    const {registerInfo, busDynamicLawDate} = this.state;
    return (
      <Form labelCol={{span: 6}} wrapperCol={{span: 18}}>
        <Row gutter={{md: 8, lg: 16, xl: 16}}>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 4}} wrapperCol={{span: 20}} style={formItemStyle} label='案件来源'>
              {form.getFieldDecorator('caseSource', {
                initialValue: '非现场执法'
              })(
                <Select>
                  <Option value='非现场执法'>非现场执法</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem labelCol={{span: 10}} wrapperCol={{span: 14}} style={formItemStyle} label='案由'>
              {form.getFieldDecorator('caseReasonCarNo', {
                initialValue: registerInfo.carNo
              })(
                <Input readOnly/>
              )}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem wrapperCol={{span: 24}} style={formItemStyle}>
              {form.getFieldDecorator('caseReason', {
                initialValue: ''
              })(
                <Input/>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} style={formItemStyle} label='车货总重(kg)'>
              {form.getFieldDecorator('weight', {
                initialValue: registerInfo.totalWeight
              })(
                <InputNumber readOnly style={{width: '100%'}}/>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} style={formItemStyle} label='轴数'>
              {form.getFieldDecorator('axisNum', {
                initialValue: busDynamicLawDate.axleNumber
              })(
                <InputNumber readOnly style={{width: '100%'}}/>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} style={formItemStyle} label='超限(kg)'>
              {form.getFieldDecorator('limited', {
                initialValue: busDynamicLawDate.overLoad
              })(
                <InputNumber readOnly style={{width: '100%'}}/>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <div className={publicCss.inputTip}>
              <Popover content={this.toops()}>
                <Icon type="question-circle"/>
              </Popover>
            </div>
            <FormItem labelCol={{span: 10}} wrapperCol={{span: 14}} style={formItemStyle}
                      className={publicCss.inputLabelLeft} label='处罚金额'>
              {form.getFieldDecorator('punishMoney', {
                initialValue: '',
                rules: [{required: true, message: '请输入处罚金额'}]
              })(
                <InputNumber style={{width: '100%'}}/>
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 4}} wrapperCol={{span: 20}} style={formItemStyle} label='货物名称'>
              {form.getFieldDecorator('goodsName', {
                initialValue: '',
                rules: [{required: true, message: '请输入货物名称'}]
              })(
                <Input/>
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 4}} wrapperCol={{span: 20}} style={formItemStyle} label='询问时间'>
              {form.getFieldDecorator('askTime', {
                initialValue: '',
                rules: [{
                  required: true,
                  message: '请选择询问时间'
                }],
              })(
                <RangePicker showTime style={{width: '100%'}}/>
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 4}} wrapperCol={{span: 20}} style={formItemStyle} label='案卷号'>
              {form.getFieldDecorator('caseNo', {
                initialValue: '',
                rules: [{
                  required: true,
                  message: '请输入案卷号',
                }],
              })(
                <InputNumber style={{width: '100%'}}/>
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem labelCol={{span: 4}} wrapperCol={{span: 20}} style={formItemStyle} label='讨论时间'>
              {form.getFieldDecorator('discussTime', {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    message: '请选择讨论时间',
                  },
                ],
              })(
                <RangePicker showTime style={{width: '100%'}}/>
              )}
            </FormItem>
          </Col>


          <Col md={6} sm={24}>
            <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} style={formItemStyle} label='承办人'>
              {form.getFieldDecorator('undertaker', {
                initialValue: '',
                rules: [{required: true, message: '请输入承办人 '}]
              })(
                <Input/>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} style={formItemStyle} label='执法证号'>
              {form.getFieldDecorator('enforcementNo', {
                initialValue: ''
              })(
                <Input/>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} style={formItemStyle} label='协办人'>
              {form.getFieldDecorator('coOrganizer', {
                initialValue: '',
                rules: [{
                  required: true,
                  message: '请输入协办人'
                }],
              })(
                <Input/>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} style={formItemStyle} label='执法证号'>
              {form.getFieldDecorator('organizerNo', {
                initialValue: ''
              })(
                <Input/>
              )}
            </FormItem>
          </Col>
          <Col md={24} sm={24}>
            <FormItem labelCol={{span: 2}} wrapperCol={{span: 22}} style={formItemStyle} label='车辆说明'>
              {form.getFieldDecorator('carDesc', {
                initialValue: ''
              })(
                <Input.TextArea autosize/>
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  };

  cardUrlChange = info => {
    this.imgChangeUtil(info, fileList => {
      this.setState({fileListCardUrl: fileList})
    })
  };

  driveLicenseChange = info => {
    this.imgChangeUtil(info, fileList => {
      this.setState({fileListDriveLicense: fileList})
    })
  };

  driverLicenseChange = info => {
    this.imgChangeUtil(info, fileList => {
      this.setState({fileListDriverLicense: fileList})
    })
  };

  agentIdCardChange = info => {
    this.imgChangeUtil(info, fileList => {
      this.setState({fileListAgentIdCard: fileList})
    })
  };

  transportLicenseChange = info => {
    this.imgChangeUtil(info, fileList => {
      this.setState({fileListTransportLicense: fileList})
    })
  };

  practitionerChange = info => {
    this.imgChangeUtil(info, fileList => {
      this.setState({fileListPractitioner: fileList})
    })
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
    } else if (info.file.status === "removed") {
      callback(info.fileList);
    }
  };


  // 附件
  renderEnclosure = () => {
    const {form} = this.props;
    const {isAgent, fileListCardUrl, fileListDriveLicense, fileListDriverLicense, fileListAgentIdCard, fileListTransportLicense, fileListPractitioner} = this.state;
    const uploadBase = {
      name: 'files',
      action: '/result/api/file/v1/fileUpload',
      listType: 'picture',
      accept: '.jpg,.jpeg,.png',
      data: {
        type: 5,
        xbType: ''
      },
      headers: {
        'Authorization': `Bearer ${getLocalStorage('token')[0]}`,
        'x-requested-with': 'XMLHttpRequest'
      },
    };

    return (
      <Fragment>
        <Row gutter={{md: 8, lg: 16, xl: 16}}>
          <Col md={8} sm={24}>
            <FormItem style={formItemStyle} label='当事人身份证/企业营业执照'>
              {form.getFieldDecorator('cardUrl', {
                rules: [{required: true, message: '请上传当事人身份证/企业营业执照'}]
              })(
                <Upload {...uploadBase} defaultFileList={fileListCardUrl} onChange={this.cardUrlChange}>
                  {fileListCardUrl.length ? null : <Button>
                    <Icon type="upload"/> 选择图片
                  </Button>}
                </Upload>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem style={formItemStyle} label='车辆行驶证'>
              {form.getFieldDecorator('driveLicenseUrl', {
                rules: [{required: true, message: '请上传车辆行驶证'}]
              })(
                <Upload {...uploadBase} defaultFileList={fileListDriveLicense} onChange={this.driveLicenseChange}>
                  {fileListDriveLicense.length ? null : <Button>
                    <Icon type="upload"/> 选择图片
                  </Button>}
                </Upload>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem style={formItemStyle} label='驾驶员驾驶证'>
              {form.getFieldDecorator('driverLicenseUrl', {
                rules: [{required: true, message: '请上传驾驶员驾驶证'}]
              })(
                <Upload {...uploadBase} defaultFileList={fileListDriverLicense} onChange={this.driverLicenseChange}>
                  {fileListDriverLicense.length ? null : <Button>
                    <Icon type="upload"/> 选择图片
                  </Button>}
                </Upload>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={
          {
            md: 8, lg: 16, xl: 16
          }
        }>
          {isAgent ? <Col md={8} sm={24}>
            <FormItem
              style={formItemStyle}
              label='委托代理人身份证'>
              {
                form.getFieldDecorator('agentIdcardUrl', {
                  rules: [{required: true, message: '请上传委托代理人身份证'}]
                })(
                  <Upload {...uploadBase} defaultFileList={fileListAgentIdCard} onChange={this.agentIdCardChange}>
                    {fileListAgentIdCard.length ? null : <Button>
                      <Icon type="upload"/> 选择图片
                    </Button>}
                  </Upload>
                )
              }
            </FormItem>
          </Col> : null}
          <Col md={8} sm={24}>
            <FormItem style={formItemStyle} label='车辆道路运输证或其他'>
              {form.getFieldDecorator('transportLicenseUrl', {
                rules: [{required: true, message: '请上传车辆道路运输证或其他'}]
              })(
                <Upload {...uploadBase} defaultFileList={fileListTransportLicense}
                        onChange={this.transportLicenseChange}>
                  {fileListTransportLicense.length ? null : <Button>
                    <Icon type="upload"/> 选择图片
                  </Button>}
                </Upload>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem style={formItemStyle} label='驾驶员从业资格证或其他'>
              {form.getFieldDecorator('practitionerUrl', {
                rules: [{required: true, message: '请上传驾驶员从业资格证或其他'}]
              })(
                <Upload {...uploadBase} defaultFileList={fileListPractitioner} onChange={this.practitionerChange}>
                  {fileListPractitioner.length ? null : <Button>
                    <Icon type="upload"/> 选择图片
                  </Button>}
                </Upload>
              )}
            </FormItem>
          </Col>
        </Row>
      </Fragment>
    );
  };

  okHandle = () => {
    const {form, dispatch, modalSuccess, handleModalVisible} = this.props;
    const {busDynamicLawDate} = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // form.resetFields();
      const field = JSON.parse(JSON.stringify(fieldsValue));

      const askTime = fieldsValue.askTime || ['', ''];
      const discussTime = fieldsValue.discussTime || ['', ''];
      field.askBeginTime = moment(askTime[0]).format('YYYY-MM-DD HH:mm:ss');
      field.askEndTime = moment(askTime[1]).format('YYYY-MM-DD HH:mm:ss');
      field.discussBeginTime = moment(discussTime[0]).format('YYYY-MM-DD HH:mm:ss');
      field.discussEndTime = moment(discussTime[1]).format('YYYY-MM-DD HH:mm:ss');
      field.caseReason = fieldsValue.caseReasonCarNo + ',' + fieldsValue.caseReason;

      if (typeof fieldsValue.cardUrl === 'object') {
        const response = fieldsValue.cardUrl.file.response;
        field.cardUrl = response ? response.filePath : '';
      }
      if (typeof fieldsValue.driveLicenseUrl === 'object') {
        const response = fieldsValue.driveLicenseUrl.file.response;
        field.driveLicenseUrl = response ? response.filePath : '';
      }
      if (typeof fieldsValue.driverLicenseUrl === 'object') {
        const response = fieldsValue.driverLicenseUrl.file.response;
        field.driverLicenseUrl = response ? response.filePath : '';
      }
      if (typeof fieldsValue.agentIdcardUrl === 'object') {
        const response = fieldsValue.agentIdcardUrl.file.response;
        field.agentIdcardUrl = response ? response.filePath : '';
      }
      if (typeof fieldsValue.transportLicenseUrl === 'object') {
        const response = fieldsValue.transportLicenseUrl.file.response;
        field.transportLicenseUrl = response ? response.filePath : '';
      }
      if (typeof fieldsValue.practitionerUrl === 'object') {
        const response = fieldsValue.practitionerUrl.file.response;
        field.practitionerUrl = response ? response.filePath : '';
      }
      field.previewCode = busDynamicLawDate.previewCode;

      delete field.askTime;
      delete field.discussTime;
      delete field.caseReasonCarNo;
      dispatch({
        type: 'DynamicLaw/lawCaseRegist',
        payload: field,
        callback: () => {
          modalSuccess();
          setTimeout(() => handleModalVisible(), 500);
        }
      });
    });
  };

  modalTitle = () => {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingRight: 20,
        }}
      >
        <div>
          <span>案件登记</span>
        </div>
        <div>
          {checkAuth(authority[0]) ? <Button size="small" type="primary" onClick={() => this.okHandle()}>
            保存案件
          </Button> : null}
        </div>
      </div>
    );
  };

  render() {
    const {form, modalVisible, handleModalVisible} = this.props;
    const {partyRadio, isAgent} = this.state;

    return (
      <Modal
        destroyOnClose
        className={themeStyle.modalStyle}
        title={this.modalTitle()}
        visible={modalVisible}
        onCancel={() => handleModalVisible()}
        width={1150}
        footer={null}
      >
        <Divider orientation="left">当事人信息</Divider>
        <FormItem style={formItemStyle}>
          {form.getFieldDecorator('personalororgan', {
            initialValue: partyRadio
          })(
            <RadioGroup disabled onChange={this.partyRadioChange}>
              <Radio value={1}>个人</Radio>
              <Radio value={2}>企业或其他组织</Radio>
            </RadioGroup>
          )}
        </FormItem>
        {/* 当事人 */}
        {partyRadio === 1 ? this.renderParty() : this.renderPartyEnterprise()}
        <Divider orientation="left">委托代理人信息</Divider>
        <FormItem labelCol={{span: 2}} wrapperCol={{span: 10}} style={formItemStyle} label='委托代理人'>
          {form.getFieldDecorator('isAgent', {
            initialValue: isAgent
          })(
            <RadioGroup onChange={this.isAgentChange}>
              <Radio value={1}>是</Radio>
              <Radio value={0}>否</Radio>
            </RadioGroup>
          )}
        </FormItem>
        {isAgent ? this.renderAgent() : null}
        <Divider orientation="left">驾驶员信息</Divider>
        {this.renderDriver()}
        <Divider orientation="left">案件信息</Divider>
        {this.renderCaseInfo()}
        <Divider orientation="left">附件</Divider>
        {this.renderEnclosure()}
      </Modal>
    )
  }
}

export default RegisterModal;
