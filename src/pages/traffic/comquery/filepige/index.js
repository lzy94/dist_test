import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Input, Button, Tooltip, Tag, Card, Divider, message } from 'antd';
import { Redirect } from 'umi';
import StandardTable from '@/components/StandardTable';
import 'video-react/dist/video-react.css';
import styles from '../../../style/style.less';
import publicCss from '../../../style/public.less';
import DetailModal from '../../lawment/dynamic/components/filingOfFilesModal';
import { checkAuth, isNumbre } from '@/utils/utils';

const authority = ['/comquery/filepige'];
const FormItem = Form.Item;

/* eslint react/no-multi-comp:0 */
@connect(({ DynamicLaw, loading, system, user, File }) => ({
  File,
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
    importLoading: false,
    previewCode: '',
    pageBean: {
      page: 1,
      pageSize: 10,
      showTotal: true,
    },
    baseQuery: {
      property: 'isArchive',
      value: 2,
      group: 'main',
      operation: 'EQUAL',
      relation: 'AND',
    },
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
      render: () => '已归档',
    },
    {
      title: '操作',
      width: 100,
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
          <Divider type="vertical" />
          <Tooltip placement="left" title="下载">
            <Button
              onClick={() => this.downLoadFile(record)}
              type="primary"
              shape="circle"
              icon="download"
              size="small"
            />
          </Tooltip>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    if (!checkAuth(authority[0])) return;
    const { pageBean, baseQuery } = this.state;
    this.getList({ pageBean, querys: [baseQuery] });
  }

  showDetailModal = record => {
    this.setState({ detailID: record.id, previewCode: record.previewCode });
    this.handleModalVisible(true);
  };

  downLoadFile = record => {
    const hide = message.loading('正在下载文件······', 0);
    const { dispatch } = this.props;
    const fileName = record.caseReason ? `${record.caseReason.split(',')[0]} 案卷` : '案卷';
    dispatch({
      type: 'File/downLoad',
      payload: {
        id: record.fileId,
        fileName,
        extensionName: 'doc',
      },
      callback: status => {
        if (status === 404) {
          message.error('模板异常，下载失败');
        }
        setTimeout(hide, 2000);
      },
    });
  };

  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'DynamicLaw/getBusDynamicLawCase',
      payload: params,
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
      querys: [baseQuery].concat(formValues),
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
    this.getList({ pageBean, querys: [baseQuery] });
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
          property: 'caseNo',
          value: fieldsValue.caseNo ? fieldsValue.caseNo : '',
          group: 'main',
          operation: 'LIKE',
          relation: 'AND',
        },
        {
          property: 'limited',
          value: overLoadRateStart && overLoadRateEnd ? [overLoadRateStart, overLoadRateEnd] : '',
          group: 'main',
          operation: 'BETWEEN',
          relation: 'AND',
        },
        {
          property: 'axisNum',
          value: fieldsValue.axisNum === 'other' ? 6 : fieldsValue.axisNum || '',
          group: 'main',
          operation: fieldsValue.axisNum === 'other' ? 'GREAT' : 'EQUAL',
          relation: 'AND',
        },
        {
          property: 'weight',
          value: totalLoadStart && totalLoadEnd ? [totalLoadStart * 1000, totalLoadEnd * 1000] : '',
          group: 'main',
          operation: 'BETWEEN',
          relation: 'AND',
        },
        {
          property: 'caseReason',
          value: fieldsValue.caseReason || '',
          group: 'main',
          operation: 'LIKE',
          relation: 'AND',
        },
      ].filter(item => item.value);
      this.setState({
        formValues: arr,
      });
      this.getList({ pageBean, querys: [baseQuery].concat(arr) });
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
      payload: { pageBean, querys: [baseQuery].concat(formValues) },
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
          <Col md={4} sm={24}>
            <FormItem>{getFieldDecorator('caseNo')(<Input addonBefore="案卷号" />)}</FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem>
              {getFieldDecorator('caseReason')(<Input addonBefore="车牌号" placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <Input.Group compact>
              <FormItem style={{ display: 'inline-block', width: '50%' }}>
                {getFieldDecorator('overLoadRateStart')(
                  <Input
                    className={`${publicCss.inputGroupRightRadius} ${publicCss.inputGroupRightborder}`}
                    addonBefore="超限幅度"
                    placeholder="请输入"
                    style={{ width: '100%', borderRight: 0 }}
                  />,
                )}
              </FormItem>
              <FormItem style={{ display: 'inline-block', width: '50%' }}>
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
          {/*<Col md={4} sm={24}>*/}
          {/*  <div className={publicCss.inputMain}>*/}
          {/*                  <span style={{width: '60px', lineHeight: '30px', height: '32px'}}*/}
          {/*                        className="ant-input-group-addon">轴数</span>*/}
          {/*    <FormItem style={{flex: 1}}>*/}
          {/*      {getFieldDecorator('axisNum')(*/}
          {/*        <Select className={publicCss.inputGroupLeftRadius} placeholder='请选择'>*/}
          {/*          <Option value=''>全部轴数</Option>*/}
          {/*          <Option value={2}>2</Option>*/}
          {/*          <Option value={3}>3</Option>*/}
          {/*          <Option value={4}>4</Option>*/}
          {/*          <Option value={5}>5</Option>*/}
          {/*          <Option value={6}>6</Option>*/}
          {/*          <Option value='other'>其他</Option>*/}
          {/*        </Select>*/}
          {/*      )}*/}
          {/*    </FormItem>*/}
          {/*  </div>*/}
          {/*</Col>*/}
          <Col md={5} sm={24}>
            <Input.Group compact>
              <FormItem style={{ display: 'inline-block', width: '50%' }}>
                {getFieldDecorator('totalLoadStart')(
                  <Input
                    className={
                      publicCss.inputGroupRightRadius + ' ' + publicCss.inputGroupRightborder
                    }
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
        {checkAuth(authority[0]) ? null : <Redirect to="/exception/403" />}
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <StandardTable
              tableAlert={false}
              size="middle"
              selectedRows={0}
              rowSelection={null}
              loading={loading}
              data={data}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        {modalVisible && detailID ? (
          <DetailModal {...parentMethods} modalVisible={modalVisible} />
        ) : null}
      </Fragment>
    );
  }
}

export default TableList;
