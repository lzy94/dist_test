import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Modal,
  Descriptions, Tooltip, Select,
} from 'antd';
import StandardTable from '@/components/StandardTable';

import styles from '../../../style/style.less';
import themeStyle from '@/pages/style/theme.less';
import publicCss from '@/pages/style/public.less';

const FormItem = Form.Item;
const Option = Select.Option;

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
        <Descriptions column={1} size='small' bordered>
          <Descriptions.Item label="姓名">{detail.name}</Descriptions.Item>
          <Descriptions.Item label="性别">{detail.sex === 1 ? '男' : '女'}</Descriptions.Item>
          <Descriptions.Item label="身份证号码">{detail.idcard}</Descriptions.Item>
          <Descriptions.Item label="职位">{detail.post}</Descriptions.Item>
          <Descriptions.Item label="所属单位">{detail.companyName}</Descriptions.Item>
          <Descriptions.Item label="资格证编号">{detail.certificateNo}</Descriptions.Item>
        </Descriptions>
      </Card>
    </Modal>
  );
});


/* eslint react/no-multi-comp:0 */
@connect(({ MaritimePeople, loading }) => ({
  MaritimePeople,
  loading: loading.models.MaritimePeople,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    formValues: [],
    detail: {},
    pageBean: { 'page': 1, 'pageSize': 10, 'showTotal': true },
  };

  columns = [
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '身份证号码',
      dataIndex: 'idcard',
      width: 180,
    },
    {
      title: '性别',
      dataIndex: 'sex',
      width: 80,
      render: val => val === 1 ? '男' : '女',
    },
    {
      title: '职位',
      dataIndex: 'post',
    },
    {
      title: '资格证编号',
      dataIndex: 'certificateNo',
    },
    {
      title: '所属单位',
      dataIndex: 'companyName',
    },
    {
      title: '操作',
      width: 80,
      render: (text, record) => (
        <Fragment>
          <Tooltip placement="left" title='编辑'>
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
  }


  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'MaritimePeople/fetch',
      payload: params,
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
        post: fieldsValue.zw,
        certificateNo: fieldsValue.zgzh,
        companyName: fieldsValue.ssdw,
        sex: fieldsValue.xb,
      };

      const objKeys = Object.keys(values);
      const condition = objKeys.map(item => {
        return values[item]
          ? {
            property: item,
            value: values[item],
            group: 'main',
            operation: item === 'sex' ? 'EQUAL' : 'LIKE',
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
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 16, xl: 32 }}>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('zw')(<Input addonBefore="职位" placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('zgzh')(<Input addonBefore="资格证号" placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('ssdw')(<Input addonBefore="所属单位" placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <div className={publicCss.inputMain}>
              <span style={{ width: '80px', lineHeight: '30px', height: '32px' }}
                    className="ant-input-group-addon">性别</span>
              <FormItem style={{ flex: 1 }}>
                {getFieldDecorator('xb')(
                  <Select placeholder="请选择" style={{ width: '100%' }}>
                    <Option value={1}>男</Option>
                    <Option value={2}>女</Option>
                  </Select>,
                )}
              </FormItem>
            </div>
          </Col>
          <Col md={4} sm={24}>
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
      MaritimePeople: { data },
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
              rowKey="id_"
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
          <DetailModal {...parentMethods} modalVisible={modalVisible}/> : null}
      </Fragment>
    );
  }
}

export default TableList;
