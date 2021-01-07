import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Modal, Button, message, Card, Table, Divider, Popconfirm, Tooltip, Icon } from 'antd';

import themeStyle from '@/pages/style/theme.less';
import tableStyle from '../../../style.less';

import AddModal from './AddModal';

@connect(({ BuildPublicContent, loading }) => ({
  BuildPublicContent,
  loading: loading.models.BuildPublicContent,
}))
class DataList extends PureComponent {
  static defaultProps = {
    modalVisible: false,
    handleModalVisible: () => {},
    modalCallback: () => {},
  };

  state = {
    list: [],
    detail: {},
    dataIndex: [],
    type: 'add',
    addModalVisible: false,
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
    },
    {
      title: '操作',
      width: 100,
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
            onConfirm={() => this.delUtil(record.index)}
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

  showDetailModal = detail => {
    this.setState({ detail, type: 'edit_add', dataIndex: detail.index }, () =>
      this.handleAddModalVisible(true),
    );
  };

  delUtil = index => {
    const { list } = this.state;
    const newList = [...list];
    newList.splice(index, 1);
    this.setState({
      list: this.setIndex(newList),
    });
  };

  setIndex = list => {
    return list.map((item, i) => ({ ...item, index: i }));
  };

  getData = (data, type) => {
    const { list, dataIndex } = this.state;
    if (type === 'add') {
      const newList = this.setIndex([...list, data]);
      this.setState({ list: newList });
      return null;
    }
    const newList = [...list];
    newList[dataIndex] = data;
    this.setState({ list: newList });
    return null;
  };

  handleAddModalVisible = flag => {
    this.setState({
      addModalVisible: !!flag,
    });
    if (!flag) {
      this.setState({ detail: {}, type: 'add' });
    }
  };

  save = () => {
    const { list, type } = this.state;
    if (!list.length) {
      message.error('请添加数据');
      return;
    }
    const { dispatch, modalCallback } = this.props;
    dispatch({
      type: 'BuildPublicContent/add',
      payload: list,
      callback: () => {
        message.success(`${type === 'add' ? '添加' : '编辑'}成功`);
        modalCallback();
        this.cancelClick();
      },
    });
  };

  cancelClick = () => {
    const { handleModalVisible } = this.props;
    handleModalVisible();
  };

  render() {
    const { loading, modalVisible } = this.props;
    const { list, addModalVisible, type, detail } = this.state;
    return (
      <Fragment>
        <Modal
          destroyOnClose
          title="新建公开内容"
          className={themeStyle.formModal}
          visible={modalVisible}
          onCancel={this.cancelClick}
          width={1000}
          footer={[
            <Button key="back" onClick={this.cancelClick}>
              取消
            </Button>,
            <Button key="submit" type="primary" loading={loading} onClick={this.save}>
              确定
            </Button>,
          ]}
        >
          <Card bordered={false}>
            <Table columns={this.columns} size="middle" dataSource={list} pagination={false} />
            <div className={tableStyle.plusBtn} onClick={() => this.handleAddModalVisible(true)}>
              <Icon type="plus" style={{ fontSize: 20 }} />
              <p>添加</p>
            </div>
          </Card>
        </Modal>
        {addModalVisible && (
          <AddModal
            type={type}
            detail={detail}
            handleModalVisible={this.handleAddModalVisible}
            getData={this.getData}
            modalVisible={addModalVisible}
          />
        )}
      </Fragment>
    );
  }
}

export default DataList;
