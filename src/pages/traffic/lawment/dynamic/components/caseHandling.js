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
  DatePicker,
  message,
  Divider,
  Modal,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import 'video-react/dist/video-react.css';
import styles from '../../../../style/style.less';
import publicCss from '../../../../style/public.less';

import DetailModal from './caseHandlingModal/modal';
import RegisterModal from './caseHandlingModal/registerModal';
import RegisterUpdateModal from './caseHandlingModal/registerUpdateModal';
import { checkAuth, getLocalStorage, isNumbre } from '@/utils/utils';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const authority = [
  '/lawment/dynamic/casehand/lawCaseClose', // 案件办结
  '/lawment/dynamic/casehand/reviewer', // 案件监察
  '/lawment/dynamic/casehand/principal', // 案件管理
];

const pageBean = { pageNo: 1, pageSize: 10 };
const defaultQuery = { isStatus: 1 };

/* eslint react/no-multi-comp:0 */
@connect(({ DynamicLaw, TrafficApiV2BusData, loading, system, user, Site }) => ({
  Site,
  system,
  currentUser: user.currentUser,
  DynamicLaw,
  loading: loading.models.DynamicLaw,
  TrafficApiV2BusData,
  api2Loading: loading.models.TrafficApiV2BusData,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    registerVisible: false,
    registerUpdateVisible: false,
    formValues: {},
    carNo: '',
    // importLoading: false,
    detailID: 0,
    previewCode: '',
    siteCode: '',
    siteList: [],
    isRegist: 0,
  };

  columns = [
    {
      title: '检测站',
      dataIndex: 'siteName',
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
      title: '审核时间',
      width: 170,
      dataIndex: 'executorTime',
    },
    {
      title: '操作',
      width: 210,
      render: (text, record) => (
        <Fragment>
          <Tooltip placement="left" title="确认车辆信息">
            <Button
              onClick={() => this.showDetailModal(record)}
              type="primary"
              shape="circle"
              icon="file-search"
              size="small"
            />
          </Tooltip>
          <Divider type="vertical" />
          <Tooltip placement="left" title="案件登记">
            <Button
              style={record.isRegist ? { background: 'green', borderColor: 'green' } : null}
              onClick={() => this.showRegisterModal(record)}
              type="primary"
              shape="circle"
              icon="file-protect"
              size="small"
            />
          </Tooltip>
          {this.columnsBtn(record)}
          {checkAuth(authority[0])
            ? !!record.isRegist && (
                <>
                  <Divider type="vertical" />
                  <Tooltip placement="left" title="案件办结">
                    <Button
                      onClick={() => this.lawCaseCloseClick(record)}
                      type="primary"
                      shape="circle"
                      icon="file-done"
                      size="small"
                    />
                  </Tooltip>
                </>
              )
            : null}
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { siteList } = this.props;
    const siteCodes = siteList.map(item => item.code);
    const formValues = { siteCodes };
    this.getList({ ...pageBean, ...defaultQuery, ...formValues });
    this.setState({ siteList, formValues });
  }

  columnsBtn = ({ principalConfirm, reviewerConfirm, previewCode }) => {
    return (
      (!principalConfirm || !reviewerConfirm) && (
        <>
          {checkAuth(authority[1]) &&
            (!reviewerConfirm && (
              <>
                <Divider type="vertical" />
                <Tooltip placement="left" title="案件监察">
                  <Button
                    type="primary"
                    shape="circle"
                    icon="safety-certificate"
                    size="small"
                    onClick={() => this.RPMUtil('DynamicLaw/reviewer', previewCode)}
                  />
                </Tooltip>
              </>
            ))}
          {checkAuth(authority[2]) && (
            <>
              <Divider type="vertical" />
              <Tooltip placement="left" title="案件管理">
                <Button
                  type="primary"
                  shape="circle"
                  icon="profile"
                  size="small"
                  disabled={!reviewerConfirm}
                  onClick={() => this.RPMUtil('DynamicLaw/principal', previewCode)}
                />
              </Tooltip>
            </>
          )}
        </>
      )
    );
  };

  showRegisterModal = record => {
    this.setState({ carNo: record.carNo, detailID: record.id, previewCode: record.previewCode });
    if (record.isRegist) {
      return this.handleRegisterUpdateVisible(true);
    }
    return this.handleRegisterVisible(true);
  };

  showDetailModal = record => {
    this.setState({ detailID: record.id, siteCode: record.siteCode, isRegist: record.isRegist });
    this.handleModalVisible(true);
  };

  lawCaseCloseClick = record => {
    if (!record.isRegist) {
      return Modal.warning({
        title: '系统提示',
        content: '该案件案件登记未完成，请先案件登记',
      });
    }
    const { dispatch } = this.props;
    return Modal.confirm({
      title: '系统提示',
      content: '案件确认无误，办结完成后，将无法进行更改！',
      onOk: () => {
        dispatch({
          type: 'DynamicLaw/lawCaseClose',
          payload: { previewCode: record.previewCode },
          callback: () => {
            this.modalSuccess();
          },
        });
      },
    });
  };

  // 法制审核人确认 案件管理人员确认
  RPMUtil = (url, previewCode) => {
    Modal.confirm({
      title: '系统提示',
      content: '确认当前操作?',
      onOk: () => {
        const { dispatch } = this.props;
        const hide = message.loading('确认中······', 0);
        dispatch({
          type: url,
          payload: previewCode,
          callback: res => {
            if (res === 200) {
              this.modalSuccess();
            }
            hide();
          },
        });
      },
    });
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
      pageNo: pagination.current,
      pageSize: pagination.pageSize,
      ...defaultQuery,
      ...formValues,
    };
    this.getList(params);
  };

  handleFormReset = () => {
    const { form } = this.props;
    const organId = getLocalStorage('organId');
    form.resetFields();
    this.getSite(organId, () => {
      const site = this.getSiteIN();
      this.setState({
        formValues: site,
      });
      this.getList({ ...pageBean, ...defaultQuery, ...site });
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const format = 'YYYY-MM-DDTHH:mm:ss';
      const {
        previewTime,
        siteCodes,
        startOverLoadRate,
        endOverLoadRate,
        startTotalLoad,
        endTotalLoad,
      } = fieldsValue;
      if (startOverLoadRate || endOverLoadRate) {
        if (!isNumbre(startOverLoadRate) || !isNumbre(endOverLoadRate)) {
          message.error('超限幅度请输入数字');
          return;
        }
      }

      if (startTotalLoad || endTotalLoad) {
        if (!isNumbre(startTotalLoad) || !isNumbre(endTotalLoad)) {
          message.error('总重请输入数字');
          return;
        }
      }
      // 时间
      const time = previewTime
        ? {
            startPreviewTime: moment(previewTime[0]).format(format),
            endPreviewTime: moment(previewTime[1]).format(format),
          }
        : {};
      // 站点
      if (!this.getSiteIN().siteCodes.length) {
        message.error('当前机构暂无站点');
        return;
      }
      const site = siteCodes ? [siteCodes] : this.getSiteIN().siteCodes;
      const values = { ...fieldsValue, ...time, siteCodes: site };
      delete values.previewTime;
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

  handleRegisterVisible = flag => {
    this.setState({ registerVisible: !!flag });
  };

  handleRegisterUpdateVisible = flag => {
    this.setState({ registerUpdateVisible: !!flag });
    if (!flag) {
      this.setState({ carNo: '', detailID: 0 });
    }
  };

  treeSelectChange = value => {
    const { form } = this.props;
    form.setFieldsValue({ siteCodes: undefined });
    this.getSite(value);
  };

  getSite = (value, callback) => {
    const { dispatch, siteList } = this.props;
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
        this.setState({ siteList: newSiteList }, () => {
          if (callback) callback(newSiteList);
        });
      },
    });
  };

  modalSuccess = () => {
    message.success('操作成功');
    const { formValues } = this.state;
    this.getList({ ...formValues, ...defaultQuery, ...formValues });
  };

  importClick = () => {
    this.setState({ importLoading: true });
    const { dispatch } = this.props;
    const { formValues } = this.state;
    dispatch({
      type: 'TrafficApiV2BusData/import',
      payload: {
        ...defaultQuery,
        ...formValues,
      },
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
      system: { treeList },
      form: { getFieldDecorator },
    } = this.props;
    const { siteList, importLoading } = this.state;
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
                  <RangePicker
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
          <Col md={10} sm={24} offset={5}>
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
      TrafficApiV2BusData: { dyData },
      api2Loading,
    } = this.props;
    const {
      isRegist,
      modalVisible,
      registerVisible,
      registerUpdateVisible,
      detailID,
      siteCode,
      previewCode,
      carNo,
    } = this.state;

    const parentMethods = {
      handleModalVisible: this.handleModalVisible,
      detailID,
      siteCode,
      modalSuccess: this.modalSuccess,
      loading: api2Loading,
      isRegist,
    };
    const registerBase = {
      carNo,
      detailID,
      previewCode,
      modalSuccess: this.modalSuccess,
    };

    const registerMethods = {
      handleModalVisible: this.handleRegisterVisible,
    };
    const registerUpdateMethods = {
      handleModalVisible: this.handleRegisterUpdateVisible,
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
            loading={api2Loading}
            data={dyData}
            columns={this.columns}
            onChange={this.handleStandardTableChange}
          />
        </div>
        {modalVisible && detailID ? (
          <DetailModal {...parentMethods} modalVisible={modalVisible} />
        ) : null}
        {registerVisible && (
          <RegisterModal {...registerBase} {...registerMethods} modalVisible={registerVisible} />
        )}
        {registerUpdateVisible && (
          <RegisterUpdateModal
            {...registerBase}
            {...registerUpdateMethods}
            modalVisible={registerUpdateVisible}
          />
        )}
      </Fragment>
    );
  }
}

export default TableList;
