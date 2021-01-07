import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Redirect } from 'umi';
import { Row, Col, Card, Form, Select, Button, Tooltip } from 'antd';
import StandardTable from '@/components/StandardTable';
import { checkAuth } from '@/utils/utils';

import styles from '../../../style/style.less';
import publicCss from '@/pages/style/public.less';

const FormItem = Form.Item;
const { Option } = Select;
const authority = ['/system/equipmentErr'];
const typeStr = ['仪表', '相机', '传感器及线圈', '其它'];

/* eslint react/no-multi-comp:0 */
@connect(({ system, EquipmentErr, loading }) => ({
  EquipmentErr,
  system,
  loading: loading.models.EquipmentErr,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    userSite: [],
    formValues: [],
    pageBean: {
      page: 1,
      pageSize: 10,
      showTotal: true,
    },
  };

  columns = [
    {
      title: '站点名称',
      dataIndex: 'siteName',
    },
    {
      title: '设备名称',
      dataIndex: 'equimentName',
    },
    {
      title: '类型',
      dataIndex: 'type',
      render: val => typeStr[val - 1],
    },
    {
      title: '异常码',
      dataIndex: 'errCode',
    },
    {
      title: '异常值',
      dataIndex: 'errValue',
      render: val =>
        val.length > 30 ? <Tooltip title={val}>{val.substring(0, 30)}...</Tooltip> : val,
    },
    {
      title: '异常描述',
      dataIndex: 'errDesc',
      render: val =>
        val.length > 20 ? <Tooltip title={val}>{val.substring(0, 20)}...</Tooltip> : val,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 170,
      render: val => moment(val).format('YYYY-MM-DD HH:mm:ss'),
    },
  ];

  componentDidMount() {
    const { pageBean, formValues } = this.state;
    this.getList({ pageBean, type: formValues });
    this.getUserSite(1, res => {
      this.setState({ userSite: res });
    });
  }

  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'EquipmentErr/fetch',
      payload: params,
    });
  };

  getUserSite = (siteType, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'system/userSite',
      payload: {
        siteType,
      },
      callback: res => {
        const siteList = res.map((item, index) => {
          const key = Object.keys(item);
          return {
            index: index + 1,
            code: key[0],
            name: item[key[0]],
            direction: [item[key[1]], item[key[2]]],
          };
        });
        callback(siteList);
      },
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
      type: formValues,
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
          property: 'type',
          value: fieldsValue.type,
          group: 'main',
          operation: 'EQUAL',
          relation: 'AND',
        },
        {
          property: 'siteCode',
          value: fieldsValue.siteCode,
          group: 'main',
          operation: 'EQUAL',
          relation: 'AND',
        },
      ].filter(item => item.value);

      this.getList({
        pageBean,
        querys: arr,
      });
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { userSite } = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8 }}>
          <Col md={5} sm={24}>
            <div className={publicCss.inputMain}>
              <span
                style={{ width: '65px', lineHeight: '30px', height: '32px' }}
                className="ant-input-group-addon"
              >
                站点
              </span>
              <FormItem style={{ flex: 1, marginBottom: 0 }}>
                {getFieldDecorator('siteCode')(
                  <Select
                    style={{ width: '100%' }}
                    className={publicCss.inputGroupLeftRadius}
                    placeholder="请选择"
                  >
                    {userSite.map(item => (
                      <Option key={item.code} value={item.code}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>,
                )}
              </FormItem>
            </div>
          </Col>
          <Col md={5} sm={24}>
            <div className={publicCss.inputMain}>
              <span
                style={{ width: '80px', lineHeight: '30px', height: '32px' }}
                className="ant-input-group-addon"
              >
                类型
              </span>
              <FormItem style={{ flex: 1 }}>
                {getFieldDecorator('type', {})(
                  <Select style={{ width: '100%' }} placeholder="请选择">
                    {typeStr.map((item, i) => (
                      <Option value={i + 1} key={i}>
                        {item}
                      </Option>
                    ))}
                  </Select>,
                )}
              </FormItem>
            </div>
          </Col>
          <Col md={5} sm={24}>
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
      EquipmentErr: { data },
      loading,
    } = this.props;
    return (
      <Fragment>
        {checkAuth(authority[0]) ? null : <Redirect to="/exception/403" />}
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <StandardTable
              tableAlert={false}
              selectedRows={0}
              rowSelection={null}
              loading={loading}
              data={data}
              size="middle"
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </Fragment>
    );
  }
}

export default TableList;
