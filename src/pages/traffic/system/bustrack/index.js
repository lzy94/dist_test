import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Button, Card, Form, Divider, Tooltip, Popconfirm, message } from 'antd';
import StandardTable from '@/components/StandardTable';

import CreateModal from './component/CreateModal';
import UpdateModal from './component/UpdateModal';

import styles from '../../../style/style.less';

@connect(({ CarGPS, loading }) => ({
  CarGPS,
  loading: loading.models.CarGPS,
}))
@Form.create()
class BustrackIndex extends PureComponent {
  state = {
    detail: {},
    modalVisible: false,
    updateModalVisible: false,
  };

  columns = [
    {
      title: '方法名称',
      dataIndex: 'methodName',
    },
    {
      title: '方法值',
      dataIndex: 'methodValue',
    },
    {
      title: '下次调用时间（h）',
      dataIndex: 'nextTryTime',
      render: val => val / 3600,
    },
    {
      title: '限制次数',
      dataIndex: 'limitNumber',
    },
    {
      title: '操作',
      width: 90,
      render: (text, record) => (
        <Fragment>
          <Tooltip placement="left" title="编辑">
            <Button
              onClick={() => this.showUpdateModal(record.id)}
              type="primary"
              shape="circle"
              icon="edit"
              size="small"
            />
          </Tooltip>
          <Divider type="vertical" />
          <Popconfirm
            title="是否删除数据?"
            onConfirm={() => this.deleteData(record.id)}
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
      type: 'CarGPS/list',
    });
  };

  showUpdateModal = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'CarGPS/detail',
      payload: id,
      callback: detail => this.setState({ detail }, () => this.handleUpdateModalVisible(true)),
    });
  };

  deleteData = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'CarGPS/del',
      payload: id,
      callback: () => {
        message.success('删除成功');
        this.getList();
      },
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

  render() {
    const {
      loading,
      CarGPS: { data },
    } = this.props;
    const { modalVisible, updateModalVisible, detail } = this.state;

    const createMethods = {
      handleModalVisible: this.handleModalVisible,
      modalCallback: this.getList,
    };

    const updateMethods = {
      handleModalVisible: this.handleUpdateModalVisible,
      modalCallback: this.getList,
      detail,
    };

    return (
      <Card bordered={false}>
        <div className={styles.tableList}>
          <div className={styles.tableListOperator}>
            <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
              新建
            </Button>
          </div>
          <StandardTable
            tableAlert={false}
            selectedRows={0}
            rowSelection={null}
            loading={loading}
            data={data}
            size="middle"
            columns={this.columns}
          />
        </div>
        {modalVisible && <CreateModal modalVisible={modalVisible} {...createMethods} />}
        {updateModalVisible && Object.keys(detail).length && (
          <UpdateModal modalVisible={updateModalVisible} {...updateMethods} />
        )}
      </Card>
    );
  }
}

export default BustrackIndex;
