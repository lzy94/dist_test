import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Redirect } from 'umi';
import ReactEcharts from 'echarts-for-react';
import { Button, Col, DatePicker, Form, Row, Select, Card, Spin, Empty, Statistic } from 'antd';
import publicCss from '@/pages/style/public.less';
import styles from '@/pages/style/style.less';
import { checkAuth } from '@/utils/utils';

const authority = ['/datavideo/overrange'];
const FormItem = Form.Item;
const { Option } = Select;
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

/* eslint react/no-multi-comp:0 */
@connect(({ system, TrafficApiV2Count, loading }) => ({
  system,
  TrafficApiV2Count,
  loading: loading.models.TrafficApiV2Count,
}))
@Form.create()
class Overrange extends PureComponent {
  state = {
    userSite: [],
    dateType: 1,
    isopen: false,
    formValues: {
      siteCode: '',
      dateType: 1,
      dateStr: moment(new Date()).format('YYYY-MM-DD'),
    },
  };

  componentDidMount() {
    const { formValues } = this.state;
    this.getList(formValues);
    this.getUserSite(1, res => {
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

  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'TrafficApiV2Count/overRangCount',
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

  dateTypeChange = e => {
    this.setState({ dateType: e });
  };

  getDataX = data => {
    const { formValues } = this.state;
    let str = '时';
    if (formValues.dateType === 2) {
      str = '日';
    } else if (formValues.dateType === 3) {
      str = '月';
    }
    const x = [];
    for (let i = 0; i < data.length; i += 1) {
      if (formValues.dateType === 1) {
        x.push(data[i].day.slice(0, 2) + str);
      } else {
        x.push(data[i].day + str);
      }
    }
    return x;
  };

  getFormData = list => {
    const arr = [[], [], [], [], []];
    for (let i = 0; i < list.length; i += 1) {
      const { range01, range15, range510, range100, total } = list[i];
      arr[0].push(range01);
      arr[1].push(range15);
      arr[2].push(range510);
      arr[3].push(range100);
      arr[4].push(total);
    }
    return arr;
  };

  getLineChart = () => {
    const {
      TrafficApiV2Count: {
        overRangData: { overRangGroupByDay },
      },
    } = this.props;
    const x = this.getDataX(overRangGroupByDay);

    const series = [
      {
        name: '10%以下',
        type: 'bar',
        smooth: true,
        barMaxWidth: 13,
        data: this.getFormData(overRangGroupByDay)[0],
      },
      {
        name: '10%~50%',
        type: 'bar',
        smooth: true,
        barMaxWidth: 13,
        data: this.getFormData(overRangGroupByDay)[1],
      },
      {
        name: '50%~100%',
        type: 'bar',
        smooth: true,
        barMaxWidth: 13,
        data: this.getFormData(overRangGroupByDay)[2],
      },
      {
        name: '100%以上',
        type: 'bar',
        smooth: true,
        barMaxWidth: 13,
        data: this.getFormData(overRangGroupByDay)[3],
      },
      {
        name: '总数',
        type: 'line',
        smooth: true,
        data: this.getFormData(overRangGroupByDay)[4],
      },
    ];
    const option = {
      color: colors,
      title: {
        text: '超限幅度统计',
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
        data: ['10%以下', '10%~50%', '50%~100%', '100%以上', '总数'],
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        axisTick: {
          alignWithLabel: true,
        },
        data: x,
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
      yAxis: [
        {
          type: 'value',
        },
      ],
      series,
    };
    return !overRangGroupByDay.length ? (
      <Empty
        style={{ height: 'calc(100vh - 459px)', lineHeight: 'calc(100vh - 459px)' }}
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    ) : (
      <ReactEcharts option={option} style={{ height: 'calc(100vh - 395px)' }} />
    );
  };

  getCount = key => {
    const {
      TrafficApiV2Count: {
        overRangData: { overRang },
      },
    } = this.props;
    if (Object.keys(overRang).length) {
      return overRang[key].doc_count;
    }
    return 0;
  };

  getAllCount = () => {
    const {
      TrafficApiV2Count: {
        overRangData: { overRang },
      },
    } = this.props;
    const keys = Object.keys(overRang);
    if (keys.length) {
      let count = 0;
      for (let i = 0; i < keys.length; i += 1) {
        count += overRang[keys[i]].doc_count;
      }
      return count;
    }
    return 0;
  };

  pieChart = () => {
    const {
      TrafficApiV2Count: {
        overRangData: { overRang },
      },
    } = this.props;
    const seriesData = [
      {
        value: this.getCount('01range'),
        name: '10%以下',
      },
      {
        value: this.getCount('12range'),
        name: '10%~20%',
      },
      {
        value: this.getCount('23range'),
        name: '20%~30%',
      },
      {
        value: this.getCount('34range'),
        name: '30%~40%',
      },
      {
        value: this.getCount('45range'),
        name: '40%~50%',
      },
      {
        value: this.getCount('510range'),
        name: '50%~100%',
      },
      {
        value: this.getCount('100range'),
        name: '100%以上',
      },
    ];
    const option = {
      color: colors,
      title: {
        text: '超限幅度统计',
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
        bottom: 0,
        data: ['10%以下', '10%~20%', '20%~30%', '30%~40%', '40%~50%', '50%~100%', '100%以上'],
      },
      series: [
        {
          name: '',
          type: 'pie',
          radius: ['55%', '70%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: true,
              position: 'center',
              fontSize: '18',
              color: 'green',
              formatter: `总超限数\n\n${this.getAllCount()}`,
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
    return !Object.keys(overRang).length ? (
      <Empty
        style={{ height: 'calc(100vh - 459px)', lineHeight: 'calc(100vh - 459px)' }}
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    ) : (
      <ReactEcharts option={option} style={{ height: 'calc(100vh - 395px)' }} />
    );
  };

  renderProportion = () => {
    const total = this.getAllCount();
    const dataName = [
      '10%以下',
      '10%~20%',
      '20%~30%',
      '30%~40%',
      '40%~50%',
      '50%~100%',
      '100%以上',
    ];
    const keys = ['01range', '12range', '23range', '34range', '45range', '510range', '100range'];

    if (!total) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    return dataName.map((item, index) => {
      return (
        <Card.Grid style={{ width: '14.28%' }} key={item}>
          <Statistic
            style={{ textAlign: 'center' }}
            title={dataName[index]}
            precision={2}
            valueStyle={{ color: '#13c2c2' }}
            value={total ? ((this.getCount(keys[index]) / total) * 100).toFixed(2) : '0.00'}
            suffix="%"
          />
        </Card.Grid>
      );
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        dateType: fieldsValue.dateType || 1,
        siteCode: fieldsValue.siteCode || '',
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
      siteCode: '',
      dateType: 1,
      dateStr: moment(new Date()).format('YYYY-MM-DD'),
    };
    this.setState({
      formValues,
    });
    this.getList(formValues);
  };

  renderForm = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { userSite, dateType, isopen } = this.state;
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
          <Col md={9} sm={24}>
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
          <Card style={{ marginTop: 8 }} bordered={false}>
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

export default Overrange;
