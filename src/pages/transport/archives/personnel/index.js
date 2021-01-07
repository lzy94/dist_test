import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
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
import { imgUrl } from '@/utils/utils';

import CreateModal from './Component/CreateModal';
import UpdateModal from './Component/UpdateModal';
import ExportModal from '../../Component/ExportModal';

import publicCss from '@/pages/style/public.less';
import styles from '../../../style/style.less';
import notImg from '@/assets/notImg.png';

const FormItem = Form.Item;
const { Option } = Select;
const statusMap = ['待审核', '审核通过', '驳回'];

/* eslint react/no-multi-comp:0 */
@connect(({ TransportArchivesPersonnel, loading }) => ({
  TransportArchivesPersonnel,
  loading: loading.models.TransportArchivesPersonnel,
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
      title: '照片',
      dataIndex: 'img',
      width: 110,
      render: val => {
        const url = /http/.test(val) ? val : imgUrl + val;
        return (
          <img
            style={{ width: 90 }}
            src={url}
            alt="照片"
            onError={e => {
              e.target.onerror = null;
              e.target.src = notImg;
            }}
          />
        );
      },
    },
    {
      title: '姓名',
      dataIndex: 'userName',
    },
    {
      title: '联系方式',
      dataIndex: 'tel',
      width: 120,
    },
    {
      title: '身份证',
      dataIndex: 'idcard',
      width: 180,
    },
    {
      title: '性别',
      dataIndex: 'sex',
      width: 60,
      render: val => (val === 1 ? '男' : '女'),
    },
    {
      title: '所属公司',
      dataIndex: 'companyName',
    },
    {
      title: '公司联系电话',
      dataIndex: 'companyTel',
      width: 130,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
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
            onConfirm={() => this.dataDel(record.id)}
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
      type: 'TransportArchivesPersonnel/fetch',
      payload: params,
    });
  };

  showDetailModal = detail => this.setState({ detail }, () => this.handleUpdateModalVisible(true));

  dataDel = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'TransportArchivesPersonnel/remove',
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

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { form } = this.props;
    const { pageBean } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        userName: fieldsValue.name,
        companyName: fieldsValue.comName,
        tel: fieldsValue.contact,
        idcard: fieldsValue.card,
        status: fieldsValue.state,
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
          <Col md={4} sm={24}>
            <FormItem>
              {getFieldDecorator('name')(<Input addonBefore="姓名" placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem>
              {getFieldDecorator('contact')(<Input addonBefore="联系方式" placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem>
              {getFieldDecorator('card')(<Input addonBefore="身份证" placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem>
              {getFieldDecorator('comName')(<Input addonBefore="公司名称" placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <div className={publicCss.inputMain}>
              <span
                style={{ width: '80px', lineHeight: '30px', height: '32px' }}
                className="ant-input-group-addon"
              >
                状态
              </span>
              <FormItem style={{ flex: 1, flexShrink: 0 }}>
                {getFieldDecorator('state')(
                  <Select
                    placeholder="请选择"
                    style={{ width: '100%' }}
                    dropdownMatchSelectWidth={false}
                  >
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
      TransportArchivesPersonnel: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, exportVisible, updateModalVisible, detail } = this.state;

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
              {selectedRows.length > 0 && <Button>批量操作</Button>}
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
            path="/transport/api/tsAdmin/companyPerson/importCompanyPerson"
            modalCallback={this.modalCallback}
            handleModalVisible={this.handleExportVisible}
          />
        )}
      </Fragment>
    );
  }
}

export default TableList;
