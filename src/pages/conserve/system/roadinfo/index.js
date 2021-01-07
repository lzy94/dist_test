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
  Divider,
  Popconfirm,
  Tooltip,
  Modal,
  message,
  Tree,
} from 'antd';
import CreateModal from './component/createModal';
import UpdateModal from './component/updateModal';
import AddFocus from './component/AddFocus';
import StandardTable from '@/components/StandardTable';

import { roadType } from '@/utils/dictionaries';
import styles from '../../../style/style.less';
import publicCss from '@/pages/style/public.less';
import { getLocalStorage } from '@/utils/utils';

const FormItem = Form.Item;
const { TreeNode } = Tree;
const { Option } = Select;

/* eslint react/no-multi-comp:0 */
@connect(({ system, RoadInfo, loading }) => ({
  system,
  RoadInfo,
  loading: loading.models.RoadInfo,
}))
@Form.create()
class RoadInfo extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    focusVisible: false,
    selectedRows: [],
    formValues: [],
    expandCheckKeys: [],
    selectedKeys: [],
    treeFormValue: {},
    detailID: 0,
    organCode: '',
    pageBean: { page: 1, pageSize: 10, showTotal: true },
    baseOrgan: [],
  };

  columns = [
    {
      title: '公路名称',
      dataIndex: 'roadName',
    },
    {
      title: '公路编号',
      dataIndex: 'roadCode',
    },
    {
      title: '路长',
      dataIndex: 'roadElder',
    },
    {
      title: '职务',
      dataIndex: 'jobTitle',
    },
    {
      title: '公路类型',
      dataIndex: 'roadType',
      render: val => roadType[val - 1],
    },
    {
      title: '里程（km）',
      dataIndex: 'roadMileage',
    },
    {
      title: '起始地',
      dataIndex: 'startAddr',
    },
    {
      title: '结束地',
      dataIndex: 'endAddr',
    },
    {
      title: '操作',
      width: 130,
      render: (text, record) => (
        <Fragment>
          <Tooltip placement="left" title="添加关注点">
            <Button
              onClick={() => this.addFocusModal(record.id)}
              type="primary"
              shape="circle"
              icon="environment"
              size="small"
            />
          </Tooltip>
          <Divider type="vertical" />
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
    const organId = localStorage.getItem('organId');
    const baseOrgan = [
      {
        property: 'organCode',
        value: organId,
        group: 'main',
        operation: 'RIGHT_LIKE',
        relation: 'AND',
      },
    ];
    this.setState({ baseOrgan });
    this.getList({
      pageBean,
      querys: baseOrgan,
    });
  }

  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'RoadInfo/fetch',
      payload: params,
    });
  };

  addFocusModal = id => {
    this.setState({ detailID: id }, () => this.handleFocusVisible(true));
  };

  editData = record => {
    this.setState({ detailID: record.id }, () => this.handleUpdateModalVisible(true));
  };

  dataDel = ids => {
    const { dispatch } = this.props;
    dispatch({
      type: 'RoadInfo/remove',
      payload: {
        ids,
      },
      callback: () => {
        message.success('删除成功');
        this.modalSuccess();
        this.setState({
          selectedRows: [],
        });
      },
    });
  };

  delBatch = () => {
    const { selectedRows } = this.state;
    if (!selectedRows) return;
    const self = this;
    Modal.confirm({
      title: '提示',
      content: '您确定要批量删除吗?',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        self.dataDel(selectedRows.map(row => row.id).join());
      },
    });
  };

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
    form.resetFields();
    this.setState({
      formValues: [],
      selectedRows: [],
      selectedKeys: [],
      treeFormValue: {},
    });
    this.modalSuccess();
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  treeSelectChange = (value, label) => {
    this.setState({ organCode: value });
  };

  handleSearch = e => {
    e.preventDefault();

    const { form } = this.props;
    const { pageBean, organCode, treeFormValue } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
      };
      const objKeys = Object.keys(values);
      const organId = getLocalStorage('organId').toString();
      delete values.name;

      const condition = objKeys.map(item => {
        return values[item]
          ? {
              property: item,
              value: values[item],
              group: 'main',
              operation: item === 'roadType' ? 'EQUAL' : 'LIKE',
              relation: 'AND',
            }
          : '';
      });

      const conditionFilter = condition.filter(item => item);
      this.setState({
        formValues: conditionFilter,
      });
      if (Object.keys(treeFormValue).length) {
        condition.unshift(treeFormValue);
      } else {
        condition.unshift({
          property: 'organCode',
          value: organId,
          group: 'main',
          operation: 'RIGHT_LIKE',
          relation: 'AND',
        });
      }

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
        detailID: 0,
      });
    }
  };

  handleFocusVisible = flag => {
    this.setState({
      focusVisible: !!flag,
    });
    if (!!!flag) {
      this.setState({
        detailID: 0,
      });
    }
  };

  modalSuccess = () => {
    const { pageBean, baseOrgan } = this.state;
    this.getList({ pageBean, querys: baseOrgan });
  };

  /**
   * 渲染树形
   */
  renderTree = () => {
    const {
      system: { treeList },
    } = this.props;
    return this.renderTreeNodes(treeList);
  };

  /**
   * 将数据处理为 nodes
   * @param list
   * @returns {*}
   */
  renderTreeNodes = list => {
    return list.map(item => {
      if (item.children.length) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} key={item.key} />;
    });
  };

  expandCheck = keys => {
    this.setState({ expandCheckKeys: keys });
  };

  onSelect = (selectedKeys, info) => {
    if (!selectedKeys[0]) return;
    const { formValues, pageBean } = this.state;
    const field = JSON.parse(JSON.stringify(formValues));
    const treeFormValue = {
      property: 'organCode',
      value: selectedKeys[0],
      group: 'main',
      operation: 'RIGHT_LIKE',
      relation: 'AND',
    };
    this.setState({ selectedKeys, treeFormValue });
    field.unshift(treeFormValue);

    this.getList({ pageBean, querys: field });
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
              {getFieldDecorator('roadName')(<Input addonBefore="公路名称" placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem>
              {getFieldDecorator('roadCode')(<Input addonBefore="公路编号" placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <div className={publicCss.inputMain}>
              <span
                style={{ width: '80px', lineHeight: '30px', height: '32px' }}
                className="ant-input-group-addon"
              >
                公路类型
              </span>
              <FormItem style={{ flex: 1 }}>
                {getFieldDecorator('roadType')(
                  <Select placeholder="请选择" style={{ width: '100%' }}>
                    {roadType.map((item, index) => (
                      <Option value={index + 1} key={index}>
                        {item}
                      </Option>
                    ))}
                  </Select>,
                )}
              </FormItem>
            </div>
          </Col>
          <Col md={6} sm={24}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      RoadInfo: { data },
      system: { treeList },
      loading,
    } = this.props;
    const {
      focusVisible,
      selectedRows,
      modalVisible,
      updateModalVisible,
      detailID,
      selectedKeys,
      expandCheckKeys,
    } = this.state;

    const parentMethods = {
      modalSuccess: this.modalSuccess,
      handleModalVisible: this.handleModalVisible,
    };

    const parentUpdateMethods = {
      id: detailID,
      modalSuccess: this.modalSuccess,
      handleModalVisible: this.handleUpdateModalVisible,
    };

    const focusMethods = {
      id: detailID,
      handleModalVisible: this.handleFocusVisible,
    };

    return (
      <Fragment>
        <div className={styles.tableMain}>
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
              {this.renderTree()}
            </Tree>
          </div>
          <div className={styles.rightTable}>
            <Card bordered={false} style={{ height: '100%' }}>
              <div className={styles.tableList}>
                <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
                <div className={styles.tableListOperator}>
                  <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                    新建
                  </Button>
                  {selectedRows.length > 0 && (
                    <Button type="danger" onClick={this.delBatch}>
                      批量删除
                    </Button>
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
          </div>
        </div>

        <CreateModal modalVisible={modalVisible} {...parentMethods} />
        {updateModalVisible && detailID ? (
          <UpdateModal modalVisible={updateModalVisible} {...parentUpdateMethods} />
        ) : null}
        {focusVisible && detailID ? (
          <AddFocus modalVisible={focusVisible} {...focusMethods} />
        ) : null}
      </Fragment>
    );
  }
}

export default RoadInfo;
