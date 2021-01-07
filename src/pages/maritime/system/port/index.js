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
  DatePicker,
  Radio,
  message,
  Divider,
  Tooltip,
  Popconfirm,
} from 'antd';
import StandardTable from '@/components/StandardTable';

import styles from '../../../style/style.less';
import themeStyle from '@/pages/style/theme.less';
import publicCss from '@/pages/style/public.less';

const FormItem = Form.Item;
const { Option } = Select;

const CreateForm = Form.create()(props => {
  const {
    modalVisible,
    form,
    handleAdd,
    handleModalVisible,
    loading,
    departmentUserList,
    changerChange,
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
      title="添加港口"
      className={themeStyle.formModal}
      visible={modalVisible}
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
        <Row gutter={20}>
          <Col sm={12}>
            <FormItem label="港口名称">
              {form.getFieldDecorator('portName', {
                rules: [{ required: true, message: '请输入港口名称' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem label="负责人">
              {form.getFieldDecorator('changerId', {
                rules: [{ required: true, message: '请选择负责人' }],
              })(
                <Select placeholder="请选择" style={{ width: '100%' }} onChange={changerChange}>
                  {departmentUserList.map(item => (
                    <Option key={item.id} value={item.id}>
                      {item.fullname}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
            <FormItem label="地址">
              {form.getFieldDecorator('portAddr', {
                rules: [{ required: true, message: '请输入地址' }],
              })(<Input.TextArea autosize placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col sm={12}>
            <FormItem label="港口编号">
              {form.getFieldDecorator('portCode', {
                rules: [{ required: true, message: '请输入港口编号' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem label="注册时间">
              {form.getFieldDecorator('registTime', {
                rules: [{ required: true, message: '请选择注册时间' }],
              })(<DatePicker placeholder="请选择" style={{ width: '100%' }} />)}
            </FormItem>
            <FormItem label="状态">
              {form.getFieldDecorator('state', {
                rules: [{ required: true, message: '请输入地址' }],
              })(
                <Radio.Group>
                  <Radio value={1}>营运中</Radio>
                  <Radio value={2}>停业中</Radio>
                </Radio.Group>,
              )}
            </FormItem>
          </Col>
        </Row>
      </div>
    </Modal>
  );
});

const UpdateForm = Form.create()(props => {
  const {
    modalVisible,
    form,
    handleUpdate,
    handleModalVisible,
    loading,
    departmentUserList,
    changerChange,
    detail,
  } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleUpdate(fieldsValue, () => form.resetFields());
    });
  };
  return (
    <Modal
      destroyOnClose
      title="编辑港口"
      className={themeStyle.formModal}
      visible={modalVisible}
      onCancel={() => handleModalVisible()}
      width={700}
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
        <Row gutter={20}>
          <Col sm={12}>
            <FormItem label="港口名称">
              {form.getFieldDecorator('portName', {
                initialValue: detail.portName,
                rules: [{ required: true, message: '请输入港口名称' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem label="负责人">
              {form.getFieldDecorator('changerId', {
                initialValue: detail.changerId,
                rules: [{ required: true, message: '请选择负责人' }],
              })(
                <Select placeholder="请选择" style={{ width: '100%' }} onChange={changerChange}>
                  {departmentUserList.map(item => (
                    <Option key={item.id} value={item.id}>
                      {item.fullname}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
            <FormItem label="地址">
              {form.getFieldDecorator('portAddr', {
                initialValue: detail.portAddr,
                rules: [{ required: true, message: '请输入地址' }],
              })(<Input.TextArea autosize placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col sm={12}>
            <FormItem label="港口编号">
              {form.getFieldDecorator('portCode', {
                initialValue: detail.portCode,
                rules: [{ required: true, message: '请输入港口编号' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem label="注册时间">
              {form.getFieldDecorator('registTime', {
                initialValue: moment(new Date(detail.registTime), 'YYYY-MM-DD'),
                rules: [{ required: true, message: '请选择注册时间' }],
              })(<DatePicker placeholder="请选择" style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <FormItem label="状态">
            {form.getFieldDecorator('state', {
              initialValue: detail.state,
              rules: [{ required: true, message: '请输入地址' }],
            })(
              <Radio.Group>
                <Radio value={1}>营运中</Radio>
                <Radio value={2}>停业中</Radio>
              </Radio.Group>,
            )}
          </FormItem>
        </Row>
      </div>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ MaritimePort, loading }) => ({
  MaritimePort,
  loading: loading.models.MaritimePort,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    formValues: [],
    changer: '',
    detail: {},
    departmentUserList: [],
    pageBean: { page: 1, pageSize: 10, showTotal: true },
  };

  columns = [
    {
      title: '港口名称',
      dataIndex: 'portName',
    },
    {
      title: '负责人',
      dataIndex: 'changer',
    },
    {
      title: '注册时间',
      dataIndex: 'registTime',
      width: 120,
      render: val => moment(val).format('YYYY-MM-DD'),
    },
    {
      title: '地址',
      dataIndex: 'portAddr',
    },
    {
      title: '状态',
      dataIndex: 'state',
      width: 80,
      render: val => (val === 1 ? '营运中' : '停业中'),
    },
    {
      title: '操作',
      width: 100,
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
            onConfirm={() => this.dataDel(record.id)}
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
    const { pageBean } = this.state;
    this.getList({ pageBean });
    this.getDepartmentUser();
  }

  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'MaritimePort/fetch',
      payload: params,
    });
  };

  dataDel = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'MaritimePort/remove',
      payload: { id },
      callback: () => {
        message.success('删除成功');
        this.getList({ pageBean: this.state.pageBean });
      },
    });
  };

  editData = detail => {
    this.setState(
      {
        detail,
        changer: detail.changer,
      },
      () => this.handleUpdateModalVisible(true),
    );
  };

  getDepartmentUser = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'system/departmentUser',
      payload: { menuType: -3 },
      callback: data => {
        this.setState({ departmentUserList: data });
      },
    });
  };

  handleStandardTableChange = pagination => {
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
    form.resetFields();
    this.setState({
      formValues: [],
    });
    this.getList({ pageBean: this.state.pageBean });
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { pageBean } = this.state;
      const values = {
        portName: fieldsValue.name,
        state: fieldsValue.zt,
        changerId: fieldsValue.fzr,
      };
      const objKeys = Object.keys(values);
      const condition = objKeys.map(item => {
        return values[item]
          ? {
              property: item,
              value: values[item],
              group: 'main',
              operation: item === 'portName' ? 'LIKE' : 'EQUAL',
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

  handleUpdateModalVisible = flag => {
    this.setState({
      updateModalVisible: !!flag,
    });
    if (!flag) {
      this.setState({ detail: {} });
    }
  };

  handleAdd = (fields, callback) => {
    const { dispatch } = this.props;
    const { changer, pageBean } = this.state;
    fields.changer = changer;
    dispatch({
      type: 'MaritimePort/add',
      payload: fields,
      callback: () => {
        message.success('添加成功');
        this.handleModalVisible();
        this.getList({ pageBean });
        callback && callback();
      },
    });
  };

  handleUpdate = (fields, callback) => {
    const { dispatch } = this.props;
    const { detail, pageBean, changer } = this.state;
    const newDetail = JSON.parse(JSON.stringify(detail));
    fields.changer = changer;
    for (let i in fields) {
      newDetail[i] = fields[i];
    }
    this.setState({ detail: newDetail });
    dispatch({
      type: 'MaritimePort/update',
      payload: newDetail,
      callback: () => {
        message.success('编辑成功');
        this.handleUpdateModalVisible();
        this.getList({ pageBean });
        callback && callback();
      },
    });
  };

  changerChange = (value, option) => {
    this.setState({
      changer: option.props.children,
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { departmentUserList } = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={16}>
          <Col md={6} sm={24}>
            <FormItem>
              {getFieldDecorator('name')(<Input addonBefore="港口名称" placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <div className={publicCss.inputMain}>
              <span
                style={{ width: '80px', lineHeight: '30px', height: '32px' }}
                className="ant-input-group-addon"
              >
                负责人
              </span>
              <FormItem style={{ flex: 1 }}>
                {getFieldDecorator('fzr')(
                  <Select placeholder="请选择" style={{ width: '100%' }}>
                    {departmentUserList.map(item => (
                      <Option key={item.id} value={item.id}>
                        {item.fullname}
                      </Option>
                    ))}
                  </Select>,
                )}
              </FormItem>
            </div>
          </Col>
          <Col md={6} sm={24}>
            <div className={publicCss.inputMain}>
              <span
                style={{ width: '80px', lineHeight: '30px', height: '32px' }}
                className="ant-input-group-addon"
              >
                状态
              </span>
              <FormItem style={{ flex: 1 }}>
                {getFieldDecorator('zt')(
                  <Select placeholder="请选择" style={{ width: '100%' }}>
                    <Option value={1}>营运中</Option>
                    <Option value={2}>停业中</Option>
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
      MaritimePort: { data },
      loading,
    } = this.props;
    const { modalVisible, updateModalVisible, departmentUserList, detail } = this.state;

    const parentMethods = {
      loading,
      departmentUserList,
      handleAdd: this.handleAdd,
      changerChange: this.changerChange,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      loading,
      detail,
      departmentUserList,
      changerChange: this.changerChange,
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
        {modalVisible ? <CreateForm {...parentMethods} modalVisible={modalVisible} /> : null}
        {updateModalVisible && Object.keys(detail).length ? (
          <UpdateForm {...updateMethods} modalVisible={updateModalVisible} />
        ) : null}
      </Fragment>
    );
  }
}

export default TableList;
