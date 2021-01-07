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
  Divider,
  Tooltip,
  Popconfirm,
  message,
  Modal,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import CreateModal from './component/CreateModal';
import UpdateModal from './component/UpdateModal';
import ScoreModal from './component/ScoreModal';
import CompanyRoadConserveModal from './component/CompanyRoadConserveModal';

import styles from '../../../style/style.less';

const FormItem = Form.Item;

/* eslint react/no-multi-comp:0 */
@connect(({ ConserveCompany, loading }) => ({
  ConserveCompany,
  loading: loading.models.ConserveCompany,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    scoreVisible: false,
    updateModalVisible: false,
    companyRoadConserveVisible: false,
    selectedRows: [],
    formValues: [],
    companyID: '',
    companyName: '',
    detail: {},
    pageBean: { page: 1, pageSize: 10, showTotal: true },
  };

  columns = [
    {
      title: '企业名称',
      dataIndex: 'companyName',
    },
    {
      title: '法人代表',
      dataIndex: 'companyHeader',
    },
    {
      title: '联系方式',
      dataIndex: 'companyTel',
    },
    {
      title: '标签',
      dataIndex: 'conserveCategoryName',
      render: val =>
        val
          ? val
              .split(',')
              .filter(item => item)
              .join()
          : '',
    },
    {
      title: '签订时间',
      dataIndex: 'agreementBeginTime',
      render: val => moment(val).format('YYYY-MM-DD'),
    },
    {
      title: '结束时间',
      dataIndex: 'agreementEndTime',
      render: val => moment(val).format('YYYY-MM-DD'),
    },
    {
      title: '操作',
      width: 180,
      render: (text, record) => (
        <Fragment>
          <Tooltip placement="left" title="评分列表">
            <Button
              onClick={() => this.showScoreModal(record)}
              type="primary"
              shape="circle"
              icon="star"
              size="small"
            />
          </Tooltip>
          <Divider type="vertical" />
          <Tooltip placement="left" title="添加路段">
            <Button
              onClick={() => this.showCompanyRoadConserve(record)}
              type="primary"
              shape="circle"
              icon="plus"
              size="small"
            />
          </Tooltip>
          <Divider type="vertical" />
          <Tooltip placement="left" title="编辑">
            <Button
              onClick={() => this.editData(record.id)}
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
    this.getList({ pageBean: this.state.pageBean });
  }

  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ConserveCompany/fetch',
      payload: params,
    });
  };

  showCompanyRoadConserve = record => {
    this.setState(
      {
        companyName: record.companyName,
        companyID: record.id,
      },
      () => this.handdleCompanyRoadConserveVisible(true),
    );
  };

  showScoreModal = record =>
    this.setState({ companyID: record.id }, () => this.handleScoreVisible(true));

  editData = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ConserveCompany/detail',
      payload: id,
      callback: detail =>
        this.setState(
          {
            detail,
          },
          () => this.handleUpdateModalVisible(true),
        ),
    });
  };

  dataDel = id => {
    this.delUtil(id);
  };

  delBatch = () => {
    const { selectedRows } = this.state;
    if (!selectedRows) return;
    Modal.confirm({
      title: '提示',
      content: '您确定要批量删除吗?',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        this.delUtil(selectedRows.map(row => row.id).join());
      },
    });
  };

  delUtil = ids => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ConserveCompany/remove',
      payload: { ids },
      callback: () => {
        message.success('删除成功');
        this.getList({ pageBean: this.state.pageBean });
        this.setState({
          selectedRows: [],
        });
      },
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
    form.resetFields();
    this.setState({
      formValues: [],
      selectedRows: [],
    });
    this.getList({ pageBean: this.state.pageBean });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
      };

      const { pageBean } = this.state;
      const objKeys = Object.keys(values);
      const condition = objKeys.map(item => {
        return values[item]
          ? {
              property: item,
              value: values[item],
              group: 'main',
              operation: 'LIKE',
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
  };

  handleScoreVisible = flag => {
    this.setState({
      scoreVisible: !!flag,
    });
    if (!flag) {
      this.setState({ companyID: '' });
    }
  };

  handleUpdateModalVisible = flag => {
    this.setState({
      updateModalVisible: !!flag,
    });
    if (!flag) {
      this.setState({ detail: {} });
    }
  };

  handdleCompanyRoadConserveVisible = flag => {
    this.setState({
      companyRoadConserveVisible: !!flag,
    });
    if (!flag) {
      this.setState({
        companyID: '',
      });
    }
  };

  modalSuccess = () => {
    this.setState({ detailID: '' });
    this.getList({ pageBean: this.state.pageBean });
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
              {getFieldDecorator('companyHeader')(
                <Input addonBefore="法人代表" placeholder="请输入" />,
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem>
              {getFieldDecorator('companyName')(
                <Input addonBefore="企业名称" placeholder="请输入" />,
              )}
            </FormItem>
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
      ConserveCompany: { data },
      loading,
    } = this.props;
    const {
      companyName,
      selectedRows,
      modalVisible,
      detail,
      updateModalVisible,
      companyRoadConserveVisible,
      companyID,
      scoreVisible,
    } = this.state;

    const parentMethods = {
      modalSuccess: this.modalSuccess,
      handleModalVisible: this.handleModalVisible,
    };

    const updateMethods = {
      detail,
      modalSuccess: this.modalSuccess,
      handleModalVisible: this.handleUpdateModalVisible,
    };

    const companyRoadMethods = {
      companyID,
      companyName,
      modalSuccess: this.modalSuccess,
      handleModalVisible: this.handdleCompanyRoadConserveVisible,
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
              {selectedRows.length > 0 && (
                <Button type="danger" onClick={this.delBatch}>
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
        {modalVisible ? <CreateModal {...parentMethods} modalVisible={modalVisible} /> : null}
        {updateModalVisible && Object.keys(detail).length && (
          <UpdateModal {...updateMethods} modalVisible={updateModalVisible} />
        )}
        {companyRoadConserveVisible && companyID && (
          <CompanyRoadConserveModal
            {...companyRoadMethods}
            modalVisible={companyRoadConserveVisible}
          />
        )}
        {scoreVisible && companyID && (
          <ScoreModal
            companyID={companyID}
            modalVisible={scoreVisible}
            handleModalVisible={this.handleScoreVisible}
          />
        )}
      </Fragment>
    );
  }
}

export default TableList;
