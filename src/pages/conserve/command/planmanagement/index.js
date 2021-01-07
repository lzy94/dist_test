import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  message,
  Divider, Tooltip, Popconfirm,
} from 'antd';
import { planRank, getPlanObject } from '@/utils/dictionaries';
import StandardTable from '@/components/StandardTable';
import CreateModal from './component/CreateModal';
import UpdateModal from './component/UpdateModal';

import styles from '../../../style/style.less';
import publicCss from '@/pages/style/public.less';

const FormItem = Form.Item;
const { Option } = Select;
let planObject = [[], []];

/* eslint react/no-multi-comp:0 */
@connect(({ ListPlanCategory, Planmanagement, loading }) => ({
  ListPlanCategory,
  Planmanagement,
  loading: loading.models.Planmanagement,
}))


@Form.create()
class TableList extends PureComponent {

  // eslint-disable-next-line react/sort-comp
  constructor(props) {
    super(props);
    planObject = getPlanObject();
  }

  state = {
    modalVisible: false,
    updateModalVisible: false,
    formValues: [],
    detail: {},
    pageBean: { 'page': 1, 'pageSize': 10, 'showTotal': true },
    defaultQuery: {},
  };

  columns = [
    {
      title: '预案名称',
      dataIndex: 'planName',
    },
    {
      title: '预案编号',
      dataIndex: 'planCode',
    },
    {
      title: '对象',
      dataIndex: 'planObject',
      render: val => planObject[1][planObject[0].indexOf(parseInt(val, 10))],
    },
    {
      title: '类型',
      dataIndex: 'categoryName',
    },
    {
      title: '等级',
      dataIndex: 'planRank',
      render: val => planRank[val - 1],
    },
    {
      title: '处理方式',
      dataIndex: 'dealType',
      width: 250,
      render: val => val.length > 15 ? <Tooltip title={val}>{`${val.substr(0, 13)}...`}</Tooltip> : val,
    },
    {
      title: '操作',
      width: 100,
      render: (text, record) => (
        <Fragment>
          <Tooltip placement="left" title='编辑'>
            <Button
              onClick={() => this.editData(record)}
              type="primary"
              shape="circle"
              icon='edit'
              size="small"
            />
          </Tooltip>
          <Divider type="vertical" />
          <Popconfirm
            title="是否删除数据?"
            onConfirm={() => this.dataDel(record.id_)}
            okText="确定"
            cancelText="取消"
          >
            <Tooltip placement="left" title="删除">
              <Button type="danger" shape="circle" icon="delete" size="small" />
            </Tooltip>
          </Popconfirm>
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

  editData = detail => {
    this.setState({ detail }, () => this.handleUpdateModalVisible(true));

  };

  dataDel = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Planmanagement/remove',
      payload: { id },
      callback: () => {
        message.success('删除成功');
        this.getList({ pageBean: this.state.pageBean });
      },
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
      type: 'Planmanagement/fetch',
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
    const { pageBean, defaultQuery } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const arr = [{
        property: 'planName',
        value: fieldsValue.planName,
        group: 'main',
        operation: 'LIKE',
        relation: 'AND',
      }, {
        property: 'planCode',
        value: fieldsValue.planCode,
        group: 'main',
        operation: 'LIKE',
        relation: 'AND',
      }, {
        property: 'categoryId',
        value: fieldsValue.categoryId,
        group: 'main',
        operation: 'EQUAL',
        relation: 'AND',
      }, {
        property: 'planObject',
        value: fieldsValue.planObject,
        group: 'main',
        operation: 'EQUAL',
        relation: 'AND',
      }].filter(item => item.value);


      this.getList({ pageBean, querys: [defaultQuery, ...arr] });
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

  modalSuccess = () => {
    const { pageBean, defaultQuery } = this.state;
    this.getList({ pageBean, querys: [defaultQuery] });
  };

  renderSimpleForm() {
    const {
      ListPlanCategory: { data },
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 16, xl: 16 }}>
          <Col md={6} sm={24}>
            <FormItem>
              {getFieldDecorator('planName')(<Input addonBefore='预案名称' placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem>
              {getFieldDecorator('planCode')(<Input addonBefore='预案编号' placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <div className={publicCss.inputMain}>
              <span style={{ width: '80px', lineHeight: '30px', height: '32px' }}
                className="ant-input-group-addon">类型</span>
              <FormItem style={{ flex: 1 }}>
                {getFieldDecorator('categoryId')(
                  <Select placeholder='请选择' style={{ width: '100%' }}>
                    {
                      data.list.map((item, index) => <Option key={index}
                        value={item.id_}>{item.categoryName}</Option>)
                    }
                  </Select>,
                )}
              </FormItem>
            </div>
          </Col>
          <Col md={6} sm={24}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
          </Col>
          {/* <Col md={6} sm={24}>
            <div className={publicCss.inputMain}>
              <span style={{ width: '80px', lineHeight: '30px', height: '32px' }}
                    className="ant-input-group-addon">对象</span>
              <FormItem style={{ flex: 1 }}>
                {getFieldDecorator('planObject')(
                  <Select style={{ width: '100%' }} placeholder='请选择'>
                    {
                      planObject[1].map((item, index) => <Option key={index}
                                                                 value={planObject[0][index]}>{item}</Option>)
                    }
                  </Select>,
                )}
              </FormItem>
            </div>
          </Col> */}

        </Row>
        {/* <div style={{ overflow: 'hidden' }}>
          <div style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
          </div>
        </div> */}
      </Form>
    );
  }


  render() {
    const {
      ListPlanCategory: { data },
      Planmanagement: { dataList },
      loading,
    } = this.props;
    const { modalVisible, updateModalVisible, detail } = this.state;

    const parentMethods = {
      cateList: data,
      modalSuccess: this.modalSuccess,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      detail,
      cateList: data,
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
              rowKey='id_'
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
        {
          updateModalVisible && Object.keys(detail).length ?
            <UpdateModal {...updateMethods} modalVisible={updateModalVisible} /> : null
        }

      </Fragment>
    );
  }
}

export default TableList;
