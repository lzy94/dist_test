import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import clonedeep from 'lodash.clonedeep';
import ReactEcharts from 'echarts-for-react';
import { Row, Col, Card, Form, Button, DatePicker } from 'antd';
import { logsCateChild } from '@/utils/constant';

import publicCss from '@/pages/style/public.less';
import styles from '../../../style/style.less';

const FormItem = Form.Item;

/* eslint react/no-multi-comp:0 */
@connect(({ BuildProduceAnalysis, loading }) => ({
  BuildProduceAnalysis,
  loading: loading.models.BuildProduceAnalysis,
}))
@Form.create()
class TableList extends PureComponent {
  state = {};

  componentDidMount() {
    this.initData();
  }

  initData = () => {
    const time = {
      startTime: moment().format('YYYY-MM-DD'),
      endTime: moment()
        .add(1, 'days')
        .format('YYYY-MM-DD'),
    };
    this.getRawmaterails(time);
    this.getUnitproject(time);
  };

  getRawmaterails = parmas => {
    const { dispatch } = this.props;
    dispatch({
      type: 'BuildProduceAnalysis/rawmaterails',
      payload: parmas,
    });
  };

  getUnitproject = parmas => {
    const { dispatch } = this.props;
    dispatch({
      type: 'BuildProduceAnalysis/unitproject',
      payload: parmas,
    });
  };

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.initData();
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let values = {
        startTime: moment().format('YYYY-MM-DD'),
        endTime: moment()
          .add(1, 'days')
          .format('YYYY-MM-DD'),
      };
      if (fieldsValue.time) {
        values = {
          startTime: moment(fieldsValue.time[0]).format('YYYY-MM-DD'),
          endTime: moment(fieldsValue.time[1]).format('YYYY-MM-DD'),
        };
      }

      this.getRawmaterails(values);
      this.getUnitproject(values);
    });
  };

  getOption = () => ({
    title: {
      text: '',
      left: 'center',
    },
    color: ['#2498E4'],
    grid: {
      top: '10%',
      left: '0',
      right: '3%',
      bottom: '5%',
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999',
        },
      },
    },
    legend: {
      top: 30,
      left: 'center',
      data: ['隐患个数'],
      itemWidth: 14,
    },
    xAxis: {
      type: 'value',
      minInterval: 1,
      min: value => {
        const { min, max } = value;
        if (!min && !max) {
          return 5;
        }
        return 0;
      },
      // axisLabel: {
      //   interval: 0,
      //   rotate: 45,
      // },
      // data: [],
    },
    yAxis: {
      type: 'category',
      data: [],
      // axisLabel: {
      //   formatter: '{value} %',
      // },
      // splitLine: {
      //   show: false,
      //   lineStyle: {
      //     color: '#48A2B3',
      //   },
      // },
    },
    series: [
      {
        name: '隐患个数',
        data: [],
        type: 'bar',
        barMaxWidth: 50,
        // label: {
        //   show: true,
        //   position: 'top',
        //   color: '#333',
        // },
      },
    ],
  });

  getSeries = (list, data) => {
    const arr = list.map(() => 0);
    if (!Object.keys(data).length) {
      return arr;
    }

    const keys = Object.keys(data);
    for (let i = 0; i < keys.length; i += 1) {
      const index = list.indexOf(keys[i]);
      arr[index] = data[keys[i]];
    }
    return arr;
  };

  renderChart1 = data => {
    const option = clonedeep(this.getOption());
    option.yAxis.data = logsCateChild[0];
    option.title.text = '安全基础管理类隐患分析';
    option.series[0].data = this.getSeries(logsCateChild[0], data);
    return <ReactEcharts option={option} style={{ height: '100%' }} />;
  };

  renderChart2 = data => {
    const option = clonedeep(this.getOption());
    option.yAxis.data = logsCateChild[1];
    option.title.text = '施工现场安全管理隐患分析';
    option.series[0].data = this.getSeries(logsCateChild[1], data);
    return <ReactEcharts option={option} style={{ height: '100%' }} />;
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={16}>
          <Col md={6} sm={24}>
            <div className={publicCss.inputMain}>
              <span
                style={{ width: '80px', lineHeight: '30px', height: '32px' }}
                className="ant-input-group-addon"
              >
                检测时间
              </span>
              <FormItem style={{ flex: 1, marginBottom: 0 }}>
                {getFieldDecorator('time')(
                  <DatePicker.RangePicker
                    className={publicCss.inputGroupLeftRadius}
                    style={{ width: '100%' }}
                    format="YYYY-MM-DD"
                  />,
                )}
              </FormItem>
            </div>
          </Col>
          <Col md={6} sm={24}>
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
      BuildProduceAnalysis: { rawmaterails, unitproject },
    } = this.props;
    const he = {
      height: '100%',
    };
    const chartMain = {
      display: 'flex',
      height: 'calc(100% - 56px)',
    };

    const chartItem = {
      flex: 1,
      height: '100%',
    };
    return (
      <Card bordered={false} style={{ height: 'calc(100vh - 175px)' }} bodyStyle={he}>
        <div className={styles.tableList} style={he}>
          <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
          <div style={chartMain}>
            <div style={chartItem}>{this.renderChart1(rawmaterails)}</div>
            <div style={chartItem}>{this.renderChart2(unitproject)}</div>
          </div>
        </div>
      </Card>
    );
  }
}

export default TableList;
