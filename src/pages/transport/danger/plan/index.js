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
  Tooltip,
  message,
  Popconfirm,
  Dropdown,
  Menu,
  Icon,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import CreateModal from './Component/CreateModal';
import UpdateModal from './Component/UpdateModal';
import DetailModal from './Component/DetailModal';

import styles from '../../../style/style.less';

const FormItem = Form.Item;

const stateMap = ['待发布', '已发布', '待审核', '审核通过', '审核不通过'];

/* eslint react/no-multi-comp:0 */
@connect(({ TransportDangerPlan, loading }) => ({
  TransportDangerPlan,
  loading: loading.models.TransportDangerPlan,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    detailVisible: false,
    updateModalVisible: false,
    selectedRows: [],
    formValues: [],
    detail: {},
    pageBean: { page: 1, pageSize: 10, showTotal: true },
  };

  columns = [
    {
      title: '督查名称',
      dataIndex: 'name',
    },
    {
      title: '督查标题',
      dataIndex: 'title',
    },
    {
      title: '督查对象',
      dataIndex: 'companyName',
    },
    {
      title: '创建时间',
      width: 170,
      dataIndex: 'createTime',
    },
    {
      title: '状态',
      width: 100,
      dataIndex: 'status',
      render: val => stateMap[val - 1],
    },
    {
      title: '操作',
      width: 130,
      render: (text, record) => {
        let html = null;
        const detailBtn = (
          <Tooltip placement="left" title="详情">
            <Button
              onClick={() => this.showDetailModal(record.id)}
              type="primary"
              shape="circle"
              icon="eye"
              size="small"
            />
          </Tooltip>
        );
        if (record.status === 1) {
          html = (
            <Fragment>
              <Popconfirm
                title="是否发布数据?"
                onConfirm={() => this.pushData(record.id)}
                okText="确定"
                cancelText="取消"
              >
                <Tooltip placement="left" title="发布">
                  <Button shape="circle" icon="to-top" size="small" />
                </Tooltip>
              </Popconfirm>
              <Divider type="vertical" />

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
          );
        } else if (record.status === 3) {
          const menu = (
            // eslint-disable-next-line react/jsx-no-bind
            <Menu onClick={this.toExamine.bind(this, record.id)}>
              <Menu.Item key="4">通过</Menu.Item>
              <Menu.Item key="5">不通过</Menu.Item>
            </Menu>
          );
          html = (
            <Fragment>
              {detailBtn}
              <Divider type="vertical" />
              <Dropdown overlay={menu}>
                <Button size="small">
                  审核 <Icon type="down" />
                </Button>
              </Dropdown>
            </Fragment>
          );
        } else {
          html = detailBtn;
        }
        return html;
      },
    },
  ];

  componentDidMount() {
    const { pageBean } = this.state;
    this.getList({ pageBean });
  }

  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'TransportDangerPlan/fetch',
      payload: params,
    });
  };

  toExamine = (id, e) => {
    const { key } = e;
    const str = key === '4' ? '审核通过' : '审核不通过';
    Modal.confirm({
      title: '提示',
      content: `${str}？`,
      onOk: () => this.pushPublic(id, key, '操作成功'),
    });
  };

  pushData = id => {
    this.pushPublic(id, 2, '发布成功');
  };

  pushPublic = (id, type, tip) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'TransportDangerPlan/updateStatus',
      payload: {
        type,
        id,
      },
      callback: () => {
        message.success(tip, () => {
          const { pageBean, formValues } = this.state;
          this.getList({ pageBean, querys: formValues });
        });
      },
    });
  };

  showUpdateModal = detail => this.setState({ detail }, () => this.handleUpdateModalVisible(true));

  showDetailModal = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'TransportDangerPlan/detail',
      payload: id,
      callback: detail => this.setState({ detail }, () => this.handleDetailVisible(true)),
    });
  };

  /**
   * @description 单个删除
   * @param id {number}
   */
  dataDel = id => {
    this.delUtil(id);
  };

  batchDel = () => {
    const { selectedRows } = this.state;
    if (!selectedRows.length) return;
    Modal.confirm({
      title: '提示',
      content: '是否删除数据？',
      onOk: () => {
        const ids = selectedRows.map(item => item.id);
        this.delUtil(ids.join(), () => {
          this.setState({ selectedRows: [] });
        });
      },
    });
  };

  /**
   * @description 删除公用
   * @param id {number}
   * @callback {function}
   */
  delUtil = (ids, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'TransportDangerPlan/remove',
      payload: { ids },
      callback: () => {
        message.success('删除成功');
        const { pageBean } = this.state;
        this.getList({ pageBean });
        if (callback) callback();
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
    const { pageBean } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        name: fieldsValue.MC,
        title: fieldsValue.BT,
      };
      const objKeys = Object.keys(values);
      const condition = objKeys.map(item => {
        return values[item]
          ? {
              property: item,
              value: values[item],
              group: 'main',
              operation: 'LIKE',
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
      this.setState({
        detail: {},
      });
    }
  };

  handleDetailVisible = flag => {
    this.setState({
      detailVisible: !!flag,
    });
    if (!flag) {
      this.setState({
        detail: {},
      });
    }
  };

  /**
   * @description 窗口关闭后回调
   */
  modalCallback = () => {
    const { pageBean } = this.state;
    this.getList({ pageBean });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={16}>
          <Col md={6} sm={24}>
            <FormItem>
              {getFieldDecorator('MC')(<Input addonBefore="名称" placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem>
              {getFieldDecorator('BT')(<Input addonBefore="标题" placeholder="请输入" />)}
            </FormItem>
          </Col>
          {/* <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>,
              )}
            </FormItem>
          </Col> */}
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

  render() {
    const {
      TransportDangerPlan: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, detail, detailVisible } = this.state;

    const parentMethods = {
      modalCallback: this.modalCallback,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      detail,
      modalCallback: this.modalCallback,
      handleModalVisible: this.handleUpdateModalVisible,
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
              {selectedRows.length > 0 && (
                <Button type="danger" onClick={this.batchDel}>
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
        <CreateModal {...parentMethods} modalVisible={modalVisible} />
        {updateModalVisible && Object.keys(detail).length && (
          <UpdateModal {...updateMethods} modalVisible={updateModalVisible} />
        )}
        {detailVisible && Object.keys(detail).length && (
          <DetailModal
            detail={detail}
            modalVisible={detailVisible}
            handleModalVisible={this.handleDetailVisible}
          />
        )}
      </Fragment>
    );
  }
}

export default TableList;
