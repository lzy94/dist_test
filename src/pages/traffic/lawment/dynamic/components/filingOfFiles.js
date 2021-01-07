import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Form, Input, Select, Button, Tooltip, Tag, message, Divider, Modal } from 'antd';
import StandardTable from '@/components/StandardTable';
import 'video-react/dist/video-react.css';
import styles from '../../../../style/style.less';
import publicCss from '../../../../style/public.less';
import { checkAuth, isNumbre } from '@/utils/utils';
import DetailModal from './filingOfFilesModal';

const authority = ['/lawment/dynamic/filepige/upload', '/lawment/dynamic/penalty'];
const FormItem = Form.Item;
const { Option } = Select;

/* eslint react/no-multi-comp:0 */
@connect(({ DynamicLaw, loading, system, user }) => ({
  system,
  currentUser: user.currentUser,
  DynamicLaw,
  loading: loading.models.DynamicLaw,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    formValues: [],
    detailID: 0,
    previewCode: '',
    importLoading: false,
    pageBean: {
      page: 1,
      pageSize: 10,
      showTotal: true,
    },
    baseQuery: [
      {
        property: 'isArchive',
        value: 1,
        group: 'main',
        operation: 'EQUAL',
        relation: 'AND',
      },
      {
        property: 'closCase',
        value: 2,
        group: 'main',
        operation: 'EQUAL',
        relation: 'AND',
      },
    ],
  };

  columns = [
    {
      title: '案卷号',
      dataIndex: 'caseNo',
    },
    {
      title: '当事人',
      dataIndex: 'partyName',
    },
    {
      title: '车牌号',
      dataIndex: 'caseReason',
      render: val => (val ? val.split(',')[0] : ''),
    },
    {
      title: '总重(t)',
      dataIndex: 'weight',
      render: val => (val / 1000).toFixed(2),
    },
    {
      title: '超重(t)',
      dataIndex: 'limited',
      render: val =>
        val > 0 ? <Tag color="#f5222d">{(val / 1000).toFixed(2)}</Tag> : (val / 1000).toFixed(2),
    },
    {
      title: '处罚金额',
      dataIndex: 'punishMoney',
    },
    {
      title: '结案日期',
      dataIndex: 'closeTime',
    },
    {
      title: '承办人',
      dataIndex: 'undertaker',
    },
    {
      title: '状态',
      dataIndex: 'isArchive',
      render: () => '已签批',
    },
    {
      title: '操作',
      width: 140,
      render: (text, record) => (
        <Fragment>
          <Tooltip placement="left" title="查看详情">
            <Button
              onClick={() => this.showDetailModal(record)}
              type="primary"
              shape="circle"
              icon="file-search"
              size="small"
            />
          </Tooltip>
          {checkAuth(authority[0]) ? (
            <Fragment>
              <Divider type="vertical" />
              <Tooltip placement="left" title="案卷上传">
                <Button
                  disabled={!!record.isUpload}
                  onClick={() => this.jzUploadFile(record.previewCode)}
                  type="primary"
                  shape="circle"
                  icon="upload"
                  size="small"
                />
              </Tooltip>
            </Fragment>
          ) : null}
          {checkAuth(authority[1]) ? (
            record.isArchive !== 2 ? (
              <Fragment>
                {' '}
                <Divider type="vertical" />
                <Tooltip placement="left" title="确认归档">
                  <Button
                    onClick={() => this.placeOnFile(record.previewCode)}
                    type="primary"
                    shape="circle"
                    icon="database"
                    size="small"
                  />
                </Tooltip>
              </Fragment>
            ) : null
          ) : null}
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { pageBean, baseQuery } = this.state;
    this.getList({ pageBean, querys: baseQuery });
  }

  showDetailModal = record => {
    this.setState({ detailID: record.id, previewCode: record.previewCode });
    this.handleModalVisible(true);
  };

  placeOnFile = previewCode => {
    const self = this;
    Modal.confirm({
      title: '系统提示',
      content: '确定归档吗？',
      onOk() {
        const { dispatch } = self.props;
        const { pageBean, formValues, baseQuery } = self.state;
        dispatch({
          type: 'DynamicLaw/caseArchive',
          payload: { previewCode },
          callback: () => {
            message.success('操作成功');
            self.getList({ pageBean, querys: baseQuery.concat(formValues) });
          },
        });
      },
    });
  };

  jzUploadFile = previewCode => {
    const { dispatch } = this.props;
    const { pageBean, formValues, baseQuery } = this.state;
    dispatch({
      type: 'DynamicLaw/jzUpload',
      payload: { previewCode },
      callback: () => {
        message.success('上传成功');
        this.getList({ pageBean, querys: baseQuery.concat(formValues) });
      },
    });
  };

  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'DynamicLaw/getBusDynamicLawCase',
      payload: {
        ...params,
        sorter: [
          {
            direction: 'DESC',
            property: 'closeTime',
          },
        ],
      },
    });
  };

  handleStandardTableChange = pagination => {
    const { formValues, baseQuery } = this.state;

    const params = {
      pageBean: {
        page: pagination.current,
        pageSize: pagination.pageSize,
        showTotal: true,
      },
      querys: baseQuery.concat(formValues),
    };
    this.getList(params);
  };

  handleFormReset = () => {
    const { form } = this.props;
    const { pageBean, baseQuery } = this.state;
    form.resetFields();
    this.setState({
      formValues: [],
    });
    this.getList({ pageBean, querys: baseQuery });
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { pageBean, baseQuery } = this.state;
      const { overLoadRateStart, overLoadRateEnd, totalLoadStart, totalLoadEnd } = fieldsValue;
      if (overLoadRateStart || overLoadRateEnd) {
        if (!isNumbre(overLoadRateStart) || !isNumbre(overLoadRateEnd)) {
          message.error('超限幅度请输入数字');
          return;
        }
      }

      if (totalLoadStart || totalLoadEnd) {
        if (!isNumbre(totalLoadStart) || !isNumbre(totalLoadEnd)) {
          message.error('总重请输入数字');
          return;
        }
      }

      const arr = [
        {
          property: 'limited',
          value:
            overLoadRateStart && overLoadRateEnd
              ? [overLoadRateStart / 100, overLoadRateEnd / 100]
              : '',
          group: 'main',
          operation: 'BETWEEN',
          relation: 'OR',
        },
        {
          property: 'axisNum',
          value: fieldsValue.axisNum === 'other' ? 6 : fieldsValue.axisNum || '',
          group: 'main',
          operation: fieldsValue.axisNum === 'other' ? 'GREAT' : 'EQUAL',
          relation: 'OR',
        },
        {
          property: 'weight',
          value: totalLoadStart && totalLoadEnd ? [totalLoadStart * 1000, totalLoadEnd * 1000] : '',
          group: 'main',
          operation: 'BETWEEN',
          relation: 'OR',
        },
        {
          property: 'caseReason',
          value: fieldsValue.caseReason || '',
          group: 'main',
          operation: 'LIKE',
          relation: 'OR',
        },
      ].filter(item => item.value);
      this.setState({
        formValues: arr,
      });
      this.getList({ pageBean, querys: baseQuery.concat(arr) });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  importClick = () => {
    this.setState({ importLoading: true });
    const { dispatch } = this.props;
    const { pageBean, baseQuery, formValues } = this.state;
    dispatch({
      type: 'DynamicLaw/exportBusDynamicLawCase',
      payload: { pageBean, querys: baseQuery.concat(formValues) },
      callback: status => {
        if (status === 404) {
          message.error('暂无数据');
        }
        this.setState({ importLoading: false });
      },
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { importLoading } = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={16}>
          <Col md={5} sm={24}>
            <Input.Group compact>
              <FormItem style={{ display: 'inline-block', width: '60%' }}>
                {getFieldDecorator('overLoadRateStart')(
                  <Input
                    className={`${publicCss.inputGroupRightRadius} ${publicCss.inputGroupRightborder}`}
                    addonBefore="超限幅度(%)"
                    placeholder="请输入"
                    style={{ width: '100%', borderRight: 0 }}
                  />,
                )}
              </FormItem>
              <FormItem style={{ display: 'inline-block', width: '40%' }}>
                {getFieldDecorator('overLoadRateEnd')(
                  <Input
                    className={publicCss.inputGroupRadiusAddon}
                    addonBefore="至"
                    placeholder="请输入"
                    style={{ width: '100%' }}
                  />,
                )}
              </FormItem>
            </Input.Group>
          </Col>
          <Col md={4} sm={24}>
            <div className={publicCss.inputMain}>
              <span
                style={{ width: '60px', lineHeight: '30px', height: '32px' }}
                className="ant-input-group-addon"
              >
                轴数
              </span>
              <FormItem style={{ flex: 1 }}>
                {getFieldDecorator('axisNum')(
                  <Select className={publicCss.inputGroupLeftRadius} placeholder="请选择">
                    <Option value="">全部轴数</Option>
                    <Option value={2}>2</Option>
                    <Option value={3}>3</Option>
                    <Option value={4}>4</Option>
                    <Option value={5}>5</Option>
                    <Option value={6}>6</Option>
                    <Option value="other">其他</Option>
                  </Select>,
                )}
              </FormItem>
            </div>
          </Col>
          <Col md={5} sm={24}>
            <Input.Group compact>
              <FormItem style={{ display: 'inline-block', width: '50%' }}>
                {getFieldDecorator('totalLoadStart')(
                  <Input
                    className={`${publicCss.inputGroupRightRadius} ${publicCss.inputGroupRightborder}`}
                    addonBefore="总重(t)"
                    placeholder="请输入"
                    style={{ width: '100%', borderRight: 0 }}
                  />,
                )}
              </FormItem>
              <FormItem style={{ display: 'inline-block', width: '50%' }}>
                {getFieldDecorator('totalLoadEnd')(
                  <Input
                    className={publicCss.inputGroupRadiusAddon}
                    addonBefore="至"
                    placeholder="请输入"
                    style={{ width: '100%' }}
                  />,
                )}
              </FormItem>
            </Input.Group>
          </Col>
          <Col md={4} sm={24}>
            <FormItem>
              {getFieldDecorator('caseReason')(<Input addonBefore="车牌号" placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ float: 'right', marginBottom: 24 }}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button
                  className={publicCss.import}
                  icon="import"
                  onClick={this.importClick}
                  loading={importLoading}
                  disabled={importLoading}
                  style={{ marginLeft: 8 }}
                >
                  导出
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                  重置
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      DynamicLaw: { data },
      loading,
    } = this.props;
    const { modalVisible, detailID, previewCode } = this.state;

    const parentMethods = {
      handleModalVisible: this.handleModalVisible,
      detailID,
      previewCode,
    };
    return (
      <Fragment>
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
        {modalVisible && detailID ? (
          <DetailModal {...parentMethods} modalVisible={modalVisible} />
        ) : null}
      </Fragment>
    );
  }
}

export default TableList;
