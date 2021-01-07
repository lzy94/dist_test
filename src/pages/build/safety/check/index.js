import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Select } from 'antd';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Divider,
  Tooltip,
  Popconfirm,
  message,
  Modal,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import CreateModal from './Component/CreateModal';
import UpdateModal from './Component/UpdateModal';
import { cate, project } from '@/utils/constant';
import publicCss from '@/pages/style/public.less';
import styles from '@/pages/style/style.less';
import moment from 'moment';

const FormItem = Form.Item;
const { Option } = Select;
/* eslint react/no-multi-comp:0 */
@connect(({ BuildSafetyCheck, loading }) => ({
  BuildSafetyCheck,
  loading: loading.models.BuildSafetyCheck,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    selectedRows: [],
    formValues: [],
    detail: {},
    projectIndex: 0,
    pageBean: { page: 1, pageSize: 10, showTotal: true },
  };

  columns = [
    {
      title: '抽检项目',
      dataIndex: 'projectName',
    },
    {
      title: '抽检类别',
      dataIndex: 'catogery',
    },
    {
      title: '抽检时间',
      dataIndex: 'checkTime',
      render: val => moment(val).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '检测数',
      dataIndex: 'checkNum',
    },
    {
      title: '合格数',
      dataIndex: 'passNum',
    },
    {
      title: '合格率（%）',
      dataIndex: 'passPercent',
    },
    {
      title: '操作',
      width: 100,
      render: (text, record) => (
        <Fragment>
          <Tooltip placement="left" title="编辑">
            <Button
              onClick={() => this.showDetailModal(record.id)}
              type="primary"
              shape="circle"
              icon="file-search"
              size="small"
            />
          </Tooltip>
          <Divider type="vertical" />
          <Popconfirm
            title="是否删除数据?"
            onConfirm={() => this.delUtil(record.id)}
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
    const { pageBean } = this.state;
    this.getList({ pageBean });
  }

  batchDel = () => {
    Modal.confirm({
      title: '提示',
      content: '确定要删除数据吗？',
      okType: 'danger',
      onOk: () => {
        const { selectedRows } = this.state;
        this.delUtil(selectedRows.map(item => item.id).join());
      },
    });
  };

  delUtil = ids => {
    const { dispatch } = this.props;
    dispatch({
      type: 'BuildSafetyCheck/remove',
      payload: { ids },
      callback: () => {
        message.success('删除成功');
        const { pageBean } = this.state;
        this.getList({ pageBean });
        this.setState({ selectedRows: [] });
      },
    });
  };

  getList = parmas => {
    const { dispatch } = this.props;
    dispatch({
      type: 'BuildSafetyCheck/fetch',
      payload: parmas,
    });
  };

  showDetailModal = detailID => {
    const { dispatch } = this.props;
    dispatch({
      type: 'BuildSafetyCheck/detail',
      payload: detailID,
      callback: detail => {
        this.setState(
          {
            detail,
          },
          () => this.handleUpdateModalVisible(true),
        );
      },
    });
  };

  handleStandardTableChange = pagination => {
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
      selectedRows: [],
    });
    this.getList({ pageBean });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    const { pageBean } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        catogery: fieldsValue.cjlb,
        projectName: fieldsValue.cjxm,
      };

      const objKeys = Object.keys(values);
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
      const conditionFilter = condition.filter(item => item);
      this.setState({
        formValues: conditionFilter,
      });
      this.getList({ pageBean, querys: conditionFilter });
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

  modalCallback = (type = 'add') => {
    const { pageBean, formValues } = this.state;
    if (type === 'add') {
      return this.getList({ pageBean });
    }
    return this.getList({ pageBean, querys: formValues });
  };

  catogeryChange = (_, e) => {
    const { form } = this.props;
    const index = parseInt(e.props.title, 10);
    form.setFieldsValue({
      cjxm: undefined,
    });
    this.setState({ projectIndex: index });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { projectIndex } = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={16}>
          <Col md={6} sm={24}>
            <div className={publicCss.inputMain}>
              <span
                style={{ width: '80px', lineHeight: '30px', height: '32px' }}
                className="ant-input-group-addon"
              >
                抽检类别
              </span>
              <FormItem style={{ flex: 1 }}>
                {getFieldDecorator('cjlb')(
                  <Select
                    onChange={this.catogeryChange}
                    className={publicCss.inputGroupLeftRadius}
                    placeholder="请选择"
                  >
                    {cate.map((item, i) => (
                      <Option value={item} key={item} title={`${i}`}>
                        {item}
                      </Option>
                    ))}
                  </Select>,
                )}
              </FormItem>
            </div>
          </Col>
          <Col md={6} sm={24}>
            <div className={publicCss.inputMain}>
              <span
                style={{ width: '80px', lineHeight: '30px', height: '32px' }}
                className="ant-input-group-addon"
              >
                抽检项目
              </span>
              <FormItem style={{ flex: 1 }}>
                {getFieldDecorator('cjxm')(
                  <Select
                    onChange={this.catogeryChange}
                    className={publicCss.inputGroupLeftRadius}
                    placeholder="请选择"
                  >
                    {project[projectIndex].map((item, i) => (
                      <Option value={item} key={item} title={`${i}`}>
                        {item}
                      </Option>
                    ))}
                  </Select>,
                )}
              </FormItem>
            </div>
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
      BuildSafetyCheck: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, detail } = this.state;

    const baseMethods = {
      modalCallback: this.modalCallback,
    };

    const parentMethods = {
      handleModalVisible: this.handleModalVisible,
    };

    const updateMethods = {
      detail,
      handleModalVisible: this.handleUpdateModalVisible,
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
              {selectedRows.length > 0 && (
                <Button type="danger" onClick={this.batchDel}>
                  批量删除
                </Button>
              )}
            </div>
            <StandardTable
              tableAlert={true}
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              size="middle"
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        {modalVisible && (
          <CreateModal {...baseMethods} {...parentMethods} modalVisible={modalVisible} />
        )}

        {updateModalVisible && Object.keys(detail).length && (
          <UpdateModal {...baseMethods} {...updateMethods} modalVisible={updateModalVisible} />
        )}
      </Fragment>
    );
  }
}

export default TableList;
