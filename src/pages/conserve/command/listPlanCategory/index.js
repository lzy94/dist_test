import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
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
  Divider,
  Tooltip,
  Popconfirm,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import { getPlanObject } from '@/utils/dictionaries';

import styles from '../../../style/style.less';
import themeStyle from '@/pages/style/theme.less';
import publicCss from '@/pages/style/public.less';

const FormItem = Form.Item;
const { Option } = Select;
let planObject = [[], []];

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
      title="新建应急预案分类"
      className={themeStyle.formModal}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <div className={themeStyle.formModalBody}>
        <FormItem label="分类名称">
          {form.getFieldDecorator('categoryName', {
            rules: [{ required: true, message: '请输入分类名称！' }],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem label="分类对象">
          {form.getFieldDecorator('planObject', {
            rules: [{ required: true, message: '请选择分类对象！' }],
          })(
            <Select placeholder="请选择" style={{ width: '100%' }}>
              {planObject[1].map((item, index) => (
                <Option value={planObject[0][index]} key={index}>
                  {item}
                </Option>
              ))}
            </Select>,
          )}
        </FormItem>
      </div>
    </Modal>
  );
});

const UpdateForm = Form.create()(props => {
  const { modalVisible, form, handleUpdate, handleModalVisible, detail } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      handleUpdate(fieldsValue, () => form.resetFields());
    });
  };
  return (
    <Modal
      destroyOnClose
      title="编辑应急预案分类"
      className={themeStyle.formModal}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <div className={themeStyle.formModalBody}>
        <FormItem label="分类名称">
          {form.getFieldDecorator('categoryName', {
            initialValue: detail.categoryName,
            rules: [{ required: true, message: '请输入分类名称！' }],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem label="分类对象">
          {form.getFieldDecorator('planObject', {
            initialValue: detail.planObject,
            rules: [{ required: true, message: '请选择分类对象！' }],
          })(
            <Select placeholder="请选择" style={{ width: '100%' }}>
              {planObject[1].map((item, index) => (
                <Option value={planObject[0][index]} key={index}>
                  {item}
                </Option>
              ))}
            </Select>,
          )}
        </FormItem>
      </div>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ ListPlanCategory, loading }) => ({
  ListPlanCategory,
  loading: loading.models.ListPlanCategory,
}))
@Form.create()
class TableList extends PureComponent {
  // eslint-disable-next-line react/sort-comp
  constructor(props) {
    super(props);
    planObject = getPlanObject();
  }

  state = {
    detail: {},
    modalVisible: false,
    updateModalVisible: false,
  };

  columns = [
    {
      title: '分类名称',
      dataIndex: 'categoryName',
    },
    {
      title: '分类对象',
      dataIndex: 'planObject',
      render: val => planObject[1][planObject[0].indexOf(val)],
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
    this.getList({ planObject: planObject[0].join() });
  }

  dataDel = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ListPlanCategory/remove',
      payload: {
        id,
      },
      callback: () => {
        this.getList();
        message.success('删除成功');
      },
    });
  };

  editData = detail => {
    this.setState({ detail }, () => this.handleUpdateModalVisible(true));
  };

  getList = (params = {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ListPlanCategory/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.getList({ planObject: planObject[0].join() });
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
      };
      if (!values.planObject) {
        values.planObject = planObject[0].join();
      }
      this.getList(values);
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
    if (!flag) {
      this.setState({ detail: {} });
    }
  };

  handleAdd = (fields, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ListPlanCategory/add',
      payload: fields,
      callback: () => {
        message.success('添加成功');
        this.handleModalVisible();
        this.getList({ planObject: planObject[0].join() });
        callback();
      },
    });
  };

  handleUpdate = (fields, callback) => {
    const { dispatch } = this.props;
    const detail = JSON.parse(JSON.stringify(this.state.detail));
    for (let i in fields) {
      detail[i] = fields[i];
    }
    this.setState({ detail });
    dispatch({
      type: 'ListPlanCategory/update',
      payload: detail,
      callback: () => {
        message.success('编辑成功');
        this.handleUpdateModalVisible();
        this.getList({ planObject: planObject[0].join() });
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
        <Row gutter={{ md: 8, lg: 16, xl: 16 }}>
          <Col md={6} sm={24}>
            <FormItem>
              {getFieldDecorator('categoryName')(
                <Input addonBefore="分类名称" placeholder="请输入" />,
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <div className={publicCss.inputMain}>
              <span
                style={{ width: '80px', lineHeight: '30px', height: '32px' }}
                className="ant-input-group-addon"
              >
                分类对象
              </span>
              <FormItem style={{ flex: 1 }}>
                {getFieldDecorator('planObject')(
                  <Select placeholder="请选择" style={{ width: '100%' }}>
                    {planObject[1].map((item, index) => (
                      <Option value={planObject[0][index]} key={index}>
                        {item}
                      </Option>
                    ))}
                  </Select>,
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
      ListPlanCategory: { data },
      loading,
    } = this.props;
    const { modalVisible, detail, updateModalVisible } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      detail,
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
              pagination={false}
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
