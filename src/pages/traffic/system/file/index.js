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
  Tooltip,
  Select,
  Tag,
  Descriptions,
} from 'antd';
import { Redirect } from 'umi';
import StandardTable from '@/components/StandardTable';
import { checkAuth } from '@/utils/utils';
import styles from '../../../style/style.less';
import publicCss from '../../../style/public.less';
import themeStyle from '@/pages/style/theme.less';

const FormItem = Form.Item;
const { Option } = Select;

const authority = ['/system/file', '/system/file/delete', '/system/file/download'];

const DetailModal = Form.create()(props => {
  const { modalVisible, handleModalVisible, detail } = props;

  const fileType = res => {
    let type = '';
    switch (res) {
      case '1':
        type = '用户类';
        break;
      case '2':
        type = '站点信息类';
        break;
      case '3':
        type = '模版类';
        break;
      case '4':
        type = '法律法规类';
        break;
      case '5':
        type = '案卷信息类';
        break;
      case '6':
        type = '卷宗信息类';
        break;
      case '7':
        type = '流动执法类';
        break;
      case '8':
        type = '培训资料类';
        break;
      default:
        type = '其他';
    }
    return type;
  };

  return (
    <Modal
      destroyOnClose
      title="详情"
      className={`${themeStyle.myModal} ${themeStyle.modalbody}`}
      visible={modalVisible}
      onCancel={() => handleModalVisible()}
      footer={null}
    >
      <div className={themeStyle.detailMsg}>
        <div style={{ padding: 20 }}>
          <Descriptions bordered size="small" column={1}>
            <Descriptions.Item label="上传者">{detail.creatorName}</Descriptions.Item>
            <Descriptions.Item label="文件名">{detail.fileName}</Descriptions.Item>
            <Descriptions.Item label="扩展名">{detail.extensionName}</Descriptions.Item>
            <Descriptions.Item label="文件大小">
              <Tag color="#f50">{detail.note}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="文件路径">{detail.filePath}</Descriptions.Item>
            <Descriptions.Item label="文件类型">{fileType(detail.fileType)}</Descriptions.Item>
            <Descriptions.Item label="存储类型">{detail.storeType}</Descriptions.Item>
            <Descriptions.Item label="上传时间">{detail.createTime}</Descriptions.Item>
          </Descriptions>
        </div>
      </div>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ File, loading }) => ({
  File,
  loading: loading.models.File,
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
      title: '上传者',
      dataIndex: 'creatorName',
    },
    {
      title: '文件名',
      dataIndex: 'fileName',
      width: 200,
      render: val =>
        val.length > 15 ? (
          <Tooltip title={val}>
            <span style={{ cursor: 'pointer' }}>{val.substr(0, 15) + '......'}</span>
          </Tooltip>
        ) : (
          val
        ),
    },
    {
      title: '扩展名',
      dataIndex: 'extensionName',
      render: val => <Tag color="#87d068">{val}</Tag>,
    },
    {
      title: '文件大小',
      dataIndex: 'note',
      render: val => <Tag color="#f50">{val}</Tag>,
    },
    {
      title: '文件路径',
      dataIndex: 'filePath',
    },
    {
      title: '上传时间',
      dataIndex: 'createTime',
      width: 170,
    },
    {
      title: '操作',
      width: checkAuth(authority[2]) ? 100 : 70,
      render: (text, record) => (
        <Fragment>
          <Tooltip placement="left" title="详情">
            <Button
              onClick={() => this.showModal(record)}
              type="primary"
              shape="circle"
              icon="eye"
              size="small"
            />
          </Tooltip>
          {checkAuth(authority[2]) ? (
            <Fragment>
              <Divider type="vertical" />
              <Tooltip placement="left" title="文件下载">
                <Button
                  onClick={() => this.fileDown(record)}
                  shape="circle"
                  icon="download"
                  size="small"
                  style={{ background: '#2db7f5', color: '#fff', borderColor: '#2db7f5' }}
                />
              </Tooltip>
            </Fragment>
          ) : null}
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    if (!checkAuth(authority[0])) return;
    const { pageBean } = this.state;
    this.getList({ pageBean });
  }

  showModal = res => {
    this.setState({ detail: res });
    this.handleModalVisible(true);
  };

  fileDown = res => {
    const { dispatch } = this.props;
    dispatch({
      type: 'File/downLoad',
      payload: res,
    });
  };

  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'File/fetch',
      payload: params,
    });
  };

  delBatch = () => {
    const { selectedRows, pageBean } = this.state;
    if (!selectedRows) return;
    const { dispatch } = this.props;
    const self = this;
    Modal.confirm({
      title: '批量删除',
      content: '您确定要批量删除吗?',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'File/remove',
          payload: selectedRows.map(item => item.id).join(),
          callback: () => {
            message.success('删除成功');
            self.getList({ pageBean });
            self.setState({ selectedRows: [] });
          },
        });
      },
      onCancel() {},
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
              operation: item === 'fileType' ? 'EQUAL' : 'LIKE',
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

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 16, xl: 32 }}>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('creatorName')(
                <Input addonBefore="上传者" placeholder="请输入" />,
              )}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <div className={publicCss.inputMain}>
              <span
                style={{ width: '20%', lineHeight: '30px', height: '32px' }}
                className="ant-input-group-addon"
              >
                类型
              </span>
              <FormItem style={{ flex: 1 }}>
                {getFieldDecorator('fileType')(
                  <Select className={publicCss.inputGroupLeftRadius} placeholder="请选择">
                    <Option value="1">用户类</Option>
                    <Option value="2">站点信息类</Option>
                    <Option value="3">模版类</Option>
                    <Option value="4">法律法规类</Option>
                    <Option value="5">案卷信息类</Option>
                    <Option value="6">卷宗信息类</Option>
                    <Option value="7">流动执法类</Option>
                    <Option value="8">培训资料类</Option>
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
      File: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, detail } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      detail,
    };

    const tableConfig = {
      loading,
      data,
      size: 'middle',
      columns: this.columns,
      onSelectRow: this.handleSelectRows,
      onChange: this.handleStandardTableChange,
    };

    return (
      <Fragment>
        {checkAuth(authority[0]) ? null : <Redirect to="/exception/403" />}
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <div className={styles.tableListOperator}>
              {/*<Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>*/}
              {/*    新建*/}
              {/*</Button>*/}
              {selectedRows.length > 0 && (
                <Button type="danger" onClick={() => this.delBatch()}>
                  批量删除
                </Button>
              )}
            </div>
            {checkAuth(authority[1]) ? (
              <StandardTable tableAlert={true} selectedRows={selectedRows} {...tableConfig} />
            ) : (
              <StandardTable selectedRows={0} rowSelection={null} {...tableConfig} />
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
