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
  message,
  Divider, Tooltip, Popconfirm,
} from 'antd';
import StandardTable from '@/components/StandardTable';

import styles from '../../../style/style.less';
import themeStyle from '@/pages/style/theme.less';

const FormItem = Form.Item;

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
      title="添加分类"
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
        <FormItem label="分类名称">
          {form.getFieldDecorator('categoryName', {
            rules: [{ required: true, message: '请输入分类名称' }],
          })(<Input placeholder="请输入"/>)}
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
    formValues: [],
  };

  columns = [
    {
      title: '分类名称',
      dataIndex: 'categoryName',
    },
    {
      title: '操作',
      width: 80,
      render: (text, record) => (
        <Fragment>
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
    this.getList();
  }

  getList = (params = {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'MaritimeDevice/fetchCate',
      payload: params,
    });
  };

  dataDel = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'MaritimeDevice/removeCate',
      payload: { id },
      callback: () => {
        message.success('删除成功');
        this.getList({ pageBean: this.state.pageBean });
      },
    });
  };

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValues: [],
    });
    this.getList();
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        categoryName: fieldsValue.name,
      };
      this.setState({
        formValues: values,
      });
      this.getList(values);
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };


  handleAdd = (fields, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'MaritimeDevice/addCate',
      payload: fields,
      callback: () => {
        message.success('添加成功');
        this.handleModalVisible();
        this.getList();
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
        <Row gutter={{ md: 8, lg: 16, xl: 32 }}>
          <Col md={6} sm={24}>
            <FormItem>
              {getFieldDecorator('name')(<Input addonBefore="分类名称" placeholder="请输入"/>)}
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
      MaritimeDevice: { cateData },
      loading,
    } = this.props;
    const { modalVisible } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
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
              data={cateData}
              columns={this.columns}
              pagination={false}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible}/>
      </Fragment>
    );
  }
}

export default TableList;
