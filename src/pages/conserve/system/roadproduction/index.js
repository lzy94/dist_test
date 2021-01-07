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
  Divider, Tooltip, Popconfirm, Modal,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import CreateForm from './component/CreateForm';
import UpdateForm from './component/UpdateForm';

import styles from '../../../style/style.less';
import Roadproductioncategory from '@/pages/conserve/system/roadproduction/component/Roadproductioncategory';

const FormItem = Form.Item;

/* eslint react/no-multi-comp:0 */
@connect(({ RoadProduction, loading }) => ({
  RoadProduction,
  loading: loading.models.RoadProduction,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    cateModalVisible: false,
    selectedRows: [],
    formValues: [],
    detailID: '',
    categoryId: '',
    categoryName: '',
    pageBean: { 'page': 1, 'pageSize': 10, 'showTotal': true },
  };

  columns = [
    {
      title: '路产编号',
      dataIndex: 'productionCode',
    },
    {
      title: '路产名称',
      dataIndex: 'productionName',
    },
    {
      title: '所属分类',
      dataIndex: 'categoryName',
    },
    {
      title: '地址',
      dataIndex: 'addr',
    },
    {
      title: '操作',
      width: 100,
      render: (text, record) => (
        <Fragment>
          <Tooltip placement="left" title='编辑'>
            <Button
              onClick={() => this.editData(record.id)}
              type="primary"
              shape="circle"
              icon='edit'
              size="small"
            />
          </Tooltip>
          <Divider type="vertical"/>
          <Popconfirm
            title="是否删除数据?"
            onConfirm={() => this.dataDel(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Tooltip placement="left" title="删除">
              <Button type="danger" shape="circle" icon="delete" size="small"/>
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

  editData = id => {
    this.setState({ detailID: id }, () => this.handleUpdateModalVisible(true));
  };

  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'RoadProduction/fetch',
      payload: params,
    });
  };

  dataDel = id => {
    const { dispatch } = this.props;
    const { pageBean } = this.state;
    dispatch({
      type: 'RoadProduction/remove',
      payload: id,
      callback: () => {
        message.success('删除成功');
        this.getList({ pageBean: pageBean });
      },
    });
  };

  batchDel = () => {
    const { selectedRows } = this.state;
    if (!selectedRows) return;
    Modal.confirm({
      title: '批量删除',
      content: '您确定要批量删除吗?',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        const { dispatch } = this.props;
        const { pageBean } = this.state;
        dispatch({
          type: 'RoadProduction/removes',
          payload: {
            ids: selectedRows.map(item => item.id).join(),
          },
          callback: () => {
            message.success('删除成功');
            this.setState({
              selectedRows: [],
            });
            this.getList({ pageBean: pageBean });
          },
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
      categoryId: '',
      categoryName: '',
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
      values['categoryId'] = this.state.categoryId;
      const objKeys = Object.keys(values);
      const condition = objKeys.map(item => {
        return values[item]
          ? {
            property: item,
            value: values[item],
            group: 'main',
            operation: item === 'categoryId' ? 'EQUAL' : 'LIKE',
            relation: 'AND',
          }
          : '';
      });
      const conditionFilter = condition.filter(item => item);
      this.setState({
        formValues: conditionFilter,
      });

      this.getList({ pageBean: this.state.pageBean, querys: conditionFilter });
    });
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
  };

  modalSuccess = () => {
    this.getList({ pageBean: this.state.pageBean });
  };

  selectDataCate = data => {
    this.setState({
      categoryId: data.id,
      categoryName: data.categoryName,
    });
  };

  cateHandleUpdateModalVisible = flag => {
    this.setState({
      cateModalVisible: !!flag,
    });
  };


  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'RoadProduction/update',
      payload: {
        name: fields.name,
        desc: fields.desc,
        key: fields.key,
      },
    });

    message.success('配置成功');
    this.handleUpdateModalVisible();
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 16, xl: 32 }}>
          <Col md={6} sm={24}>
            <FormItem>
              {getFieldDecorator('categoryId', {
                initialValue: this.state.categoryName,
              })(
                <Input readOnly addonBefore='路产分类' placeholder="请选择"
                       onClick={() => this.cateHandleUpdateModalVisible(true)}/>,
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem>
              {getFieldDecorator('productionCode')(<Input addonBefore='编号' placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem>
              {getFieldDecorator('productionName')(<Input addonBefore='名称' placeholder="请输入"/>)}
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
      RoadProduction: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, detailID, cateModalVisible } = this.state;

    const parentMethods = {
      modalSuccess: this.modalSuccess,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      detailID,
      modalSuccess: this.modalSuccess,
      handleModalVisible: this.handleUpdateModalVisible,
    };

    const CateMethods = {
      selectData: this.selectDataCate,
      handleModalVisible: this.cateHandleUpdateModalVisible,
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
                <span>
                   <Button type='danger' onClick={() => this.batchDel()}>批量删除</Button>
                </span>
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
        <CreateForm {...parentMethods} modalVisible={modalVisible}/>
        {
          detailID && updateModalVisible ? <UpdateForm {...updateMethods} modalVisible={updateModalVisible}/> : null
        }
        {cateModalVisible ? <Roadproductioncategory modalVisible={cateModalVisible} {...CateMethods}/> : null}
      </Fragment>
    );
  }
}

export default TableList;
