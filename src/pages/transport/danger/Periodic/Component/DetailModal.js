import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Modal, Descriptions, Card, Table, Tooltip, Button, Divider, Popconfirm } from 'antd';
import { fileUrl } from '@/utils/utils';
import { typeNames, frequency } from '@/utils/dictionaries';

import ToExamineModal from './ToExamine';
import SuperRetModal from './SuperRetModal';

import themeStyle from '@/pages/style/theme.less';

const stateMap = ['未审核', '审核通过', '不通过'];

@connect(({ TransportDangerPeriodic, loading }) => ({
  TransportDangerPeriodic,
  loading: loading.models.TransportDangerPeriodic,
}))
class DetailModal extends PureComponent {
  static defaultProps = {
    detail: {},
    modalVisible: false,
    handleModalVisible: () => {},
  };

  state = {
    supervisionId: '',
    retDetailID: '',
    retDetail: {},
    querys: [],
    modalSuprtVisible: false,
    toExamineVisible: false,
  };

  columns = [
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 170,
    },
    {
      title: '审核',
      dataIndex: 'status',
      render: val => stateMap[val],
    },
    {
      title: '不通过的原因',
      dataIndex: 'reson',
      render: val =>
        val && val.length > 10 ? (
          <Tooltip title={val}>{`${val.substring(0, 10)}...`}</Tooltip>
        ) : (
          val
        ),
    },
    {
      title: '操作',
      width: 90,
      render: (val, record) => (
        <Fragment>
          {record.status > 0 ? (
            <Tooltip placement="left" title="详情">
              <Button
                onClick={() => this.showDetailModal(record, 'detail')}
                type="primary"
                shape="circle"
                icon="eye"
                size="small"
              />
            </Tooltip>
          ) : (
            <Tooltip placement="left" title="审核">
              <Button
                onClick={() => this.showDetailModal(record, 'toExamine')}
                type="primary"
                shape="circle"
                icon="edit"
                size="small"
              />
            </Tooltip>
          )}
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
    const { detail } = this.props;

    const querys = [
      {
        group: 'main',
        operation: 'EQUAL',
        property: 'supervisionId',
        relation: 'AND',
        value: detail.id,
      },
    ];
    this.setState({ querys });

    this.getList({
      pageBean: {
        page: 1,
        pageSize: 10,
        showTotal: true,
      },
      querys,
    });
  }

  showDetailModal = (record, type) => {
    const { id, supervisionId, superRet } = record;
    // const retDetail = superRet ? JSON.parse(superRet) : [];
    this.setState({ retDetail: record, retDetailID: id, supervisionId }, () => {
      type === 'detail' ? this.handleSuperModalVisible(true) : this.handleToExamineVisible(true);
    });
  };

  dataDel = ids => {
    const { dispatch } = this.props;
    dispatch({
      type: 'TransportDangerPeriodic/removeCycleSuperRet',
      payload: { ids },
      callback: () => {
        this.modalCallback();
      },
    });
  };

  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'TransportDangerPeriodic/cycleSuperRetListfetch',
      payload: params,
    });
  };

  tableChange = pagination => {
    const { querys } = this.state;
    const { pageSize, current } = pagination;
    this.getList({
      pageBean: {
        page: current,
        pageSize,
        showTotal: true,
      },
      querys,
    });
  };

  handleToExamineVisible = flag => {
    this.setState({
      toExamineVisible: !!flag,
    });
    if (!flag) {
      this.setState({ retDetail: {} });
    }
  };

  handleSuperModalVisible = flag => {
    this.setState({
      modalSuprtVisible: !!flag,
    });
    if (!flag) {
      this.setState({ retDetail: {} });
    }
  };

  modalCallback = () => {
    const { querys } = this.state;
    this.getList({
      pageBean: {
        page: 1,
        pageSize: 10,
        showTotal: true,
      },
      querys,
    });
  };

  render() {
    const {
      TransportDangerPeriodic: {
        cycleSuperRetListData: { list, pagination },
      },
      loading,
      modalVisible,
      handleModalVisible,
      detail,
    } = this.props;
    const {
      modalSuprtVisible,
      retDetail,
      retDetailID,
      supervisionId,
      toExamineVisible,
    } = this.state;
    return (
      <React.Fragment>
        <Modal
          destroyOnClose
          title="周期性督查详情"
          className={themeStyle.formModal}
          visible={modalVisible}
          width={700}
          onCancel={() => handleModalVisible()}
          footer={null}
        >
          <Card bordered={false}>
            <Descriptions size="small" column={2} bordered>
              <Descriptions.Item label="名称">{detail.name}</Descriptions.Item>
              <Descriptions.Item label="标题">{detail.title}</Descriptions.Item>
              <Descriptions.Item label="督查类别">
                {typeNames[parseInt(detail.type, 10) - 1]}
              </Descriptions.Item>
              <Descriptions.Item label="频率">{detail.frequency}</Descriptions.Item>

              <Descriptions.Item label="模板">{detail.tempName}</Descriptions.Item>
              <Descriptions.Item label="期限天数">{detail.term}</Descriptions.Item>
              <Descriptions.Item label="督查对象" span={2}>
                {detail.companyName}
              </Descriptions.Item>
              <Descriptions.Item label="附件" span={2}>
                <a
                  href={`${fileUrl}${detail.fielUrls}`}
                  rel="noopener noreferrer"
                  target="_blank"
                  download={detail.fileName}
                >
                  {detail.fileName}
                </a>
              </Descriptions.Item>
            </Descriptions>
            <h3 style={{ marginTop: 10 }}>反馈</h3>
            <Table
              rowKey="id"
              size="small"
              loading={loading}
              columns={this.columns}
              dataSource={list}
              pagination={pagination}
              onChange={this.tableChange}
            />
          </Card>
        </Modal>
        {toExamineVisible && Object.keys(retDetail).length && (
          <ToExamineModal
            supervisionId={supervisionId}
            retDetailID={retDetailID}
            detail={retDetail}
            modalVisible={toExamineVisible}
            modalCallback={this.modalCallback}
            handleModalVisible={this.handleToExamineVisible}
          />
        )}
        {modalSuprtVisible && Object.keys(retDetail).length && (
          <SuperRetModal
            supervisionId={supervisionId}
            retDetailID={retDetailID}
            detail={retDetail}
            modalVisible={modalSuprtVisible}
            modalCallback={this.modalCallback}
            handleModalVisible={this.handleSuperModalVisible}
          />
        )}
      </React.Fragment>
    );
  }
}

export default DetailModal;
