import React, { PureComponent } from 'react';
import { Modal, Card, Form, Tooltip } from 'antd';
import { connect } from 'dva';
import Zmage from 'react-zmage';
import StandardTable from '@/components/StandardTable';
import { imgUrl } from '@/utils/utils';

import themeStyle from '@/pages/style/theme.less';

@connect(({ RoadWorkOrdes, loading }) => ({
  RoadWorkOrdes,
  loading: loading.models.RoadWorkOrdes,
}))
@Form.create()
class ScoreModal extends PureComponent {
  static defaultProps = {
    modalVisible: false,
    handleModalVisible: () => {},
  };

  state = {
    formValues: [],
    defaultQuery: {},
    pageBean: { page: 1, pageSize: 10, showTotal: true },
  };

  columns = [
    {
      title: '取证照片',
      width: 100,
      dataIndex: 'evidence',
      render: val => (
        <div
          style={{
            overflow: 'hidden',
            width: 70,
            height: 50,
            float: 'left',
            marginRight: 10,
          }}
        >
          <Zmage
            backdrop="rgba(255,255,255,.3)"
            src={imgUrl + val}
            alt="图片"
            style={{
              width: '100%',
              height: '50px',
            }}
          />
        </div>
      ),
    },
    {
      title: '扣分',
      width: 90,
      dataIndex: 'delScore',
    },
    {
      title: '罚款',
      width: 90,
      dataIndex: 'fine',
    },
    {
      title: '原因',
      dataIndex: 'reson',
      render: val =>
        val ? val.length > 20 ? <Tooltip title={val}>{val.substring(0, 20)}...</Tooltip> : val : '',
    },
  ];

  componentDidMount() {
    const { companyID } = this.props;
    const { pageBean } = this.state;
    const defaultQuery = {
      group: 'main',
      operation: 'EQUAL',
      property: 'companyId',
      relation: 'AND',
      value: companyID,
    };
    this.getList({ pageBean, querys: [defaultQuery] });
    this.setState({ defaultQuery });
  }

  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'RoadWorkOrdes/getExamineList',
      payload: params,
    });
  };

  handleStandardTableChange = pagination => {
    const { defaultQuery } = this.state;
    const params = {
      pageBean: {
        page: pagination.current,
        pageSize: pagination.pageSize,
        showTotal: true,
      },
      querys: [defaultQuery],
    };
    this.getList(params);
  };

  render() {
    const {
      RoadWorkOrdes: { examineList },
      modalVisible,
      handleModalVisible,
      loading,
    } = this.props;

    return (
      <Modal
        destroyOnClose
        title="评分列表"
        className={themeStyle.formModal}
        visible={modalVisible}
        width={800}
        onCancel={() => handleModalVisible()}
        footer={null}
      >
        <Card bordered={false}>
          <StandardTable
            rowKey="id_"
            size="middle"
            tableAlert={false}
            selectedRows={0}
            rowSelection={null}
            loading={loading}
            data={examineList}
            columns={this.columns}
            onChange={this.handleStandardTableChange}
          />
        </Card>
      </Modal>
    );
  }
}

export default ScoreModal;
