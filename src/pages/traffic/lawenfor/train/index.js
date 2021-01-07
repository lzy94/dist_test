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
  Divider,
  Tooltip,
  Descriptions,
  Icon,
  Tag,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import { Redirect } from 'umi';
import { checkAuth, fileUrl } from '@/utils/utils';
import styles from '../../../style/style.less';
import themeStyle from '@/pages/style/theme.less';

const authority = ['/lawenfor/train'];
const FormItem = Form.Item;
const statusMap = ['未开始', '已结束'];

const UpdateForm = Form.create()(props => {
  const { modalVisible, handleModalVisible, detail } = props;
  const showTime = time => {
    if (time) {
      const times = time.split(',');
      return [times[0], times[1]];
    }
    return [];
  };

  const title = (
    <div className={themeStyle.modalHeader}>
      <div className={themeStyle.title}>
        <span className={themeStyle.value}>培训详情</span>
      </div>
    </div>
  );

  return (
    <Modal
      destroyOnClose
      title={title}
      visible={modalVisible}
      className={`${themeStyle.myModal} ${themeStyle.modalbody}`}
      onCancel={() => handleModalVisible()}
      footer={null}
      width={600}
    >
      <div className={themeStyle.detailMsg}>
        <div style={{ padding: 20 }}>
          <Descriptions size="small" column={1} bordered>
            <Descriptions.Item label="培训主题">{detail.trainTitle}</Descriptions.Item>

            <Descriptions.Item label="培训内容">{detail.trainContent}</Descriptions.Item>
            <Descriptions.Item label="培训时间">
              {`${showTime(detail.trainTime)[0]} ~ ${showTime(detail.trainTime)[1]}`}
            </Descriptions.Item>
            <Descriptions.Item label="培训地点">{detail.trainSite}</Descriptions.Item>
            <Descriptions.Item label="参与人员">{detail.participants}</Descriptions.Item>
            <Descriptions.Item label="状态">{statusMap[detail.status]}</Descriptions.Item>
            <Descriptions.Item label="培训文件">
              <a href={fileUrl + detail.trainImg} target="_blank">
                <Icon type="download" /> 文件下载
              </a>
            </Descriptions.Item>
          </Descriptions>
        </div>
      </div>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ system, LawenforTrain, loading }) => ({
  system,
  LawenforTrain,
  loading: loading.models.LawenforTrain,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    updateModalVisible: false,
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
      title: '培训主题',
      dataIndex: 'trainTitle',
    },
    {
      title: '培训内容',
      dataIndex: 'trainContent',
      render: val => (
        <Tooltip title={val}>
          <a>{val.length > 30 ? `${val.substr(0, 30)}......` : val}</a>
        </Tooltip>
      ),
    },
    {
      title: '培训地点',
      dataIndex: 'trainSite',
      render: val => (
        <Tooltip title={val}>
          <a>{val.length > 30 ? `${val.substr(0, 30)}......` : val}</a>
        </Tooltip>
      ),
    },
    {
      title: '培训时间',
      dataIndex: 'trainTime',
      width: 310,
      render: val => {
        if (val) {
          const time = val.split(',');
          return `${time[0]} ~ ${time[1]}`;
        }
        return '';
      },
    },
    {
      title: '参与人员',
      dataIndex: 'participants',
      render: val => (
        <Tooltip title={val}>
          <a>{val.length > 30 ? `${val.substr(0, 30)}......` : val}</a>
        </Tooltip>
      ),
    },
    {
      title: '培训文件',
      dataIndex: 'trainImg',
      render: val => (
        <Tag color="#87d068">
          <Icon type="download" />
          <a href={fileUrl + val} target="_blank">
            文件下载
          </a>
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: val => statusMap[parseInt(val, 10)],
    },
    {
      title: '操作',
      width: 70,
      render: (text, record) => (
        <Fragment>
          <Tooltip placement="left" title="详情">
            <Button
              onClick={() => this.showUpdateModal(record)}
              type="primary"
              shape="circle"
              icon="eye"
              size="small"
            />
          </Tooltip>
          <Divider type="vertical" />
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    if (!checkAuth(authority[0])) return;
    const { pageBean } = this.state;
    this.getList({ pageBean });
  }

  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'LawenforTrain/fetch',
      payload: params,
    });
  };

  showUpdateModal = record => {
    this.setState(
      {
        detail: record,
      },
      () => {
        this.handleUpdateModalVisible(true);
      },
    );
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
      const conditionFilter = condition.filter(item => item);
      this.setState({
        formValues: conditionFilter,
      });
      this.getList({ pageBean, querys: conditionFilter });
    });
  };

  handleUpdateModalVisible = flag => {
    this.setState({
      updateModalVisible: !!flag,
    });
    if (!flag) {
      this.setState({
        detail: {},
      });
    }
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
              {getFieldDecorator('trainTitle')(
                <Input addonBefore="培训主题" placeholder="请输入" />,
              )}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('trainContent')(
                <Input addonBefore="培训内容" placeholder="请输入" />,
              )}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
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
      LawenforTrain: { data },
      loading,
    } = this.props;
    const { updateModalVisible, detail } = this.state;

    const updateMethods = {
      detail,
      handleModalVisible: this.handleUpdateModalVisible,
    };

    return (
      <Fragment>
        {checkAuth(authority[0]) ? null : <Redirect to="/exception/403" />}
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <StandardTable
              size="middle"
              selectedRows={0}
              rowSelection={null}
              loading={loading}
              data={data}
              tableAlert={false}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        {updateModalVisible && JSON.stringify(detail) !== '{}' ? (
          <UpdateForm {...updateMethods} modalVisible={updateModalVisible} />
        ) : null}
      </Fragment>
    );
  }
}

export default TableList;
