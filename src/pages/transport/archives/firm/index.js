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
  Tooltip,
  Select,
  Popconfirm,
  Divider,
  message,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import CreateModal from './Component/CreateModal';
import UpdateModal from './Component/UpdateModal';
import ExportModal from '../../Component/ExportModal';

import publicCss from '@/pages/style/public.less';
import styles from '../../../style/style.less';

const FormItem = Form.Item;
const { Option } = Select;
const createTypeMap = ['自主申请', '管理员添加'];
const statusMap = ['审核中', '通过', '驳回', '申请修改'];

/* eslint react/no-multi-comp:0 */
@connect(({ TransportArchivesFirm, loading }) => ({
  TransportArchivesFirm,
  loading: loading.models.TransportArchivesFirm,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    exportVisible: false,
    modalVisible: false,
    updateModalVisible: false,
    selectedRows: [],
    formValues: [],
    detail: {},
    pageBean: { page: 1, pageSize: 10, showTotal: true },
  };

  columns = [
    {
      title: '公司名称',
      dataIndex: 'companyName',
    },
    {
      title: '注册账号',
      dataIndex: 'account',
    },
    {
      title: '详细地址',
      dataIndex: 'addr',
    },
    {
      title: '安全监督员',
      dataIndex: 'safetySupervisor',
    },
    {
      title: '创建方式',
      dataIndex: 'createType',
      width: 100,
      render: val => createTypeMap[val - 1],
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 170,
      render: val => moment(val).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '状态',
      width: 90,
      dataIndex: 'status',
      render: val => statusMap[val - 1],
    },
    {
      title: '操作',
      width: 100,
      render: (text, record) => (
        <Fragment>
          <Tooltip placement="left" title="编辑">
            <Button
              onClick={() => this.showDetailModal(record)}
              type="primary"
              shape="circle"
              icon="edit"
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
    const { pageBean } = this.state;
    this.getList({ pageBean });
  }

  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'TransportArchivesFirm/fetch',
      payload: params,
    });
  };

  showDetailModal = detail => this.setState({ detail }, () => this.handleUpdateModalVisible(true));

  dataDel = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'TransportArchivesFirm/remove',
      payload: id,
      callback: () => {
        const { pageBean } = this.state;
        message.success('删除成功');
        this.getList({ pageBean });
      },
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
    const { pageBean } = this.state;
    form.resetFields();
    this.setState({
      formValues: [],
      selectedRows: [],
    });
    this.getList({ pageBean });
  };

  // handleSelectRows = rows => {
  //   this.setState({
  //     selectedRows: rows,
  //   });
  // };

  handleSearch = e => {
    e.preventDefault();

    const { form } = this.props;
    const { pageBean } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        companyName: fieldsValue.comName,
        concacts: fieldsValue.LXR,
        concactsTel: fieldsValue.LXFS,
        status: fieldsValue.state,
        // creditCode: fieldsValue.code,
      };

      const objKeys = Object.keys(values);
      const condition = objKeys.map(item => {
        return values[item]
          ? {
              property: item,
              value: values[item],
              group: 'main',
              operation: item === 'status' ? 'EQUAL' : 'LIKE',
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

  handleExportVisible = flag => {
    this.setState({ exportVisible: !!flag });
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
    if (!flag) {
      this.setState({ detail: {} });
    }
  };

  /**
   * @description 窗口关闭后回调
   */
  modalCallback = () => {
    const { pageBean } = this.state;
    this.getList({ pageBean });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={16}>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('comName')(<Input addonBefore="公司名称" placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('LXR')(<Input addonBefore="联系人" placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('LXFS')(<Input addonBefore="联系方式" placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            {/* <FormItem>
              {getFieldDecorator('code')(<Input addonBefore="信用代码" placeholder="请输入" />)}
            </FormItem> */}
            <div className={publicCss.inputMain}>
              <span
                style={{ width: '80px', lineHeight: '30px', height: '32px' }}
                className="ant-input-group-addon"
              >
                状态
              </span>
              <FormItem style={{ flex: 1, flexShrink: 0 }}>
                {getFieldDecorator('state')(
                  <Select placeholder="请选择" style={{ width: '100%' }}>
                    {statusMap.map((item, i) => (
                      <Option value={i + 1} key={i}>
                        {item}
                      </Option>
                    ))}
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
      TransportArchivesFirm: { data },
      loading,
    } = this.props;
    const { selectedRows, exportVisible, modalVisible, updateModalVisible, detail } = this.state;

    const parentMethods = {
      modalCallback: this.modalCallback,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      detail,
      modalCallback: this.modalCallback,
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
              <Button
                className={publicCss.import}
                icon="export"
                onClick={() => this.handleExportVisible(true)}
              >
                导入
              </Button>
              {/* {selectedRows.length > 0 && (
                <span>
                  <Button>批量操作</Button>
                </span>
              )} */}
            </div>
            <StandardTable
              rowKey="id_"
              size="middle"
              tableAlert={false}
              selectedRows={0}
              rowSelection={null}
              // selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              // onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateModal {...parentMethods} modalVisible={modalVisible} />
        {updateModalVisible && Object.keys(detail).length ? (
          <UpdateModal {...updateMethods} modalVisible={updateModalVisible} />
        ) : null}
        {exportVisible && (
          <ExportModal
            modalVisible={exportVisible}
            path="/transport/api/tsAdmin/company/importExcelCompany"
            modalCallback={this.modalCallback}
            handleModalVisible={this.handleExportVisible}
          />
        )}
      </Fragment>
    );
  }
}

export default TableList;
