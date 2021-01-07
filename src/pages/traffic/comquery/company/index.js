import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Modal,
  TreeSelect,
  Tooltip,
  Descriptions,
} from 'antd';
import { Redirect } from 'umi';
import StandardTable from '@/components/StandardTable';

import { checkAuth } from '@/utils/utils';
import styles from '../../../style/style.less';
import publicCss from '../../../style/public.less';
import themeStyle from '@/pages/style/theme.less';

const FormItem = Form.Item;
const authority = ['/comquery/company'];
const cardType = ['身份证', '执法证', '军官证', '护照', '其他'];

const UpdateForm = Form.create()(props => {
  const { modalVisible, handleUpdateModalVisible, detail } = props;

  const style = {
    color: 'rgba(0,0,0,.7)',
    border: 0,
  };

  return (
    <Modal
      destroyOnClose
      title="货运企业详情"
      className={themeStyle.myModal + ' ' + themeStyle.modalbody}
      visible={modalVisible}
      onCancel={() => handleUpdateModalVisible()}
      footer={null}
      width={800}
    >
      <div className={themeStyle.detailMsg}>
        <div style={{ padding: 20 }}>
          <Descriptions bordered={true} size="small" column={2}>
            <Descriptions.Item label="企业名称">{detail.companyName}</Descriptions.Item>
            <Descriptions.Item label="企业号码">{detail.companyPhone}</Descriptions.Item>
            <Descriptions.Item label="企业地址">{detail.address}</Descriptions.Item>
            <Descriptions.Item label="法人代表">{detail.legalRepresent}</Descriptions.Item>
            <Descriptions.Item label="法人代表证件类型">
              {cardType[parseInt(detail.idCardType) - 1]}
            </Descriptions.Item>
            <Descriptions.Item label="法人代表证件号码">{detail.idCardNo}</Descriptions.Item>
            <Descriptions.Item label="道路运输证号">{detail.transportCode}</Descriptions.Item>
            <Descriptions.Item label="发证日期">
              {moment(detail.getLicenceDate).format('YYYY-MM-DD')}
            </Descriptions.Item>
            <Descriptions.Item label="承运人名称">{detail.carrier}</Descriptions.Item>
            <Descriptions.Item label="承运人地址">{detail.carrierAddr}</Descriptions.Item>
            <Descriptions.Item label="承运人邮编">{detail.carrierMail}</Descriptions.Item>
            <Descriptions.Item label="备注">{detail.remark}</Descriptions.Item>
          </Descriptions>
        </div>
      </div>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ system, Company, loading }) => ({
  treeList: system.treeList,
  Company,
  loading: loading.models.Company,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    updateModalVisible: false,
    formValues: [],
    detail: {},
    pageBean: {
      page: 1,
      pageSize: 10,
      showTotal: true,
    },
  };

  columns = [
    {
      title: '企业名称',
      dataIndex: 'companyName',
    },
    {
      title: '企业号码',
      dataIndex: 'companyPhone',
    },
    {
      title: '地址',
      dataIndex: 'address',
    },
    {
      title: '法人代表',
      dataIndex: 'legalRepresent',
    },
    {
      title: '道路运输证号',
      dataIndex: 'transportCode',
    },
    {
      title: '承运人名称',
      dataIndex: 'carrier',
    },
    {
      title: '承运人地址',
      dataIndex: 'carrierAddr',
    },
    {
      title: '操作',
      width: 70,
      render: (text, record) => (
        <Fragment>
          <Tooltip placement="left" title="详情">
            <Button
              onClick={() => this.showModal(record.id)}
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
    const { pageBean } = this.state;
    this.getList({ pageBean });
  }

  showModal = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Company/detail',
      payload: id,
      callback: res => {
        this.setState({ detail: res });
        this.handleUpdateModalVisible(true);
      },
    });
  };

  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Company/fetch',
      payload: params,
    });
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
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
    const { pageBean } = this.state;
    form.resetFields();
    this.setState({
      formValues: [],
    });
    this.getList({ pageBean });
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { pageBean } = this.state;
      const values = {
        ...fieldsValue,
      };

      const objKeys = Object.keys(values);
      // 重新格式化条件数组
      const condition = objKeys.map(item => {
        return values[item]
          ? {
              property: item,
              value: values[item],
              group: 'main',
              operation: item === 'organCode' ? 'RIGHT_LIKE' : 'LIKE',
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

  handleUpdateModalVisible = flag => {
    this.setState({
      updateModalVisible: !!flag,
    });
  };

  renderSimpleForm() {
    const {
      treeList,
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 16, xl: 16 }}>
          <Col md={5} sm={24}>
            <div className={publicCss.inputMain}>
              <span
                style={{ width: '80px', lineHeight: '30px', height: '32px' }}
                className="ant-input-group-addon"
              >
                所属机构
              </span>
              <FormItem style={{ flex: 1 }}>
                {getFieldDecorator('organCode')(
                  <TreeSelect
                    className={publicCss.inputGroupLeftRadius}
                    treeData={treeList}
                    style={{ width: '100%' }}
                    placeholder="请选择"
                  />,
                )}
              </FormItem>
            </div>
          </Col>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('companyName')(<Input addonBefore="企业名称" />)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('legalRepresent')(<Input addonBefore="法人代表" />)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('transportCode')(<Input addonBefore="道路运输证号" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
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
      Company: { data },
      loading,
    } = this.props;
    const { updateModalVisible, detail } = this.state;

    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
      detail,
    };
    return (
      <Fragment>
        {checkAuth(authority[0]) ? null : <Redirect to="/exception/403" />}
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <StandardTable
              size="middle"
              selectedRows={0}
              rowSelection={null}
              loading={loading}
              data={data}
              tableAlert={false}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        {updateModalVisible && JSON.stringify(detail) !== '{}' ? (
          <UpdateForm {...updateMethods} modalVisible={updateModalVisible} />
        ) : null}
      </Fragment>
    );
  }
}

export default TableList;
