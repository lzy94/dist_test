import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  Modal,
  DatePicker,
  Radio, Tooltip,
  Descriptions,
} from 'antd';
import StandardTable from '@/components/StandardTable';

import styles from '../../../style/style.less';
import themeStyle from '@/pages/style/theme.less';
import publicCss from '@/pages/style/public.less';

const FormItem = Form.Item;
const { Option } = Select;

const DetailModal = Form.create()(props => {
  const { modalVisible, handleModalVisible, detail } = props;
  return (
    <Modal
      destroyOnClose
      title="详情"
      className={themeStyle.formModal}
      visible={modalVisible}
      onCancel={() => handleModalVisible()}
      footer={null}
    >
      <Card bordered={false}>
        <Descriptions size='small' bordered column={1}>
          <Descriptions.Item label="港口名称">{detail.portName}</Descriptions.Item>
          <Descriptions.Item label="负责人">{detail.changer}</Descriptions.Item>
          <Descriptions.Item label="注册时间">{moment(detail.registTime).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
          <Descriptions.Item label="地址">{detail.portAddr}</Descriptions.Item>
          <Descriptions.Item label="状态">{detail.state === 1 ? '营运中' : '停业中'}</Descriptions.Item>
        </Descriptions>
      </Card>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ MaritimePort, loading }) => ({
  MaritimePort,
  loading: loading.models.MaritimePort,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    formValues: [],
    detail: {},
    departmentUserList: [],
    pageBean: { 'page': 1, 'pageSize': 10, 'showTotal': true },
  };

  columns = [
    {
      title: '港口名称',
      dataIndex: 'portName',
    },
    {
      title: '负责人',
      dataIndex: 'changer',
    },
    {
      title: '注册时间',
      dataIndex: 'registTime',
      width: 120,
      render: val => moment(val).format('YYYY-MM-DD'),
    },
    {
      title: '地址',
      dataIndex: 'portAddr',
    },
    {
      title: '状态',
      dataIndex: 'state',
      width: 80,
      render: val => val === 1 ? '营运中' : '停业中',
    },
    {
      title: '操作',
      width: 80,
      render: (text, record) => (
        <Fragment>
          <Tooltip placement="left" title='详情'>
            <Button
              onClick={() => this.getDetail(record)}
              type="primary"
              shape="circle"
              icon='eye'
              size="small"
            />
          </Tooltip>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { pageBean } = this.state;
    this.getList({ pageBean });
    this.getDepartmentUser();
  }


  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'MaritimePort/fetch',
      payload: params,
    });
  };

  getDepartmentUser = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'system/departmentUser',
      payload: { menuType: -3 },
      callback: data => {
        this.setState({ departmentUserList: data });
      },
    });
  };

  getDetail = detail => {
    this.setState({
      detail,
    }, () => this.handleModalVisible(true));
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
    form.resetFields();
    this.setState({
      formValues: [],
    });
    this.getList({ pageBean: this.state.pageBean });
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { pageBean } = this.state;
      const values = {
        portName: fieldsValue.name,
        state: fieldsValue.zt,
        changerId: fieldsValue.fzr,
      };
      const objKeys = Object.keys(values);
      const condition = objKeys.map(item => {
        return values[item]
          ? {
            property: item,
            value: values[item],
            group: 'main',
            operation: item === 'portName' ? 'LIKE' : 'EQUAL',
            relation: 'AND',
          }
          : '';
      });
      const conditionFilter = condition.filter(item => item);
      this.setState({
        formValues: conditionFilter,
      });
      this.getList({ pageBean, querys: conditionFilter });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
    if (!!!flag) {
      this.setState({ detail: {} });
    }
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { departmentUserList } = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 16, xl: 32 }}>
          <Col md={6} sm={24}>
            <FormItem>
              {getFieldDecorator('name')(<Input addonBefore="港口名称" placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <div className={publicCss.inputMain}>
              <span style={{ width: '80px', lineHeight: '30px', height: '32px' }}
                    className="ant-input-group-addon">负责人</span>
              <FormItem style={{ flex: 1 }}>
                {getFieldDecorator('fzr')(
                  <Select placeholder="请选择" style={{ width: '100%' }}>
                    {departmentUserList.map((item, i) => <Option key={i} value={item.id}>{item.fullname}</Option>)}
                  </Select>,
                )}
              </FormItem>
            </div>
          </Col>
          <Col md={6} sm={24}>
            <div className={publicCss.inputMain}>
              <span style={{ width: '80px', lineHeight: '30px', height: '32px' }}
                    className="ant-input-group-addon">状态</span>
              <FormItem style={{ flex: 1 }}>
                {getFieldDecorator('zt')(
                  <Select placeholder="请选择" style={{ width: '100%' }}>
                    <Option value={1}>营运中</Option>
                    <Option value={2}>停业中</Option>
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
      MaritimePort: { data },
      loading,
    } = this.props;
    const { modalVisible, detail } = this.state;

    const parentMethods = {
      detail,
      handleModalVisible: this.handleModalVisible,
    };
    return (
      <Fragment>
        <Card bordered={false}>
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
        </Card>
        {modalVisible && Object.keys(detail).length ?
          <DetailModal {...parentMethods} modalVisible={modalVisible}/>
          : null}
      </Fragment>
    );
  }
}

export default TableList;
