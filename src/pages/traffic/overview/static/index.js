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
  DatePicker,
  Tooltip,
  Tag,
  TreeSelect,
  Icon,
  message,
} from 'antd';
import { Redirect } from 'umi';
import StandardTable from '@/components/StandardTable';
// import MyDatePicker from '@/components/MyDatePicker';
import { checkAuth, getLocalStorage } from '@/utils/utils';
import styles from '../../../style/style.less';
import publicCss from '../../../style/public.less';
import DetailModal from './modal';

const authority = ['/overview/static', '/overview/static/info', '/overview/static/export'];

const FormItem = Form.Item;
const { Option } = Select;

/* eslint react/no-multi-comp:0 */
@connect(({ Static, loading, system, Site }) => ({
  system,
  Site,
  Static,
  loading: loading.models.Static,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    formValues: [],
    siteList: [],
    newSiteList: [],
    detailID: '',
    organCode: '',
    importLoading: false,
    pageBean: {
      page: 1,
      pageSize: 10,
      showTotal: true,
    },
  };

  columns = [
    {
      title: '监测站',
      dataIndex: 'siteName',
    },
    {
      title: '车牌号',
      dataIndex: 'carNo',
    },
    {
      title: '检测时间',
      dataIndex: 'previewTime',
      width: 170,
      render: val => moment(val).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '轴数',
      dataIndex: 'axleNumber',
    },
    {
      title: '总重(t)',
      dataIndex: 'totalLoad',
      render: val => (val / 1000).toFixed(2),
    },
    {
      title: '限重(t)',
      dataIndex: 'weightLimited',
      render: val => <Tag color="#87d068">{(val / 1000).toFixed(2)} </Tag>,
    },
    {
      title: '超重(t)',
      dataIndex: 'overLoad',
      // render: val => (val / 1000).toFixed(2)
      render: val =>
        val > 0 ? <Tag color="#f5222d">{(val / 1000).toFixed(2)}</Tag> : (val / 1000).toFixed(2),
    },
    {
      title: '超重比(%)',
      dataIndex: 'overLoadRate',
      render: val => (val * 1).toFixed(2),
    },
    checkAuth(authority[1])
      ? {
          title: '操作',
          width: '80px',
          render: (text, record) => (
            <Fragment>
              <Tooltip placement="left" title="详情">
                <Button
                  onClick={() => this.showDetailModal(record.id)}
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
      type: 'system/userSite',
      payload: {
        siteType: 2,
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
          this.setState({ siteList, newSiteList: siteList });
          const organId = getLocalStorage('organId');
          const organs = [
            {
              property: 'organCode',
              value: organId,
              group: 'main',
              operation: 'RIGHT_LIKE',
              relation: 'AND',
            },
          ];

          this.getList({
            pageBean,
            querys: [
              {
                property: 'siteCode',
                value: res.map(item => Object.keys(item)[0]),
                group: 'main',
                operation: 'IN',
                relation: 'AND',
              },
            ].concat(organs),
          });
        } else {
          Modal.error({
            title: '提示',
            content: '您没有绑定站点！！！',
          });
        }
      },
    });
  }

  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Static/fetch',
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

  getSiteIN = () => {
    const { newSiteList } = this.state;
    return [
      {
        property: 'siteCode',
        value: newSiteList.map(item => item.code),
        group: 'main',
        operation: 'IN',
        relation: 'AND',
      },
    ];
  };

  showDetailModal = id => {
    this.setState({ detailID: id });
    this.handleModalVisible(true);
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { formValues } = this.state;

    const params = {
      pageBean: {
        page: pagination.current,
        pageSize: pagination.pageSize,
        showTotal: true,
      },
      querys: !formValues.join() ? this.getSiteIN() : formValues,
    };

    this.getList(params);
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    const { pageBean } = this.state;
    form.resetFields();
    this.setState({
      formValues: [],
      organCode: '',
    });
    const organId = getLocalStorage('organId');
    const organs = [
      {
        property: 'organCode',
        value: organId,
        group: 'main',
        operation: 'RIGHT_LIKE',
        relation: 'AND',
      },
    ];

    this.getSite(organId, () => {
      this.getList({
        pageBean,
        querys: this.getSiteIN().concat(organs),
      });
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { pageBean, organCode } = this.state;
      const organId = getLocalStorage('organId');
      let arr = [
        fieldsValue.siteCode
          ? {
              property: 'siteCode',
              value: fieldsValue.siteCode,
              group: 'main',
              operation: 'IN',
              relation: 'AND',
            }
          : this.getSiteIN()[0].value.length
          ? this.getSiteIN()[0]
          : {},
        {
          property: 'carNo',
          value: fieldsValue.carNo || '',
          group: 'main',
          operation: 'LIKE',
          relation: 'AND',
        },
        {
          property: 'axleNumber',
          value: fieldsValue.axleNumber === 'other' ? 6 : fieldsValue.axleNumber || '',
          group: 'main',
          operation: fieldsValue.axleNumber === 'other' ? 'GREAT' : 'EQUAL',
          relation: 'AND',
        },
        {
          property: 'previewTime',
          // value: pickerValue[0] && pickerValue[1] ? pickerValue : '',
          value: fieldsValue.previewTime
            ? [
                moment(fieldsValue.previewTime[0]).format('YYYY-MM-DD HH:mm:ss'),
                moment(fieldsValue.previewTime[1]).format('YYYY-MM-DD HH:mm:ss'),
              ]
            : '',
          group: 'main',
          operation: 'BETWEEN',
          relation: 'AND',
        },
        {
          property: 'totalLoad',
          value:
            fieldsValue.totalLoadStart && fieldsValue.totalLoadEnd
              ? [fieldsValue.totalLoadStart * 1000, fieldsValue.totalLoadEnd * 1000]
              : '',
          group: 'main',
          operation: 'BETWEEN',
          relation: 'AND',
        },
        {
          property: 'overLoadRate',
          value:
            fieldsValue.overLoadRateStart && fieldsValue.overLoadRateEnd
              ? [fieldsValue.overLoadRateStart / 100, fieldsValue.overLoadRateEnd / 100]
              : '',
          group: 'main',
          operation: 'BETWEEN',
          relation: 'AND',
        },
      ].filter(item => item.value);
      arr.unshift({
        property: 'organCode',
        value: organCode ? organCode : organId,
        group: 'main',
        operation: 'RIGHT_LIKE',
        relation: 'AND',
      });
      this.setState({
        formValues: arr,
      });
      this.getList({
        pageBean,
        querys: arr,
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  renderOption = () => {
    const { newSiteList } = this.state;
    return newSiteList.map(item => {
      return (
        <Option key={item.code} value={item.code}>
          {item.name}
        </Option>
      );
    });
  };

  importClick = () => {
    this.setState({ importLoading: true });
    const { dispatch } = this.props;
    const { formValues, pageBean } = this.state;
    dispatch({
      type: 'Static/import',
      payload: { pageBean, querys: formValues },
      callback: status => {
        if (status === 404) {
          message.error('暂无数据');
        }
        this.setState({ importLoading: false });
      },
    });
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
          if (item.siteType === '2') {
            return {
              code: item.siteCode,
              name: item.siteName,
            };
          }
          return '';
        });
        this.setState({ newSiteList });
        callback && callback(newSiteList);
      },
    });
  };

  treeSelectChange = (value, label) => {
    const { form } = this.props;
    form.setFieldsValue({ siteCode: '' });
    this.getSite(value);
    this.setState({ organCode: value });
  };

  modalSuccess = () => {
    const { pageBean, formValues } = this.state;
    this.getList({
      pageBean,
      querys: formValues.length ? formValues : this.getSiteIN(),
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      system: { treeList },
    } = this.props;
    const organId = getLocalStorage('organId').toString();
    const { importLoading } = this.state;
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
          <Col md={5} sm={24}>
            <div className={publicCss.inputMain}>
              <span
                style={{ width: '60px', lineHeight: '30px', height: '32px' }}
                className="ant-input-group-addon"
              >
                站点
              </span>
              <FormItem style={{ flex: 1 }}>
                {getFieldDecorator('siteCode')(
                  <Select
                    dropdownMatchSelectWidth={false}
                    className={publicCss.inputGroupLeftRadius}
                    placeholder="请选择"
                  >
                    {this.renderOption()}
                  </Select>,
                )}
              </FormItem>
            </div>
          </Col>
          <Col md={4} sm={24}>
            <FormItem>
              {getFieldDecorator('carNo')(<Input addonBefore="车牌号" placeholder="请输入" />)}
            </FormItem>
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

            {/* <div className={publicCss.inputMain}>
              <span
                style={{ width: '80px', lineHeight: '30px', height: '32px' }}
                className="ant-input-group-addon"
              >
                检测时间
              </span>
              <MyDatePicker value={pickerValue} getValue={val => this.setPickerValue(val)} />
            </div> */}
          </Col>
        </Row>
        <Row gutter={16}>
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
          <Col md={5} sm={24}>
            <Input.Group compact>
              <FormItem style={{ display: 'inline-block', width: '60%' }}>
                {getFieldDecorator('overLoadRateStart')(
                  <Input
                    className={
                      publicCss.inputGroupRightRadius + ' ' + publicCss.inputGroupRightborder
                    }
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
          <Col md={6} sm={24} style={{ float: 'right' }}>
            <div className={styles.submitButtons} style={{ float: 'right' }}>
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
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      Static: { data },
      loading,
    } = this.props;
    const { modalVisible, detailID } = this.state;

    const parentMethods = {
      handleModalVisible: this.handleModalVisible,
      detailID: detailID,
      modalSuccess: this.modalSuccess,
    };
    return (
      <Fragment>
        {checkAuth(authority[0]) ? null : <Redirect to="/exception/403" />}
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <StandardTable
              tableAlert={false}
              selectedRows={0}
              rowSelection={null}
              loading={loading}
              data={data}
              size="middle"
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
