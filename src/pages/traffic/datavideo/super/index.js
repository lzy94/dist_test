import React, {PureComponent, Fragment} from 'react';
import {Button, Card, Col, Form, Empty, Row, Select, DatePicker, Spin} from 'antd';
import {connect} from 'dva';
import moment from 'moment';
import {Redirect} from 'umi';
import {checkAuth} from "@/utils/utils";
import StandardTable from '@/components/StandardTable';
import ReactEcharts from 'echarts-for-react';
import publicCss from "@/pages/style/public.less";
import styles from "@/pages/style/style.less";

const FormItem = Form.Item;
const Option = Select.Option;
const {MonthPicker} = DatePicker;
const authority = ['/datavideo/super'];

const colors = ['#1890ff', '#2fc25b', '#13c2c2', '#facc14'];

/* eslint react/no-multi-comp:0 */
@connect(({system, ChartStatistics, loading}) => ({
  system,
  ChartStatistics,
  loading: loading.models.ChartStatistics,
}))
@Form.create()
class SuperChart extends PureComponent {

  state = {
    userSite: [],
    dateType: 1,
    formValues: {
      type: 'super',
      siteCode: '',
      dateType: 1,
      dateOfCount: moment(new Date()).format('YYYY-MM-DD')
    },
  };


  componentDidMount() {
    if (!checkAuth(authority[0])) return;
    const {formValues} = this.state;
    this.getList(formValues);
    this.getUserSite(1, res => {
      this.getUserSite(2, res2 => {
        this.setState({userSite: res.concat(res2)})
      });
    });

  };

  componentWillUnmount() {
    this.resetOverData();
  }

