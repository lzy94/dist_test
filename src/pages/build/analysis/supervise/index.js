import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Card, DatePicker, Form, Row, Col, Button } from 'antd';
import ReactEcharts from 'echarts-for-react';
import { logsCateChild } from '@/utils/constant';
import StandardTable from '@/components/StandardTable';

import publicCss from '@/pages/style/public.less';
import styles from '@/pages/style/style.less';
import myStyles from '../style.less';

const FormItem = Form.Item;
const cate = logsCateChild[2];

/* eslint react/no-multi-comp:0 */
@connect(({ BuildAnalysisSupervise, loading }) => ({
  BuildAnalysisSupervise,
  loading: loading.models.BuildAnalysisSupervise,
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
      type: 'BuildAnalysisSupervise/inspecto',
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
    let series = [];
    if (data.length) {
      const arr = [];
      for (let i = 0; i < cate.length; i += 1) {
        const value = data[0][`list_${i + 1}`];
        arr.push({
          value,
          name: cate[i],
        });
      }
      series = arr;
    } else {
      const arr = [];
      for (let i = 0; i < cate.length; i += 1) {
        series.push({
          value: 0,
          name: cate[i],
        });
      }
      series = arr;
    }

    const chartOption = {
      color: ['#4472C4', '#FFC000', '#A5A5A5', '#ED7D31', '#5B9BD5', '#70AD47'],
      title: {
        text: '质量控制类',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 'middle',
        data: cate,
      },
      series: [
        {
          name: '',
          type: 'pie',
          radius: '55%',
          center: ['50%', '50%'],
          data: series,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
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
      BuildAnalysisSupervise: { data },
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
          <div className={myStyles.myTable} style={{ height: 120 }}>
            <StandardTable
              tableAlert={false}
              selectedRows={0}
              rowSelection={null}
              loading={loading}
              data={{ list: data.list }}
              size="middle"
              columns={data.columns}
              pagination={false}
              scroll={{ x: '120%' }}
            />
          </div>
        </Card>
      </div>
    );
  }
}

export default RawIndex;
