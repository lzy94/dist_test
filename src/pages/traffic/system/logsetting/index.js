import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Modal,
  message,
  Tooltip, Radio, Badge, Tag
} from 'antd';
import {Redirect} from "umi";
import StandardTable from '@/components/StandardTable';
import styles from '../../../style/style.less';
import {checkAuth} from '@/utils/utils';
import themeStyle from "@/pages/style/theme.less";

const FormItem = Form.Item;
const authority = ["/system/logsetting", "/system/logsetting/add"];
const status = ['禁用', '启用'];
const statusMap = ['warning', 'success'];


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
      title="添加"
      className={themeStyle.formModal}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <div className={themeStyle.formModalBody}>
        <FormItem hasFeedback label="缓存模块">
          {form.getFieldDecorator('moduleType', {
            rules: [{required: true, message: '请输入缓存模块！'}],
          })(<Input placeholder="请输入"/>)}
        </FormItem>
        <FormItem hasFeedback label="缓存保留天数">
          {form.getFieldDecorator('saveDays', {
            rules: [{required: true, message: '请输入缓存保留天数！'}],
          })(
            <Radio.Group>
              <Radio value='7'>一周(7天)</Radio>
              <Radio value='30'>一个月(30天)</Radio>
              <Radio value='90'>三个月(90天)</Radio>
              <Radio value='180'>半年(180天)</Radio>
              <Radio value='365'>一年(365天)</Radio>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem label="描述">
          {form.getFieldDecorator('remark', {
            rules: [{message: '请输入描述！'}],
          })(<Input.TextArea placeholder="请输入"/>)}
        </FormItem>
        <FormItem label="状态">
          {form.getFieldDecorator('status', {
            initialValue: '1',
            rules: [{message: '请选择状态！'}],
          })(
            <Radio.Group>
              <Radio value='0'>禁用</Radio>
              <Radio value='1'>启用</Radio>
            </Radio.Group>
          )}
        </FormItem>
      </div>
    </Modal>
  );
});


const UpdateForm = Form.create()(props => {
  const {modalVisible, form, handleUpdate, handleUpdateModalVisible, detail} = props;
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
      title="编辑"
      className={themeStyle.formModal}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleUpdateModalVisible()}
    >
      <div className={themeStyle.formModalBody}>
        <FormItem hasFeedback label="缓存模块">
          {form.getFieldDecorator('moduleType', {
            initialValue: detail.moduleType,
            rules: [{required: true, message: '请输入缓存模块！'}],
          })(<Input placeholder="请输入"/>)}
        </FormItem>
        {/*<FormItem labelCol={{span: 5}} hasFeedback wrapperCol={{span: 15}} label="缓存保留天数">*/}
        {/*    {form.getFieldDecorator('saveDays', {*/}
        {/*        initialValue: detail.saveDays,*/}
        {/*        rules: [{required: true, message: '请输入缓存保留天数！'}],*/}
        {/*    })(<InputNumber style={{width: '100%'}} placeholder="请输入"/>)}*/}
        {/*</FormItem>*/}

        <FormItem hasFeedback label="缓存保留天数">
          {form.getFieldDecorator('saveDays', {
            initialValue: detail.saveDays,
            rules: [{required: true, message: '请输入缓存保留天数！'}],
          })(
            <Radio.Group>
              <Radio value={7}>一周(7天)</Radio>
              <Radio value={30}>一个月(30天)</Radio>
              <Radio value={90}>三个月(90天)</Radio>
              <Radio value={180}>半年(180天)</Radio>
              <Radio value={365}>一年(365天)</Radio>
            </Radio.Group>
          )}
        </FormItem>

        <FormItem label="描述">
          {form.getFieldDecorator('remark', {
            initialValue: detail.remark,
            rules: [{message: '请输入描述！'}],
          })(<Input.TextArea placeholder="请输入"/>)}
        </FormItem>
        <FormItem label="状态">
          {form.getFieldDecorator('status', {
            initialValue: detail.status,
            rules: [{message: '请选择状态！'}],
          })(
            <Radio.Group>
              <Radio value='0'>禁用</Radio>
              <Radio value='1'>启用</Radio>
            </Radio.Group>
          )}
        </FormItem>
      </div>
    </Modal>
  );
});


