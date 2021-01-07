import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, Modal, Tooltip, TreeSelect } from 'antd';
import StandardTable from '@/components/StandardTable';

import { getPlan } from '@/utils/utils';

import publicCss from '@/pages/style/public.less';
import themeStyle from '@/pages/style/theme.less';
import styles from '../../style/style.less';

const FormItem = Form.Item;

let plan = [[], []];

/* eslint react/no-multi-comp:0 */
@connect(({ system, systemUser, user, loading }) => ({
  system,
  systemUser,
  currentUser: user.currentUser,
  loading: loading.models.systemUser,
}))
@Form.create()
class UserModal extends PureComponent {
  // eslint-disable-next-line react/sort-comp
  constructor(props) {
    super(props);
    plan = getPlan();
  }

  state = {
    formValues: [],
    defaultFormValue: {
      property: 'isDelete',
      value: '0',
      group: 'main',
      operation: 'NOT_EQUAL',
      relation: 'AND',
    },
    pageBean: {
      page: 1,
      pageSize: 7,
      showTotal: true,
    },
    deptSearch: {},
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
    {
      title: '操作',
      width: 80,
      render: (text, record) => (
        <Tooltip placement="left" title="选择">
          <Button
            type="primary"
            shape="circle"
            icon="check"
            size="small"
            onClick={() => this.selectData(record)}
          />
        </Tooltip>
      ),
    },
  ];

  componentDidMount() {
    const { defaultFormValue, pageBean } = this.state;
    const organId = localStorage.getItem('organId');
    const deptSearch = {
      property: 'department',
      value: plan[0].join(),
      group: 'main',
      operation: 'LIKE',
      relation: 'AND',
    };

    const arr = [defaultFormValue];
    if (plan[0].length < 4) {
      arr.push(deptSearch);
      this.setState({ deptSearch });
    }
    this.getList({
      pageBean,
      querys: [
        ...arr,
        {
          property: 'organId',
          value: organId,
          group: 'main',
          operation: 'RIGHT_LIKE',
          relation: 'AND',
        },
      ],
    });
  }

  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'systemUser/fetch',
      payload: params,
    });
  };

  selectData = detail => {
    const { setSelectData, handleModalVisible } = this.props;
    setSelectData(detail);
    handleModalVisible();
  };

  /**
   * 列表分页操作
   * @param pagination
   * @param filtersArg
   * @param sorter
   */
  handleStandardTableChange = pagination => {
    const { formValues, defaultFormValue, deptSearch } = this.state;
    const arr = [];

    arr.unshift(defaultFormValue);

    if (Object.keys(deptSearch).length) {
      arr.push(deptSearch);
    }

    const params = {
      pageBean: {
        page: pagination.current,
        pageSize: pagination.pageSize,
        showTotal: true,
      },
      querys: arr.concat(formValues),
    };

    this.getList(params);
  };

  /**
   * 重置查询表单，查询所有数据
   */
  handleFormReset = () => {
    const { form, currentUser } = this.props;
    const { defaultFormValue, pageBean, deptSearch } = this.state;
    form.resetFields();
    this.setState({
      formValues: [],
    });

    const arr = [defaultFormValue];
    if (Object.keys(deptSearch).length) {
      arr.push(deptSearch);
    }
    this.getList({
      pageBean,
      querys: [
        ...arr,
        {
          property: 'organId',
          value: currentUser.organId,
          group: 'main',
          operation: 'RIGHT_LIKE',
          relation: 'AND',
        },
      ],
    });
  };

  /**
   * 条件查询
   * @param e
   */
  handleSearch = e => {
    e.preventDefault();
    const { form, currentUser } = this.props;
    const { defaultFormValue, pageBean, deptSearch } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
      };
      delete values.organId;
      const objKeys = Object.keys(values);
      // 重新格式化条件数组
      const condition = objKeys.map(item => {
        return values[item]
          ? {
              property: item,
              value: values[item],
              group: 'main',
              operation: 'LIKE',
              relation: 'AND',
            }
          : '';
      });
      // 过滤数组中的('' null undefined)
      const conditionFilter = condition.filter(item => item);

      conditionFilter.push({
        property: 'organId',
        value: fieldsValue.organId || currentUser.organId,
        group: 'main',
        operation: 'RIGHT_LIKE',
        relation: 'AND',
      });

      this.setState({
        formValues: conditionFilter,
      });
      conditionFilter.unshift(defaultFormValue);
      if (Object.keys(deptSearch).length) {
        conditionFilter.push(deptSearch);
      }

      this.getList({
        pageBean,
        querys: conditionFilter,
      });
    });
  };

  renderSimpleForm() {
    const {
      system: { treeList },
      form: { getFieldDecorator },
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
                  <TreeSelect treeData={treeList} style={{ width: '100%' }} placeholder="请选择" />,
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
      systemUser: { data },
      loading,
      handleModalVisible,
      modalVisible,
    } = this.props;

    // table 表格配置
    const tableConfig = {
      tableAlert: false,
      selectedRows: 0,
      rowSelection: null,
      size: 'middle',
      loading,
      data,
      columns: this.columns,
      onChange: this.handleStandardTableChange,
    };
    return (
      <Modal
        destroyOnClose
        title="选择人员"
        className={themeStyle.formModal}
        visible={modalVisible}
        width={1100}
        onCancel={() => handleModalVisible()}
        footer={null}
      >
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <StandardTable {...tableConfig} />
          </div>
        </Card>
      </Modal>
    );
  }
}

export default UserModal;
