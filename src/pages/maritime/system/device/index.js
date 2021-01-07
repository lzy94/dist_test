import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  Modal,
  message,
  Divider, Tooltip, Popconfirm,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PortModal from '../../Component/PortModal';

import styles from '../../../style/style.less';
import themeStyle from '@/pages/style/theme.less';
import publicCss from '@/pages/style/public.less';

const FormItem = Form.Item;
const { Option } = Select;

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, loading, cateData, handlePortModalVisible, portMsg, cateChange } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleAdd(fieldsValue, () => form.resetFields());
    });
  };
  return (
    <Modal
      destroyOnClose
      title="添加港口"
      className={themeStyle.formModal}
      visible={modalVisible}
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
        <FormItem label="设备名称">
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入设备名称' }],
          })(<Input placeholder="请输入"/>)}
        </FormItem>
        <FormItem label="设备编号">
          {form.getFieldDecorator('code', {
            rules: [{ required: true, message: '请输入设备编号' }],
          })(<Input placeholder="请输入"/>)}
        </FormItem>
        <FormItem label="设备类型">
          {form.getFieldDecorator('categoryId', {
            rules: [{ required: true, message: '请选择设备类型' }],
          })(
            <Select style={{ width: '100%' }} placeholder="请选择" onChange={cateChange}>
              {cateData.list.map((item, i) => <Option value={item.id_} key={i}
              >{item.categoryName}</Option>)}
            </Select>,
          )}
        </FormItem>
        <FormItem label="所属港口">
          {form.getFieldDecorator('portName', {
            initialValue: portMsg.portName,
            rules: [{ required: true, message: '请选择所属港口' }],
          })(<Input readOnly placeholder="请选择" onClick={() => handlePortModalVisible(true)}/>)}
        </FormItem>
      </div>
    </Modal>
  );
});


