import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Card, Table, Tooltip, Button, Radio, Form, Input, message } from 'antd';
import { fileUrl } from '@/utils/utils';

import themeStyle from '@/pages/style/theme.less';

const stateMap = ['审核通过', '不通过'];

@connect(({ TransportDangerPeriodic, loading }) => ({
  TransportDangerPeriodic,
  loading: loading.models.TransportDangerPeriodic,
}))
@Form.create()
class DetailModal extends PureComponent {
  static defaultProps = {
    detail: {},
    modalVisible: false,
    handleModalVisible: () => {},
  };

  state = {
    statusValue: 0,
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

  statusChange = e => {
    this.setState({ statusValue: e.target.value });
  };

  save = () => {
    const {
      dispatch,
      detail,
      supervisionId,
      form,
      modalCallback,
      handleModalVisible,
      retDetailID,
    } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        id: retDetailID,
        supervisionId,
        superRet: JSON.stringify(detail.superRet),
      };
      dispatch({
        type: 'TransportDangerPeriodic/saveCycleSuperRet',
        payload: values,
        callback: () => {
          modalCallback();
          handleModalVisible();
          message.success('审核成功');
        },
      });
    });
    return null;
  };

  render() {
    const { modalVisible, handleModalVisible, detail, form, loading } = this.props;
    const { statusValue } = this.state;
    return (
      <Modal
        destroyOnClose
        title="督查反馈"
        className={themeStyle.formModal}
        visible={modalVisible}
        width={600}
        onCancel={() => handleModalVisible()}
        footer={[
          <Button key="back" onClick={() => handleModalVisible()}>
            取消
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={() => this.save()}>
            确定
          </Button>,
        ]}
      >
        <Card bordered={false}>
          <Table
            size="small"
            columns={this.columns}
            rowKey="order"
            dataSource={detail.superRet ? JSON.parse(detail.superRet) : []}
            pagination={false}
          />
          <Form.Item label="审核">
            {form.getFieldDecorator('status', {
              rules: [{ required: true, message: '请选择！' }],
            })(
              <Radio.Group onChange={this.statusChange}>
                {stateMap.map((item, i) => (
                  <Radio value={i + 1}>{item}</Radio>
                ))}
              </Radio.Group>,
            )}
          </Form.Item>
          {statusValue === 2 && (
            <Form.Item label="不通过原因">
              {form.getFieldDecorator('reson', {
                rules: [{ message: '请输入！' }],
              })(<Input.TextArea placeholder="请输入" />)}
            </Form.Item>
          )}
        </Card>
      </Modal>
    );
  }
}

export default DetailModal;
