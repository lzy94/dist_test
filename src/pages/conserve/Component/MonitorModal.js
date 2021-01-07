import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  Modal,
  Switch, Tooltip,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import { getPlanObject } from '@/utils/dictionaries';

import themeStyle from '@/pages/style/theme.less';
import styles from '../../style/style.less';
import publicCss from '@/pages/style/public.less';

const FormItem = Form.Item;
const { Option } = Select;

const relayStatusMap = ['通电', '断电'];
// const ponitObjName = ['养护', '海事', '运政'];
let planObject = [[], []];

/* eslint react/no-multi-comp:0 */
@connect(({ ConserveMonitor, loading }) => ({
  ConserveMonitor,
  loading: loading.models.ConserveMonitor,
}))
@Form.create()
class TableList extends PureComponent {

  // eslint-disable-next-line react/sort-comp
  constructor(props) {
    super(props);
    planObject = this.getNewPlanObject();
  }

  state = {
    formValues: [],
    defaultQuery: {},
    pageBean: { 'page': 1, 'pageSize': 10, 'showTotal': true },
  };

  columns = [
    {
      title: '点位名称',
      dataIndex: 'pointName',
    },
    {
      title: '点位地址',
      dataIndex: 'addr',
    },
    {
      title: '继电器账号',
      dataIndex: 'relayAccount',
    },
    {
      title: '继电器密码',
      dataIndex: 'relayPwd',
    },
    {
      title: '继电器状态',
      dataIndex: 'relayStatus',
      render: val => relayStatusMap[val - 1],
    },
    {
      title: '继电器开关',
      width: 110,
      render: val => <Switch
        checkedChildren="开"
        unCheckedChildren="关"
        checked={val.relayStatus === 1}
        onClick={() => this.switchClick(val)}
      />,
    },
    {
      title: '操作',
      width: 90,
      render: (text, record) => (
        <Tooltip placement="left" title="选择">
          <Button type="primary" shape="circle" icon="check" size="small" onClick={() => this.selectData(record)} />
        </Tooltip>
      ),
    },
  ];

  componentDidMount() {
    const defaultQuery = {
      property: "ponitObj",
      value: planObject[0],
      group: "main",
      operation: "IN",
      relation: "AND"
    };
    this.getList({ pageBean: this.state.pageBean, querys: [defaultQuery] });
    this.setState({ defaultQuery })
  }


  selectData = record => {
    const { selectData, handleModalVisible } = this.props;
    selectData(record);
    handleModalVisible();
  };

  /**
   * @description 获取新对象
   * @returns {*[][]}
   */
  getNewPlanObject = () => {
    const planObjects = getPlanObject();
    const [planObject, planObjectNumber] = [planObjects[1], planObjects[0]];
    if (planObject.indexOf('路政') > -1) {
      planObject.splice(planObject.indexOf('路政'), 1);
    }
    if (planObjectNumber.indexOf(-1) > -1) {
      planObjectNumber.splice(planObjectNumber.indexOf(-1), 1)
    }
    return [planObjectNumber, planObject]
  }

  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ConserveMonitor/fetch',
      payload: params,
    });
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
      const arr = [
        {
          property: 'pointName',
          value: fieldsValue.name,
          group: 'main',
          operation: 'LIKE',
          relation: 'AND',
        },
        fieldsValue.dx ?
          {
            property: 'ponitObj',
            value: fieldsValue.dx,
            group: 'main',
            operation: 'EQUAL',
            relation: 'AND',
          } : defaultQuery,
      ].filter(item => item.value);
      this.setState({
        formValues: arr,
      });

      this.getList({
        pageBean,
        querys: arr,
      });

    });
  };


  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 16, xl: 16 }}>
          <Col md={6} sm={24}>
            <FormItem>
              {getFieldDecorator('name')(<Input addonBefore='名称' placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <div className={publicCss.inputMain}>
              <span style={{ width: '80px', lineHeight: '30px', height: '32px' }}
                className="ant-input-group-addon">对象</span>
              <FormItem style={{ flex: 1 }}>
                {getFieldDecorator('dx')(
                  <Select placeholder='请选择' style={{ width: '100%' }}>
                    {
                      planObject[1].map((item, i) => <Option key={i} value={planObject[0][i]} >{item}</Option>)
                    }
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
      ConserveMonitor: { data },
      loading,
      modalVisible,
      handleModalVisible,
    } = this.props;
    return (
      <Modal
        destroyOnClose
        title="监控点位"
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
              data={data}
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
