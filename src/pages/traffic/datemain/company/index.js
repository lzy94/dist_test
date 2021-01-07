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
  DatePicker,
  TreeSelect,
  Divider,
  Tooltip,
  Popconfirm,
  InputNumber,
} from 'antd';
import { Redirect } from 'umi';
import StandardTable from '@/components/StandardTable';

import { checkAuth } from '@/utils/utils';
import styles from '../../../style/style.less';
import publicCss from '../../../style/public.less';
import themeStyle from '@/pages/style/theme.less';

const FormItem = Form.Item;
const { Option } = Select;
const authority = [
  '/datemain/company',
  '/datemain/company/add',
  '/datemain/company/update',
  '/datemain/company/delete',
  '/transport/datemain/company',
];
const cardType = ['身份证', '执法证', '军官证', '护照', '其他'];

const CreateForm = Form.create()(props => {
  const { treeList, modalVisible, form, handleAdd, handleModalVisible, loading } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleAdd(fieldsValue, () => form.resetFields());
    });
  };
  return (
    <Modal
      destroyOnClose
      title="添加货运企业"
      className={themeStyle.formModal}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      footer={[
        <Button key="back" onClick={() => handleModalVisible()}>
          取消
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={okHandle}>
          确定
        </Button>,
      ]}
      width={800}
    >
      <div className={themeStyle.formModalBody}>
        <Row gutter={40}>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="企业名称">
              {form.getFieldDecorator('companyName', {
                rules: [{ required: true, message: '请输入企业名称！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="企业号码">
              {form.getFieldDecorator('companyPhone', {
                rules: [{ required: true, message: '请输入企业号码！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="企业地址">
              {form.getFieldDecorator('address', {
                rules: [{ required: true, message: '请输入企业地址！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="法人代表">
              {form.getFieldDecorator('legalRepresent', {
                rules: [{ required: true, message: '请输入法人代表！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="法人代表证件类型">
              {form.getFieldDecorator('idCardType', {})(
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
            <FormItem label="法人代表证件号码">
              {form.getFieldDecorator('idCardNo', {})(<Input placeholder="请输入" />)}
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
            <FormItem hasFeedback label="道路运输证号">
              {form.getFieldDecorator('transportCode', {
                rules: [{ required: true, message: '请输入道路运输证号！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="发证日期">
              {form.getFieldDecorator('getLicenceDate', {})(
                <DatePicker style={{ width: '100%' }} placeholder="请选择" />,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="承运人名称">
              {form.getFieldDecorator('carrier', {})(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="承运人地址">
              {form.getFieldDecorator('carrierAddr', {})(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="承运人邮编">
              {form.getFieldDecorator('carrierMail', {})(
                <InputNumber style={{ width: '100%' }} placeholder="请输入" />,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="备注">
              {form.getFieldDecorator('remark', {})(<Input.TextArea placeholder="请输入" />)}
            </FormItem>
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
      title={check ? '编辑货运企业' : '货运企业详情'}
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
            <FormItem hasFeedback={check} label="企业名称">
              {form.getFieldDecorator('companyName', {
                initialValue: detail.companyName,
                rules: [{ required: true, message: '请输入企业名称！' }],
              })(<Input disabled={!check} style={style} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback={check} label="企业号码">
              {form.getFieldDecorator('companyPhone', {
                initialValue: detail.companyPhone,
                rules: [{ required: true, message: '请输入企业号码！' }],
              })(
                <Input
                  disabled={!check}
                  style={style}
                  disabled={!check}
                  style={style}
                  placeholder="请输入"
                />,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback={check} label="企业地址">
              {form.getFieldDecorator('address', {
                initialValue: detail.address,
                rules: [{ required: true, message: '请输入企业地址！' }],
              })(<Input disabled={!check} style={style} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback={check} label="法人代表">
              {form.getFieldDecorator('legalRepresent', {
                initialValue: detail.legalRepresent,
                rules: [{ required: true, message: '请输入法人代表！' }],
              })(<Input disabled={!check} style={style} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            {check ? (
              <FormItem label="法人代表证件类型">
                {form.getFieldDecorator('idCardType', {
                  initialValue: parseInt(detail.idCardType),
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
            <FormItem hasFeedback={check} label="道路运输证号">
              {form.getFieldDecorator('transportCode', {
                initialValue: detail.transportCode,
                rules: [{ required: true, message: '请输入道路运输证号！' }],
              })(<Input disabled={!check} style={style} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            {check ? (
              <FormItem label="发证日期">
                {form.getFieldDecorator('getLicenceDate', {
                  initialValue: moment(new Date(detail.getLicenceDate), 'YYYY-MM-DD'),
                })(<DatePicker style={{ width: '100%' }} placeholder="请选择" />)}
              </FormItem>
            ) : (
              <FormItem label="发证日期">
                {form.getFieldDecorator('getLicenceDate', {
                  initialValue: moment(new Date(detail.getLicenceDate)).format('YYYY-MM-DD'),
                })(<Input disabled={!check} style={style} placeholder="请选择" />)}
              </FormItem>
            )}
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="承运人名称">
              {form.getFieldDecorator('carrier', {
                initialValue: detail.carrier,
              })(<Input disabled={!check} style={style} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="承运人地址">
              {form.getFieldDecorator('carrierAddr', {
                initialValue: detail.carrierAddr,
              })(<Input disabled={!check} style={style} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="承运人邮编">
              {form.getFieldDecorator('carrierMail', {
                initialValue: detail.carrierMail,
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
            <FormItem label="备注">
              {form.getFieldDecorator('remark', {
                initialValue: detail.remark,
              })(<Input.TextArea disabled={!check} style={style} placeholder="请输入" />)}
            </FormItem>
          </Col>
        </Row>
      </div>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ system, Company, loading }) => ({
  treeList: system.treeList,
  Company,
  loading: loading.models.Company,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    formValues: [],
    detail: {},
    pageBean: {
      page: 1,
      pageSize: 10,
      showTotal: true,
    },
  };

  columns = [
    {
      title: '企业名称',
      dataIndex: 'companyName',
    },
    {
      title: '企业号码',
      dataIndex: 'companyPhone',
    },
    {
      title: '地址',
      dataIndex: 'address',
    },
    {
      title: '法人代表',
      dataIndex: 'legalRepresent',
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
      title: '承运人地址',
      dataIndex: 'carrierAddr',
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
      type: 'Company/detail',
      payload: id,
      callback: res => {
        this.setState({ detail: res });
        this.handleUpdateModalVisible(true);
      },
    });
  };

  dataDel = id => {
    const { pageBean } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'Company/remove',
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
      type: 'Company/fetch',
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
              operation: item === 'organCode' ? 'RIGHT_LIKE' : 'LIKE',
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
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
    });
  };

  handleAdd = (fields, callback) => {
    const { dispatch } = this.props;
    const { pageBean } = this.state;
    dispatch({
      type: 'Company/add',
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
    const { pageBean, detail } = this.state;
    const keys = Object.keys(fields);
    const newData = JSON.parse(JSON.stringify(detail));

    for (let i = 0; i < keys.length; i++) {
      newData[keys[i]] = fields[keys[i]];
    }
    this.setState({ detail: newData });

    dispatch({
      type: 'Company/update',
      payload: newData,
      callback: () => {
        message.success('编辑成功');
        this.handleUpdateModalVisible();
        this.getList({ pageBean });
      },
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
              {getFieldDecorator('companyName')(
                <Input addonBefore="企业名称" placeholder="请输入" />,
              )}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('legalRepresent')(
                <Input addonBefore="法人代表" placeholder="请输入" />,
              )}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('transportCode')(
                <Input addonBefore="道路运输证号" placeholder="请输入" />,
              )}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <span className={styles.submitButtons} style={{ float: 'right' }}>
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
      Company: { data },
      loading,
    } = this.props;
    const { modalVisible, updateModalVisible, detail } = this.state;

    const parentMethods = {
      treeList,
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      loading,
    };
    const updateMethods = {
      treeList,
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
      detail,
      loading,
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
      </Fragment>
    );
  }
}

export default TableList;
