import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Form, Row, Col, Button, Tag, Select, DatePicker } from 'antd';
import StandardTable from '@/components/StandardTable';

// import MyDatePicker from '@/components/MyDatePicker';
import styles from '@/pages/style/style.less';
import publicCss from '@/pages/style/public.less';

const FormItem = Form.Item;
const { Option } = Select;

const typeMap = [
  {
    type: 1,
    name: '水位点位',
  },
  {
    type: 2,
    name: '位移点位',
  },
];

/* eslint react/no-multi-comp:0 */
@connect(({ ConservePoint, loading }) => ({
  ConservePoint,
  loading: loading.models.ConservePoint,
}))
@Form.create()
class Index extends PureComponent {
  state = {
    formValues: [],
    pageBean: { page: 1, pageSize: 10, showTotal: true },
    defaultQuery: {
      property: 'type',
      value: 1,
      group: 'main',
      operation: 'EQUAL',
      relation: 'AND',
    },
  };

  columns = [
    {
      title: '地点',
      dataIndex: 'addr',
    },
    {
      title: '点位名称',
      dataIndex: 'ponitName',
    },
    {
      title: '点位类型',
      dataIndex: 'type',
      render: val => typeMap[val - 1].name,
    },
    {
      title: '时间',
      dataIndex: 'createTime',
      width: 170,
      render: val => moment(val).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '正常水位',
      // dataIndex: 'normalHigh',
      render: val => (val.type === 1 ? val.normalHigh : '—'),
    },
    {
      title: '预警水位',
      render: val => (val.type === 1 ? val.warningHigh : '—'),
    },
    {
      title: '水位',
      width: 100,
      // dataIndex: 'waterLevel',
      render: val => (val.type === 1 ? val.waterLevel : '—'),
    },
    {
      title: '预警位移',
      render: val => (val.type === 2 ? val.warningHigh : '—'),
    },
    {
      title: '位移',
      render: val => (val.type === 2 ? val.waterLevel : '—'),
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
    const { pageBean, defaultQuery } = this.state;
    this.getList({ pageBean, querys: [defaultQuery] });
    this.getWaterList();
  }

  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ConservePoint/waterList',
      payload: params,
    });
  };

  getWaterList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ConservePoint/fetch',
      payload: {
        pageBean: { page: 1, pageSize: 1000, showTotal: true },
      },
    });
  };

  handleFormReset = () => {
    const { form } = this.props;
    const { pageBean, defaultQuery } = this.state;
    form.resetFields();
    this.setState({
      formValues: [],
    });
    this.getList({ pageBean, querys: [defaultQuery] });
  };

  handleStandardTableChange = pagination => {
    const { formValues, defaultQuery } = this.state;
    const params = {
      pageBean: {
        page: pagination.current,
        pageSize: pagination.pageSize,
        showTotal: true,
      },
      querys: formValues.length ? formValues : [defaultQuery],
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
        {
          property: 'type',
          value: fieldsValue.type,
          group: 'main',
          operation: 'EQUAL',
          relation: 'AND',
        },
        {
          property: 'ponitCode',
          value: fieldsValue.ponitCode ? fieldsValue.ponitCode.split('-')[0] : '',
          group: 'main',
          operation: 'EQUAL',
          relation: 'AND',
        },
      ].filter(item => item.value !== '');
      this.setState({
        formValues: arr,
      });
      this.getList({ pageBean, querys: arr });
    });
  };

  pointChange = e => {
    const type = e ? e.split('-')[1] : '';
    const { form } = this.props;
    form.setFieldsValue({
      type: parseInt(type, 10),
    });
  };

  renderSimpleForm() {
    const {
      form,
      ConservePoint: {
        data: { list },
      },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={16}>
          <Col md={5} sm={24}>
            <div className={publicCss.inputMain}>
              <span
                style={{ width: '80px', lineHeight: '30px', height: '32px' }}
                className="ant-input-group-addon"
              >
                点位名称
              </span>
              <FormItem style={{ flex: 1 }}>
                {form.getFieldDecorator('ponitCode')(
                  <Select
                    style={{ width: '100%' }}
                    placeholder="请选择"
                    onChange={this.pointChange}
                  >
                    {list.map(item => (
                      <Option key={item.id_} value={`${item.pointCode}-${item.type}`}>
                        {item.pointName}
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
                点位类型
              </span>
              <FormItem style={{ flex: 1 }}>
                {form.getFieldDecorator('type', {
                  initialValue: 1,
                })(
                  <Select style={{ width: '100%' }} placeholder="请选择">
                    {typeMap.map(item => (
                      <Option value={item.type} key={item.type}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>,
                )}
              </FormItem>
            </div>
          </Col>
          <Col md={6} sm={24}>
            <div className={publicCss.inputMain}>
              <span
                style={{ width: '80px', lineHeight: '30px', height: '32px' }}
                className="ant-input-group-addon"
              >
                时间
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
            {/* <div className={publicCss.inputMain}>
              <span
                style={{ width: '80px', lineHeight: '30px', height: '32px' }}
                className="ant-input-group-addon"
              >
                时间
              </span>
              <MyDatePicker value={pickerValue} getValue={val => this.setPickerValue(val)} />
            </div> */}
          </Col>
          <Col md={5} sm={24}>
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
      ConservePoint: { waterListData },
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
