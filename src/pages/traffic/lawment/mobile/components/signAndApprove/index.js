import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Redirect } from 'umi';
import moment from 'moment';
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  Button,
  Tooltip,
  Tag,
  TreeSelect,
  DatePicker,
  message,
} from 'antd';

import StandardTable from '@/components/StandardTable';
// import MyDatePicker from '@/components/MyDatePicker';
import DetailModal from './modal';

import { checkAuth, isNumbre } from '@/utils/utils';
import styles from '../../../../../style/style.less';
import publicCss from '@/pages/style/public.less';

const FormItem = Form.Item;
const { Option } = Select;
const authority = ['/lawment/mobile'];

/* eslint react/no-multi-comp:0 */
@connect(({ Mobile, loading, system }) => ({
  system,
  Mobile,
  loading: loading.models.Mobile,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    formValues: [],
    detailID: '',
    pageBean: {
      page: 1,
      pageSize: 10,
      showTotal: true,
    },
    defaultOrganCode: {},
    baseQuery: [
      {
        group: 'main',
        operation: 'EQUAL',
        property: 'isCheck',
        relation: 'AND',
        value: 2,
      },
    ],
  };

  columns = [
    {
      title: '车牌号',
      dataIndex: 'carNo',
    },
    {
      title: '执法人员',
      dataIndex: 'undertaker',
    },
    {
      title: '执法时间',
      width: 170,
      dataIndex: 'lawTime',
    },
    {
      title: '执法地址',
      dataIndex: 'address',
    },
    {
      title: '轴数',
      dataIndex: 'axleNumber',
    },
    {
      title: '限重(t)',
      dataIndex: 'weightLimited',
      render: val => <Tag color="#87d068">{(val / 1000).toFixed(2)} </Tag>,
    },
    {
      title: '总重(t)',
      dataIndex: 'totalLoad',
      render: val => val / 1000,
    },
    {
      title: '超重(t)',
      dataIndex: 'overLoad',
      render: val =>
        val > 0 ? <Tag color="#f5222d">{(val / 1000).toFixed(2)}</Tag> : (val / 1000).toFixed(2),
    },
    {
      title: '操作',
      width: 70,
      render: (text, record) => (
        <Fragment>
          <Tooltip placement="left" title="详情">
            <Button
              onClick={() => this.showDetailModal(record.id)}
              type="primary"
              shape="circle"
              icon="eye"
              size="small"
            />
          </Tooltip>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    if (!checkAuth(authority[0])) return;
    const { pageBean, baseQuery } = this.state;
    const { organId } = this.props;
    const defaultOrganCode = {
      property: 'organCode',
      value: organId,
      group: 'main',
      operation: 'RIGHT_LIKE',
      relation: 'AND',
    };
    this.getList({ pageBean, querys: [...baseQuery, defaultOrganCode] });
    this.setState({ defaultOrganCode });
  }

  showDetailModal = id => {
    this.setState({ detailID: id });
    this.handleModalVisible(true);
  };

  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Mobile/fetch',
      payload: params,
    });
  };

  handleStandardTableChange = pagination => {
    const { formValues, baseQuery, defaultOrganCode } = this.state;
    let arr = [...baseQuery];
    if (formValues.length) {
      arr = arr.concat(formValues);
    } else {
      arr = [...arr, defaultOrganCode];
    }
    const params = {
      pageBean: {
        page: pagination.current,
        pageSize: pagination.pageSize,
        showTotal: true,
      },
      querys: arr,
    };
    this.getList(params);
  };

  handleFormReset = () => {
    const { form } = this.props;
    const { pageBean, baseQuery, defaultOrganCode } = this.state;
    form.resetFields();
    this.setState({
      formValues: [],
    });
    this.getList({ pageBean, querys: [...baseQuery, defaultOrganCode] });
  };

  handleSearch = e => {
    e.preventDefault();

    const { form, organId } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { pageBean, baseQuery } = this.state;

      const { totalLoadStart, totalLoadEnd } = fieldsValue;

      if (totalLoadStart || totalLoadEnd) {
        if (!isNumbre(totalLoadStart) || !isNumbre(totalLoadEnd)) {
          message.error('总重请输入数字');
          return;
        }
      }

      const formValues = [
        {
          property: 'organCode',
          value: fieldsValue.organId || organId,
          group: 'main',
          operation: 'RIGHT_LIKE',
          relation: 'AND',
        },
        {
          property: 'carNo',
          value: fieldsValue.carNo,
          group: 'main',
          operation: 'LIKE',
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
          property: 'lawTime',
          // value: pickerValue[0] && pickerValue[1] ? pickerValue : '',
          value: fieldsValue.lawTime
            ? [
                moment(fieldsValue.lawTime[0]).format('YYYY-MM-DD HH:mm:ss'),
                moment(fieldsValue.lawTime[1]).format('YYYY-MM-DD HH:mm:ss'),
              ]
            : '',
          group: 'main',
          operation: 'BETWEEN',
          relation: 'AND',
        },
        {
          property: 'totalLoad',
          value: totalLoadStart && totalLoadEnd ? [totalLoadStart * 1000, totalLoadEnd * 1000] : '',
          group: 'main',
          operation: 'BETWEEN',
          relation: 'AND',
        },
      ].filter(item => item.value);

      this.setState({
        formValues,
      });
      this.getList({ pageBean, querys: baseQuery.concat(formValues) });
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

  modalSuccess = () => {
    const { pageBean, baseQuery, defaultOrganCode } = this.state;
    this.getList({ pageBean, querys: [...baseQuery, defaultOrganCode] });
  };

  renderSimpleForm() {
    const {
      system: { treeList },
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 16, xl: 16 }}>
          <Col md={4} sm={24}>
            <div className={publicCss.inputMain}>
              <span
                style={{ width: '80px', lineHeight: '30px', height: '32px' }}
                className="ant-input-group-addon"
              >
                所属机构
              </span>
              <FormItem style={{ flex: 1 }}>
                {getFieldDecorator('organId')(
                  <TreeSelect
                    className={publicCss.inputGroupLeftRadius}
                    treeData={treeList}
                    // treeDefaultExpandedKeys={[organId]}
                    style={{ width: '100%' }}
                    placeholder="请选择"
                    // onChange={this.treeSelectChange}
                  />,
                )}
              </FormItem>
            </div>
          </Col>
          <Col md={4} sm={24}>
            <FormItem>
              {getFieldDecorator('carNo')(<Input addonBefore="车牌号" placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
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
          <Col md={5} sm={24}>
            <div className={publicCss.inputMain}>
              <span
                style={{ width: '80px', lineHeight: '30px', height: '32px' }}
                className="ant-input-group-addon"
              >
                执法时间
              </span>
              <FormItem style={{ flex: 1 }}>
                {getFieldDecorator('lawTime')(
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
                执法时间
              </span>
              <MyDatePicker value={pickerValue} getValue={val => this.setPickerValue(val)} />
            </div> */}
          </Col>
          <Col md={3} sm={24}>
            <span className={styles.submitButtons} style={{ float: 'right' }}>
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
      Mobile: { data },
      loading,
    } = this.props;
    const { modalVisible, detailID } = this.state;
    const parentMethods = {
      detailID: detailID,
      modalSuccess: this.modalSuccess,
      handleModalVisible: this.handleModalVisible,
    };
    return (
      <Fragment>
        {checkAuth(authority[0]) ? null : <Redirect to="/exception/403" />}
        <div className={styles.tableList}>
          <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
          <StandardTable
            size="middle"
            tableAlert={false}
            selectedRows={0}
            rowSelection={null}
            loading={loading}
            data={data}
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