  resetOverData = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'ChartStatistics/resetOverrun',
    })
  };

  getList = (params = {}) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'ChartStatistics/overSpeedCount',
      payload: params
    })
  };


  getUserSite = (siteType, callback) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'system/userSite',
      payload: {
        siteType: siteType
      },
      callback: res => {
        const siteList = res.map(item => {
          const key = Object.keys(item).join();
          return {
            code: key,
            name: item[key]
          }
        });
        callback(siteList);
      }
    })
  };


  handleSearch = e => {
    e.preventDefault();
    const {form} = this.props;
    this.resetOverData();
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
      values.dateOfCount = moment(values.dateOfCount).format(format);
      this.setState({
        formValues: values,
      });

      this.getList(values)
    });
  };

  handleFormReset = () => {
    const {form} = this.props;
    form.resetFields();
    const formValues = {
      siteCode: '',
      dateType: 1,
      dateOfCount: moment(new Date()).format('YYYY-MM-DD')
    };
    this.setState({
      formValues: formValues,
    });
    this.resetOverData();
    this.getList(formValues);
  };


  getData = () => {
    const {ChartStatistics: {overRunData}} = this.props;
    const overLimit = overRunData.overLimit;
    const total = overRunData.total;
    return [overLimit, total]
  };

  formatData = () => {
    const data = this.getData();
    const {formValues} = this.state;
    const field = ['HOUR', 'DAY', 'MONTH'];
    const index = formValues.dateType - 1;
    const newDate = JSON.parse(JSON.stringify(data[0]));
    const xAxisData = data[1].map(item => item[field[index]]);
    const overLimitX = data[0].map(item => item[field[index]]);
    for (const i in xAxisData) {
      if (overLimitX.indexOf(xAxisData[i]) < 0) {
        newDate.push({
          TOTAL: 0,
          [field[index]]: xAxisData[i]
        });
      }
    }
    return newDate.sort((a, b) => a[field[index]] - b[field[index]]);
  };

  getLineChart = () => {
    const datas = this.getData();
    const {formValues} = this.state;
    const overLimit = datas[0];
    const total = datas[1];
    if (overLimit.length === 0) return <Empty style={{height: 336, lineHeight: '330px'}}
                                              image={Empty.PRESENTED_IMAGE_SIMPLE}/>;
    let xAxisData = total.map(item => `${item.HOUR}:时`);
    if (formValues.dateType === 2) {
      xAxisData = total.map(item => `${item.DAY}日`);
    } else if (formValues.dateType === 3) {
      xAxisData = total.map(item => `${item.MONTH}月`);
    }
    const series = [
      {
        name: '检测数',
        type: 'bar',
        smooth: true,
        barMaxWidth:13,
        data: total.map(item => item.TOTAL)
      },
      {
        name: '超速数',
        type: 'bar',
        smooth: true,
        barMaxWidth:13,
        data: this.formatData().map(item => item.TOTAL)
      },
      {
        name: '超速率',
        type: 'line',
        smooth: true,
        data: total.map((item, index) => (this.formatData()[index].TOTAL / item.TOTAL * 100).toFixed(2)),
        yAxisIndex: 1,
      }
    ];

    const option = {
      color: colors,
      title: {
        text: '超速率统计',
        textStyle: {
          fontSize: '15',
          fontWeight: 300
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      legend: {
        right: '0',
        data: ['检测数', '超速数', '超速率']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        axisTick: {
          alignWithLabel: true
        },
        // boundaryGap: false,
        data: xAxisData
      },
      dataZoom: [
        {
          show: true,
          realtime: true,
          // filterMode: 'empty'
          start: 0,
          end: 70
        },
        {
          type: 'inside',
          realtime: true,
          // filterMode: 'empty'
          start: 0,
          end: 70
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: '超速数'
        },
        {
          type: 'value',
          name: '超速率',
          axisLabel: {
            formatter: '{value}%'
          }
        }
      ],
      series: series
    };
    return <ReactEcharts
      option={option}
      style={{height: 400}}
    />
  };


  pieChart = () => {
    const datas = this.getData();
    const overLimit = datas[0];
    const total = datas[1];
    if (overLimit.length === 0) return <Empty style={{height: 336, lineHeight: '330px'}}
                                              image={Empty.PRESENTED_IMAGE_SIMPLE}/>;
    let count = 0, overLimitCount = 0;
    for (let i = 0; i < total.length; i++) {
      count += total[i].TOTAL;
    }
    for (let i = 0; i < overLimit.length; i++) {
      overLimitCount += overLimit[i].TOTAL;
    }
    const seriesData = [{
      value: overLimitCount,
      name: '超速数'
    }, {
      value: count - overLimitCount,
      name: '未超速数'
    }];

    const option = {
      color: colors,
      title: {
        text: '超速数统计',
        textStyle: {
          fontSize: '15',
          fontWeight: 300
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      legend: {
        orient: 'vertical',
        right: 0,
        data: ['超速数', '未超速数']
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
              formatter: `总检测数\n\n${count}`
            },
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: seriesData
        }
      ]
    };

    return <ReactEcharts
      option={option}
      style={{height: 400}}
    />
  };

  dateTypeChange = e => {
    this.setState({dateType: e})
  };

  renderForm = () => {
    const {form: {getFieldDecorator}} = this.props;
    const {userSite, dateType} = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{md: 8, lg: 16, xl: 32}}>
          <Col md={5} sm={24}>
            <div className={publicCss.inputMain}>
                            <span style={{width: '65px', lineHeight: '30px', height: '32px'}}
                                  className="ant-input-group-addon">站点</span>
              <FormItem style={{flex: 1, marginBottom: 0}}>
                {getFieldDecorator('siteCode')(
                  <Select className={publicCss.inputGroupLeftRadius} placeholder="请选择">
                    {userSite.map((item, index) => <Option key={index} value={item.code}>{item.name}</Option>)}
                  </Select>
                )}
              </FormItem>
            </div>
          </Col>
          <Col md={5} sm={24}>
            <div className={publicCss.inputMain}>
                            <span style={{width: '80px', lineHeight: '30px', height: '32px'}}
                                  className="ant-input-group-addon">时间类型</span>
              <FormItem style={{flex: 1, marginBottom: 0}}>
                {getFieldDecorator('dateType')(
                  <Select className={publicCss.inputGroupLeftRadius} placeholder='请选择' onChange={this.dateTypeChange}>
                    <Option value={1}>天</Option>
                    <Option value={2}>月</Option>
                    <Option value={3}>年</Option>
                  </Select>
                )}
              </FormItem>
            </div>
          </Col>
          <Col md={5} sm={24}>
            {dateType === 1 ? <div className={publicCss.inputMain}>
                            <span style={{width: '80px', lineHeight: '30px', height: '32px'}}
                                  className="ant-input-group-addon">日期选择</span>
              <FormItem style={{flex: 1, marginBottom: 0}}>
                {getFieldDecorator('dateOfCount')(
                  <DatePicker className={publicCss.inputGroupLeftRadius} style={{width: '100%'}}/>
                )}
              </FormItem>
            </div> : null}
            {dateType === 2 ? <div className={publicCss.inputMain}>
                            <span style={{width: '80px', lineHeight: '30px', height: '32px'}}
                                  className="ant-input-group-addon">月份选择</span>
              <FormItem style={{flex: 1, marginBottom: 0}}>
                {getFieldDecorator('dateOfCount')(
                  <MonthPicker format='YYYY-MM' className={publicCss.inputGroupLeftRadius} style={{width: '100%'}}/>
                )}
              </FormItem>
            </div> : null}
            {dateType === 3 ? <div className={publicCss.inputMain}>
                            <span style={{width: '80px', lineHeight: '30px', height: '32px'}}
                                  className="ant-input-group-addon">年份选择</span>
              <FormItem style={{flex: 1, marginBottom: 0}}>
                {getFieldDecorator('dateOfCount')(
                  <MonthPicker format="YYYY" className={publicCss.inputGroupLeftRadius} style={{width: '100%'}}/>
                )}
              </FormItem>
            </div> : null}
          </Col>
          <Col md={4} sm={24}>
            <div style={{overflow: 'hidden'}}>
              <div>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>
                  重置
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Form>
    )
  };

  render() {
    const {ChartStatistics: {overRunData, columns, tableData}, loading} = this.props;
    return (
      <Fragment>
        {checkAuth(authority[0]) ? null : <Redirect to="/exception/403"/>}
        <Card bordered={false}>
          <div className={styles.tableListForm}>
            {this.renderForm()}
          </div>
        </Card>
        <div>
          <Card bordered={false} style={{marginTop: 8}}>
            <Card.Grid style={{width: '70%'}}>
              <Spin spinning={loading}>
                {this.getLineChart()}
              </Spin>
            </Card.Grid>
            <Card.Grid style={{width: '30%'}}>
              <Spin spinning={loading}>
                {this.pieChart()}
              </Spin>
            </Card.Grid>
            <Card.Grid style={{width: '100%'}}>
              <StandardTable
                tableAlert={false}
                selectedRows={0}
                rowSelection={null}
                loading={loading}
                data={tableData}
                size='middle'
                columns={columns}
                pagination={false}
                scroll={{x: '160%'}}
              />
            </Card.Grid>
          </Card>
        </div>
      </Fragment>
    );
  }
}

export default SuperChart;
