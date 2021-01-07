import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Form, Input, Select, Button, Tooltip, Tag, DatePicker, TreeSelect } from 'antd';
import StandardTable from '@/components/StandardTable';
// import MyDatePicker from '@/components/MyDatePicker';
import { getLocalStorage } from '@/utils/utils';
import DetailModal from './modal';
import styles from '@/pages/style/style.less';
import publicCss from '@/pages/style/public.less';

const FormItem = Form.Item;
const { Option } = Select;

/* eslint react/no-multi-comp:0 */
@connect(({ LawmentStatic, loading, system, Site }) => ({
  Site,
  system,
  LawmentStatic,
  loading: loading.models.LawmentStatic,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    formValues: [],
    siteList: [],
    detailID: '',
    pageBean: {
      page: 1,
      pageSize: 10,
      showTotal: true,
    },
    baseQuery: [
      {
        property: 'overLoad',
        value: 0,
        group: 'main',
        operation: 'GREAT',
        relation: 'AND',
      },
      {
        property: 'isCheck',
        value: 1,
        group: 'main',
        operation: 'EQUAL',
        relation: 'AND',
      },
    ],
  };

  columns = [
    {
      title: '监测站',
      dataIndex: 'siteName',
    },
    {
      title: '车牌号',
      dataIndex: 'carNo',
    },
    {
      title: '检测时间',
      dataIndex: 'previewTime',
      render: val => moment(val).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '轴数',
      dataIndex: 'axleNumber',
    },
    {
      title: '总重(t)',
      dataIndex: 'totalLoad',
      render: val => (val / 1000).toFixed(2),
    },
    {
      title: '限重(t)',
      dataIndex: 'weightLimited',
      render: val => <Tag color="#87d068">{(val / 1000).toFixed(2)} </Tag>,
    },
    {
      title: '超重(t)',
      dataIndex: 'overLoad',
      // render: val => (val / 1000).toFixed(2)
      render: val =>
        val > 0 ? <Tag color="#f5222d">{(val / 1000).toFixed(2)}</Tag> : (val / 1000).toFixed(2),
    },
    {
      title: '超重比(%)',
      dataIndex: 'overLoadRate',
      render: val => (val * 1).toFixed(2),
    },
    {
      title: '操作',
      width: 70,
      render: (text, record) => (
        <Fragment>
          <Tooltip placement="left" title="复审">
            <Button
              onClick={() => this.showDetailModal(record.id)}
              type="primary"
              shape="circle"
              icon="file-sync"
              size="small"
            />
          </Tooltip>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { siteList } = this.props;
    const { pageBean, baseQuery } = this.state;
    const siteIN = [
      {
        property: 'siteCode',
        value: siteList.map(item => item.code),
        group: 'main',
        operation: 'IN',
        relation: 'AND',
      },
    ];
    this.getList({ pageBean, querys: baseQuery.concat(siteIN) });
    this.setState({ siteList });
  }

  showDetailModal = id => {
    this.setState({ detailID: id });
    this.handleModalVisible(true);
  };

  modalSuccess = () => {
    const { pageBean, baseQuery, formValues } = this.state;
    this.getList({
      pageBean,
      querys: baseQuery.concat(formValues.length ? formValues : this.getSiteIN()),
    });
  };

  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'LawmentStatic/fetch',
      payload:  {
        ...params,
        sorter: [
          {
            direction: 'DESC',
            property: 'previewTime',
          },
        ],
      },
    });
  };

  getSiteIN = () => {
    const { siteList } = this.state;
    return [
      {
        property: 'siteCode',
        value: siteList.map(item => item.code),
        group: 'main',
        operation: 'IN',
        relation: 'AND',
      },
    ];
  };

  treeSelectChange = (value, label) => {
    const { form } = this.props;
    form.setFieldsValue({ siteCode: '' });
    this.getSite(value);
    this.setState({ organCode: value });
  };

  getSite = (value, callback) => {
    const { dispatch, siteList } = this.props;
    dispatch({
      type: 'Site/siteByUserSite',
      payload: {
        organId: value,
        siteIds: siteList.map(item => item.code),
      },
      callback: res => {
        const newSiteList = res.map(item => {
          if (item.siteType === '2') {
            return {
              code: item.siteCode,
              name: item.siteName,
            };
          }
          return '';
        });
        this.setState({ siteList: newSiteList });
        callback && callback(newSiteList);
      },
    });
  };

  handleStandardTableChange = pagination => {
    const { formValues, baseQuery } = this.state;

    const params = {
      pageBean: {
        page: pagination.current,
        pageSize: pagination.pageSize,
        showTotal: true,
      },
      querys: baseQuery.concat(formValues.length ? formValues : this.getSiteIN()),
    };
    this.getList(params);
  };

  handleFormReset = () => {
    const { form, siteList } = this.props;
    const { pageBean, baseQuery } = this.state;
    form.resetFields();
    this.setState(
      {
        formValues: [],
        siteList,
      },
      () => {
        this.getList({ pageBean, querys: baseQuery.concat(this.getSiteIN()) });
      },
    );
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { pageBean, baseQuery } = this.state;

      const arr = [
        fieldsValue.siteCode
          ? {
              property: 'siteCode',
              value: fieldsValue.siteCode || '',
              group: 'main',
              operation: 'EQUAL',
              relation: 'AND',
            }
          : this.getSiteIN()[0].value.length
          ? this.getSiteIN()[0]
          : {},
        {
          property: 'overLoadRate',
          value:
            fieldsValue.overLoadRateStart && fieldsValue.overLoadRateEnd
              ? [fieldsValue.overLoadRateStart, fieldsValue.overLoadRateEnd]
              : '',
          group: 'main',
          operation: 'BETWEEN',
          relation: 'AND',
        },
        {
          property: 'axleNumber',
          value: fieldsValue.axleNumber === 'other' ? 6 : fieldsValue.axleNumber || '',
          group: 'main',
          operation: fieldsValue.axleNumber === 'other' ? 'GREAT' : 'EQUAL',
          relation: 'AND',
        },
        {
          property: 'previewTime',
          // value: pickerValue[0] && pickerValue[1] ? pickerValue : '',
          value: fieldsValue.previewTime
            ? [
                moment(fieldsValue.previewTime[0]).format('YYYY-MM-DD HH:mm:ss'),
                moment(fieldsValue.previewTime[1]).format('YYYY-MM-DD HH:mm:ss'),
              ]
            : '',
          group: 'main',
          operation: 'BETWEEN',
          relation: 'AND',
        },
        {
          property: 'totalLoad',
          value:
            fieldsValue.totalLoadStart && fieldsValue.totalLoadEnd
              ? [fieldsValue.totalLoadStart * 1000, fieldsValue.totalLoadEnd * 1000]
              : '',
          group: 'main',
          operation: 'BETWEEN',
          relation: 'AND',
        },
        {
          property: 'carNo',
          value: fieldsValue.carNo || '',
          group: 'main',
          operation: 'LIKE',
          relation: 'AND',
        },
      ].filter(item => item.value);

      this.setState({
        formValues: arr,
      });

      this.getList({
        pageBean,
        querys: baseQuery.concat(arr),
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
    if (!flag) {
      this.setState({ detailID: '' });
    }
  };

  renderSimpleForm() {
    const {
      system: { treeList },
      form: { getFieldDecorator },
    } = this.props;
    const { siteList } = this.state;
    const organId = getLocalStorage('organId').toString();
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={16}>
          <Col md={5} sm={24}>
            <div className={publicCss.inputMain}>
              <span
                style={{ width: '80px', lineHeight: '30px', height: '32px' }}
                className="ant-input-group-addon"
              >
                所属机构
              </span>
              <FormItem style={{ flex: 1 }}>
                {getFieldDecorator('name')(
                  <TreeSelect
                    className={publicCss.inputGroupLeftRadius}
                    treeData={treeList}
                    treeDefaultExpandedKeys={[organId]}
                    style={{ width: '100%' }}
                    placeholder="请选择"
                    onChange={this.treeSelectChange}
                  />,
                )}
              </FormItem>
            </div>
          </Col>
          <Col md={4} sm={24}>
            <div className={publicCss.inputMain}>
              <span
                style={{ width: '65px', lineHeight: '30px', height: '32px' }}
                className="ant-input-group-addon"
              >
                检测点
              </span>
              <FormItem style={{ flex: 1 }}>
                {getFieldDecorator('siteCode')(
                  <Select
                    dropdownMatchSelectWidth={false}
                    className={publicCss.inputGroupLeftRadius}
                    placeholder="请选择"
                  >
                    {siteList.map(item => (
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
            <Input.Group compact>
              <FormItem style={{ display: 'inline-block', width: '60%' }}>
                {getFieldDecorator('overLoadRateStart')(
                  <Input
                    className={`${publicCss.inputGroupRightRadius} ${publicCss.inputGroupRightborder}`}
                    addonBefore="超限幅度(%)"
                    placeholder="请输入"
                    style={{ width: '100%', borderRight: 0 }}
                  />,
                )}
              </FormItem>
              <FormItem style={{ display: 'inline-block', width: '40%' }}>
                {getFieldDecorator('overLoadRateEnd')(
                  <Input
                    className={publicCss.inputGroupRadiusAddon}
                    addonBefore="至"
                    placeholder="请输入"
                    style={{ width: '100%' }}
                  />,
                )}
              </FormItem>
            </Input.Group>
          </Col>
          <Col md={4} sm={24}>
            <div className={publicCss.inputMain}>
              <span
                style={{ width: '60px', lineHeight: '30px', height: '32px' }}
                className="ant-input-group-addon"
              >
                轴数
              </span>
              <FormItem style={{ flex: 1 }}>
                {getFieldDecorator('axleNumber')(
                  <Select className={publicCss.inputGroupLeftRadius} placeholder="请选择">
                    <Option value="">全部轴数</Option>
                    <Option value={2}>2</Option>
                    <Option value={3}>3</Option>
                    <Option value={4}>4</Option>
                    <Option value={5}>5</Option>
                    <Option value={6}>6</Option>
                    <Option value="other">其他</Option>
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
                检测时间
              </span>
              <FormItem style={{ flex: 1 }}>
                {getFieldDecorator('previewTime')(
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
                检测时间
              </span>
              <MyDatePicker value={pickerValue} getValue={val => this.setPickerValue(val)} />
            </div> */}
          </Col>
        </Row>
        <Row gutter={16}>
          <Col md={5} sm={24}>
            <Input.Group compact>
              <FormItem style={{ display: 'inline-block', width: '50%' }}>
                {getFieldDecorator('totalLoadStart')(
                  <Input
                    className={`${publicCss.inputGroupRightRadius} ${publicCss.inputGroupRightborder}`}
                    addonBefore="总重(t)"
                    placeholder="请输入"
                    style={{ width: '100%', borderRight: 0 }}
                  />,
                )}
              </FormItem>
              <FormItem style={{ display: 'inline-block', width: '50%' }}>
                {getFieldDecorator('totalLoadEnd')(
                  <Input
                    className={publicCss.inputGroupRadiusAddon}
                    addonBefore="至"
                    placeholder="请输入"
                    style={{ width: '100%' }}
                  />,
                )}
              </FormItem>
            </Input.Group>
          </Col>
          <Col md={4} sm={24}>
            <FormItem>
              {getFieldDecorator('carNo')(<Input addonBefore="车牌号" placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={15} sm={24}>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ float: 'right', marginBottom: 24 }}>
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
  }

  render() {
    const {
      LawmentStatic: { data },
      loading,
    } = this.props;
    const { modalVisible, detailID } = this.state;

    const parentMethods = {
      handleModalVisible: this.handleModalVisible,
      detailID: detailID,
      modalSuccess: this.modalSuccess,
    };

    return (
      <Fragment>
        <div className={styles.tableList}>
          <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
          <StandardTable
            tableAlert={false}
            selectedRows={0}
            rowSelection={null}
            loading={loading}
            data={data}
            size="middle"
            columns={this.columns}
            onChange={this.handleStandardTableChange}
          />
        </div>
        {modalVisible && detailID ? (
          <DetailModal {...parentMethods} modalVisible={modalVisible} />
        ) : null}
      </Fragment>
    );
  }
}

export default TableList;
