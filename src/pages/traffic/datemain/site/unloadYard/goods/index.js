import React, {Fragment, PureComponent} from 'react';
import {
  Button,
  Modal,
  Form,
  message,
  InputNumber,
  Input,
  Tooltip,
  Divider,
  Popconfirm,
  Select,
  DatePicker,
  Row,
  Col,
} from 'antd';
import styles from '@/pages/style/style.less';
import StandardTable from '@/components/StandardTable';
import {connect} from 'dva';
import moment from 'moment';
import {checkPhone} from '@/utils/utils';
import themeStyle from "@/pages/style/theme.less";

const FormItem = Form.Item;
const Option = Select.Option;
const cardType = ['身份证', '驾驶证', '营运证', '其他'];
const statusMap = ['未处理', '转运', '变卖'];

const CreateForm = Form.create()(props => {
  const {modalVisible, form, handleAdd, handleModalVisible} = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };

  return (
    <Modal
      destroyOnClose
      title="添加货物"
      className={themeStyle.formModal}
      visible={modalVisible}
      onOk={okHandle}
      width={800}
      onCancel={() => handleModalVisible()}
    >
      <div className={themeStyle.formModalBody}>
        <Row gutter={40}>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="货物名称">
              {form.getFieldDecorator('goodsName', {
                rules: [{required: true, message: '请输入货物名称！'}],
              })(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="货物数量">
              {form.getFieldDecorator('goodsNum', {
                rules: [{required: true, message: '请输入货物数量！'}],
              })(<InputNumber style={{width: '100%'}} placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="单位">
              {form.getFieldDecorator('unit', {
                rules: [{required: true, message: '请输入单位！'}],
              })(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="卸货车车牌">
              {form.getFieldDecorator('unloadCar', {
                rules: [{required: true, message: '请输入卸货车车牌！'}],
              })(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="卸货时间">
              {form.getFieldDecorator('unloadDate', {
                rules: [{required: true, message: '请选择卸货时间！'}],
              })(<DatePicker style={{width: '100%'}} showTime placeholder="请选择"/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="卸货人">
              {form.getFieldDecorator('unloadMan', {
                rules: [{required: true, message: '请输入卸货人！'}],
              })(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="卸货人联系方式">
              {form.getFieldDecorator('unloadTel', {
                rules: [
                  {
                    required: true,
                    validator: checkPhone,
                  },
                ],
              })(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="证件类型">
              {form.getFieldDecorator('cardType', {
                rules: [{required: true, message: '请选择证件类型！'}],
              })(
                <Select style={{width: '100%'}} placeholder="请选择">
                  {cardType.map((item, index) => (
                    <Option key={index} value={index + 1}>
                      {item}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="卸货人证件号码">
              {form.getFieldDecorator('unloadManCardNo', {
                rules: [{required: true, message: '请输入卸货人证件号码！'}],
              })(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="货物处理状态">
              {form.getFieldDecorator('status', {
                rules: [{required: true, message: '请选择货物处理状态！'}],
              })(
                <Select style={{width: '100%'}} placeholder="请选择">
                  {statusMap.map((item, index) => (
                    <Option key={index} value={index + 1}>
                      {item}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>
      </div>
    </Modal>
  );
});

const UpdateForm = Form.create()(props => {
  const {modalVisible, form, handleUpdate, handleModalVisible, detail} = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleUpdate(fieldsValue);
    });
  };

  return (
    <Modal
      destroyOnClose
      title="编辑货物"
      width={800}
      className={themeStyle.formModal}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <div className={themeStyle.formModalBody}>
        <Row gutter={40}>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="货物名称">
              {form.getFieldDecorator('goodsName', {
                initialValue: detail.goodsName,
                rules: [{required: true, message: '请输入货物名称！'}],
              })(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="货物数量">
              {form.getFieldDecorator('goodsNum', {
                initialValue: detail.goodsNum,
                rules: [{required: true, message: '请输入货物数量！'}],
              })(<InputNumber style={{width: '100%'}} placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="单位">
              {form.getFieldDecorator('unit', {
                initialValue: detail.unit,
                rules: [{required: true, message: '请输入单位！'}],
              })(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="卸货车车牌">
              {form.getFieldDecorator('unloadCar', {
                initialValue: detail.unloadCar,
                rules: [{required: true, message: '请输入卸货车车牌！'}],
              })(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="卸货时间">
              {form.getFieldDecorator('unloadDate', {
                initialValue: moment(new Date(detail.unloadDate), 'YYYY-MM-DD HH:mm:ss'),
                rules: [{required: true, message: '请选择卸货时间！'}],
              })(<DatePicker style={{width: '100%'}} showTime placeholder="请选择"/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="卸货人">
              {form.getFieldDecorator('unloadMan', {
                initialValue: detail.unloadMan,
                rules: [{required: true, message: '请输入卸货人！'}],
              })(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="卸货人联系方式">
              {form.getFieldDecorator('unloadTel', {
                initialValue: detail.unloadTel,
                rules: [
                  {
                    required: true,
                    validator: checkPhone,
                  },
                ],
              })(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="证件类型">
              {form.getFieldDecorator('cardType', {
                initialValue: detail.cardType,
                rules: [{required: true, message: '请选择证件类型！'}],
              })(
                <Select style={{width: '100%'}} placeholder="请选择">
                  {cardType.map((item, index) => (
                    <Option key={index} value={index + 1}>
                      {item}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="卸货人证件号码">
              {form.getFieldDecorator('unloadManCardNo', {
                initialValue: detail.unloadManCardNo,
                rules: [{required: true, message: '请输入卸货人证件号码！'}],
              })(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="货物处理状态">
              {form.getFieldDecorator('status', {
                initialValue: detail.status,
                rules: [{required: true, message: '请选择货物处理状态！'}],
              })(
                <Select style={{width: '100%'}} placeholder="请选择">
                  {statusMap.map((item, index) => (
                    <Option key={index} value={index + 1}>
                      {item}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>
      </div>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({Site, loading}) => ({
  Site,
  loading: loading.models.Site,
}))
@Form.create()
class GoodsModal extends PureComponent {
  static defaultProps = {
    handleModalVisible: () => {
    },
  };

  state = {
    createModalVisible: false,
    updateModalVisible: false,
    detail: {},
    baseQuery: {},
    selectedRows: [],
    formValues: [],
    pageBean: {
      page: 1,
      pageSize: 10,
      showTotal: true,
    },
  };

  columns = [
    {
      title: '货物名称',
      dataIndex: 'goodsName',
    },
    {
      title: '货物数量',
      dataIndex: 'goodsNum',
    },
    {
      title: '单位',
      dataIndex: 'unit',
    },
    {
      title: '货物处理状态',
      dataIndex: 'status',
      render: val => statusMap[parseInt(val) - 1],
    },
    {
      title: '卸货车车牌',
      dataIndex: 'unloadCar',
    },
    {
      title: '卸货时间',
      dataIndex: 'unloadDate',
      render: val => moment(val).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '卸货人',
      dataIndex: 'unloadMan',
    },
    {
      title: '卸货人联系方式',
      dataIndex: 'unloadTel',
    },
    {
      title: '证件类型',
      dataIndex: 'cardType',
      render: val => cardType[parseInt(val) - 1],
    },
    {
      title: '卸货人证件号码',
      dataIndex: 'unloadManCardNo',
    },
    {
      title: '操作',
      width: 100,
      render: (text, record) => (
        <Fragment>
          <Tooltip placement="left" title="编辑">
            <Button
              onClick={() => this.showUpdateModal(record)}
              type="primary"
              shape="circle"
              icon="edit"
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
    const {unloadYardID} = this.props;
    this.setState(
      {
        baseQuery: {
          group: 'main',
          hasInitValue: false,
          operation: 'EQUAL',
          property: 'yardId',
          relation: 'AND',
          value: unloadYardID,
        },
      },
      () => {
        const {baseQuery, pageBean} = this.state;
        this.getList({pageBean, querys: [baseQuery]});
      },
    );
  }

  dataDel = params => {
    this.delUtil(params);
  };

  batchDel = () => {
    const {selectedRows} = this.state;
    if (!selectedRows) return;
    const self = this;
    Modal.confirm({
      title: '批量删除',
      content: '您确定要批量删除吗?',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        self.delUtil(selectedRows.map(item => item.id).join());
      },
      onCancel() {
      },
    });
  };

  delUtil = ids => {
    const {dispatch} = this.props;
    dispatch({
      type: 'Site/deleteGoods',
      payload: {ids},
      callback: () => {
        this.getList();
        this.setState({selectedRow: []});
      },
    });
  };

  showUpdateModal = record => {
    this.setState({detail: record}, () => {
      this.handleUpdateModalVisible(true);
    });
  };

  getList = params => {
    const {dispatch} = this.props;
    dispatch({
      type: 'Site/getUnloadGoods',
      payload: params,
    });
  };

  handleCreateModalVisible = flag => {
    this.setState({createModalVisible: !!flag});
  };

  handleUpdateModalVisible = flag => {
    this.setState({updateModalVisible: !!flag});
    if (!!!flag) {
      this.setState({detail: {}});
    }
  };

  handleFormReset = () => {
    const {form} = this.props;
    const {pageBean, baseQuery} = this.state;
    form.resetFields();
    this.setState({
      formValues: [],
      selectedRows: [],
    });
    this.getList({pageBean, querys: [baseQuery]});
  };

  handleSearch = e => {
    e.preventDefault();
    const {form} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const {pageBean, baseQuery} = this.state;
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
            operation: 'LIKE',
            relation: 'OR',
          }
          : '';
      });
      const conditionFilter = condition.filter(item => item);
      this.setState({
        formValues: conditionFilter,
      });
      this.getList({pageBean, querys: [baseQuery].concat(conditionFilter)});
    });
  };

  handleAdd = fields => {
    const {dispatch, unloadYardID} = this.props;
    const {baseQuery, pageBean} = this.state;
    fields.yardId = unloadYardID;
    dispatch({
      type: 'Site/addGoods',
      payload: fields,
      callback: () => {
        message.success('添加成功');
        setTimeout(() => {
          this.getList({pageBean, querys: [baseQuery]});
          this.handleCreateModalVisible();
        }, 500);
      },
    });
  };

  handleUpdate = fields => {
    const {dispatch} = this.props;
    const {detail, baseQuery, pageBean, formValues} = this.state;
    const newData = JSON.parse(JSON.stringify(detail));
    const keys = Object.keys(fields);

    for (let i in keys) {
      newData[keys[i]] = fields[keys[i]];
    }

    this.setState({detail: newData});

    dispatch({
      type: 'Site/updateGoods',
      payload: newData,
      callback: () => {
        message.success('编辑成功');
        setTimeout(() => {
          this.getList({pageBean, querys: [baseQuery].concat(formValues)});
          this.handleUpdateModalVisible();
        }, 500);
      },
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const {formValues, baseQuery} = this.state;
    const params = {
      pageBean: {
        page: pagination.current,
        pageSize: pagination.pageSize,
        showTotal: true,
      },
      querys: [baseQuery].concat(formValues),
    };
    this.getList(params);
  };

  renderSimpleForm() {
    const {
      form: {getFieldDecorator},
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{md: 8, lg: 16, xl: 32}}>
          <Col md={5} sm={24}>
            <FormItem>{getFieldDecorator('goodsName')(<Input addonBefore="货物名称"/>)}</FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('unloadCar')(<Input addonBefore="卸货车车牌"/>)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem>{getFieldDecorator('unloadMan')(<Input addonBefore="卸货人"/>)}</FormItem>
          </Col>
          <Col md={3} sm={24}>
  <span className={styles.submitButtons}>
  <Button type="primary" htmlType="submit">
  查询
  </Button>
  <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>
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
      Site: {unloadGoods},
      modalVisible,
      handleModalVisible,
      loading,
    } = this.props;
    const {createModalVisible, updateModalVisible, detail, selectedRows} = this.state;
    const createMethods = {
      handleModalVisible: this.handleCreateModalVisible,
      handleAdd: this.handleAdd,
    };
    const updateMethods = {
      handleModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
      detail: detail,
    };
    return (
      <Fragment>
        <Modal
          destroyOnClose
          title="货物"
          visible={modalVisible}
          className={themeStyle.myModal + ' ' + themeStyle.modalbody}
          onCancel={() => handleModalVisible()}
          width="80%"
          footer={null}
        >
          <div className={themeStyle.detailMsg}>
            <div style={{padding: 20}}>
              <div className={styles.tableList}>
                <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
                <div className={styles.tableListOperator}>
                  <Button
                    icon="plus"
                    type="primary"
                    onClick={() => this.handleCreateModalVisible(true)}
                  >
                    新建
                  </Button>
                  {selectedRows.length > 0 && (
                    <span>
                  <Button type="danger" onClick={() => this.batchDel()}>
                    批量删除
                  </Button>
                </span>
                  )}
                </div>
                <StandardTable
                  tableAlert={true}
                  selectedRows={selectedRows}
                  loading={loading}
                  size="middle"
                  data={unloadGoods}
                  columns={this.columns}
                  onSelectRow={this.handleSelectRows}
                  onChange={this.handleStandardTableChange}
                />
              </div>
            </div>
          </div>
        </Modal>
        {modalVisible ? <CreateForm {...createMethods} modalVisible={createModalVisible}/> : null}
        {updateModalVisible && JSON.stringify(detail) !== '{}' ? (
          <UpdateForm {...updateMethods} modalVisible={updateModalVisible}/>
        ) : null}
      </Fragment>
    );
  }
}

export default GoodsModal;
