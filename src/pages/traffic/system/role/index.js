import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Icon,
  Spin,
  Button,
  Modal,
  message,
  Divider,
  Table,
  TreeSelect,
  Switch,
  Tree,
  Popconfirm,
  Dropdown,
  Menu,
  Checkbox,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import { checkAuth, formatTreeList, getPlan, multipleCheckAuth } from '@/utils/utils';
import { Redirect } from 'umi';

import styles from '../../../style/style.less';
import themeStyle from '@/pages/style/theme.less';

const allAuthority = [
  '/system/role',
  '/system/role/addRole',
  '/system/role/updateRole',
  '/system/role/deleteRoleByIds',
  '/system/role/menu',
  '/system/role/user',
  '/conserve/data/role',
  '/conserve/data/role/add',
  '/conserve/data/role/update',
  '/conserve/data/role/delete',
  '/conserve/data/role/user',
  '/conserve/data/role/menu',
  '/maritime/data/role',
  '/maritime/data/role/add',
  '/maritime/data/role/update',
  '/maritime/data/role/delete',
  '/maritime/data/role/user',
  '/maritime/data/role/menu',
  '/transport/system/role',
  '/transport/system/role/add',
  '/transport/system/role/update',
  '/transport/system/role/delete',
  '/transport/system/role/user',
  '/transport/system/role/menu',
];

let plan = [[], []];
let authority = [];
const FormItem = Form.Item;
const confirm = Modal.confirm;
let treeListAll = [];

/**
 * 添加窗口
 * @type {ConnectedComponentClass<function(*): *, Omit<FormComponentProps<any>, keyof WrappedFormInternalProps>>}
 */
const CreateForm = Form.create()(props => {
  const {
    loading,
    modalVisible,
    form,
    handleAdd,
    handleModalVisible,
    treeList,
    getRoleName,
    setRoleCode,
    pinyin,
  } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleAdd(fieldsValue, () => form.resetFields());
    });
  };

  const inputBlur = () => {
    setRoleCode(res => {
      form.setFieldsValue({
        code: res,
      });
    });
  };
  return (
    <Modal
      destroyOnClose
      title="添加角色"
      className={themeStyle.formModal}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <Spin spinning={loading} tip="正在获取角色代码···">
        <div className={themeStyle.formModalBody}>
          <FormItem hasFeedback label="角色名称">
            {form.getFieldDecorator('roleName', {
              rules: [{ required: true, message: '请输入角色名称！' }],
            })(<Input placeholder="请输入" onChange={getRoleName} />)}
          </FormItem>
          <FormItem label="角色代码">
            {form.getFieldDecorator('code', {
              // initialValue: pinyin,
              rules: [{ required: true, message: '请先获取角色代码' }],
            })(<Input placeholder="请输入" onFocus={inputBlur} />)}
          </FormItem>
          <FormItem label="部门">
            {form.getFieldDecorator('department', {
              rules: [{ required: true, message: '请选择部门' }],
            })(
              <Checkbox.Group>
                {plan[0].map((item, i) => (
                  <Checkbox value={item} key={i}>
                    {plan[1][i]}
                  </Checkbox>
                ))}
              </Checkbox.Group>,
            )}
          </FormItem>
          <FormItem hasFeedback label="所属机构">
            {form.getFieldDecorator('organId', {
              rules: [{ required: true, message: '请选择所属机构！' }],
            })(<TreeSelect treeData={treeList} style={{ width: '100%' }} placeholder="请输入" />)}
          </FormItem>
          <FormItem label="角色描述">
            {form.getFieldDecorator('description', {
              rules: [{ message: '请输入角色描述！' }],
            })(<Input.TextArea placeholder="请输入" />)}
          </FormItem>
        </div>
      </Spin>
    </Modal>
  );
});

/**
 * 编辑窗口
 * @type {ConnectedComponentClass<function(*): *, Omit<FormComponentProps<any>, keyof WrappedFormInternalProps>>}
 */
