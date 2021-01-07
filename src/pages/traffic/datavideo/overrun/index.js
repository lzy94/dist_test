import React, { PureComponent, Fragment } from 'react';
import { Button, Card, Col, Form, Empty, Row, Select, DatePicker, Spin } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { Redirect } from 'umi';
import StandardTable from '@/components/StandardTable';
import ReactEcharts from 'echarts-for-react';
import publicCss from '@/pages/style/public.less';
import styles from '@/pages/style/style.less';
import { checkAuth } from '@/utils/utils';

const FormItem = Form.Item;
const { Option } = Select;
const { MonthPicker } = DatePicker;
const authority = ['/datavideo/overrun'];
const colors = ['#1890ff', '#2fc25b', '#13c2c2', '#facc14'];

/* eslint react/no-multi-comp:0 */
@connect(({ system, TrafficApiV2Count, loading }) => ({
  system,
  TrafficApiV2Count,
  loading: loading.models.TrafficApiV2Count,
}))
@Form.create()
class Overrun extends PureComponent {
  state = {
    userSite: [],
    dateType: 1,
    isopen: false,
    formValues: {
      type: 'overrun',
      origin: 1,
      siteCode: '',
      dateType: 1,
      dateStr: moment(new Date()).format('YYYY-MM-DD'),
    },
  };

  componentDidMount() {
    if (!checkAuth(authority[0])) return;
    const { formValues } = this.state;
    this.getList(formValues);
    this.getUserSite(formValues.origin, res => {
      this.setState({ userSite: res });
    });
  }

  handlePanelChange = value => {
    const { form } = this.props;
    form.setFieldsValue({
      dateStr: value,
    });
    this.setState({
      isopen: false,
    });
  };

  handleOpenChange = status => {
    if (status) {
      this.setState({ isopen: true });
    } else {
      this.setState({ isopen: false });
    }
  };

