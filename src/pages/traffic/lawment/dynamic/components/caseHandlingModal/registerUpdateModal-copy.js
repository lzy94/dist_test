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
  DatePicker,
  Popover, message, Spin,
} from 'antd';
import {connect} from 'dva';
import moment from 'moment';
import {getLocalStorage, checkPhone, imgUrl, checkAuth} from '@/utils/utils';
import publicCss from '@/pages/style/public.less';
import TemplateModal from '../base/printModal';

const {RangePicker} = DatePicker;
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const formItemStyle = {
  marginBottom: 0,
};

const authority = ['/lawment/dynamic/casehand/lawCaseRegist', '/lawment/dynamic/casehand/getFilePrint'];

@connect(({File, DynamicLaw, loading}) => ({
  File,
  DynamicLaw,
  loading: loading.models.DynamicLaw,
  fileLoading: loading.models.File,
}))
@Form.create()
class RegisterUpdateModal extends PureComponent {
  static defaultProps = {
    handleModalVisible: () => {
    },
  };

  state = {
    detail: {},
    partyRadio: 1,
    isAgent: 0,
    templateVisible: false,
    fileListCardUrl: [],
    fileListDriveLicense: [],
    fileListDriverLicense: [],
    fileListAgentIdCard: [],
    fileListTransportLicense: [],
    fileListPractitioner: [],
    pageBean: {
      page: 1,
      pageSize: 100,
      showTotal: true,
    },
    baseQuery: [
      {
        property: 'fileType',
        value: 3,
        group: 'main',
        operation: 'EQUAL',
        relation: 'AND',
      },
    ],
  };

  componentDidMount() {
    this.getLawCase();
  }

  // 获取案件信息
  getLawCase = () => {
    const {dispatch, previewCode} = this.props;
    dispatch({
      type: 'DynamicLaw/getLawCase',
      payload: {previewCode},
      callback: res => {
        if (res) {
          this.setState({
            partyRadio: parseInt(res.personalororgan),
            isAgent: parseInt(res.isAgent),
          });
          this.setStateImage(res, () => {
            setTimeout(() => {
              this.setState({detail: res})
            }, 100)
          });
        }
      },
    });
  };

