import React, {Fragment, PureComponent} from 'react';
import {Button, Modal, Form, message, InputNumber, Input, Tooltip, Divider, Popconfirm, Radio, Row, Col} from "antd";
import styles from "@/pages/style/style.less";
import StandardTable from "@/components/StandardTable";
import {connect} from "dva";
import GoodsModal from "./goods";
import themeStyle from "@/pages/style/theme.less";

const FormItem = Form.Item;


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
      title="添加卸货场地"
      className={themeStyle.formModal}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      width={800}
    >
      <div className={themeStyle.formModalBody}>
        <Row gutter={40}>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="场地名称">
              {form.getFieldDecorator('yardName', {
                rules: [{required: true, message: '请输入场地名称！'}],
              })(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="场地编号">
              {form.getFieldDecorator('yardCode', {
                rules: [{required: true, message: '请输入场地编号！'}],
              })(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="场地位置">
              {form.getFieldDecorator('yardAddr', {
                rules: [{required: true, message: '请输入位置！'}],
              })(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="面积/平方米">
              {form.getFieldDecorator('area', {
                rules: [{required: true, message: '请输入面积/平方米！'}],
              })(<InputNumber style={{width: '100%'}} placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="经度">
              {form.getFieldDecorator('longitude', {
                rules: [{required: true, message: '请输入经度！'}],
              })(<InputNumber style={{width: '100%'}} placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="纬度">
              {form.getFieldDecorator('latitude', {
                rules: [{required: true, message: '请输入纬度！'}],
              })(<InputNumber style={{width: '100%'}} placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="状态">
              {form.getFieldDecorator('status', {
                initialValue: 1,
                rules: [{required: true, message: '请选择状态！'}],
              })(
                <Radio.Group style={{width: '100%'}}>
                  <Radio value={1}>正常</Radio>
                  <Radio value={0}>禁用</Radio>
                </Radio.Group>
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
      title="编辑卸货场地"
      className={themeStyle.formModal}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      width={800}
    >
      <div className={themeStyle.formModalBody}>
        <Row gutter={40}>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="场地名称">
              {form.getFieldDecorator('yardName', {
                initialValue: detail.yardName,
                rules: [{required: true, message: '请输入场地名称！'}],
              })(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="场地编号">
              {form.getFieldDecorator('yardCode', {
                initialValue: detail.yardCode,
                rules: [{required: true, message: '请输入场地编号！'}],
              })(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="场地位置">
              {form.getFieldDecorator('yardAddr', {
                initialValue: detail.yardAddr,
                rules: [{required: true, message: '请输入位置！'}],
              })(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="面积/平方米">
              {form.getFieldDecorator('area', {
                initialValue: detail.area,
                rules: [{required: true, message: '请输入面积/平方米！'}],
              })(<InputNumber style={{width: '100%'}} placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="经度">
              {form.getFieldDecorator('longitude', {
                initialValue: detail.longitude,
                rules: [{required: true, message: '请输入经度！'}],
              })(<InputNumber style={{width: '100%'}} placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="纬度">
              {form.getFieldDecorator('latitude', {
                initialValue: detail.latitude,
                rules: [{required: true, message: '请输入纬度！'}],
              })(<InputNumber style={{width: '100%'}} placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="状态">
              {form.getFieldDecorator('status', {
                initialValue: detail.status,
                rules: [{required: true, message: '请选择状态！'}],
              })(
                <Radio.Group style={{width: '100%'}}>
                  <Radio value={1}>正常</Radio>
                  <Radio value={0}>禁用</Radio>
                </Radio.Group>
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
class UnloadYardModal extends PureComponent {
  static defaultProps = {
    handleModalVisible: () => {
    }
  };

  state = {
    createModalVisible: false,
    updateModalVisible: false,
    goodsModalVisible: false,
    unloadYardID: 0,
    detail: {}
  };

  columns = [
    {
      title: '场地名称',
      dataIndex: 'yardName'
    },
    {
      title: '场地编号',
      dataIndex: 'yardCode'
    },
    {
      title: '面积/平方米',
      dataIndex: 'area'
    },
    {
      title: '经度',
      dataIndex: 'longitude'
    },
    {
      title: '纬度',
      dataIndex: 'latitude'
    },
    {
      title: '场地位置',
      dataIndex: 'yardAddr'
    },
    {
      title: '操作',
      width: 130,
      render: (text, record) => (
        <Fragment>
          <Tooltip placement="left" title='编辑'>
            <Button onClick={() => this.showUpdateModal(record)} type='primary' shape="circle"
                    icon='edit' size='small'/></Tooltip>
          <Divider type="vertical"/>
          <Tooltip placement="left" title='货物列表'>
            <Button onClick={() => this.showGoodsModal(record.id)} type='primary' shape="circle"
                    icon='table' size='small'/></Tooltip>
          <Divider type="vertical"/>
          <Popconfirm
            title="是否删除数据?"
            onConfirm={() => this.dataDel(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Tooltip placement="left" title="删除">
              <Button type="danger" shape="circle" icon="delete" size='small'/>
            </Tooltip>
          </Popconfirm>
        </Fragment>
      )
    }];

  componentDidMount() {
    this.getList();
  }

  dataDel = id => {
    const {dispatch} = this.props;
    dispatch({
      type: 'Site/deleteUnloadYard',
      payload: {id},
      callback: () => {
        this.getList();
      }
    })
  };

  showGoodsModal = id => {
    this.setState({unloadYardID: id})
    this.handleGoodsModalVisible(true);
  };


  showUpdateModal = record => {
    this.setState({detail: record}, () => {
      this.handleUpdateModalVisible(true);
    });
  };

  getList = () => {
    const {dispatch, siteID} = this.props;
    dispatch({
      type: 'Site/getUnloadYards',
      payload: {siteId: siteID}
    })
  };

  handleCreateModalVisible = flag => {
    this.setState({createModalVisible: !!flag})
  };

  handleUpdateModalVisible = flag => {
    this.setState({updateModalVisible: !!flag});
    if (!!!flag) {
      this.setState({detail: {}})
    }
  };

  handleGoodsModalVisible = flag => {
    this.setState({
      goodsModalVisible: !!flag
    })
  };

  handleAdd = fields => {
    const {dispatch, siteID} = this.props;
    fields.siteId = siteID;
    fields.status = 1;
    dispatch({
      type: 'Site/addUnloadYard',
      payload: fields,
      callback: () => {
        message.success('添加成功');
        setTimeout(() => {
          this.getList();
          this.handleCreateModalVisible();
        }, 500)
      }
    })
  };


  handleUpdate = fields => {
    const {dispatch} = this.props;
    const {detail} = this.state;
    const newData = JSON.parse(JSON.stringify(detail));
    const keys = Object.keys(fields);

    for (let i in keys) {
      newData[keys[i]] = fields[keys[i]];
    }

    this.setState({detail: newData});

    dispatch({
      type: 'Site/updateUnloadYard',
      payload: newData,
      callback: () => {
        message.success('编辑成功');
        setTimeout(() => {
          this.getList();
          this.handleUpdateModalVisible();
        }, 500)
      }
    })
  };

  render() {
    const {Site: {unloadYardsData}, modalVisible, handleModalVisible, loading} = this.props;
    const {createModalVisible, updateModalVisible, detail, goodsModalVisible, unloadYardID} = this.state;
    const createMethods = {
      handleModalVisible: this.handleCreateModalVisible,
      handleAdd: this.handleAdd
    };
    const updateMethods = {
      handleModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
      detail: detail
    };

    const goodsMethods = {
      handleModalVisible: this.handleGoodsModalVisible,
      modalVisible: goodsModalVisible,
      unloadYardID: unloadYardID
    };
    return (
      <Fragment>
        <Modal
          destroyOnClose
          title="卸货场地"
          visible={modalVisible}
          className={themeStyle.myModal + ' ' + themeStyle.modalbody}
          onCancel={() => handleModalVisible()}
          width={1100}
          footer={null}
        >
          <div className={themeStyle.detailMsg}>
            <div style={{padding: 20}}>
              <div className={styles.tableList}>
                <div className={styles.tableListOperator}>
                  <Button icon="plus" type="primary" onClick={() => this.handleCreateModalVisible(true)}>
                    新建
                  </Button>
                </div>
                <StandardTable
                  selectedRows={0}
                  rowSelection={null}
                  loading={loading}
                  size="middle"
                  data={unloadYardsData}
                  columns={this.columns}
                />
              </div>
            </div>
          </div>
        </Modal>
        {modalVisible ? <CreateForm {...createMethods} modalVisible={createModalVisible}/> : null}
        {updateModalVisible && (JSON.stringify(detail) !== "{}") ?
          <UpdateForm {...updateMethods} modalVisible={updateModalVisible}/> : null}

        {goodsModalVisible ? <GoodsModal {...goodsMethods} modalVisible={goodsModalVisible}/> : null}

      </Fragment>
    );
  }
}

export default UnloadYardModal;
