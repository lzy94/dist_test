import React, { PureComponent, Fragment } from 'react';
import {
  Form,
  Icon,
  Modal,
  Upload,
  Button,
  Row,
  Col,
  Radio,
  Input,
  Select,
  InputNumber,
  DatePicker,
  Popover,
  message,
  Spin,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import {
  getLocalStorage,
  checkPhone,
  imgUrl,
  checkAuth,
  checkIdCard,
  imageBeforeUpload,
  audioBefore,
} from '@/utils/utils';
import PersonnelModal from './modal/index';
import publicCss from '@/pages/style/public.less';
import TemplateModal from '../base/printModal';
import themeStyle from '@/pages/style/theme.less';

const { RangePicker } = DatePicker;
const { Option } = Select;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const formItemStyle = {
  marginBottom: 0,
};

const authority = [
  '/lawment/dynamic/casehand/lawCaseRegist',
  '/lawment/dynamic/casehand/getFilePrint',
];

@connect(({ File, DynamicLaw, loading }) => ({
  File,
  DynamicLaw,
  loading: loading.models.DynamicLaw,
  fileLoading: loading.models.File,
}))
@Form.create()
class RegisterUpdateModal extends PureComponent {
  static defaultProps = {
    handleModalVisible: () => {},
  };

  constructor(props) {
    super(props);
    this.persionArg1 = '';
    this.persionArg2 = '';
    this.persionArg3 = '';
    this.signas = {};
  }

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
    fileListAudio: [],
    talkRecordFileList: [],
    partyNameSignaFileList: [],
    visiblePerson: false,
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
    const { dispatch, previewCode } = this.props;
    dispatch({
      type: 'DynamicLaw/getLawCase',
      payload: { previewCode },
      callback: res => {
        if (res) {
          this.setState({
            partyRadio: parseInt(res.personalororgan, 10),
            isAgent: parseInt(res.isAgent, 10),
          });
          this.setStateImage(res, () => {
            setTimeout(() => {
              this.signas = {
                coOrganizerSigna: res.coOrganizerSigna,
                undertakerSigna: res.undertakerSigna,
              };
              this.setState({ detail: res });
            }, 100);
          });
        }
      },
    });
  };

  // 文件上传配置
  uploadBase = () => ({
    name: 'files',
    action: '/result/api/file/v1/fileUpload',
    listType: 'picture',
    accept: '.jpg,.jpeg,.png',
    data: {
      type: 5,
      xbType: '',
    },
    beforeUpload: imageBeforeUpload,
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
  });

  showPersionModal = (arg1, arg2, arg3) => {
    this.persionArg1 = arg1;
    this.persionArg2 = arg2;
    this.persionArg3 = arg3;
    this.handlePersonVisible(true);
  };

  handlePersonVisible = flag => {
    this.setState({ visiblePerson: !!flag });
  };

  selectData = ({ lawCard, fullname, lawSigna }) => {
    const { form } = this.props;
    this.signas[this.persionArg3] = lawSigna;
    form.setFieldsValue({ [this.persionArg1]: fullname, [this.persionArg2]: lawCard });
  };

  handleTemplateVisible = flag => {
    this.setState({ templateVisible: !!flag });
  };

  partyRadioChange = e => {
    const { value } = e.target;
    this.setState({ partyRadio: value });
  };

  isAgentChange = e => {
    const { value } = e.target;
    this.setState({ isAgent: value });
  };

  // 当事人  个人
  renderParty = () => {
    const { form } = this.props;
    const { detail } = this.state;
    return (
      <div className={themeStyle.inputGroup}>
        <Form labelCol={{ span: 7 }} wrapperCol={{ span: 17 }}>
          <Row gutter={8}>
            <Col md={8} sm={24}>
              <FormItem style={formItemStyle} label="类型">
                {form.getFieldDecorator('personalororgan', {
                  initialValue: 1,
                })(
                  <Select disabled style={{ width: '100%' }}>
                    <Option value={1}>个人</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem style={formItemStyle} label="姓名">
                {form.getFieldDecorator('partyName', {
                  initialValue: detail.partyName,
                })(<Input readOnly />)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem style={formItemStyle} label="性别">
                {form.getFieldDecorator('partySex', {
                  initialValue: detail.partySex,
                })(
                  <Select style={{ width: '100%' }}>
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
                  rules: [
                    {
                      validator: checkIdCard,
                    },
                  ],
                })(<Input readOnly />)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem style={formItemStyle} label="联系方式">
                {form.getFieldDecorator('partyTel', {
                  initialValue: detail.partyTel,
                })(<Input readOnly />)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem style={formItemStyle} label="住址">
                {form.getFieldDecorator('partyAddr', {
                  initialValue: detail.partyAddr,
                })(<Input readOnly />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    );
  };

  // 当事人 企业
  renderPartyEnterprise = () => {
    const { form } = this.props;
    const { detail } = this.state;
    return (
      <div className={themeStyle.inputGroup}>
        <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
          <Row gutter={8}>
            <Col md={8} sm={24}>
              <FormItem style={formItemStyle} label="类型">
                {form.getFieldDecorator('personalororgan', {
                  initialValue: 2,
                })(
                  <Select disabled style={{ width: '100%' }}>
                    <Option value={2}>企业或其他组织</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem style={formItemStyle} label="企业名称">
                {form.getFieldDecorator('partyName', {
                  initialValue: detail.partyName,
                })(<Input readOnly />)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem style={formItemStyle} label="法定代表人">
                {form.getFieldDecorator('legalMan', {
                  initialValue: detail.legalMan,
                })(<Input />)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem
                labelCol={{ span: 7 }}
                wrapperCol={{ span: 17 }}
                style={formItemStyle}
                label="统一信用代码"
              >
                {form.getFieldDecorator('creditCode', {
                  initialValue: detail.creditCode,
                })(<Input />)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem style={formItemStyle} label="企业电话">
                {form.getFieldDecorator('companyTel', {
                  initialValue: detail.companyTel,
                })(<Input />)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem style={formItemStyle} label="注册地址">
                {form.getFieldDecorator('companyAddr', {
                  initialValue: detail.companyAddr,
                })(<Input />)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem style={formItemStyle} label="法人手机">
                {form.getFieldDecorator('legalManTel', {
                  initialValue: detail.legalManTel,
                })(<Input readOnly />)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem style={formItemStyle} label="法人住址">
                {form.getFieldDecorator('legalManAddr', {
                  initialValue: detail.legalManAddr,
                })(<Input />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    );
  };

  // 委托
  renderAgent = () => {
    const { form } = this.props;
    const { detail } = this.state;
    return (
      <div className={themeStyle.inputGroup}>
        <Form labelCol={{ span: 7 }} wrapperCol={{ span: 17 }}>
          <Row gutter={8}>
            <Col md={8} sm={24}>
              <FormItem style={formItemStyle} label="代理人姓名">
                {form.getFieldDecorator('agentName', {
                  initialValue: detail.agentName,
                })(<Input />)}
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
                  rules: [
                    {
                      validator: checkIdCard,
                    },
                  ],
                })(<Input />)}
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
                })(<Input />)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem style={formItemStyle} label="住址">
                {form.getFieldDecorator('agentAddr', {
                  initialValue: detail.agentAddr,
                })(<Input />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    );
  };

  // 驾驶员
  renderDriver = () => {
    const { form } = this.props;
    const { detail } = this.state;

    return (
      <div className={themeStyle.inputGroup}>
        <Form labelCol={{ span: 7 }} wrapperCol={{ span: 17 }}>
          <Row gutter={8}>
            <Col md={8} sm={24}>
              <FormItem style={formItemStyle} label="驾驶员姓名">
                {form.getFieldDecorator('driverName', {
                  initialValue: detail.driverName,
                })(<Input />)}
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
                  rules: [
                    {
                      validator: checkIdCard,
                    },
                  ],
                })(<Input />)}
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
                })(<Input />)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem style={formItemStyle} label="住址">
                {form.getFieldDecorator('driverAddr', {
                  initialValue: detail.driverAddr,
                })(<Input />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    );
  };

  toops = () => {
    return (
      <div style={{ width: 400 }}>
        <h3>非现场执法处罚优惠规则</h3>
        <p>
          1、违法超限超载<span style={{ color: 'red' }}>5吨</span>以上-
          <span style={{ color: 'red' }}>10吨</span>
          以下的，按《超限运输车辆行驶公路管理规定》的处罚标准减轻80%实施处罚。
          <br />
          2、违法超限超载<span style={{ color: 'red' }}>10吨</span>以上-
          <span style={{ color: 'red' }}>20吨</span>
          以下的，按《超限运输车辆行驶公路管理规定》的处罚标准减轻75%实施处罚。
          <br />
          3、违法超限超载<span style={{ color: 'red' }}>20吨</span>以上-
          <span style={{ color: 'red' }}>30吨</span>
          以下的，按《超限运输车辆行驶公路管理规定》的处罚标准减轻70%实施处罚。
          <br />
          4、违法超限超载<span style={{ color: 'red' }}>30吨</span>以上-
          <span style={{ color: 'red' }}>40吨</span>
          以下的，按《超限运输车辆行驶公路管理规定》的处罚标准减轻65%实施处罚。
          <br />
          5、违法超限超载<span style={{ color: 'red' }}>40吨</span>
          以上的，按《超限运输车辆行驶公路管理规定》的处罚标准减轻60%实施处罚。
          <br />
          6、1年内同一车辆经动态自动称重设备记录多次违法行为且主动前来接受调查处理的，按《超限运输车辆行驶公路管理规定》的处罚标准，累计罚款不超过
          <span style={{ color: 'red' }}>3万元</span>。
        </p>
      </div>
    );
  };

  // 案件信息
  renderCaseInfo = () => {
    const { form } = this.props;
    const { detail } = this.state;
    return (
      <div className={themeStyle.inputGroup}>
        <Form labelCol={{ span: 7 }} wrapperCol={{ span: 17 }}>
          <Row gutter={8}>
            <Col md={8} sm={24}>
              <FormItem style={formItemStyle} label="案卷号">
                {form.getFieldDecorator('caseNo', {
                  initialValue: detail.caseNo,
                  rules: [
                    {
                      required: true,
                      message: '请输入案卷号',
                    },
                  ],
                })(<InputNumber style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem style={formItemStyle} label="货物名称">
                {form.getFieldDecorator('goodsName', {
                  initialValue: detail.goodsName,
                  rules: [{ required: true, message: '请输入货物名称' }],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem style={formItemStyle} label="承办人">
                {form.getFieldDecorator('undertaker', {
                  initialValue: detail.undertaker || '',
                  rules: [{ required: true, message: '请选择承办人 ' }],
                })(
                  <Input
                    readOnly
                    onClick={() =>
                      this.showPersionModal('undertaker', 'enforcementNo', 'undertakerSigna')
                    }
                  />,
                )}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem style={formItemStyle} label="案件来源">
                {form.getFieldDecorator('caseSource', {
                  initialValue: detail.caseSource || '非现场执法',
                })(
                  <Select>
                    <Option value="非现场执法">非现场执法</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem style={formItemStyle} label="车货总重(kg)">
                {form.getFieldDecorator('weight', {
                  initialValue: detail.weight,
                })(<InputNumber readOnly style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem style={formItemStyle} label="执法证号">
                {form.getFieldDecorator('enforcementNo', {
                  initialValue: detail.enforcementNo,
                })(<Input />)}
              </FormItem>
            </Col>
            <Col md={4} sm={24}>
              <FormItem
                labelCol={{ span: 10 }}
                wrapperCol={{ span: 14 }}
                style={formItemStyle}
                label="案由"
              >
                {form.getFieldDecorator('caseReasonCarNo', {
                  initialValue: detail.caseReason ? detail.caseReason.split(',')[0] : '',
                })(<Input readOnly />)}
              </FormItem>
            </Col>
            <Col md={4} sm={24}>
              <div className={themeStyle.radius}>
                <FormItem wrapperCol={{ span: 24 }} style={formItemStyle}>
                  {form.getFieldDecorator('caseReason', {
                    initialValue: detail.caseReason ? detail.caseReason.split(',')[1] || '' : '',
                  })(<Input />)}
                </FormItem>
              </div>
            </Col>
            <Col md={8} sm={24}>
              <FormItem style={formItemStyle} label="轴数">
                {form.getFieldDecorator('axisNum', {
                  initialValue: detail.axisNum,
                })(<InputNumber readOnly style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem style={formItemStyle} label="协办人">
                {form.getFieldDecorator('coOrganizer', {
                  initialValue: detail.coOrganizer,
                  rules: [
                    {
                      required: true,
                      message: '请输入协办人',
                    },
                  ],
                })(
                  <Input
                    readOnly
                    onClick={() =>
                      this.showPersionModal('coOrganizer', 'organizerNo', 'coOrganizerSigna')
                    }
                  />,
                )}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              {/* <div className={publicCss.inputTip}>
                <Popover content={this.toops()}>
                  <Icon type="question-circle" />
                </Popover>
              </div> */}
              <FormItem style={formItemStyle} label="处罚金额" className={publicCss.inputLabelLeft}>
                {form.getFieldDecorator('punishMoney', {
                  initialValue: detail.punishMoney,
                  rules: [{ required: true, message: '请输入处罚金额' }],
                })(<InputNumber style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem style={formItemStyle} label="超限(kg)">
                {form.getFieldDecorator('limited', {
                  initialValue: detail.limited,
                })(<InputNumber readOnly style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem style={formItemStyle} label="执法证号">
                {form.getFieldDecorator('organizerNo', {
                  initialValue: detail.organizerNo,
                })(<Input />)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem style={formItemStyle} label="讨论时间">
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
                })(<RangePicker showTime style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem style={formItemStyle} label="询问时间">
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
                })(<RangePicker showTime style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem style={formItemStyle} label="审核人">
                {form.getFieldDecorator('reviewer', {
                  initialValue: detail.reviewer,
                  rules: [
                    {
                      required: true,
                      message: '请选择审核人',
                    },
                  ],
                })(
                  <Input
                    readOnly
                    onClick={() => this.showPersionModal('reviewer', 'reviewerNo', 'reviewerSigna')}
                  />,
                )}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem style={formItemStyle} label="情况说明">
                {form.getFieldDecorator('hapDesc', {
                  initialValue: detail.hapDesc,
                })(
                  <Select style={{ width: '100%' }} placeholder="请选择">
                    <Option value="主动投案自首">主动投案自首</Option>
                    <Option value="有重大立功表现">有重大立功表现</Option>
                    <Option value="主动消除违法行为">主动消除违法行为</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem style={formItemStyle} label="车辆说明">
                {form.getFieldDecorator('carDesc', {
                  initialValue: detail.carDesc,
                })(<Input.TextArea autosize />)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem style={formItemStyle} label="负责人">
                {form.getFieldDecorator('principal', {
                  initialValue: detail.principal,
                  rules: [
                    {
                      required: true,
                      message: '请选择负责人',
                    },
                  ],
                })(
                  <Input
                    readOnly
                    onClick={() =>
                      this.showPersionModal('principal', 'principalNo', 'principalSigna')
                    }
                  />,
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
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
        : [],
    });
  };

  setStateImage = (detail, callback) => {
    this.formatUploadImg(detail, 'cardUrl', 'fileListCardUrl');
    this.formatUploadImg(detail, 'driveLicenseUrl', 'fileListDriveLicense');
    this.formatUploadImg(detail, 'driverLicenseUrl', 'fileListDriverLicense');
    this.formatUploadImg(detail, 'agentIdcardUrl', 'fileListAgentIdCard');
    this.formatUploadImg(detail, 'transportLicenseUrl', 'fileListTransportLicense');
    this.formatUploadImg(detail, 'practitionerUrl', 'fileListPractitioner');
    this.formatUploadImg(detail, 'liveRecord', 'fileListAudio');
    this.formatUploadImg(detail, 'partyNameSigna', 'partyNameSignaFileList');
    this.formatUploadImg(detail, 'talkRecord', 'talkRecordFileList');
    callback && callback();
  };

  cardUrlChange = info => {
    this.imgChangeUtil(info, fileList => {
      this.setState({ fileListCardUrl: fileList });
    });
  };

  driveLicenseChange = info => {
    this.imgChangeUtil(info, fileList => {
      this.setState({ fileListDriveLicense: fileList });
    });
  };

  driverLicenseChange = info => {
    this.imgChangeUtil(info, fileList => {
      this.setState({ fileListDriverLicense: fileList });
    });
  };

  agentIdCardChange = info => {
    this.imgChangeUtil(info, fileList => {
      this.setState({ fileListAgentIdCard: fileList });
    });
  };

  transportLicenseChange = info => {
    this.imgChangeUtil(info, fileList => {
      this.setState({ fileListTransportLicense: fileList });
    });
  };

  practitionerChange = info => {
    this.imgChangeUtil(info, fileList => {
      this.setState({ fileListPractitioner: fileList });
    });
  };

  audioChange = info => {
    this.imgChangeUtil(info, fileList => {
      this.setState({ fileListAudio: fileList });
    });
  };

  talkRecordChange = info => {
    this.imgChangeUtil(info, fileList => {
      this.setState({ talkRecordFileList: fileList });
    });
  };

  partyNameSignaChange = info => {
    this.imgChangeUtil(info, fileList => {
      this.setState({ partyNameSignaFileList: fileList });
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

  audioRemove = e => {
    e.preventDefault();
    this.setState({
      fileListAudio: [],
    });
  };

  renderAudio = audioData => {
    // const { fileListAudio } = this.state;
    if (audioData.length) {
      let src = '';
      if (audioData[0].url) {
        src = audioData[0].url;
      } else {
        src = imgUrl + audioData[0].response.filePath;
      }
      return (
        <div style={{ position: 'relative', zIndex: 10 }}>
          <a
            onClick={this.audioRemove}
            style={{
              position: 'absolute',
              top: 0,
              right: 11,
              zIndex: 100,
              fontSize: 20,
              cursor: 'pointer',
              lineHeight: '15px',
              color: 'rgba(0, 0, 0, 0.45)',
            }}
          >
            ×
          </a>
          <audio style={{ outline: 'none' }} src={src} controls="controls" />
        </div>
      );
    }
    return null;
  };

  //
  rendeautograph = () => {
    const { form } = this.props;
    const {
      detail: { partyNameSigna },
      partyNameSignaFileList,
    } = this.state;

    return (
      <Row gutter={{ md: 8, lg: 16, xl: 16 }}>
        <Col md={8} sm={24}>
          <FormItem style={formItemStyle} label="当事人签字">
            {form.getFieldDecorator('partyNameSigna', {
              initialValue: partyNameSigna,
              // rules: [{ required: true, message: '请选择当事人签字' }],
            })(
              <Upload
                {...this.uploadBase()}
                defaultFileList={partyNameSignaFileList}
                onChange={this.partyNameSignaChange}
              >
                {partyNameSignaFileList.length ? null : (
                  <Button>
                    <Icon type="upload" /> 选择图片
                  </Button>
                )}
              </Upload>,
            )}
          </FormItem>
        </Col>
      </Row>
    );
  };

  // 音频资料
  renderAudioData = () => {
    const { fileListAudio, talkRecordFileList, detail } = this.state;
    const { form } = this.props;
    return (
      <Row gutter={{ md: 8, lg: 16, xl: 16 }}>
        <Col md={8} sm={24}>
          <FormItem style={formItemStyle} label="询问记录音频资料">
            {form.getFieldDecorator('liveRecord', {
              initialValue: detail.liveRecord,
            })(
              <Upload
                {...this.uploadBase()}
                accept=".mp3"
                beforeUpload={audioBefore}
                showUploadList={false}
                onChange={this.audioChange}
              >
                {fileListAudio.length ? null : (
                  <Button style={{ marginBottom: 10 }}>
                    <Icon type="upload" /> 选择录音文件mp3
                  </Button>
                )}
              </Upload>,
            )}
          </FormItem>
          {this.renderAudio(fileListAudio)}
        </Col>
        <Col md={8} sm={24}>
          <FormItem style={formItemStyle} label="讨论记录音频资料">
            {form.getFieldDecorator('talkRecord', {
              initialValue: detail.talkRecord,
            })(
              <Upload
                {...this.uploadBase()}
                accept=".mp3"
                showUploadList={false}
                beforeUpload={audioBefore}
                onChange={this.talkRecordChange}
              >
                {talkRecordFileList.length ? null : (
                  <Button style={{ marginBottom: 10 }}>
                    <Icon type="upload" /> 选择录音文件mp3
                  </Button>
                )}
              </Upload>,
            )}
          </FormItem>
          {this.renderAudio(talkRecordFileList)}
        </Col>
      </Row>
    );
  };

  // 附件
  renderEnclosureDetail = () => {
    const { form } = this.props;
    const {
      detail,
      isAgent,
      fileListCardUrl,
      fileListDriveLicense,
      fileListDriverLicense,
      fileListAgentIdCard,
      fileListTransportLicense,
      fileListPractitioner,
    } = this.state;

    return (
      <Fragment>
        <Row gutter={{ md: 8, lg: 16, xl: 16 }}>
          <Col md={8} sm={24}>
            <FormItem style={formItemStyle} label="车辆道路运输证或其他">
              {form.getFieldDecorator('transportLicenseUrl', {
                initialValue: detail.transportLicenseUrl,
                rules: [{ required: true, message: '请上传车辆道路运输证或其他' }],
              })(
                <Upload
                  {...this.uploadBase()}
                  defaultFileList={fileListTransportLicense}
                  onChange={this.transportLicenseChange}
                >
                  {fileListTransportLicense.length ? null : (
                    <Button>
                      <Icon type="upload" /> 选择图片
                    </Button>
                  )}
                </Upload>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem style={formItemStyle} label="驾驶员从业资格证或其他">
              {form.getFieldDecorator('practitionerUrl', {
                initialValue: detail.practitionerUrl,
                rules: [{ required: true, message: '请上传驾驶员从业资格证或其他' }],
              })(
                <Upload
                  {...this.uploadBase()}
                  defaultFileList={fileListPractitioner}
                  onChange={this.practitionerChange}
                >
                  {fileListPractitioner.length ? null : (
                    <Button>
                      <Icon type="upload" /> 选择图片
                    </Button>
                  )}
                </Upload>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem style={formItemStyle} label="驾驶员驾驶证">
              {form.getFieldDecorator('driverLicenseUrl', {
                initialValue: detail.driverLicenseUrl,
                // rules: [{ required: true, message: '请上传驾驶员驾驶证' }],
              })(
                <Upload
                  {...this.uploadBase()}
                  defaultFileList={fileListDriverLicense}
                  onChange={this.driverLicenseChange}
                >
                  {fileListDriverLicense.length ? null : (
                    <Button>
                      <Icon type="upload" /> 选择图片
                    </Button>
                  )}
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
          {isAgent ? (
            <Col md={8} sm={24}>
              <FormItem style={formItemStyle} label="委托代理人身份证">
                {form.getFieldDecorator('agentIdcardUrl', {
                  initialValue: detail.agentIdcardUrl,
                  rules: [{ required: true, message: '请上传委托代理人身份证' }],
                })(
                  <Upload
                    {...this.uploadBase()}
                    defaultFileList={fileListAgentIdCard}
                    onChange={this.agentIdCardChange}
                  >
                    {fileListAgentIdCard.length ? null : (
                      <Button>
                        <Icon type="upload" /> 选择图片
                      </Button>
                    )}
                  </Upload>,
                )}
              </FormItem>
            </Col>
          ) : null}

          <Col md={8} sm={24}>
            <FormItem style={formItemStyle} label="当事人身份证/企业营业执照">
              {form.getFieldDecorator('cardUrl', {
                initialValue: detail.cardUrl,
                // rules: [{ required: true, message: '请上传当事人身份证/企业营业执照' }],
              })(
                <Upload
                  {...this.uploadBase()}
                  defaultFileList={fileListCardUrl}
                  onChange={this.cardUrlChange}
                >
                  {fileListCardUrl.length ? null : (
                    <Button>
                      <Icon type="upload" /> 选择图片
                    </Button>
                  )}
                </Upload>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem style={formItemStyle} label="车辆行驶证">
              {form.getFieldDecorator('driveLicenseUrl', {
                initialValue: detail.driveLicenseUrl,
                // rules: [{ required: true, message: '请上传车辆行驶证' }],
              })(
                <Upload
                  {...this.uploadBase()}
                  defaultFileList={fileListDriveLicense}
                  onChange={this.driveLicenseChange}
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
      </Fragment>
    );
  };

  getUrl = fieldsValue => {
    if (typeof fieldsValue === 'object') {
      const { response } = fieldsValue.file;
      return response ? response.filePath : '';
    }
    return fieldsValue;
  };

  okHandle = () => {
    const { form, previewCode, dispatch, handleModalVisible, modalSuccess } = this.props;
    const { detail } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) {
        const msg = Object.keys(err).map(item => {
          return err[item].errors[0].message;
        });
        message.error(msg.join(' , '));
        return;
      }
      form.resetFields();
      const field = { ...JSON.parse(JSON.stringify(fieldsValue)), ...this.signas };
      const newData = JSON.parse(JSON.stringify(detail));
      const askTime = fieldsValue.askTime || ['', ''];
      const discussTime = fieldsValue.discussTime || ['', ''];
      field.askBeginTime = moment(askTime[0]).format('YYYY-MM-DD HH:mm:ss');
      field.askEndTime = moment(askTime[1]).format('YYYY-MM-DD HH:mm:ss');
      field.discussBeginTime = discussTime[0]
        ? moment(discussTime[0]).format('YYYY-MM-DD HH:mm:ss')
        : '';
      field.discussEndTime = discussTime[1]
        ? moment(discussTime[1]).format('YYYY-MM-DD HH:mm:ss')
        : '';
      field.caseReason = `${fieldsValue.caseReasonCarNo},${fieldsValue.caseReason || ''}`;

      field.cardUrl = this.getUrl(fieldsValue.cardUrl);
      field.driveLicenseUrl = this.getUrl(fieldsValue.driveLicenseUrl);
      field.driverLicenseUrl = this.getUrl(fieldsValue.driverLicenseUrl);
      field.agentIdcardUrl = this.getUrl(fieldsValue.agentIdcardUrl);
      field.transportLicenseUrl = this.getUrl(fieldsValue.transportLicenseUrl);
      field.practitionerUrl = this.getUrl(fieldsValue.practitionerUrl);
      field.liveRecord = this.getUrl(fieldsValue.liveRecord);
      field.talkRecord = this.getUrl(fieldsValue.talkRecord);
      field.partyNameSigna = this.getUrl(fieldsValue.partyNameSigna);
      field.previewCode = previewCode;

      delete field.askTime;
      delete field.discussTime;
      delete field.caseReasonCarNo;

      for (let item in field) {
        newData[item] = field[item];
      }
      this.setState({ detail: newData });

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
    const {
      detail: { principalConfirm, reviewerConfirm },
    } = this.state;

    if (!principalConfirm || !reviewerConfirm) {
      message.error('案卷未确认，无法打印模板');
      return;
    }
    this.handleTemplateVisible(true);
  };

  modalTitle = () => {
    return (
      <div className={themeStyle.modalHeader}>
        <div className={themeStyle.title}>
          <span className={themeStyle.value}>案件登记</span>
        </div>
        <div>
          {checkAuth(authority[0]) ? (
            <Button type="primary" onClick={() => this.okHandle()}>
              保存案件
            </Button>
          ) : null}
          {checkAuth(authority[1]) ? (
            <Button
              className={publicCss.import}
              style={{ marginLeft: 8 }}
              onClick={() => this.showTemplateModal()}
            >
              打印预览
            </Button>
          ) : null}
        </div>
      </div>
    );
  };

  render() {
    const { form, modalVisible, handleModalVisible, previewCode, carNo, loading } = this.props;
    const { partyRadio, isAgent, detail, templateVisible, visiblePerson } = this.state;
    const templateMethods = {
      organCode: detail.organCode,
      previewCode,
      carNo,
      handleModalVisible: this.handleTemplateVisible,
    };

    return (
      <FormItem>
        <Modal
          destroyOnClose
          title={this.modalTitle()}
          visible={modalVisible}
          className={themeStyle.modalStyle}
          onCancel={() => handleModalVisible()}
          width={1150}
          footer={null}
        >
          <Spin spinning={loading}>
            <div className={themeStyle.detailMsg}>
              <div className={themeStyle.detailMsgTitle}>&nbsp;当事人信息</div>
              <div style={{ padding: '0 20px 20px' }}>
                {/* 当事人 */}
                {partyRadio === 1 ? this.renderParty() : this.renderPartyEnterprise()}
              </div>
            </div>
            <div className={themeStyle.detailMsg} style={{ marginTop: 16 }}>
              <div className={themeStyle.detailMsgTitle}>&nbsp;委托代理人信息</div>
              <div style={{ padding: '0 20px 20px' }}>
                <FormItem
                  labelCol={{ span: 2 }}
                  wrapperCol={{ span: 10 }}
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
              </div>
            </div>
            <div className={themeStyle.detailMsg} style={{ marginTop: 16 }}>
              <div className={themeStyle.detailMsgTitle}>&nbsp;驾驶员信息</div>
              <div style={{ padding: '0 20px 20px' }}>{this.renderDriver()}</div>
            </div>
            <div className={themeStyle.detailMsg} style={{ marginTop: 16 }}>
              <div className={themeStyle.detailMsgTitle}>&nbsp;案件信息</div>
              <div style={{ padding: '0 20px 20px' }}>{this.renderCaseInfo()}</div>
            </div>
            <div className={themeStyle.detailMsg} style={{ marginTop: 16 }}>
              <div className={themeStyle.detailMsgTitle}>&nbsp;签字</div>
              <div style={{ padding: '0 20px 20px' }}>
                {JSON.stringify(detail) !== '{}' ? this.rendeautograph() : null}
              </div>
            </div>
            <div className={themeStyle.detailMsg} style={{ marginTop: 16 }}>
              <div className={themeStyle.detailMsgTitle}>&nbsp;音频资料</div>
              <div style={{ padding: '0 20px 20px' }}>
                {JSON.stringify(detail) !== '{}' ? this.renderAudioData() : null}
              </div>
            </div>
            <div className={themeStyle.detailMsg} style={{ marginTop: 16 }}>
              <div className={themeStyle.detailMsgTitle}>&nbsp;附件</div>
              <div style={{ padding: '0 20px 20px' }}>
                {JSON.stringify(detail) !== '{}' ? this.renderEnclosureDetail() : null}
              </div>
            </div>
          </Spin>
        </Modal>
        {templateVisible ? (
          <TemplateModal {...templateMethods} modalVisible={templateVisible} />
        ) : null}

        {visiblePerson && (
          <PersonnelModal
            modalVisible={visiblePerson}
            handleModalVisible={this.handlePersonVisible}
            selectData={this.selectData}
          />
        )}
      </FormItem>
    );
  }
}

export default RegisterUpdateModal;
