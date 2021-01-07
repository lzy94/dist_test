import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Modal,
  message,
  DatePicker,
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
const RadioGroup = Radio.Group;

const authority = [
  '/datemain/blacklist',
  '/datemain/blacklist/add',
  '/datemain/blacklist/update',
  '/datemain/blacklist/delete',
];

const CreateForm = Form.create()(props => {
  const {
    treeList,
    modalVisible,
    form,
    handleAdd,
    handleModalVisible,
    loading,
    transportChange,
    sourceChange,
    isTransport,
    isSource,
    showCompanyModal,
    showSourceCompanyModal,
    sourceCompanyName,
    freightName,
  } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="添加黑名单"
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
            <FormItem hasFeedback label="车牌号">
              {form.getFieldDecorator('carNo', {
                rules: [{ required: true, validator: checkLicensePlate }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="超限次数">
              {form.getFieldDecorator('limitedNum', {
                rules: [{ required: true, message: '请输入超限次数！' }],
              })(<InputNumber min={0} style={{ width: '100%' }} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="车籍地">
              {form.getFieldDecorator('carBirthplace', {
                rules: [{ required: true, message: '请输入车籍地！' }],
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
            <FormItem label="道路运输证号">
              {form.getFieldDecorator('transpoptNo', {})(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="发证日期">
              {form.getFieldDecorator('getLinceseDate', {})(
                <DatePicker style={{ width: '100%' }} placeholder="请选择" />,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="发证机关">
              {form.getFieldDecorator('linceseOrgan', {})(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="超限超载情况">
              {form.getFieldDecorator('limitedSituation', {
                rules: [{ required: true, message: '请输入超限超载情况！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="查处时间">
              {form.getFieldDecorator('investigationDate', {
                rules: [{ required: true, message: '请选择查处时间！' }],
              })(<DatePicker style={{ width: '100%' }} placeholder="请选择" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="处罚机关">
              {form.getFieldDecorator('investigationOrgan', {})(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>

          <Col md={12} sm={24}>
            <FormItem label="处罚机关联系电话">
              {form.getFieldDecorator('investigationTel', {})(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="处罚文书编号">
              {form.getFieldDecorator('investigationCode', {})(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="导入来源">
              {form.getFieldDecorator('sourceImport', {})(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={40}>
          <Col md={12} sm={24}>
            <FormItem label="是否所属货运企业">
              {form.getFieldDecorator('isFreight', {})(
                <RadioGroup onChange={transportChange}>
                  <Radio value={1}>是</Radio>
                  <Radio value={0}>否</Radio>
                </RadioGroup>,
              )}
            </FormItem>
          </Col>

          <Col md={12} sm={24}>
            {isTransport ? (
              <FormItem label="货运企业">
                {form.getFieldDecorator('freightName', {
                  initialValue: freightName,
                })(<Input onClick={() => showCompanyModal()} readOnly placeholder="请选择" />)}
              </FormItem>
            ) : null}
          </Col>
        </Row>
        <Row gutter={40}>
          <Col md={12} sm={24}>
            <FormItem label="是否所属源头企业">
              {form.getFieldDecorator('isSource', {})(
                <RadioGroup onChange={sourceChange}>
                  <Radio value={1}>是</Radio>
                  <Radio value={0}>否</Radio>
                </RadioGroup>,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            {isSource ? (
              <FormItem label="源头企业">
                {form.getFieldDecorator('sourceCompanyName', {
                  initialValue: sourceCompanyName,
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
    transportChange,
    sourceChange,
    isTransport,
    isSource,
    showCompanyModal,
    freightName,
    showSourceCompanyModal,
    sourceCompanyName,
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
      title={check ? '编辑黑名单' : '黑名单详情'}
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
            <FormItem label="车牌号">
              {form.getFieldDecorator('carNo', {
                initialValue: detail.carNo,
                rules: [{ required: true, validator: checkLicensePlate }],
              })(<Input disabled style={style} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback={check} label="超限次数">
              {form.getFieldDecorator('limitedNum', {
                initialValue: detail.limitedNum,
                rules: [{ required: true, message: '请输入超限次数！' }],
              })(
                <InputNumber
                  min={0}
                  disabled={!check}
                  style={{ width: '100%', ...style }}
                  placeholder="请输入"
                />,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback={check} label="车籍地">
              {form.getFieldDecorator('carBirthplace', {
                initialValue: detail.carBirthplace,
                rules: [{ required: true, message: '请输入车籍地！' }],
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
            <FormItem label="道路运输证号">
              {form.getFieldDecorator('transpoptNo', {
                initialValue: detail.transpoptNo,
              })(<Input disabled={!check} style={style} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="发证日期">
              {form.getFieldDecorator('getLinceseDate', {
                initialValue: moment(new Date(detail.getLinceseDate), 'YYYY-MM-DD'),
              })(
                <DatePicker
                  disabled={!check}
                  style={{ width: '100%', ...style }}
                  placeholder="请选择"
                />,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="发证机关">
              {form.getFieldDecorator('linceseOrgan', {
                initialValue: detail.linceseOrgan,
              })(<Input disabled={!check} style={style} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback={check} label="超限超载情况">
              {form.getFieldDecorator('limitedSituation', {
                initialValue: detail.limitedSituation,
                rules: [{ required: true, message: '请输入超限超载情况！' }],
              })(<Input disabled={!check} style={style} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback={check} label="查处时间">
              {form.getFieldDecorator('investigationDate', {
                initialValue: moment(new Date(detail.investigationDate), 'YYYY-MM-DD'),
                rules: [{ required: true, message: '请选择查处时间！' }],
              })(
                <DatePicker
                  disabled={!check}
                  style={{ width: '100%', ...style }}
                  placeholder="请选择"
                />,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="处罚机关">
              {form.getFieldDecorator('investigationOrgan', {
                initialValue: detail.investigationOrgan,
              })(<Input disabled={!check} style={style} placeholder="请输入" />)}
            </FormItem>
          </Col>

          <Col md={12} sm={24}>
            <FormItem label="处罚机关联系电话">
              {form.getFieldDecorator('investigationTel', {
                initialValue: detail.investigationTel,
              })(<Input disabled={!check} style={style} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="处罚文书编号">
              {form.getFieldDecorator('investigationCode', {
                initialValue: detail.investigationCode,
              })(<Input disabled={!check} style={style} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="导入来源">
              {form.getFieldDecorator('sourceImport', {
                initialValue: detail.sourceImport,
              })(<Input disabled={!check} style={style} placeholder="请输入" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={40}>
          <Col md={12} sm={24}>
            <FormItem label="是否所属货运企业">
              {form.getFieldDecorator('isFreight', {
                initialValue: detail.isFreight,
              })(
                <RadioGroup disabled={!check} style={style} onChange={transportChange}>
                  <Radio value={1}>是</Radio>
                  <Radio value={0}>否</Radio>
                </RadioGroup>,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            {isTransport ? (
              <FormItem label="货运企业">
                {form.getFieldDecorator('freightName', {
                  initialValue: freightName ? freightName : detail.freightName,
                })(
                  <Input
                    disabled={!check}
                    style={style}
                    readOnly
                    onClick={() => showCompanyModal()}
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
              {form.getFieldDecorator('isSource', {
                initialValue: detail.isSource,
              })(
                <RadioGroup disabled={!check} style={style} onChange={sourceChange}>
                  <Radio value={1}>是</Radio>
                  <Radio value={0}>否</Radio>
                </RadioGroup>,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            {isSource ? (
              <FormItem label="源头企业">
                {form.getFieldDecorator('sourceCompanyName', {
                  initialValue: sourceCompanyName ? sourceCompanyName : detail.sourceCompanyName,
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
@connect(({ system, Blacklist, loading }) => ({
  treeList: system.treeList,
  Blacklist,
  loading: loading.models.Blacklist,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    companyModalVisible: false,
    sourceCompanyModalVisible: false,
    freightName: '',
    sourceCompanyName: '',
    selectedRows: [],
    formValues: [],
    detail: {},
    isTransport: 0,
    isSource: 0,
    pageBean: {
      page: 1,
      pageSize: 10,
      showTotal: true,
    },
  };

  columns = [
    {
      title: '车牌号',
      dataIndex: 'carNo',
    },
    {
      title: '超限次数',
      dataIndex: 'limitedNum',
    },
    {
      title: '车籍地',
      dataIndex: 'carBirthplace',
    },
    {
      title: '道路运输证号',
      dataIndex: 'transpoptNo',
    },
    {
      title: '发证日期',
      dataIndex: 'getLinceseDate',
      render: val => moment(val).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '发证机关',
      dataIndex: 'linceseOrgan',
    },
    {
      title: '超限超载情况',
      dataIndex: 'limitedSituation',
    },
    {
      title: '查处时间',
      dataIndex: 'investigationDate',
      render: val => moment(val).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '处罚机关',
      dataIndex: 'investigationOrgan',
    },
    {
      title: '处罚机关联系电话',
      dataIndex: 'investigationTel',
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

  showModal = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Blacklist/detail',
      payload: id,
      callback: res => {
        this.setState({ detail: res, isTransport: res.isFreight, isSource: res.isSource });
        this.handleUpdateModalVisible(true);
      },
    });
  };

  showCompanyModal = () => {
    this.handleCompanyModalVisible(true);
  };
  showSourceCompanyModal = () => {
    this.handleSourceCompanyModalVisible(true);
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
    const { pageBean } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'Blacklist/remove',
      payload: { ids },
      callback: () => {
        message.success('删除成功');
        this.getList({ pageBean });
        this.setState({ selectedRows: [] });
      },
    });
  };

  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Blacklist/fetch',
      payload: params,
    });
  };

  componentDidMount() {
    if (!checkAuth(authority[0])) return;
    const { pageBean } = this.state;
    this.getList({ pageBean });
  }

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
      selectedRows: [],
    });

    this.getList({ pageBean });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { pageBean } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

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
                item === 'organCode' ? 'RIGHT_LIKE' : item === 'LIMITED_NUM' ? 'EQUAL' : 'LIKE',
              relation: 'AND',
            }
          : '';
      });
      const conditionFilter = condition.filter(item => item);
      this.setState({
        formValues: conditionFilter,
      });
      this.getList({
        pageBean,
        querys: conditionFilter,
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
    if (!!!flag) {
      this.setState({
        isTransport: 0,
        isSource: 0,
        freightName: '',
        sourceCompanyName: '',
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
        isTransport: 0,
        isSource: 0,
        freightName: '',
        sourceCompanyName: '',
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
    this.setState({ freightName: res.companyName });
    this.handleCompanyModalVisible();
  };

  selectSourceCompanyTableRow = res => {
    this.setState({ sourceCompanyName: res.companyName });
    this.handleSourceCompanyModalVisible();
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    const { pageBean } = this.state;
    dispatch({
      type: 'Blacklist/add',
      payload: fields,
      callback: () => {
        message.success('添加成功');
        this.handleModalVisible();
        this.getList({ pageBean });
      },
    });
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    const { pageBean, detail, isTransport, isSource } = this.state;
    const keys = Object.keys(fields);
    const newData = JSON.parse(JSON.stringify(detail));

    for (let i = 0; i < keys.length; i++) {
      newData[keys[i]] = fields[keys[i]];
    }
    this.setState({ detail: newData });
    newData.sourceCompanyName = isSource ? newData.sourceCompanyName : '';
    newData.freightName = isTransport ? newData.freightName : '';
    dispatch({
      type: 'Blacklist/update',
      payload: newData,
      callback: () => {
        message.success('编辑成功');
        this.handleUpdateModalVisible();
        this.getList({ pageBean });
      },
    });
  };

  transportChange = e => {
    this.setState({
      isTransport: e.target.value,
    });
  };

  sourceChange = e => {
    this.setState({
      isSource: e.target.value,
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
              {getFieldDecorator('carNo')(<Input addonBefore="车牌号" placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <div className={publicCss.inputMain}>
              <span
                style={{ width: '80px', lineHeight: '30px', height: '32px' }}
                className="ant-input-group-addon"
              >
                超限次数
              </span>
              <FormItem style={{ flex: 1 }}>
                {getFieldDecorator('LIMITED_NUM')(
                  <InputNumber
                    className={publicCss.inputGroupLeftRadius}
                    style={{
                      width: '100%',
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0,
                    }}
                    placeholder="请输入"
                  />,
                )}
              </FormItem>
            </div>
          </Col>
          <Col md={6} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      treeList,
      Blacklist: { data },
      loading,
    } = this.props;
    const {
      selectedRows,
      modalVisible,
      updateModalVisible,
      detail,
      isTransport,
      isSource,
      companyModalVisible,
      freightName,
      sourceCompanyName,
      sourceCompanyModalVisible,
    } = this.state;

    const parentMethods = {
      treeList: treeList,
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      loading: loading,
      isTransport: isTransport,
      isSource: isSource,
      transportChange: this.transportChange,
      sourceChange: this.sourceChange,
      showCompanyModal: this.showCompanyModal,
      showSourceCompanyModal: this.showSourceCompanyModal,
      freightName: freightName,
      sourceCompanyName: sourceCompanyName,
    };
    const updateMethods = {
      treeList: treeList,
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
      detail: detail,
      loading: loading,
      isTransport: isTransport,
      isSource: isSource,
      transportChange: this.transportChange,
      sourceChange: this.sourceChange,
      showCompanyModal: this.showCompanyModal,
      showSourceCompanyModal: this.showSourceCompanyModal,
      freightName: freightName,
      sourceCompanyName: sourceCompanyName,
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
