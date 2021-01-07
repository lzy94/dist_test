import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Select, Button, Tooltip } from 'antd';
import StandardTable from '@/components/StandardTable';
import CreateModal from './component/CreateModal';
import UpdateModal from './component/UpdateModal';
import { planRank, getPlanObject } from '@/utils/dictionaries';

import styles from '../../../style/style.less';
import publicCss from '@/pages/style/public.less';

const FormItem = Form.Item;
const { Option } = Select;
const statusMap = ['新建', '已派', '处理中', '已完成'];
let planObject = [[], []];

/* eslint react/no-multi-comp:0 */
@connect(({ ListPlanCategory, Manpower, loading }) => ({
  ListPlanCategory,
  Manpower,
  loading: loading.models.Manpower,
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
    formValues: [],
    detail: {},
    pageBean: { page: 1, pageSize: 10, showTotal: true },
    defaultQuery: {},
  };

  columns = [
    {
      title: '负责人',
      dataIndex: 'charger',
    },
    {
      title: '处理方式',
      dataIndex: 'dealType',
      width: 250,
      render: val =>
        val.length > 15 ? <Tooltip title={val}>{`${val.substr(0, 13)}...`}</Tooltip> : val,
    },
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
      title: '紧急程度',
      dataIndex: 'emergencyLevel',
      render: val => planRank[val - 1],
    },
    {
      title: '任务下达时间',
      dataIndex: 'sendTime',
      width: 170,
      render: val => val && moment(val).format('YYYY-MM-DD HH:mm:ss'),
    },
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
          <Tooltip placement="left" title="详情">
            <Button
              onClick={() => this.editData(record.id_)}
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
    const { dispatch } = this.props;
    dispatch({
      type: 'Manpower/detail',
      payload: { id },
      callback: detail => this.setState({ detail }, () => this.handleUpdateModalVisible(true)),
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

  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Manpower/fetch',
      payload: params,
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
    const { pageBean, defaultQuery } = this.state;
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
    if (!!!flag) {
      this.setState({ detail: {} });
    }
  };

  modalSuccess = () => {
    const { pageBean, defaultQuery } = this.state;
    this.getList({ pageBean, querys: [defaultQuery] });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      ListPlanCategory: { data },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 16, xl: 16 }}>
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
      ListPlanCategory: { data },
      Manpower: { dataList },
      loading,
    } = this.props;
    const { modalVisible, updateModalVisible, detail } = this.state;

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
        <CreateModal {...parentMethods} modalVisible={modalVisible} />
        {updateModalVisible && Object.keys(detail).length ? (
          <UpdateModal {...updateMethods} modalVisible={updateModalVisible} />
        ) : null}
      </Fragment>
    );
  }
}
export default TableList;
