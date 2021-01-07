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
  message,
  Popconfirm,
  Divider,
} from 'antd';
import moment from 'moment';
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
@connect(({ TransportArchivesLicense, loading }) => ({
  TransportArchivesLicense,
  loading: loading.models.TransportArchivesLicense,
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
      title: '经营范围',
      dataIndex: 'businessScop',
      render: val =>
        val.length > 10 ? <Tooltip title={val}>{val.substring(0, 10)}...</Tooltip> : val,
    },
    {
      title: '地址',
      dataIndex: 'addr',
    },
    {
      title: '证件有效期',
      dataIndex: 'termValidity',
      width: 120,
      render: val => moment(val).format('YYYY-MM-DD'),
    },
    {
      title: '许可证名称',
      dataIndex: 'licenceName',
    },
    {
      title: '许可证编号',
      dataIndex: 'licenceNo',
    },
    {
      title: '核发机关',
      dataIndex: 'issuingAuth',
    },
    {
      title: '许可证照',
      dataIndex: 'licenceImg',
      width: 110,
      render: val => {
        const url = /http/.test(val) ? val : imgUrl + val;
        return (
          <img
            style={{ width: 90 }}
            src={url}
            alt="许可证照"
            onError={e => {
              e.target.onerror = null;
              e.target.src = notImg;
            }}
          />
        );
      },
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
      type: 'TransportArchivesLicense/fetch',
      payload: params,
    });
  };

  showDetailModal = detail => this.setState({ detail }, () => this.handleUpdateModalVisible(true));

  dataDel = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'TransportArchivesLicense/remove',
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
        companyName: fieldsValue.comName,
        licenceName: fieldsValue.XKZMC,
        licenceNo: fieldsValue.XKZBH,
        issuingAuth: fieldsValue.HFJG,
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
              {getFieldDecorator('comName')(<Input addonBefore="公司名称" placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem>
              {getFieldDecorator('XKZMC')(<Input addonBefore="许可证名称" placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem>
              {getFieldDecorator('XKZBH')(<Input addonBefore="许可证编号" placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem>
              {getFieldDecorator('HFJG')(<Input addonBefore="核发机关" placeholder="请输入" />)}
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
      TransportArchivesLicense: { data },
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
              {/* {selectedRows.length > 0 && <Button>批量操作</Button>} */}
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
            path="/transport/api/tsAdmin/companyLicence/importCompanyLicence"
            modalCallback={this.modalCallback}
            handleModalVisible={this.handleExportVisible}
          />
        )}
      </Fragment>
    );
  }
}

export default TableList;