const UpdateForm = Form.create()(props => {
  const { modalVisible, form, handleUpdate, handleModalVisible, loading, detail, cateData, portMsg, handlePortModalVisible, cateChange } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleUpdate(fieldsValue, () => form.resetFields());
    });
  };
  return (
    <Modal
      destroyOnClose
      title="编辑港口"
      className={themeStyle.formModal}
      visible={modalVisible}
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
        <FormItem label="设备名称">
          {form.getFieldDecorator('name', {
            initialValue: detail.name,
            rules: [{ required: true, message: '请输入设备名称' }],
          })(<Input placeholder="请输入"/>)}
        </FormItem>
        <FormItem label="设备编号">
          {form.getFieldDecorator('code', {
            initialValue: detail.code,
            rules: [{ required: true, message: '请输入设备编号' }],
          })(<Input placeholder="请输入"/>)}
        </FormItem>
        <FormItem label="设备类型">
          {form.getFieldDecorator('categoryId', {
            initialValue: detail.categoryId,
            rules: [{ required: true, message: '请选择设备类型' }],
          })(
            <Select style={{ width: '100%' }} placeholder="请选择" onChange={cateChange}>
              {cateData.list.map((item, i) => <Option value={item.id_} key={i}>{item.categoryName}</Option>)}
            </Select>,
          )}
        </FormItem>
        <FormItem label="所属港口">
          {form.getFieldDecorator('portName', {
            initialValue: portMsg.portName,
            rules: [{ required: true, message: '请选择所属港口' }],
          })(<Input readOnly placeholder="请选择" onClick={() => handlePortModalVisible(true)}/>)}
        </FormItem>
      </div>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ MaritimeDevice, loading }) => ({
  MaritimeDevice,
  loading: loading.models.MaritimeDevice,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    formValues: [],
    detail: {},
    portMsg: {},
    categoryName: '',
    portVisible: false,
    pageBean: { 'page': 1, 'pageSize': 10, 'showTotal': true },
  };

  columns = [
    {
      title: '设备名称',
      dataIndex: 'name',
    },
    {
      title: '设备编号',
      dataIndex: 'code',
    },
    {
      title: '设备类型',
      dataIndex: 'categoryName',
    },
    {
      title: '所属港口',
      dataIndex: 'portName',
    },
    {
      title: '操作',
      width: 100,
      render: (text, record) => (
        <Fragment>
          <Tooltip placement="left" title='编辑'>
            <Button
              onClick={() => this.editData(record)}
              type="primary"
              shape="circle"
              icon='edit'
              size="small"
            />
          </Tooltip>
          <Divider type="vertical"/>
          <Popconfirm
            title="是否删除数据?"
            onConfirm={() => this.dataDel(record.id_)}
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
    this.getCateList();
    this.getList({ pageBean });
  }


  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'MaritimeDevice/fetch',
      payload: params,
    });
  };

  getCateList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'MaritimeDevice/fetchCate',
    });
  };

  dataDel = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'MaritimeDevice/remove',
      payload: { id },
      callback: () => {
        message.success('删除成功');
        this.getList({ pageBean: this.state.pageBean });
      },
    });
  };

  editData = detail => {
    this.setState({
      detail,
      categoryName: detail.categoryName,
      portMsg: {
        portId: detail.portId,
        portName: detail.portName,
      },
    }, () => this.handleUpdateModalVisible(true));
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
        name: fieldsValue.sbmc,
        code: fieldsValue.sbbm,
        categoryId: fieldsValue.sblx,
        portName: fieldsValue.portName,
      };
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
      this.getList({ pageBean, querys: conditionFilter });
    });
  };

  selectData = data => {
    this.setState({
      portMsg: {
        portId: data.id,
        portName: data.portName,
      },
    });
  };

  handlePortModalVisible = flag => {
    this.setState({ portVisible: !!flag });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
    if (!!!flag) {
      this.setState({ portMsg: {}, categoryName: '' });
    }
  };

  handleUpdateModalVisible = flag => {
    this.setState({
      updateModalVisible: !!flag,
    });
    if (!!!flag) {
      this.setState({ detail: {}, portMsg: {}, categoryName: '' });
    }
  };

  cateChange = (value, option) => {
    this.setState({
      categoryName: option.props.children,
    });
  };

  handleAdd = (fields, callback) => {
    const { dispatch } = this.props;
    const { pageBean, categoryName, portMsg } = this.state;
    fields.categoryName = categoryName;
    fields.portName = portMsg.portName;
    fields.portId = portMsg.portId;
    dispatch({
      type: 'MaritimeDevice/add',
      payload: fields,
      callback: () => {
        message.success('添加成功');
        this.getList({ pageBean });
        this.handleModalVisible();
        callback();
      },
    });
  };

  handleUpdate = (fields, callback) => {
    const { dispatch } = this.props;
    const { detail, pageBean, categoryName, portMsg } = this.state;
    const newDetail = JSON.parse(JSON.stringify(detail));
    fields.categoryName = categoryName;
    fields.portName = portMsg.portName;
    fields.portId = portMsg.portId;

    for (let i in fields) {
      newDetail[i] = fields[i];
    }
    this.setState({ detail: newDetail });
    dispatch({
      type: 'MaritimeDevice/update',
      payload: newDetail,
      callback: () => {
        message.success('编辑成功');
        this.handleUpdateModalVisible();
        this.getList({ pageBean });
        callback();
      },
    });
  };


  renderSimpleForm() {
    const {
      MaritimeDevice: { cateData },
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 16, xl: 32 }}>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('sbmc')(<Input addonBefore="设备名称" placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('sbbm')(<Input addonBefore="设备编码" placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <div className={publicCss.inputMain}>
              <span style={{ width: '80px', lineHeight: '30px', height: '32px' }}
                    className="ant-input-group-addon">设备类型</span>
              <FormItem style={{ flex: 1 }}>
                {getFieldDecorator('sblx')(
                  <Select placeholder="请选择" style={{ width: '100%' }}>
                    {cateData.list.map((item, i) => <Option value={item.id_} key={i}>{item.categoryName}</Option>)}
                  </Select>,
                )}
              </FormItem>
            </div>
          </Col>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('sugk')(<Input addonBefore="所属港口" placeholder="请输入"/>)}
            </FormItem>
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
      MaritimeDevice: { data, cateData },
      loading,
    } = this.props;
    const { modalVisible, updateModalVisible, detail, portVisible, portMsg } = this.state;

    const parentMethods = {
      loading,
      cateData,
      portMsg,
      cateChange: this.cateChange,
      handlePortModalVisible: this.handlePortModalVisible,
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      loading,
      detail,
      cateData,
      portMsg,
      cateChange: this.cateChange,
      handlePortModalVisible: this.handlePortModalVisible,
      handleModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
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
        {modalVisible ?
          <CreateForm {...parentMethods} modalVisible={modalVisible}/>
          : null}
        {updateModalVisible && Object.keys(detail).length ?
          <UpdateForm {...updateMethods} modalVisible={updateModalVisible}/> : null}
        {portVisible ? <PortModal
          selectData={this.selectData}
          handleModalVisible={this.handlePortModalVisible}
          modalVisible={portVisible}
        /> : null}
      </Fragment>
    );
  }
}

export default TableList;
