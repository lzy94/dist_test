import React, { PureComponent, Fragment } from 'react';
import {
  Button,
  Modal,
  Form,
  InputNumber,
  Tooltip,
  Switch,
  Popconfirm,
  message,
  Input,
  Radio,
} from 'antd';
import { connect } from 'dva';
import styles from '@/pages/style/style.less';
import StandardTable from '@/components/StandardTable';
import themeStyle from '@/pages/style/theme.less';

const FormItem = Form.Item;

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleAdd(fieldsValue, () => form.resetFields());
    });
  };

  return (
    <Modal
      destroyOnClose
      title="添加流媒体通道"
      className={themeStyle.formModal}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <div className={themeStyle.formModalBody}>
        <FormItem hasFeedback label="名称">
          {form.getFieldDecorator('mediaName', {
            rules: [{ required: true, message: '请输入名称！' }],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem hasFeedback label="车道号">
          {form.getFieldDecorator('lanNo', {
            rules: [{ required: true, message: '请输入车道号！' }],
          })(<InputNumber style={{ width: '100%' }} placeholder="请输入" />)}
        </FormItem>
        <FormItem hasFeedback label="流媒体通道号">
          {form.getFieldDecorator('mediaNo', {
            rules: [{ required: true, message: '请输入流媒体通道号！' }],
          })(<InputNumber style={{ width: '100%' }} placeholder="请输入" />)}
        </FormItem>
        <FormItem hasFeedback label="方向">
          {form.getFieldDecorator('direction', {
            initialValue: 1,
            rules: [{ required: true, message: '请选择方向！' }],
          })(
            <Radio.Group style={{ width: '100%' }}>
              <Radio value={1}>进城方向</Radio>
              <Radio value={0}>出城方向</Radio>
            </Radio.Group>,
          )}
        </FormItem>
        <FormItem label="是否展示">
          {form.getFieldDecorator('switch', {
            initialValue: true,
            rules: [{ required: true, message: '请选择！' }],
          })(<Switch checkedChildren="展示" unCheckedChildren="隐藏" defaultChecked />)}
        </FormItem>
      </div>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ Site, loading }) => ({
  Site,
  loading: loading.models.Site,
}))
@Form.create()
class Modia extends PureComponent {
  static defaultProps = {
    handleModalVisible: () => {},
  };

  state = {
    addModalVisible: false,
  };

  columns = [
    {
      title: '名称',
      dataIndex: 'mediaName',
    },
    {
      title: '通道号',
      dataIndex: 'mediaNo',
    },
    {
      title: '车道号',
      dataIndex: 'lanNo',
    },
    {
      title: '方向',
      dataIndex: 'direction',
      render: val => (val ? '进城方向' : '出城方向'),
    },
    {
      title: '是否展示',
      dataIndex: 'isShow',
      render: val => (val ? '隐藏' : '展示'),
    },
    {
      title: '操作',
      width: 70,
      render: (text, record) => (
        <Fragment>
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
    this.getList();
  }

  getList = () => {
    const { dispatch, siteCode } = this.props;
    dispatch({
      type: 'Site/getMedia',
      payload: { siteCode },
    });
  };

  dataDel = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Site/deleteMedia',
      payload: { id },
      callback: () => {
        this.getList();
        message.success('删除成功');
      },
    });
  };

  handAddModalVisible = flag => {
    this.setState({ addModalVisible: !!flag });
  };

  handleAdd = (fields, callback) => {
    const { dispatch, siteCode } = this.props;
    const values = { ...fields, siteCode, isShow: fields.switch ? 0 : 1 };
    dispatch({
      type: 'Site/addMedia',
      payload: values,
      callback: () => {
        message.success('添加成功');
        this.getList();
        callback();
        this.handAddModalVisible();
      },
    });
  };

  render() {
    const {
      Site: { modiaData },
      modalVisible,
      handleModalVisible,
      siteName,
      loading,
    } = this.props;
    const { addModalVisible } = this.state;

    const createMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handAddModalVisible,
    };

    return (
      <Fragment>
        <Modal
          destroyOnClose
          title={siteName + '\t\t\t流媒体通道'}
          visible={modalVisible}
          onCancel={() => handleModalVisible()}
          width={900}
          className={themeStyle.myModal + ' ' + themeStyle.modalbody}
          footer={null}
        >
          <div className={themeStyle.detailMsg}>
            <div style={{ padding: 20 }}>
              <div className={styles.tableList}>
                <div className={styles.tableListOperator}>
                  <Button icon="plus" type="primary" onClick={() => this.handAddModalVisible(true)}>
                    新建
                  </Button>
                </div>
                <StandardTable
                  selectedRows={0}
                  rowSelection={null}
                  loading={loading}
                  size="middle"
                  pagination={false}
                  data={modiaData}
                  columns={this.columns}
                />
              </div>
            </div>
          </div>
        </Modal>
        <CreateForm {...createMethods} modalVisible={addModalVisible} />
      </Fragment>
    );
  }
}

export default Modia;
