import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Modal,
  message,
  Divider,
  Upload,
  Icon,
  TreeSelect,
  Switch,
  Popconfirm,
  AutoComplete,
  Tree,
  Spin,
  Popover,
  Tooltip,
  Checkbox,
  Select,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import { Redirect } from 'umi';

import {
  emailSuffix,
  checkAuth,
  checkPhone,
  imgUrl,
  getLocalStorage,
  getPlan,
  multipleCheckAuth,
  isTraffic,
  imageBeforeUpload,
} from '@/utils/utils';

import styles from '../../../style/style.less';
import publicCss from '../../../style/public.less';
import defaultImg from '@/assets/defaultImg.png';
import themeStyle from '@/pages/style/theme.less';

const { Option } = Select;
const FormItem = Form.Item;
const { confirm } = Modal;
let fileListLength = 0;

// 当前页面所有权限
const allAuthority = [
  '/system/user',
  '/system/user/adduser',
  '/system/user/updateUser',
  '/system/user/deleteUserByIds',
  '/system/user/export',
  '/conserve/data/user',
  '/conserve/data/user/add',
  '/conserve/data/user/update',
  '/conserve/data/user/delete',
  '/conserve/data/user/export',
  '/maritime/data/user',
  '/maritime/data/user/add',
  '/maritime/data/user/update',
  '/maritime/data/user/delete',
  '/maritime/data/user/export',
  '/transport/system/user',
  '/transport/system/user/add',
  '/transport/system/user/update',
  '/transport/system/user/delete',
  '/transport/system/user/export',
];

let plan = [[], []];
let authority = [];
/**
 * 用户添加 modal
 * @type {ConnectedComponentClass<function(*): *, Omit<FormComponentProps<any>, keyof WrappedFormInternalProps>>}
 */
