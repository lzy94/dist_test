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
  Tooltip,
  Popconfirm,
  Divider,
  message,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import DetailModal from './DetailModal';
import UpdateModal from './UpdateModal';

import styles from '../../../style/style.less';
import publicCss from '@/pages/style/public.less';

const FormItem = Form.Item;
const { Option } = Select;

/* eslint react/no-multi-comp:0 */
@connect(({ RoadWorkOrdes, loading }) => ({
  RoadWorkOrdes,
  loading: loading.models.RoadWorkOrdes,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    formValues: [],
    detail: {},
    pageBean: { page: 1, pageSize: 10, showTotal: true },
  };

  columns = [
    {
      title: '工单编号',
      dataIndex: 'orderNo',
    },
    {
      title: '企业名称',
      dataIndex: 'companyName',
    },
    {
      title: '养护地点',
      dataIndex: 'curingAddr',
    },
    {
      title: '养护内容',
      dataIndex: 'curingContent',
    },
    {
      title: '负责人',
      dataIndex: 'curinger',
    },
    {
      title: '状态',
      dataIndex: 'state',
      render: val => {
        if (val === 1) {
          return '已派出';
        }
        if (val === 2) {
          return '已完成';
        }
        return '';
      },
    },
    {
      title: '操作',
      width: 90,
      render: (text, record) => (
        <Fragment>
          {record.state === 2 ? (
            <Tooltip placement="left" title="详情">
              <Button
                onClick={() => this.getDetail(record.id)}
                type="primary"
                shape="circle"
                icon="eye"
                size="small"
              />
            </Tooltip>
          ) : (
            <Tooltip placement="left" title="完成">
              <Button
                onClick={() => this.edit(record.id)}
                type="primary"
                shape="circle"
                icon="edit"
                size="small"
              />
            </Tooltip>
          )}
          <Divider type="vertical" />
          <Popconfirm
            title={record.state === 1 ? '当前状态已派出是否删除数据?' : '是否删除数据?'}
            okType={record.state === 1 ? 'danger' : 'primary'}
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
    const { pageBean } = this.state;
    this.getList({ pageBean });
  }

  dataDel = ids => {
    const { dispatch } = this.props;
    dispatch({
      type: 'RoadWorkOrdes/remove',
      payload: { ids },
      callback: () => {
        message.success('删除成功');
        const { pageBean } = this.state;
        this.getList({ pageBean });
      },
    });
  };

  edit = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'RoadWorkOrdes/detail',
      payload: id,
      callback: detail => this.setState({ detail }, () => this.handleUpdateModalVisible(true)),
    });
  };

  getDetail = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'RoadWorkOrdes/detail',
      payload: id,
      callback: detail => this.setState({ detail }, () => this.handleModalVisible(true)),
    });
  };

  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'RoadWorkOrdes/fetch',
      payload: params,
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
    form.resetFields();
    this.setState({
      formValues: [],
    });
    const { pageBean } = this.state;
    this.getList({ pageBean });
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const { pageBean } = this.state;
      const values = {
        ...fieldsValue,
      };
      const objKeys = Object.keys(values);
      const condition = objKeys.map(item => {
        return values[item]
          ? {
              property: item,
              value: values[item],
              group: 'main',
              operation: item === 'state' ? 'EQUAL' : 'LIKE',
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
  };

  modalSuccess = () => {
    const { pageBean } = this.state;
    this.getList({ pageBean });
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
              {getFieldDecorator('companyName')(
                <Input addonBefore="公司名称" placeholder="请输入" />,
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <div className={publicCss.inputMain}>
              <span
                style={{ width: '80px', lineHeight: '30px', height: '32px' }}
                className="ant-input-group-addon"
              >
                养护状态
              </span>
              <FormItem style={{ flex: 1 }}>
                {getFieldDecorator('state')(
                  <Select placeholder="请选择" style={{ width: '100%' }}>
                    <Option value={1}>已派出</Option>
                    <Option value={2}>已完成</Option>
                  </Select>,
                )}
              </FormItem>
            </div>
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
      RoadWorkOrdes: { data },
      loading,
    } = this.props;
    const { modalVisible, detail, updateModalVisible } = this.state;

    const parentMethods = {
      detail,
      handleModalVisible: this.handleModalVisible,
    };

    const updatetMethods = {
      detail,
      modalSuccess: this.modalSuccess,
      handleModalVisible: this.handleUpdateModalVisible,
    };
    return (
      <Fragment>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <StandardTable
              size="middle"
              tableAlert={false}
              selectedRows={0}
              rowSelection={null}
              loading={loading}
              data={data}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        {modalVisible && Object.keys(detail).length ? (
          <DetailModal {...parentMethods} modalVisible={modalVisible} />
        ) : null}

        {updateModalVisible && Object.keys(detail).length ? (
          <UpdateModal {...updatetMethods} modalVisible={updateModalVisible} />
        ) : null}
      </Fragment>
    );
  }
}

export default TableList;
