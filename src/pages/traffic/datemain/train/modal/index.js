import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Input, Button, Modal, TreeSelect } from 'antd';
import StandardTable from '@/components/StandardTable';
import styles from '../../../../style/style.less';
import publicCss from '@/pages/style/public.less';
import themeStyle from '@/pages/style/theme.less';

const FormItem = Form.Item;

/* eslint react/no-multi-comp:0 */
@connect(({ system, systemUser, user, loading }) => ({
  system,
  systemUser,
  currentUser: user.currentUser,
  loading: loading.models.systemUser,
  systemLoading: loading.models.system,
}))
@Form.create()
class Participants extends PureComponent {
  state = {
    formValues: [],
    treeFormValue: {},
    defaultFormValue: [
      {
        property: 'isDelete',
        value: '0',
        group: 'main',
        operation: 'NOT_EQUAL',
        relation: 'AND',
      },
      {
        property: 'lawCard',
        value: '',
        group: 'main',
        operation: 'NOTNULL',
        relation: 'AND',
      },
    ],
    selectedRows: [],
  };

  columns = [
    {
      title: '登录名',
      dataIndex: 'account',
    },
    {
      title: '姓名',
      dataIndex: 'fullname',
    },
    {
      title: '电话',
      dataIndex: 'mobile',
    },
    {
      title: '机构',
      dataIndex: 'organName',
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    const { defaultFormValue } = this.state;
    const arr = JSON.parse(JSON.stringify(defaultFormValue));
    const organId = localStorage.getItem('organId');
    arr.push({
      property: 'organId',
      value: organId,
      group: 'main',
      operation: 'RIGHT_LIKE',
      relation: 'AND',
    });

    dispatch({
      type: 'systemUser/fetch',
      payload: {
        pageBean: {
          page: 1,
          pageSize: 10,
          showTotal: true,
        },
        querys: arr,
      },
    });
  }

  /**
   * 列表分页操作
   * @param pagination
   * @param filtersArg
   * @param sorter
   */
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch, currentUser } = this.props;
    const { formValues, defaultFormValue, treeFormValue } = this.state;
    let arr = defaultFormValue;
    if (JSON.stringify(treeFormValue) != '{}') {
      arr.push(treeFormValue);
    } else {
      arr.push({
        property: 'organId',
        value: currentUser.organId,
        group: 'main',
        operation: 'RIGHT_LIKE',
        relation: 'AND',
      });
    }
    const params = {
      pageBean: {
        page: pagination.current,
        pageSize: pagination.pageSize,
        showTotal: true,
      },
      querys: arr.concat(formValues),
    };
    dispatch({
      type: 'systemUser/fetch',
      payload: params,
    });
  };

  /**
   * 重置查询表单，查询所有数据
   */
  handleFormReset = () => {
    const { form, dispatch, currentUser } = this.props;
    const { defaultFormValue } = this.state;
    const arr = JSON.parse(JSON.stringify(defaultFormValue));
    form.resetFields();
    this.setState({
      formValues: [],
      selectedRows: [],
    });
    arr.push({
      property: 'organId',
      value: currentUser.organId,
      group: 'main',
      operation: 'RIGHT_LIKE',
      relation: 'AND',
    });
    dispatch({
      type: 'systemUser/fetch',
      payload: {
        pageBean: {
          page: 1,
          pageSize: 10,
          showTotal: true,
        },
        querys: arr,
      },
    });
  };

  /**
   * 条件查询
   * @param e
   */
  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form, currentUser } = this.props;
    const { treeFormValue, defaultFormValue } = this.state;
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
              operation: 'LIKE',
              relation: 'OR',
            }
          : '';
      });
      // 过滤数组中的('' null undefined)
      const conditionFilter = condition
        .filter(item => item)
        .filter(item => item.property !== 'organId');
      this.setState({
        formValues: conditionFilter,
      });
      if (JSON.stringify(treeFormValue) != '{}') {
        conditionFilter.push(treeFormValue);
      } else {
        conditionFilter.push({
          property: 'organId',
          value: currentUser.organId,
          group: 'main',
          operation: 'RIGHT_LIKE',
          relation: 'AND',
        });
      }
      dispatch({
        type: 'systemUser/fetch',
        payload: {
          pageBean: {
            page: 1,
            pageSize: 10,
            showTotal: true,
          },
          querys: defaultFormValue.concat(conditionFilter),
        },
      });
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  okHandle = () => {
    const { selectParticipants, handleModalVisible } = this.props;
    const { selectedRows } = this.state;
    selectParticipants(selectedRows);
    handleModalVisible();
  };

  treeSelectChange = (value, label) => {
    const treeFormValue = {
      property: 'organId',
      value: value,
      group: 'main',
      operation: 'RIGHT_LIKE',
      relation: 'OR',
    };
    this.setState({ treeFormValue: treeFormValue });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      system: { treeList },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 8, xl: 8 }}>
          <Col md={5} sm={24}>
            <div className={publicCss.inputMain}>
              <span
                style={{ width: '60px', lineHeight: '30px', height: '32px' }}
                className="ant-input-group-addon"
              >
                区域
              </span>
              <FormItem style={{ flex: 1 }}>
                {getFieldDecorator('organId')(
                  <TreeSelect
                    treeData={treeList}
                    style={{ width: '100%' }}
                    placeholder="请选择"
                    onChange={this.treeSelectChange}
                  />,
                )}
              </FormItem>
            </div>
          </Col>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('account')(<Input addonBefore="登录名" placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('fullname')(<Input addonBefore="姓名" placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('mobile')(<Input addonBefore="电话" placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <span className={styles.submitButtons} style={{ float: 'right' }}>
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
      systemUser: { data },
      loading,
      modalVisible,
      handleModalVisible,
    } = this.props;
    const { selectedRows } = this.state;

    // table 表格配置
    const tableConfig = {
      selectedRows,
      size: 'middle',
      loading,
      data,
      columns: this.columns,
      onSelectRow: this.handleSelectRows,
      onChange: this.handleStandardTableChange,
    };
    return (
      <Modal
        destroyOnClose
        title="选择人员"
        visible={modalVisible}
        className={themeStyle.formModal}
        onOk={() => this.okHandle()}
        onCancel={() => handleModalVisible()}
        width={1200}
      >
        <div className={themeStyle.formModalBody}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <StandardTable {...tableConfig} />
          </div>
        </div>
      </Modal>
    );
  }
}

export default Participants;
