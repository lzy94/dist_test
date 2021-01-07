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
  Modal,
  message,
  TreeSelect,
  Divider,
  DatePicker,
  Radio,
  Tooltip,
  Popconfirm,
  AutoComplete,
} from 'antd';
import { Redirect } from 'umi';
import StandardTable from '@/components/StandardTable';
import { checkAuth, checkPhone, emailSuffix } from '@/utils/utils';
import CompanyModal from '../../../modal/companyModal';

import SourceCompanyModal from '../../../modal/SourceCompanyModal';
import styles from '../../../style/style.less';
import publicCss from '../../../style/public.less';
import themeStyle from '@/pages/style/theme.less';

const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;

const authority = [
  '/datemain/freight',
  '/datemain/freight/add',
  '/datemain/freight/update',
  '/datemain/freight/delete',
  '/transport/datemain/freight',
];

const CreateForm = Form.create()(props => {
  const {
    modalVisible,
    form,
    handleAdd,
    handleModalVisible,
    loading,
    isTransportCompany,
    isSourceCompany,
    transportCompanyChange,
    sourceCompanyChange,
    transportCompanyName,
    transportSourceName,
    showCompanyModal,
    showSourceCompanyModal,
    treeList,
    emailSuffixValue,
    emailInputChange,
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
      title="添加货运从业人员"
      className={themeStyle.formModal}
      visible={modalVisible}
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
            <FormItem hasFeedback label="驾驶证号">
              {form.getFieldDecorator('driverCode', {
                rules: [{ required: true, message: '请输入驾驶证号！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="驾驶人姓名">
              {form.getFieldDecorator('driverName', {
                rules: [{ required: true, message: '请输入驾驶人姓名！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="从业资格证号">
              {form.getFieldDecorator('licenceCode', {
                rules: [{ required: true, message: '请输入从业资格证号！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="性别">
              {form.getFieldDecorator('sex', {
                rules: [{ required: true, message: '请选择性别！' }],
              })(
                <RadioGroup style={{ width: '100%' }}>
                  <Radio value="1">男</Radio>
                  <Radio value="2">女</Radio>
                </RadioGroup>,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="从业资格类别">
              {form.getFieldDecorator('occupationType', {
                rules: [{ required: true, message: '请选择从业资格类别！' }],
              })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="1">经营性道路旅客运输驾驶员 </Option>
                  <Option value="2">经营性道路货物运输驾驶员 </Option>
                  <Option value="3">道路危险货物运输驾驶员 </Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="超限超载情况">
              {form.getFieldDecorator('overloadCondition', {})(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="发证机关">
              {form.getFieldDecorator('licenceOrang', {
                rules: [{ required: true, message: '请输入发证机关！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="有效日期">
              {form.getFieldDecorator('effectiveDate', {})(
                <DatePicker style={{ width: '100%' }} />,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="联系电话">
              {form.getFieldDecorator('phone', {
                rules: [{ required: true, validator: checkPhone }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="邮箱">
              {form.getFieldDecorator('email', {
                rules: [
                  {
                    type: 'email',
                    message: '请输入正确的邮箱',
                  },
                  { message: '请输入正确的邮箱！' },
                ],
              })(
                <AutoComplete
                  dataSource={emailSuffixValue}
                  style={{ width: '100%' }}
                  onChange={emailInputChange}
                  placeholder="请输入"
                />,
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
            <FormItem label="住址">
              {form.getFieldDecorator('address', {})(<Input.TextArea placeholder="请输入" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={40}>
          <Col md={12} sm={24}>
            <FormItem label="是否所属货运企业">
              {form.getFieldDecorator('isTransportCompany', {})(
                <RadioGroup onChange={transportCompanyChange}>
                  <Radio value="1">是</Radio>
                  <Radio value="0">否</Radio>
                </RadioGroup>,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            {isTransportCompany == '1' ? (
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
              {form.getFieldDecorator('isSourceCompany', {})(
                <RadioGroup onChange={sourceCompanyChange}>
                  <Radio value="1">是</Radio>
                  <Radio value="0">否</Radio>
                </RadioGroup>,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            {isSourceCompany == '1' ? (
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
    isTransportCompany,
    isSourceCompany,
    transportCompanyChange,
    sourceCompanyChange,
    transportCompanyName,
    transportSourceName,
    showCompanyModal,
    showSourceCompanyModal,
    emailSuffixValue,
    emailInputChange,
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
      title={check ? '编辑货运从业人员' : '货运从业人员详情'}
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
            <FormItem hasFeedback={check} label="驾驶证号">
              {form.getFieldDecorator('driverCode', {
                initialValue: detail.driverCode,
                rules: [{ required: true, message: '请输入驾驶证号！' }],
              })(<Input disabled={!check} style={style} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback={check} label="驾驶人姓名">
              {form.getFieldDecorator('driverName', {
                initialValue: detail.driverName,
                rules: [{ required: true, message: '请输入驾驶人姓名！' }],
              })(<Input disabled={!check} style={style} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback={check} label="从业资格证号">
              {form.getFieldDecorator('licenceCode', {
                initialValue: detail.licenceCode,
                rules: [{ required: true, message: '请输入从业资格证号！' }],
              })(<Input disabled={!check} style={style} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback={check} label="性别">
              {form.getFieldDecorator('sex', {
                initialValue: detail.sex,
                rules: [{ required: true, message: '请选择性别！' }],
              })(
                <RadioGroup disabled={!check} style={{ width: '100%', ...style }}>
                  <Radio value="1">男</Radio>
                  <Radio value="2">女</Radio>
                </RadioGroup>,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback={check} label="从业资格类别">
              {form.getFieldDecorator('occupationType', {
                initialValue: detail.occupationType,
                rules: [{ required: true, message: '请选择从业资格类别！' }],
              })(
                <Select placeholder="请选择" disabled={!check} style={{ width: '100%', ...style }}>
                  <Option value="1">经营性道路旅客运输驾驶员 </Option>
                  <Option value="2">经营性道路货物运输驾驶员 </Option>
                  <Option value="3">道路危险货物运输驾驶员 </Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="超限超载情况">
              {form.getFieldDecorator('overloadCondition', {
                initialValue: detail.overloadCondition,
              })(<Input disabled={!check} style={style} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback={check} label="发证机关">
              {form.getFieldDecorator('licenceOrang', {
                initialValue: detail.licenceOrang,
                rules: [{ required: true, message: '请输入发证机关！' }],
              })(<Input disabled={!check} style={style} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="有效日期">
              {form.getFieldDecorator('effectiveDate', {
                initialValue: moment(detail.effectiveDate, 'YYYY-MM-DD'),
              })(<DatePicker disabled={!check} style={{ width: '100%', ...style }} />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback={check} label="联系电话">
              {form.getFieldDecorator('phone', {
                initialValue: detail.phone,
                rules: [{ required: true, validator: checkPhone }],
              })(<Input disabled={!check} style={style} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="邮箱">
              {form.getFieldDecorator('email', {
                initialValue: detail.email,
                rules: [
                  {
                    type: 'email',
                    message: '请输入正确的邮箱',
                  },
                  { message: '请输入正确的邮箱！' },
                ],
              })(
                <AutoComplete
                  dataSource={emailSuffixValue}
                  style={{ width: '100%' }}
                  onChange={emailInputChange}
                  placeholder="请输入"
                />,
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
            <FormItem label="住址">
              {form.getFieldDecorator('address', {
                initialValue: detail.address,
              })(<Input.TextArea disabled={!check} style={style} placeholder="请输入" />)}
            </FormItem>
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
            {isTransportCompany == '1' ? (
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
            {isSourceCompany == '1' ? (
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
@connect(({ system, Freight, loading }) => ({
  treeList: system.treeList,
  Freight,
  loading: loading.models.Freight,
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
    emailSuffixValue: [],
    isTransportCompany: '0',
    isSourceCompany: '0',
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
      title: '驾驶证号',
      dataIndex: 'driverCode',
    },
    {
      title: '驾驶证员姓名',
      dataIndex: 'driverName',
    },
    {
      title: '性别',
      dataIndex: 'sex',
      render: val => {
        let sex = '';
        switch (val) {
          case '1':
            sex = '男';
            break;
          case '2':
            sex = '女';
            break;
          default:
            sex = '其他';
        }
        return sex;
      },
    },
    {
      title: '从业资格证号',
      dataIndex: 'licenceCode',
    },
    {
      title: '从业资格类别',
      dataIndex: 'occupationType',
    },
    {
      title: '发证机关',
      dataIndex: 'licenceOrang',
    },
    {
      title: '有效日期',
      dataIndex: 'effectiveDate',
      render: val => moment(val).format('YYYY-MM-DD'),
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

  dataDel = id => {
    const { pageBean } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'Freight/remove',
      payload: { id },
      callback: () => {
        message.success('删除成功');
        this.getList({ pageBean });
      },
    });
  };

  showModal = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Freight/detail',
      payload: id,
      callback: res => {
        this.setState({
          detail: res,
          isTransportCompany: res.isTransportCompany,
          isSourceCompany: res.isSourceCompany,
        });
        this.handleUpdateModalVisible(true);
      },
    });
  };

  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Freight/fetch',
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
    const { form } = this.props;
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
              operation:
                item === 'organCode' ? 'RIGHT_LIKE' : item === 'occupationType' ? 'EQUAL' : 'LIKE',
              relation: 'AND',
            }
          : '';
      });
      const conditionFilter = condition.filter(item => item);
      this.setState({
        formValues: conditionFilter,
      });
      this.getList({ pageBean, querys: conditionFilter });
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
        detail: {},
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
      type: 'Freight/add',
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
    const { pageBean, detail, isSourceCompany, isTransportCompany } = this.state;
    const keys = Object.keys(fields);
    const newData = JSON.parse(JSON.stringify(detail));

    for (let i = 0; i < keys.length; i++) {
      newData[keys[i]] = fields[keys[i]];
    }
    newData.transportSourceName = isSourceCompany === '1' ? newData.transportSourceName : '';
    newData.transportCompanyName = isTransportCompany === '1' ? newData.transportCompanyName : '';
    this.setState({ detail: newData });

    dispatch({
      type: 'Freight/update',
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
      isTransportCompany: e.target.value,
    });
  };

  sourceCompanyChange = e => {
    this.setState({
      isSourceCompany: e.target.value,
    });
  };

  emailInputChange = value => {
    this.setState({
      emailSuffixValue: emailSuffix(value),
    });
  };

  renderSimpleForm() {
    const {
      treeList,
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 16, xl: 16 }}>
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
              {getFieldDecorator('driverCode')(
                <Input addonBefore="驾驶证号" placeholder="请输入" />,
              )}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem>
              {getFieldDecorator('driverName')(<Input addonBefore="姓名" placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem>
              {getFieldDecorator('licenceCode')(
                <Input addonBefore="从业资格证号" placeholder="请输入" />,
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <div className={publicCss.inputMain}>
              <span
                style={{ width: '110px', lineHeight: '30px', height: '32px' }}
                className="ant-input-group-addon"
              >
                从业资格类别
              </span>
              <FormItem style={{ flex: 1 }}>
                {getFieldDecorator('occupationType')(
                  <Select
                    className={publicCss.inputGroupLeftRadius}
                    placeholder="请选择"
                    style={{ width: '100%' }}
                  >
                    <Option value="1">经营性道路旅客运输驾驶员 </Option>
                    <Option value="2">经营性道路货物运输驾驶员 </Option>
                    <Option value="3">道路危险货物运输驾驶员 </Option>
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
      Freight: { data },
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
      emailSuffixValue,
    } = this.state;

    const baseMethods = {
      treeList,
      isTransportCompany,
      isSourceCompany,
      loading,
      transportCompanyName,
      transportSourceName,
      emailSuffixValue,
      emailInputChange: this.emailInputChange,
      showCompanyModal: this.showCompanyModal,
      showSourceCompanyModal: this.showSourceCompanyModal,
      transportCompanyChange: this.transportCompanyChange,
      sourceCompanyChange: this.sourceCompanyChange,
    };

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
      handleModalVisible: this.handleModalVisible,
      detail,
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
              tableAlert={false}
              selectedRows={0}
              rowSelection={null}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...baseMethods} {...parentMethods} modalVisible={modalVisible} />
        {updateModalVisible && JSON.stringify(detail) !== '{}' ? (
          <UpdateForm {...baseMethods} {...updateMethods} modalVisible={updateModalVisible} />
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
