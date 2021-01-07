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
  Tooltip,
  TreeSelect,
  Spin,
  Tree,
  Divider,
  Descriptions,
} from 'antd';
import { Redirect } from 'umi';
import StandardTable from '@/components/StandardTable';
import { checkAuth } from '@/utils/utils';

import styles from '../../../style/style.less';
import themeStyle from '@/pages/style/theme.less';

const FormItem = Form.Item;

const authority = ['/comquery/source'];

const UpdateForm = Form.create()(props => {
  const { modalVisible, handleModalVisible, treeList, detail } = props;
  let areaName = '';
  const getName = (organId, list) => {
    for (let i = 0; i < list.length; i++) {
      if (organId === list[i].value) {
        areaName = list[i].title;
        break;
      }
      getName(organId, list[i].children);
    }
  };
  getName(detail.organId, treeList);

  return (
    <Modal
      destroyOnClose
      title="源头企业详情"
      className={themeStyle.myModal + ' ' + themeStyle.modalbody}
      visible={modalVisible}
      onCancel={() => handleModalVisible()}
      width={800}
      footer={null}
    >
      <div className={themeStyle.detailMsg}>
        <div style={{ padding: 20 }}>
          <Descriptions bordered={true} size="small" column={2}>
            <Descriptions.Item label="企业名称">{detail.companyName}</Descriptions.Item>
            <Descriptions.Item label="企业编码">{detail.siteCode}</Descriptions.Item>
            <Descriptions.Item label="企业联系人">{detail.contactMan}</Descriptions.Item>
            <Descriptions.Item label="企业号码">{detail.companyTel}</Descriptions.Item>
            <Descriptions.Item label="监管单位">{detail.supervisionCompany}</Descriptions.Item>
            <Descriptions.Item label="监管责任人">{detail.supervisionMan}</Descriptions.Item>
            <Descriptions.Item label="监管人电话">{detail.supervisionTel}</Descriptions.Item>
            <Descriptions.Item label="年货运吞吐量">{detail.throughput}</Descriptions.Item>
            <Descriptions.Item label="所在道路">{detail.whereLoad}</Descriptions.Item>
            <Descriptions.Item label="经度">{detail.longitude}</Descriptions.Item>
            <Descriptions.Item label="纬度">{detail.latitude}</Descriptions.Item>
            <Descriptions.Item label="行政区域">{areaName}</Descriptions.Item>
            <Descriptions.Item label="企业地址">{detail.address}</Descriptions.Item>
          </Descriptions>
        </div>
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
    selectedRows: [],
    formValues: [],
    orangValue: '',
    updateModalVisible: false,
    treeFormValue: {},
    selectedKeys: [],
    expandCheckKeys: [],
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
      width: 80,
      render: (text, record) => (
        <Fragment>
          <Tooltip placement="left" title="详情">
            <Button
              onClick={() => this.showUpdateModal(record.id)}
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

  handleStandardTableChange = pagination => {
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

  handleUpdateModalVisible = flag => {
    this.setState({
      updateModalVisible: !!flag,
    });
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    const { pageBean, detail } = this.state;
    const newData = JSON.parse(JSON.stringify(detail));
    const keys = Object.keys(fields);
    fields.organId = fields.organId.join();
    for (let i = 0; i < keys.length; i += 1) {
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
        this.handleModalVisible();
      },
    });
  };

  /**
   * 树形选择
   * @param selectedKeys
   * @param info
   */
  onSelect = (selectedKeys, info) => {
    if (!selectedKeys[0]) return;
    this.setState({ selectedKeys });
    const { dispatch } = this.props;
    const { formValues, pageBean } = this.state;
    let arr = [];
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
        <Row gutter={16}>
          <Col md={5} sm={12}>
            <FormItem>{getFieldDecorator('siteCode')(<Input addonBefore="企业编码" />)}</FormItem>
          </Col>
          <Col md={5} sm={12}>
            <FormItem>
              {getFieldDecorator('companyName')(<Input addonBefore="企业名称" />)}
            </FormItem>
          </Col>
          <Col md={5} sm={12}>
            <FormItem>{getFieldDecorator('address')(<Input addonBefore="地址" />)}</FormItem>
          </Col>
          <Col md={5} sm={12}>
            <FormItem>
              {getFieldDecorator('throughput')(<Input addonBefore="年货运吞吐量" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={12}>
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
      system: { treeList },
      Source: { data },
      loading,
      systemLoading,
    } = this.props;
    const { selectedRows, updateModalVisible, detail, expandCheckKeys, selectedKeys } = this.state;
    const updateMethods = {
      handleUpdate: this.handleUpdate,
      handleModalVisible: this.handleUpdateModalVisible,
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
                <StandardTable
                  selectedRows={selectedRows}
                  rowSelection={null}
                  loading={loading}
                  data={data}
                  size="middle"
                  tableAlert={false}
                  columns={this.columns}
                  onSelectRow={this.handleSelectRows}
                  onChange={this.handleStandardTableChange}
                />
              </div>
            </Card>
          </div>
        </div>

        {updateModalVisible && JSON.stringify(detail) !== '{}' ? (
          <UpdateForm {...updateMethods} modalVisible={updateModalVisible} />
        ) : null}
      </Fragment>
    );
  }
}

export default TableList;
