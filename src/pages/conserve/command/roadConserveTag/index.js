import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Form, Input, Button, Modal, message, Tooltip, Divider, Popconfirm } from 'antd';
import StandardTable from '@/components/StandardTable';

import styles from '../../../style/style.less';
import themeStyle from '@/pages/style/theme.less';

const FormItem = Form.Item;

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleAdd(fieldsValue, () => form.resetFields());
    });
  };
  return (
    <Modal
      destroyOnClose
      title="新建标签"
      className={themeStyle.formModal}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <div className={themeStyle.formModalBody}>
        <FormItem label="名称">
          {form.getFieldDecorator('tagName', {
            rules: [{ required: true, message: '请输入名称！' }],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem label="编号">
          {form.getFieldDecorator('tagCode', {
            rules: [{ required: true, message: '请输入编号！' }],
          })(<Input placeholder="请输入" />)}
        </FormItem>
      </div>
    </Modal>
  );
});

const UpdateForm = Form.create()(props => {
  const { modalVisible, form, handleUpdate, handleModalVisible, detail } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleUpdate(fieldsValue, () => form.resetFields());
    });
  };
  return (
    <Modal
      destroyOnClose
      title="编辑标签"
      className={themeStyle.formModal}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <div className={themeStyle.formModalBody}>
        <FormItem label="名称">
          {form.getFieldDecorator('tagName', {
            initialValue: detail.tagName,
            rules: [{ required: true, message: '请输入名称！' }],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem label="编号">
          {form.getFieldDecorator('tagCode', {
            initialValue: detail.tagCode,
            rules: [{ required: true, message: '请输入编号！' }],
          })(<Input placeholder="请输入" />)}
        </FormItem>
      </div>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ RoadConserveTag, loading }) => ({
  RoadConserveTag,
  loading: loading.models.RoadConserveTag,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    selectedRows: [],
    detail: {},
  };

  columns = [
    {
      title: '名称',
      dataIndex: 'tagName',
    },
    {
      title: '编号',
      dataIndex: 'tagCode',
    },
    {
      title: '操作',
      width: 100,
      render: (text, record) => (
        <Fragment>
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
    this.getList();
  }

  getList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'RoadConserveTag/fetch',
    });
  };

  editData = detail => {
    this.setState({ detail }, () => this.handleUpdateModalVisible(true));
  };

  dataDel = id => this.delUtil(id);

  delBatch = () => {
    const { selectedRows } = this.state;
    if (!selectedRows) return;
    Modal.confirm({
      title: '提示',
      content: '您确定要批量删除吗?',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        this.delUtil(selectedRows.map(row => row.id).join());
      },
    });
  };

  delUtil = ids => {
    const { dispatch } = this.props;
    dispatch({
      type: 'RoadConserveTag/remove',
      payload: {
        ids,
      },
      callback: () => {
        message.success('删除成功');
        this.handleModalVisible();
        this.getList();
        this.setState({ selectedRows: [] });
      },
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
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
  };

  handleAdd = (fields, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'RoadConserveTag/saveData',
      payload: fields,
      callback: () => {
        message.success('添加成功');
        this.handleModalVisible();
        this.getList();
        callback();
      },
    });
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    const { detail } = this.state;
    const newDetail = {
      ...detail,
    };
    newDetail['tagName'] = fields.tagName;
    newDetail['tagCode'] = fields.tagCode;
    this.setState({ detail: newDetail });
    dispatch({
      type: 'RoadConserveTag/saveData',
      payload: newDetail,
      callback: () => {
        message.success('编辑成功');
        this.handleUpdateModalVisible();
        this.getList();
        this.setState({
          detail: {},
        });
      },
    });
  };

  render() {
    const {
      RoadConserveTag: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, detail } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      detail,
      handleModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <Fragment>
        <Card bordered={false}>
          <div className={styles.tableList}>
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
              pagination={false}
              onSelectRow={this.handleSelectRows}
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
