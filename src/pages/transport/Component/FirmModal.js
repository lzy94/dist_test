import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Button, Tooltip, Modal } from 'antd';
import StandardTable from '@/components/StandardTable';

import themeStyle from '@/pages/style/theme.less';
import styles from '../../style/style.less';

const FormItem = Form.Item;
const createTypeMap = ['自主申请', '管理员添加'];

/* eslint react/no-multi-comp:0 */
@connect(({ TransportArchivesFirm, loading }) => ({
  TransportArchivesFirm,
  loading: loading.models.TransportArchivesFirm,
}))
@Form.create()
class TableList extends PureComponent {
  static defaultProps = {};

  state = {
    formValues: [],
    pageBean: { page: 1, pageSize: 10, showTotal: true },
  };

  columns = [
    {
      title: '公司名称',
      dataIndex: 'companyName',
    },
    {
      title: '注册账号',
      dataIndex: 'account',
    },
    {
      title: '详细地址',
      dataIndex: 'addr',
    },
    {
      title: '安全监督员',
      dataIndex: 'safetySupervisor',
    },
    {
      title: '创建方式',
      dataIndex: 'createType',
      width: 100,
      render: val => createTypeMap[val - 1],
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 170,
      render: val => moment(val).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      width: 80,
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

  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'TransportArchivesFirm/fetch',
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

      const values = {
        companyName: fieldsValue.comName,
        concacts: fieldsValue.LXR,
        concactsTel: fieldsValue.LXFS,
        creditCode: fieldsValue.code,
      };

      const objKeys = Object.keys(values);
      const condition = objKeys.map(item => {
        return values[item]
          ? {
              property: item,
              value: values[item],
              group: 'main',
              operation: 'LIKE',
              relation: 'AND',
            }
          : '';
      });
      const conditionFilter = condition.filter(item => item);
      this.setState({
        formValues: conditionFilter,
      });
      this.getList({ pageBean, querys: conditionFilter });
    });
  };

  selectData = detail => {
    const { setSelectData, handleModalVisible } = this.props;
    setSelectData(detail);
    handleModalVisible();
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 16, xl: 16 }}>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('comName')(<Input addonBefore="公司名称" placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('LXR')(<Input addonBefore="联系人" placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('LXFS')(<Input addonBefore="联系方式" placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('code')(<Input addonBefore="信用代码" placeholder="请输入" />)}
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
      TransportArchivesFirm: { data },
      loading,
    } = this.props;
    const { modalVisible, handleModalVisible } = this.props;
    return (
      <Modal
        destroyOnClose
        title="选择公司"
        className={themeStyle.formModal}
        visible={modalVisible}
        width={1100}
        onCancel={() => handleModalVisible()}
        footer={null}
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
