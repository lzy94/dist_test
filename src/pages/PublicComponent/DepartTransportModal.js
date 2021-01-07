import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, Modal, Tooltip } from 'antd';
import StandardTable from '@/components/StandardTable';

import themeStyle from '@/pages/style/theme.less';
import styles from '@/pages/style/style.less';

const FormItem = Form.Item;

/* eslint react/no-multi-comp:0 */
@connect(({ TransportSystemDepart, loading }) => ({
  TransportSystemDepart,
  loading: loading.models.TransportSystemDepart,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    formValues: [],
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
        <Tooltip placement="left" title="选择">
          <Button
            type="primary"
            shape="circle"
            icon="check"
            size="small"
            onClick={() => this.selectData(record)}
          />
        </Tooltip>
      ),
    },
  ];

  componentDidMount() {
    const { pageBean } = this.state;
    this.getList({ pageBean });
  }

  selectData = record => {
    const { selectData, handleModalVisible } = this.props;
    selectData(record);
    handleModalVisible();
  };

  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'TransportSystemDepart/fetch',
      payload: params,
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
    });
    this.getList({ pageBean });
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

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={16} sm={24}>
            <FormItem>
              {getFieldDecorator('name')(<Input addonBefore="名称" placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
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
      modalVisible,
      handleModalVisible,
    } = this.props;
    return (
      <Modal
        destroyOnClose
        title="选择子部门"
        className={themeStyle.formModal}
        visible={modalVisible}
        width={600}
        footer={null}
        onCancel={() => handleModalVisible()}
      >
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <StandardTable
              rowKey="id_"
              size="middle"
              tableAlert={false}
              selectedRows={0}
              rowSelection={null}
              loading={loading}
              data={data}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </Modal>
    );
  }
}

export default TableList;
