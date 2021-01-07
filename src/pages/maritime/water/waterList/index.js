import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Form, Row, Col, Button, Tag, DatePicker } from 'antd';
import StandardTable from '@/components/StandardTable';

import MyDatePicker from '@/components/MyDatePicker';
import styles from '@/pages/style/style.less';
import publicCss from '@/pages/style/public.less';

const FormItem = Form.Item;

/* eslint react/no-multi-comp:0 */
@connect(({ MaritimePoint, loading }) => ({
  MaritimePoint,
  loading: loading.models.MaritimePoint,
}))
@Form.create()
class Index extends PureComponent {
  state = {
    formValues: [],
    pageBean: { page: 1, pageSize: 10, showTotal: true },
  };

  columns = [
    {
      title: '地点',
      dataIndex: 'addr',
    },
    {
      title: '时间',
      dataIndex: 'createTime',
      width: 170,
      render: val => moment(val).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '正常水位',
      width: 100,
      dataIndex: 'normalHigh',
    },
    {
      title: '预警水位',
      width: 100,
      dataIndex: 'warningHigh',
    },
    {
      title: '水位',
      width: 100,
      dataIndex: 'waterLevel',
    },
    {
      title: '状态',
      width: 130,
      render: (val, record) => {
        return record.warning ? <Tag color="#f50">预警</Tag> : <Tag color="#108ee9">正常</Tag>;
      },
    },
  ];

  componentDidMount() {
    const { pageBean } = this.state;
    this.getList({ pageBean });
  }

  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'MaritimePoint/waterList',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form } = this.props;
    const { pageBean } = this.state;
    form.resetFields();
    this.setState({
      formValues: [],
    });
    this.getList({ pageBean });
  };

  handleStandardTableChange = pagination => {
    const { formValues } = this.state;
    const params = {
      pageBean: {
        page: pagination.current,
        pageSize: pagination.pageSize,
        showTotal: true,
      },
      querys: formValues,
    };
    this.getList(params);
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    const { pageBean } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const arr = [
        {
          property: 'createTime',
          // value: pickerValue[0] && pickerValue[1] ? pickerValue : '',
          value: fieldsValue.createTime
            ? [
                moment(fieldsValue.createTime[0]).format('YYYY-MM-DD HH:mm:ss'),
                moment(fieldsValue.createTime[1]).format('YYYY-MM-DD HH:mm:ss'),
              ]
            : '',
          group: 'main',
          operation: 'BETWEEN',
          relation: 'AND',
        },
      ].filter(item => item.value !== '');

      this.getList({ pageBean, querys: arr });
    });
  };

  renderSimpleForm() {
    const { form } = this.props;
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
              <FormItem style={{ flex: 1 }}>
                {form.getFieldDecorator('createTime')(
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
      MaritimePoint: { waterListData },
      loading,
    } = this.props;
    return (
      <Card bordered={false}>
        <div className={styles.tableList}>
          <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
          <StandardTable
            rowKey="id_"
            size="middle"
            tableAlert={false}
            selectedRows={0}
            rowSelection={null}
            loading={loading}
            data={waterListData}
            columns={this.columns}
            onChange={this.handleStandardTableChange}
          />
        </div>
      </Card>
    );
  }
}

export default Index;