  handleTemplateVisible = flag => {
    this.setState({templateVisible: !!flag});
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
    const {detail} = this.state;
    return (
      <Form labelCol={{span: 6}} wrapperCol={{span: 18}}>
        <Row gutter={{md: 8, lg: 16, xl: 16}}>
          <Col md={8} sm={24}>
            <FormItem style={formItemStyle} label="姓名">
              {form.getFieldDecorator('partyName', {
                initialValue: detail.partyName,
              })(<Input readOnly/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem style={formItemStyle} label="性别">
              {form.getFieldDecorator('partySex', {
                initialValue: detail.partySex,
              })(
                <Select style={{width: '100%'}}>
                  <Option value={1}>男</Option>
                  <Option value={2}>女</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem style={formItemStyle} label="身份证号">
              {form.getFieldDecorator('partyIdcard', {
                initialValue: detail.partyIdcard,
              })(<Input readOnly/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem style={formItemStyle} label="联系方式">
              {form.getFieldDecorator('partyTel', {
                initialValue: detail.partyTel,
              })(<Input readOnly/>)}
            </FormItem>
          </Col>
          <Col md={16} sm={24}>
            <FormItem
              style={formItemStyle}
              label="住址"
              labelCol={{span: 3}}
              wrapperCol={{span: 21}}
            >
              {form.getFieldDecorator('partyAddr', {
                initialValue: detail.partyAddr,
              })(<Input readOnly/>)}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  };

  // 当事人 企业
  renderPartyEnterprise = () => {
    const {form} = this.props;
    const {detail} = this.state;
    return (
      <Form labelCol={{span: 6}} wrapperCol={{span: 18}}>
        <Row gutter={{md: 8, lg: 16, xl: 16}}>
          <Col md={8} sm={24}>
            <FormItem style={formItemStyle} label="企业名称">
              {form.getFieldDecorator('partyName', {
                initialValue: detail.partyName,
              })(<Input readOnly/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem style={formItemStyle} label="法定代表人">
              {form.getFieldDecorator('legalMan', {
                initialValue: detail.legalMan,
              })(<Input/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem
              labelCol={{span: 7}}
              wrapperCol={{span: 17}}
              style={formItemStyle}
              label="统一信用代码"
            >
              {form.getFieldDecorator('creditCode', {
                initialValue: detail.creditCode,
              })(<Input/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem style={formItemStyle} label="企业电话">
              {form.getFieldDecorator('companyTel', {
                initialValue: detail.companyTel,
              })(<Input/>)}
            </FormItem>
          </Col>
          <Col md={16} sm={24}>
            <FormItem
              labelCol={{span: 3}}
              wrapperCol={{span: 21}}
              style={formItemStyle}
              label="注册地址"
            >
              {form.getFieldDecorator('companyAddr', {
                initialValue: detail.companyAddr,
              })(<Input/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem style={formItemStyle} label="法人手机">
              {form.getFieldDecorator('legalManTel', {
                initialValue: detail.legalManTel,
              })(<Input readOnly/>)}
            </FormItem>
          </Col>
          <Col md={16} sm={24}>
            <FormItem
              labelCol={{span: 4}}
              wrapperCol={{span: 20}}
              style={formItemStyle}
              label="法人家庭住址"
            >
              {form.getFieldDecorator('legalManAddr', {
                initialValue: detail.legalManAddr,
              })(<Input/>)}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  };

  // 委托
  renderAgent = () => {
    const {form} = this.props;
    const {detail} = this.state;
    return (
      <Form labelCol={{span: 6}} wrapperCol={{span: 18}}>
        <Row gutter={{md: 8, lg: 16, xl: 16}}>
          <Col md={8} sm={24}>
            <FormItem style={formItemStyle} label="代理人姓名">
              {form.getFieldDecorator('agentName', {
                initialValue: detail.agentName,
              })(<Input/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem style={formItemStyle} label="性别">
              {form.getFieldDecorator('agentSex', {
                initialValue: detail.agentSex,
              })(
                <Select>
                  <Option value={1}>男</Option>
                  <Option value={2}>女</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem style={formItemStyle} label="身份证号">
              {form.getFieldDecorator('agentIdcard', {
                initialValue: detail.agentIdcard,
              })(<Input/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem style={formItemStyle} label="联系方式">
              {form.getFieldDecorator('agentTel', {
                initialValue: detail.agentTel,
                rules: [
                  {
                    validator: checkPhone,
                  },
                ],
              })(<Input/>)}
            </FormItem>
          </Col>
          <Col md={16} sm={24}>
            <FormItem
              labelCol={{span: 3}}
              wrapperCol={{span: 21}}
              style={formItemStyle}
              label="住址"
            >
              {form.getFieldDecorator('agentAddr', {
                initialValue: detail.agentAddr,
              })(<Input/>)}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  };

  // 驾驶员
  renderDriver = () => {
    const {form} = this.props;
    const {detail} = this.state;

    return (
      <Form labelCol={{span: 6}} wrapperCol={{span: 18}}>
        <Row gutter={{md: 8, lg: 16, xl: 16}}>
          <Col md={8} sm={24}>
            <FormItem style={formItemStyle} label="驾驶员姓名">
              {form.getFieldDecorator('driverName', {
                initialValue: detail.driverName,
              })(<Input/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem style={formItemStyle} label="性别">
              {form.getFieldDecorator('driverSex', {
                initialValue: detail.driverSex,
              })(
                <Select>
                  <Option value={1}>男</Option>
                  <Option value={2}>女</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem style={formItemStyle} label="身份证号">
              {form.getFieldDecorator('driverIdcard', {
                initialValue: detail.driverIdcard,
              })(<Input/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem style={formItemStyle} label="联系方式">
              {form.getFieldDecorator('driverTel', {
                initialValue: detail.driverTel,
                rules: [
                  {
                    required: true,
                    validator: checkPhone,
                  },
                ],
              })(<Input/>)}
            </FormItem>
          </Col>
          <Col md={16} sm={24}>
            <FormItem
              labelCol={{span: 3}}
              wrapperCol={{span: 21}}
              style={formItemStyle}
              label="住址"
            >
              {form.getFieldDecorator('driverAddr', {
                initialValue: detail.driverAddr,
              })(<Input/>)}
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
    const {detail} = this.state;
    return (
      <Form labelCol={{span: 6}} wrapperCol={{span: 18}}>
        <Row gutter={{md: 8, lg: 16, xl: 16}}>
          <Col md={12} sm={24}>
            <FormItem
              labelCol={{span: 4}}
              wrapperCol={{span: 20}}
              style={formItemStyle}
              label="案件来源"
            >
              {form.getFieldDecorator('caseSource', {
                initialValue: detail.caseSource || '非现场执法',
              })(
                <Select>
                  <Option value="非现场执法">非现场执法</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem
              labelCol={{span: 10}}
              wrapperCol={{span: 14}}
              style={formItemStyle}
              label="案由"
            >
              {form.getFieldDecorator('caseReasonCarNo', {
                initialValue: detail.caseReason ? detail.caseReason.split(',')[0] : '',
              })(<Input readOnly/>)}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem wrapperCol={{span: 24}} style={formItemStyle}>
              {form.getFieldDecorator('caseReason', {
                initialValue: detail.caseReason ? detail.caseReason.split(',')[1] : '',
              })(<Input/>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem
              labelCol={{span: 8}}
              wrapperCol={{span: 16}}
              style={formItemStyle}
              label="车货总重"
            >
              {form.getFieldDecorator('weight', {
                initialValue: detail.weight,
              })(<InputNumber readOnly style={{width: '100%'}}/>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem
              labelCol={{span: 8}}
              wrapperCol={{span: 16}}
              style={formItemStyle}
              label="轴数"
            >
              {form.getFieldDecorator('axisNum', {
                initialValue: detail.axisNum,
              })(<InputNumber readOnly style={{width: '100%'}}/>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem
              labelCol={{span: 8}}
              wrapperCol={{span: 16}}
              style={formItemStyle}
              label="超限"
            >
              {form.getFieldDecorator('limited', {
                initialValue: detail.limited,
              })(<InputNumber readOnly style={{width: '100%'}}/>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <div className={publicCss.inputTip}>
              <Popover content={this.toops()}>
                <Icon type="question-circle"/>
              </Popover>
            </div>
            <FormItem
              labelCol={{span: 10}}
              wrapperCol={{span: 14}}
              style={formItemStyle}
              label="处罚金额"
              className={publicCss.inputLabelLeft}
            >
              {form.getFieldDecorator('punishMoney', {
                initialValue: detail.punishMoney,
                rules: [{required: true, message: '请输入处罚金额'}]
              })(<InputNumber style={{width: '100%'}}/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem
              labelCol={{span: 4}}
              wrapperCol={{span: 20}}
              style={formItemStyle}
              label="货物名称"
            >
              {form.getFieldDecorator('goodsName', {
                initialValue: detail.goodsName,
                rules: [{required: true, message: '请输入货物名称'}],
              })(<Input/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem
              labelCol={{span: 4}}
              wrapperCol={{span: 20}}
              style={formItemStyle}
              label="询问时间"
            >
              {form.getFieldDecorator('askTime', {
                initialValue:
                  detail.askBeginTime && detail.askEndTime
                    ? [
                      moment(new Date(detail.askBeginTime), 'YYYY-MM-DD HH:mm:ss'),
                      moment(new Date(detail.askEndTime), 'YYYY-MM-DD HH:mm:ss'),
                    ]
                    : '',
                rules: [
                  {
                    required: true,
                    message: '请选择询问时间',
                  },
                ],
              })(<RangePicker showTime style={{width: '100%'}}/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem
              labelCol={{span: 4}}
              wrapperCol={{span: 20}}
              style={formItemStyle}
              label="案卷号"
            >
              {form.getFieldDecorator('caseNo', {
                initialValue: detail.caseNo,
                rules: [
                  {
                    required: true,
                    message: '请输入案卷号',
                  },
                ],
              })(<InputNumber style={{width: '100%'}}/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem
              labelCol={{span: 4}}
              wrapperCol={{span: 20}}
              style={formItemStyle}
              label="讨论时间"
            >
              {form.getFieldDecorator('discussTime', {
                rules: [
                  {
                    required: true,
                    message: '请选择讨论时间',
                  },
                ],
                initialValue:
                  detail.discussBeginTime && detail.discussEndTime
                    ? [
                      moment(new Date(detail.discussBeginTime), 'YYYY-MM-DD HH:mm:ss'),
                      moment(new Date(detail.discussEndTime), 'YYYY-MM-DD HH:mm:ss'),
                    ]
                    : '',
              })(<RangePicker showTime style={{width: '100%'}}/>)}
            </FormItem>
          </Col>

          <Col md={6} sm={24}>
            <FormItem
              labelCol={{span: 8}}
              wrapperCol={{span: 16}}
              style={formItemStyle}
              label="承办人"
            >
              {form.getFieldDecorator('undertaker', {
                initialValue: detail.undertaker || '',
                rules: [{required: true, message: '请输入承办人 '}]
              })(<Input/>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem
              labelCol={{span: 8}}
              wrapperCol={{span: 16}}
              style={formItemStyle}
              label="执法证号"
            >
              {form.getFieldDecorator('enforcementNo', {
                initialValue: detail.enforcementNo,
              })(<Input/>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem
              labelCol={{span: 8}}
              wrapperCol={{span: 16}}
              style={formItemStyle}
              label="协办人"
            >
              {form.getFieldDecorator('coOrganizer', {
                initialValue: detail.coOrganizer,
                rules: [
                  {
                    required: true,
                    message: '请输入协办人',
                  },
                ],
              })(<Input/>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem
              labelCol={{span: 8}}
              wrapperCol={{span: 16}}
              style={formItemStyle}
              label="执法证号"
            >
              {form.getFieldDecorator('organizerNo', {
                initialValue: detail.organizerNo,
              })(<Input/>)}
            </FormItem>
          </Col>
          <Col md={24} sm={24}>
            <FormItem
              labelCol={{span: 2}}
              wrapperCol={{span: 22}}
              style={formItemStyle}
              label="车辆说明"
            >
              {form.getFieldDecorator('carDesc', {
                initialValue: detail.carDesc,
              })(<Input.TextArea autosize/>)}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  };

  formatUploadImg = (detail, field, str) => {
    this.setState({
      [str]: detail[field]
        ? [
          {
            uid: '1',
            name: '当前图片',
            status: 'done',
            url: imgUrl + detail[field],
            thumbUrl: imgUrl + detail[field],
          },
        ]
        : []
    })
  };

  setStateImage = (detail, callback) => {
    this.formatUploadImg(detail, 'cardUrl', 'fileListCardUrl');
    this.formatUploadImg(detail, 'driveLicenseUrl', 'fileListDriveLicense');
    this.formatUploadImg(detail, 'driverLicenseUrl', 'fileListDriverLicense');
    this.formatUploadImg(detail, 'agentIdcardUrl', 'fileListAgentIdCard');
    this.formatUploadImg(detail, 'transportLicenseUrl', 'fileListTransportLicense');
    this.formatUploadImg(detail, 'practitionerUrl', 'fileListPractitioner');
    callback && callback()
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
  renderEnclosureDetail = () => {
    const {form} = this.props;
    const {detail, isAgent, fileListCardUrl, fileListDriveLicense, fileListDriverLicense, fileListAgentIdCard, fileListTransportLicense, fileListPractitioner} = this.state;
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
      <Fragment>
        <Row gutter={{md: 8, lg: 16, xl: 16}}>
          <Col md={8} sm={24}>
            <FormItem style={formItemStyle} label="当事人身份证/企业营业执照">
              {form.getFieldDecorator('cardUrl', {
                initialValue: detail.cardUrl,
                rules: [{required: true, message: '请上传当事人身份证/企业营业执照'}]
              })(
                <Upload {...uploadBase} defaultFileList={fileListCardUrl}
                        onChange={this.cardUrlChange}>
                  {fileListCardUrl.length ? null : <Button>
                    <Icon type="upload"/> 选择图片
                  </Button>}
                </Upload>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem style={formItemStyle} label="车辆行驶证">
              {form.getFieldDecorator('driveLicenseUrl', {
                initialValue: detail.driveLicenseUrl,
                rules: [{required: true, message: '请上传车辆行驶证'}]
              })(
                <Upload {...uploadBase} defaultFileList={fileListDriveLicense}
                        onChange={this.driveLicenseChange}>
                  {fileListDriveLicense.length ? null : <Button>
                    <Icon type="upload"/> 选择图片
                  </Button>}
                </Upload>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem style={formItemStyle} label="驾驶员驾驶证">
              {form.getFieldDecorator('driverLicenseUrl', {
                initialValue: detail.driverLicenseUrl,
                rules: [{required: true, message: '请上传驾驶员驾驶证'}]
              })(
                <Upload {...uploadBase} defaultFileList={fileListDriverLicense}
                        onChange={this.driverLicenseChange}>
                  {fileListDriverLicense.length ? null : <Button>
                    <Icon type="upload"/> 选择图片
                  </Button>}
                </Upload>,
              )}
            </FormItem>
          </Col>
        </Row>
        <Row
          gutter={{
            md: 8,
            lg: 16,
            xl: 16,
          }}
        >
          {isAgent ? <Col md={8} sm={24}>
            <FormItem style={formItemStyle} label="委托代理人身份证">
              {form.getFieldDecorator('agentIdcardUrl', {
                initialValue: detail.agentIdcardUrl,
                rules: [{required: true, message: '请上传委托代理人身份证'}]
              })(
                <Upload
                  {...uploadBase}
                  defaultFileList={fileListAgentIdCard}
                  onChange={this.agentIdCardChange}
                >
                  {fileListAgentIdCard.length ? null : <Button>
                    <Icon type="upload"/> 选择图片
                  </Button>}
                </Upload>,
              )}
            </FormItem>
          </Col> : null}
          <Col md={8} sm={24}>
            <FormItem style={formItemStyle} label="车辆道路运输证或其他">
              {form.getFieldDecorator('transportLicenseUrl', {
                initialValue: detail.transportLicenseUrl,
                rules: [{required: true, message: '请上传车辆道路运输证或其他'}]
              })(
                <Upload
                  {...uploadBase}
                  defaultFileList={fileListTransportLicense}
                  onChange={this.transportLicenseChange}
                >
                  {fileListTransportLicense.length ? null : <Button>
                    <Icon type="upload"/> 选择图片
                  </Button>}
                </Upload>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem style={formItemStyle} label="驾驶员从业资格证或其他">
              {form.getFieldDecorator('practitionerUrl', {
                initialValue: detail.practitionerUrl,
                rules: [{required: true, message: '请上传驾驶员从业资格证或其他'}]
              })(
                <Upload
                  {...uploadBase}
                  defaultFileList={fileListPractitioner}
                  onChange={this.practitionerChange}
                >
                  {fileListPractitioner.length ? null : <Button>
                    <Icon type="upload"/> 选择图片
                  </Button>}
                </Upload>,
              )}
            </FormItem>
          </Col>
        </Row>
      </Fragment>
    );
  };

  okHandle = () => {
    const {form, previewCode, dispatch, handleModalVisible, modalSuccess} = this.props;
    const {detail} = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      const field = JSON.parse(JSON.stringify(fieldsValue));
      const newData = JSON.parse(JSON.stringify(detail));

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
      field.previewCode = previewCode;

      delete field.askTime;
      delete field.discussTime;
      delete field.caseReasonCarNo;

      for (let item in field) {
        newData[item] = field[item];
      }
      this.setState({detail: newData});

      dispatch({
        type: 'DynamicLaw/lawCaseRegist',
        payload: newData,
        callback: () => {
          modalSuccess();
          setTimeout(() => handleModalVisible(), 500);
        },
      });
    });
  };

  showTemplateModal = () => {
    this.handleTemplateVisible(true);
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
          {checkAuth(authority[1]) ? <Button
            size="small"
            className={publicCss.import}
            style={{marginLeft: 8}}
            onClick={() => this.showTemplateModal()}
          >
            打印预览
          </Button> : null}
        </div>
      </div>
    );
  };

  render() {
    const {
      form,
      modalVisible,
      handleModalVisible,
      previewCode,
      loading
    } = this.props;
    const {partyRadio, isAgent, detail, templateVisible} = this.state;
    const templateMethods = {
      previewCode: previewCode,
      handleModalVisible: this.handleTemplateVisible,
    };

    return (
      <FormItem>
        <Modal
          destroyOnClose
          title={this.modalTitle()}
          visible={modalVisible}
          // onOk={this.okHandle}
          onCancel={() => handleModalVisible()}
          width={1100}
          footer={null}
        >
          <Spin spinning={loading}>
            <Divider orientation="left">当事人信息</Divider>
            <FormItem style={formItemStyle}>
              {form.getFieldDecorator('personalororgan', {
                initialValue: partyRadio,
              })(
                <RadioGroup disabled onChange={this.partyRadioChange}>
                  <Radio value={1}>个人</Radio>
                  <Radio value={2}>企业或其他组织</Radio>
                </RadioGroup>,
              )}
            </FormItem>
            {/* 当事人 */}
            {partyRadio === 1 ? this.renderParty() : this.renderPartyEnterprise()}
            <Divider orientation="left">委托代理人信息</Divider>
            <FormItem
              labelCol={{span: 2}}
              wrapperCol={{span: 10}}
              style={formItemStyle}
              label="委托代理人"
            >
              {form.getFieldDecorator('isAgent', {
                initialValue: isAgent,
              })(
                <RadioGroup onChange={this.isAgentChange}>
                  <Radio value={1}>是</Radio>
                  <Radio value={0}>否</Radio>
                </RadioGroup>,
              )}
            </FormItem>
            {isAgent ? this.renderAgent() : null}
            <Divider orientation="left">驾驶员信息</Divider>
            {this.renderDriver()}
            <Divider orientation="left">案件信息</Divider>
            {this.renderCaseInfo()}
            <Divider orientation="left">附件</Divider>
            {JSON.stringify(detail) !== '{}' ? this.renderEnclosureDetail() : null}
          </Spin>
        </Modal>
        {templateVisible ? (
          <TemplateModal {...templateMethods} modalVisible={templateVisible}/>
        ) : null}
      </FormItem>
    );
  }
}

export default RegisterUpdateModal;
