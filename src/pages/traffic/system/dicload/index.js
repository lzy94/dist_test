import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  Input,
  Button,
  Modal,
  message,
  Divider,
  Tooltip,
  Popconfirm,
  InputNumber,
} from 'antd';
import { Redirect } from 'umi';
import StandardTable from '@/components/StandardTable';
import { checkAuth } from '@/utils/utils';
import styles from '../../../style/style.less';
import themeStyle from '@/pages/style/theme.less';

const FormItem = Form.Item;

const authority = [
  '/system/dicload',
  '/system/dicload/add',
  '/system/dicload/update',
  '/system/dicload/delete',
];

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, loading } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleAdd(fieldsValue, () => form.resetFields());
    });
  };
  return (
    <Modal
      destroyOnClose
      title="添加限重设置"
      className={themeStyle.formModal}
      visible={modalVisible}
      onOk={okHandle}
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
        <FormItem hasFeedback label="车型">
          {form.getFieldDecorator('carType', {
            rules: [{ required: true, message: '请输入车型！' }],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem hasFeedback label="车型代码">
          {form.getFieldDecorator('carTypeCode', {
            rules: [{ required: true, message: '请输入车型代码！' }],
          })(<InputNumber min={1} style={{ width: '100%' }} placeholder="请输入" />)}
        </FormItem>
        <FormItem hasFeedback label="车货总重(kg)">
          {form.getFieldDecorator('weightLimit', {
            rules: [{ required: true, message: '请输入车货总重！' }],
          })(<InputNumber style={{ width: '100%' }} min={1} placeholder="请输入" />)}
        </FormItem>
        <FormItem hasFeedback label="轴数">
          {form.getFieldDecorator('axisNum', {
            rules: [{ required: true, message: '请输入轴数！' }],
          })(<InputNumber style={{ width: '100%' }} min={2} placeholder="请输入" />)}
        </FormItem>
      </div>
    </Modal>
  );
});

const UpdateForm = Form.create()(props => {
  const { modalVisible, form, handleUpdate, handleUpdateModalVisible, loading, detail } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleUpdate(fieldsValue);
    });
  };

  const check = checkAuth(authority[2]);
  const footer = check
    ? {
        footer: [
          <Button key="back" onClick={() => handleUpdateModalVisible()}>
            取消
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={okHandle}>
            确定
          </Button>,
        ],
      }
    : { footer: null };

  const style = {
    border: 0,
    color: 'rgba(0,0,0,.7)',
  };

  return (
    <Modal
      destroyOnClose
      title={check ? '编辑限重设置' : '限重设置详情'}
      visible={modalVisible}
      className={themeStyle.formModal}
      onOk={okHandle}
      onCancel={() => handleUpdateModalVisible()}
      {...footer}
    >
      <div className={themeStyle.formModalBody}>
        {check ? (
          <Fragment>
            <FormItem hasFeedback label="车型">
              {form.getFieldDecorator('carType', {
                initialValue: detail.carType,
                rules: [{ required: true, message: '请输入车型！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem hasFeedback label="车型代码">
              {form.getFieldDecorator('carTypeCode', {
                initialValue: detail.carTypeCode,
                rules: [{ required: true, message: '请输入车型代码！' }],
              })(<InputNumber min={1} style={{ width: '100%' }} placeholder="请输入" />)}
            </FormItem>
            <FormItem hasFeedback label="车货总重(kg)">
              {form.getFieldDecorator('weightLimit', {
                initialValue: detail.weightLimit,
                rules: [{ required: true, message: '请输入车货总重！' }],
              })(<InputNumber style={{ width: '100%' }} min={1} placeholder="请输入" />)}
            </FormItem>
            <FormItem hasFeedback label="轴数">
              {form.getFieldDecorator('axisNum', {
                initialValue: detail.axisNum,
                rules: [{ required: true, message: '请输入轴数！' }],
              })(
                <InputNumber
                  disabled={detail.id < 0}
                  style={{ width: '100%' }}
                  min={2}
                  placeholder="请输入"
                />,
              )}
            </FormItem>
          </Fragment>
        ) : (
          <Fragment>
            <FormItem label="车型">
              {form.getFieldDecorator('carType', {
                initialValue: detail.carType,
                rules: [{ required: true, message: '请输入车型！' }],
              })(<Input disabled style={style} placeholder="请输入" />)}
            </FormItem>
            <FormItem label="车型代码">
              {form.getFieldDecorator('carTypeCode', {
                initialValue: detail.carTypeCode,
                rules: [{ required: true, message: '请输入车型代码！' }],
              })(<InputNumber disabled style={{ width: '100%', ...style }} placeholder="请输入" />)}
            </FormItem>
            <FormItem label="车货总重(kg)">
              {form.getFieldDecorator('weightLimit', {
                initialValue: detail.weightLimit,
              })(<Input disabled style={style} />)}
            </FormItem>
            <FormItem label="轴数">
              {form.getFieldDecorator('axisNum', {
                initialValue: detail.axisNum,
              })(<Input disabled style={style} />)}
            </FormItem>
          </Fragment>
        )}
      </div>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ Dicload, loading }) => ({
  Dicload,
  loading: loading.models.Dicload,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    detail: {},
    // formValues: [],
  };

  columns = [
    {
      title: '车型',
      dataIndex: 'carType',
    },
    {
      title: '车型代码',
      dataIndex: 'carTypeCode',
    },
    {
      title: '车货总重(kg)',
      dataIndex: 'weightLimit',
    },
    {
      title: '轴数',
      dataIndex: 'axisNum',
    },
    {
      title: '操作',
      width: checkAuth(authority[3]) ? 100 : 70,
      render: (text, record) => (
        <Fragment>
          {checkAuth(authority[2]) ? (
            <Tooltip placement="left" title="编辑">
              <Button
                onClick={() => this.showUpdateModal(record)}
                type="primary"
                shape="circle"
                icon="edit"
                size="small"
              />
            </Tooltip>
          ) : (
            <Tooltip placement="left" title="详情">
              <Button
                onClick={() => this.showUpdateModal(record)}
                type="primary"
                shape="circle"
                icon="eye"
                size="small"
              />
            </Tooltip>
          )}
          {checkAuth(authority[3]) ? (
            <Fragment>
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
          ) : null}
        </Fragment>
      ),
    },
  ];

  dataDel = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Dicload/remove',
      payload: { id },
      callback: () => {
        dispatch({
          type: 'Dicload/fetch',
        });
        message.success('删除成功');
      },
    });
  };

  showUpdateModal = res => {
    this.setState({ detail: res }, () => {
      this.handleUpdateModalVisible(true);
    });
  };

  componentDidMount() {
    if (!checkAuth(authority[0])) return;
    const { dispatch } = this.props;
    dispatch({
      type: 'Dicload/fetch',
    });
  }

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

  handleAdd = (fields, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Dicload/add',
      payload: fields,
      callback: () => {
        message.success('添加成功');
        this.handleModalVisible();
        callback && callback();
        dispatch({
          type: 'Dicload/fetch',
        });
      },
    });
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    const { detail } = this.state;
    const keys = Object.keys(fields);
    const newData = JSON.parse(JSON.stringify(detail));
    for (let i = 0; i < keys.length; i++) {
      newData[keys[i]] = fields[keys[i]];
    }
    this.setState({ detail: newData });
    dispatch({
      type: 'Dicload/update',
      payload: newData,
      callback: () => {
        message.success('编辑成功');
        this.handleUpdateModalVisible();
        dispatch({
          type: 'Dicload/fetch',
        });
      },
    });
  };

  render() {
    const {
      Dicload: { data },
      loading,
    } = this.props;
    const { modalVisible, updateModalVisible, detail } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      loading,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
      loading,
      detail,
    };
    return (
      <Fragment>
        <Card bordered={false}>
          {checkAuth(authority[0]) ? '' : <Redirect to="/exception/403" />}
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              {checkAuth(authority[1]) ? (
                <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                  新建
                </Button>
              ) : null}
            </div>
            <StandardTable
              size="middle"
              selectedRows={0}
              rowSelection={null}
              loading={loading}
              data={data}
              tableAlert={false}
              columns={this.columns}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
        {updateModalVisible && JSON.stringify(detail) !== '{}' ? (
          <UpdateForm {...updateMethods} modalVisible={updateModalVisible} />
        ) : null}
      </Fragment>
    );
  }
}

export default TableList;
