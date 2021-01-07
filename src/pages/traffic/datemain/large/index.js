import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
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
  Divider,
  TreeSelect,
  Radio,
  Tooltip,
  Popconfirm,
  InputNumber,
} from 'antd';
import { Redirect } from 'umi';
import StandardTable from '@/components/StandardTable';
import CompanyModal from '../../../modal/companyModal';
import SourceCompanyModal from '../../../modal/SourceCompanyModal';

import { checkAuth, checkLicensePlate, checkPhone } from '@/utils/utils';
import styles from '../../../style/style.less';
import themeStyle from '@/pages/style/theme.less';
import publicCss from '../../../style/public.less';

const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;

const authority = [
  '/datemain/large',
  '/datemain/large/add',
  '/datemain/large/update',
  '/datemain/large/delete',
];

const cardType = ['身份证', '执法证', '军官证', '护照', '其他'];

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
      title="添加大件运输信息"
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
            <FormItem hasFeedback label="超限许可证号">
              {form.getFieldDecorator('licenceCode', {
                rules: [{ required: true, message: '请输入超限许可证号！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="车牌号">
              {form.getFieldDecorator('carCode', {
                rules: [{ required: true, validator: checkLicensePlate }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="道路运输证号">
              {form.getFieldDecorator('transportCode', {
                rules: [{ required: true, message: '请输入道路运输证号！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="承运人名称">
              {form.getFieldDecorator('carrier', {
                rules: [{ required: true, message: '请输入承运人名称！' }],
              })(<Input placeholder="请输入" />)}
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
            <FormItem label="法人代表">
              {form.getFieldDecorator('legalRepresent', {})(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="法人代表证件类型">
              {form.getFieldDecorator('idCardType', {})(
                <Select placeholder="请选择" style={{ width: '100%' }}>
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
            <FormItem label="法人代表证件号码">
              {form.getFieldDecorator('idCardNo', {})(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="联系电话">
              {form.getFieldDecorator('phone', {
                rules: [{ validator: checkLicensePlate }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="承运协议号">
              {form.getFieldDecorator('carrierNo', {})(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="货物名称">
              {form.getFieldDecorator('goodsName', {})(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="货物重量(t)">
              {form.getFieldDecorator('goodsWeight', {})(
                <InputNumber min={0} style={{ width: '100%' }} placeholder="请输入" />,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="车货长宽高(m)">
              {form.getFieldDecorator('limited', {})(<Input placeholder="长宽高按顺序用,隔开" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="出发地">
              {form.getFieldDecorator('placeDeparture', {})(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="目的地">
              {form.getFieldDecorator('destination', {})(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="运输周期">
              {form.getFieldDecorator('transportCycle', {})(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={40}>
          <Col md={12} sm={24}>
            <FormItem label="是否所属货运企业">
              {form.getFieldDecorator('isTransportCompany', {})(
                <RadioGroup onChange={transportCompanyChange}>
                  <Radio value={1}>是</Radio>
                  <Radio value={0}>否</Radio>
                </RadioGroup>,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            {isTransportCompany ? (
              <FormItem label="货运企业源头企业">
                {form.getFieldDecorator('transportCompanyName', {
                  initialValue: transportCompanyName,
                })(<Input onClick={() => showCompanyModal()} readOnly placeholder="请输入" />)}
              </FormItem>
            ) : null}
          </Col>
        </Row>
        <Row gutter={40}>
          <Col md={12} sm={24}>
            <FormItem label="是否所属源头企业">
              {form.getFieldDecorator('isSourceCompany', {})(
                <RadioGroup onChange={sourceCompanyChange}>
                  <Radio value={1}>是</Radio>
                  <Radio value={0}>否</Radio>
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
                  <Input onClick={() => showSourceCompanyModal()} readOnly placeholder="请输入" />,
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
      title={check ? '编辑大件运输信息' : '大件运输信息详情'}
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
            <FormItem hasFeedback={check} label="超限许可证号">
              {form.getFieldDecorator('licenceCode', {
                initialValue: detail.licenceCode,
                rules: [{ required: true, message: '请输入超限许可证号！' }],
              })(<Input disabled={!check} style={style} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback={check} label="车牌号">
              {form.getFieldDecorator('carCode', {
                initialValue: detail.carCode,
                rules: [{ required: true, validator: checkLicensePlate }],
              })(<Input disabled style={style} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback={check} label="道路运输证号">
              {form.getFieldDecorator('transportCode', {
                initialValue: detail.transportCode,
                rules: [{ required: true, message: '请输入道路运输证号！' }],
              })(<Input disabled={!check} style={style} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback={check} label="承运人名称">
              {form.getFieldDecorator('carrier', {
                initialValue: detail.carrier,
                rules: [{ required: true, message: '请输入承运人名称！' }],
              })(<Input disabled={!check} style={style} placeholder="请输入" />)}
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
            <FormItem label="法人代表">
              {form.getFieldDecorator('legalRepresent', {
                initialValue: detail.legalRepresent,
              })(<Input disabled={!check} style={style} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            {check ? (
              <FormItem label="法人代表证件类型">
                {form.getFieldDecorator('idCardType', {
                  initialValue: detail.idCardType,
                })(
                  <Select placeholder="请选择" style={{ width: '100%' }}>
                    {cardType.map((item, index) => (
                      <Option key={index} value={index + 1}>
                        {item}
                      </Option>
                    ))}
                  </Select>,
                )}
              </FormItem>
            ) : (
              <FormItem label="法人代表证件类型">
                {form.getFieldDecorator('idCardType', {
                  initialValue: cardType[parseInt(detail.idCardType) - 1],
                })(<Input disabled={!check} style={style} />)}
              </FormItem>
            )}
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="法人代表证件号码">
              {form.getFieldDecorator('idCardNo', {
                initialValue: detail.idCardNo,
              })(<Input disabled={!check} style={style} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="联系电话">
              {form.getFieldDecorator('phone', {
                initialValue: detail.phone,
                rules: [{ validator: checkLicensePlate }],
              })(<Input disabled={!check} style={style} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="承运协议号">
              {form.getFieldDecorator('carrierNo', {
                initialValue: detail.carrierNo,
              })(<Input disabled={!check} style={style} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="货物名称">
              {form.getFieldDecorator('goodsName', {
                initialValue: detail.goodsName,
              })(<Input disabled={!check} style={style} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="货物重量(t)">
              {form.getFieldDecorator('goodsWeight', {
                initialValue: detail.goodsWeight,
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
              })(<Input disabled={!check} style={style} placeholder="长宽高按顺序用,隔开" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="出发地">
              {form.getFieldDecorator('placeDeparture', {
                initialValue: detail.placeDeparture,
              })(<Input disabled={!check} style={style} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="目的地">
              {form.getFieldDecorator('destination', {
                initialValue: detail.destination,
              })(<Input disabled={!check} style={style} placeholder="请输入" />)}
            </FormItem>
          </Col>

          <Col md={12} sm={24}>
            <FormItem label="运输周期">
              {form.getFieldDecorator('transportCycle', {
                initialValue: detail.transportCycle,
              })(<Input disabled={!check} style={style} placeholder="请输入" />)}
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
                  <Radio value={1}>是</Radio>
                  <Radio value={0}>否</Radio>
                </RadioGroup>,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            {isTransportCompany ? (
              <FormItem label="货运企业源头企业">
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
                    placeholder="请输入"
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
                  <Radio value={1}>是</Radio>
                  <Radio value={0}>否</Radio>
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
                    placeholder="请输入"
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
@connect(({ system, Large, loading }) => ({
  treeList: system.treeList,
  Large,
  loading: loading.models.Large,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    companyModalVisible: false,
    sourceCompanyModalVisible: false,
    selectedRows: [],
    formValues: [],
    detail: {},
    isTransportCompany: 0,
    isSourceCompany: 0,
    transportCompanyName: '',
    transportSourceName: '',
    defaultFormValue: {
      property: 'isDele',
      value: '0',
      group: 'main',
      operation: 'NOT_EQUAL',
      relation: 'AND',
    },
    pageBean: {
      page: 1,
      pageSize: 10,
      showTotal: true,
    },
  };

  columns = [
    {
      title: '超限许可证号',
      dataIndex: 'licenceCode',
    },
    {
      title: '货车牌号',
      dataIndex: 'carCode',
    },
    {
      title: '道路运输证号',
      dataIndex: 'transportCode',
    },
    {
      title: '承运人名称',
      dataIndex: 'carrier',
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
    },
    {
      title: '法人代表',
      dataIndex: 'legalRepresent',
    },
    {
      title: '法人代表证件类型',
      dataIndex: 'idCardType',
      render: val => cardType[val - 1],
    },
    {
      title: '法人代表证件号码',
      dataIndex: 'idCardNo',
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
    const { pageBean, defaultFormValue } = this.state;
    this.getList({ pageBean, querys: [defaultFormValue] });
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
      type: 'Large/detail',
      payload: { id },
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

  dataDel = id => {
    this.delUtil(id);
  };

  delBatch = () => {
    const { selectedRows } = this.state;
    if (!selectedRows) return;
    const self = this;
    Modal.confirm({
      title: '批量删除',
      content: '您确定要批量删除吗?',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        self.delUtil(selectedRows.map(item => item.id).join());
      },
      onCancel() {},
    });
  };

  delUtil = ids => {
    const { pageBean, defaultFormValue } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'Large/remove',
      payload: { ids },
      callback: () => {
        message.success('删除成功');
        this.getList({ pageBean, querys: [defaultFormValue] });
        this.setState({ selectedRows: [] });
      },
    });
  };

  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Large/fetch',
      payload: params,
    });
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { formValues, defaultFormValue } = this.state;
    let arr = [];
    arr.unshift(defaultFormValue);
    const params = {
      pageBean: {
        page: pagination.current,
        pageSize: pagination.pageSize,
        showTotal: true,
      },
      querys: arr.concat(formValues),
    };
    this.getList(params);
  };

  handleFormReset = () => {
    const { form } = this.props;
    const { pageBean, defaultFormValue } = this.state;
    form.resetFields();
    this.setState({
      formValues: [],
      selectedRows: [],
    });
    this.getList({ pageBean, querys: [defaultFormValue] });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { pageBean, defaultFormValue } = this.state;
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
      const conditionFilter = condition.filter(item => item);
      this.setState({
        formValues: conditionFilter,
      });
      conditionFilter.unshift(defaultFormValue);
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

  handleUpdateModalVisible = flag => {
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
    const { pageBean, defaultFormValue } = this.state;
    dispatch({
      type: 'Large/add',
      payload: fields,
      callback: () => {
        message.success('添加成功');
        this.handleModalVisible();
        this.getList({ pageBean, querys: [defaultFormValue] });
        callback && callback();
      },
    });
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    const { pageBean, detail, defaultFormValue, isSourceCompany, isTransportCompany } = this.state;
    const keys = Object.keys(fields);
    const newData = JSON.parse(JSON.stringify(detail));

    for (let i = 0; i < keys.length; i++) {
      newData[keys[i]] = fields[keys[i]];
    }
    newData.transportSourceName = isSourceCompany ? newData.transportSourceName : '';
    newData.transportCompanyName = isTransportCompany ? newData.transportCompanyName : '';

    this.setState({ detail: newData });
    dispatch({
      type: 'Large/update',
      payload: newData,
      callback: () => {
        message.success('编辑成功');
        this.handleUpdateModalVisible();
        this.getList({ pageBean, querys: [defaultFormValue] });
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
              {getFieldDecorator('licenceCode')(
                <Input addonBefore="超限许可证号" placeholder="请输入" />,
              )}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem>
              {getFieldDecorator('carCode')(<Input addonBefore="货车牌号" placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('transportCode')(
                <Input addonBefore="道路运输证号" placeholder="请输入" />,
              )}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('carrier')(
                <Input addonBefore="承运人名称" placeholder="请输入" />,
              )}
            </FormItem>
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
      Large: { data },
      loading,
    } = this.props;
    const {
      selectedRows,
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
      treeList: treeList,
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      loading: loading,
      transportCompanyChange: this.transportCompanyChange,
      sourceCompanyChange: this.sourceCompanyChange,
      isTransportCompany: isTransportCompany,
      isSourceCompany: isSourceCompany,
      transportCompanyName: transportCompanyName,
      transportSourceName: transportSourceName,
      showCompanyModal: this.showCompanyModal,
      showSourceCompanyModal: this.showSourceCompanyModal,
    };
    const updateMethods = {
      treeList: treeList,
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
      loading: loading,
      detail: detail,
      transportCompanyChange: this.transportCompanyChange,
      sourceCompanyChange: this.sourceCompanyChange,
      isTransportCompany: isTransportCompany,
      isSourceCompany: isSourceCompany,
      transportCompanyName: transportCompanyName,
      transportSourceName: transportSourceName,
      showCompanyModal: this.showCompanyModal,
      showSourceCompanyModal: this.showSourceCompanyModal,
    };

    const tabConfig = {
      size: 'middle',
      loading: loading,
      data: data,
      columns: this.columns,
      onChange: this.handleStandardTableChange,
    };

    return (
      <Fragment>
        {checkAuth(authority[0]) ? null : <Redirect to="/exception/403" />}
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <div className={styles.tableListOperator}>
              {checkAuth(authority[1]) ? (
                <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                  新建
                </Button>
              ) : null}
              {selectedRows.length > 0 && (
                <Button type="danger" onClick={() => this.delBatch()}>
                  批量删除
                </Button>
              )}
            </div>
            {checkAuth(authority[3]) ? (
              <StandardTable
                tableAlert={true}
                selectedRows={selectedRows}
                onSelectRow={this.handleSelectRows}
                {...tabConfig}
              />
            ) : (
              <StandardTable selectedRows={0} rowSelection={null} {...tabConfig} />
            )}
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