  getList = (params = {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'TrafficApiV2Count/overLimitCount',
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

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
      };
      values.dateType = values.dateType || 1;
      values.siteCode = values.siteCode || '';
      let format = 'YYYY-MM-DD';
      if (values.dateType === 2) {
        format = 'YYYY-MM';
      } else if (values.dateType === 3) {
        format = 'YYYY';
      }
      values.dateStr = moment(values.dateStr).format(format);
      this.setState({
        formValues: values,
      });
      this.getList(values);
    });
  };

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    const formValues = {
      origin: 1,
      siteCode: '',
      dateType: 1,
      dateStr: moment(new Date()).format('YYYY-MM-DD'),
    };
    this.setState({
      formValues,
    });
    this.getList(formValues);
    this.getUserSite(1, res => {
      this.setState({ userSite: res });
    });
  };

  getLineChart = () => {
    const {
      TrafficApiV2Count: {
        overLimitData: { data },
      },
    } = this.props;
    const { formValues } = this.state;
    const index = formValues.dateType - 1;
    const fieldName = ['', '日', '月'];
    // const total = datas;
    const xAxisData = data.map(item => `${item.day}${fieldName[index]}`);
    const series = [
      {
        name: '检测数',
        type: 'bar',
        smooth: true,
        barMaxWidth: 13,
        data: data.map(item => item.total),
      },
      {
        name: '货车总数',
        type: 'bar',
        smooth: true,
        barMaxWidth: 13,
        data: data.map(item => item.totalTrucks),
      },
      {
        name: '货车超限数',
        type: 'bar',
        smooth: true,
        barMaxWidth: 13,
        data: data.map(item => item.overTotal),
      },
      {
        name: '货车超限率',
        type: 'line',
        smooth: true,
        data: data.map(item =>
          item.totalTrucks ? ((item.overTotal / item.totalTrucks) * 100).toFixed(2) : '0.00',
        ),
        yAxisIndex: 1,
      },
    ];

    const option = {
      color: colors,
      title: {
        text: '超限率统计',
        textStyle: {
          fontSize: '15',
          fontWeight: 300,
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
      },
      legend: {
        right: '0',
        data: ['检测数', '货车总数', '货车超限数', '货车超限率'],
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        containLabel: true,
      },
      dataZoom: [
        {
          show: true,
          realtime: true,
          // filterMode: 'empty'
          start: 0,
          end: 70,
        },
        {
          type: 'inside',
          realtime: true,
          // filterMode: 'empty'
          start: 0,
          end: 70,
        },
      ],
      xAxis: {
        type: 'category',
        axisTick: {
          alignWithLabel: true,
        },
        // boundaryGap: false,
        data: xAxisData,
      },
      yAxis: [
        {
          type: 'value',
          name: '超限数',
        },
        {
          type: 'value',
          name: '超限率',
          axisLabel: {
            formatter: '{value}%',
          },
        },
      ],
      series,
    };
    return data.length ? (
      <ReactEcharts option={option} style={{ height: 'calc(100vh - 542px)' }} />
    ) : (
      <Empty
        style={{ height: 'calc(100vh - 606px)', lineHeight: 'calc(100vh - 606px)' }}
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  };

  pieChart = () => {
    const {
      TrafficApiV2Count: {
        overLimitData: { data },
      },
    } = this.props;
    // const datas = this.getData();
    // const overLimit = datas;
    let [count, overLimitCount, truckTotal] = [0, 0, 0];

    for (let i = 0; i < data.length; i += 1) {
      count += parseInt(data[i].total, 10);
      overLimitCount += parseInt(data[i].overTotal, 10);
      truckTotal += parseInt(data[i].totalTrucks, 10);
    }

    const seriesData = [
      {
        value: truckTotal,
        name: '货车总数',
      },
      {
        value: overLimitCount,
        name: '货车超限数',
      },
    ];

    const option = {
      color: colors,
      title: {
        text: '超限数统计',
        textStyle: {
          fontSize: '15',
          fontWeight: 300,
        },
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        right: 0,
        data: ['货车总数', '货车超限数'],
      },
      series: [
        {
          name: '',
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: true,
              position: 'center',
              fontSize: '18',
              color: 'green',
              formatter: `总检测数\n\n${count}`,
            },
          },
          labelLine: {
            normal: {
              show: false,
            },
          },
          data: seriesData,
        },
      ],
    };

    return data.length ? (
      <ReactEcharts option={option} style={{ height: 'calc(100vh - 542px)' }} />
    ) : (
      <Empty
        style={{ height: 'calc(100vh - 606px)', lineHeight: 'calc(100vh - 606px)' }}
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  };

  dateTypeChange = e => {
    this.setState({ dateType: e });
  };

  originChange = e => {
    this.getUserSite(e, res => {
      this.setState({ userSite: res });
    });
  };

  renderForm = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { dateType, isopen, userSite } = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8 }}>
          <Col md={4} sm={24}>
            <div className={publicCss.inputMain}>
              <span
                style={{ width: '65px', lineHeight: '30px', height: '32px' }}
                className="ant-input-group-addon"
              >
                来源
              </span>
              <FormItem style={{ flex: 1, marginBottom: 0 }}>
                {getFieldDecorator('origin', {
                  initialValue: 1,
                })(
                  <Select
                    onChange={this.originChange}
                    className={publicCss.inputGroupLeftRadius}
                    placeholder="请选择"
                  >
                    <Option value={1}>动态检测</Option>
                    <Option value={2}>静态检测</Option>
                  </Select>,
                )}
              </FormItem>
            </div>
          </Col>
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
                时间类型
              </span>
              <FormItem style={{ flex: 1, marginBottom: 0 }}>
                {getFieldDecorator('dateType', {
                  initialValue: 1,
                })(
                  <Select
                    className={publicCss.inputGroupLeftRadius}
                    placeholder="请选择"
                    onChange={this.dateTypeChange}
                  >
                    <Option value={1}>天</Option>
                    <Option value={2}>月</Option>
                    <Option value={3}>年</Option>
                  </Select>,
                )}
              </FormItem>
            </div>
          </Col>
          <Col md={5} sm={24}>
            {dateType === 1 ? (
              <div className={publicCss.inputMain}>
                <span
                  style={{ width: '80px', lineHeight: '30px', height: '32px' }}
                  className="ant-input-group-addon"
                >
                  日期选择
                </span>
                <FormItem style={{ flex: 1, marginBottom: 0 }}>
                  {getFieldDecorator('dateStr')(
                    <DatePicker
                      className={publicCss.inputGroupLeftRadius}
                      style={{ width: '100%' }}
                    />,
                  )}
                </FormItem>
              </div>
            ) : null}
            {dateType === 2 ? (
              <div className={publicCss.inputMain}>
                <span
                  style={{ width: '80px', lineHeight: '30px', height: '32px' }}
                  className="ant-input-group-addon"
                >
                  月份选择
                </span>
                <FormItem style={{ flex: 1, marginBottom: 0 }}>
                  {getFieldDecorator('dateStr')(
                    <MonthPicker
                      format="YYYY-MM"
                      className={publicCss.inputGroupLeftRadius}
                      style={{ width: '100%' }}
                    />,
                  )}
                </FormItem>
              </div>
            ) : null}
            {dateType === 3 ? (
              <div className={publicCss.inputMain}>
                <span
                  style={{ width: '80px', lineHeight: '30px', height: '32px' }}
                  className="ant-input-group-addon"
                >
                  年份选择
                </span>
                <FormItem style={{ flex: 1, marginBottom: 0 }}>
                  {getFieldDecorator('dateStr')(
                    <DatePicker
                      open={isopen}
                      mode="year"
                      format="YYYY"
                      style={{ width: '100%' }}
                      className={publicCss.inputGroupLeftRadius}
                      onOpenChange={this.handleOpenChange}
                      onPanelChange={this.handlePanelChange}
                    />,
                  )}
                </FormItem>
              </div>
            ) : null}
          </Col>
          <Col md={5} sm={24}>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ float: 'right' }}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                  重置
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Form>
    );
  };

  render() {
    const {
      TrafficApiV2Count: {
        overLimitData: { columns, tableData },
      },
      loading,
    } = this.props;
    return (
      <Fragment>
        {checkAuth(authority[0]) ? null : <Redirect to="/exception/403" />}
        <Card bordered={false}>
          <div className={styles.tableListForm}>{this.renderForm()}</div>
        </Card>
        <div>
          <Card bordered={false} style={{ marginTop: 8 }}>
            <Card.Grid style={{ width: '70%' }}>
              <Spin spinning={loading}>{this.getLineChart()}</Spin>
            </Card.Grid>
            <Card.Grid style={{ width: '30%' }}>
              <Spin spinning={loading}>{this.pieChart()}</Spin>
            </Card.Grid>
            <Card.Grid style={{ width: '100%' }}>
              <StandardTable
                tableAlert={false}
                selectedRows={0}
                rowSelection={null}
                loading={loading}
                data={{ list: tableData }}
                size="middle"
                columns={columns}
                pagination={false}
                scroll={{ x: '160%' }}
              />
            </Card.Grid>
          </Card>
        </div>
      </Fragment>
    );
  }
}

export default Overrun;
