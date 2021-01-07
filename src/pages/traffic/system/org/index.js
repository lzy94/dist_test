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
  Divider,
  Cascader,
  Popconfirm,
  Tooltip,
} from 'antd';
import { Redirect } from 'umi';
import StandardTable from '@/components/StandardTable';

import { checkAuth, checkPhone } from '@/utils/utils';
import styles from '../../../style/style.less';
import themeStyle from '@/pages/style/theme.less';

const FormItem = Form.Item;

const authority = [
  '/system/org',
  '/system/org/organAdd',
  '/system/org/organUpdate',
  '/system/org/deleteOrgById',
];

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, treeList, addCascaderChange } = props;
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
      title="添加机构"
      className={themeStyle.formModal}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <div className={themeStyle.formModalBody}>
        <FormItem hasFeedback label="机构名称">
          {form.getFieldDecorator('organName', {
            rules: [{ required: true, message: '请输入机构名称！' }],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem hasFeedback label="机构负责人">
          {form.getFieldDecorator('organReponsible', {
            rules: [{ required: true, message: '请输入机构负责人！' }],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem hasFeedback label="电话">
          {form.getFieldDecorator('reponsibleTel', {
            rules: [
              {
                required: true,
                validator: checkPhone,
              },
            ],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem hasFeedback label="行政区域">
          {form.getFieldDecorator('organId', {
            rules: [{ required: true, message: '请选择行政区域！' }],
          })(
            <Cascader
              options={treeList}
              style={{ width: '100%' }}
              expandTrigger="hover"
              placeholder="请选择"
              onChange={addCascaderChange}
              changeOnSelect
            />,
          )}
        </FormItem>
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
    addCascaderChange,
    detail,
    loading,
  } = props;
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
          <Button key="back" onClick={() => handleModalVisible()}>
            取消
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={okHandle}>
            确定
          </Button>,
        ],
      }
    : { footer: null };

  const style = check
    ? {}
    : {
        color: 'rgba(0,0,0,.7)',
        border: 0,
      };

  return (
    <Modal
      destroyOnClose
      title={checkAuth(authority[2]) ? '修改机构' : '机构详情'}
      visible={modalVisible}
      className={themeStyle.formModal}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      {...footer}
    >
      <div className={themeStyle.formModalBody}>
        <FormItem hasFeedback={check} label="机构名称">
          {form.getFieldDecorator('organName', {
            initialValue: detail.organName,
            rules: [{ required: true, message: '请输入机构名称！' }],
          })(<Input placeholder="请输入" style={style} disabled={!check} />)}
        </FormItem>
        <FormItem hasFeedback={check} label="机构负责人">
          {form.getFieldDecorator('organReponsible', {
            initialValue: detail.organReponsible,
            rules: [{ required: true, message: '请输入机构负责人！' }],
          })(<Input placeholder="请输入" style={style} disabled={!check} />)}
        </FormItem>
        <FormItem hasFeedback={check} label="电话">
          {form.getFieldDecorator('reponsibleTel', {
            initialValue: detail.reponsibleTel,
            rules: [
              {
                required: true,
                validator: checkPhone,
              },
            ],
          })(<Input placeholder="请输入" style={style} disabled={!check} />)}
        </FormItem>
        <FormItem hasFeedback={check} label="行政区域">
          {form.getFieldDecorator('organId', {
            initialValue: [detail.provinceCode, detail.cityCode, detail.countryCode].filter(
              item => item,
            ),
            rules: [{ required: true, message: '请选择行政区域！' }],
          })(
            <Cascader
              options={treeList}
              style={{ width: '100%', ...style }}
              expandTrigger="hover"
              placeholder="请选择"
              onChange={addCascaderChange}
              changeOnSelect
              disabled
            />,
          )}
        </FormItem>
      </div>
    </Modal>
  );
});
// [detail.provinceCode, detail.cityCode, detail.countryCode].filter(item => item),

/* eslint react/no-multi-comp:0 */
@connect(({ Org, system, user, loading }) => ({
  Org,
  system,
  currentUser: user.currentUser,
  loading: loading.models.Org,
  systemLoading: loading.models.system,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    selectedRows: [],
    formValues: [],
    superiorOrgNames: [],
    superiorOrgValues: [],
    expandCheckKeys: [],
    treeFormValue: {},
    defaultFormValue: {
      property: 'isDelete',
      value: '0',
      group: 'main',
      operation: 'NOT_EQUAL',
      relation: 'AND',
    },
  };

  columns = [
    {
      title: '机构代码',
      dataIndex: 'organCode',
    },
    {
      title: '机构名称',
      dataIndex: 'organName',
    },
    {
      title: '机构负责人',
      dataIndex: 'organReponsible',
    },
    {
      title: '电话',
      dataIndex: 'reponsibleTel',
    },
    {
      title: '行政区域',
      render: (text, record) => record.province + (record.city || '') + (record.country || ''),
    },
    {
      title: '操作',
      width: checkAuth(authority[3]) ? 100 : 70,
      render: (text, record) => (
        <Fragment>
          <Tooltip placement="left" title={checkAuth(authority[2]) ? '编辑' : '详情'}>
            <Button
              onClick={() => this.showUpdateModal(record.id)}
              type="primary"
              shape="circle"
              icon={checkAuth(authority[2]) ? 'edit' : 'eye'}
              size="small"
            />
          </Tooltip>
          {checkAuth(authority[3]) ? (
            <Fragment>
              {' '}
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
              </Popconfirm>{' '}
            </Fragment>
          ) : null}
        </Fragment>
      ),
    },
  ];

  showUpdateModal = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Org/detail',
      payload: {
        id: id,
      },
      callback: () => {
        this.handleUpdateModalVisible(true);
        const {
          Org: { detail },
        } = this.props;
        this.setState({
          superiorOrgNames: [detail.province, detail.city, detail.country],
          superiorOrgValues: [detail.provinceCode, detail.cityCode, detail.countryCode],
        });
      },
    });
  };

  /**
   * 删除数据
   * @param id
   */
  dataDel = id => {
    this.delUtil(id);
  };

  delUtil = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Org/remove',
      payload: {
        remove: {
          id,
        },
        query: {
          pageBean: {
            page: 1,
            pageSize: 10,
            showTotal: true,
          },
        },
      },
      callback: () => {
        message.success('删除成功');
        this.setState({
          selectedRows: [],
        });
      },
    });
  };

  componentDidMount() {
    if (!checkAuth(authority[0])) return;
    const { dispatch } = this.props;
    dispatch({
      type: 'Org/fetch',
      payload: {
        pageBean: {
          page: 1,
          pageSize: 10,
          showTotal: true,
        },
      },
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    dispatch({
      type: 'Org/fetch',
      payload: {
        pageBean: {
          page: pagination.current,
          pageSize: pagination.pageSize,
          showTotal: true,
        },
        querys: formValues,
      },
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: [],
      treeFormValue: {},
    });
    dispatch({
      type: 'Org/fetch',
      payload: {
        pageBean: {
          page: 1,
          pageSize: 10,
          showTotal: true,
        },
      },
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { defaultFormValue, treeFormValue } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
      };
      const objKeys = Object.keys(values);
      // 重新格式化条件数组
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
      if (JSON.stringify(treeFormValue) != '{}') {
        conditionFilter.push(treeFormValue);
      }
      // conditionFilter.unshift(defaultFormValue);
      dispatch({
        type: 'Org/fetch',
        payload: {
          pageBean: {
            page: 1,
            pageSize: 10,
            showTotal: true,
          },
          querys: conditionFilter,
        },
      });
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
  };

  handleUpdate = fields => {
    const {
      dispatch,
      Org: { detail },
    } = this.props;
    const { superiorOrgNames, superiorOrgValues } = this.state;
    fields.province = superiorOrgNames[0] || null;
    fields.provinceCode = superiorOrgValues[0] || null;
    fields.city = superiorOrgNames[1] || null;
    fields.cityCode = superiorOrgValues[1] || null;
    fields.country = superiorOrgNames[2] || null;
    fields.countryCode = superiorOrgValues[2] || null;
    fields.organCode = (superiorOrgValues[2]
    ? superiorOrgValues[2]
    : superiorOrgValues[1])
      ? superiorOrgValues[2]
        ? superiorOrgValues[2]
        : superiorOrgValues[1]
      : superiorOrgValues[0];
    delete fields.organId;
    const newArr = JSON.parse(JSON.stringify(detail));
    const keys = Object.keys(fields);
    for (let i = 0; i < keys.length; i++) {
      newArr[keys[i]] = fields[keys[i]];
    }

    dispatch({
      type: 'Org/update',
      payload: {
        update: newArr,
        query: {
          pageBean: {
            page: 1,
            pageSize: 10,
            showTotal: true,
          },
        },
      },
      callback: () => {
        message.success('编辑成功');
        this.handleUpdateModalVisible();
        this.setState({ superiorOrgNames: [], superiorOrgValues: [] });
      },
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    const { superiorOrgNames, superiorOrgValues } = this.state;
    fields.province = superiorOrgNames[0] || null;
    fields.provinceCode = superiorOrgValues[0] || null;
    fields.city = superiorOrgNames[1] || null;
    fields.cityCode = superiorOrgValues[1] || null;
    fields.country = superiorOrgNames[2] || null;
    fields.countryCode = superiorOrgValues[2] || null;
    fields.organCode = (superiorOrgValues[2]
    ? superiorOrgValues[2]
    : superiorOrgValues[1])
      ? superiorOrgValues[2]
        ? superiorOrgValues[2]
        : superiorOrgValues[1]
      : superiorOrgValues[0];
    delete fields.organId;
    dispatch({
      type: 'Org/add',
      payload: {
        add: fields,
        query: {
          pageBean: {
            page: 1,
            pageSize: 10,
            showTotal: true,
          },
        },
      },
      callback: () => {
        message.success('添加成功');
        this.handleModalVisible();
        this.setState({ superiorOrgNames: [], superiorOrgValues: [] });
      },
    });
  };

  addCascaderChange = (value, selectedOptions) => {
    this.setState({
      superiorOrgNames: selectedOptions.map(item => item.label),
      superiorOrgValues: selectedOptions.map(item => item.value),
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
              {getFieldDecorator('organName')(
                <Input addonBefore="机构名称" placeholder="请输入" />,
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem>
              {getFieldDecorator('organCode')(
                <Input addonBefore="机构编码" placeholder="请输入" />,
              )}
            </FormItem>
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

  /**
   * 树形选择
   * @param selectedKeys
   * @param info
   */
  // onSelect = (selectedKeys, info) => {
  //     if (!selectedKeys[0]) return;
  //     const {dispatch} = this.props;
  //     const {formValues, defaultFormValue} = this.state;
  //     let arr = [];
  //     const treeFormValue = {
  //         property: 'organCode',
  //         value: selectedKeys[0],
  //         group: "main",
  //         operation: "EQUAL",
  //         relation: "OR"
  //     };
  //     this.setState({treeFormValue: treeFormValue});
  //     // arr.unshift(defaultFormValue);
  //     arr.push(treeFormValue);
  //     arr = arr.concat(formValues);
  //     dispatch({
  //         type: 'Org/fetch',
  //         payload: {
  //             "pageBean": {
  //                 "page": 1,
  //                 "pageSize": 10,
  //                 "showTotal": true
  //             },
  //             "querys": arr
  //         },
  //     });
  //
  //
  // };
  //
  // expandCheck = (keys) => {
  //     this.setState({expandCheckKeys: keys})
  // }
  //
  // renderTreeNodes = data =>
  //     data.map(item => {
  //         if (item.children) {
  //             return (
  //                 <Tree.TreeNode title={item.title} key={item.key} dataRef={item}>
  //                     {this.renderTreeNodes(item.children)}
  //                 </Tree.TreeNode>
  //             );
  //         }
  //         return <Tree.TreeNode {...item} />;
  //     });

  render() {
    const {
      system: { treeList },
      Org: { data, detail },
      systemLoading,
      loading,
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, expandCheckKeys } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      addCascaderChange: this.addCascaderChange,
      treeList,
    };

    const updateMethods = {
      handleModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
      addCascaderChange: this.addCascaderChange,
      treeList,
      detail,
      loading,
    };

    return (
      <Fragment>
        {checkAuth(authority[0]) ? null : <Redirect to="/exception/403" />}
        <Card bordered={false}>
          {/*<div className={styles.main}>*/}
          {/*    <Spin spinning={systemLoading}>*/}
          {/*        <div className={styles.leftTree}>*/}
          {/*            <Tree*/}
          {/*                showLine*/}
          {/*                onSelect={this.onSelect}*/}
          {/*                expandedKeys={expandCheckKeys[0] ? expandCheckKeys : ([treeList[0] ? treeList[0].key : ''])}*/}
          {/*                onExpand={this.expandCheck}*/}
          {/*            >*/}
          {/*                {this.renderTreeNodes(treeList)}*/}
          {/*            </Tree>*/}
          {/*        </div>*/}
          {/*    </Spin>*/}
          {/*    <Divider style={{height: 'auto', marginRight: 20}} type="vertical"/>*/}

          {/*<div className={styles.tableList + ' ' + styles.rigthTable}>*/}
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <div className={styles.tableListOperator}>
              {checkAuth(authority[1]) ? (
                <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                  新建
                </Button>
              ) : null}

              {/*                {selectedRows.length > 0 && (*/}
              {/*                    <span>*/}
              {/*  <Button type='danger' onClick={() => this.delBatch()}>批量删除</Button>*/}
              {/*</span>*/}
              {/*                )}*/}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              rowSelection={null}
              loading={loading}
              data={data}
              size="middle"
              tableAlert={false}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
          {/*</div>*/}
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
