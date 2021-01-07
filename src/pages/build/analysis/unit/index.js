import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Card, DatePicker, Form, Row, Col, Button } from 'antd';
import ReactEcharts from 'echarts-for-react';
import StandardTable from '@/components/StandardTable';
import { cate } from '@/utils/constant';

import publicCss from '@/pages/style/public.less';
import styles from '@/pages/style/style.less';
import myStyles from '../style.less';

const FormItem = Form.Item;
const newCate = cate.slice(1);

/* eslint react/no-multi-comp:0 */
@connect(({ BuildSafetyUnit, loading }) => ({
  BuildSafetyUnit,
  loading: loading.models.BuildSafetyUnit,
}))
@Form.create()
class RawIndex extends PureComponent {
  state = {};

  componentDidMount() {
    this.getList({
      startTime: moment().format('YYYY-MM-DD'),
      endTime: moment()
        .add(1, 'days')
        .format('YYYY-MM-DD'),
    });
  }

  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'BuildSafetyUnit/unitproject',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.getList({
      startTime: moment().format('YYYY-MM-DD'),
      endTime: moment()
        .add(1, 'days')
        .format('YYYY-MM-DD'),
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((_, fieldsValue) => {
      console.log(fieldsValue.time);
      const params = fieldsValue.time
        ? {
            startTime: moment(fieldsValue.time[0]).format('YYYY-MM-DD'),
            endTime: moment(fieldsValue.time[1]).format('YYYY-MM-DD'),
          }
        : {
            startTime: moment().format('YYYY-MM-DD'),
            endTime: moment()
              .add(1, 'days')
              .format('YYYY-MM-DD'),
          };
      this.getList(params);
    });
  };

  renderChart = data => {
    const keys = Object.keys(data[2] || {});
    const chartOption = {
      color: ['#2498E4'],
      grid: {
        top: '8%',
        left: '0',
        right: '3%',
        bottom: '9%',
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
        bottom: 10,
        left: 'center',
        data: ['合格率'],
        itemWidth: 14,
      },
      xAxis: {
        type: 'category',
        // axisLabel: {
        //   interval: 0,
        //   rotate: 45,
        // },
        data: newCate,
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value} %',
        },
        splitLine: {
          show: false,
          lineStyle: {
            color: '#48A2B3',
          },
        },
      },
      series: [
        {
          name: '合格率',
          data: keys.map(item => data[2][item]).slice(2),
          type: 'bar',
          barMaxWidth: 50,
          label: {
            show: true,
            position: 'top',
            color: '#333',
          },
        },
      ],
    };
    return <ReactEcharts style={{ height: '100%' }} ref={this.myChart} option={chartOption} />;
  };

  renderForm = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={16}>
          <Col md={8} sm={24}>
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
        </Row>
      </Form>
    );
  };

  render() {
    const {
      loading,
      BuildSafetyUnit: { data },
    } = this.props;
    const body = {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    };
    return (
      <div className={myStyles.main}>
        <Card bordered={false}>
          <div className={styles.tableListForm}>{this.renderForm()}</div>
        </Card>
        <Card bordered={false} className={myStyles.content} bodyStyle={body}>
          <div className={myStyles.myChart}>{this.renderChart(data.list)}</div>
          <div className={myStyles.myTable}>
            <StandardTable
              tableAlert={false}
              selectedRows={0}
              rowSelection={null}
              loading={loading}
              data={{ list: data.list }}
              size="middle"
              columns={data.columns}
              pagination={false}
            />
          </div>
        </Card>
      </div>
    );
  }
}

export default RawIndex;
