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
import DataList from './Component/DataList';
import { fileUrl } from '@/utils/utils';
import UpdateModal from './Component/AddModal';

import styles from '../../../style/style.less';

const FormItem = Form.Item;

/* eslint react/no-multi-comp:0 */
@connect(({ BuildPublicContent, loading }) => ({
  BuildPublicContent,
  loading: loading.models.BuildPublicContent,
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
      dataIndex: 'projectName',
    },
    {
      title: '公开内容',
      dataIndex: 'publicContent',
    },
    {
      title: '公开主体',
      dataIndex: 'publicTopic',
    },
    {
      title: '公开资料',
      dataIndex: 'publicData',
      width: 100,
      render: val => (
        <a href={fileUrl + val} target="_blank" download="公开资料">
          资料下载
        </a>
      ),
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
      type: 'BuildPublicContent/remove',
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
      type: 'BuildPublicContent/fetch',
      payload: parmas,
    });
  };

  showDetailModal = detailID => {
    const { dispatch } = this.props;
    dispatch({
      type: 'BuildPublicContent/detail',
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
        publicContent: fieldsValue.gknr,
        publicTopic: fieldsValue.gkzt,
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

  saveData = (data, type) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'BuildPublicContent/add',
      payload: [data],
      callback: () => {
        message.success('编辑成功');
        this.modalCallback();
      },
    });
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
          <Col md={6} sm={24}>
            <FormItem>
              {getFieldDecorator('gknr')(<Input addonBefore="公开内容" placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem>
              {getFieldDecorator('gkzt')(<Input addonBefore="公开主体" placeholder="请输入" />)}
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
      BuildPublicContent: { data },
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
      type: 'edit',
      saveData: this.saveData,
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
          <DataList {...baseMethods} {...parentMethods} modalVisible={modalVisible} />
        )}
        {updateModalVisible && Object.keys(detail).length && (
          <UpdateModal {...baseMethods} {...updateMethods} modalVisible={updateModalVisible} />
        )}
      </Fragment>
    );
  }
}

export default TableList;
