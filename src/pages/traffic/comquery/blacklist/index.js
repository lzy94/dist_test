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
  InputNumber,
  Descriptions,
} from 'antd';
import { Redirect } from 'umi';
import StandardTable from '@/components/StandardTable';
import { checkAuth } from '@/utils/utils';

import styles from '../../../style/style.less';
import publicCss from '../../../style/public.less';
import themeStyle from '@/pages/style/theme.less';

const FormItem = Form.Item;

const authority = ['/comquery/blacklist'];

const UpdateForm = Form.create()(props => {
  const { modalVisible, handleUpdateModalVisible, detail } = props;

  return (
    <Modal
      destroyOnClose
      title="黑名单详情"
      className={themeStyle.myModal + ' ' + themeStyle.modalbody}
      visible={modalVisible}
      onCancel={() => handleUpdateModalVisible()}
      width={900}
      footer={null}
    >
      <div className={themeStyle.detailMsg}>
        <div style={{ padding: 20 }}>
          <Descriptions bordered={true} column={2} size="small">
            <Descriptions.Item label="车牌号">{detail.carNo}</Descriptions.Item>
            <Descriptions.Item label="超限次数">{detail.limitedNum}</Descriptions.Item>
            <Descriptions.Item label="车籍地">{detail.carBirthplace}</Descriptions.Item>
            <Descriptions.Item label="道路运输证号">{detail.transpoptNo}</Descriptions.Item>
            <Descriptions.Item label="发证日期">
              {moment(detail.getLinceseDate).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
            <Descriptions.Item label="发证机关">{detail.linceseOrgan}</Descriptions.Item>
            <Descriptions.Item label="超限超载情况">{detail.limitedSituation}</Descriptions.Item>
            <Descriptions.Item label="查处时间">
              {moment(detail.investigationDate).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
            <Descriptions.Item label="处罚机关">{detail.investigationOrgan}</Descriptions.Item>
            <Descriptions.Item label="处罚机关联系电话">
              {detail.investigationTel}
            </Descriptions.Item>
            <Descriptions.Item label="处罚文书编号">{detail.investigationCode}</Descriptions.Item>
            <Descriptions.Item label="导入来源">{detail.sourceImport}</Descriptions.Item>
            <Descriptions.Item label="是否所属货运企业">
              {detail.isFreight ? '是' : '否'}
            </Descriptions.Item>
            <Descriptions.Item label="货运企业">{detail.freightName}</Descriptions.Item>
            <Descriptions.Item label="是否所属源头企业">
              {detail.isSource ? '是' : '否'}
            </Descriptions.Item>
            <Descriptions.Item label="源头企业">{detail.sourceCompanyName}</Descriptions.Item>
          </Descriptions>
        </div>
      </div>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ system, Blacklist, loading }) => ({
  treeList: system.treeList,
  Blacklist,
  loading: loading.models.Blacklist,
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
      title: '车牌号',
      dataIndex: 'carNo',
    },
    {
      title: '超限次数',
      dataIndex: 'limitedNum',
    },
    {
      title: '车籍地',
      dataIndex: 'carBirthplace',
    },
    {
      title: '道路运输证号',
      dataIndex: 'transpoptNo',
    },
    {
      title: '发证日期',
      dataIndex: 'getLinceseDate',
      render: val => moment(val).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '发证机关',
      dataIndex: 'linceseOrgan',
    },
    {
      title: '超限超载情况',
      dataIndex: 'limitedSituation',
    },
    {
      title: '查处时间',
      dataIndex: 'investigationDate',
      render: val => moment(val).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '处罚机关',
      dataIndex: 'investigationOrgan',
    },
    {
      title: '处罚机关联系电话',
      dataIndex: 'investigationTel',
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

  showModal = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Blacklist/detail',
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
      type: 'Blacklist/fetch',
      payload: params,
    });
  };

  componentDidMount() {
    if (!checkAuth(authority[0])) return;
    const { pageBean } = this.state;
    this.getList({ pageBean });
  }

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
      selectedRows: [],
    });

    this.getList({ pageBean });
  };

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { pageBean } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

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
              operation:
                item === 'organCode' ? 'RIGHT_LIKE' : item === 'LIMITED_NUM' ? 'EQUAL' : 'LIKE',
              relation: 'OR',
            }
          : '';
      });
      const conditionFilter = condition.filter(item => item);
      this.setState({
        formValues: conditionFilter,
      });
      this.getList({
        pageBean,
        querys: conditionFilter,
      });
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
    });
    if (!!!flag) {
      this.setState({ detail: {} });
    }
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
            <FormItem>{getFieldDecorator('carNo')(<Input addonBefore="车牌号" />)}</FormItem>
          </Col>
          <Col md={5} sm={24}>
            <div className={publicCss.inputMain}>
              <span
                style={{ width: '80px', lineHeight: '30px', height: '32px' }}
                className="ant-input-group-addon"
              >
                超限次数
              </span>
              <FormItem style={{ flex: 1 }}>
                {getFieldDecorator('LIMITED_NUM')(
                  <InputNumber
                    className={publicCss.inputGroupLeftRadius}
                    style={{
                      width: '100%',
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0,
                    }}
                    placeholder="请输入"
                  />,
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
      Blacklist: { data },
      loading,
    } = this.props;
    const { updateModalVisible, detail } = this.state;

    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
      detail: detail,
    };
    return (
      <Fragment>
        {checkAuth(authority[0]) ? null : <Redirect to="/exception/403" />}
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
        {updateModalVisible && JSON.stringify(detail) !== '{}' ? (
          <UpdateForm {...updateMethods} modalVisible={updateModalVisible} />
        ) : null}
      </Fragment>
    );
  }
}

export default TableList;