const CreateForm = Form.create()(props => {
  const {
    modalVisible,
    form,
    handleAdd,
    emailSuffixValue,
    handleModalVisible,
    emailInputChange,
    // treeCascaderChange,
    treeList,
    setRoleCode,
    pinyin,
    loading,
    getFullName,
    treeSelectChange,
    siteList,
    fileList,
    uploadChange,
    departmentChange,
    departmentValue,
    departmentList,
    lawSignaFileList,
    lawSignaUploadChange,
  } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleAdd(fieldsValue, () => form.resetFields());
    });
  };

  // const getPy = () => {
  //   form.setFieldsValue({
  //     account: ''
  //   }, () => {
  //     setRoleCode();
  //   });
  // };

  const treeChange = e => {
    form.setFieldsValue({
      siteIds: [],
      staticSite: [],
    });
    treeSelectChange(e);
  };
  const uploadConfig = {
    name: 'files',
    action: '/result/api/file/v1/fileUpload',
    listType: 'picture',
    accept: '.jpg,.jpeg,.png',
    data: {
      type: 1,
      xbType: '',
    },
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    beforeUpload: imageBeforeUpload,
    onChange: uploadChange,
  };

  const inputBlur = () => {
    setRoleCode(res => {
      form.setFieldsValue({
        account: res,
      });
    });
  };

  return (
    <Modal
      destroyOnClose
      title="添加用户"
      className={themeStyle.formModal}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      width={800}
    >
      <Spin spinning={loading} tip="正在获取">
        <div className={themeStyle.formModalBody}>
          <Row gutter={40}>
            <Col md={12} sm={24}>
              <FormItem hasFeedback label="名称">
                {form.getFieldDecorator('fullname', {
                  rules: [{ required: true, message: '请输入用户名称' }],
                })(<Input placeholder="请输入" onChange={getFullName} />)}
              </FormItem>
              <FormItem label="登录账号">
                {form.getFieldDecorator('account', {
                  rules: [{ required: true, message: '请获取登录账号！' }],
                })(<Input placeholder="请输入" onFocus={inputBlur} />)}
              </FormItem>
              <FormItem hasFeedback label="密码">
                {form.getFieldDecorator('password', {
                  rules: [{ required: true, min: 6, message: '请输入账号密码！' }],
                })(<Input type="password" placeholder="请输入" />)}
              </FormItem>
              <FormItem hasFeedback label="电话号码">
                {form.getFieldDecorator('mobile', {
                  rules: [
                    {
                      required: true,
                      validator: checkPhone,
                    },
                  ],
                })(<Input placeholder="请输入" />)}
              </FormItem>
              <FormItem hasFeedback label="职务">
                {form.getFieldDecorator('position', {
                  rules: [{ required: true, message: '请输入职务' }],
                })(<Input placeholder="请输入" />)}
              </FormItem>
              <FormItem label="执法证件号">
                {form.getFieldDecorator('lawCard', {
                  rules: [{ message: '请输入执法证件号！' }],
                })(<Input placeholder="请输入" />)}
              </FormItem>
              <FormItem label="执法证件图片">
                {form.getFieldDecorator('lawCardImg')(
                  <Upload {...uploadConfig} defaultFileList={fileList} onChange={uploadChange}>
                    {fileList.length > 0 ? null : (
                      <Button>
                        <Icon type="upload" /> 执法证件图片
                      </Button>
                    )}
                  </Upload>,
                )}
              </FormItem>
              <FormItem label="签名">
                {form.getFieldDecorator('lawSigna')(
                  <Upload
                    {...uploadConfig}
                    defaultFileList={lawSignaFileList}
                    onChange={lawSignaUploadChange}
                  >
                    {lawSignaFileList.length > 0 ? null : (
                      <Button>
                        <Icon type="upload" /> 签名
                      </Button>
                    )}
                  </Upload>,
                )}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem label="证件号码">
                {form.getFieldDecorator('idCard', {
                  rules: [{ message: '请输入证件号码！' }],
                })(<Input placeholder="请输入" />)}
              </FormItem>
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
              <FormItem hasFeedback label="区域">
                {form.getFieldDecorator('organId', {
                  rules: [{ required: true, message: '请选择区域！' }],
                })(
                  <TreeSelect
                    treeData={treeList}
                    style={{ width: '100%' }}
                    placeholder="请选择"
                    onChange={treeChange}
                  />,
                )}
              </FormItem>
              <FormItem label="部门">
                {form.getFieldDecorator('department', {
                  rules: [{ required: true, message: '请选择部门' }],
                })(
                  <Checkbox.Group onChange={departmentChange}>
                    {plan[0].map((item, i) => (
                      <Checkbox value={item} key={i}>
                        {plan[1][i]}
                      </Checkbox>
                    ))}
                  </Checkbox.Group>,
                )}
              </FormItem>
              {isTraffic() ? (
                <Fragment>
                  <FormItem label="非现场站点">
                    {form.getFieldDecorator('siteIds', {})(
                      <TreeSelect
                        placeholder="请选择站点"
                        treeCheckable
                        treeData={siteList[0]}
                        style={{ width: '100%' }}
                      />,
                    )}
                  </FormItem>
                  <FormItem label="精简站">
                    {form.getFieldDecorator('staticSite', {})(
                      <TreeSelect
                        placeholder="请选择站点"
                        treeCheckable
                        treeData={siteList[1]}
                        style={{ width: '100%' }}
                      />,
                    )}
                  </FormItem>
                </Fragment>
              ) : null}

              {/* {departmentValue && (
                <FormItem label="子部门">
                  {form.getFieldDecorator('departCode', {
                    rules: [{ message: '请选择子部门！' }],
                  })(
                    <Select style={{ width: '100%' }} placeholder="请选择">
                      {departmentList.list.map(item => (
                        <Option value={item.id_} key={item.id_}>
                          {item.departName}
                        </Option>
                      ))}
                    </Select>,
                  )}
                </FormItem>
              )} */}
              <FormItem label="地址">
                {form.getFieldDecorator('address', {
                  rules: [{ message: '请输入用户地址！' }],
                })(<Input.TextArea placeholder="请输入" />)}
              </FormItem>
            </Col>
          </Row>
        </div>
      </Spin>
    </Modal>
  );
});

/**
 * 用户编辑/详情 modal
 * @type {ConnectedComponentClass<function(*): *, Omit<FormComponentProps<any>, keyof WrappedFormInternalProps>>}
 */
