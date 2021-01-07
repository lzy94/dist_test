import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Divider,
  Tooltip,
  Popconfirm,
  message,
  Modal,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import CreateModal from './Component/CreateModal';
import UpdateModal from './Component/UpdateModal';

import styles from '../../../style/style.less';

const FormItem = Form.Item;

/* eslint react/no-multi-comp:0 */
@connect(({ BuildSafetyResponsible, loading }) => ({
  BuildSafetyResponsible,
  loading: loading.models.BuildSafetyResponsible,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    selectedRows: [],
    formValues: [],
    detail: {},
    pageBean: { page: 1, pageSize: 10, showTotal: true },
  };

  columns = [
    {
      title: '项目名称',
      dataIndex: 'buildProjectName',
    },
    {
      title: '法定代表人',
      dataIndex: 'projectLegalPerson',
    },
    {
      title: '项目负责人',
      dataIndex: 'projectManager',
    },
    {
      title: '代理建设管理单位名称',
      dataIndex: 'buildUnitName',
    },
    {
      title: '法定代表人',
      dataIndex: 'buildLegalPerson',
    },
    {
      title: '项目负责人',
      dataIndex: 'buildProjectManager',
    },
    {
      title: '勘察单位',
      dataIndex: 'surveyUnitName',
    },
    {
      title: '法定代表人',
      dataIndex: 'surveyLegalPerson',
    },
    {
      title: '项目负责人',
      dataIndex: 'surveyProjectManager',
    },
    {
      title: '操作',
      width: 100,
      render: (text, record) => (
        <Fragment>
          <Tooltip placement="left" title="编辑">
            <Button
              onClick={() => this.showDetailModal(record.id)}
              type="primary"
              shape="circle"
              icon="file-search"
              size="small"
            />
          </Tooltip>
          <Divider type="vertical" />
          <Popconfirm
            title="是否删除数据?"
            onConfirm={() => this.delUtil(record.id)}
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
    this.getList({ pageBean });
  }

  batchDel = () => {
    Modal.confirm({
      title: '提示',
      content: '确定要删除数据吗？',
      okType: 'danger',
      onOk: () => {
        const { selectedRows } = this.state;
        this.delUtil(selectedRows.map(item => item.id).join());
      },
    });
  };

  delUtil = ids => {
    const { dispatch } = this.props;
    dispatch({
      type: 'BuildSafetyResponsible/remove',
      payload: { ids },
      callback: () => {
        message.success('删除成功');
        const { pageBean } = this.state;
        this.getList({ pageBean });
        this.setState({ selectedRows: [] });
      },
    });
  };

  getList = parmas => {
    const { dispatch } = this.props;
    dispatch({
      type: 'BuildSafetyResponsible/fetch',
      payload: parmas,
    });
  };

  showDetailModal = detailID => {
    const { dispatch } = this.props;
    dispatch({
      type: 'BuildSafetyResponsible/detail',
      payload: detailID,
      callback: detail => {
        this.setState(
          {
            detail,
          },
          () => this.handleUpdateModalVisible(true),
        );
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
        projectName: fieldsValue.name,
        projectManager: fieldsValue.xmdzr,
        buildUnitName: fieldsValue.dljsgldw,
        surveyUnitName: fieldsValue.kcdw,
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
      this.setState({ detail: {} });
    }
  };

  modalCallback = (type = 'add') => {
    const { pageBean, formValues } = this.state;
    if (type === 'add') {
      return this.getList({ pageBean });
    }
    return this.getList({ pageBean, querys: formValues });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={16}>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('name')(<Input addonBefore="项目名称" placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('dljsgldw')(
                <Input addonBefore="代理建设管理单位" placeholder="请输入" />,
              )}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('xmdzr')(<Input addonBefore="项目负责人" placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('kcdw')(<Input addonBefore="勘察单位" placeholder="请输入" />)}
            </FormItem>
          </Col>
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
      BuildSafetyResponsible: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, detail } = this.state;

    const baseMethods = {
      modalCallback: this.modalCallback,
    };

    const parentMethods = {
      handleModalVisible: this.handleModalVisible,
    };

    const updateMethods = {
      detail,
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
        {modalVisible && (
          <CreateModal {...baseMethods} {...parentMethods} modalVisible={modalVisible} />
        )}
        {updateModalVisible && Object.keys(detail).length && (
          <UpdateModal {...baseMethods} {...updateMethods} modalVisible={updateModalVisible} />
        )}
      </Fragment>
    );
  }
}

export default TableList;
