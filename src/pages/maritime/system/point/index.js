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
  InputNumber,
  message,
  TreeSelect,
  Divider,
  Tooltip,
  Popconfirm,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import MonitorModal from '@/pages/conserve/Component/MonitorModal';

import styles from '../../../style/style.less';
import themeStyle from '@/pages/style/theme.less';
import LocationMap from '@/pages/conserve/Component/LocationMap';
import publicCss from '@/pages/style/public.less';

const FormItem = Form.Item;

const CreateForm = Form.create()(props => {
  const {
    modalVisible,
    form,
    handleAdd,
    handleModalVisible,
    treeList,
    parentAddress,
    treeSelectChange,
    handleMonitorVisible,
    minitors,
    loading,
  } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleAdd(fieldsValue, () => form.resetFields());
    });
  };

  return (
    <Modal
      destroyOnClose
      title="添加点位"
      className={themeStyle.formModal}
      visible={modalVisible}
      onOk={okHandle}
      width={700}
      onCancel={() => handleModalVisible()}
      footer={[
        <Button key="back" onClick={() => handleModalVisible()}>
          取消
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={okHandle}>
          确定
        </Button>,
      ]}
    >
      <div className={themeStyle.formModalBody}>
        <Row gutter={40}>
          <Col md={12} sm={24}>
            <FormItem label="点位编号">
              {form.getFieldDecorator('ponitCode', {
                rules: [{ required: true, message: '请输入点位编号！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="点位名称">
              {form.getFieldDecorator('ponitName', {
                rules: [{ required: true, message: '请输入点位名称！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="行政区域">
              {form.getFieldDecorator('organCode', {
                rules: [{ required: true, message: '请选择行政区域！' }],
              })(
                <TreeSelect
                  treeData={treeList}
                  style={{ width: '100%' }}
                  placeholder="请选择"
                  onChange={treeSelectChange}
                />,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="保障水位(m)">
              {form.getFieldDecorator('normalHigh', {
                rules: [{ required: true, message: '请输入正常水位！' }],
              })(<InputNumber style={{ width: '100%' }} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="预警水位(m)">
              {form.getFieldDecorator('warningHigh', {
                rules: [{ required: true, message: '请输入预警水位高度！' }],
              })(<InputNumber style={{ width: '100%' }} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="监控点位">
              {form.getFieldDecorator('mediaNo', {
                initialValue: minitors.minitorPointName,
                rules: [{ required: true, message: '请选择监控点位！' }],
              })(
                <Input placeholder="请选择" readOnly onClick={() => handleMonitorVisible(true)} />,
              )}
            </FormItem>
          </Col>
          <Col md={24} sm={24}>
            <LocationMap parentAddress={parentAddress} />
          </Col>
        </Row>
      </div>
    </Modal>
  );
});

const UpdateForm = Form.create()(props => {
  const {
    modalVisible,
    form,
    handleUpdate,
    handleModalVisible,
    treeList,
    parentAddress,
    treeSelectChange,
    detail,
    lnglat,
    handleMonitorVisible,
    minitors,
    loading,
  } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleUpdate(fieldsValue, () => form.resetFields());
    });
  };
  return (
    <Modal
      destroyOnClose
      title="编辑点位"
      className={themeStyle.formModal}
      visible={modalVisible}
      onOk={okHandle}
      width={700}
      onCancel={() => handleModalVisible()}
      footer={[
        <Button key="back" onClick={() => handleModalVisible()}>
          取消
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={okHandle}>
          确定
        </Button>,
      ]}
    >
      <div className={themeStyle.formModalBody}>
        <Row gutter={40}>
          <Col md={12} sm={24}>
            <FormItem label="点位编号">
              {form.getFieldDecorator('ponitCode', {
                initialValue: detail.ponitCode,
                rules: [{ required: true, message: '请输入点位编号！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="点位名称">
              {form.getFieldDecorator('ponitName', {
                initialValue: detail.ponitName,
                rules: [{ required: true, message: '请输入点位名称！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="行政区域">
              {form.getFieldDecorator('organCode', {
                initialValue: detail.organCode,
                rules: [{ required: true, message: '请选择行政区域！' }],
              })(
                <TreeSelect
                  treeData={treeList}
                  style={{ width: '100%' }}
                  placeholder="请选择"
                  onChange={treeSelectChange}
                />,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="保障水位(m)">
              {form.getFieldDecorator('normalHigh', {
                initialValue: detail.normalHigh,
                rules: [{ required: true, message: '请输入正常水位！' }],
              })(<InputNumber style={{ width: '100%' }} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="预警水位(m)">
              {form.getFieldDecorator('warningHigh', {
                initialValue: detail.warningHigh,
                rules: [{ required: true, message: '请输入预警水位高度！' }],
              })(<InputNumber style={{ width: '100%' }} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="监控点位">
              {form.getFieldDecorator('mediaNo', {
                initialValue: minitors.minitorPointName,
                rules: [{ required: true, message: '请选择监控点位！' }],
              })(
                <Input placeholder="请选择" readOnly onClick={() => handleMonitorVisible(true)} />,
              )}
            </FormItem>
          </Col>
          <Col md={24} sm={24}>
            <LocationMap
              lngLat={{
                longitude: lnglat[0],
                latitude: lnglat[1],
              }}
              address={detail.addr}
              parentAddress={parentAddress}
            />
          </Col>
        </Row>
      </div>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ system, MaritimePoint, loading }) => ({
  system,
  MaritimePoint,
  loading: loading.models.MaritimePoint,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    monitorVisible: false,
    modalVisible: false,
    updateModalVisible: false,
    formValues: [],
    address: '',
    lnglat: [],
    organName: '',
    detail: {},
    minitors: {},
    pageBean: {
      page: 1,
      pageSize: 10,
      showTotal: true,
    },
  };

  columns = [
    {
      title: '点位编号',
      dataIndex: 'ponitCode',
    },
    {
      title: '点位名称',
      dataIndex: 'ponitName',
    },
    {
      title: '监测地址',
      dataIndex: 'addr',
    },
    {
      title: '保障水位(m)',
      dataIndex: 'normalHigh',
    },
    {
      title: '预警水位(m)',
      dataIndex: 'warningHigh',
    },
    {
      title: '行政区域',
      dataIndex: 'organName',
    },
    {
      title: '操作',
      width: 100,
      render: (text, record) => (
        <Fragment>
          <Tooltip placement="left" title="编辑">
            <Button
              onClick={() => this.editData(record)}
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
      type: 'MaritimePoint/fetch',
      payload: params,
    });
  };

  dataDel = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'MaritimePoint/remove',
      payload: { id },
      callback: () => {
        message.success('删除成功');
        this.getList({ pageBean: this.state.pageBean });
      },
    });
  };

  editData = detail => {
    const mediaNo = detail.mediaNo ? detail.mediaNo.split('_') : [];
    this.setState(
      {
        detail,
        minitors: {
          minitorPointID: mediaNo[1],
          minitorPointName: mediaNo[0],
        },
        address: detail.addr,
        organName: detail.organName,
        lnglat: detail.longitudeandlatitude ? detail.longitudeandlatitude.split(',') : [0, 0],
      },
      () => this.handleUpdateModalVisible(true),
    );
  };

  parentAddress = (address, lnglat) => {
    this.setState({ address, lnglat });
  };

  selectData = data => {
    this.setState({
      minitors: {
        minitorPointID: data.id_,
        minitorPointName: data.pointName,
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
        addr: fieldsValue.address,
        organCode: fieldsValue.code,
      };

      const objKeys = Object.keys(values);
      const condition = objKeys.map(item => {
        return values[item]
          ? {
              property: item,
              value: values[item],
              group: 'main',
              operation: item === 'organCode' ? 'EQUAL' : 'LIKE',
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

  handleMonitorVisible = flag => {
    this.setState({
      monitorVisible: !!flag,
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
    if (!flag) {
      this.setState({ minitors: {} });
    }
  };

  handleUpdateModalVisible = flag => {
    this.setState({
      updateModalVisible: !!flag,
    });
    if (!flag) {
      this.setState({ detail: {}, minitors: {} });
    }
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    const { address, lnglat, pageBean, organName, minitors } = this.state;
    fields.addr = address;
    fields.longitudeandlatitude = lnglat.join();
    fields.organName = organName;
    fields.mediaNo = `${minitors.minitorPointName}_${minitors.minitorPointID}`;
    dispatch({
      type: 'MaritimePoint/add',
      payload: fields,
      callback: () => {
        message.success('添加成功');
        this.handleModalVisible();
        this.getList({ pageBean });
      },
    });
  };

  treeSelectChange = (value, label) => {
    this.setState({ organName: label[0] });
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    const { address, lnglat, pageBean, organName, detail, minitors } = this.state;
    const newDetail = JSON.parse(JSON.stringify(detail));
    fields.addr = address;
    fields.longitudeandlatitude = lnglat.join();
    fields.organName = organName;
    fields.mediaNo = `${minitors.minitorPointName}_${minitors.minitorPointID}`;
    const keys = Object.keys(fields);
    for (let i = 0; i < keys.length; i += 1) {
      newDetail[keys[i]] = fields[keys[i]];
    }
    this.setState({ detail: newDetail });
    dispatch({
      type: 'MaritimePoint/update',
      payload: newDetail,
      callback: () => {
        message.success('编辑成功');
        this.handleUpdateModalVisible();
        this.getList({ pageBean });
      },
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      system: { treeList },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 16, xl: 16 }}>
          <Col md={6} sm={24}>
            <FormItem>
              {getFieldDecorator('address')(<Input addonBefore="地址" placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <div className={publicCss.inputMain}>
              <span
                style={{ width: '80px', lineHeight: '30px', height: '32px' }}
                className="ant-input-group-addon"
              >
                区域
              </span>
              <FormItem style={{ flex: 1 }}>
                {getFieldDecorator('code')(
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
      MaritimePoint: { data },
      system: { treeList },
      loading,
    } = this.props;
    const {
      monitorVisible,
      modalVisible,
      updateModalVisible,
      detail,
      address,
      lnglat,
      minitors,
    } = this.state;
    const parentMethods = {
      treeList,
      minitors,
      loading,
      treeSelectChange: this.treeSelectChange,
      parentAddress: this.parentAddress,
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      handleMonitorVisible: this.handleMonitorVisible,
    };
    const updateMethods = {
      treeList,
      detail,
      address,
      lnglat,
      minitors,
      loading,
      treeSelectChange: this.treeSelectChange,
      parentAddress: this.parentAddress,
      handleModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
      handleMonitorVisible: this.handleMonitorVisible,
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
            </div>
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
        {modalVisible ? <CreateForm {...parentMethods} modalVisible={modalVisible} /> : null}
        {updateModalVisible && Object.keys(detail).length ? (
          <UpdateForm {...updateMethods} modalVisible={updateModalVisible} />
        ) : null}
        {monitorVisible ? (
          <MonitorModal
            modalVisible={monitorVisible}
            selectData={this.selectData}
            handleModalVisible={this.handleMonitorVisible}
          />
        ) : null}
      </Fragment>
    );
  }
}

export default TableList;
