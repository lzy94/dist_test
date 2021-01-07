import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button, Tooltip, Modal,
} from 'antd';
import { planRank, getPlanObject } from '@/utils/dictionaries';
import StandardTable from '@/components/StandardTable';

import styles from '../../style/style.less';
import publicCss from '@/pages/style/public.less';
import themeStyle from '@/pages/style/theme.less';

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
    formValues: [],
    defaultQuery: {},
    pageBean: { 'page': 1, 'pageSize': 10, 'showTotal': true },
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
      title: '负责人',
      dataIndex: 'charger',
    },
    // {
    //   title: '对象',
    //   dataIndex: 'planObject',
    //   render: val => planObject[1][planObject[0].indexOf(parseInt(val, 10))],
    // },
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
      width: 80,
      render: (text, record) => (
        <Fragment>
          <Tooltip placement="left" title="选择">
            <Button type="primary" shape="circle" icon="check" size="small" onClick={() => this.selectData(record)} />
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

  selectData = record => {
    const { selectData, handleModalVisible } = this.props;
    selectData(record);
    handleModalVisible();
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
        </Row>
      </Form>
    );
  }


  render() {
    const {
      Planmanagement: { dataList },
      loading,
      modalVisible,
      handleModalVisible,
    } = this.props;
    return (
      <Modal
        destroyOnClose
        title="选择预案"
        className={themeStyle.formModal}
        visible={modalVisible}
        width={1100}
        footer={null}
        onCancel={() => handleModalVisible()}
      >
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
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
      </Modal>
    );
  }
}

export default TableList;
