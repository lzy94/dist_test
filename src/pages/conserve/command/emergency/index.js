import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Select, Button, Tooltip } from 'antd';
import { planRank, getPlanObject } from '@/utils/dictionaries';
import StandardTable from '@/components/StandardTable';

import DetailModal from './component/DetailModal';
import CreateModal from './component/CreateModal';
import UpdateModal from './component/UpdateModal';
import styles from '../../../style/style.less';
import publicCss from '@/pages/style/public.less';

const FormItem = Form.Item;
const { Option } = Select;

const statusMap = ['新建', '已派', '处理中', '已完成'];

let planObject = [[], []];

/* eslint react/no-multi-comp:0 */
@connect(({ ListPlanCategory, Emergency, loading }) => ({
  Emergency,
  ListPlanCategory,
  loading: loading.models.Emergency,
}))
@Form.create()
class TableList extends PureComponent {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
    planObject = getPlanObject();
  }

  state = {
    modalVisible: false,
    updateModalVisible: false,
    detailModalVisible: false,
    formValues: [],
    detail: {},
    pageBean: { page: 1, pageSize: 10, showTotal: true },
    defaultQuery: {},
  };

  columns = [
    {
      title: '对象',
      dataIndex: 'planObject',
      render: val => planObject[1][planObject[0].indexOf(val)],
    },
    {
      title: '类型',
      dataIndex: 'categoryName',
    },
    {
      title: '等级',
      dataIndex: 'emergencyLevel',
      render: val => planRank[val - 1],
    },
    {
      title: '上报时间',
      dataIndex: 'createdTime',
      width: 170,
      render: val => moment(val).format('YYYY-MM-DD HH:mm:ss'),
    },
    // {
    //   title: '下达时间',
    //   dataIndex: 'sendTime',
    //   render: val => moment(val).format('YYYY-MM-DD HH:mm:ss'),
    // },
    {
      title: '状态',
      dataIndex: 'state',
      render: val => statusMap[val - 1],
    },
    {
      title: '操作',
      width: 80,
      render: (text, record) => (
        <Fragment>
          {record.state === 1 ? (
            <Tooltip placement="left" title="下发">
              <Button
                onClick={() => this.editData(record.id_)}
                type="primary"
                shape="circle"
                icon="edit"
                size="small"
              />
            </Tooltip>
          ) : null}
          {record.state !== 1 ? (
            <Tooltip placement="left" title="详情">
              <Button
                onClick={() => this.detailData(record.id_)}
                type="primary"
                shape="circle"
                icon="eye"
                size="small"
              />
            </Tooltip>
          ) : null}
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const defaultQuery = {
      property: 'planObject',
      value: planObject[0],
      group: 'main',
      operation: 'IN',
      relation: 'AND',
    };

    this.getList({ pageBean: this.state.pageBean, querys: [defaultQuery] });
    this.setState({ defaultQuery });
    this.getCate();
  }

  editData = id => {
    this.getDetail(id, () => this.handleUpdateModalVisible(true));
  };

  detailData = id => {
    this.getDetail(id, () => this.handleDetailModalVisible(true));
  };

  getDetail = (id, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Emergency/detail',
      payload: { id },
      callback: detail => this.setState({ detail }, () => callback()),
    });
  };

  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Emergency/fetch',
      payload: params,
    });
  };

  getCate = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ListPlanCategory/fetch',
      payload: {
        planObject: planObject[0].join(),
      },
    });
  };

  handleStandardTableChange = pagination => {
    const { formValues, defaultQuery } = this.state;
    const params = {
      pageBean: {
        page: pagination.current,
        pageSize: pagination.pageSize,
        showTotal: true,
      },
      querys: [defaultQuery, ...formValues],
    };
    this.getList(params);
  };

  handleFormReset = () => {
    const { form } = this.props;
    const { defaultQuery, pageBean } = this.state;
    form.resetFields();
    this.setState({
      formValues: [],
    });
    this.getList({ pageBean, querys: [defaultQuery] });
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { pageBean, defaultQuery } = this.state;
      const values = {
        ...fieldsValue,
      };
      const objKeys = Object.keys(values);
      const condition = objKeys.map(item => {
        return values[item]
          ? {
              property: item,
              value: values[item],
              group: 'main',
              operation: 'EQUAL',
              relation: 'AND',
            }
          : '';
      });
      const conditionFilter = condition.filter(item => item);

      this.setState({
        formValues: conditionFilter,
      });

      this.getList({ pageBean, querys: [defaultQuery, ...conditionFilter] });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = flag => {
    this.setState({
      updateModalVisible: !!flag,
    });
  };

  handleDetailModalVisible = flag => {
    this.setState({
      detailModalVisible: !!flag,
    });
  };

  modalSuccess = () => {
    const { pageBean, defaultQuery } = this.state;
    this.getList({ pageBean, querys: [defaultQuery] });
    this.setState({ detail: {} });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      ListPlanCategory: { data },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 16, xl: 32 }}>
          <Col md={6} sm={24}>
            <div className={publicCss.inputMain}>
              <span
                style={{ width: '80px', lineHeight: '30px', height: '32px' }}
                className="ant-input-group-addon"
              >
                类型
              </span>
              <FormItem style={{ flex: 1 }}>
                {getFieldDecorator('categoryId')(
                  <Select placeholder="请选择" style={{ width: '100%' }}>
                    {data.list.map((item, index) => (
                      <Option key={index} value={item.id_}>
                        {item.categoryName}
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
                状态
              </span>
              <FormItem style={{ flex: 1 }}>
                {getFieldDecorator('state')(
                  <Select placeholder="请选择" style={{ width: '100%' }}>
                    {statusMap.map((item, index) => (
                      <Option key={index} value={index + 1}>
                        {item}
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
                等级
              </span>
              <FormItem style={{ flex: 1 }}>
                {getFieldDecorator('emergencyLevel')(
                  <Select placeholder="请选择" style={{ width: '100%' }}>
                    {planRank.map((item, index) => (
                      <Option key={index} value={index + 1}>
                        {item}
                      </Option>
                    ))}
                  </Select>,
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
      Emergency: { dataList },
      ListPlanCategory: { data },
      loading,
    } = this.props;
    const { modalVisible, updateModalVisible, detail, detailModalVisible } = this.state;

    const parentMethods = {
      cateList: data,
      modalSuccess: this.modalSuccess,
      handleModalVisible: this.handleModalVisible,
    };

    const updateMethods = {
      cateList: data,
      detail,
      modalSuccess: this.modalSuccess,
      handleModalVisible: this.handleUpdateModalVisible,
    };

    const detailMethods = {
      detail,
      modalSuccess: this.modalSuccess,
      handleModalVisible: this.handleDetailModalVisible,
    };

    return (
      <Fragment>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
            </div>
            <StandardTable
              rowKey="id_"
              size="middle"
              tableAlert={false}
              selectedRows={0}
              rowSelection={null}
              loading={loading}
              data={dataList}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        {modalVisible ? <CreateModal {...parentMethods} modalVisible={modalVisible} /> : null}
        {detailModalVisible && Object.keys(detail).length ? (
          <DetailModal {...detailMethods} modalVisible={detailModalVisible} />
        ) : null}
        {updateModalVisible && Object.keys(detail).length ? (
          <UpdateModal {...updateMethods} modalVisible={updateModalVisible} />
        ) : null}
      </Fragment>
    );
  }
}

export default TableList;
