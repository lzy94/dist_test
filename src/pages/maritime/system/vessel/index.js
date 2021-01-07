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
  InputNumber,
  Modal,
  Upload,
  message,
  Divider,
  Tooltip,
  Popconfirm,
  Icon,
} from 'antd';
import StandardTable from '@/components/StandardTable';

import styles from '../../../style/style.less';
import themeStyle from '@/pages/style/theme.less';
import { checkPhone, getLocalStorage, imgUrl } from '@/utils/utils';

const FormItem = Form.Item;

const CreateForm = Form.create()(props => {
  const {
    modalVisible,
    form,
    handleAdd,
    handleModalVisible,
    loading,
    uploadConfig,
    fileList,
  } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleAdd(fieldsValue, () => form.resetFields());
    });
  };
  const uploadButton = (
    <div>
      <Icon type="plus" />
      <div className="ant-upload-text">请选择图片</div>
    </div>
  );
  return (
    <Modal
      destroyOnClose
      title="添加船只"
      className={themeStyle.formModal}
      visible={modalVisible}
      width={800}
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
            <FormItem label="船舶号">
              {form.getFieldDecorator('shipCode', {
                rules: [{ required: true, message: '请输入船舶号' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="船只型号">
              {form.getFieldDecorator('shipType', {
                rules: [{ required: true, message: '请输入船只型号' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="排水量">
              {form.getFieldDecorator('displacement', {
                rules: [{ required: true, message: '请输入排水量' }],
              })(<InputNumber min={1} style={{ width: '100%' }} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="吨位">
              {form.getFieldDecorator('tonnage', {
                rules: [{ required: true, message: '请输入吨位' }],
              })(<InputNumber min={1} style={{ width: '100%' }} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="船只所有人名称">
              {form.getFieldDecorator('shipLeader', {
                rules: [{ required: true, message: '请输入船只所有人名称' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="船只所有人联系方式">
              {form.getFieldDecorator('shipLeaderTel', {
                rules: [
                  {
                    required: true,
                    validator: checkPhone,
                  },
                ],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="运输证号">
              {form.getFieldDecorator('transportCode', {
                rules: [{ required: true, message: '请输入运输证号' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="经营范围">
              {form.getFieldDecorator('businessScope', {
                rules: [{ required: true, message: '请输入经营范围' }],
              })(<Input.TextArea placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={24} sm={24}>
            <FormItem label="船只图片">
              {form.getFieldDecorator('shipPhotos', {
                rules: [{ required: true, message: '请上传照片！' }],
              })(
                <Upload {...uploadConfig()} fileList={fileList}>
                  {fileList.length >= 3 ? null : uploadButton}
                </Upload>,
              )}
            </FormItem>
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
    loading,
    uploadConfig,
    fileList,
    detail,
  } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleUpdate(fieldsValue, () => form.resetFields());
    });
  };
  const uploadButton = (
    <div>
      <Icon type="plus" />
      <div className="ant-upload-text">请选择图片</div>
    </div>
  );
  return (
    <Modal
      destroyOnClose
      title="添加船只"
      className={themeStyle.formModal}
      visible={modalVisible}
      width={800}
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
            <FormItem label="船舶号">
              {form.getFieldDecorator('shipCode', {
                initialValue: detail.shipCode,
                rules: [{ required: true, message: '请输入船舶号' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="船只型号">
              {form.getFieldDecorator('shipType', {
                initialValue: detail.shipType,
                rules: [{ required: true, message: '请输入船只型号' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="排水量">
              {form.getFieldDecorator('displacement', {
                initialValue: detail.displacement,
                rules: [{ required: true, message: '请输入排水量' }],
              })(<InputNumber min={1} style={{ width: '100%' }} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="吨位">
              {form.getFieldDecorator('tonnage', {
                initialValue: detail.tonnage,
                rules: [{ required: true, message: '请输入吨位' }],
              })(<InputNumber min={1} style={{ width: '100%' }} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="船只所有人名称">
              {form.getFieldDecorator('shipLeader', {
                initialValue: detail.shipLeader,
                rules: [{ required: true, message: '请输入船只所有人名称' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="船只所有人联系方式">
              {form.getFieldDecorator('shipLeaderTel', {
                initialValue: detail.shipLeaderTel,
                rules: [
                  {
                    required: true,
                    validator: checkPhone,
                  },
                ],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="运输证号">
              {form.getFieldDecorator('transportCode', {
                initialValue: detail.transportCode,
                rules: [{ required: true, message: '请输入运输证号' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="经营范围">
              {form.getFieldDecorator('businessScope', {
                initialValue: detail.businessScope,
                rules: [{ required: true, message: '请输入经营范围' }],
              })(<Input.TextArea placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={24} sm={24}>
            <FormItem label="船只图片">
              {form.getFieldDecorator('shipPhotos', {
                initialValue: detail.shipPhotos,
                rules: [{ required: true, message: '请上传照片！' }],
              })(
                <Upload {...uploadConfig()} fileList={fileList}>
                  {fileList.length >= 3 ? null : uploadButton}
                </Upload>,
              )}
            </FormItem>
          </Col>
        </Row>
      </div>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ MaritimeVessel, loading }) => ({
  MaritimeVessel,
  loading: loading.models.MaritimeVessel,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    formValues: [],
    detail: {},
    fileList: [],
  };

  columns = [
    {
      title: '船舶号',
      dataIndex: 'shipCode',
    },
    {
      title: '船只所有人',
      dataIndex: 'shipLeader',
    },
    {
      title: '船只型号',
      dataIndex: 'shipType',
    },
    {
      title: '经营范围',
      dataIndex: 'businessScope',
    },
    {
      title: '运输证号',
      dataIndex: 'transportCode',
    },
    {
      title: '吨位',
      dataIndex: 'tonnage',
    },
    {
      title: '排水量',
      dataIndex: 'displacement',
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
      type: 'MaritimeVessel/fetch',
      payload: params,
    });
  };

  dataDel = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'MaritimeVessel/remove',
      payload: { id },
      callback: () => {
        message.success('删除成功');
        this.getList({ pageBean: this.state.pageBean });
      },
    });
  };

  editData = detail => {
    const imgs = detail.shipPhotos ? detail.shipPhotos.split(',') : [];
    const fileList = imgs.map((item, i) => ({
      uid: i,
      name: 'image.png',
      status: 'done',
      url: imgUrl + item,
      path: item,
    }));

    this.setState(
      {
        detail,
        fileList,
      },
      () => this.handleUpdateModalVisible(true),
    );
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
      const arr = [
        {
          property: 'shipType',
          value: fieldsValue.czxh,
          group: 'main',
          operation: 'LIKE',
          relation: 'AND',
        },
        {
          property: 'businessScope',
          value: fieldsValue.jyfw,
          group: 'main',
          operation: 'LIKE',
          relation: 'AND',
        },
        {
          property: 'tonnage',
          value: fieldsValue.dw,
          group: 'main',
          operation: 'EQUAL',
          relation: 'AND',
        },
        {
          property: 'displacement',
          value: fieldsValue.psl,
          group: 'main',
          operation: 'EQUAL',
          relation: 'AND',
        },
      ].filter(item => item.value);

      this.setState({
        formValues: arr,
      });
      this.getList({ pageBean: this.state.pageBean, querys: arr });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
    if (!flag) {
      this.setState({ fileList: [] });
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

  handleAdd = (fields, callback) => {
    const { dispatch } = this.props;
    const { pageBean, fileList } = this.state;
    if (!fileList.length) {
      return message.error('请选择文件');
    }
    const paths = fileList.map(item => item.response.filePath);
    fields.shipPhotos = paths.join();
    dispatch({
      type: 'MaritimeVessel/add',
      payload: fields,
      callback: () => {
        message.success('添加成功');
        this.handleModalVisible();
        this.getList({ pageBean });
        callback();
      },
    });
  };

  handleUpdate = (fields, callback) => {
    const { fileList, detail, pageBean } = this.state;
    if (!fileList.length) return message.error('请选择文件');
    const newDetail = JSON.parse(JSON.stringify(detail));
    const imgs = fileList.map(item => {
      if (item.response) {
        return item.response.filePath;
      }
      return item.path;
    });
    fields.shipPhotos = imgs.join();
    for (let i in fields) {
      newDetail[i] = fields[i];
    }
    this.setState({ detail: newDetail });
    const { dispatch } = this.props;
    dispatch({
      type: 'MaritimeVessel/update',
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
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={16}>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('czxh')(<Input addonBefore="船只型号" placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('jyfw')(<Input addonBefore="经营范围" placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('dw')(<Input addonBefore="吨位" placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('psl')(<Input addonBefore="排水量" placeholder="请输入" />)}
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

  handleChange = ({ fileList }) => this.setState({ fileList });

  uploadConfig = () => {
    return {
      name: 'files',
      action: '/result/api/file/v1/fileUpload',
      listType: 'picture-card',
      accept: '.jpg,.jpeg,.png',
      // className: 'upload-list-inline',
      data: {
        type: 9,
      },
      headers: {
        Authorization: `Bearer ${getLocalStorage('token')[0]}`,
        'x-requested-with': 'XMLHttpRequest',
      },
      onChange: this.handleChange,
      // onPreview: this.handlePreview,
    };
  };

  render() {
    const {
      MaritimeVessel: { data },
      loading,
    } = this.props;
    const { modalVisible, updateModalVisible, fileList, detail } = this.state;

    const parentMethods = {
      fileList,
      uploadConfig: this.uploadConfig,
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      detail,
      fileList,
      uploadConfig: this.uploadConfig,
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
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
        {updateModalVisible && Object.keys(detail).length ? (
          <UpdateForm {...updateMethods} modalVisible={updateModalVisible} />
        ) : null}
      </Fragment>
    );
  }
}

export default TableList;
