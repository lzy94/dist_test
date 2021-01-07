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
  Radio,
  Tooltip,
  Badge,
  Tag,
} from 'antd';
import { Redirect } from 'umi';
import StandardTable from '@/components/StandardTable';
import styles from '../../../style/style.less';
import { checkAuth } from '@/utils/utils';
import themeStyle from '@/pages/style/theme.less';

const FormItem = Form.Item;

const authority = ['/system/properties', '/system/properties/update'];

const UpdateForm = Form.create()(props => {
  const { modalVisible, form, handleUpdate, handleModalVisible, detail } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleUpdate(fieldsValue);
    });
  };
  const style = {
    border: 0,
    color: 'rgba(0,0,0,.7)',
  };
  const check = checkAuth(authority[1]);
  const footer = check ? {} : { footer: null };
  return (
    <Modal
      destroyOnClose
      title={check ? '编辑' : '详情'}
      className={themeStyle.formModal}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      {...footer}
    >
      <div className={themeStyle.formModalBody}>
        <FormItem label="参数名">
          {form.getFieldDecorator('name', {
            initialValue: detail.name,
            rules: [{ required: true, message: '请输入参数名！' }],
          })(<Input style={style} disabled placeholder="请输入" />)}
        </FormItem>
        <FormItem label="别名">
          {form.getFieldDecorator('alias', {
            initialValue: detail.alias,
            rules: [{ required: true, message: '请输入别名！' }],
          })(<Input style={style} disabled placeholder="请输入" />)}
        </FormItem>
        {check ? (
          detail.alias === 'file.saveType' ? (
            detail.encrypt ? (
              <FormItem label="参数值">
                {form.getFieldDecorator('value', {
                  initialValue:
                    detail.value === '0xO+nczb1XruGQNH6YQHgQ=='
                      ? 'ftp'
                      : detail.value === 'TidsGvPIATm5bfBg+SF7TQ=='
                      ? 'folder'
                      : 'database',
                  rules: [{ required: true, message: '请选择！' }],
                })(
                  <Radio.Group>
                    <Radio value="database">database</Radio>
                    <Radio value="folder">folder</Radio>
                    <Radio value="ftp">ftp</Radio>
                  </Radio.Group>,
                )}
              </FormItem>
            ) : (
              <FormItem label="参数值">
                {form.getFieldDecorator('value', {
                  initialValue: detail.value,
                  rules: [{ required: true, message: '请选择！' }],
                })(
                  <Radio.Group>
                    <Radio value="database">database</Radio>
                    <Radio value="folder">folder</Radio>
                    <Radio value="ftp">ftp</Radio>
                  </Radio.Group>,
                )}
              </FormItem>
            )
          ) : (
            <FormItem hasFeedback={check} label="参数值">
              {form.getFieldDecorator('value', {
                initialValue: detail.value,
              })(<Input placeholder="请输入" />)}
            </FormItem>
          )
        ) : (
          <FormItem hasFeedback={check} label="参数值">
            {form.getFieldDecorator('value', {
              initialValue: detail.value,
            })(<Input disabled style={style} placeholder="请输入" />)}
          </FormItem>
        )}
        {check ? (
          <FormItem label="是否加密">
            {form.getFieldDecorator('encrypt', {
              initialValue: detail.encrypt,
              rules: [{ required: true, message: '请选择！' }],
            })(
              <Radio.Group>
                <Radio value={0}>否</Radio>
                <Radio value={1}>是</Radio>
              </Radio.Group>,
            )}
          </FormItem>
        ) : (
          <FormItem label="是否加密">
            {form.getFieldDecorator('encrypt', {
              initialValue: detail.encrypt ? '是' : '否',
              rules: [{ required: true, message: '请选择！' }],
            })(<Input style={style} disabled />)}
          </FormItem>
        )}
        <FormItem label="描述">
          {form.getFieldDecorator('description', {
            initialValue: detail.description,
            rules: [{ required: true, message: '请输入描述！' }],
          })(<Input.TextArea disabled autosize style={style} placeholder="请输入" />)}
        </FormItem>
      </div>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ Properties, loading }) => ({
  Properties,
  loading: loading.models.Properties,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: [],
    formValues: [],
    detail: {},
    pageBean: {
      page: 1,
      pageSize: 10,
      showTotal: true,
    },
  };

  columns = [
    {
      title: '参数名',
      dataIndex: 'name',
    },
    {
      title: '别名',
      dataIndex: 'alias',
    },
    {
      title: '参数值',
      dataIndex: 'value',
      render: (val, record) => {
        return record.encrypt ? (
          <Tag color="#52c41a">加密</Tag>
        ) : val.length > 15 ? (
          <Tooltip title={val}>
            <Tag color="#faad14">{val.substring(0, 15) + '...'}</Tag>
          </Tooltip>
        ) : (
          <Tag color="#faad14">{val}</Tag>
        );
      },
    },
    {
      title: '是否加密存储',
      dataIndex: 'encrypt',
      render: val => (val ? <Tag color="#52c41a">加密</Tag> : <Tag color="#faad14">明文</Tag>),
    },
    {
      title: '描述',
      dataIndex: 'description',
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          {checkAuth(authority[1]) ? (
            <Tooltip placement="left" title="编辑">
              <Button
                onClick={() => this.showModal(record)}
                type="primary"
                shape="circle"
                icon="edit"
                size="small"
              />
            </Tooltip>
          ) : (
            <Tooltip placement="left" title="详情">
              <Button
                onClick={() => this.showModal(record)}
                type="primary"
                shape="circle"
                icon="eye"
                size="small"
              />
            </Tooltip>
          )}
        </Fragment>
      ),
    },
  ];

  showModal = res => {
    this.setState(
      {
        detail: res,
      },
      () => {
        this.handleModalVisible(true);
      },
    );
  };

  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Properties/fetch',
      payload: params,
    });
  };

  componentDidMount() {
    const { pageBean } = this.state;
    this.getList({ pageBean });
  }

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
    const { pageBean } = this.state;
    form.resetFields();
    this.setState({
      formValues: [],
    });
    this.getList({ pageBean });
  };

  // handleSelectRows = rows => {
  //     this.setState({
  //         selectedRows: rows,
  //     });
  // };

  // handleSearch = e => {
  //     e.preventDefault();
  //
  //     const {dispatch, form} = this.props;
  //
  //     form.validateFields((err, fieldsValue) => {
  //         if (err) return;
  //
  //         const values = {
  //             ...fieldsValue,
  //         };
  //         this.setState({
  //             formValues: values,
  //         });
  //
  //         dispatch({
  //             type: 'Properties/fetch',
  //             payload: values,
  //         });
  //     });
  // };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    const { pageBean, detail } = this.state;
    const keys = Object.keys(fields);
    const newData = JSON.parse(JSON.stringify(detail));
    newData.value = fields.value;
    newData.encrypt = fields.encrypt;
    // for (let i = 0; i < keys.length; i++) {
    //     newData[keys[i]] = fields[keys[i]]
    // }
    this.setState({
      detail: newData,
    });
    dispatch({
      type: 'Properties/update',
      payload: newData,
      callback: () => {
        message.success('编辑成功');
        this.handleModalVisible();
        this.getList({
          pageBean,
        });
      },
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="规则名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
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
      Properties: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, detail } = this.state;

    const parentMethods = {
      detail,
      handleUpdate: this.handleUpdate,
      handleModalVisible: this.handleModalVisible,
    };
    return (
      <Fragment>
        {checkAuth(authority[0]) ? null : <Redirect to="/exception/403" />}
        <Card bordered={false}>
          <div className={styles.tableList}>
            {/*<div className={styles.tableListForm}>{this.renderSimpleForm()}</div>*/}
            {/*        <div className={styles.tableListOperator}>*/}
            {/*            <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>*/}
            {/*                新建*/}
            {/*            </Button>*/}
            {/*            {selectedRows.length > 0 && (*/}
            {/*                <span>*/}
            {/*  <Button>批量操作</Button>*/}
            {/*</span>*/}
            {/*            )}*/}
            {/*        </div>*/}
            <StandardTable
              size="middle"
              // selectedRows={selectedRows}
              selectedRows={0}
              rowSelection={null}
              loading={loading}
              data={data}
              tableAlert={false}
              columns={this.columns}
              // onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        {modalVisible && JSON.stringify(detail) !== '{}' ? (
          <UpdateForm {...parentMethods} modalVisible={modalVisible} />
        ) : null}
      </Fragment>
    );
  }
}

export default TableList;
