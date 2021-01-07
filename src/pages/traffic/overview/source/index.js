import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  Modal,
  Tooltip,
  Tag,
  Spin,
  Tree,
  Divider,
  Icon,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import { Redirect } from 'umi';
import { checkAuth } from '@/utils/utils';
import styles from '../../../style/style.less';
import publicCss from '../../../style/public.less';
import MyStaticModalPublic from '@/components/MyStaticModalPublic';
import themeStyle from '@/pages/style/theme.less';

const authority = ['/overview/source', '/overview/source/info'];

const { Option } = Select;
const FormItem = Form.Item;
const DetailModal = Form.create()(props => {
  const { modalVisible, handleModalVisible, detail } = props;
  const title = (
    <div className={themeStyle.modalHeader}>
      <div className={themeStyle.title}>
        <span className={themeStyle.value}>{detail.carNo}</span>
        <span className={themeStyle.time}>
          {moment(detail.previewTime).format('YYYY-M-D HH:mm:ss')}
        </span>
      </div>
      <div className={themeStyle.titleRight}>
        <div className={themeStyle.local}>
          <Icon type="environment" />
          <a title={detail.sourceCompanyName}>{detail.sourceCompanyName}</a>
        </div>
      </div>
    </div>
  );
  return (
    <Modal
      destroyOnClose
      className={themeStyle.modalStyle}
      title={title}
      visible={modalVisible}
      onCancel={() => handleModalVisible()}
      footer={null}
      width={750}
    >
      <div style={{ padding: 16, background: '#fff' }}>
        <MyStaticModalPublic detail={detail} />
      </div>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ OverviewSource, loading, system, user, Source }) => ({
  Source,
  system,
  OverviewSource,
  currentUser: user.currentUser,
  loading: loading.models.OverviewSource,
  systemLoading: loading.models.system,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    formValues: [],
    detail: {},
    treeFormValue: {},
    selectedKeys: [],
    expandCheckKeys: [],
    sourceList: [],
    pageBean: {
      page: 1,
      pageSize: 10,
      showTotal: true,
    },
  };

  columns = [
    {
      title: '车牌号',
      dataIndex: 'carNo',
    },
    {
      title: '源头企业',
      dataIndex: 'sourceCompanyName',
    },
    {
      title: '检测时间',
      width: 170,
      dataIndex: 'previewTime',
      render: val => moment(val).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '轴数',
      dataIndex: 'axleNumber',
    },
    {
      title: '总重(t)',
      dataIndex: 'totalLoad',
      render: val => val / 1000,
    },
    {
      title: '限载重(t)',
      dataIndex: 'weightLimited',
      render: val => val / 1000,
    },
    {
      title: '超重(t)',
      dataIndex: 'overLoad',
      render: val => (val > 0 ? <Tag color="#f50">{(val / 1000).toFixed(2)}</Tag> : val),
    },
    {
      title: '超重比(%)',
      dataIndex: 'overLoadRate',
      render: val => (val * 100).toFixed(2),
    },
    checkAuth(authority[1])
      ? {
          title: '操作',
          width: 70,
          render: (text, record) => (
            <Fragment>
              <Tooltip placement="left" title="详情">
                <Button
                  onClick={() => this.showDetailModal(record)}
                  type="primary"
                  shape="circle"
                  icon="eye"
                  size="small"
                />
              </Tooltip>
            </Fragment>
          ),
        }
      : null,
  ].filter(item => item);

  componentDidMount() {
    if (!checkAuth(authority[0])) return;
    const { pageBean } = this.state;
    const organId = localStorage.getItem('organId');
    this.getList({ pageBean });
    this.getSourceList(organId);
  }

  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'OverviewSource/fetch',
      payload: {
        ...params,
        sorter: [
          {
            direction: 'DESC',
            property: 'previewTime',
          },
        ],
      },
    });
  };

  showDetailModal = res => {
    this.setState({ detail: res }, () => {
      this.handleModalVisible(true);
    });
  };

  getSourceList = organId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Source/listByOrganId',
      payload: { organId },
      callback: res => {
        this.setState({ sourceList: res });
      },
    });
  };

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
      selectedKeys: [],
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
              relation: 'AND',
            }
          : '';
      });
      const conditionFilter = condition.filter(item => item);
      this.setState({
        formValues: conditionFilter,
      });

      this.getList({
        pageBean,
        querys: conditionFilter,
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  /**
   * 树形选择
   * @param selectedKeys
   * @param info
   */
  onSelect = (selectedKeys, info) => {
    if (!selectedKeys[0]) return;
    const { form } = this.props;
    form.resetFields();
    this.setState({ selectedKeys: selectedKeys });
    this.getSourceList(selectedKeys.join());
  };

  expandCheck = keys => {
    this.setState({ expandCheckKeys: keys });
  };

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <Tree.TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </Tree.TreeNode>
        );
      }
      return <Tree.TreeNode {...item} />;
    });

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { sourceList } = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 16, xl: 16 }}>
          <Col md={5} sm={24}>
            <div className={publicCss.inputMain}>
              <span
                style={{ width: '80px', lineHeight: '30px', height: '32px' }}
                className="ant-input-group-addon"
              >
                源头企业
              </span>
              <FormItem style={{ flex: 1 }}>
                {getFieldDecorator('siteCode')(
                  <Select className={publicCss.inputGroupLeftRadius} placeholder="请选择">
                    {sourceList.map(item => (
                      <Option key={item.siteCode} value={item.siteCode}>
                        {item.companyName}
                      </Option>
                    ))}
                  </Select>,
                )}
              </FormItem>
            </div>
          </Col>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('carNo')(<Input addonBefore="车牌号" placeholder="请输入" />)}
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
      system: { treeList },
      OverviewSource: { data },
      loading,
      systemLoading,
    } = this.props;
    const { modalVisible, detail, expandCheckKeys, selectedKeys } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      detail,
    };
    return (
      <Fragment>
        {checkAuth(authority[0]) ? null : <Redirect to="/exception/403" />}

        <div className={styles.tableMain}>
          <Spin spinning={systemLoading}>
            <div className={styles.treeLeft}>
              <Tree
                selectedKeys={selectedKeys}
                showLine
                onSelect={this.onSelect}
                expandedKeys={
                  expandCheckKeys[0] ? expandCheckKeys : [treeList[0] ? treeList[0].key : '']
                }
                onExpand={this.expandCheck}
              >
                {this.renderTreeNodes(treeList)}
              </Tree>
            </div>
          </Spin>
          <div className={styles.rightTable}>
            <Card bordered={false} style={{ height: '100%' }}>
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
                  onSelectRow={this.handleSelectRows}
                  onChange={this.handleStandardTableChange}
                />
              </div>
            </Card>
          </div>
        </div>
        <DetailModal {...parentMethods} modalVisible={modalVisible} />
      </Fragment>
    );
  }
}

export default TableList;
