import React, { PureComponent, Fragment } from 'react';
import { Button, Card, Col, DatePicker, Empty, Form, Row, Select, Spin } from 'antd';
import ReactEcharts from 'echarts-for-react';
import { connect } from 'dva';
import moment from 'moment';
import { Redirect } from 'umi';
import publicCss from '@/pages/style/public.less';
import styles from '@/pages/style/style.less';
import { checkAuth } from '@/utils/utils';

const FormItem = Form.Item;
const Option = Select.Option;
const { MonthPicker } = DatePicker;
const colors = [
  '#1890ff',
  '#2fc25b',
  '#13c2c2',
  '#facc14',
  '#edafda',
  '#93b7e3',
  '#a5e7f0',
  '#cbb0e3',
];
const authority = ['/lawenfor/assess'];

@connect(({ system, ChartStatistics, loading }) => ({
  system,
  ChartStatistics,
  loading: loading.models.ChartStatistics,
}))
@Form.create()
class AssessChart extends PureComponent {
  state = {
    userSite: [],
    dateType: 1,
    formValues: {
      siteCode: '',
      dateType: 1,
      dateOfCount: moment(new Date()).format('YYYY-MM-DD'),
    },
  };

  componentDidMount() {
    if (!checkAuth(authority[0])) return;
    const { formValues } = this.state;
    this.getList(formValues);
    this.getUserSite(1);
  }

