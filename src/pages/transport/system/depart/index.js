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
  Tooltip,
  Popconfirm,
} from 'antd';
import StandardTable from '@/components/StandardTable';

import themeStyle from '@/pages/style/theme.less';
import styles from '../../../style/style.less';

const FormItem = Form.Item;

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, loading } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleAdd(fieldsValue, () => form.resetFields());
    });
  };
  return (
    <Modal
      destroyOnClose
      title="添加部门"
      onCancel={() => handleModalVisible()}
      visible={modalVisible}
      className={themeStyle.formModal}
      footer={[
        <Button key="back" onClick={() => handleModalVisible()}>
          取消
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={okHandle}>
          确定
        </Button>,
      ]}
    >
      <div className={themeStyle.formModalBody}>
        <FormItem label="部门编号">
          {form.getFieldDecorator('departNo', {
            rules: [{ required: true, message: '请输入部门编号！' }],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem label="名称">
          {form.getFieldDecorator('departName', {
            rules: [{ required: true, message: '请输入名称！' }],
          })(<Input placeholder="请输入" />)}
        </FormItem>
      </div>
    </Modal>
  );
});

const UpdateForm = Form.create()(props => {
  const { modalVisible, form, handleUpdate, handleModalVisible, loading, detail } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleUpdate(fieldsValue, () => form.resetFields());
    });
  };
  return (
    <Modal
      destroyOnClose
      title="修改部门"
      visible={modalVisible}
      onCancel={() => handleModalVisible()}
      className={themeStyle.formModal}
      footer={[
        <Button key="back" onClick={() => handleModalVisible()}>
          取消
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={okHandle}>
          确定
        </Button>,
      ]}
    >
      <div className={themeStyle.formModalBody}>
        <FormItem label="部门编号">
          {form.getFieldDecorator('departNo', {
            initialValue: detail.departNo,
            rules: [{ required: true, message: '请输入部门编号！' }],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem label="名称">
          {form.getFieldDecorator('departName', {
            initialValue: detail.departName,
            rules: [{ required: true, message: '请输入名称！' }],
          })(<Input placeholder="请输入" />)}
        </FormItem>
      </div>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ TransportSystemDepart, loading }) => ({
  TransportSystemDepart,
  loading: loading.models.TransportSystemDepart,
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
      title: '部门编号',
      dataIndex: 'departNo',
    },
    {
      title: '部门名称',
      dataIndex: 'departName',
    },
    {
      title: '操作',
      width: 90,
      render: (text, record) => (
        <Fragment>
          <Tooltip placement="left" title="编辑">
            <Button
              onClick={() => this.showDetailModal(record)}
              type="primary"
              shape="circle"
              icon="file-search"
              size="small"
            />
          </Tooltip>
          <Divider type="vertical" />
          <Popconfirm
            title="是否删除数据?"
            onConfirm={() => this.dataDel(record.id_)}
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

  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'TransportSystemDepart/fetch',
      payload: params,
    });
  };

  showDetailModal = detail => {
    this.setState({ detail }, () => this.handleUpdateModalVisible(true));
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
        const ids = selectedRows.map(item => item.id_);
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
      type: 'TransportSystemDepart/remove',
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
      const arr = [
        {
          property: 'departName',
          value: fieldsValue.name,
          group: 'main',
          operation: 'LIKE',
          relation: 'AND',
        },
      ];
      this.setState({
        formValues: arr,
      });
      this.getList({ pageBean, querys: arr });
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

  handleAdd = (fields, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'TransportSystemDepart/add',
      payload: fields,
      callback: () => {
        message.success('添加成功');
        this.handleModalVisible();
        const { pageBean } = this.state;
        this.getList({ pageBean });
        if (callback) callback();
      },
    });
  };

  handleUpdate = (fields, callback) => {
    const { dispatch } = this.props;
    const { detail } = this.state;
    const newDetail = JSON.parse(JSON.stringify(detail));
    const keys = Object.keys(fields);
    for (let i = 0; i < keys.length; i += 1) {
      newDetail[keys[i]] = fields[keys[i]];
    }

    dispatch({
      type: 'TransportSystemDepart/update',
      payload: newDetail,
      callback: () => {
        message.success('修改成功');
        this.handleUpdateModalVisible();
        const { pageBean } = this.state;
        this.getList({ pageBean });
        if (callback) callback();
      },
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem>
              {getFieldDecorator('name')(<Input addonBefore="名称" placeholder="请输入" />)}
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
      TransportSystemDepart: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, detail } = this.state;

    const parentMethods = {
      loading,
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      detail,
      loading,
      handleModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
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
              rowKey="id_"
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
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
        {updateModalVisible && Object.keys(detail).length ? (
          <UpdateForm {...updateMethods} modalVisible={updateModalVisible} />
        ) : null}
      </Fragment>
    );
  }
}

export default TableList;
