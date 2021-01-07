import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button, Modal, message, Tooltip,
} from 'antd';
import {Redirect} from "umi";
import StandardTable from '@/components/StandardTable';
import {checkAuth} from '@/utils/utils';

import styles from '../../../style/style.less';

const FormItem = Form.Item;
const authority = ["/comquery/focus"];

/* eslint react/no-multi-comp:0 */
@connect(({DynamicLaw, loading}) => ({
  DynamicLaw,
  loading: loading.models.DynamicLaw,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    formValues: [],
    selectedRows: [],
    pageBean: {
      "page": 1,
      "pageSize": 10,
      "showTotal": true
    },
  };

  columns = [
    {
      title: '车牌号',
      width: 100,
      dataIndex: 'carNo',
    },
    {
      title: '操作员',
      dataIndex: 'createBy'
    },
    {
      title: '来源',
      dataIndex: 'source'
    },
    {
      title: '车主电话',
      width: 170,
      dataIndex: 'mobile',
    },
    {
      title: '车主地址',
      dataIndex: 'address',
    },
    {
      title: '更新时间',
      width: 170,
      dataIndex: 'createTime'
    },
    {
      title: '理由',
      dataIndex: 'reson'
    },
    {
      title: '描述',
      dataIndex: 'bewrite',
      render: val => val ? (val.length > 16 ?
        <Tooltip title={val}><a>{val.substring(0, 16) + '...'}</a></Tooltip> : val) : ''
    }
  ]
  ;

  componentDidMount() {
    if (!checkAuth(authority[0])) return;
    const {pageBean} = this.state;
    this.getList({pageBean})
  }

  getList = params => {
    const {dispatch} = this.props;
    dispatch({
      type: 'DynamicLaw/getBusDynamicFocus',
      payload: params
    });
  };


  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const {formValues} = this.state;

    const params = {
      "pageBean": {
        "page": pagination.current,
        "pageSize": pagination.pageSize,
        "showTotal": true
      },
      "querys": formValues
    };
    this.getList(params);
  };

  handleFormReset = () => {
    const {form} = this.props;
    const {pageBean} = this.state;
    form.resetFields();
    this.setState({
      formValues: [],
    });
    this.getList({pageBean})
  };


  handleSearch = e => {
    e.preventDefault();
    const {form} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const {pageBean} = this.state;
      const values = {
        ...fieldsValue,
      };
      const objKeys = Object.keys(values);
      // 重新格式化条件数组
      const condition = objKeys.map((item) => {
        return values[item] ? {
          property: item,
          value: values[item],
          group: "main",
          operation: "LIKE",
          relation: "OR"
        } : ''
      });
      // 过滤数组中的('' null undefined)
      const conditionFilter = condition.filter(item => item);

      this.setState({
        formValues: conditionFilter,
      });

      this.getList({pageBean, querys: conditionFilter})
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  delBatch = () => {
    const {selectedRows} = this.state;
    if (!selectedRows) return;
    const self = this;

    Modal.confirm({
      title: '批量删除',
      content: '您确定要批量删除吗?',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        const {pageBean} = self.state;
        const {dispatch} = self.props;
        dispatch({
          type: 'DynamicLaw/deleteFocus',
          payload: {
            ids: selectedRows.map(item => item.id)
          },
          callback: () => {
            message.success('删除成功');
            setTimeout(() => self.getList({pageBean}), 100);
            self.setState({
              selectedRows: [],
            });
          }
        })
      },
      onCancel() {
      },
    });
  };


  renderSimpleForm() {
    const {
      form: {getFieldDecorator},
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{md: 8, lg: 16, xl: 32}}>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('carNo')(<Input addonBefore='车牌号' placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
          <span className={styles.submitButtons}>
          <Button type="primary" htmlType="submit">
          查询
          </Button>
          <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>
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
      DynamicLaw: {data},
      loading,
    } = this.props;
    const {selectedRows} = this.state;
    return (
      <Fragment>
        {checkAuth(authority[0]) ? null : <Redirect to="/exception/403"/>}
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <div className={styles.tableListOperator}>
              {selectedRows.length > 0 && (
                <Button type='danger' onClick={() => this.delBatch()}>批量删除</Button>
              )}
            </div>
            <StandardTable
              size='middle'
              tableAlert={true}
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </Fragment>
    );
  }
}

export default TableList;
