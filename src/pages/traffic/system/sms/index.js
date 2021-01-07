import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, Menu, Modal, message, Tooltip } from 'antd';
import StandardTable from '@/components/StandardTable';
import { Redirect } from 'umi';
import styles from '../../../style/style.less';
import { checkAuth } from '@/utils/utils';

const FormItem = Form.Item;
const authority = ['/system/sms', '/system/sms/deleteSms'];

/* eslint react/no-multi-comp:0 */
@connect(({ Sms, loading }) => ({
  Sms,
  loading: loading.models.Sms,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    selectedRows: [],
    formValues: [],
    pageBean: {
      page: 1,
      pageSize: 10,
      showTotal: true,
    },
  };

  columns = [
    {
      title: '车牌',
      dataIndex: 'carNo',
      render: val => <b style={{ color: 'red' }}>{val}</b>,
    },
    {
      title: '预检编号',
      dataIndex: 'previewCode',
    },
    {
      title: '发送人',
      dataIndex: 'sendUser',
    },
    {
      title: '接收电话',
      dataIndex: 'mobile',
    },
    {
      title: '发送内容',
      dataIndex: 'message',
      render: val => (
        <Tooltip title={val}>
          <a>{val.length > 30 ? val.substr(0, 30) + '......' : val}</a>
        </Tooltip>
      ),
    },
    {
      title: '时间',
      dataIndex: 'createTime',
    },
    {
      title: '发送结果',
      dataIndex: 'sendResult',
      render: val => (
        <Tooltip title={val}>
          <a>{val.length > 4 ? val.substr(0, 4) : val}</a>
        </Tooltip>
      ),
    },
  ];

  componentDidMount() {
    if (!checkAuth(authority[0])) return;
    const { dispatch } = this.props;
    const { pageBean } = this.state;
    dispatch({
      type: 'Sms/fetch',
      payload: {
        pageBean,
      },
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const params = {
      pageBean: {
        page: pagination.current,
        pageSize: pagination.pageSize,
        showTotal: true,
      },
      querys: formValues,
    };

    dispatch({
      type: 'Sms/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    const { pageBean } = this.state;
    form.resetFields();
    this.setState({
      formValues: [],
    });
    dispatch({
      type: 'Sms/fetch',
      payload: {
        pageBean,
      },
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { pageBean } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
      };
      const objKeys = Object.keys(values);
      // 重新格式化条件数组
      const condition = objKeys.map(item => {
        return values[item]
          ? {
              property: item,
              value: values[item],
              group: 'main',
              operation: 'LIKE',
              relation: 'OR',
            }
          : '';
      });
      // 过滤数组中的('' null undefined)
      let conditionFilter = condition.filter(item => item);
      this.setState({
        formValues: conditionFilter,
      });
      dispatch({
        type: 'Sms/fetch',
        payload: {
          pageBean,
          querys: conditionFilter,
        },
      });
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  delBatch = () => {
    const { selectedRows, pageBean } = this.state;
    if (!selectedRows) return;
    const { dispatch } = this.props;
    const self = this;
    Modal.confirm({
      title: '批量删除',
      content: '您确定要批量删除吗?',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'Sms/remove',
          payload: {
            remove: { ids: selectedRows.map(row => row.id).join() + ',' },
            query: {
              pageBean,
            },
          },
          callback: () => {
            message.success('删除成功');
            self.setState({
              selectedRows: [],
            });
          },
        });
      },
      onCancel() {},
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem>
              {getFieldDecorator('sendUser')(<Input addonBefore="发送人" placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem>
              {getFieldDecorator('mobile')(<Input addonBefore="接收人电话" placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
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
      Sms: { data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;

    const tableConfig = {
      loading,
      data,
      size: 'middle',
      columns: this.columns,
      onSelectRow: this.handleSelectRows,
      onChange: this.handleStandardTableChange,
    };
    return (
      <Fragment>
        {checkAuth(authority[0]) ? '' : <Redirect to="/exception/403" />}
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <div className={styles.tableListOperator}>
              {selectedRows.length > 0 && (
                <span>
                  <Button type="danger" onClick={this.delBatch}>
                    批量删除
                  </Button>
                </span>
              )}
            </div>
            {checkAuth(authority[1]) ? (
              <StandardTable selectedRows={selectedRows} tableAlert={true} {...tableConfig} />
            ) : (
              <StandardTable selectedRows={selectedRows} rowSelection={null} {...tableConfig} />
            )}
          </div>
        </Card>
      </Fragment>
    );
  }
}

export default TableList;
