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
  DatePicker,
  message,
  Divider,
  Tooltip,
  Popconfirm,
  Badge,
  InputNumber,
  Radio,
  Select,
  Tag,
} from 'antd';
import { Redirect } from 'umi';

import StandardTable from '@/components/StandardTable';
import styles from '../../../style/style.less';
import publicCss from '../../../style/public.less';
import { checkAuth, checkPhone } from '@/utils/utils';
import themeStyle from '@/pages/style/theme.less';

const statusMap = ['warning', 'success', 'processing'];
const status = ['禁用', '正常', '维修中'];
const authority = [
  '/system/device',
  '/system/device/add',
  '/system/device/update',
  '/system/device/delete',
  '/system/device/equipmentLog',
];

const FormItem = Form.Item;

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, siteList, loading } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  const options = siteList.map((item, index) => (
    <Select.Option key={index} value={item.code}>
      {item.name}
    </Select.Option>
  ));

  return (
    <Modal
      destroyOnClose
      title="添加设备"
      visible={modalVisible}
      className={themeStyle.formModal}
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
            <FormItem hasFeedback label="设备名称">
              {form.getFieldDecorator('equipName', {
                rules: [{ required: true, message: '请输入设备名称！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="设备编码">
              {form.getFieldDecorator('equipCode', {
                rules: [{ required: true, message: '请输入设备编码' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="站点">
              {form.getFieldDecorator('siteCode', {
                rules: [{ required: true, message: '请选择站点！' }],
              })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  {options}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="设备责任人">
              {form.getFieldDecorator('reponsiblePerson', {
                rules: [{ required: true, message: '请输入设备责任人！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="维修次数">
              {form.getFieldDecorator('repairNum', {})(
                <InputNumber placeholder="请输入" min={0} style={{ width: '100%' }} />,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="生产厂家">
              {form.getFieldDecorator('manuFactor', {
                rules: [{ required: true, message: '请输入生产厂家！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="厂家联系方式">
              {form.getFieldDecorator('manufactorTel', {
                rules: [{ message: '请输入厂家联系方式！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="检定时间">
              {form.getFieldDecorator('checkTime', {})(
                <DatePicker style={{ width: '100%' }} showTime />,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="状态">
              {form.getFieldDecorator('status', {
                rules: [{ required: true, message: '请选择状态！' }],
              })(
                <Radio.Group style={{ width: '100%' }}>
                  <Radio value="0">禁用</Radio>
                  <Radio value="1">正常</Radio>
                  <Radio value="2">维修中</Radio>
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
  const { modalVisible, form, handleUpdate, handleModalVisible, siteList, detail, loading } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleUpdate(fieldsValue);
    });
  };
  const options = siteList.map(item => (
    <Select.Option key={item.code} value={item.code}>
      {item.name}
    </Select.Option>
  ));
  const check = checkAuth(authority[2]);
  const footer = check
    ? {
        footer: [
          <Button key="back" onClick={() => handleModalVisible()}>
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
      title={check ? '编辑设备' : '设备详情'}
      className={themeStyle.formModal}
      visible={modalVisible}
      onCancel={() => handleModalVisible()}
      width={800}
      {...footer}
    >
      <div className={themeStyle.formModalBody}>
        <Row gutter={40}>
          <Col md={12} sm={24}>
            <FormItem hasFeedback={check} label="设备名称">
              {form.getFieldDecorator('equipName', {
                initialValue: detail.equipName,
                rules: [{ required: true, message: '请输入设备名称！' }],
              })(<Input disabled={!check} style={style} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback={check} label="设备编码">
              {form.getFieldDecorator('equipCode', {
                initialValue: detail.equipCode,
                rules: [{ required: true, message: '请输入设备编码' }],
              })(<Input disabled style={style} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback={check} label="站点">
              {form.getFieldDecorator('siteCode', {
                initialValue: detail.siteCode,
                rules: [{ required: true, message: '请选择站点！' }],
              })(
                <Select disabled={!check} placeholder="请选择" style={{ width: '100%', ...style }}>
                  {options}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback={check} label="设备责任人">
              {form.getFieldDecorator('reponsiblePerson', {
                initialValue: detail.reponsiblePerson,
                rules: [{ required: true, message: '请输入设备责任人！' }],
              })(<Input disabled={!check} style={style} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="维修次数">
              {form.getFieldDecorator('repairNum', {
                initialValue: detail.repairNum,
              })(
                <InputNumber
                  min={0}
                  disabled={!check}
                  placeholder="请输入"
                  style={{ width: '100%', ...style }}
                />,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback={check} label="生产厂家">
              {form.getFieldDecorator('manuFactor', {
                initialValue: detail.manuFactor,
                rules: [{ required: true, message: '请输入生产厂家！' }],
              })(<Input disabled={!check} style={style} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="厂家联系方式">
              {form.getFieldDecorator('manufactorTel', {
                initialValue: detail.manufactorTel,
                rules: [{ message: '请输入厂家联系方式！' }],
              })(<Input disabled={!check} style={style} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="检定时间">
              {form.getFieldDecorator('checkTime', {
                initialValue: moment(new Date(detail.checkTime || null), 'YYYY-MM-DD HH:mm:ss'),
              })(<DatePicker disabled={!check} style={{ width: '100%', ...style }} showTime />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback={check} label="状态">
              {form.getFieldDecorator('status', {
                initialValue: detail.status,
                rules: [{ required: true, message: '请选择状态！' }],
              })(
                <Radio.Group disabled={!check} style={{ width: '100%', ...style }}>
                  <Radio value="0">禁用</Radio>
                  <Radio value="1">正常</Radio>
                  <Radio value="2">维修中</Radio>
                </Radio.Group>,
              )}
            </FormItem>
          </Col>
        </Row>
      </div>
    </Modal>
  );
});

// 维修记录
const LogListModal = Form.create()(props => {
  const {
    modalVisible,
    form,
    handleModalVisible,
    data,
    loading,
    handleLogAddModalVisible,
    handleStandardTableChange,
    showLogUpdateModal,
    dataLogDel,
    selectedRows,
    handleSelectRows,
    delLogBatch,
  } = props;
  const columns = [
    {
      title: '维修原因',
      dataIndex: 'repairReson',
    },
    {
      title: '维修人',
      dataIndex: 'repairPerson',
    },
    {
      title: '维修人联系方式',
      dataIndex: 'repairTel',
    },
    {
      title: '维修时间(h)',
      dataIndex: 'repairDate',
    },
    {
      title: '维修内容',
      dataIndex: 'repairContent',
      width: 300,
      render: val =>
        val ? (
          val.length > 15 ? (
            <Tooltip title={val}>
              <a>{`${val.substr(0, 15)}.......`}</a>
            </Tooltip>
          ) : (
            val
          )
        ) : (
          ''
        ),
    },
    {
      title: '操作',
      width: '90px',
      render: (text, record) => (
        <Fragment>
          <Tooltip placement="left" title="编辑">
            <Button
              onClick={() => showLogUpdateModal(record)}
              type="primary"
              shape="circle"
              icon="edit"
              size="small"
            />
          </Tooltip>
          <Divider type="vertical" />
          <Popconfirm
            title="是否删除数据?"
            onConfirm={() => dataLogDel(record.id)}
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

  return (
    <Modal
      destroyOnClose
      title="维修记录"
      visible={modalVisible}
      className={themeStyle.myModal}
      onCancel={() => handleModalVisible()}
      footer={null}
      width="1000px"
    >
      <div className={styles.tableList}>
        <div className={styles.tableListOperator}>
          <Button onClick={() => handleLogAddModalVisible(true)} icon="plus" type="primary">
            新增记录
          </Button>
          {selectedRows.length > 0 && (
            <Button type="danger" onClick={() => delLogBatch()}>
              批量删除
            </Button>
          )}
        </div>
        <StandardTable
          tableAlert={true}
          selectedRows={selectedRows}
          loading={loading}
          data={data}
          size="middle"
          columns={columns}
          onSelectRow={handleSelectRows}
          onChange={handleStandardTableChange}
        />
      </div>
    </Modal>
  );
});

const LogAddModal = Form.create()(props => {
  const { modalVisible, form, handleModalVisible, handleLogAdd, loading } = props;

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleLogAdd(fieldsValue);
    });
  };

  return (
    <Modal
      destroyOnClose
      title="添加维修记录"
      onOk={okHandle}
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
        <FormItem
          labelCol={{ span: 6 }}
          hasFeedback
          wrapperCol={{ span: 15 }}
          label="维修所需时间/h"
        >
          {form.getFieldDecorator('repairDate', {
            rules: [{ required: true, message: '请输入维修所需时间！' }],
          })(<InputNumber style={{ width: '100%' }} min={0} placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 6 }} hasFeedback wrapperCol={{ span: 15 }} label="维修人">
          {form.getFieldDecorator('repairPerson', {
            rules: [{ required: true, message: '请输入维修人！' }],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem
          labelCol={{ span: 6 }}
          hasFeedback
          wrapperCol={{ span: 15 }}
          label="维修人联系方式"
        >
          {form.getFieldDecorator('repairTel', {
            rules: [
              {
                validator: checkPhone,
              },
            ],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 6 }} hasFeedback wrapperCol={{ span: 15 }} label="维修原因">
          {form.getFieldDecorator('repairReson', {
            rules: [{ required: true, message: '请输入维修原因！' }],
          })(<Input.TextArea placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="维修内容">
          {form.getFieldDecorator('repairContent', {
            rules: [{ message: '请输入维修内容！' }],
          })(<Input.TextArea placeholder="请输入" />)}
        </FormItem>
      </div>
    </Modal>
  );
});

const LogUpdateModal = Form.create()(props => {
  const { modalVisible, form, handleModalVisible, handleLogUpdate, detail, loading } = props;

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleLogUpdate(fieldsValue);
    });
  };

  return (
    <Modal
      destroyOnClose
      title="编辑维修记录"
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
        <FormItem
          labelCol={{ span: 6 }}
          hasFeedback
          wrapperCol={{ span: 15 }}
          label="维修所需时间/h"
        >
          {form.getFieldDecorator('repairDate', {
            initialValue: detail.repairDate,
            rules: [{ required: true, message: '请输入维修所需时间！' }],
          })(<InputNumber min={0} style={{ width: '100%' }} placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 6 }} hasFeedback wrapperCol={{ span: 15 }} label="维修人">
          {form.getFieldDecorator('repairPerson', {
            initialValue: detail.repairPerson,
            rules: [{ required: true, message: '请输入维修人！' }],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem
          labelCol={{ span: 6 }}
          hasFeedback
          wrapperCol={{ span: 15 }}
          label="维修人联系方式"
        >
          {form.getFieldDecorator('repairTel', {
            initialValue: detail.repairTel,
            rules: [
              {
                validator: checkPhone,
              },
            ],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 6 }} hasFeedback wrapperCol={{ span: 15 }} label="维修原因">
          {form.getFieldDecorator('repairReson', {
            initialValue: detail.repairReson,
            rules: [{ required: true, message: '请输入维修原因！' }],
          })(<Input.TextArea placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="维修内容">
          {form.getFieldDecorator('repairContent', {
            initialValue: detail.repairContent,
            rules: [{ message: '请输入维修内容！' }],
          })(<Input.TextArea placeholder="请输入" />)}
        </FormItem>
      </div>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ system, Device, loading }) => ({
  system,
  Device,
  loading: loading.models.Device,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    logListModalVisible: false,
    logAddModalVisible: false,
    logUpdateModalVisible: false,
    selectedRows: [],
    logSelectedRows: [],
    formValues: [],
    siteList: [],
    detail: {},
    logDetail: {},
    logQuery: {},
    equipmentId: '',
    pageBean: {
      page: 1,
      pageSize: 10,
      showTotal: true,
    },
  };

  columns = [
    {
      title: '设备编码',
      dataIndex: 'equipCode',
    },
    {
      title: '设备名称',
      dataIndex: 'equipName',
    },
    {
      title: '设备责任人',
      dataIndex: 'reponsiblePerson',
    },
    {
      title: '站点',
      dataIndex: 'siteName',
    },
    {
      title: '检定时间',
      width: 170,
      dataIndex: 'checkTime',
      render: val => (new Date() > new Date(val) ? <Tag color="#f50">{val}</Tag> : val),
    },
    {
      title: '维修次数',
      dataIndex: 'repairNum',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: val => <Badge status={statusMap[val]} text={status[val]} />,
    },
    {
      title: '操作',
      width: 130,
      render: (text, record) => (
        <Fragment>
          {checkAuth(authority[4]) ? (
            <Fragment>
              <Tooltip placement="left" title="维修记录">
                <Button
                  onClick={() => this.showLogModal(record.equipCode)}
                  type="primary"
                  shape="circle"
                  icon="table"
                  size="small"
                />
              </Tooltip>
              <Divider type="vertical" />
            </Fragment>
          ) : null}

          {checkAuth(authority[2]) ? (
            <Tooltip placement="left" title="编辑">
              <Button
                onClick={() => this.showUpdateModal(record.id)}
                type="primary"
                shape="circle"
                icon="edit"
                size="small"
              />
            </Tooltip>
          ) : (
            <Tooltip placement="left" title="详情">
              <Button
                onClick={() => this.showUpdateModal(record.id)}
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

  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Device/fetch',
      payload: params,
    });
  };

  getLogList = (params, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Device/fetchLog',
      payload: params,
      callback: () => {
        callback && callback();
      },
    });
  };

  showLogModal = code => {
    const { pageBean } = this.state;
    const logQuery = {
      property: 'equipmentId',
      value: code,
      group: 'main',
      operation: 'EQUAL',
      relation: 'AND',
    };
    this.setState({ logQuery: logQuery });
    this.getLogList(
      {
        pageBean,
        querys: [logQuery],
      },
      () => {
        this.setState({ equipmentId: code });
        this.handleLogModalVisible(true);
      },
    );
  };

  showUpdateModal = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Device/detail',
      payload: { id },
      callback: res => {
        this.setState({ detail: res });
        this.handleUpdateModalVisible(true);
      },
    });
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

  dataDel = id => {
    this.delUtil(id);
  };

  delUtil = ids => {
    const { pageBean } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'Device/remove',
      payload: {
        ids: ids,
      },
      callback: () => {
        message.success('删除成功');
        setTimeout(() => this.getList({ pageBean }), 100);
        this.setState({
          selectedRows: [],
        });
      },
    });
  };

  componentDidMount() {
    if (!checkAuth(authority[0])) return;
    const { pageBean } = this.state;
    const { dispatch } = this.props;
    this.getList({ pageBean });
    dispatch({
      type: 'system/userSite',
      payload: {
        siteType: 1,
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
        this.setState({ siteList });
      },
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const params = {
      pageBean: {
        page: pagination.current,
        pageSize: pagination.pageSize,
        showTotal: true,
      },
      querys: formValues,
    };

    dispatch({
      type: 'Device/fetch',
      payload: params,
    });
  };

  handleLogTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { logQuery } = this.state;
    const params = {
      pageBean: {
        page: pagination.current,
        pageSize: pagination.pageSize,
        showTotal: true,
      },
      querys: [logQuery],
    };

    dispatch({
      type: 'Device/fetchLog',
      payload: params,
    });
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

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
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
              operation: item === 'organCode' ? 'EQUAL' : 'LIKE',
              relation: 'OR',
            }
          : '';
      });
      let conditionFilter = condition.filter(item => item);
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
  };

  handleLogModalVisible = flag => {
    this.setState({
      logListModalVisible: !!flag,
    });
  };

  handleLogAddModalVisible = flag => {
    this.setState({
      logAddModalVisible: !!flag,
    });
  };

  handleLogUpdateModalVisible = flag => {
    this.setState({
      logUpdateModalVisible: !!flag,
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    const { pageBean, siteList } = this.state;
    for (let i = 0; i < siteList.length; i++) {
      if (siteList[i].code === fields.siteCode) {
        fields.siteName = siteList[i].name;
        break;
      }
    }
    fields.checkTime = moment(fields.checkTime).format('YYYY-MM-DD HH:mm:ss');
    dispatch({
      type: 'Device/add',
      payload: fields,
      callback: () => {
        this.getList({ pageBean });
        message.success('添加成功');
        this.handleModalVisible();
      },
    });
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    const { pageBean, siteList, detail } = this.state;
    for (let i = 0; i < siteList.length; i++) {
      if (siteList[i].code === fields.siteCode) {
        fields.siteName = siteList[i].name;
        break;
      }
    }
    fields.id = detail.id;
    fields.checkTime = moment(fields.checkTime).format('YYYY-MM-DD HH:mm:ss');
    this.setState({ detail: fields });
    dispatch({
      type: 'Device/update',
      payload: fields,
      callback: () => {
        message.success('编辑成功');
        this.handleUpdateModalVisible();
        setTimeout(() => this.getList({ pageBean }), 100);
        this.setState({ detail: {} });
      },
    });
  };

  // 维修记录
  handleLogAdd = fields => {
    const { dispatch } = this.props;
    const { pageBean, equipmentId, logQuery } = this.state;
    fields.equipmentId = equipmentId;
    dispatch({
      type: 'Device/addLog',
      payload: fields,
      callback: () => {
        this.getLogList({
          pageBean,
          querys: [logQuery],
        });
        this.handleLogAddModalVisible();
      },
    });
  };

  handleLogUpdate = fields => {
    const { dispatch } = this.props;
    const { pageBean, logQuery, logDetail } = this.state;
    fields.id = logDetail.id;
    fields.equipmentId = logDetail.equipmentId;
    dispatch({
      type: 'Device/updateLog',
      payload: fields,
      callback: () => {
        this.getLogList({
          pageBean,
          querys: [logQuery],
        });
        this.handleLogUpdateModalVisible(false);
        setTimeout(() => {
          this.setState({
            logDetail: {},
          });
        }, 50);
      },
    });
  };

  handleLogSelectRows = rows => {
    this.setState({
      logSelectedRows: rows,
    });
  };

  showLogUpdateModal = res => {
    this.handleLogUpdateModalVisible(true);
    this.setState({ logDetail: res });
  };

  dataLogDel = id => {
    this.logDelUtil(id);
  };

  delLogBatch = () => {
    const { logSelectedRows } = this.state;
    if (!logSelectedRows) return;
    const self = this;
    Modal.confirm({
      title: '批量删除',
      content: '您确定要批量删除吗?',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        self.logDelUtil(logSelectedRows.map(item => item.id).join());
      },
      onCancel() {},
    });
  };

  logDelUtil = ids => {
    const { dispatch } = this.props;
    const { pageBean, logQuery } = this.state;
    dispatch({
      type: 'Device/removeLog',
      payload: {
        ids: ids,
      },
      callback: () => {
        this.getLogList({ pageBean, querys: [logQuery] });
        this.setState({ logSelectedRows: [] });
      },
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { siteList } = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 16, xl: 16 }}>
          <Col md={6} sm={24}>
            <FormItem>
              {getFieldDecorator('equipName')(
                <Input addonBefore="设备名称" placeholder="请输入" />,
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <div className={publicCss.inputMain}>
              <span
                style={{ width: '20%', lineHeight: '30px', height: '32px' }}
                className="ant-input-group-addon"
              >
                站点
              </span>
              <FormItem style={{ flex: 1 }}>
                {getFieldDecorator('siteCode')(
                  <Select className={publicCss.inputGroupLeftRadius} placeholder="请选择">
                    {siteList.map((item, index) => (
                      <Select.Option value={item.code} key={index}>
                        {item.name}
                      </Select.Option>
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
      Device: { data, logData },
      loading,
    } = this.props;
    const {
      selectedRows,
      modalVisible,
      siteList,
      updateModalVisible,
      detail,
      logDetail,
      logListModalVisible,
      logAddModalVisible,
      logSelectedRows,
      logUpdateModalVisible,
    } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      siteList,
      loading,
    };
    const updateMethods = {
      loading,
      handleUpdate: this.handleUpdate,
      handleModalVisible: this.handleUpdateModalVisible,
      siteList,
      detail,
    };
    const logMethods = {
      data: logData,
      loading,
      handleLogAddModalVisible: this.handleLogAddModalVisible,
      handleModalVisible: this.handleLogModalVisible,
      handleStandardTableChange: this.handleLogTableChange,
      dataLogDel: this.dataLogDel,
      handleSelectRows: this.handleLogSelectRows,
      selectedRows: logSelectedRows,
      delLogBatch: this.delLogBatch,
      showLogUpdateModal: this.showLogUpdateModal,
    };
    const logAddMethods = {
      handleModalVisible: this.handleLogAddModalVisible,
      handleLogAdd: this.handleLogAdd,
      loading,
    };
    const logUpdateMethods = {
      handleModalVisible: this.handleLogUpdateModalVisible,
      detail: logDetail,
      loading,
      handleLogUpdate: this.handleLogUpdate,
    };

    const tabConfig = {
      loading,
      data,
      size: 'middle',
      columns: this.columns,
      onChange: this.handleStandardTableChange,
    };

    return (
      <Fragment>
        {checkAuth(authority[0]) ? '' : <Redirect to="/exception/403" />}
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
                <span>
                  <Button type="danger" onClick={() => this.delBatch()}>
                    批量删除
                  </Button>
                </span>
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
        {/* 维修记录 */}
        {logListModalVisible ? (
          <LogListModal {...logMethods} modalVisible={logListModalVisible} />
        ) : null}
        {logListModalVisible ? (
          <LogAddModal {...logAddMethods} modalVisible={logAddModalVisible} />
        ) : null}
        {logListModalVisible && JSON.stringify(logDetail) !== '{}' ? (
          <LogUpdateModal {...logUpdateMethods} modalVisible={logUpdateModalVisible} />
        ) : null}
      </Fragment>
    );
  }
}

export default TableList;