const UpdateForm = Form.create()(props => {
  const {
    modalVisible,
    form,
    handleUpdate,
    handleModalVisible,
    treeList,
    getRoleName,
    setRoleCode,
    pinyin,
    detailData,
  } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleUpdate(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="修改角色"
      className={themeStyle.formModal}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <div className={themeStyle.formModalBody}>
        <FormItem hasFeedback label="角色名称">
          {form.getFieldDecorator('roleName', {
            initialValue: detailData.roleName,
            rules: [{ required: true, message: '请输入角色名称！' }],
          })(<Input placeholder="请输入" onChange={getRoleName} />)}
        </FormItem>
        <FormItem label="角色代码">
          {form.getFieldDecorator('code', {
            initialValue: detailData.code,
          })(<Input disabled placeholder="请输入" style={{ color: 'rgba(0,0,0,.7)' }} />)}
        </FormItem>
        <FormItem label="部门">
          {form.getFieldDecorator('department', {
            rules: [{ required: true, message: '请选择部门' }],
            initialValue: detailData.department ? detailData.department.split(',') : [],
          })(
            <Checkbox.Group>
              {plan[0].map((item, i) => (
                <Checkbox value={item} key={i}>
                  {plan[1][i]}
                </Checkbox>
              ))}
            </Checkbox.Group>,
          )}
        </FormItem>
        <FormItem hasFeedback label="所属机构">
          {form.getFieldDecorator('organId', {
            initialValue: detailData.organId,
            rules: [{ required: true, message: '请选择所属机构！' }],
          })(<TreeSelect treeData={treeList} style={{ width: '100%' }} placeholder="请输入" />)}
        </FormItem>
        <FormItem label="角色描述">
          {form.getFieldDecorator('description', {
            initialValue: detailData.description,
            rules: [{ message: '请输入角色描述！' }],
          })(<Input.TextArea placeholder="请输入" />)}
        </FormItem>
      </div>
    </Modal>
  );
});

/**
 * 角色分配菜单 窗口
 * @type {ConnectedComponentClass<function(*): *, Omit<FormComponentProps<any>, keyof WrappedFormInternalProps>>}
 */
const DistributionModal = Form.create()(props => {
  const {
    modalVisible,
    handleModalVisible,
    menuTreeList,
    renderTreeNodes,
    roleAliasList,
    roleAliasCheck,
    saveRoleAlias,
  } = props;

  return (
    <Modal
      destroyOnClose
      title="菜单分配"
      visible={modalVisible}
      className={themeStyle.myModal}
      onOk={saveRoleAlias}
      onCancel={() => handleModalVisible()}
      width={300}
    >
      <Tree
        showLine
        checkable
        // checkStrictly
        onCheck={roleAliasCheck}
        checkedKeys={roleAliasList}
      >
        {renderTreeNodes(menuTreeList)}
      </Tree>
    </Modal>
  );
});

/**
 * 角色分配用户 窗口
 * @type {ConnectedComponentClass<function(*): *, Omit<FormComponentProps<any>, keyof WrappedFormInternalProps>>}
 */