const UpdateForm = Form.create()(props => {
  const {
    UpdateModalVisible,
    form,
    handleUpdate,
    emailSuffixValue,
    handleUpdateModalVisible,
    emailInputChange,
    // treeCascaderChange,
    treeSelectChange,
    treeList,
    fileList,
    editModalData,
    siteList,
    uploadChange,
    departmentChange,
    departmentValue,
    departmentList,
    lawSignaFileList,
    lawSignaUploadChange,
  } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleUpdate(fieldsValue);
    });
  };

  const treeChange = e => {
    form.setFieldsValue({
      siteIds: [],
      staticSite: [],
    });
    treeSelectChange(e);
  };
  const uploadConfig = {
    name: 'files',
    action: '/result/api/file/v1/fileUpload',
    listType: 'picture',
    accept: '.jpg,.jpeg,.png',
    className: 'upload-list-inline',
    data: {
      type: 1,
      // xbType: editModalData.id,
      xbType: '',
    },
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    beforeUpload: imageBeforeUpload,
  };

  const check = checkAuth(authority[2]);
  const footer = check ? {} : { footer: null };
  const style = check
    ? {}
    : {
        border: 0,
        color: 'rgba(0, 0, 0, .7)',
      };
  return (
    <Modal
      destroyOnClose
      title={check ? '编辑' : '详情'}
      visible={UpdateModalVisible}
      className={themeStyle.formModal}
      onOk={okHandle}
      onCancel={() => handleUpdateModalVisible()}
      {...footer}
      width={800}
    >
      <div className={themeStyle.formModalBody}>
        <Row gutter={40}>
          <Col md={12} sm={24}>
            <FormItem hasFeedback={check} label="名称">
              {form.getFieldDecorator('fullname', {
                initialValue: editModalData.fullname,
                rules: [{ required: true, message: '请输入用户名称' }],
              })(<Input disabled={!check} style={style} placeholder="请输入" />)}
            </FormItem>
            <FormItem label="登录账号">
              {form.getFieldDecorator('account', {
                initialValue: editModalData.account,
                rules: [{ required: true, message: '请输入登录账号！' }],
              })(<Input style={style} placeholder="请输入" disabled />)}
            </FormItem>
            <FormItem hasFeedback={check} label="电话号码">
              {form.getFieldDecorator('mobile', {
                initialValue: editModalData.mobile,
                rules: [
                  {
                    required: true,
                    validator: checkPhone,
                  },
                ],
              })(<Input disabled={!check} style={style} placeholder="请输入" />)}
            </FormItem>
            <FormItem label="职务">
              {form.getFieldDecorator('position', {
                initialValue: editModalData.position,
                rules: [{ required: true, message: '请输入职务' }],
              })(<Input disabled={!check} style={style} placeholder="请输入" />)}
            </FormItem>
            <FormItem label="执法证件号">
              {form.getFieldDecorator('lawCard', {
                initialValue: editModalData.lawCard,
                rules: [{ message: '请输入执法证件号！' }],
              })(<Input disabled={!check} style={style} placeholder="请输入" />)}
            </FormItem>
            <FormItem label="执法证件图片">
              {form.getFieldDecorator('lawCardImg', {
                initialValue: editModalData.lawCardImg,
              })(
                <Upload {...uploadConfig} defaultFileList={fileList}>
                  {check &&
                    (fileList.length > 0 ? null : (
                      <Button>
                        <Icon type="upload" /> 执法证件图片
                      </Button>
                    ))}
                </Upload>,
              )}
            </FormItem>
            <FormItem label="签名">
              {form.getFieldDecorator('lawSigna', {
                initialValue: editModalData.lawSigna,
              })(
                <Upload
                  {...uploadConfig}
                  defaultFileList={lawSignaFileList}
                  onChange={lawSignaUploadChange}
                >
                  {check &&
                    (lawSignaFileList.length > 0 ? null : (
                      <Button>
                        <Icon type="upload" /> 签名
                      </Button>
                    ))}
                </Upload>,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="证件号码">
              {form.getFieldDecorator('idCard', {
                initialValue: editModalData.idCard,
                rules: [{ message: '请输入证件号码！' }],
              })(<Input disabled={!check} style={style} placeholder="请输入" />)}
            </FormItem>
            <FormItem label="邮箱">
              {form.getFieldDecorator('email', {
                initialValue: editModalData.email,
                rules: [{ message: '请输入用户的邮箱！' }],
              })(
                <AutoComplete
                  disabled={!check}
                  dataSource={emailSuffixValue}
                  style={{ width: '100%', ...style }}
                  onChange={emailInputChange}
                  placeholder="请输入"
                />,
              )}
            </FormItem>
            <FormItem hasFeedback={check} label="区域">
              {form.getFieldDecorator('organId', {
                initialValue: [editModalData.organId],
                rules: [{ required: true, message: '请选择区域！' }],
              })(
                <TreeSelect
                  disabled={!check}
                  treeData={treeList}
                  style={{ width: '100%', ...style }}
                  placeholder="请输入"
                  onChange={treeChange}
                />,
              )}
            </FormItem>
            <FormItem label="部门">
              {form.getFieldDecorator('department', {
                rules: [{ required: true, message: '请选择部门' }],
                initialValue: editModalData.department ? editModalData.department.split(',') : [],
              })(
                <Checkbox.Group onChange={departmentChange}>
                  {plan[0].map((item, i) => (
                    <Checkbox value={item} key={i}>
                      {plan[1][i]}
                    </Checkbox>
                  ))}
                </Checkbox.Group>,
              )}
            </FormItem>
            {isTraffic() ? (
              <Fragment>
                <FormItem label="非现场站点">
                  {form.getFieldDecorator('siteIds', {
                    initialValue: editModalData.siteIds ? editModalData.siteIds.split(',') : [],
                  })(
                    <TreeSelect
                      disabled={!check}
                      placeholder="请选择站点"
                      treeCheckable
                      treeData={siteList[0]}
                      style={{ width: '100%', ...style }}
                    />,
                  )}
                </FormItem>
                <FormItem label="精简站">
                  {form.getFieldDecorator('staticSite', {
                    initialValue: editModalData.staticSite
                      ? editModalData.staticSite.split(',')
                      : [],
                  })(
                    <TreeSelect
                      disabled={!check}
                      placeholder="请选择站点"
                      treeCheckable
                      treeData={siteList[1]}
                      style={{ width: '100%', ...style }}
                    />,
                  )}
                </FormItem>
              </Fragment>
            ) : null}
            {/* {departmentValue && (
              <FormItem label="子部门">
                {form.getFieldDecorator('departCode', {
                  initialValue: editModalData.departCode,
                  rules: [{ message: '请选择子部门！' }],
                })(
                  <Select style={{ width: '100%' }} placeholder="请选择">
                    {departmentList.list.map(item => (
                      <Option value={item.id_} key={item.id_}>
                        {item.departName}
                      </Option>
                    ))}
                  </Select>,
                )}
              </FormItem>
            )} */}
            <FormItem label="地址">
              {form.getFieldDecorator('address', {
                initialValue: editModalData.address,
                rules: [{ message: '请输入用户地址！' }],
              })(<Input.TextArea disabled={!check} style={style} placeholder="请输入" />)}
            </FormItem>
          </Col>
        </Row>
      </div>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ TransportSystemDepart, system, systemUser, user, loading }) => ({
  TransportSystemDepart,
  system,
  systemUser,
  currentUser: user.currentUser,
  loading: loading.models.systemUser,
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
    UpdateModalVisible: false,
    departmentValue: false,
    selectedRows: [],
    formValues: [],
    treeFormValue: {},
    defaultFormValue: {
      property: 'isDelete',
      value: '0',
      group: 'main',
      operation: 'NOT_EQUAL',
      relation: 'AND',
    },
    emailSuffixValue: [],
    selectedKeys: [],
    editModalData: {},
    importLoading: false,
    pinyin: '',
    fullName: '',
    expandCheckKeys: [],
    fileList: [],
    lawSignaFileList: [],
    pageBean: {
      page: 1,
      pageSize: 7,
      showTotal: true,
    },
    deptSearch: {},
  };

  columns = [
    {
      title: '登录名',
      dataIndex: 'account',
    },
    {
      title: '姓名',
      dataIndex: 'fullname',
    },
    {
      title: '电话',
      dataIndex: 'mobile',
    },
    {
      title: '机构',
      dataIndex: 'organName',
    },
    {
      title: '执法证件号',
      dataIndex: 'lawCard',
    },
    {
      title: '执法证件图片',
      dataIndex: 'lawCardImg',
      render: (text, record) => (
        <Popover
          content={
            <img
              style={{ width: 'auto', height: 300 }}
              src={imgUrl + record.lawCardImg}
              alt="执法卡图片"
              onError={e => {
                e.target.onerror = null;
                e.target.src = defaultImg;
              }}
            />
          }
          trigger="hover"
        >
          <img
            style={{ width: 'auto', height: 50 }}
            src={imgUrl + record.lawCardImg}
            alt="执法卡图片"
            onError={e => {
              e.target.onerror = null;
              e.target.src = defaultImg;
            }}
          />
        </Popover>
      ),
    },
    {
      title: '地址',
      dataIndex: 'address',
    },
    {
      title: '操作',
      width: 190,
      render: (text, record) => (
        <Fragment>
          <Switch
            checkedChildren="启用"
            unCheckedChildren="禁用"
            checked={record.status === 1}
            onClick={() => this.switchClick(record)}
          />
          <Divider type="vertical" />
          {/*{checkAuth(authority[2]) ? <a onClick={() => this.editData(record)}>编辑</a> :*/}
          {/*    <a onClick={() => this.editData(record)}>详情</a>}*/}
          <Tooltip placement="left" title={checkAuth(authority[2]) ? '编辑' : '详情'}>
            <Button
              onClick={() => this.editData(record)}
              type="primary"
              shape="circle"
              icon={checkAuth(authority[2]) ? 'edit' : 'eye'}
              size="small"
            />
          </Tooltip>
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
    const { defaultFormValue, pageBean } = this.state;
    fileListLength = 0;
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
    // this.getDepartmentList();
  }

  componentWillUnmount() {
    fileListLength = 0;
  }

  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'systemUser/fetch',
      payload: params,
    });
  };

  getDepartmentList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'TransportSystemDepart/fetch',
      payload: {
        pageBean: { page: 1, pageSize: 100, showTotal: true },
      },
    });
  };

  departmentChange = e => {
    this.setState({
      departmentValue: e.indexOf('-4') > -1,
    });
  };

  switchClick = record => {
    const { dispatch, currentUser } = this.props;
    const { defaultFormValue, deptSearch, pageBean } = this.state;
    if (record.status === 1) {
      dispatch({
        type: 'systemUser/forbidden',
        payload: {
          account: record.account,
        },
        callback: () => {
          message.success('禁用成功');
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
          this.getList({ pageBean, querys: arr });
        },
      });
    } else {
      dispatch({
        type: 'systemUser/activate',
        payload: {
          account: record.account,
        },
        callback: () => {
          message.success('启用成功');

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
          this.getList({ pageBean, querys: arr });
        },
      });
    }
  };

  /**
   * 获取用户详情
   * @param record
   */
  editData = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'systemUser/detailData',
      payload: {
        account: record.account,
      },
      callback: res => {
        this.handleUpdateModalVisible(true);
        const departments = res.department ? res.department.split(',') : [];
        this.setState({
          editModalData: res,
          departmentValue: departments.indexOf('-4') > -1,
          fileList: res.lawCardImg
            ? [
                {
                  uid: '-1',
                  name: '当前图片',
                  status: 'done',
                  url: imgUrl + res.lawCardImg,
                },
              ]
            : [],
          lawSignaFileList: res.lawSigna
            ? [
                {
                  uid: '-2',
                  name: '当前图片',
                  status: 'done',
                  url: imgUrl + res.lawSigna,
                },
              ]
            : [],
        });

        this.getSite(res.organId);
      },
    });
  };

  /**
   * 列表分页操作
   * @param pagination
   * @param filtersArg
   * @param sorter
   */
  handleStandardTableChange = pagination => {
    const { currentUser } = this.props;
    const { formValues, defaultFormValue, treeFormValue, deptSearch } = this.state;
    const arr = [];

    arr.unshift(defaultFormValue);

    if (Object.keys(deptSearch).length) {
      arr.push(deptSearch);
    }

    if (JSON.stringify(treeFormValue) !== '{}') {
      arr.push(treeFormValue);
    } else {
      arr.push({
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

    this.getList(params);
  };

  /**
   * 重置查询表单，查询所有数据
   */
  handleFormReset = () => {
    const { form, currentUser } = this.props;
    const { defaultFormValue, pageBean, deptSearch } = this.state;
    form.resetFields();
    this.setState({
      formValues: [],
      treeFormValue: {},
      selectedKeys: [],
    });

    const arr = [defaultFormValue];
    if (Object.keys(deptSearch).length) {
      arr.push(deptSearch);
    }
    this.getList({
      pageBean,
      querys: [
        ...arr,
        {
          property: 'organId',
          value: currentUser.organId,
          group: 'main',
          operation: 'RIGHT_LIKE',
          relation: 'AND',
        },
      ],
    });
  };

  /**
   * 邮箱补全值
   */
  emailInputChange = value => {
    this.setState({
      emailSuffixValue: emailSuffix(value),
    });
  };

  // treeCascaderChange = (value, selectedOptions) => {
  //   console.log(value, selectedOptions);
  // };

  /**
   * 删除
   */
  delBatch = () => {
    const { selectedRows } = this.state;
    if (!selectedRows) return;
    confirm({
      title: '提示',
      content: '您确定要批量删除吗?',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        this.delUtil(`${selectedRows.map(row => row.id).join()},`);
      },
      onCancel() {},
    });
  };

  delUtil = ids => {
    const { dispatch, currentUser } = this.props;
    const { defaultFormValue, deptSearch, pageBean } = this.state;
    dispatch({
      type: 'systemUser/remove',
      payload: {
        ids,
      },
      callback: () => {
        message.success('删除成功');
        this.setState({
          selectedRows: [],
        });

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
        this.getList({ pageBean, querys: arr });
      },
    });
  };

  /**
   * 单个删除
   * @param value
   */
  dataDel(value) {
    this.delUtil(value);
  }

  /**
   * 批量启用
   */
  // eslint-disable-next-line react/sort-comp
  activateBatch = () => {
    const { dispatch, currentUser } = this.props;
    const { selectedRows, defaultFormValue, deptSearch, pageBean } = this.state;
    if (!selectedRows) return;
    const self = this;
    confirm({
      title: '提示',
      content: '您确定要批量启用吗?',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'systemUser/activate',
          payload: {
            account: selectedRows.map(row => row.account).join(),
          },
          callback: () => {
            message.success('启用成功');
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
            this.getList({ pageBean, querys: arr });
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
   * 批量禁用
   */
  forbiddenBatch = () => {
    const { dispatch, currentUser } = this.props;
    const { selectedRows, defaultFormValue, pageBean, deptSearch } = this.state;
    if (!selectedRows) return;
    const self = this;
    confirm({
      title: '提示',
      content: '您确定要批量删禁用吗?',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'systemUser/forbidden',
          payload: {
            account: selectedRows.map(row => row.account).join(),
          },
          callback: () => {
            message.success('禁用成功');

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
            this.getList({ pageBean, querys: arr });

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
   * 导出文件
   */
  importClick = () => {
    this.setState({ importLoading: true });
    const { dispatch } = this.props;
    const { formValues, treeFormValue, defaultFormValue, deptSearch, pageBean } = this.state;
    const arr = [];
    arr.unshift(defaultFormValue);
    if (Object.keys(deptSearch).length) {
      arr.push(deptSearch);
    }
    if (JSON.stringify(treeFormValue) !== '{}') {
      arr.push(treeFormValue);
    }
    dispatch({
      type: 'systemUser/import',
      payload: {
        pageBean,
        querys: Array.from(new Set(arr.concat(formValues))),
      },
      callback: status => {
        if (status === 404) {
          message.error('当前没有数据');
        }
        this.setState({ importLoading: false });
      },
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  /**
   * 条件查询
   * @param e
   */
  handleSearch = e => {
    e.preventDefault();
    const { form, currentUser } = this.props;
    const { treeFormValue, defaultFormValue, pageBean, deptSearch } = this.state;
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
              operation: item === 'departCode' ? 'EQUAL' : 'LIKE',
              relation: 'AND',
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
      if (JSON.stringify(treeFormValue) !== '{}') {
        conditionFilter.push(treeFormValue);
      } else {
        conditionFilter.push({
          property: 'organId',
          value: currentUser.organId,
          group: 'main',
          operation: 'RIGHT_LIKE',
          relation: 'AND',
        });
      }

      this.getList({
        pageBean,
        querys: conditionFilter,
      });
    });
  };

  handleModalVisible = flag => {
    fileListLength = 0;
    this.setState({
      modalVisible: !!flag,
      fullName: '',
    });
    if (!flag) {
      this.setState({
        pinyin: '',
        fileList: [],
        lawSignaFileList: [],
        departmentValue: false,
      });
    }
  };

  handleUpdateModalVisible = flag => {
    fileListLength = 0;
    this.setState({
      UpdateModalVisible: !!flag,
      fullName: '',
    });
    if (!flag) {
      this.setState({
        editModalData: {},
        fileList: [],
        lawSignaFileList: [],
        departmentValue: false,
      });
    }
  };

  /**
   * 添加数据
   * @param fields
   */
  handleAdd = (fields, callback) => {
    const { dispatch, currentUser } = this.props;
    const { defaultFormValue, pageBean, deptSearch, fileList } = this.state;
    // if (!fileList.length) {
    //   message.error('请选择图片');
    //   return;
    // }

    const values = { ...fields };

    values.lawCardImg = fields.lawCardImg ? fields.lawCardImg.file.response.filePath : '';
    values.lawSigna = fields.lawSigna ? fields.lawSigna.file.response.filePath : '';
    values.siteIds = fields.siteIds ? fields.siteIds.join() : '';
    values.staticSite = fields.staticSite ? fields.staticSite.join() : '';
    values.department = fields.department.join();
    // fields.siteIds = (fields.fxczd ? fields.fxczd.concat(fields.jjz).filter(item => item) : [].concat(fields.jjz).filter(item => item)).join();
    dispatch({
      type: 'systemUser/add',
      payload: values,
      callback: () => {
        message.success('添加成功');
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
        this.getList({ pageBean, querys: arr });
        callback && callback();
      },
    });
  };

  /**
   * 更新用户
   * @param fields
   */
  handleUpdate = fields => {
    const { dispatch, currentUser } = this.props;
    const { editModalData, defaultFormValue, deptSearch, pageBean } = this.state;
    const newArr = JSON.parse(JSON.stringify(editModalData));
    const keys = Object.keys(fields);
    if (typeof fields.organId === 'object') {
      fields.organId = fields.organId[0];
    }
    if (typeof fields.lawCardImg === 'object') {
      const { response } = fields.lawCardImg.file;
      fields.lawCardImg = response ? response.filePath : '';
    }
    if (typeof fields.lawSigna === 'object') {
      const { response } = fields.lawSigna.file;
      fields.lawSigna = response ? response.filePath : '';
    }
    for (let i = 0; i < keys.length; i += 1) {
      newArr[keys[i]] = fields[keys[i]];
    }
    if (isTraffic()) {
      newArr.siteIds = fields.siteIds ? fields.siteIds.join() : '';
      newArr.staticSite = fields.staticSite ? fields.staticSite.join() : '';
    }
    newArr.department = fields.department.join();
    this.setState({ editModalData: newArr });
    // newArr.siteIds = Array.from(new Set((fields.fxczd ? fields.fxczd.concat(fields.jjz).filter(item => item) : [].concat(fields.jjz).filter(item => item)))).join()
    dispatch({
      type: 'systemUser/update',
      payload: newArr,
      callback: () => {
        message.success('编辑成功');
        this.handleUpdateModalVisible();

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
        this.getList({ pageBean, querys: arr });
      },
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      // TransportSystemDepart: { data },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={8}>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('account')(<Input addonBefore="登录名" placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('fullname')(<Input addonBefore="姓名" placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('mobile')(<Input addonBefore="电话" placeholder="请输入" />)}
            </FormItem>
          </Col>
          {/* {plan[0].indexOf('-4') > -1 && (
            <Col md={5} sm={24}>
              <div className={publicCss.inputMain}>
                <span
                  style={{ width: '70px', lineHeight: '30px', height: '32px' }}
                  className="ant-input-group-addon"
                >
                  子部门
                </span>
                <FormItem style={{ flex: 1 }}>
                  {getFieldDecorator('departCode')(
                    <Select style={{ width: '100%' }} placeholder="请选择">
                      {data.list.map(item => (
                        <Option key={item.id_}>{item.departName}</Option>
                      ))}
                    </Select>,
                  )}
                </FormItem>
              </div>
            </Col>
          )} */}
          <Col md={4} sm={24}>
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

  setRoleCode = callback => {
    const { fullName } = this.state;
    const { dispatch } = this.props;
    if (!fullName) return message.error('请先输入用户名称');
    dispatch({
      type: 'system/getPinyin',
      payload: {
        chinese: fullName,
        type: 2,
      },
      callback: code => {
        this.setState({ pinyin: code });
        callback && callback(code);
      },
    });
  };

  getFullName = e => {
    this.setState({ fullName: e.target.value });
  };

  treeSelectChange = (value, label) => {
    const { editModalData } = this.state;
    const detail = JSON.parse(JSON.stringify(editModalData));
    detail.siteIds = '';
    detail.staticSite = '';
    this.setState({ editModalData: detail });

    this.getSite(value);
  };

  getSite = value => {
    const { dispatch } = this.props;
    dispatch({
      type: 'systemUser/getSite',
      payload: {
        pageBean: {
          page: 1,
          pageSize: 1000,
          showTotal: true,
        },
        querys: [
          {
            property: 'status',
            value: '0',
            group: 'main',
            operation: 'NOT_EQUAL',
            relation: 'AND',
          },
          {
            property: 'organId',
            value,
            group: 'main',
            operation: 'RIGHT_LIKE',
            relation: 'AND',
          },
        ],
      },
    });
  };

  /**
   * 树形选择
   * @param selectedKeys
   * @param info
   */
  onSelect = selectedKeys => {
    if (!selectedKeys[0]) return;
    this.setState({ selectedKeys });
    const { formValues, defaultFormValue, pageBean, deptSearch } = this.state;
    let arr = [];
    const treeFormValue = {
      property: 'organId',
      value: selectedKeys[0],
      group: 'main',
      operation: 'RIGHT_LIKE',
      relation: 'AND',
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

  uploadChange = info => {
    if (info.file.status === 'done') {
      if (info.file.response.code === 200) {
        message.success('上传成功');
        this.setState({ fileList: info.fileList });
      } else {
        message.error(info.file.response.code.msg);
      }
    } else if (info.file.status === 'error') {
      message.error('上传失败');
    } else if (info.file.status === 'removed') {
      this.setState({ fileList: info.fileList });
    }
  };

  lawSignaUploadChange = info => {
    if (info.file.status === 'done') {
      if (info.file.response.code === 200) {
        message.success('上传成功');
        this.setState({ lawSignaFileList: info.fileList });
      } else {
        message.error(info.file.response.code.msg);
      }
    } else if (info.file.status === 'error') {
      message.error('上传失败');
    } else if (info.file.status === 'removed') {
      this.setState({ lawSignaFileList: info.fileList });
    }
  };

  render() {
    const {
      system: { treeList },
      systemUser: { data, siteList },
      TransportSystemDepart,
      loading,
      systemLoading,
    } = this.props;
    const {
      expandCheckKeys,
      selectedRows,
      modalVisible,
      UpdateModalVisible,
      editModalData,
      importLoading,
      pinyin,
      selectedKeys,
      emailSuffixValue,
      fileList,
      departmentValue,
      lawSignaFileList,
    } = this.state;

    const baseMethods = {
      lawSignaFileList,
      lawSignaUploadChange: this.lawSignaUploadChange,
      departmentList: TransportSystemDepart.data,
      departmentValue,
      departmentChange: this.departmentChange,
      uploadChange: this.uploadChange,
      treeSelectChange: this.treeSelectChange,
      siteList,
      fileList,
      treeList,
      emailSuffixValue,
      emailInputChange: this.emailInputChange,
    };

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      // treeCascaderChange: this.treeCascaderChange,
      setRoleCode: this.setRoleCode,
      pinyin,
      getFullName: this.getFullName,
      loading: systemLoading,
      handleDepartVisible: this.handleDepartVisible,
    };

    const parentUpdateMethods = {
      handleUpdate: this.handleUpdate,
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      editModalData,
    };

    // table 表格配置
    const tableConfig = {
      tableAlert: true,
      selectedRows,
      size: 'middle',
      loading,
      data,
      columns: this.columns,
      onSelectRow: this.handleSelectRows,
      onChange: this.handleStandardTableChange,
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
                  <Button
                    icon="plus"
                    style={{ display: checkAuth(authority[1]) ? 'inline' : 'none' }}
                    type="primary"
                    onClick={() => this.handleModalVisible(true)}
                  >
                    新增
                  </Button>
                  {selectedRows.length > 0 && (
                    <span>
                      {checkAuth(authority[3]) ? (
                        <Button type="danger" onClick={this.delBatch}>
                          批量删除
                        </Button>
                      ) : null}
                      <Button onClick={this.activateBatch}>批量启用</Button>
                      <Button onClick={this.forbiddenBatch}>批量禁用</Button>
                    </span>
                  )}
                  {/* {checkAuth(authority[4]) ? ( */}
                  <Button
                    className={publicCss.import}
                    icon="import"
                    onClick={this.importClick}
                    loading={importLoading}
                    style={{ float: 'right' }}
                  >
                    导出
                  </Button>
                  {/* ) : null} */}
                  <div style={{ clear: 'both' }}></div>
                </div>
                {/*{checkAuth(authority[3]) ? <StandardTable*/}
                {/*    {...tableConfig}*/}
                {/*/> : <StandardTable*/}
                {/*    rowSelection={null}*/}
                {/*    {...tableConfig}*/}
                {/*/>}*/}
                <StandardTable {...tableConfig} />
              </div>
            </Card>
          </div>
        </div>
        <CreateForm {...baseMethods} {...parentMethods} modalVisible={modalVisible} />
        {UpdateModalVisible && JSON.stringify(editModalData) !== '{}' ? (
          <UpdateForm
            {...baseMethods}
            {...parentUpdateMethods}
            UpdateModalVisible={UpdateModalVisible}
          />
        ) : null}
      </Fragment>
    );
  }
}

export default TableList;