/* eslint react/no-multi-comp:0 */
@connect(({Logsetting, loading}) => ({
  Logsetting,
  loading: loading.models.Logsetting,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    formValues: [],
    detail: {},
    pageBean: {
      "page": 1,
      "pageSize": 10,
      "showTotal": true
    },
  };

  columns = [
    {
      title: '缓存模块',
      dataIndex: 'moduleType',
    },
    {
      title: '缓存保留天数',
      dataIndex: 'saveDays',
      render: val => {
        let html = '';
        switch (val) {
          case 7:
            html = <Tag color="#87d068">一周</Tag>;
            break;
          case 30:
            html = <Tag color="#87d068">一个月</Tag>;
            break;
          case 90:
            html = <Tag color="#87d068">三个月</Tag>;
            break;
          case 180:
            html = <Tag color="#87d068">半年</Tag>;
            break;
          case 365:
            html = <Tag color="#87d068">一年</Tag>;
            break;
          default:
            html = val;
        }
        return html;
      }
    },
    {
      title: '描述',
      dataIndex: 'remark',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: val => <Badge status={statusMap[val]} text={status[val]}/>
    },
    checkAuth(authority[1]) ?
      {
        title: '操作',
        width: 70,
        render: (text, record) => (
          <Fragment>
            <Tooltip placement="left" title='编辑'>
              <Button onClick={() => this.showModal(record)} type='primary' shape="circle"
                      icon='edit' size='small'/>
            </Tooltip>
            {/*<Divider type="vertical"/>*/}
            {/*<Popconfirm*/}
            {/*    title="是否删除数据?"*/}
            {/*    onConfirm={() => this.dataDel(record.id)}*/}
            {/*    okText="确定"*/}
            {/*    cancelText="取消"*/}
            {/*>*/}
            {/*    <Tooltip placement="left" title="删除">*/}
            {/*        <Button type="danger" shape="circle" icon="delete" size='small'/>*/}
            {/*    </Tooltip>*/}
            {/*</Popconfirm>*/}
          </Fragment>
        ),
      } : '',
  ].filter(item => item);

  dataDel = id => {
    this.delUtil(id)
  }

  delUtil = ids => {
    const {dispatch} = this.props;
    const {pageBean} = this.state;
    dispatch({
      type: 'Logsetting/remove',
      payload: {ids},
      callback: () => {
        this.setState({
          selectedRows: []
        })
        this.getList({pageBean})
      }
    })
  }


  showModal = res => {
    this.setState({
      detail: res
    }, () => {
      this.handleUpdateModalVisible(true)
    })
    // const {dispatch} = this.props;
    // dispatch({
    //     type: 'Logsetting/detail',
    //     payload: id,
    //     callback: res => {
    //
    //     }
    // })
  }


  getList = (params) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'Logsetting/fetch',
      payload: params
    });
  }

  componentDidMount() {
    if (!checkAuth(authority[0])) return;
    const {pageBean} = this.state;
    this.getList({pageBean})
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const {dispatch} = this.props;
    const {formValues} = this.state;

    const params = {
      pageBean: {
        "page": pagination.current,
        "pageSize": pagination.pageSize,
        "showTotal": true
      },
      'querys': formValues
    };

    dispatch({
      type: 'Logsetting/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const {form, dispatch} = this.props;
    const {pageBean} = this.state;
    form.resetFields();
    this.setState({
      formValues: [],
    });
    dispatch({
      type: 'Logsetting/fetch',
      payload: {pageBean},
    });
  };


  // handleSearch = e => {
  //     e.preventDefault();
  //     const {dispatch, form} = this.props;
  //     form.validateFields((err, fieldsValue) => {
  //         if (err) return;
  //         const values = {
  //             ...fieldsValue,
  //         };
  //         this.setState({
  //             formValues: values,
  //         });
  //
  //         dispatch({
  //             type: 'Logsetting/fetch',
  //             payload: values,
  //         });
  //     });
  // };

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

  handleAdd = fields => {
    const {pageBean} = this.state;
    const {dispatch} = this.props;
    dispatch({
      type: 'Logsetting/saveData',
      payload: fields,
      callback: () => {
        this.getList({pageBean});
        message.success('添加成功');
        this.handleModalVisible();
      }
    });

  };

  handleUpdate = fields => {
    const {dispatch} = this.props;
    const {detail, pageBean} = this.state;
    const newData = JSON.parse(JSON.stringify(detail));
    const keys = Object.keys(fields);

    for (let i = 0; i < keys.length; i++) {
      newData[keys[i]] = fields[keys[i]];
    }
    this.setState({
      detail: newData
    })
    dispatch({
      type: 'Logsetting/saveData',
      payload: newData,
      callback: () => {
        message.success('编辑成功');
        this.handleUpdateModalVisible();
        this.setState({detail: {}})
        this.getList({pageBean})
      }
    });
  };

  renderSimpleForm() {
    const {
      form: {getFieldDecorator},
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{md: 8, lg: 16, xl: 32}}>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('moduleType')(<Input addonBefore='模块' placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
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
      Logsetting: {data},
      loading,
    } = this.props;
    const {modalVisible, updateModalVisible, detail} = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
      detail: detail
    };
    return (
      <Fragment>
        {checkAuth(authority[0]) ? null : <Redirect to="/exception/403"/>}
        <Card bordered={false}>
          <div className={styles.tableList}>
            {/*<div className={styles.tableListForm}>{this.renderSimpleForm()}</div>*/}
            <div className={styles.tableListOperator}>
              {checkAuth(authority[1]) ?
                <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                  新建
                </Button> : null}
            </div>
            <StandardTable
              tableAlert={false}
              size="middle"
              // selectedRows={selectedRows}
              selectedRows={0}
              rowSelection={null}
              loading={loading}
              data={data}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible}/>
        {updateModalVisible && (JSON.stringify(detail) !== '{}') ?
          <UpdateForm {...updateMethods} modalVisible={updateModalVisible}/>
          : null}
      </Fragment>
    );
  }
}

export default TableList;
