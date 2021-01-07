import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Card, Table, Tooltip, Descriptions } from 'antd';
import { fileUrl } from '@/utils/utils';

import themeStyle from '@/pages/style/theme.less';

const stateMap = ['', '审核通过', '不通过'];

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

  columns = [
    {
      title: '内容',
      dataIndex: 'content',
      width: 400,
      render: val =>
        val ? val.length > 20 ? <Tooltip title={val}>{val.substring(0, 20)}...</Tooltip> : val : '',
    },
    {
      title: '反馈内容',
      dataIndex: 'control',
      render: (val, record) =>
        val === 1 ? (
          record.superRet
        ) : (
          <a href={fileUrl + record.superRet} download="文件">
            文件
          </a>
        ),
    },
  ];

  render() {
    const { modalVisible, handleModalVisible, detail } = this.props;
    return (
      <Modal
        destroyOnClose
        title="详情"
        className={themeStyle.formModal}
        visible={modalVisible}
        width={600}
        onCancel={() => handleModalVisible()}
        footer={null}
      >
        <Card bordered={false}>
          <Table
            size="small"
            columns={this.columns}
            rowKey="order"
            dataSource={detail.superRet ? JSON.parse(detail.superRet) : []}
            pagination={false}
            style={{ marginBottom: 10 }}
          />
          <Descriptions size="small" column={1} bordered>
            <Descriptions.Item label="审核">{stateMap[detail.status]}</Descriptions.Item>

            {detail.status === 2 && (
              <Descriptions.Item label="不通过原因">{detail.reson || ''}</Descriptions.Item>
            )}
          </Descriptions>
        </Card>
      </Modal>
    );
  }
}

export default DetailModal;
