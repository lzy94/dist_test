import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  InputNumber,
  Button,
  Modal,
  message,
  Divider,
  Tooltip,
  Popconfirm,
  TreeSelect,
  Spin,
  Tree,
} from 'antd';
import { Redirect } from 'umi';
import StandardTable from '@/components/StandardTable';
import { checkAuth, checkPhone, checkLatitude, checkLongitude } from '@/utils/utils';

import styles from '../../../style/style.less';
import themeStyle from '@/pages/style/theme.less';

const FormItem = Form.Item;

const authority = [
  '/datemain/source',
  '/datemain/source/addSource',
  '/datemain/source/update',
  '/datemain/source/deleteSource',
];

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, treeList, cascaderChange } = props;
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
      title="新增源头企业"
      visible={modalVisible}
      className={themeStyle.formModal}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      width={800}
    >
      <div className={themeStyle.formModalBody}>
        <Row gutter={40}>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="企业名称">
              {form.getFieldDecorator('companyName', {
                rules: [{ required: true, message: '请输入企业名称' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="企业编码">
              {form.getFieldDecorator('siteCode', {
                rules: [{ required: true, message: '请输入企业编码' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="企业联系人">
              {form.getFieldDecorator('contactMan', {
                rules: [{ message: '请输入企业联系人' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="企业号码">
              {form.getFieldDecorator('companyTel', {
                rules: [{ message: '请输入企业号码', validator: checkPhone }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="监管单位">
              {form.getFieldDecorator('supervisionCompany', {
                rules: [{ message: '请输入监管单位' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="监管责任人">
              {form.getFieldDecorator('supervisionMan', {
                rules: [{ message: '请输入监管责任人' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="监管人电话">
              {form.getFieldDecorator('supervisionTel', {
                rules: [{ message: '请输入监管人联系方式', validator: checkPhone }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="年货运吞吐量">
              {form.getFieldDecorator('throughput', {
                rules: [{ message: '请输入年货运吞吐量', type: 'number' }],
              })(<InputNumber style={{ width: '100%' }} min={0} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="所在道路">
              {form.getFieldDecorator('whereLoad', {
                rules: [{ message: '请输入所在道路' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="经度">
              {form.getFieldDecorator('longitude', {
                rules: [{ message: '请输入经度', validator: checkLatitude }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="纬度">
              {form.getFieldDecorator('latitude', {
                rules: [{ message: '请输入纬度', validator: checkLongitude }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="行政区域">
              {form.getFieldDecorator('organId', {
                rules: [{ required: true, message: '请选择行政区域' }],
              })(<TreeSelect treeData={treeList} style={{ width: '100%' }} placeholder="请选择" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="企业地址">
              {form.getFieldDecorator('address', {
                rules: [{ required: true, message: '企业地址' }],
              })(<Input.TextArea placeholder="请输入" />)}
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
    treeList,
    cascaderChange,
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
  const footer = check ? {} : { footer: null };
  const style = check
    ? {}
    : {
        color: 'rgba(0,0,0,.7)',
        border: 0,
      };
  return (
    <Modal
      destroyOnClose
      title={checkAuth(authority[2]) ? '编辑源头企业' : '源头企业详情'}
      visible={modalVisible}
      className={themeStyle.formModal}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      width={800}
      {...footer}
    >
      <div className={themeStyle.formModalBody}>
        <Row gutter={40}>
          <Col md={12} sm={24}>
            <FormItem hasFeedback={check} label="企业名称">
              {form.getFieldDecorator('companyName', {
                initialValue: detail.companyName,
                rules: [{ required: true, message: '请输入企业名称' }],
              })(<Input disabled={!check} style={style} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback={check} label="企业编码">
              {form.getFieldDecorator('siteCode', {
                initialValue: detail.siteCode,
                rules: [{ required: true, message: '请输入企业编码' }],
              })(<Input disabled={!check} style={style} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="企业联系人">
              {form.getFieldDecorator('contactMan', {
                initialValue: detail.contactMan,
                rules: [{ message: '请输入企业联系人' }],
              })(<Input disabled={!check} style={style} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="企业号码">
              {form.getFieldDecorator('companyTel', {
                initialValue: detail.companyTel,
                rules: [{ message: '请输入企业号码', validator: checkPhone }],
              })(<Input disabled={!check} style={style} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="监管单位">
              {form.getFieldDecorator('supervisionCompany', {
                initialValue: detail.supervisionCompany,
                rules: [{ message: '请输入监管单位' }],
              })(<Input disabled={!check} style={style} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="监管责任人">
              {form.getFieldDecorator('supervisionMan', {
                initialValue: detail.supervisionCompany,
                rules: [{ message: '请输入监管责任人' }],
              })(<Input disabled={!check} style={style} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="监管人电话">
              {form.getFieldDecorator('supervisionTel', {
                initialValue: detail.supervisionTel,
                rules: [{ message: '请输入监管人联系方式', validator: checkPhone }],
              })(<Input disabled={!check} style={style} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="年货运吞吐量">
              {form.getFieldDecorator('throughput', {
                initialValue: detail.throughput,
                rules: [{ message: '请输入年货运吞吐量', type: 'number' }],
              })(
                <InputNumber
                  min={0}
                  disabled={!check}
                  style={{ ...style, width: '100%' }}
                  placeholder="请输入"
                />,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="所在道路">
              {form.getFieldDecorator('whereLoad', {
                initialValue: detail.whereLoad,
                rules: [{ message: '请输入所在道路' }],
              })(<Input disabled={!check} style={style} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="经度">
              {form.getFieldDecorator('longitude', {
                initialValue: detail.longitude,
                rules: [{ message: '请输入经度', validator: checkLongitude }],
              })(<Input disabled={!check} style={style} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="纬度">
              {form.getFieldDecorator('latitude', {
                initialValue: detail.latitude,
                rules: [{ message: '请输入纬度', validator: checkLatitude }],
              })(<Input disabled={!check} style={style} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback={check} label="行政区域">
              {form.getFieldDecorator('organId', {
                initialValue: detail.organId ? [detail.organId] : [],
                rules: [{ required: true, message: '请选择行政区域' }],
              })(
                <TreeSelect
                  disabled={!check}
                  treeData={treeList}
                  style={{ width: '100%', ...style }}
                  placeholder="请选择"
                />,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback={check} label="企业地址">
              {form.getFieldDecorator('address', {
                initialValue: detail.address,
                rules: [{ required: true, message: '企业地址' }],
              })(<Input.TextArea disabled={!check} style={style} placeholder="请输入" />)}
            </FormItem>
          </Col>
        </Row>
      </div>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ system, Source, loading, user }) => ({
  system,
  Source,
  currentUser: user.currentUser,
  loading: loading.models.Source,
  systemLoading: loading.models.system,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: [],
    formValues: [],
    expandCheckKeys: [],
    orangValue: '',
    treeFormValue: {},
    selectedKeys: [],
    updateModalVisible: false,
    detail: {},
    pageBean: {
      page: 1,
      pageSize: 10,
      showTotal: true,
    },
  };

  columns = [
    {
      title: '企业编码',
      dataIndex: 'siteCode',
    },
    {
      title: '企业名称',
      dataIndex: 'companyName',
    },
    {
      title: '企业电话',
      dataIndex: 'companyTel',
    },
    {
      title: '地址',
      dataIndex: 'address',
      render: val =>
        val.length > 12 ? <Tooltip title={val}>{val.substring(0, 12) + '...'}</Tooltip> : val,
    },
    {
      title: '联系人',
      dataIndex: 'contactMan',
    },
    {
      title: '年货运吞吐量',
      dataIndex: 'throughput',
    },
    {
      title: '监管责任单位',
      dataIndex: 'supervisionCompany',
    },
    {
      title: '监管责任人',
      dataIndex: 'supervisionMan',
    },
    {
      title: '监管电话',
      dataIndex: 'supervisionTel',
    },
    {
      title: '操作',
      width: checkAuth(authority[3]) ? 100 : 70,
      render: (text, record) => (
        <Fragment>
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

  showUpdateModal = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Source/detail',
      payload: id,
      callback: res => {
        this.setState({ detail: res });
        this.handleUpdateModalVisible(true);
      },
    });
  };

  dataDel = id => {
    const { dispatch } = this.props;
    const { pageBean } = this.state;
    dispatch({
      type: 'Source/remove',
      payload: {
        remove: { id: id },
        query: {
          pageBean,
        },
      },
    });
  };

  componentDidMount() {
    if (!checkAuth(authority[0])) return;
    const { dispatch } = this.props;
    const { pageBean } = this.state;
    const organId = localStorage.getItem('organId');
    dispatch({
      type: 'Source/fetch',
      payload: {
        pageBean,
        querys: [
          {
            property: 'organId',
            value: organId,
            group: 'main',
            operation: 'RIGHT_LIKE',
            relation: 'AND',
          },
        ],
      },
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch, currentUser } = this.props;
    const { formValues, treeFormValue } = this.state;
    let arr = [];
    if (JSON.stringify(treeFormValue) !== '{}') {
      arr.push(treeFormValue);
    } else {
      arr.unshift({
        property: 'organId',
        value: currentUser.organId,
        group: 'main',
        operation: 'RIGHT_LIKE',
        relation: 'AND',
      });
    }
    const params = {
      pageBean: {
        page: pagination.current,
        pageSize: pagination.pageSize,
        showTotal: true,
      },
      querys: arr.concat(formValues),
    };

    dispatch({
      type: 'Source/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch, currentUser } = this.props;
    const { pageBean } = this.state;
    form.resetFields();
    this.setState({
      formValues: [],
      expandCheckKeys: [],
      selectedKeys: [],
    });
    dispatch({
      type: 'Source/fetch',
      payload: {
        pageBean,
        querys: [
          {
            property: 'organId',
            value: currentUser.organId,
            group: 'main',
            operation: 'RIGHT_LIKE',
            relation: 'AND',
          },
        ],
      },
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form, currentUser } = this.props;
    const { pageBean, treeFormValue } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const objKeys = Object.keys(fieldsValue);
      // 重新格式化条件数组
      const condition = objKeys.map(item => {
        return fieldsValue[item]
          ? {
              property: item,
              value: fieldsValue[item],
              group: 'main',
              operation: 'LIKE',
              relation: 'OR',
            }
          : '';
      });
      const conditionFilter = condition.filter(item => item);
      this.setState({
        formValues: JSON.parse(JSON.stringify(conditionFilter)),
      });
      if (JSON.stringify(treeFormValue) !== '{}') {
        conditionFilter.push(treeFormValue);
      } else {
        conditionFilter.unshift({
          property: 'organId',
          value: currentUser.organId,
          group: 'main',
          operation: 'RIGHT_LIKE',
          relation: 'AND',
        });
      }
      dispatch({
        type: 'Source/fetch',
        payload: {
          pageBean,
          querys: conditionFilter,
        },
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
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    const { pageBean, orangValue } = this.state;
    dispatch({
      type: 'Source/add',
      payload: {
        add: fields,
        query: { pageBean },
      },
      callback: () => {
        message.success('添加成功');
        this.handleModalVisible();
      },
    });
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    const { pageBean, detail } = this.state;
    const newData = JSON.parse(JSON.stringify(detail));
    const keys = Object.keys(fields);
    if (typeof fields.organId === 'object') {
      fields.organId = fields.organId.join();
    }
    for (let i = 0; i < keys.length; i++) {
      newData[keys[i]] = fields[keys[i]];
    }
    this.setState({
      detail: newData,
    });

    dispatch({
      type: 'Source/update',
      payload: {
        update: newData,
        query: { pageBean },
      },
      callback: () => {
        message.success('编辑成功');
        this.handleUpdateModalVisible();
      },
    });
  };

  cascaderChange = (value, selectedOptions) => {
    // this.setState({
    //     orangValue: selectedOptions.map(item => item.title).join()
    // })
  };

  /**
   * 树形选择
   * @param selectedKeys
   * @param info
   */
  onSelect = (selectedKeys, info) => {
    if (!selectedKeys[0]) return;
    this.setState({ selectedKeys: selectedKeys });
    const { dispatch } = this.props;
    const { formValues, pageBean } = this.state;
    let arr = [];
    const treeFormValue = {
      property: 'organId',
      value: selectedKeys[0],
      group: 'main',
      operation: 'RIGHT_LIKE',
      relation: 'OR',
    };
    this.setState({ treeFormValue: treeFormValue });
    arr.push(treeFormValue);
    arr = arr.concat(formValues);
    dispatch({
      type: 'Source/fetch',
      payload: {
        pageBean,
        querys: arr,
      },
    });
  };

  expandCheck = keys => {
    this.setState({ expandCheckKeys: keys });
  };

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <Tree.TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </Tree.TreeNode>
        );
      }
      return <Tree.TreeNode {...item} />;
    });

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 16, xl: 16 }}>
          <Col md={5} sm={12}>
            <FormItem>
              {getFieldDecorator('siteCode')(<Input addonBefore="企业编码" placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={5} sm={12}>
            <FormItem>
              {getFieldDecorator('companyName')(
                <Input addonBefore="企业名称" placeholder="请输入" />,
              )}
            </FormItem>
          </Col>
          <Col md={5} sm={12}>
            <FormItem>
              {getFieldDecorator('address')(<Input addonBefore="地址" placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={5} sm={12}>
            <FormItem>
              {getFieldDecorator('throughput')(
                <Input addonBefore="年货运吞吐量" placeholder="请输入" />,
              )}
            </FormItem>
          </Col>
          <Col md={4} sm={12}>
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
      system: { treeList },
      Source: { data },
      loading,
      systemLoading,
    } = this.props;
    const {
      selectedRows,
      modalVisible,
      updateModalVisible,
      detail,
      expandCheckKeys,
      selectedKeys,
    } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      cascaderChange: this.cascaderChange,
      treeList,
    };
    const updateMethods = {
      handleUpdate: this.handleUpdate,
      handleModalVisible: this.handleUpdateModalVisible,
      cascaderChange: this.cascaderChange,
      treeList,
      detail,
    };
    return (
      <Fragment>
        {checkAuth(authority[0]) ? null : <Redirect to="/exception/403" />}

        <div className={styles.tableMain}>
          <Spin spinning={systemLoading}>
            <div className={styles.treeLeft}>
              <Tree
                selectedKeys={selectedKeys}
                showLine
                onSelect={this.onSelect}
                expandedKeys={
                  expandCheckKeys[0] ? expandCheckKeys : [treeList[0] ? treeList[0].key : '']
                }
                onExpand={this.expandCheck}
              >
                {this.renderTreeNodes(treeList)}
              </Tree>
            </div>
          </Spin>
          <div className={styles.rightTable}>
            <Card bordered={false} style={{ height: '100%' }}>
              <div className={styles.tableList}>
                <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
                <div className={styles.tableListOperator}>
                  {checkAuth(authority[1]) ? (
                    <Button
                      icon="plus"
                      type="primary"
                      onClick={() => this.handleModalVisible(true)}
                    >
                      新建
                    </Button>
                  ) : null}
                  {selectedRows.length > 0 && <Button>批量操作</Button>}
                </div>
                <StandardTable
                  selectedRows={selectedRows}
                  rowSelection={null}
                  loading={loading}
                  data={data}
                  tableAlert={false}
                  size="middle"
                  columns={this.columns}
                  onSelectRow={this.handleSelectRows}
                  onChange={this.handleStandardTableChange}
                />
              </div>
            </Card>
          </div>
        </div>

        {checkAuth(authority[1]) ? (
          <CreateForm {...parentMethods} modalVisible={modalVisible} />
        ) : null}
        {updateModalVisible && JSON.stringify(detail) !== '{}' ? (
          <UpdateForm {...updateMethods} modalVisible={updateModalVisible} />
        ) : null}
      </Fragment>
    );
  }
}

export default TableList;
