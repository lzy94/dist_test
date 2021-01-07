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
  Divider,
  Tree,
  Spin,
  Popover,
  Tooltip,
  Descriptions,
  message,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import { Redirect } from 'umi';

import Zmage from 'react-zmage';
import { checkAuth, imgUrl } from '@/utils/utils';
import styles from '../../../style/style.less';
import publicCss from '../../../style/public.less';
import defaultImg from '@/assets/defaultImg.png';
import themeStyle from '@/pages/style/theme.less';

const FormItem = Form.Item;

// 当前页面所有权限
const authority = ['/lawenfor/personnel', '/lawenfor/personnel/proof'];

/**
 * 用户详情 modal
 * @type {ConnectedComponentClass<function(*): *, Omit<FormComponentProps<any>, keyof WrappedFormInternalProps>>}
 */
const UpdateForm = Form.create()(props => {
  const {
    UpdateModalVisible,
    handleUpdateModalVisible,
    treeList,
    editModalData,
    siteList,
    logs,
  } = props;

  const formatSiteName = (code, list) => {
    const siteName = [];
    if (!list) return '';
    for (let j = 0; j < code.length; j++) {
      for (let i = 0; i < list.length; i++) {
        if (code[j] === list[i].value) {
          siteName.push(list[i].title);
          break;
        }
      }
    }
    return siteName.join('，');
  };

  const formatArea = (code, list) => {
    let areaName = '';
    if (!list) return '';
    for (let i = 0; i < list.length; i++) {
      if (code === list[i].value) {
        areaName = list[i].title;
        break;
      }
      if (JSON.stringify(list[i].children) !== '[]') {
        areaName = formatArea(code, list[i].children);
      }
    }
    return areaName;
  };

  const log = logs[0] ? logs[0] : {};

  return (
    <Modal
      destroyOnClose
      title="详情"
      className={themeStyle.myModal + ' ' + themeStyle.modalbody}
      visible={UpdateModalVisible}
      onCancel={() => handleUpdateModalVisible()}
      footer={null}
      width="900px"
    >
      <div className={themeStyle.detailMsg}>
        <div style={{ padding: 20 }}>
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="名称">{editModalData.fullname}</Descriptions.Item>
            <Descriptions.Item label="证件号码">{editModalData.idCard}</Descriptions.Item>
            <Descriptions.Item label="登录账号">{editModalData.account}</Descriptions.Item>
            <Descriptions.Item label="邮箱">{editModalData.email}</Descriptions.Item>
            <Descriptions.Item label="电话号码">{editModalData.mobile}</Descriptions.Item>
            <Descriptions.Item label="区域">
              {formatArea(editModalData.organId, treeList)}
            </Descriptions.Item>
            <Descriptions.Item label="非现场站点">
              {formatSiteName(editModalData.siteIds.split(','), siteList[0])}
            </Descriptions.Item>
            <Descriptions.Item label="精简站">
              {formatSiteName(editModalData.staticSite.split(','), siteList[1])}
            </Descriptions.Item>
            <Descriptions.Item label="执法证件号">{editModalData.lawCard}</Descriptions.Item>
            <Descriptions.Item label="执法证件图片">
              <div style={{ overflow: 'hidden', width: 100, height: 100 }}>
                <Zmage
                  backdrop="rgba(255,255,255,.3)"
                  src={imgUrl + editModalData.lawCardImg}
                  alt="执法证件图片"
                  style={{
                    height: '100px',
                  }}
                />
              </div>
            </Descriptions.Item>
            <Descriptions.Item label="职务"> {editModalData.position}</Descriptions.Item>
            <Descriptions.Item label="地址">{editModalData.address}</Descriptions.Item>
          </Descriptions>
          <div style={{ marginTop: 10 }}>&nbsp;</div>
          <Descriptions bordered={true} title="执法数据" size="small">
            <Descriptions.Item label="执法总数" span={3}>
              {' '}
              {log.TOTAL}
            </Descriptions.Item>
            <Descriptions.Item label="初审"> {log.PENDINGVERIFY}</Descriptions.Item>
            <Descriptions.Item label="复审"> {log.VERIFYPASS}</Descriptions.Item>
            <Descriptions.Item label="签批"> {log.SIGNINGPASS}</Descriptions.Item>
            <Descriptions.Item label="结案"> {log.ARCHIVEDATE}</Descriptions.Item>
            <Descriptions.Item label="免处罚"> {log.PENALTYDATE}</Descriptions.Item>
            <Descriptions.Item label="无效数据"> {log.INCALIDDATE}</Descriptions.Item>
          </Descriptions>
        </div>
      </div>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ system, systemUser, user, loading }) => ({
  system,
  systemUser,
  currentUser: user.currentUser,
  loading: loading.models.systemUser,
  systemLoading: loading.models.system,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    UpdateModalVisible: false,
    formValues: [],
    logs: [],
    treeFormValue: {},
    defaultFormValue: [
      {
        property: 'isDelete',
        value: '0',
        group: 'main',
        operation: 'NOT_EQUAL',
        relation: 'AND',
      },
      {
        property: 'lawCard',
        value: '',
        group: 'main',
        operation: 'NOTNULL',
        relation: 'AND',
      },
    ],
    selectedKeys: [],
    editModalData: {},
    importLoading: false,
    expandCheckKeys: [],
  };

  columns = [
    {
      title: '姓名',
      dataIndex: 'fullname',
    },
    {
      title: '电话',
      dataIndex: 'mobile',
    },
    {
      title: '职务',
      dataIndex: 'position',
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
              onError={e => {
                e.target.onerror = null;
                e.target.src = defaultImg;
              }}
              alt="执法卡图片"
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
      title: '机构',
      dataIndex: 'organName',
    },
    {
      title: '操作',
      width: '70px',
      render: (text, record) => (
        <Fragment>
          <Tooltip placement="left" title="详情">
            <Button
              onClick={() => this.editData(record)}
              type="primary"
              shape="circle"
              icon="eye"
              size="small"
            />
          </Tooltip>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    if (!checkAuth(authority[0])) return;
    const { dispatch } = this.props;
    const { defaultFormValue } = this.state;
    const arr = JSON.parse(JSON.stringify(defaultFormValue));
    const organId = localStorage.getItem('organId');
    arr.push({
      property: 'organId',
      value: organId,
      group: 'main',
      operation: 'RIGHT_LIKE',
      relation: 'AND',
    });
    dispatch({
      type: 'systemUser/fetch',
      payload: {
        pageBean: {
          page: 1,
          pageSize: 10,
          showTotal: true,
        },
        querys: arr,
      },
    });
  }

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
        this.setState({
          editModalData: res,
        });
        this.getLogs(res.id);
        this.getSite(res.organId);
      },
    });
  };

  getLogs = userId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'systemUser/lawLogs',
      payload: { userId },
      callback: res => {
        this.setState({ logs: res });
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
    const { dispatch, currentUser } = this.props;
    const { formValues, defaultFormValue, treeFormValue } = this.state;
    const arr = defaultFormValue;
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
    dispatch({
      type: 'systemUser/fetch',
      payload: params,
    });
  };

  /**
   * 重置查询表单，查询所有数据
   */
  handleFormReset = () => {
    const { form, dispatch, currentUser } = this.props;
    const { defaultFormValue } = this.state;
    const arr = JSON.parse(JSON.stringify(defaultFormValue));
    form.resetFields();
    this.setState({
      formValues: [],
      treeFormValue: {},
      selectedKeys: [],
    });
    arr.push({
      property: 'organId',
      value: currentUser.organId,
      group: 'main',
      operation: 'RIGHT_LIKE',
      relation: 'AND',
    });
    dispatch({
      type: 'systemUser/fetch',
      payload: {
        pageBean: {
          page: 1,
          pageSize: 10,
          showTotal: true,
        },
        querys: arr,
      },
    });
  };

  isOragId = (data, obj) => {
    let check = false;
    const list = [...data];
    for (let i = 0; i < list.length; i += 1) {
      console.log(list[i].property === 'organId');
      if (list[i].property === 'organId') {
        check = true;
        list.splice(i, 1, obj);
        break;
      }
    }
    if (!check) {
      list.push(obj);
    }
    return list;
  };

  /**
   * 导出文件
   */
  importClick = () => {
    this.setState({ importLoading: true });
    const { dispatch, currentUser } = this.props;
    const { formValues, treeFormValue, defaultFormValue } = this.state;
    const arr = [...defaultFormValue];
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
    dispatch({
      type: 'systemUser/import',
      payload: {
        pageBean: {
          page: 0,
          pageSize: 10,
          showTotal: true,
        },
        querys: Array.from(new Set(arr.concat(formValues))),
      },
      callback: status => {
        if (status === 404) {
          message.error('暂无数据');
        }
        this.setState({ importLoading: false });
      },
    });
  };

  /**
   * 条件查询
   * @param e
   */
  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form, currentUser } = this.props;
    const { treeFormValue, defaultFormValue } = this.state;
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
      dispatch({
        type: 'systemUser/fetch',
        payload: {
          pageBean: {
            page: 1,
            pageSize: 10,
            showTotal: true,
          },
          querys: defaultFormValue.concat(conditionFilter),
        },
      });
    });
  };

  handleUpdateModalVisible = flag => {
    this.setState({
      UpdateModalVisible: !!flag,
    });
    if (!!!flag) {
      this.setState({ editModalData: {} });
    }
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { importLoading } = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 16, xl: 16 }}>
          <Col md={6} sm={24}>
            <FormItem>
              {getFieldDecorator('fullname')(<Input addonBefore="姓名" placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem>
              {getFieldDecorator('mobile')(<Input addonBefore="电话" placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <span className={styles.submitButtons} style={{ float: 'right' }}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <Button
                className={publicCss.import}
                icon="import"
                onClick={this.importClick}
                loading={importLoading}
                style={{ marginLeft: 8 }}
              >
                导出
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

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
            value: value,
            group: 'main',
            operation: 'RIGHT_LIKE',
            relation: 'OR',
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
    const { dispatch } = this.props;
    const { formValues, defaultFormValue } = this.state;
    let arr = [...defaultFormValue];
    const treeFormValue = {
      property: 'organId',
      value: selectedKeys[0],
      group: 'main',
      operation: 'RIGHT_LIKE',
      relation: 'AND',
    };
    this.setState({ treeFormValue });
    arr.push(treeFormValue);
    arr = arr.concat(formValues);
    dispatch({
      type: 'systemUser/fetch',
      payload: {
        pageBean: {
          page: 1,
          pageSize: 10,
          showTotal: true,
        },
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

  render() {
    const {
      system: { treeList },
      systemUser: { data, siteList },
      loading,
      systemLoading,
    } = this.props;
    const { expandCheckKeys, UpdateModalVisible, editModalData, selectedKeys, logs } = this.state;

    const parentUpdateMethods = {
      logs,
      treeList,
      editModalData,
      siteList,
      handleUpdateModalVisible: this.handleUpdateModalVisible,
    };

    // table 表格配置
    const tableConfig = {
      selectedRows: 0,
      rowSelection: null,
      size: 'middle',
      loading,
      data,
      logs,
      tableAlert: false,
      columns: this.columns,
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
                <StandardTable {...tableConfig} />
              </div>
            </Card>
          </div>
        </div>

        {UpdateModalVisible && JSON.stringify(editModalData) !== '{}' ? (
          <UpdateForm {...parentUpdateMethods} UpdateModalVisible={UpdateModalVisible} />
        ) : null}
      </Fragment>
    );
  }
}

export default TableList;
