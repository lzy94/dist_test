import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Redirect } from 'umi';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Descriptions,
  Modal,
  Tooltip,
  DatePicker,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import { checkAuth, multipleCheckAuth } from '@/utils/utils';
import styles from '../../../style/style.less';
import publicCss from '../../../style/public.less';
import themeStyle from '@/pages/style/theme.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
let authority = [];

const allAuthority = [
  '/system/logs',
  '/system/logs/info',
  '/system/logs/delete',
  '/conserve/data/logs',
  '/maritime/data/logs',
  '/transport/system/logs',
];
const DetailModal = Form.create()(props => {
  const { modalVisible, handleModalVisible, detail } = props;
  return (
    <Modal
      destroyOnClose
      title="日志详情"
      className={themeStyle.myModal + ' ' + themeStyle.modalbody}
      visible={modalVisible}
      onCancel={() => handleModalVisible()}
      footer={null}
      width={800}
    >
      <div className={themeStyle.detailMsg}>
        <div style={{ padding: 20 }}>
          <Descriptions bordered={true} column={2} size="small">
            <Descriptions.Item label="执行人">{detail.executor}</Descriptions.Item>
            <Descriptions.Item label="模块">{detail.moduleType}</Descriptions.Item>
            <Descriptions.Item label="日志类型">{detail.logType}</Descriptions.Item>
            <Descriptions.Item label="操作名称">{detail.opeName}</Descriptions.Item>
            <Descriptions.Item label="请求url地址">{detail.reqUrl}</Descriptions.Item>
            <Descriptions.Item label="操作时间">{detail.executionTime}</Descriptions.Item>
            <Descriptions.Item label="IP" span={2}>
              {detail.ip}
            </Descriptions.Item>
            <Descriptions.Item label="操作内容" span={2}>
              {detail.opeContent}
            </Descriptions.Item>
          </Descriptions>
        </div>
      </div>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ Logs, loading }) => ({
  Logs,
  loading: loading.models.Logs,
}))
@Form.create()
class TableList extends PureComponent {
  constructor(props) {
    super(props);
    authority = multipleCheckAuth(allAuthority);
  }

  state = {
    modalVisible: false,
    formValues: [],
    detail: {},
    selectedRows: [],
    pageBean: {
      page: 1,
      pageSize: 10,
      showTotal: true,
    },
  };

  columns = [
    {
      title: '执行人',
      dataIndex: 'executor',
    },
    {
      title: '模块',
      dataIndex: 'moduleType',
    },
    {
      title: '日志类型',
      dataIndex: 'logType',
    },
    {
      title: '操作名称',
      dataIndex: 'opeName',
    },
    {
      title: '操作时间',
      dataIndex: 'executionTime',
    },
    {
      title: 'IP',
      dataIndex: 'ip',
    },
    checkAuth(authority[1])
      ? {
          title: '操作',
          width: '70px',
          render: (text, record) => (
            <Fragment>
              <Tooltip placement="left" title="详情">
                <Button
                  onClick={() => this.showModal(record.id)}
                  type="primary"
                  shape="circle"
                  icon="eye"
                  size="small"
                />
              </Tooltip>
            </Fragment>
          ),
        }
      : '',
  ].filter(item => item);

  componentDidMount() {
    if (!checkAuth(authority[0])) return;
    const { dispatch } = this.props;
    const { pageBean } = this.state;
    dispatch({
      type: 'Logs/fetch',
      payload: { pageBean },
    });
  }

  delBatch = () => {
    const { selectedRows } = this.state;
    if (!selectedRows) return;
    const self = this;

    Modal.confirm({
      title: '批量删除',
      content: '您确定要批量删除吗?',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        self.delUtil(selectedRows.map(item => item.id).join());
      },
      onCancel() {},
    });
  };

  delUtil = ids => {
    const { dispatch } = this.props;
    const { pageBean } = this.state;
    dispatch({
      type: 'Logs/remove',
      payload: { ids },
      callback: () => {
        this.setState({
          selectedRows: [],
        });
        dispatch({
          type: 'Logs/fetch',
          payload: { pageBean },
        });
      },
    });
  };

  showModal = id => {
    const { dispatch } = this.props;

    dispatch({
      type: 'Logs/detail',
      payload: id,
      callback: res => {
        this.handleModalVisible(true);
        this.setState({ detail: res });
      },
    });
  };

  handleStandardTableChange = pagination => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const params = {
      pageBean: {
        page: pagination.current,
        pageSize: pagination.pageSize,
        showTotal: true,
      },
      querys: formValues,
    };

    dispatch({
      type: 'Logs/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    const { pageBean } = this.state;
    form.resetFields();
    this.setState({
      formValues: [],
    });
    dispatch({
      type: 'Logs/fetch',
      payload: { pageBean },
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { pageBean } = this.state;
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
              value:
                item === 'executionTime'
                  ? values.executionTime
                    ? [
                        moment(values.executionTime[0]).format('YYYY-MM-DD HH:mm:ss'),
                        moment(values.executionTime[1]).format('YYYY-MM-DD HH:mm:ss'),
                      ]
                    : ''
                  : values[item],
              group: 'main',
              operation: item === 'executionTime' ? 'BETWEEN' : 'LIKE',
              relation: 'AND',
            }
          : '';
      });
      const conditionFilter = condition.filter(item => item);
      this.setState({
        formValues: conditionFilter,
      });
      dispatch({
        type: 'Logs/fetch',
        payload: {
          pageBean,
          querys: conditionFilter,
        },
      });
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 16, xl: 16 }}>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('executor')(<Input addonBefore="执行人" placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('moduleType')(<Input addonBefore="模块" placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <div className={publicCss.inputMain}>
              <span
                style={{ width: '80px', lineHeight: '30px', height: '32px' }}
                className="ant-input-group-addon"
              >
                操作时间
              </span>
              <FormItem style={{ flex: 1 }}>
                {getFieldDecorator('executionTime')(
                  <RangePicker
                    showTime
                    className={publicCss.inputGroupLeftRadius}
                    style={{ width: '100%' }}
                  />,
                )}
              </FormItem>
            </div>
          </Col>
          <Col md={7} sm={24}>
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
      Logs: { data },
      loading,
    } = this.props;
    const { modalVisible, detail, selectedRows } = this.state;

    const parentMethods = {
      detail,
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const tabConfig = {
      loading,
      data,
      size: 'middle',
      columns: this.columns,
      onChange: this.handleStandardTableChange,
    };
    return (
      <Fragment>
        {checkAuth(authority[0]) || checkAuth(authority[3]) ? null : (
          <Redirect to="/exception/403" />
        )}
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <div className={styles.tableListOperator}>
              {selectedRows.length > 0 && (
                <span>
                  <Button onClick={() => this.delBatch()} type="danger">
                    批量删除
                  </Button>
                </span>
              )}
            </div>
            {checkAuth(authority[2]) ? (
              <StandardTable
                tableAlert={true}
                selectedRows={selectedRows}
                onSelectRow={this.handleSelectRows}
                {...tabConfig}
              />
            ) : (
              <StandardTable selectedRows={0} rowSelection={null} {...tabConfig} />
            )}
          </div>
        </Card>
        {modalVisible && JSON.stringify(detail) !== '{}' ? (
          <DetailModal {...parentMethods} modalVisible={modalVisible} />
        ) : null}
      </Fragment>
    );
  }
}

export default TableList;