const DistributionUserModal = Form.create()(props => {
  const {
    modalVisible,
    handleModalVisible,
    data,
    loading,
    roleDataDel,
    roleDataDelBatch,
    showRoleUserAddModal,
    userRoleRowSelect,
    roleUserTableChange,
  } = props;
  const columns = [
    {
      title: '登录名',
      dataIndex: 'username',
      width: '150px',
    },
    {
      title: '用户名称',
      dataIndex: 'fullname',
    },
    {
      title: '电话',
      dataIndex: 'mobile',
    },
    {
      title: '操作',
      width: '80px',
      render: (text, record) => (
        <Fragment>
          <Popconfirm
            title="是否移除数据?"
            onConfirm={() => roleDataDel(record.account)}
            okText="确定"
            cancelText="取消"
          >
            <a href="javascript:void(0)" style={{ color: '#f5222d' }}>
              移除
            </a>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      userRoleRowSelect(selectedRows);
    },
    getCheckboxProps: record => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  };

  return (
    <Modal
      destroyOnClose
      title="当前角色用户列表"
      className={themeStyle.myModal}
      visible={modalVisible}
      onCancel={() => handleModalVisible()}
      width={800}
      footer={[
        <Button key="back" onClick={() => handleModalVisible()}>
          取消
        </Button>,
      ]}
    >
      <div style={{ marginBottom: 10 }}>
        <Button
          size="small"
          style={{ marginRight: 5 }}
          type="primary"
          icon="plus"
          onClick={showRoleUserAddModal}
        >
          添加
        </Button>
        <Button size="small" type="danger" icon="delete" onClick={() => roleDataDelBatch()}>
          批量移除
        </Button>
      </div>
      <Table
        rowKey="id"
        bordered
        loading={loading}
        rowSelection={rowSelection}
        columns={columns}
        size="middle"
        dataSource={data.list}
        pagination={data.pagination}
        onChange={roleUserTableChange}
      />
      ,
    </Modal>
  );
});

/**
 * 角色分配用户 窗口
 * @type {ConnectedComponentClass<function(*): *, Omit<FormComponentProps<any>, keyof WrappedFormInternalProps>>}
 */
const DistributionUserAddModal = Form.create()(props => {
  const {
    modalVisible,
    handleModalVisible,
    data,
    userRoleRowSelect,
    userRoleModalOk,
    roleUserAddTableChange,
  } = props;
  const columns = [
    {
      title: '登录名',
      dataIndex: 'account',
      width: '150px',
    },
    {
      title: '用户名称',
      dataIndex: 'fullname',
    },
    {
      title: '电话',
      dataIndex: 'mobile',
    },
    // {
    //     title: '操作',
    //     width: '80px',
    //     render: (text, record) => (
    //         <Fragment>
    //             <a href="javascript:void(0)">添加</a>
    //         </Fragment>
    //     ),
    // },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      userRoleRowSelect(selectedRows);
    },
    getCheckboxProps: record => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  };

  return (
    <Modal
      destroyOnClose
      title="添加用户"
      className={themeStyle.myModal}
      rowSelection={rowSelection}
      visible={modalVisible}
      onOk={userRoleModalOk}
      onCancel={() => handleModalVisible()}
      width={800}
    >
      <Table
        rowKey="id"
        bordered
        rowSelection={rowSelection}
        columns={columns}
        size="middle"
        dataSource={data.list}
        pagination={data.pagination}
        onChange={roleUserAddTableChange}
      />
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ system, Role, loading, user }) => ({
  system,
  Role,
  currentUser: user.currentUser,
  loading: loading.models.Role,
  systemLoading: loading.models.system,
}))
@Form.create()
class TableList extends PureComponent {
  // eslint-disable-next-line react/sort-comp
  constructor(props) {
    super(props);
    plan = getPlan();
    authority = multipleCheckAuth(allAuthority);
  }

  state = {
    modalVisible: false,
    updateModalVisible: false,
    roleMenuModalVisible: false,
    userRoleModalVisible: false,
    userRoleAddModalVisible: false,
    selectedRows: [],
    userRoleRowSelectRows: [],
    userRowSelectAccounts: [],
    formValues: [],
    roleAliasList: [],
    roleAliasListAll: [],
    treeFormValue: {},
    expandCheckKeys: [],
    menuTreeList: [],
    roleCode: '',
    roleName: '',
    pinyin: '',
    roleAliasID: '',
    userRoleModalCode: '',
    userRoleModalOrganId: '',
    defaultFormValue: {
      property: 'isDelete',
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
    deptSearch: {},
  };

  columns = [
    {
      title: '角色代码',
      dataIndex: 'code',
      width: '150px',
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
    },
    {
      title: '角色描述',
      dataIndex: 'description',
    },
    {
      title: '所属机构',
      dataIndex: 'organName',
    },
    {
      title: '操作',
      width: '260px',
      render: (text, record) => (
        <Fragment>
          <Switch
            checkedChildren="启用"
            unCheckedChildren="禁用"
            checked={record.enabled === 1 ? true : false}
            onClick={() => this.switchClick(record)}
          />
          <Divider type="vertical" />
          <Dropdown overlay={this.tableMenu(record)}>
            <Button>
              更多操作 <Icon type="down" />
            </Button>
          </Dropdown>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    const { defaultFormValue, pageBean } = this.state;
    const organId = localStorage.getItem('organId');
    const mainMsg = JSON.parse(localStorage.getItem('mainMsg') || '{}');
    const department = mainMsg.department ? mainMsg.department.split(',') : [];
    const deptSearch = {
      property: 'department',
      value: department.join(),
      group: 'main',
      operation: 'LIKE',
      relation: 'AND',
    };
    const arr = [defaultFormValue];
    if (department.length < 4) {
      arr.push(deptSearch);
      this.setState({ deptSearch });
    }

    this.getList({
      pageBean,
      querys: [
        ...arr,
        {
          property: 'organId',
          value: organId,
          group: 'main',
          operation: 'RIGHT_LIKE',
          relation: 'AND',
        },
      ],
    });
    dispatch({
      type: 'menu/getMenuData2',
      payload: {
        prefix: '',
        type: 0,
      },
      callback: menu => {
        this.setState({ menuTreeList: formatTreeList(menu) });
      },
    });
  }

  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Role/fetch',
      payload: params,
    });
  };

