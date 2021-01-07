import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, message, Divider, Modal, Tooltip } from 'antd';
import StandardTable from '@/components/StandardTable';
import CreateData from './component/CreateData';
import UpdateData from './component/UpdateData';
import CreateForm from './component/CreateForm';
import styles from '../../../style/style.less';

const FormItem = Form.Item;

/* eslint react/no-multi-comp:0 */
@connect(({ ConserveSystemFrom, loading }) => ({
  ConserveSystemFrom,
  loading: loading.models.ConserveSystemFrom,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    createModalVisible: false,
    updateModalVisible: false,
    selectedRows: [],
    formValues: [],
    detailID: '',
    detail: {},
    pageBean: { page: 1, pageSize: 10, showTotal: true },
  };

  columns = [
    {
      title: '表号',
      dataIndex: 'tableNumber',
    },
    {
      title: '审批机构',
      dataIndex: 'approveOrg',
    },
    {
      title: '批准文号',
      dataIndex: 'approveNumber',
    },
    {
      title: '年份',
      dataIndex: 'formYears',
    },
    {
      title: '有效期',
      dataIndex: 'expirationDate',
    },
    {
      title: '操作',
      width: 100,
      render: (text, record) => (
        <Fragment>
          <Tooltip placement="left" title="公路技术状况统计表">
            <Button
              onClick={() => this.showRoadForm(record.id)}
              type="primary"
              shape="circle"
              icon="table"
              size="small"
            />
          </Tooltip>
          <Divider type="vertical" />
          <Tooltip placement="left" title="编辑">
            <Button
              onClick={() => this.showDetail(record)}
              type="primary"
              shape="circle"
              icon="edit"
              size="small"
            />
          </Tooltip>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { pageBean } = this.state;
    this.getList({ pageBean });
  }

  showRoadForm = id => {
    this.setState({ detailID: id }, () => this.handleModalVisible(true));
  };

  showDetail = detail => this.setState({ detail }, () => this.handleUpdateModalVisible(true));

  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ConserveSystemFrom/fetch',
      payload: params,
    });
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
      type: 'ConserveSystemFrom/remove',
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
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { pageBean } = this.state;
      const values = {
        formYears: fieldsValue.nf,
        approveOrg: fieldsValue.spjg,
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
    if (!flag) {
      this.setState({ detailID: '' });
    }
  };

  handleCreateModalVisible = flag => {
    this.setState({
      createModalVisible: !!flag,
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
              {getFieldDecorator('nf')(<Input placeholder="请输入" addonBefore="年份" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem>
              {getFieldDecorator('spjg')(<Input placeholder="请输入" addonBefore="审批机构" />)}
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

  render() {
    const {
      ConserveSystemFrom: { data },
      loading,
    } = this.props;
    const {
      selectedRows,
      modalVisible,
      updateModalVisible,
      detail,
      detailID,
      createModalVisible,
    } = this.state;

    const parentMethods = {
      detailID,
      handleModalVisible: this.handleModalVisible,
    };

    const createMethods = {
      modalCallback: this.modalCallback,
      handleModalVisible: this.handleCreateModalVisible,
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
              <Button
                icon="plus"
                type="primary"
                onClick={() => this.handleCreateModalVisible(true)}
              >
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
        <CreateData {...createMethods} modalVisible={createModalVisible} />
        {updateModalVisible && Object.keys(detail).length && (
          <UpdateData {...updateMethods} modalVisible={updateModalVisible} />
        )}
        {modalVisible && detailID && <CreateForm {...parentMethods} modalVisible={modalVisible} />}
      </Fragment>
    );
  }
}

export default TableList;
