import React, { PureComponent } from 'react';
import { Modal, Descriptions, Card, Tooltip, Table } from 'antd';
import { fileUrl } from '@/utils/utils';

import themeStyle from '@/pages/style/theme.less';

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
        val.length > 20 ? <Tooltip title={val}>{val.substring(0, 20)}...</Tooltip> : val,
    },
    {
      title: '反馈内容',
      dataIndex: 'control',
      render: (val, record) =>
        val === 1 ? (
          record.superRet
        ) : (
          <a href={fileUrl + record.superRet} download="文件" target="_blank">
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
        title="专项督查详情"
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
            <Descriptions.Item label="模板">{detail.tempName}</Descriptions.Item>
            <Descriptions.Item label="周期天数">{detail.term}</Descriptions.Item>
            <Descriptions.Item label="督查对象" span={2}>
              {detail.companyName}
            </Descriptions.Item>
            <Descriptions.Item label="情况说明概要" span={2}>
              {detail.desc}
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

          <h3 style={{ marginTop: 20 }}>反馈内容</h3>
          <Table
            size="small"
            pagination={false}
            columns={this.columns}
            rowKey="order"
            dataSource={detail.superRet ? JSON.parse(detail.superRet) : []}
          />
        </Card>
      </Modal>
    );
  }
}

export default DetailModal;
