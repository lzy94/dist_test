import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  Modal,
  message,
  Divider,
  TreeSelect,
  Radio,
  Tooltip,
  Popconfirm,
  InputNumber,
} from 'antd';
import { Redirect } from 'umi';
import StandardTable from '@/components/StandardTable';
import { checkAuth, checkLicensePlate } from '@/utils/utils';
import CompanyModal from '../../../modal/companyModal';
import SourceCompanyModal from '../../../modal/SourceCompanyModal';

import styles from '../../../style/style.less';
import publicCss from '../../../style/public.less';
import themeStyle from '@/pages/style/theme.less';

const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;

const cardType = ['身份证', '执法证', '军官证', '护照', '其他'];

const authority = [
  '/datemain/vehicle',
  '/datemain/vehicle/add',
  '/datemain/vehicle/update',
  '/datemain/vehicle/delete',
  '/transport/datemain/vehicle',
];

const CreateForm = Form.create()(props => {
  const {
    treeList,
    modalVisible,
    form,
    handleAdd,
    handleModalVisible,
    loading,
    transportCompanyChange,
    sourceCompanyChange,
    isTransportCompany,
    isSourceCompany,
    transportCompanyName,
    transportSourceName,
    showCompanyModal,
    showSourceCompanyModal,
  } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleAdd(fieldsValue, () => form.resetFields());
    });
  };
  return (
    <Modal
      destroyOnClose
      title="添加货运车辆"
      visible={modalVisible}
      className={themeStyle.formModal}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      width={800}
      footer={[
        <Button key="back" onClick={() => handleModalVisible()}>
          取消
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={okHandle}>
          确定
        </Button>,
      ]}
    >
      <div className={themeStyle.formModalBody}>
        <Row gutter={40}>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="车牌号">
              {form.getFieldDecorator('carCode', {
                rules: [
                  {
                    required: true,
                    validator: checkLicensePlate,
                  },
                ],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="车品牌型号">
              {form.getFieldDecorator('carBrand', {})(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="货车类型">
              {form.getFieldDecorator('carType', {
                rules: [{ required: true, message: '请选择货车类型！' }],
              })(
                <Select style={{ width: '100%' }} placeholder="请选择">
                  <Option value="1">小型载货汽车</Option>
                  <Option value="2">拖拉机</Option>
                  <Option value="3">畜力车</Option>
                  <Option value="4">中型载货汽车</Option>
                  <Option value="5">大型载货汽车</Option>
                  <Option value="6">特大型载货汽车</Option>
                  <Option value="7">拖挂车</Option>
                  <Option value="8">集装箱车</Option>
                  <Option value="9">小型客车</Option>
                  <Option value="10">大型客车</Option>
                  <Option value="11">摩托车</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="发动机号">
              {form.getFieldDecorator('engineCode', {})(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="车主">
              {form.getFieldDecorator('vehicleOwner', {
                rules: [{ required: true, message: '请输入车主' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="证件类型">
              {form.getFieldDecorator('legalRepresent', {
                initialValue: 1,
                rules: [{ required: true, message: '请选择证件类型' }],
              })(
                <Select style={{ width: '100%' }} placeholder="请选择">
                  {cardType.map((item, index) => (
                    <Option key={index} value={index + 1}>
                      {item}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="道路运输证号">
              {form.getFieldDecorator('transportLicence', {
                rules: [{ required: true, message: '请输入道路运输证号' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="证件号码">
              {form.getFieldDecorator('idCardNo', {
                rules: [{ required: true, message: '请输入证件号码' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="车辆状态">
              {form.getFieldDecorator('carrierNo', {
                initialValue: '1',
                rules: [{ required: true, message: '请选择车辆状态' }],
              })(
                <RadioGroup style={{ width: '100%' }}>
                  <Radio value="1">运营</Radio>
                  <Radio value="0">停运</Radio>
                </RadioGroup>,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="机构">
              {form.getFieldDecorator('organCode', {
                rules: [{ required: true, message: '请选择机构' }],
              })(
                <TreeSelect
                  className={publicCss.inputGroupLeftRadius}
                  treeData={treeList}
                  style={{ width: '100%' }}
                  placeholder="请选择"
                />,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="总重量(kg)">
              {form.getFieldDecorator('weight', {})(
                <InputNumber style={{ width: '100%' }} placeholder="请输入" />,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="核定载重量(kg)">
              {form.getFieldDecorator('limitedWeight', {
                rules: [{ required: true, message: '请输入核定载重量' }],
              })(<InputNumber style={{ width: '100%' }} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="车货长宽高(m)">
              {form.getFieldDecorator('limited', {})(<Input placeholder="车货长宽高用,隔开" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="轴数">
              {form.getFieldDecorator('axisNum', {
                rules: [{ required: true, message: '请输入轴数' }],
              })(
                <Select style={{ width: '100%' }} placeholder="请选择">
                  <Option value="2">2</Option>
                  <Option value="3">3</Option>
                  <Option value="4">4</Option>
                  <Option value="5">5</Option>
                  <Option value="6">6</Option>
                  <Option value="other">其它</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="经营范围">
              {form.getFieldDecorator('manageRang', {})(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="有效截止日期">
              {form.getFieldDecorator('effectiveDate', {})(
                <DatePicker placeholder="请选择" style={{ width: '100%' }} />,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="技术等级">
              {form.getFieldDecorator('technicalGrade', {})(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>

          <Col md={12} sm={24}>
            <FormItem label="下次技术评定日期">
              {form.getFieldDecorator('nextCheckTechnical', {})(
                <DatePicker placeholder="请选择" style={{ width: '100%' }} />,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="下次年审日期">
              {form.getFieldDecorator('nextAnnualReview', {})(
                <DatePicker placeholder="请选择" style={{ width: '100%' }} />,
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={40}>
          <Col md={12} sm={24}>
            <FormItem label="是否所属货运企业">
              {form.getFieldDecorator('isTransportCompany', {
                initialValue: '0',
              })(
                <RadioGroup onChange={transportCompanyChange}>
                  <Radio value="1">是</Radio>
                  <Radio value="0">否</Radio>
                </RadioGroup>,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            {isTransportCompany ? (
              <FormItem label="货运企业">
                {form.getFieldDecorator('transportCompanyName', {
                  initialValue: transportCompanyName,
                })(<Input onClick={() => showCompanyModal()} readOnly placeholder="请选择" />)}
              </FormItem>
            ) : null}
          </Col>
        </Row>
        <Row gutter={40}>
          <Col md={12} sm={24}>
            <FormItem label="是否所属源头企业">
              {form.getFieldDecorator('isSourceCompany', {
                initialValue: '0',
              })(
                <RadioGroup onChange={sourceCompanyChange}>
                  <Radio value="1">是</Radio>
                  <Radio value="0">否</Radio>
                </RadioGroup>,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            {isSourceCompany ? (
              <FormItem label="源头企业">
                {form.getFieldDecorator('transportSourceName', {
                  initialValue: transportSourceName,
                })(
                  <Input onClick={() => showSourceCompanyModal()} readOnly placeholder="请选择" />,
                )}
              </FormItem>
            ) : null}
          </Col>
        </Row>
      </div>
    </Modal>
  );
});

const UpdateForm = Form.create()(props => {
  const {
    treeList,
    modalVisible,
    form,
    handleUpdate,
    handleUpdateModalVisible,
    loading,
    detail,
    transportCompanyChange,
    sourceCompanyChange,
    isTransportCompany,
    isSourceCompany,
    transportCompanyName,
    transportSourceName,
    showCompanyModal,
    showSourceCompanyModal,
  } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleUpdate(fieldsValue);
    });
  };

  const check = checkAuth(authority[2]);
  const footer = check
    ? {
        footer: [
          <Button key="back" onClick={() => handleUpdateModalVisible()}>
            取消
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={okHandle}>
            确定
          </Button>,
        ],
      }
    : { footer: null };

  const style = check
    ? {}
    : {
        color: 'rgba(0,0,0,.7)',
        border: 0,
      };

  return (
    <Modal
      destroyOnClose
      title={check ? '编辑货运车辆' : '货运车辆详情'}
      visible={modalVisible}
      className={themeStyle.formModal}
      onOk={okHandle}
      onCancel={() => handleUpdateModalVisible()}
      width={800}
      {...footer}
    >
      <div className={themeStyle.formModalBody}>
        <Row gutter={40}>
          <Col md={12} sm={24}>
            <FormItem hasFeedback={check} label="车牌号">
              {form.getFieldDecorator('carCode', {
                initialValue: detail.carCode,
                rules: [{ required: true, message: '请输入车牌号' }],
              })(<Input disabled={!check} style={style} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="车品牌型号">
              {form.getFieldDecorator('carBrand', {
                initialValue: detail.carBrand,
              })(<Input disabled={!check} style={style} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback={check} label="货车类型">
              {form.getFieldDecorator('carType', {
                initialValue: detail.carType,
                rules: [{ required: true, message: '请选择货车类型！' }],
              })(
                <Select disabled={!check} style={{ width: '100%', ...style }} placeholder="请选择">
                  <Option value="1">小型载货汽车</Option>
                  <Option value="2">拖拉机</Option>
                  <Option value="3">畜力车</Option>
                  <Option value="4">中型载货汽车</Option>
                  <Option value="5">大型载货汽车</Option>
                  <Option value="6">特大型载货汽车</Option>
                  <Option value="7">拖挂车</Option>
                  <Option value="8">集装箱车</Option>
                  <Option value="9">小型客车</Option>
                  <Option value="10">大型客车</Option>
                  <Option value="11">摩托车</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="发动机号">
              {form.getFieldDecorator('engineCode', {
                initialValue: detail.engineCode,
              })(<Input disabled={!check} style={style} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback={check} label="车主">
              {form.getFieldDecorator('vehicleOwner', {
                initialValue: detail.vehicleOwner,
                rules: [{ required: true, message: '请输入车主' }],
              })(<Input disabled={!check} style={style} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            {check ? (
              <FormItem hasFeedback={check} label="证件类型">
                {form.getFieldDecorator('legalRepresent', {
                  initialValue: parseInt(detail.legalRepresent),
                  rules: [{ required: true, message: '请选择证件类型' }],
                })(
                  <Select style={{ width: '100%' }} placeholder="请选择">
                    {cardType.map((item, index) => (
                      <Option key={index} value={index + 1}>
                        {item}
                      </Option>
                    ))}
                  </Select>,
                )}
              </FormItem>
            ) : (
              <FormItem hasFeedback={check} label="证件类型">
                {form.getFieldDecorator('legalRepresent', {
                  initialValue: cardType[parseInt(detail.legalRepresent) - 1],
                  rules: [{ required: true, message: '请选择证件类型' }],
                })(<Input disabled={!check} style={style} />)}
              </FormItem>
            )}
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback={check} label="道路运输证号">
              {form.getFieldDecorator('transportLicence', {
                initialValue: detail.transportLicence,
                rules: [{ required: true, message: '请输入道路运输证号' }],
              })(<Input disabled={!check} style={style} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback={check} label="证件号码">
              {form.getFieldDecorator('idCardNo', {
                initialValue: detail.idCardNo,
                rules: [{ required: true, message: '请输入证件号码' }],
              })(<Input disabled={!check} style={style} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback={check} label="车辆状态">
              {form.getFieldDecorator('carrierNo', {
                initialValue: detail.carrierNo,
                rules: [{ required: true, message: '请选择车辆状态' }],
              })(
                <RadioGroup disabled={!check} style={{ width: '100%', ...style }}>
                  <Radio value="1">运营</Radio>
                  <Radio value="0">停运</Radio>
                </RadioGroup>,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="机构">
              {form.getFieldDecorator('organCode', {
                initialValue: detail.organCode,
                rules: [{ required: true, message: '请选择机构' }],
              })(
                <TreeSelect
                  className={publicCss.inputGroupLeftRadius}
                  treeData={treeList}
                  disabled={!check}
                  style={{ width: '100%', ...style }}
                  placeholder="请选择"
                />,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="总重量(kg)">
              {form.getFieldDecorator('weight', {
                initialValue: detail.weight,
              })(
                <InputNumber
                  disabled={!check}
                  style={{ width: '100%', ...style }}
                  placeholder="请输入"
                />,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback={check} label="核定载重量(kg)">
              {form.getFieldDecorator('limitedWeight', {
                initialValue: detail.limitedWeight,
                rules: [{ required: true, message: '请输入核定载重量' }],
              })(
                <InputNumber
                  disabled={!check}
                  style={{ width: '100%', ...style }}
                  placeholder="请输入"
                />,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="车货长宽高(m)">
              {form.getFieldDecorator('limited', {
                initialValue: detail.limited,
              })(<Input disabled={!check} style={style} placeholder="车货长宽高用,隔开" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback={check} label="轴数">
              {form.getFieldDecorator('axisNum', {
                initialValue: detail.axisNum,
                rules: [{ required: true, message: '请输入轴数' }],
              })(
                <Select disabled={!check} style={{ width: '100%', ...style }} placeholder="请选择">
                  <Option value="2">2</Option>
                  <Option value="3">3</Option>
                  <Option value="4">4</Option>
                  <Option value="5">5</Option>
                  <Option value="6">6</Option>
                  <Option value="other">其它</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="经营范围">
              {form.getFieldDecorator('manageRang', {
                initialValue: detail.manageRang,
              })(<Input disabled={!check} style={style} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            {check ? (
              <FormItem label="有效截止日期">
                {form.getFieldDecorator('effectiveDate', {
                  initialValue: moment(detail.effectiveDate, 'YYYY-MM-DD'),
                })(<DatePicker placeholder="请选择" style={{ width: '100%' }} />)}
              </FormItem>
            ) : (
              <FormItem label="有效截止日期">
                {form.getFieldDecorator('effectiveDate', {
                  initialValue: moment(detail.effectiveDate).format('YYYY-MM-DD'),
                })(<Input disabled={!check} style={style} />)}
              </FormItem>
            )}
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="技术等级">
              {form.getFieldDecorator('technicalGrade', {
                initialValue: detail.technicalGrade,
              })(<Input disabled={!check} style={style} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            {check ? (
              <FormItem label="下次技术评定日期">
                {form.getFieldDecorator('nextCheckTechnical', {
                  initialValue: moment(detail.nextCheckTechnical, 'YYYY-MM-DD'),
                })(<DatePicker placeholder="请选择" style={{ width: '100%' }} />)}
              </FormItem>
            ) : (
              <FormItem label="下次技术评定日期">
                {form.getFieldDecorator('nextCheckTechnical', {
                  initialValue: moment(detail.nextCheckTechnical).format('YYYY-MM-DD'),
                })(<Input disabled={!check} style={style} />)}
              </FormItem>
            )}
          </Col>
          <Col md={12} sm={24}>
            {check ? (
              <FormItem label="下次年审日期">
                {form.getFieldDecorator('nextAnnualReview', {
                  initialValue: moment(detail.nextAnnualReview, 'YYYY-MM-DD'),
                })(<DatePicker placeholder="请选择" style={{ width: '100%' }} />)}
              </FormItem>
            ) : (
              <FormItem label="下次年审日期">
                {form.getFieldDecorator('nextAnnualReview', {
                  initialValue: moment(detail.nextAnnualReview).format('YYYY-MM-DD'),
                })(<Input disabled={!check} style={style} />)}
              </FormItem>
            )}
          </Col>
        </Row>
        <Row gutter={40}>
          <Col md={12} sm={24}>
            <FormItem label="是否所属货运企业">
              {form.getFieldDecorator('isTransportCompany', {
                initialValue: detail.isTransportCompany,
              })(
                <RadioGroup disabled={!check} style={style} onChange={transportCompanyChange}>
                  <Radio value="1">是</Radio>
                  <Radio value="0">否</Radio>
                </RadioGroup>,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            {isTransportCompany ? (
              <FormItem label="货运企业">
                {form.getFieldDecorator('transportCompanyName', {
                  initialValue: transportCompanyName
                    ? transportCompanyName
                    : detail.transportCompanyName,
                })(
                  <Input
                    disabled={!check}
                    style={style}
                    onClick={() => showCompanyModal()}
                    readOnly
                    placeholder="请选择"
                  />,
                )}
              </FormItem>
            ) : null}
          </Col>
        </Row>
        <Row gutter={40}>
          <Col md={12} sm={24}>
            <FormItem label="是否所属源头企业">
              {form.getFieldDecorator('isSourceCompany', {
                initialValue: detail.isSourceCompany,
              })(
                <RadioGroup disabled={!check} style={style} onChange={sourceCompanyChange}>
                  <Radio value="1">是</Radio>
                  <Radio value="0">否</Radio>
                </RadioGroup>,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            {isSourceCompany ? (
              <FormItem label="源头企业">
                {form.getFieldDecorator('transportSourceName', {
                  initialValue: transportSourceName
                    ? transportSourceName
                    : detail.transportSourceName,
                })(
                  <Input
                    disabled={!check}
                    style={style}
                    onClick={() => showSourceCompanyModal()}
                    readOnly
                    placeholder="请选择"
                  />,
                )}
              </FormItem>
            ) : null}
          </Col>
        </Row>
      </div>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ system, Vehicle, loading }) => ({
  treeList: system.treeList,
  Vehicle,
  loading: loading.models.Vehicle,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    companyModalVisible: false,
    sourceCompanyModalVisible: false,
    formValues: [],
    detail: {},
    isTransportCompany: 0,
    isSourceCompany: 0,
    transportCompanyName: '',
    transportSourceName: '',
    pageBean: {
      page: 1,
      pageSize: 10,
      showTotal: true,
    },
  };

  columns = [
    {
      title: '车牌号码',
      dataIndex: 'carCode',
    },
    {
      title: '车主',
      dataIndex: 'vehicleOwner',
    },
    {
      title: '经营范围',
      dataIndex: 'manageRang',
    },
    {
      title: '核定载重量',
      dataIndex: 'limitedWeight',
    },
    {
      title: '道路运输证号',
      dataIndex: 'transportLicence',
    },
    {
      title: '车货长宽高',
      dataIndex: 'limited',
    },
    {
      title: '轴数',
      dataIndex: 'axisNum',
      render: val => (val === 'other' ? '其它' : val),
    },
    {
      title: '操作',
      width: checkAuth(authority[3]) ? 100 : 70,
      render: (text, record) => (
        <Fragment>
          {checkAuth(authority[2]) ? (
            <Tooltip placement="left" title="编辑">
              <Button
                onClick={() => this.showModal(record.id)}
                type="primary"
                shape="circle"
                icon="edit"
                size="small"
              />
            </Tooltip>
          ) : (
            <Tooltip placement="left" title="详情">
              <Button
                onClick={() => this.showModal(record.id)}
                type="primary"
                shape="circle"
                icon="eye"
                size="small"
              />
            </Tooltip>
          )}
          {checkAuth(authority[3]) ? (
            <Fragment>
              <Divider type="vertical" />
              <Popconfirm
                title="是否删除数据?"
                onConfirm={() => this.dataDel(record.id)}
                okText="确定"
                cancelText="取消"
              >
                <Tooltip placement="left" title="删除">
                  <Button type="danger" shape="circle" icon="delete" size="small" />
                </Tooltip>
              </Popconfirm>
            </Fragment>
          ) : null}
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    if (!checkAuth(authority[0])) return;
    const { pageBean } = this.state;
    this.getList({ pageBean });
  }

  showCompanyModal = () => {
    this.handleCompanyModalVisible(true);
  };

  showSourceCompanyModal = () => {
    this.handleSourceCompanyModalVisible(true);
  };

  showModal = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Vehicle/detail',
      payload: id,
      callback: res => {
        this.setState({
          detail: res,
          isTransportCompany: parseInt(res.isTransportCompany),
          isSourceCompany: parseInt(res.isSourceCompany),
        });
        this.handleUpdateModalVisible(true);
      },
    });
  };

  dataDel = id => {
    const { pageBean } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'Vehicle/remove',
      payload: { id },
      callback: () => {
        message.success('删除成功');
        this.getList({ pageBean });
      },
    });
  };

  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Vehicle/fetch',
      payload: params,
    });
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { formValues } = this.state;

    const params = {
      pageBean: {
        page: pagination.current,
        pageSize: pagination.pageSize,
        showTotal: true,
      },
      querys: formValues,
    };
    this.getList(params);
  };

  handleFormReset = () => {
    const { form } = this.props;
    const { pageBean } = this.state;
    form.resetFields();
    this.setState({
      formValues: [],
    });

    this.getList({ pageBean });
  };

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { pageBean } = this.state;
      const values = {
        ...fieldsValue,
      };
      const objKeys = Object.keys(values);
      // 重新格式化条件数组
      const condition = objKeys.map(item => {
        return values[item]
          ? {
              property: item,
              value: values[item],
              group: 'main',
              operation: item === 'organCode' ? 'RIGHT_LIKE' : 'LIKE',
              relation: 'AND',
            }
          : '';
      });
      let conditionFilter = condition.filter(item => item);
      this.setState({
        formValues: conditionFilter,
      });
      dispatch({
        type: 'Vehicle/fetch',
        payload: { pageBean, querys: conditionFilter },
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
    if (!!!flag) {
      this.setState({
        isTransportCompany: 0,
        isSourceCompany: 0,
        transportCompanyName: '',
        transportSourceName: '',
      });
    }
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
    });
    if (!!!flag) {
      this.setState({
        isTransportCompany: 0,
        isSourceCompany: 0,
        transportCompanyName: '',
        transportSourceName: '',
      });
    }
  };

  handleCompanyModalVisible = flag => {
    this.setState({ companyModalVisible: !!flag });
  };

  handleSourceCompanyModalVisible = flag => {
    this.setState({ sourceCompanyModalVisible: !!flag });
  };
  selectCompanyTableRow = res => {
    this.setState({ transportCompanyName: res.companyName });
    this.handleCompanyModalVisible();
  };

  selectSourceCompanyTableRow = res => {
    this.setState({ transportSourceName: res.companyName });
    this.handleSourceCompanyModalVisible();
  };

  handleAdd = (fields, callback) => {
    const { dispatch } = this.props;
    const { pageBean } = this.state;
    dispatch({
      type: 'Vehicle/add',
      payload: fields,
      callback: () => {
        message.success('添加成功');
        this.handleModalVisible();
        this.getList({ pageBean });
        callback && callback();
      },
    });
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    const { pageBean, detail, isTransportCompany, isSourceCompany } = this.state;
    const keys = Object.keys(fields);
    const newData = JSON.parse(JSON.stringify(detail));

    for (let i = 0; i < keys.length; i++) {
      newData[keys[i]] = fields[keys[i]];
    }
    newData.transportCompanyName = isTransportCompany ? newData.transportCompanyName : '';
    newData.transportSourceName = isTransportCompany ? newData.transportSourceName : '';
    this.setState({ detail: newData });

    dispatch({
      type: 'Vehicle/update',
      payload: newData,
      callback: () => {
        message.success('编辑成功');
        this.handleUpdateModalVisible();
        this.getList({ pageBean });
      },
    });
  };

  transportCompanyChange = e => {
    this.setState({
      isTransportCompany: parseInt(e.target.value),
    });
  };

  sourceCompanyChange = e => {
    this.setState({
      isSourceCompany: parseInt(e.target.value),
    });
  };

  renderSimpleForm() {
    const {
      treeList,
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 16, xl: 32 }}>
          <Col md={5} sm={24}>
            <div className={publicCss.inputMain}>
              <span
                style={{ width: '80px', lineHeight: '30px', height: '32px' }}
                className="ant-input-group-addon"
              >
                所属机构
              </span>
              <FormItem style={{ flex: 1 }}>
                {getFieldDecorator('organCode')(
                  <TreeSelect
                    className={publicCss.inputGroupLeftRadius}
                    treeData={treeList}
                    style={{ width: '100%' }}
                    placeholder="请选择"
                  />,
                )}
              </FormItem>
            </div>
          </Col>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('carCode')(<Input addonBefore="车牌号" placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('vehicleOwner')(<Input addonBefore="车主" placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('transportLicence')(
                <Input addonBefore="道路运输证号" placeholder="请输入" />,
              )}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <div className={publicCss.inputMain}>
              <span
                style={{ width: '50px', lineHeight: '30px', height: '32px' }}
                className="ant-input-group-addon"
              >
                轴数
              </span>
              <FormItem style={{ flex: 1 }}>
                {getFieldDecorator('axisNum')(
                  <Select
                    className={publicCss.inputGroupLeftRadius}
                    placeholder="请选择"
                    style={{ width: '100%' }}
                  >
                    <Option value="">全部轴数</Option>
                    <Option value="2">2</Option>
                    <Option value="3">3 </Option>
                    <Option value="4">4</Option>
                    <Option value="5">5</Option>
                    <Option value="6">6</Option>
                    <Option value="other">其它</Option>
                  </Select>,
                )}
              </FormItem>
            </div>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ float: 'right', marginBottom: 5 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
          </div>
        </div>
      </Form>
    );
  }

  render() {
    const {
      treeList,
      Vehicle: { data },
      loading,
    } = this.props;
    const {
      modalVisible,
      updateModalVisible,
      detail,
      isTransportCompany,
      isSourceCompany,
      companyModalVisible,
      sourceCompanyModalVisible,
      transportCompanyName,
      transportSourceName,
    } = this.state;

    const parentMethods = {
      treeList,
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      loading,
      transportCompanyChange: this.transportCompanyChange,
      sourceCompanyChange: this.sourceCompanyChange,
      isTransportCompany,
      isSourceCompany,
      transportCompanyName,
      transportSourceName,
      showCompanyModal: this.showCompanyModal,
      showSourceCompanyModal: this.showSourceCompanyModal,
    };
    const updateMethods = {
      treeList,
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
      loading,
      detail,
      transportCompanyChange: this.transportCompanyChange,
      sourceCompanyChange: this.sourceCompanyChange,
      isTransportCompany,
      isSourceCompany,
      transportCompanyName,
      transportSourceName,
      showCompanyModal: this.showCompanyModal,
      showSourceCompanyModal: this.showSourceCompanyModal,
    };
    return (
      <Fragment>
        {checkAuth(authority[0]) || checkAuth(authority[4]) ? null : (
          <Redirect to="/exception/403" />
        )}
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <div className={styles.tableListOperator}>
              {checkAuth(authority[1]) ? (
                <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                  新建
                </Button>
              ) : null}
            </div>
            <StandardTable
              size="middle"
              selectedRows={0}
              rowSelection={null}
              loading={loading}
              data={data}
              tableAlert={false}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
        {updateModalVisible && JSON.stringify(detail) !== '{}' ? (
          <UpdateForm {...updateMethods} modalVisible={updateModalVisible} />
        ) : null}

        {companyModalVisible ? (
          <CompanyModal
            handleCompanyModalVisible={this.handleCompanyModalVisible}
            selectTableRow={this.selectCompanyTableRow}
            modalVisible={companyModalVisible}
          />
        ) : null}
        {sourceCompanyModalVisible ? (
          <SourceCompanyModal
            handleCompanyModalVisible={this.handleSourceCompanyModalVisible}
            selectTableRow={this.selectSourceCompanyTableRow}
            modalVisible={sourceCompanyModalVisible}
          />
        ) : null}
      </Fragment>
    );
  }
}

export default TableList;
