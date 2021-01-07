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
  InputNumber,
  Radio,
  Switch,
  Divider,
  Tooltip,
  Popconfirm,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import { getPlanObject } from '@/utils/dictionaries';

import styles from '../../../style/style.less';
import themeStyle from '@/pages/style/theme.less';
import publicCss from '@/pages/style/public.less';

const FormItem = Form.Item;
const { Option } = Select;

const relayStatusMap = ['通电', '断电'];
// const ponitObjName = ['养护', '海事', '运政'];
let planObject = [[], []];

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, loading } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleAdd(fieldsValue, () => form.resetFields());
    });
  };
  return (
    <Modal
      destroyOnClose
      title="添加点位"
      className={themeStyle.formModal}
      visible={modalVisible}
      width={700}
      onCancel={() => handleModalVisible()}
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
            <FormItem label="点位名称">
              {form.getFieldDecorator('pointName', {
                rules: [{ required: true, message: '请输入点位名称！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="点位对象">
              {form.getFieldDecorator('ponitObj', {
                rules: [{ required: true, message: '请选择点位对象！' }],
              })(
                <Select style={{ width: '100%' }} placeholder="请选择点位对象">
                  {planObject[1].map((item, i) => (
                    <Option value={planObject[0][i]} key={i}>
                      {item}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="点位地址">
              {form.getFieldDecorator('addr', {
                rules: [{ required: true, message: '请输入点位地址！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="继电器账号">
              {form.getFieldDecorator('relayAccount', {
                rules: [{ required: true, message: '请输入继电器账号！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="继电器密码">
              {form.getFieldDecorator('relayPwd', {
                rules: [{ required: true, message: '请输入继电器密码！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="继电器状态">
              {form.getFieldDecorator('relayStatus', {
                rules: [{ required: true, message: '请选择继电器状态！' }],
              })(
                <Radio.Group>
                  {relayStatusMap.map((item, i) => (
                    <Radio value={i + 1} key={i}>
                      {item}
                    </Radio>
                  ))}
                </Radio.Group>,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="设备序列号">
              {form.getFieldDecorator('serial', {
                rules: [{ required: true, message: '请输入设备序列号！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="通道号">
              {form.getFieldDecorator('channel', {
                rules: [{ required: true, message: '请输入通道号！' }],
              })(<InputNumber style={{ width: '100%' }} placeholder="请输入" />)}
            </FormItem>
          </Col>
        </Row>
      </div>
    </Modal>
  );
});

const UpdateForm = Form.create()(props => {
  const { modalVisible, form, handleUpdate, handleModalVisible, detail, loading } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleUpdate(fieldsValue, () => form.resetFields());
    });
  };
  return (
    <Modal
      destroyOnClose
      title="编辑点位"
      className={themeStyle.formModal}
      visible={modalVisible}
      width={700}
      onCancel={() => handleModalVisible()}
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
            <FormItem label="点位名称">
              {form.getFieldDecorator('pointName', {
                initialValue: detail.pointName,
                rules: [{ required: true, message: '请输入点位名称！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="点位对象">
              {form.getFieldDecorator('ponitObj', {
                initialValue: detail.ponitObj,
                rules: [{ required: true, message: '请选择点位对象！' }],
              })(
                <Select disabled style={{ width: '100%' }} placeholder="请选择点位对象">
                  {planObject[1].map((item, i) => (
                    <Option value={planObject[0][i]} key={i}>
                      {item}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="点位地址">
              {form.getFieldDecorator('addr', {
                initialValue: detail.addr,
                rules: [{ required: true, message: '请输入点位地址！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="继电器账号">
              {form.getFieldDecorator('relayAccount', {
                initialValue: detail.relayAccount,
                rules: [{ required: true, message: '请输入继电器账号！' }],
              })(<Input disabled placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="继电器密码">
              {form.getFieldDecorator('relayPwd', {
                initialValue: detail.relayPwd,
                rules: [{ required: true, message: '请输入继电器密码！' }],
              })(<Input disabled placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="继电器状态">
              {form.getFieldDecorator('relayStatus', {
                initialValue: detail.relayStatus,
                rules: [{ required: true, message: '请选择继电器状态！' }],
              })(
                <Radio.Group disabled>
                  {relayStatusMap.map((item, i) => (
                    <Radio value={i + 1} key={i}>
                      {item}
                    </Radio>
                  ))}
                </Radio.Group>,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="设备序列号">
              {form.getFieldDecorator('serial', {
                initialValue: detail.serial,
                rules: [{ required: true, message: '请输入设备序列号！' }],
              })(<Input disabled placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="通道号">
              {form.getFieldDecorator('channel', {
                initialValue: detail.channel,
                rules: [{ required: true, message: '请输入通道号！' }],
              })(<InputNumber disabled style={{ width: '100%' }} placeholder="请输入" />)}
            </FormItem>
          </Col>
        </Row>
      </div>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ ConserveMonitor, loading }) => ({
  ConserveMonitor,
  loading: loading.models.ConserveMonitor,
}))
@Form.create()
class TableList extends PureComponent {
  // eslint-disable-next-line react/sort-comp
  constructor(props) {
    super(props);
    planObject = this.getNewPlanObject();
  }

  state = {
    modalVisible: false,
    updateModalVisible: false,
    formValues: [],
    detail: {},
    defaultQuery: {},
    pageBean: { page: 1, pageSize: 10, showTotal: true },
  };

  columns = [
    {
      title: '点位名称',
      dataIndex: 'pointName',
    },
    {
      title: '点位地址',
      dataIndex: 'addr',
    },
    {
      title: '继电器账号',
      dataIndex: 'relayAccount',
    },
    {
      title: '继电器密码',
      dataIndex: 'relayPwd',
    },
    {
      title: '继电器状态',
      dataIndex: 'relayStatus',
      render: val => relayStatusMap[val - 1],
    },
    {
      title: '继电器开关',
      width: 110,
      render: val => (
        <Switch
          checkedChildren="开"
          unCheckedChildren="关"
          checked={val.relayStatus === 1}
          onClick={() => this.switchClick(val)}
        />
      ),
    },
    {
      title: '操作',
      width: 90,
      render: (text, record) => (
        <Fragment>
          <Tooltip placement="left" title="编辑">
            <Button
              onClick={() => this.editData(record)}
              type="primary"
              shape="circle"
              icon="edit"
              size="small"
            />
          </Tooltip>
          <Divider type="vertical" />
          <Popconfirm
            title="是否删除数据?"
            onConfirm={() => this.dataDel(record.id_)}
            okText="确定"
            cancelText="取消"
          >
            <Tooltip placement="left" title="删除">
              <Button type="danger" shape="circle" icon="delete" size="small" />
            </Tooltip>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const defaultQuery = {
      property: 'ponitObj',
      value: planObject[0],
      group: 'main',
      operation: 'IN',
      relation: 'AND',
    };
    this.getList({ pageBean: this.state.pageBean, querys: [defaultQuery] });
    this.setState({ defaultQuery });
  }

  /**
   * @description 获取新对象
   * @returns {*[][]}
   */
  getNewPlanObject = () => {
    const planObjects = getPlanObject();
    const [planObject, planObjectNumber] = [planObjects[1], planObjects[0]];
    if (planObject.indexOf('路政') > -1) {
      planObject.splice(planObject.indexOf('路政'), 1);
    }
    if (planObjectNumber.indexOf(-1) > -1) {
      planObjectNumber.splice(planObjectNumber.indexOf(-1), 1);
    }
    return [planObjectNumber, planObject];
  };

  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ConserveMonitor/fetch',
      payload: params,
    });
  };

  editData = detail => {
    this.setState({ detail }, () => this.handleUpdateModalVisible(true));
  };

  switchClick = val => {
    const { dispatch } = this.props;
    const { pageBean, formValues, defaultQuery } = this.state;
    dispatch({
      type: 'ConserveMonitor/switchRelay',
      payload: {
        id_: val.id_,
        relayStatus: val.relayStatus === 1 ? 2 : 1,
      },
      callback: () => {
        message.success('继电器' + (val.relayStatus === 1 ? '关闭' : '开启') + '成功');
        this.getList({ pageBean, querys: formValues.length ? formValues : [defaultQuery] });
      },
    });
  };

  dataDel = ids => {
    const { dispatch } = this.props;
    const { defaultQuery, pageBean } = this.state;
    dispatch({
      type: 'ConserveMonitor/remove',
      payload: ids,
      callback: () => {
        message.success('删除成功');
        this.getList({ pageBean, querys: [defaultQuery] });
      },
    });
  };

  handleStandardTableChange = pagination => {
    const { formValues, defaultQuery } = this.state;
    const params = {
      pageBean: {
        page: pagination.current,
        pageSize: pagination.pageSize,
        showTotal: true,
      },
      querys: formValues.length ? formValues : [defaultQuery],
    };
    this.getList(params);
  };

  handleFormReset = () => {
    const { form } = this.props;
    const { pageBean, defaultQuery } = this.state;
    form.resetFields();
    this.setState({
      formValues: [],
    });
    this.getList({ pageBean, querys: [defaultQuery] });
  };

  handleSearch = e => {
    e.preventDefault();

    const { form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { pageBean, defaultQuery } = this.state;
      const arr = [
        {
          property: 'pointName',
          value: fieldsValue.name,
          group: 'main',
          operation: 'LIKE',
          relation: 'AND',
        },
        fieldsValue.dx
          ? {
              property: 'ponitObj',
              value: fieldsValue.dx,
              group: 'main',
              operation: 'EQUAL',
              relation: 'AND',
            }
          : defaultQuery,
      ].filter(item => item.value);
      this.setState({
        formValues: arr,
      });

      this.getList({
        pageBean,
        querys: arr,
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = flag => {
    this.setState({
      updateModalVisible: !!flag,
    });
    if (!flag) {
      this.setState({ detail: {} });
    }
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    const { defaultQuery, pageBean, formValues } = this.state;
    dispatch({
      type: 'ConserveMonitor/add',
      payload: fields,
      callback: () => {
        message.success('添加成功');
        this.handleModalVisible();
        this.getList({ pageBean, querys: [defaultQuery].concat(formValues) });
      },
    });
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    const { pageBean, detail, defaultQuery, formValues } = this.state;
    const newDetail = JSON.parse(JSON.stringify(detail));
    for (let i in fields) {
      newDetail[i] = fields[i];
    }
    this.setState({ detail: newDetail });
    dispatch({
      type: 'ConserveMonitor/update',
      payload: newDetail,
      callback: () => {
        message.success('编辑成功');
        this.handleUpdateModalVisible();
        this.getList({ pageBean, querys: [defaultQuery].concat(formValues) });
      },
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 16, xl: 16 }}>
          <Col md={6} sm={24}>
            <FormItem>
              {getFieldDecorator('name')(<Input addonBefore="名称" placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <div className={publicCss.inputMain}>
              <span
                style={{ width: '80px', lineHeight: '30px', height: '32px' }}
                className="ant-input-group-addon"
              >
                对象
              </span>
              <FormItem style={{ flex: 1 }}>
                {getFieldDecorator('dx')(
                  <Select placeholder="请选择" style={{ width: '100%' }}>
                    {planObject[1].map((item, i) => (
                      <Option key={i} value={planObject[0][i]}>
                        {item}
                      </Option>
                    ))}
                  </Select>,
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
      ConserveMonitor: { data },
      loading,
    } = this.props;
    const { modalVisible, updateModalVisible, detail } = this.state;

    const parentMethods = {
      loading,
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      loading,
      detail,
      handleModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <Fragment>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
            </div>
            <StandardTable
              rowKey="id_"
              size="middle"
              tableAlert={false}
              selectedRows={0}
              rowSelection={null}
              loading={loading}
              data={data}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
        {updateModalVisible && Object.keys(detail).length ? (
          <UpdateForm modalVisible={updateModalVisible} {...updateMethods} />
        ) : null}
      </Fragment>
    );
  }
}

export default TableList;
