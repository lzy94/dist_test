import React, { PureComponent, Fragment } from 'react';
import { Button, Card, Col, Form, Empty, Row, Select, DatePicker, Spin, Statistic } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { Redirect } from 'umi';
import ReactEcharts from 'echarts-for-react';
import publicCss from '@/pages/style/public.less';
import styles from '@/pages/style/style.less';
import { checkAuth } from '@/utils/utils';

const FormItem = Form.Item;
const { Option } = Select;
const { MonthPicker } = DatePicker;
const authority = ['/datavideo/shaft'];
const colors = ['#1890ff', '#2fc25b', '#13c2c2', '#facc14'];

/* eslint react/no-multi-comp:0 */
@connect(({ system, TrafficApiV2Count, ChartStatistics, loading }) => ({
  system,
  TrafficApiV2Count,
  loading: loading.models.TrafficApiV2Count,
  ChartStatistics,
}))
@Form.create()
class Overrun extends PureComponent {
  state = {
    userSite: [],
    dateType: 1,
    isopen: false,
    formValues: {
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
      type: 'TrafficApiV2Count/axleCount',
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

  renderProportion = () => {
    const {
      TrafficApiV2Count: { axleData },
    } = this.props;
    if (!axleData.length) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    let count = 0;
    for (let i = 0; i < axleData.length; i += 1) {
      count += parseInt(axleData[i].total, 10);
    }

    const statisticList = axleData.map(item => {
      return (
        <Card.Grid style={{ width: '20%' }} key={item.axle}>
          <Statistic
            style={{ textAlign: 'center' }}
            title={`${item.axle}轴占比`}
            precision={2}
            valueStyle={{ color: '#13c2c2' }}
            value={((item.total / count) * 100).toFixed(2)}
            suffix="%"
          />
        </Card.Grid>
      );
    });

    return statisticList;
  };

  getLineChart = () => {
    const {
      TrafficApiV2Count: { axleData },
    } = this.props;
    const xAxisData = axleData.map(item => `${item.axle}轴`);
    const series = [
      {
        name: '检测数',
        type: 'bar',
        smooth: true,
        barMaxWidth: 13,
        data: axleData.map(item => item.total),
      },
      {
        name: '超限数',
        type: 'bar',
        smooth: true,
        barMaxWidth: 13,
        data: axleData.map(item => item.overTotal),
      },
      {
        name: '超限率',
        type: 'line',
        smooth: true,
        data: axleData.map(item => `${((item.overTotal / (item.total || 1)) * 100).toFixed(2)}`),
        yAxisIndex: 1,
      },
    ];

    const option = {
      color: colors,
      title: {
        text: '轴型超限率统计',
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
        data: ['检测数', '超限数', '超限率'],
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
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
    return axleData.length ? (
      <ReactEcharts option={option} style={{ height: 'calc(100vh - 395px)' }} />
    ) : (
      <Empty
        style={{ height: 'calc(100vh - 459px)', lineHeight: 'calc(100vh - 459px)' }}
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  };

  pieChart = () => {
    const {
      TrafficApiV2Count: { axleData },
    } = this.props;

    let count = 0;
    for (let i = 0; i < axleData.length; i += 1) {
      count += parseInt(axleData[i].total, 10);
    }

    const seriesData = axleData.map(item => {
      return {
        value: ((item.overTotal / (count || 1)) * 100).toFixed(2),
        name: `${item.axle}轴`,
      };
    });

    const option = {
      color: colors,
      title: {
        text: '轴型统计',
        textStyle: {
          fontSize: '15',
          fontWeight: 300,
        },
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}%',
      },
      legend: {
        orient: 'vertical',
        right: 0,
        data: axleData.map(item => `${item.axle}轴`),
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
    return axleData.length ? (
      <ReactEcharts option={option} style={{ height: 'calc(100vh - 395px)' }} />
    ) : (
      <Empty
        style={{ height: 'calc(100vh - 459px)', lineHeight: 'calc(100vh - 459px)' }}
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
    const { userSite, dateType, isopen } = this.state;
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
                  <Select className={publicCss.inputGroupLeftRadius} placeholder="请选择">
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
                      // onChange={this.clearValue}
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
    const { loading } = this.props;
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
            <Card.Grid style={{ width: '100%', height: 155 }}>
              <Spin spinning={loading}>{this.renderProportion()}</Spin>
            </Card.Grid>
          </Card>
        </div>
      </Fragment>
    );
  }
}

export default Overrun;
