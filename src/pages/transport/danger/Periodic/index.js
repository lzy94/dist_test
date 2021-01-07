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
} from 'antd';
import StandardTable from '@/components/StandardTable';
import CreateModal from './Component/CreateModal';
import UpdateModal from './Component/UpdateModal';
import DetailModal from './Component/DetailModal';

import { typeNames } from '@/utils/dictionaries';

import styles from '../../../style/style.less';

const FormItem = Form.Item;

const stateMap = ['待发布', '已发布'];

/* eslint react/no-multi-comp:0 */
@connect(({ TransportDangerPeriodic, loading }) => ({
  TransportDangerPeriodic,
  loading: loading.models.TransportDangerPeriodic,
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
      title: '类别',
      dataIndex: 'type',
      render: val => typeNames[val - 1],
    },
    {
      title: '状态',
      width: 100,
      dataIndex: 'status',
      render: val => stateMap[val - 1],
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '操作',
      width: 130,
      render: (text, record) =>
        record.status === 1 ? (
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
        ) : (
          <Tooltip placement="left" title="详情">
            <Button
              onClick={() => this.showDetailModal(record)}
              type="primary"
              shape="circle"
              icon="eye"
              size="small"
            />
          </Tooltip>
        ),
    },
  ];

  componentDidMount() {
    const { pageBean } = this.state;
    this.getList({ pageBean });
  }

  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'TransportDangerPeriodic/fetch',
      payload: params,
    });
  };

  pushData = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'TransportDangerPeriodic/updateStatus',
      payload: {
        type: 2,
        id,
      },
      callback: () => {
        message.success('发布成功', () => {
          const { pageBean, formValues } = this.state;
          this.getList({ pageBean, querys: formValues });
        });
      },
    });
  };

  showUpdateModal = detail => this.setState({ detail }, () => this.handleUpdateModalVisible(true));

  showDetailModal = detail => this.setState({ detail }, () => this.handleDetailVisible(true));

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
      type: 'TransportDangerPeriodic/remove',
      payload: { ids },
      callback: () => {
        message.success('删除成功', () => {
          const { pageBean } = this.state;
          this.getList({ pageBean });
        });
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
        <Row gutter={{ md: 8, lg: 16, xl: 16 }}>
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
      TransportDangerPeriodic: { data },
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