  /**
   * table -> columns -> 操作 -> 更多操作菜单
   * @param record
   * @returns {*}
   */
  tableMenu = record => {
    return (
      <Menu onClick={this.handleMenuClick.bind(this, record)}>
        {checkAuth(authority[5]) ? (
          <Menu.Item key="user">
            <Icon type="user" />
            分配用户
          </Menu.Item>
        ) : null}
        {checkAuth(authority[4]) ? (
          <Menu.Item key="menu">
            <Icon type="menu" />
            分配菜单
          </Menu.Item>
        ) : null}
        {checkAuth(authority[2]) ? (
          <Menu.Item key="edit">
            <Icon type="form" />
            编辑
          </Menu.Item>
        ) : null}
        {checkAuth(authority[3]) ? (
          <Menu.Item key="del" style={{ color: '#f5222d' }}>
            <Icon type="delete" />
            删除
          </Menu.Item>
        ) : null}
      </Menu>
    );
  };

  /**
   * 更多操作事件处理
   * @param record
   * @param e
   */
  handleMenuClick = (record, e) => {
    const self = this;
    switch (e.key) {
      case 'edit':
        self.showEditModal(record.code);
        break;
      case 'del':
        confirm({
          title: '提示',
          content: '是否删除数据?',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            self.dataDel(record.id);
          },
          onCancel() {},
        });
        break;
      case 'user':
        this.showUserRoleModal(record);
        break;
      case 'menu':
        this.showRoleMenuModal(record.id);
        break;
      default:
    }
  };

  /**
   * 角色分配用户 -> 添加用户 -> 确定
   * @returns {MessageType}
   */
  userRoleModalOk = () => {
    const { userRoleRowSelectRows, userRoleModalCode, pageBean } = this.state;
    if (!userRoleRowSelectRows.length) return message.error('请先选择用户');
    const { dispatch } = this.props;

    dispatch({
      type: 'Role/saveUserRoleData',
      payload: {
        code: userRoleModalCode,
        accounts: userRoleRowSelectRows.map(item => item.account).join(),
      },
      callback: () => {
        message.success('添加成功');
        this.handleUserRoleAddModalVisible();
        this.setState({ userRoleRowSelectRows: [] });

        this.getRoleUsersList({
          filter: {
            pageBean,
          },
          code: userRoleModalCode,
        });
      },
    });
  };

  /**
   * 角色分配用户 -> 添加用户 -> table多选
   * @param keys
   */
  userRoleRowSelect = keys => {
    this.setState({ userRoleRowSelectRows: keys });
  };

  showRoleUserAddModal = () => {
    const { dispatch } = this.props;
    const { defaultFormValue, userRoleModalOrganId } = this.state;
    dispatch({
      type: 'Role/getUserData',
      payload: {
        pageBean: {
          page: 1,
          pageSize: 10,
          showTotal: true,
        },
        querys: [
          defaultFormValue,
          {
            property: 'organId',
            value: userRoleModalOrganId,
            group: 'main',
            operation: 'RIGHT_LIKE',
            relation: 'AND',
          },
        ],
      },
    });
    this.handleUserRoleAddModalVisible(true);
  };

  userRoleSelectTableRow = keys => {
    this.setState({ userRowSelectAccounts: keys.map(item => item.account).join() });
  };

  roleDataDelBatch = () => {
    const { dispatch } = this.props;
    const { userRoleModalCode, userRowSelectAccounts, pageBean } = this.state;
    if (!userRowSelectAccounts.length || !userRowSelectAccounts)
      return message.error('请先选择用户');
    const self = this;
    confirm({
      title: '移除用户',
      content: '您确定要移除用户吗?',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'Role/removeRoleUser',
          payload: {
            code: userRoleModalCode,
            accounts: userRowSelectAccounts,
          },
          callback: () => {
            message.success('用户移除成功');
            self.setState({ userRowSelectAccounts: [] });
            this.getRoleUsersList({
              filter: {
                pageBean,
              },
              code: userRoleModalCode,
            });
          },
        });
      },
      onCancel() {},
    });
  };

  /**
   * 角色下用户列表 分页
   */
  roleUserTableChange = pagination => {
    const { userRoleModalCode } = this.state;
    this.getRoleUsersList({
      filter: {
        pageBean: {
          page: pagination.current,
          pageSize: pagination.pageSize,
          showTotal: true,
        },
      },
      code: userRoleModalCode,
    });
  };

  roleUserAddTableChange = pagination => {
    const { dispatch } = this.props;
    const { userRoleModalOrganId, defaultFormValue } = this.state;
    dispatch({
      type: 'Role/getUserData',
      payload: {
        pageBean: {
          page: pagination.current,
          pageSize: pagination.pageSize,
          showTotal: true,
        },
        querys: [
          defaultFormValue,
          {
            property: 'organId',
            value: userRoleModalOrganId,
            group: 'main',
            operation: 'LIKE',
            relation: 'AND',
          },
        ],
      },
    });
  };

  /**
   * 删除角色下用户
   * @param id
   */
  roleDataDel = account => {
    const { dispatch } = this.props;
    const { userRoleModalCode, pageBean } = this.state;
    dispatch({
      type: 'Role/removeRoleUser',
      payload: {
        code: userRoleModalCode,
        accounts: account,
      },
      callback: () => {
        message.success('用户移除成功');
        this.setState({ userRowSelectAccounts: [] });
        this.getRoleUsersList({
          filter: {
            pageBean,
          },
          code: userRoleModalCode,
        });
      },
    });
  };

  /**
   * 显示角色用户
   * @param code
   */
  showUserRoleModal = record => {
    const { pageBean } = this.state;
    this.getRoleUsersList(
      {
        filter: { pageBean },
        code: record.code,
      },
      () => {
        this.setState({
          userRoleModalCode: record.code,
          userRoleModalOrganId: record.organId,
        });
        this.handleUserRoleModalVisible(true);
      },
    );
  };

  getRoleUsersList = (params, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Role/roleUsersList',
      payload: params,
      callback: () => {
        callback && callback();
      },
    });
  };

  /**
   * 显示角色菜单授权框
   * @param id
   */
  showRoleMenuModal = id => {
    // const {system: {menuTreeList}} = this.props;
    const { menuTreeList } = this.state;

    const { dispatch } = this.props;
    dispatch({
      type: 'Role/roleAlias',
      payload: {
        roleId: id,
      },
      callback: res => {
        // res.push('8');
        let arr = [];
        this.formTree(menuTreeList);
        treeListAll = this.unique(treeListAll);
        for (let i in res) {
          if (treeListAll.indexOf(res[i]) < 0) {
            arr.push(res[i]);
          }
        }
        this.setState({ roleAliasList: arr, roleAliasID: id });
        this.handleRoleMenuModalVisible(true);
      },
    });
  };

  unique = arr => {
    return arr.filter(function(item, index, arr) {
      return arr.indexOf(item, 0) === index;
    });
  };

  formTree = menuTreeList => {
    menuTreeList.map(item => {
      treeListAll.push(parseInt(item.parentId));
      if (item.children.length) {
        this.formTree(item.children);
      }
    });
  };

  /**
   * 菜单授权框 树形菜单 checkBox 选中
   * @param checkedKeys []
   */
  roleAliasCheck = (checkedKeys, { halfCheckedKeys }) => {
    // roleAliasListAll
    this.setState({
      roleAliasList: checkedKeys,
      roleAliasListAll: checkedKeys.concat(halfCheckedKeys),
    });
  };

  // 保存角色授权菜单
  saveRoleAlias = () => {
    const { dispatch } = this.props;
    const { roleAliasID, roleAliasList, roleAliasListAll } = this.state;
    dispatch({
      type: 'Role/saveRoleAlias',
      payload: {
        menuId: roleAliasListAll,
        roleId: roleAliasID,
      },
      callback: () => {
        message.success('菜单权限分配成功');
        this.handleRoleMenuModalVisible();
        this.setState({ roleAliasID: '' });
      },
    });
  };

  // 批量清空角色菜单授权
  clearRoleAlias = () => {
    const { selectedRows } = this.state;
    if (!selectedRows) return;
    const { dispatch } = this.props;
    const self = this;
    confirm({
      title: '权限清除',
      content: '您确定要批量清除权限吗?',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'Role/clearRoleAlias',
          payload: {
            roleId: selectedRows.map(item => item.id).join(),
          },
          callback: () => {
            message.success('清除成功');
            self.setState({
              selectedRows: [],
            });
          },
        });
      },
      onCancel() {},
    });
  };

  /**
   * 显示编辑modal
   * @param code
   */
  showEditModal = code => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Role/detailData',
      payload: { code: code },
      callback: res => {
        this.handleUpdateModalVisible(true);
        this.setState({ roleName: res.roleName });
      },
    });
  };

  /**
   * 批量删除
   */
  delBatch = () => {
    const { selectedRows } = this.state;
    if (!selectedRows) return;
    const self = this;
    confirm({
      title: '删除',
      content: '您确定要批量删除吗?',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        self.deleteUtil(selectedRows.map(row => row.id).join() + ',');
      },
      onCancel() {},
    });
  };

  /**
   * 批量启用
   */
  activateBatch = () => {
    const { selectedRows } = this.state;
    if (!selectedRows) return;
    const self = this;
    confirm({
      title: '提示',
      content: '您确定要批量启用吗?',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        self.activateUtil(selectedRows.map(row => row.code).join());
      },
      onCancel() {},
    });
  };

  /**
   * 批量禁用
   */
  forbiddenBatch = () => {
    const { selectedRows } = this.state;
    if (!selectedRows) return;
    const self = this;
    confirm({
      title: '提示',
      content: '您确定要批量删禁用吗?',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        self.forbiddenUtil(selectedRows.map(row => row.code).join());
      },
      onCancel() {},
    });
  };

  forbiddenUtil = ids => {
    const { dispatch } = this.props;
    const { defaultFormValue, pageBean, deptSearch } = this.state;
    dispatch({
      type: 'Role/forbidden',
      payload: ids,
      callback: () => {
        message.success('禁用成功');
        const arr = [defaultFormValue];
        if (Object.keys(deptSearch).length) {
          arr.push(deptSearch);
        }
        arr.push(this.organArr());
        this.getList({
          pageBean,
          querys: arr,
        });
        this.setState({
          selectedRows: [],
        });
      },
    });
  };

  activateUtil = ids => {
    const { dispatch } = this.props;
    const { defaultFormValue, deptSearch, pageBean } = this.state;
    dispatch({
      type: 'Role/activate',
      payload: ids,
      callback: () => {
        message.success('启用成功');
        const arr = [defaultFormValue];
        if (Object.keys(deptSearch).length) {
          arr.push(deptSearch);
        }
        arr.push(this.organArr());
        this.getList({
          pageBean,
          querys: arr,
        });
        this.setState({
          selectedRows: [],
        });
      },
    });
  };

  switchClick = record => {
    if (record.enabled === 1) {
      this.forbiddenUtil(record.code);
    } else {
      this.activateUtil(record.code);
    }
  };

  /**
   * 删除数据
   * @param id
   */
  dataDel = id => {
    this.deleteUtil(id);
  };

  deleteUtil = ids => {
    const { dispatch } = this.props;
    const { defaultFormValue, pageBean, deptSearch } = this.state;
    dispatch({
      type: 'Role/remove',
      payload: {
        ids,
      },
      callback: () => {
        message.success('删除成功');
        const arr = [defaultFormValue];
        if (Object.keys(deptSearch).length) {
          arr.push(deptSearch);
        }
        arr.push(this.organArr());
        this.getList({
          pageBean,
          querys: arr,
        });
      },
    });
  };

  handleStandardTableChange = pagination => {
    const { formValues, defaultFormValue, deptSearch } = this.state;
    let arr = [];
    arr.unshift(defaultFormValue);
    if (Object.keys(deptSearch).length) {
      arr.push(deptSearch);
    }
    arr.push(this.organArr());
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
    const { defaultFormValue, pageBean, deptSearch } = this.state;
    form.resetFields();
    this.setState({
      formValues: [],
      selectedKeys: [],
      treeFormValue: {},
    });

    const arr = [defaultFormValue];
    if (Object.keys(deptSearch).length) {
      arr.push(deptSearch);
    }
    arr.push(this.organArr());
    this.getList({
      pageBean,
      querys: arr,
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    const { defaultFormValue, pageBean, deptSearch } = this.state;
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
              operation: 'LIKE',
              relation: 'OR',
            }
          : '';
      });
      // 过滤数组中的('' null undefined)
      const conditionFilter = condition.filter(item => item);
      this.setState({
        formValues: conditionFilter,
      });

      conditionFilter.unshift(defaultFormValue);
      if (Object.keys(deptSearch).length) {
        conditionFilter.push(deptSearch);
      }
      conditionFilter.push(this.organArr());

      this.getList({
        pageBean,
        querys: conditionFilter,
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      roleName: '',
    });
    if (!!!flag) {
      this.setState({ pinyin: '' });
    }
  };

  handleUpdateModalVisible = flag => {
    this.setState({
      updateModalVisible: !!flag,
      roleName: '',
    });
    if (!!!flag) {
      this.setState({ pinyin: '' });
    }
  };

  handleRoleMenuModalVisible = flag => {
    this.setState({
      roleMenuModalVisible: !!flag,
    });
  };

  handleUserRoleModalVisible = flag => {
    this.setState({ userRoleModalVisible: !!flag });
  };

  handleUserRoleAddModalVisible = flag => {
    this.setState({
      userRoleAddModalVisible: !!flag,
    });
  };

  handleAdd = (fields, callback) => {
    const { dispatch, currentUser } = this.props;
    const { defaultFormValue, pageBean, deptSearch } = this.state;
    fields.department = fields.department.join();
    dispatch({
      type: 'Role/add',
      payload: fields,
      callback: () => {
        message.success('添加成功');
        this.setState({ pinyin: '' });
        this.handleModalVisible();

        const arr = [defaultFormValue];
        if (Object.keys(deptSearch).length) {
          arr.push(deptSearch);
        }
        arr.push({
          property: 'organId',
          value: currentUser.organId,
          group: 'main',
          operation: 'RIGHT_LIKE',
          relation: 'AND',
        });
        this.getList({
          pageBean,
          querys: arr,
        });
        callback && callback();
      },
    });
  };

  // eslint-disable-next-line react/sort-comp
  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 16, xl: 16 }}>
          <Col md={6} sm={24}>
            <FormItem>
              {getFieldDecorator('code')(<Input addonBefore="角色代码" placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem>
              {getFieldDecorator('roleName')(<Input addonBefore="角色名称" placeholder="请输入" />)}
            </FormItem>
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

  handleUpdate = fields => {
    const {
      dispatch,
      Role: { detailData },
    } = this.props;
    const { defaultFormValue, pageBean, deptSearch } = this.state;
    fields.enabled = detailData.enabled;
    fields.department = fields.department.join();
    dispatch({
      type: 'Role/update',
      payload: fields,
      callback: () => {
        message.success('编辑成功');
        this.handleUpdateModalVisible();

        const arr = [defaultFormValue];
        if (Object.keys(deptSearch).length) {
          arr.push(deptSearch);
        }
        arr.push(this.organArr());
        this.getList({
          pageBean,
          querys: arr,
        });
      },
    });
  };

  organArr = () => {
    const { treeFormValue } = this.state;
    const { currentUser } = this.props;
    if (JSON.stringify(treeFormValue) !== '{}') {
      return treeFormValue;
    }
    return {
      property: 'organId',
      value: currentUser.organId,
      group: 'main',
      operation: 'RIGHT_LIKE',
      relation: 'OR',
    };
  };

  /**
   * 树形选择
   * @param selectedKeys
   * @param info
   */
  onSelect = (selectedKeys, info) => {
    if (!selectedKeys[0]) return;
    this.setState({ selectedKeys });
    const { formValues, defaultFormValue, pageBean, deptSearch } = this.state;
    let arr = [];
    const treeFormValue = {
      property: 'organId',
      value: selectedKeys[0],
      group: 'main',
      operation: 'RIGHT_LIKE',
      relation: 'OR',
    };
    this.setState({ treeFormValue });
    arr.unshift(defaultFormValue);
    if (Object.keys(deptSearch).length) {
      arr.push(deptSearch);
    }
    arr.push(treeFormValue);
    arr = arr.concat(formValues);
    this.getList({
      pageBean,
      querys: arr,
    });
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

  setRoleCode = callback => {
    const { roleName } = this.state;
    const { dispatch } = this.props;
    if (!roleName) return message.error('请先输入角色名称');
    dispatch({
      type: 'system/getPinyin',
      payload: {
        chinese: roleName,
        type: 2,
      },
      callback: code => {
        this.setState({ pinyin: code });
        callback && callback(code);
      },
    });
  };

  getRoleName = e => {
    this.setState({ roleName: e.target.value });
  };

  expandCheck = keys => {
    this.setState({ expandCheckKeys: keys });
  };

  render() {
    const {
      system: { treeList },
      Role: { data, detailData, roleUserList, userData },
      loading,
      systemLoading,
    } = this.props;
    const {
      expandCheckKeys,
      menuTreeList,
      selectedKeys,
      selectedRows,
      modalVisible,
      updateModalVisible,
      pinyin,
      roleMenuModalVisible,
      roleAliasList,
      userRoleModalVisible,
      userRoleAddModalVisible,
    } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      getRoleName: this.getRoleName,
      setRoleCode: this.setRoleCode,
      treeList,
      pinyin,
      loading: systemLoading,
    };
    const updateMethods = {
      handleUpdate: this.handleUpdate,
      handleModalVisible: this.handleUpdateModalVisible,
      getRoleName: this.getRoleName,
      setRoleCode: this.setRoleCode,
      treeList,
      pinyin,
      detailData,
    };

    const distributionMethods = {
      handleModalVisible: this.handleRoleMenuModalVisible,
      renderTreeNodes: this.renderTreeNodes,
      roleAliasCheck: this.roleAliasCheck,
      saveRoleAlias: this.saveRoleAlias,
      menuTreeList,
      roleAliasList,
    };

    const userRoleMethods = {
      handleModalVisible: this.handleUserRoleModalVisible,
      showRoleUserAddModal: this.showRoleUserAddModal,
      data: roleUserList,
      loading,
      roleDataDel: this.roleDataDel,
      roleDataDelBatch: this.roleDataDelBatch,
      roleUserTableChange: this.roleUserTableChange,
    };

    const userRoleAddMethods = {
      handleModalVisible: this.handleUserRoleAddModalVisible,
      data: userData,
      renderTreeNodes: this.renderTreeNodes,
      userRoleModalOk: this.userRoleModalOk,
      treeList,
      roleUserAddTableChange: this.roleUserAddTableChange,
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
                  {selectedRows.length > 0 && (
                    <span>
                      {checkAuth(authority[3]) ? (
                        <Button type="danger" onClick={() => this.delBatch()}>
                          批量删除
                        </Button>
                      ) : null}
                      <Button type="danger" onClick={this.clearRoleAlias}>
                        清除授权
                      </Button>
                      <Button onClick={this.activateBatch}>批量启用</Button>
                      <Button onClick={this.forbiddenBatch}>批量禁用</Button>
                    </span>
                  )}
                </div>
                <StandardTable
                  tableAlert={true}
                  selectedRows={selectedRows}
                  loading={loading}
                  data={data}
                  size="middle"
                  columns={this.columns}
                  onSelectRow={this.handleSelectRows}
                  onChange={this.handleStandardTableChange}
                />
              </div>
            </Card>
          </div>
        </div>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
        <UpdateForm {...updateMethods} modalVisible={updateModalVisible} />
        <DistributionModal {...distributionMethods} modalVisible={roleMenuModalVisible} />
        <DistributionUserModal
          userRoleRowSelect={this.userRoleSelectTableRow}
          {...userRoleMethods}
          modalVisible={userRoleModalVisible}
        />
        <DistributionUserAddModal
          {...userRoleAddMethods}
          modalVisible={userRoleAddModalVisible}
          userRoleRowSelect={this.userRoleRowSelect}
        />
      </Fragment>
    );
  }
}

export default TableList;
