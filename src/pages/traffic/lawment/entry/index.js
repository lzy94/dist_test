import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  Button,
  Tooltip,
  Tag,
  TreeSelect,
  Card,
  message,
  DatePicker,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import 'video-react/dist/video-react.css';
import { getLocalStorage } from '@/utils/utils';
import styles from '../../../style/style.less';
import publicCss from '../../../style/public.less';

import DetailModal from '../dynamic/components/modal/washModal';

const FormItem = Form.Item;
const { Option } = Select;

const statusMap = [
  '未审核',
  '初审通过',
  '复审通过',
  '无效数据',
  '免处罚数据',
  '终审办结（归档）',
  '',
];
const pageBean = { pageNo: 1, pageSize: 10 };
const defaultQuery = { isStatus: 0, overLoadFlag: 1, isEntry: 1 };

/* eslint react/no-multi-comp:0 */
@connect(({ TrafficApiV2BusData, loading, system, user, Site }) => ({
  Site,
  system,
  currentUser: user.currentUser,
  // DynamicLaw,
  // loading: loading.models.DynamicLaw,
  TrafficApiV2BusData,
  loading: loading.models.TrafficApiV2BusData,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    formValues: {},
    detailID: 0,
    // importLoading: false,
    siteList: [],
  };

  columns = [
    {
      title: '检测站',
      dataIndex: 'siteName',
      width: 190,
      render: val =>
        val.length > 12 ? <Tooltip title={val}>{`${val.substring(0, 12)}...`}</Tooltip> : val,
    },
    {
      title: '车牌号码',
      dataIndex: 'carNo',
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
      title: '限重(t)',
      dataIndex: 'weightLimited',
      render: val => <Tag color="#87d068">{(val / 1000).toFixed(2)} </Tag>,
    },
    {
      title: '总重(t)',
      dataIndex: 'totalLoad',
      render: val => (val / 1000).toFixed(2),
    },
    {
      title: '超限重(t)',
      dataIndex: 'overLoad',
      render: val =>
        val > 0 ? <Tag color="#f5222d">{(val / 1000).toFixed(2)}</Tag> : (val / 1000).toFixed(2),
    },
    {
      title: '超重比(%)',
      dataIndex: 'overLoadRate',
      render: val => (val ? (val * 100).toFixed(2) : val),
    },
    {
      title: '处理次数',
      dataIndex: 'dealNum',
    },
    {
      title: '状态',
      dataIndex: 'isStatus',
      render: (val, record) => {
        if (record.isRetrial === 1 && !val) {
          return '被退回';
        }
        return statusMap[parseInt(val, 10)];
      },
    },
    {
      title: '操作',
      width: 70,
      render: (text, record) => (
        <Fragment>
          <Tooltip placement="left" title="审核">
            <Button
              onClick={() => this.showDetailModal(record.id)}
              type="primary"
              shape="circle"
              icon="solution"
              size="small"
            />
          </Tooltip>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    this.getSiteList(siteList => {
      const siteCodes = siteList.map(item => item.code);
      const formValues = { siteCodes };
      this.getList({ ...pageBean, ...defaultQuery, ...formValues });
      this.setState({ siteList, formValues });
    });
  }

  getSiteList = callback => {
    const { dispatch } = this.props;
    dispatch({
      type: 'system/userSite',
      payload: {
        siteType: 1,
      },
      callback: res => {
        if (res.length) {
          const siteList = res.map(item => {
            const key = Object.keys(item);
            return {
              code: key[0],
              name: item[key[0]],
            };
          });
          return callback(siteList);
        }
        return callback([]);
      },
    });
  };

  showDetailModal = id => {
    this.setState({ detailID: id });
    this.handleModalVisible(true);
  };

  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'TrafficApiV2BusData/busDynamicDataForPage',
      payload: {
        ...params,
      },
    });
  };

  getSiteIN = () => {
    const { siteList } = this.state;
    return {
      siteCodes: siteList.map(item => item.code),
    };
  };

  handleStandardTableChange = pagination => {
    const { formValues } = this.state;
    const params = {
      page: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
    };
    this.getList(params);
  };

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.getSiteList(siteList => {
      const siteCodes = siteList.map(item => item.code);
      this.getList({ ...pageBean, ...defaultQuery, siteCodes });
      this.setState({
        formValues: { siteCodes },
        siteList,
      });
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const format = 'YYYY-MM-DDTHH:mm:ss';
      const { previewTime, status, siteCodes } = fieldsValue;
      // 时间
      const time = previewTime
        ? {
            startPreviewTime: moment(previewTime[0]).format(format),
            endPreviewTime: moment(previewTime[1]).format(format),
          }
        : {};
      // 状态
      let state = {};
      if (status) {
        const states = status.split('_');
        state = {
          [states[0]]: states[1],
        };
      }
      // 站点
      if (!this.getSiteIN().siteCodes.length) {
        message.error('当前机构暂无站点');
        return;
      }
      const site = siteCodes ? [siteCodes] : this.getSiteIN().siteCodes;
      const values = { ...fieldsValue, ...time, ...state, siteCodes: site };
      delete values.previewTime;
      delete values.status;
      this.setState({ formValues: values });
      this.getList({ ...pageBean, ...defaultQuery, ...values });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
    if (!flag) {
      this.resetDetail();
    }
  };

  resetDetail = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'TrafficApiV2BusData/resetDetail' });
  };

  treeSelectChange = value => {
    const { form } = this.props;
    form.setFieldsValue({ siteCodes: undefined });
    this.getSite(value);
  };

  getSite = (value, callback) => {
    const { dispatch } = this.props;
    const { siteList } = this.state;
    dispatch({
      type: 'Site/siteByUserSite',
      payload: {
        organId: value,
        siteIds: siteList.map(item => item.code),
      },
      callback: res => {
        const newSiteList = res.map(item => {
          if (item.siteType === '1') {
            return {
              code: item.siteCode,
              name: item.siteName,
            };
          }
          return '';
        });
        this.setState({ siteList: newSiteList });
        if (callback) {
          callback(newSiteList);
        }
      },
    });
  };

  modalSuccess = () => {
    message.success('操作成功');
    const { formValues } = this.state;
    setTimeout(() => {
      this.handleModalVisible();
      this.getList({ ...pageBean, ...defaultQuery, ...formValues });
    }, 500);
  };

  // importClick = () => {
  //   this.setState({ importLoading: true });
  //   const { dispatch } = this.props;
  //   const { pageBean, baseQuery, formValues } = this.state;
  //   dispatch({
  //     type: 'DynamicLaw/exportBusDynamicLaw',
  //     payload: {
  //       pageBean,
  //       querys: baseQuery.concat(formValues.length ? formValues : this.getSiteIN()),
  //     },
  //     callback: status => {
  //       if (status === 404) {
  //         message.error('暂无数据');
  //       }
  //       this.setState({ importLoading: false });
  //     },
  //   });
  // };

  renderSimpleForm() {
    const {
      system: { treeList },
      form: { getFieldDecorator },
    } = this.props;
    const { siteList } = this.state;
    // const { importLoading } = this.state;

    const organId = getLocalStorage('organId').toString();

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={16}>
          <Col md={5} sm={24}>
            <div className={publicCss.inputMain}>
              <span
                style={{ width: '80px', lineHeight: '30px', height: '32px' }}
                className="ant-input-group-addon"
              >
                所属机构
              </span>
              <FormItem style={{ flex: 1 }}>
                {getFieldDecorator('name')(
                  <TreeSelect
                    className={publicCss.inputGroupLeftRadius}
                    treeData={treeList}
                    treeDefaultExpandedKeys={[organId]}
                    style={{ width: '100%' }}
                    placeholder="请选择"
                    onChange={this.treeSelectChange}
                  />,
                )}
              </FormItem>
            </div>
          </Col>
          <Col md={4} sm={24}>
            <div className={publicCss.inputMain}>
              <span
                style={{ width: '65px', lineHeight: '30px', height: '32px' }}
                className="ant-input-group-addon"
              >
                检测点
              </span>
              <FormItem style={{ flex: 1 }}>
                {getFieldDecorator('siteCodes')(
                  <Select
                    dropdownMatchSelectWidth={false}
                    className={publicCss.inputGroupLeftRadius}
                    placeholder="请选择"
                  >
                    {siteList.map(item => (
                      <Option key={item.code} value={item.code}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>,
                )}
              </FormItem>
            </div>
          </Col>
          <Col md={5} sm={24}>
            <Input.Group compact>
              <FormItem style={{ display: 'inline-block', width: '60%' }}>
                {getFieldDecorator('startOverLoadRate')(
                  <Input
                    className={`${publicCss.inputGroupRightRadius} ${publicCss.inputGroupRightborder}`}
                    addonBefore="超限幅度(%)"
                    placeholder="请输入"
                    style={{ width: '100%', borderRight: 0 }}
                  />,
                )}
              </FormItem>
              <FormItem style={{ display: 'inline-block', width: '40%' }}>
                {getFieldDecorator('endOverLoadRate')(
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
                {getFieldDecorator('axleNumber')(
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
          <Col md={6} sm={24}>
            <div className={publicCss.inputMain}>
              <span
                style={{ width: '80px', lineHeight: '30px', height: '32px' }}
                className="ant-input-group-addon"
              >
                检测时间
              </span>
              <FormItem style={{ flex: 1 }}>
                {getFieldDecorator('previewTime')(
                  <DatePicker.RangePicker
                    className={publicCss.inputGroupLeftRadius}
                    style={{ width: '100%' }}
                    showTime={{
                      defaultValue: [
                        moment('00:00:00', 'HH:mm:ss'),
                        moment(new Date(), 'HH:mm:ss'),
                      ],
                    }}
                    format="YYYY-MM-DD HH:mm:ss"
                  />,
                )}
              </FormItem>
            </div>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col md={5} sm={24}>
            <Input.Group compact>
              <FormItem style={{ display: 'inline-block', width: '50%' }}>
                {getFieldDecorator('startTotalLoad')(
                  <Input
                    className={`${publicCss.inputGroupRightRadius} ${publicCss.inputGroupRightborder}`}
                    addonBefore="总重(t)"
                    placeholder="请输入"
                    style={{ width: '100%', borderRight: 0 }}
                  />,
                )}
              </FormItem>
              <FormItem style={{ display: 'inline-block', width: '50%' }}>
                {getFieldDecorator('endTotalLoad')(
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
              {getFieldDecorator('carNo')(<Input addonBefore="车牌号" placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <div className={publicCss.inputMain}>
              <span
                style={{ width: '80px', lineHeight: '30px', height: '32px' }}
                className="ant-input-group-addon"
              >
                审核状态
              </span>
              <FormItem style={{ flex: 1 }}>
                {getFieldDecorator('status')(
                  <Select className={publicCss.inputGroupLeftRadius} placeholder="请选择">
                    <Option value="isStatus_0">待审核</Option>
                    <Option value="isRetrial_1">被退回</Option>
                  </Select>,
                )}
              </FormItem>
            </div>
          </Col>
          <Col md={10} sm={24}>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ float: 'right', marginBottom: 24 }}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                {/* <Button
                  className={publicCss.import}
                  icon="import"
                  onClick={this.importClick}
                  loading={importLoading}
                  disabled={importLoading}
                  style={{ marginLeft: 8 }}
                >
                  导出
                </Button> */}
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
      TrafficApiV2BusData: { dyData },
      loading,
    } = this.props;
    const { modalVisible, detailID } = this.state;

    const parentMethods = {
      handleModalVisible: this.handleModalVisible,
      detailID,
      modalSuccess: this.modalSuccess,
    };
    return (
      <Card bordered={false}>
        <div className={styles.tableList}>
          <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
          <StandardTable
            size="middle"
            tableAlert={false}
            selectedRows={0}
            rowSelection={null}
            loading={loading}
            data={dyData}
            columns={this.columns}
            onChange={this.handleStandardTableChange}
          />
        </div>
        {modalVisible && detailID ? (
          <DetailModal {...parentMethods} modalVisible={modalVisible} showSave={true} />
        ) : null}
      </Card>
    );
  }
}

export default TableList;
