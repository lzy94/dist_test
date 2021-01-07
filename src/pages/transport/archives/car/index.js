import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  message,
  Divider,
  Tooltip,
  Popconfirm,
  Modal,
  Select,
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
const statusMap = ['审核中', '已审核', '已驳回', '已报废', '已删除'];

/* eslint react/no-multi-comp:0 */
@connect(({ TransportArchivesCar, loading }) => ({
  TransportArchivesCar,
  loading: loading.models.TransportArchivesCar,
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
      title: '车牌号',
      dataIndex: 'carNo',
      width: 100,
    },
    {
      title: '所属公司',
      dataIndex: 'companyName',
    },
    {
      title: '道路运输证号',
      dataIndex: 'transportLicense',
    },
    {
      title: '座位',
      dataIndex: 'seat',
      width: 80,
    },
    {
      title: '吨位(t)',
      dataIndex: 'tonnage',
      width: 80,
      render: val => val / 1000,
    },
    {
      title: 'GPS入网',
      dataIndex: 'isAccessNetwork',
      render: val => (val === 1 ? '是' : '否'),
    },
    {
      title: '车辆状态',
      dataIndex: 'type',
      render: val => (val === 0 ? '运营' : '停运'),
    },
    {
      title: '车辆类型',
      dataIndex: 'carType',
    },
    {
      title: '照片',
      dataIndex: 'carImg',
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
      title: '状态',
      width: 90,
      dataIndex: 'status',
      render: val => statusMap[val - 1],
    },
    {
      title: '操作',
      width: 90,
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
      type: 'TransportArchivesCar/fetch',
      payload: params,
    });
  };

  showDetailModal = detail => this.setState({ detail }, () => this.handleUpdateModalVisible(true));

  /**
   * @description 单个删除
   * @param id {number}
   */
  dataDel = id => {
    this.delUtil(id);
  };

  batchDel = () => {
    const { selectedRows } = this.state;
    if (!selectedRows.length) return;
    Modal.confirm({
      title: '提示',
      content: '是否删除数据？',
      onOk: () => {
        const ids = selectedRows.map(item => item.id);
        this.delUtil(ids.join(), () => {
          this.setState({ selectedRows: [] });
        });
      },
    });
  };

  /**
   * @description 删除公用
   * @param id {number}
   * @callback {function}
   */
  delUtil = (ids, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'TransportArchivesCar/remove',
      payload: { ids },
      callback: () => {
        message.success('删除成功');
        const { pageBean } = this.state;
        this.getList({ pageBean });
        if (callback) callback();
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
        carNo: fieldsValue.CPH,
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
          <Col md={6} sm={24}>
            <FormItem>
              {getFieldDecorator('CPH')(<Input addonBefore="车牌号" placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem>
              {getFieldDecorator('comName')(<Input addonBefore="所属企业" placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
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
      TransportArchivesCar: { data },
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
              {selectedRows.length > 0 && (
                <Button style={{ marginLeft: 10 }} type="danger" onClick={this.batchDel}>
                  批量删除
                </Button>
              )}
            </div>
            <StandardTable
              size="middle"
              tableAlert={true}
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
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
            path="/transport/transportAdmin/practitionersCar/v1/importCarInfo"
            modalCallback={this.modalCallback}
            handleModalVisible={this.handleExportVisible}
          />
        )}
      </Fragment>
    );
  }
}

export default TableList;
