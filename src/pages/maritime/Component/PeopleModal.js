import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Modal,
  Divider, Tooltip, Popconfirm, Select,
} from 'antd';
import StandardTable from '@/components/StandardTable';

import styles from '../../style/style.less';
import themeStyle from '@/pages/style/theme.less';
import publicCss from '@/pages/style/public.less';

const FormItem = Form.Item;
const Option = Select.Option;


/* eslint react/no-multi-comp:0 */
@connect(({ MaritimePeople, loading }) => ({
  MaritimePeople,
  loading: loading.models.MaritimePeople,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    selectedRows: [],
    formValues: [],
    pageBean: { 'page': 1, 'pageSize': 10, 'showTotal': true },
  };

  columns = [
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '身份证号码',
      dataIndex: 'idcard',
      width: 180,
    },
    {
      title: '性别',
      dataIndex: 'sex',
      width: 80,
      render: val => val === 1 ? '男' : '女',
    },
    {
      title: '职位',
      dataIndex: 'post',
    },
    {
      title: '资格证编号',
      dataIndex: 'certificateNo',
    },
    {
      title: '所属单位',
      dataIndex: 'companyName',
    },
  ];

  componentDidMount() {
    const { pageBean } = this.state;
    this.getList({ pageBean });
  }


  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'MaritimePeople/fetch',
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
    form.resetFields();
    this.setState({
      formValues: [],
      selectedRows: [],
    });
    this.getList({ pageBean: this.state.pageBean });
  };


  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { pageBean } = this.state;
      const values = {
        post: fieldsValue.zw,
        certificateNo: fieldsValue.zgzh,
        companyName: fieldsValue.ssdw,
        sex: fieldsValue.xb,
      };

      const objKeys = Object.keys(values);
      const condition = objKeys.map(item => {
        return values[item]
          ? {
            property: item,
            value: values[item],
            group: 'main',
            operation: item === 'sex' ? 'EQUAL' : 'LIKE',
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


  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  getParticipantsList = () => {
    const { participantsList, handleModalVisible } = this.props;
    const { selectedRows } = this.state;
    participantsList(selectedRows.map(item => item.name));
    handleModalVisible();
  };


  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 16, xl: 32 }}>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('zw')(<Input addonBefore="职位" placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('zgzh')(<Input addonBefore="资格证号" placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('ssdw')(<Input addonBefore="所属单位" placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <div className={publicCss.inputMain}>
              <span style={{ width: '80px', lineHeight: '30px', height: '32px' }}
                    className="ant-input-group-addon">性别</span>
              <FormItem style={{ flex: 1 }}>
                {getFieldDecorator('xb')(
                  <Select placeholder="请选择" style={{ width: '100%' }}>
                    <Option value={1}>男</Option>
                    <Option value={2}>女</Option>
                  </Select>,
                )}
              </FormItem>
            </div>
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
      MaritimePeople: { data },
      loading,
      handleModalVisible,
      modalVisible,
    } = this.props;
    const { selectedRows } = this.state;
    return (
      <Modal
        destroyOnClose
        title="选择港口"
        className={themeStyle.formModal}
        visible={modalVisible}
        width={1000}
        onOk={this.getParticipantsList}
        onCancel={() => handleModalVisible()}
      >
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <StandardTable
              rowKey="id_"
              size="middle"
              tableAlert={false}
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </Modal>
    );
  }
}

export default TableList;