  getList = (params = {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ChartStatistics/lawCount',
      payload: params,
    });
  };

  resetData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ChartStatistics/resetAssess',
    });
  };

  getUserSite = siteType => {
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
        this.setState({ userSite: siteList });
      },
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    this.resetData();
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
      };
      let date = moment(values.dateOfCount).format('YYYY-MM-DD');
      if (values.dateType === 2) {
        date = moment(values.dateOfCount).format('YYYY-MM');
      } else if (values.dateType === 3) {
        date = moment(values.dateOfCount).format('YYYY');
      }
      values.dateOfCount = date;
      this.setState({
        formValues: values,
      });

      this.getList(values);
    });
  };

  getDataX = data => {
    const { formValues } = this.state;
    let key = 'HOUR',
      str = '时';
    if (formValues.dateType === 2) {
      key = 'DAY';
      str = '日';
    } else if (formValues.dateType === 3) {
      key = 'MONTH';
      str = '月';
    }
    const x = [];
    for (let i = 0; i < data.length; i++) {
      x.push(data[i][key] + str);
    }
    return x;
  };

  getCount = (key, list) => {
    let count = 0;
    for (let i = 0; i < list.length; i++) {
      count += list[i][key];
    }
    return count;
  };

  setOption = (title, legendData, xAxisData, series) => {
    const option = {
      color: colors,
      title: {
        text: title,
        textStyle: {
          fontSize: 15,
          fontWeight: 500,
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
      },
      legend: {
        itemHeight: 14,
        itemWidth: 14,
        data: legendData,
      },
      dataZoom: [
        {
          show: true,
          realtime: true,
          // filterMode: 'empty'
          start: 0,
          end: 50,
        },
        {
          type: 'inside',
          realtime: true,
          // filterMode: 'empty'
          start: 0,
          end: 50,
        },
      ],
      // toolbox: {
      //   show: true,
      //   feature: {
      //     magicType: {type: ['line', 'bar']},
      //   }
      // },
      grid: {
        left: '3%',
        right: '4%',
        bottom: 40,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        // boundaryGap: false,
        axisTick: {
          alignWithLabel: true,
        },
        data: xAxisData,
      },
      yAxis: {
        type: 'value',
      },
      series: series,
    };
    return option;
  };

  countChart = () => {
    const {
      ChartStatistics: { lawCountList },
    } = this.props;
    const list = lawCountList.pendingVerify;
    const { formValues } = this.state;
    let str = '日';
    if (formValues.dateType === 2) {
      str = '月';
    } else if (formValues.dateType === 3) {
      str = '年';
    }
    const count = this.getCount('TOTAL', list);

    const data = [
      { value: this.getCount('PENDINGVERIFY', list), name: '初审' },
      { value: this.getCount('VERIFYPASS', list), name: '复审' },
      { value: this.getCount('INCALIDDATE', list), name: '无效数据' },
      { value: this.getCount('PENALTYDATE', list), name: '签批' },
      { value: this.getCount('ARCHIVEDATE', list), name: '结案' },
    ];

    const option = {
      color: colors,
      title: {
        text: `执法统计(${str})各项占比`,
        textStyle: {
          fontSize: 15,
          fontWeight: 500,
        },
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        itemHeight: 14,
        itemWidth: 14,
        right: 0,
        formatter: name => {
          let value = 0;
          for (let i = 0; i < data.length; i++) {
            if (name === data[i].name) {
              value = data[i].value;
              break;
            }
          }
          const arr = [`{a|${name}}{b|${count ? ((value / count) * 100).toFixed(2) : 0}%}`];
          return arr;
        },
        textStyle: {
          color: '#666',
          lineHeight: 20,
          rich: {
            a: {
              fontSize: 12,
              width: 80,
            },
            b: {
              fontSize: 12,
            },
          },
        },
        // data: ['初审', '复审', '无效数据', '签批', '结案']
      },
      series: [
        {
          name: '执法统计',
          type: 'pie',
          radius: ['55%', '70%'],
          center: ['50%', '60%'],
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
          data: data,
        },
      ],
    };
    return list.length ? (
      <ReactEcharts style={{ height: 'calc(100vh - 315px)' }} option={option} />
    ) : (
      <Empty
        style={{ height: 'calc(100vh - 380px)', lineHeight: 'calc(100vh - 380px)' }}
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  };

  getFormData = (key, list) =>
    list.map(item => {
      return item[key];
    });

  lineChart = () => {
    const {
      ChartStatistics: { lawCountList },
    } = this.props;
    const list = lawCountList.pendingVerify;
    const x = this.getDataX(list);
    const series = [
      {
        name: '初审',
        type: 'bar',
        smooth: true,
        barMaxWidth: 20,
        data: this.getFormData('PENDINGVERIFY', list),
      },
      {
        name: '复审',
        type: 'bar',
        smooth: true,
        barMaxWidth: 20,
        data: this.getFormData('VERIFYPASS', list),
      },
      {
        name: '无效数据',
        type: 'bar',
        smooth: true,
        barMaxWidth: 20,
        data: this.getFormData('INCALIDDATE', list),
      },
      {
        name: '签批',
        type: 'bar',
        smooth: true,
        barMaxWidth: 20,
        data: this.getFormData('PENALTYDATE', list),
      },
      {
        name: '结案',
        type: 'bar',
        smooth: true,
        barMaxWidth: 20,
        data: this.getFormData('ARCHIVEDATE', list),
      },
      {
        name: '总数',
        type: 'line',
        smooth: true,
        data: this.getFormData('TOTAL', list),
      },
    ];

    const option = this.setOption(
      '执法统计',
      ['初审', '复审', '无效数据', '签批', '结案', '总数'],
      x,
      series,
    );

    return list.length ? (
      <ReactEcharts option={option} style={{ height: 'calc(100vh - 315px)' }} />
    ) : (
      <Empty
        style={{ height: 'calc(100vh - 380px)', lineHeight: 'calc(100vh - 380px)' }}
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  };

  dateTypeChange = e => {
    this.setState({ dateType: e });
  };

  renderForm = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { userSite, dateType } = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 16, xl: 16 }}>
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
                    {userSite.map((item, index) => (
                      <Option key={index} value={item.code}>
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
                {getFieldDecorator('dateType')(
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
                  {getFieldDecorator('dateOfCount')(
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
                  {getFieldDecorator('dateOfCount')(
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
                  {getFieldDecorator('dateOfCount')(
                    <MonthPicker
                      format="YYYY"
                      className={publicCss.inputGroupLeftRadius}
                      style={{ width: '100%' }}
                    />,
                  )}
                </FormItem>
              </div>
            ) : null}
          </Col>
          <Col md={4} sm={24}>
            <div>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    );
  };

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    const formValues = {
      siteCode: '',
      dateType: 1,
      dateOfCount: moment(new Date()).format('YYYY-MM-DD'),
    };
    this.setState({
      formValues: formValues,
    });
    this.resetData();
    this.getList(formValues);
  };

  render() {
    const { loading } = this.props;
    return (
      <Fragment>
        {checkAuth(authority[0]) ? null : <Redirect to="/exception/403" />}
        <div>
          <Card bordered={false}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
          </Card>
          <Card bordered={false} style={{ marginTop: 8 }}>
            <Card.Grid style={{ width: '70%' }}>
              <Spin spinning={loading}>{this.lineChart()}</Spin>
            </Card.Grid>
            <Card.Grid style={{ width: '30%' }}>
              <Spin spinning={loading}>{this.countChart()}</Spin>
            </Card.Grid>
          </Card>
        </div>
      </Fragment>
    );
  }
}

export default AssessChart;
