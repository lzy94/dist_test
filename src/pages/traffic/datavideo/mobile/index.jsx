import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Redirect } from 'umi';
import moment from 'moment';
import clonedeep from 'lodash.clonedeep';
import { Card, Select, Button, Form, DatePicker, Spin, Row, Col, Empty } from 'antd';
import ReactEcharts from 'echarts-for-react';
import publicCss from '@/pages/style/public.less';
import styles from '@/pages/style/style.less';
import myStyles from './index.less';
import { checkAuth } from '@/utils/utils';

const authority = ['/datavideo/mobile'];
const FormItem = Form.Item;
const { Option } = Select;
const { MonthPicker } = DatePicker;
const colors = [
  '#2ec7c9',
  '#b6a2de',
  '#5ab1ef',
  '#ffb980',
  '#d87a80',
  '#8d98b3',
  '#e5cf0d',
  '#97b552',
  '#95706d',
  '#dc69aa',
  '#07a2a4',
  '#9a7fd1',
  '#588dd5',
  '#f5994e',
  '#c05050',
  '#59678c',
  '#c9ab00',
  '#7eb00a',
  '#6f5553',
  '#c14089',
];

const pieOption = {
  color: colors,
  title: {
    text: '',
    textStyle: {
      fontSize: '15',
      fontWeight: 300,
    },
  },
  tooltip: {
    trigger: 'item',
    formatter: '{b}: {c}',
  },
  legend: {
    orient: 'vertical',
    right: 0,
    data: [],
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
          formatter: 0,
        },
      },
      labelLine: {
        normal: {
          show: false,
        },
      },
      data: [],
    },
  ],
};

/* eslint react/no-multi-comp:0 */
@connect(({ TrafficApiV2Count, loading }) => ({
  TrafficApiV2Count,
  loading: loading.models.TrafficApiV2Count,
}))
@Form.create()
class Mobile extends PureComponent {
  state = {
    isopen: false,
    dateType: 1,
    formValues: {
      dateType: 1,
      dayValue: moment(new Date()).format('YYYY-MM-DD'),
    },
  };

  componentDidMount() {
    if (!checkAuth(authority[0])) return;
    const { formValues } = this.state;
    this.getList(formValues);
  }

  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'TrafficApiV2Count/mobileCount',
      payload: params,
    });
  };

  handlePanelChange = value => {
    const { form } = this.props;
    form.setFieldsValue({
      dayValue: value,
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

  dateTypeChange = e => {
    this.setState({ dateType: e });
  };

  pieCompletion = (data, field) => {
    const newData = field.map(item => ({
      value: 0,
      name: item,
    }));

    for (let i = 0; i < data.length; i += 1) {
      const index = data[i].CHECKSTATUS;
      newData[index].value = data[i].TOTAL;
    }
    return newData;
  };

  /**
   * @description 饼图
   */
  getCheckChart = () => {
    const {
      TrafficApiV2Count: {
        mobileData: { checkTotal },
      },
    } = this.props;
    const field = ['待审核', '已审核', '待签批', '已签批'];
    const option = clonedeep(pieOption);

    option.title.text = '审核状态';
    option.legend.data = field;
    option.series[0].label.normal.formatter = `总数\n\n${checkTotal
      .map(item => item.TOTAL)
      .reduce((prev, curr) => prev + curr, 0)}`;
    option.series[0].data = this.pieCompletion(checkTotal, field);

    return checkTotal.length ? (
      <ReactEcharts option={option} style={{ height: '100%' }} />
    ) : (
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
    );
  };

  getAxleChart = () => {
    const {
      TrafficApiV2Count: {
        mobileData: { axleTotal },
      },
    } = this.props;
    const option = clonedeep(pieOption);
    option.title.text = '轴型统计';
    option.legend.data = axleTotal.map(itme => `${itme.AXLE}轴`);
    option.series[0].label.normal.formatter = `总数\n\n${axleTotal
      .map(item => item.TOTAL)
      .reduce((prev, curr) => prev + curr, 0)}`;
    option.series[0].data = axleTotal.map(({ TOTAL, AXLE }) => ({
      value: TOTAL,
      name: `${AXLE}轴`,
    }));

    return axleTotal.length ? (
      <ReactEcharts option={option} style={{ height: '100%' }} />
    ) : (
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
    );
  };

  getLineChart = () => {
    const {
      TrafficApiV2Count: {
        mobileData: { countByDayValue },
      },
    } = this.props;
    const { formValues } = this.state;
    const index = formValues.dateType - 1;
    const fieldName = ['', '日', '月'];
    const xAxisData = countByDayValue.map(item => `${item.DAYVALUE}${fieldName[index]}`);
    const series = [
      {
        name: '检测数',
        type: 'bar',
        smooth: true,
        barMaxWidth: 13,
        data: countByDayValue.map(item => item.TOTAL),
      },
    ];

    const option = {
      color: colors,
      title: {
        text: '',
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
        // data: ['检测数'],
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
      yAxis: {
        type: 'value',
        name: '检测数',
      },
      series,
    };

    return countByDayValue.length ? (
      <ReactEcharts option={option} style={{ height: '100%' }} />
    ) : (
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
    );
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
      values.dayValue = moment(values.dayValue).format(format);
      this.setState({
        formValues: values,
      });

      this.getList(values);
    });
  };

  renderForm = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { dateType, isopen } = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8 }}>
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
                  {getFieldDecorator('dayValue')(
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
                  {getFieldDecorator('dayValue')(
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
                  {getFieldDecorator('dayValue')(
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
          <Col md={14} sm={24}>
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

    const style = {
      width: '50%',
      height: '50%',
    };
    return (
      <>
        {checkAuth(authority[0]) ? null : <Redirect to="/exception/403" />}
        <Card bordered={false}>
          <div className={styles.tableListForm}>{this.renderForm()}</div>
        </Card>
        <Card className={myStyles.cardMain} bordered={false}>
          <Card.Grid style={style}>
            {loading ? (
              <Spin spinning={loading}>
                <Empty
                  // style={{ height: 300, lineHeight: '300px' }}
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              </Spin>
            ) : (
              this.getCheckChart()
            )}
          </Card.Grid>
          <Card.Grid style={style}>
            {loading ? (
              <Spin spinning={loading}>
                <Empty
                  // style={{ height: 300, lineHeight: '300px' }}
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              </Spin>
            ) : (
              this.getAxleChart()
            )}
          </Card.Grid>
          <Card.Grid style={{ ...style, width: '100%' }}>
            {loading ? (
              <Spin spinning={loading}>
                <Empty
                  // style={{ height: 300, lineHeight: '300px' }}
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              </Spin>
            ) : (
              this.getLineChart()
            )}
          </Card.Grid>
        </Card>
      </>
    );
  }
}

export default Mobile;
