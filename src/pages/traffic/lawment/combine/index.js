import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Select, Button, Tag, DatePicker } from 'antd';
import { Redirect } from 'umi';
import StandardTable from '@/components/StandardTable';
import { checkAuth } from '@/utils/utils';

import styles from '../../../style/style.less';
import publicCss from '@/pages/style/public.less';

const FormItem = Form.Item;
const { Option } = Select;
const authority = ['/lawment/combine'];

const pageBean = { pageNo: 1, pageSize: 10 };

/* eslint react/no-multi-comp:0 */
@connect(({ TrafficApiV2Static, loading }) => ({
  TrafficApiV2Static,
  loading: loading.models.TrafficApiV2Static,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    formValues: {},
    newSiteList: [],
  };

  columns = [
    {
      title: '车牌号',
      dataIndex: 'carNo',
      width: 100,
      fixed: true,
    },
    {
      title: '轴数',
      width: 60,
      dataIndex: 'axisNum',
    },
    {
      title: '误差量(t)',
      dataIndex: 'wxl',
      render: (val, result) => {
        return ((result.staticTotalLoad - result.dynamicTotalLoad) / 1000).toFixed(2);
      },
    },
    {
      title: '误差率(%)',
      dataIndex: 'wxlv',
      render: (val, result) => {
        return (
          ((result.staticTotalLoad - result.dynamicTotalLoad) / result.staticTotalLoad) *
          100
        ).toFixed(2);
      },
    },
    {
      title: '静态',
      children: [
        {
          title: '站点名称',
          dataIndex: 'staticSiteName',
          key: 'staticSiteName',
        },
        {
          title: '检测时间',
          dataIndex: 'staticPreviewTime',
          key: 'staticPreviewTime',
          render: val => moment(val).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
          title: '车货总重(t)',
          dataIndex: 'staticTotalLoad',
          key: 'staticTotalLoad',
          render: val => (val / 1000).toFixed(2),
        },
        {
          title: '超重(t)',
          dataIndex: 'staticOverLoad',
          key: 'staticOverLoad',
          render: val =>
            val > 0 ? (
              <Tag color="#f5222d">{(val / 1000).toFixed(2)}</Tag>
            ) : (
              (val / 1000).toFixed(2)
            ),
        },
        {
          title: '超重比(%)',
          dataIndex: 'staticOverLoadRate',
          key: 'staticOverLoadRate',
          render: val => (val * 1).toFixed(2),
        },
      ],
    },
    {
      title: '动态',
      children: [
        {
          title: '站点名称',
          dataIndex: 'dynamicSiteName',
          key: 'dynamicSiteName',
        },
        {
          title: '检测时间',
          dataIndex: 'dynamicPreviewTime',
          key: 'dynamicPreviewTime',
          render: val => moment(val).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
          title: '车货总重(t)',
          dataIndex: 'dynamicTotalLoad',
          key: 'dynamicTotalLoad',
          render: val => (val / 1000).toFixed(2),
        },
        {
          title: '超重(t)',
          dataIndex: 'dynamicOverLoad',
          key: 'dynamicOverLoad',
          render: val =>
            val > 0 ? (
              <Tag color="#f5222d">{(val / 1000).toFixed(2)}</Tag>
            ) : (
              (val / 1000).toFixed(2)
            ),
        },
        {
          title: '超重比(%)',
          dataIndex: 'dynamicOverLoadRate',
          key: 'dynamicOverLoadRate',
          render: val => (val * 100).toFixed(2),
        },
      ],
    },
  ];

  componentDidMount() {
    this.getUserSite();
    this.getList(pageBean);
  }

  getUserSite = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'system/userSite',
      payload: {
        siteType: 2,
      },
      callback: res => {
        if (res.length) {
          const siteList = res.map(item => {
            const key = Object.keys(item);
            return {
              code: key[0],
              name: item[key[0]],
            };
          });
          this.setState({ newSiteList: siteList });
        }
      },
    });
  };

  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'TrafficApiV2Static/dynamicAndStaticCompare',
      payload: {
        ...params,
      },
    });
  };

  handleStandardTableChange = pagination => {
    const { formValues } = this.state;
    const params = {
      pageNo: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
    };
    this.getList(params);
  };

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    this.getList(pageBean);
  };

  handleSearch = e => {
    e.preventDefault();

    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const format = 'YYYY-MM-DDTHH:mm:ss';
      const time = fieldsValue.previewTime
        ? {
            startPreviewTime: moment(fieldsValue.previewTime[0]).format(format),
            endPreviewTime: moment(fieldsValue.previewTime[1]).format(format),
          }
        : {};
      const values = {
        ...fieldsValue,
        ...time,
      };
      delete values.previewTime;
      this.setState({
        formValues: values,
      });
      this.getList({ ...pageBean, ...values });
    });
  };

  renderOption = () => {
    const { newSiteList } = this.state;
    return newSiteList.map(item => {
      return (
        <Option key={item.code} value={item.code}>
          {item.name}
        </Option>
      );
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={16}>
          <Col md={5} sm={24}>
            <div className={publicCss.inputMain}>
              <span
                style={{ width: '60px', lineHeight: '30px', height: '32px' }}
                className="ant-input-group-addon"
              >
                站点
              </span>
              <FormItem style={{ flex: 1 }}>
                {getFieldDecorator('siteCodes')(
                  <Select
                    dropdownMatchSelectWidth={false}
                    className={publicCss.inputGroupLeftRadius}
                    placeholder="请选择"
                  >
                    {this.renderOption()}
                  </Select>,
                )}
              </FormItem>
            </div>
          </Col>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('carNo')(<Input placeholder="车牌号" addonBefore="车牌号" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <div className={publicCss.inputMain}>
              <span
                style={{ width: '80px', lineHeight: '30px', height: '32px' }}
                className="ant-input-group-addon"
              >
                检测时间
              </span>
              <FormItem style={{ flex: 1 }}>
                {getFieldDecorator('previewTime')(
                  <DatePicker.RangePicker
                    className={publicCss.inputGroupLeftRadius}
                    style={{ width: '100%' }}
                    showTime={{
                      defaultValue: [
                        moment('00:00:00', 'HH:mm:ss'),
                        moment(new Date(), 'HH:mm:ss'),
                      ],
                    }}
                    format="YYYY-MM-DD HH:mm:ss"
                  />,
                )}
              </FormItem>
            </div>
          </Col>
          <Col md={6} sm={24}>
            <span className={styles.submitButtons} style={{ float: 'right' }}>
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
      TrafficApiV2Static: { dyAndStCompareData },
      loading,
    } = this.props;

    return (
      <Fragment>
        {checkAuth(authority[0]) ? null : <Redirect to="/exception/403" />}
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <StandardTable
              size="middle"
              tableAlert={false}
              selectedRows={0}
              rowSelection={null}
              loading={loading}
              data={dyAndStCompareData}
              scroll={{ x: '130%' }}
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
