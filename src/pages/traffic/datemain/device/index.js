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
  Tooltip,
  Popconfirm,
} from 'antd';
import { Redirect } from 'umi';
import StandardTable from '@/components/StandardTable';

import styles from '../../../style/style.less';
import publicCss from '@/pages/style/public.less';
import { checkAuth } from '@/utils/utils';
import themeStyle from '@/pages/style/theme.less';

const FormItem = Form.Item;
const Option = Select.Option;
const type = ['APP', 'PC', '执法仪', '其它'];
const authority = ['/datemain/device'];

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, userSite, siteSelectChange } = props;
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
      title="添加设备"
      className={themeStyle.formModal}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <div className={themeStyle.formModalBody}>
        <FormItem labelCol={{ span: 5 }} hasFeedback wrapperCol={{ span: 15 }} label="设备名称">
          {form.getFieldDecorator('equipmentName', {
            rules: [{ required: true, message: '请输入设备名称！' }],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} hasFeedback wrapperCol={{ span: 15 }} label="设备编码">
          {form.getFieldDecorator('equipmentCode', {
            rules: [{ required: true, message: '请输入设备编码！' }],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} hasFeedback wrapperCol={{ span: 15 }} label="所属人员">
          {form.getFieldDecorator('userId', {
            rules: [{ required: true, message: '请输入所属人员！' }],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} hasFeedback wrapperCol={{ span: 15 }} label="站点">
          {form.getFieldDecorator('siteIndex', {
            rules: [{ required: true, message: '请选择站点！' }],
          })(
            <Select placeholder="请选择" style={{ width: '100%' }} onChange={siteSelectChange}>
              {userSite.map((item, index) => (
                <Option key={index} value={index}>
                  {item.name}
                </Option>
              ))}
            </Select>,
          )}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} hasFeedback wrapperCol={{ span: 15 }} label="设备类型">
          {form.getFieldDecorator('type', {
            rules: [{ required: true, message: '请选择设备类型！' }],
          })(
            <Select placeholder="请选择" style={{ width: '100%' }}>
              {type.map((item, index) => (
                <Option key={index} value={index + 1}>
                  {item}
                </Option>
              ))}
            </Select>,
          )}
        </FormItem>
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
    userSite,
    siteSelectChange,
    detail,
  } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleUpdate(fieldsValue);
    });
  };

  const getSiteName = code => {
    let siteName = '';
    for (let i = 0; i < userSite.length; i++) {
      if (code === userSite[i].code) {
        siteName = userSite[i].name;
        break;
      }
    }
    return siteName;
  };

  return (
    <Modal
      destroyOnClose
      title="编辑设备"
      className={themeStyle.formModal}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <div className={themeStyle.formModalBody}>
        <FormItem labelCol={{ span: 5 }} hasFeedback wrapperCol={{ span: 15 }} label="设备名称">
          {form.getFieldDecorator('equipmentName', {
            initialValue: detail.equipmentName,
            rules: [{ required: true, message: '请输入设备名称！' }],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} hasFeedback wrapperCol={{ span: 15 }} label="设备编码">
          {form.getFieldDecorator('equipmentCode', {
            initialValue: detail.equipmentCode,
            rules: [{ required: true, message: '请输入设备编码！' }],
          })(<Input disabled placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} hasFeedback wrapperCol={{ span: 15 }} label="所属人员">
          {form.getFieldDecorator('userId', {
            initialValue: detail.userId,
            rules: [{ required: true, message: '请输入所属人员！' }],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} hasFeedback wrapperCol={{ span: 15 }} label="站点">
          {form.getFieldDecorator('siteIndex', {
            initialValue: getSiteName(detail.siteCode),
            rules: [{ required: true, message: '请选择站点！' }],
          })(
            <Select placeholder="请选择" style={{ width: '100%' }} onChange={siteSelectChange}>
              {userSite.map((item, index) => (
                <Option key={index} value={index}>
                  {item.name}
                </Option>
              ))}
            </Select>,
          )}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} hasFeedback wrapperCol={{ span: 15 }} label="设备类型">
          {form.getFieldDecorator('type', {
            initialValue: parseInt(detail.type),
            rules: [{ required: true, message: '请选择设备类型！' }],
          })(
            <Select placeholder="请选择" style={{ width: '100%' }}>
              {type.map((item, index) => (
                <Option key={index} value={index + 1}>
                  {item}
                </Option>
              ))}
            </Select>,
          )}
        </FormItem>
      </div>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ system, LawenforDevice, loading }) => ({
  system,
  LawenforDevice,
  loading: loading.models.LawenforDevice,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    selectedRows: [],
    formValues: [],
    userSite: [],
    detail: {},
    fieldSite: [],
    pageBean: {
      page: 1,
      pageSize: 10,
      showTotal: true,
    },
  };

  columns = [
    {
      title: '设备名称',
      dataIndex: 'equipmentName',
    },
    {
      title: '设备编码',
      dataIndex: 'equipmentCode',
    },
    {
      title: '设备类型',
      dataIndex: 'type',
      render: val => type[parseInt(val) - 1],
    },
    {
      title: '站点名称',
      dataIndex: 'siteName',
    },
    {
      title: '所属人员',
      dataIndex: 'userId',
    },
    {
      title: '操作',
      width: 100,
      render: (text, record) => (
        <Fragment>
          <Fragment>
            <Tooltip placement="left" title="编辑">
              <Button
                onClick={() => this.showUpdateModal(record)}
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
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    if (!checkAuth(authority[0])) return;
    const { pageBean } = this.state;
    this.getList({ pageBean });
    this.getUserSite(1, res => {
      this.getUserSite(2, res2 => {
        this.setState({ userSite: res.concat(res2) });
      });
    });
  }

  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'LawenforDevice/fetch',
      payload: params,
    });
  };

  showUpdateModal = record => {
    this.setState({ detail: record, fieldSite: [record.siteCode, record.siteName] }, () => {
      this.handleUpdateModalVisible(true);
    });
  };

  batchDel = () => {
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
    });
  };

  dataDel = id => {
    this.delUtil(id);
  };

  delUtil = ids => {
    const { dispatch } = this.props;
    const { pageBean } = this.state;
    dispatch({
      type: 'LawenforDevice/remove',
      payload: { ids },
      callback: () => {
        this.setState({
          selectedRows: [],
        });
        this.getList({ pageBean });
      },
    });
  };

  getUserSite = (siteType, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'system/userSite',
      payload: {
        siteType,
      },
      callback: res => {
        const siteList = res.map((item, index) => {
          const key = Object.keys(item);
          return {
            index: index + 1,
            code: key[0],
            name: item[key[0]],
            direction: [item[key[1]], item[key[2]]],
          };
        });
        callback(siteList);
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
              operation: 'LIKE',
              relation: 'OR',
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
    if (!!!flag) {
      this.setState({
        detail: {},
      });
    }
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    const { pageBean, fieldSite } = this.state;
    fields.siteCode = fieldSite[0];
    fields.siteName = fieldSite[1];
    delete fields.siteIndex;
    dispatch({
      type: 'LawenforDevice/add',
      payload: fields,
      callback: () => {
        message.success('添加成功');
        setTimeout(() => {
          this.handleModalVisible();
          this.getList({ pageBean });
        }, 500);
      },
    });
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    const { pageBean, detail, fieldSite } = this.state;
    const arr = JSON.parse(JSON.stringify(detail));
    fields.id = detail.id;
    fields.siteCode = fieldSite[0];
    fields.siteName = fieldSite[1];
    delete fields.siteIndex;
    const keys = Object.keys(fields);
    for (let item in keys) {
      arr[keys[item]] = fields[keys[item]];
    }
    this.setState({ detail: arr });
    dispatch({
      type: 'LawenforDevice/update',
      payload: fields,
      callback: () => {
        message.success('编辑成功');
        setTimeout(() => {
          this.handleUpdateModalVisible();
          this.getList({ pageBean });
        }, 500);
      },
    });
  };

  siteSelectChange = e => {
    const { userSite } = this.state;
    this.setState({ fieldSite: [userSite[e].code, userSite[e].name] });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { userSite } = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 16, xl: 32 }}>
          <Col md={5} sm={24}>
            <div className={publicCss.inputMain}>
              <span
                style={{ width: '60px', lineHeight: '30px', height: '32px' }}
                className="ant-input-group-addon"
              >
                站点
              </span>
              <FormItem style={{ flex: 1 }}>
                {getFieldDecorator('siteCode')(
                  <Select className={publicCss.inputGroupLeftRadius} placeholder="请选择">
                    {userSite.map((item, index) => (
                      <Option key={index} value={item.code}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>,
                )}
              </FormItem>
            </div>
          </Col>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('equipmentName')(
                <Input addonBefore="设备名称" placeholder="请输入" />,
              )}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('equipmentCode')(
                <Input addonBefore="设备编码" placeholder="请输入" />,
              )}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
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
      LawenforDevice: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, userSite, updateModalVisible, detail } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      userSite: userSite,
      handleModalVisible: this.handleModalVisible,
      siteSelectChange: this.siteSelectChange,
    };

    const updateMethods = {
      handleUpdate: this.handleUpdate,
      userSite: userSite,
      detail: detail,
      handleModalVisible: this.handleUpdateModalVisible,
      siteSelectChange: this.siteSelectChange,
    };
    return (
      <Fragment>
        {checkAuth(authority[0]) ? null : <Redirect to="/exception/403" />}
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button type="danger" onClick={() => this.batchDel()}>
                    批量操作
                  </Button>
                </span>
              )}
            </div>
            <StandardTable
              size="middle"
              tableAlert={true}
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
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
