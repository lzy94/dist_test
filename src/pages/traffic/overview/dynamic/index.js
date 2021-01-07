import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Redirect } from 'umi';
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
  Radio,
  Tooltip,
  Tag,
  TreeSelect,
  DatePicker,
  message,
} from 'antd';
import 'video-react/dist/video-react.css';
import StandardTable from '@/components/StandardTable';
import ModalIndex from './modal/modalIndex';
import styles from '@/pages/style/style.less';
import publicCss from '@/pages/style/public.less';

import { checkAuth, getLocalStorage, isNumbre } from '@/utils/utils';

const authority = ['/overview/dynamic', '/overview/dynamic/info', '/overview/dynamic/export'];

const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;
const pageBean = {
  pageNo: 1,
  pageSize: 10,
};

/* eslint react/no-multi-comp:0 */
@connect(({ system, TrafficApiV2BusData, user, loading }) => ({
  currentUser: user.currentUser,
  system,
  TrafficApiV2BusData,
  loading: loading.models.TrafficApiV2BusData,
  // Dynamic,
  // loading: loading.models.Dynamic,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    detailModalVisible: false,
    formValues: {},
    siteList: [],
    newSiteList: [],
    detailId: 0,
    // importLoading: false,
    directionkey: 0,
  };

  columns = [
    {
      title: '检查站',
      dataIndex: 'siteName',
      width: 190,
      render: val =>
        val.length > 12 ? <Tooltip title={val}>{val.substring(0, 12)}...</Tooltip> : val,
    },
    {
      title: '车牌号',
      dataIndex: 'carNo',
    },
    {
      title: '车辆方向',
      dataIndex: 'direction',
    },
    {
      title: '检测时间',
      dataIndex: 'previewTime',
      width: 160,
      render: val => moment(val).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '速度(km/h)',
      dataIndex: 'speed',
      width: 90,
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
      width: 100,
      render: val => (val * 100).toFixed(2),
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
    dispatch({
      type: 'system/userSite',
      payload: {
        siteType: 1,
      },
      callback: res => {
        if (res.length) {
          const siteList = res.map((item, index) => {
            const key = Object.keys(item);
            return {
              index: index + 1,
              code: key[0],
              name: item[key[0]],
              direction: [item[key[1]], item[key[2]]].filter(cell => cell),
            };
          });
          const siteCodes = res.map(item => Object.keys(item)[0]);
          this.setState({ siteList, newSiteList: siteList, formValues: { siteCodes } });
          this.getList({
            ...pageBean,
            siteCodes,
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

  getList = parmas => {
    const { dispatch } = this.props;
    dispatch({
      type: 'TrafficApiV2BusData/busDynamicDataForPage',
      payload: {
        ...parmas,
      },
    });
  };

  getSiteIN = () => {
    const { newSiteList } = this.state;
    return { siteCodes: newSiteList.map(item => item.code) };
  };

  showDetailModal = id => {
    this.setState({ detailId: id }, () => this.handleDetailModalVisible(true));
  };

  handleDetailModalVisible = flag => {
    this.setState({
      detailModalVisible: !!flag,
    });
    if (!flag) {
      this.setState({ detailId: 0 });
      this.resetDetail();
    }
  };

  resetDetail = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'TrafficApiV2BusData/resetDetail' });
  };

  handleStandardTableChange = pagination => {
    const { formValues } = this.state;
    const params = {
      pageNo: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
    };
    this.getList(params);
  };

  /**
   * @description 重置
   */
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    const organId = getLocalStorage('organId');

    this.getSite(organId, () => {
      const site = this.getSiteIN();
      this.setState({
        formValues: site,
        directionkey: 0,
      });
      this.getList({ ...pageBean, ...site });
    });
  };

  /**
   * @description 关键字搜索
   * @param {*} e
   */
  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const format = 'YYYY-MM-DDTHH:mm:ss';
      // 时间
      const {
        previewTime,
        otherSearch,
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
      const time = previewTime
        ? {
            startPreviewTime: moment(previewTime[0]).format(format),
            endPreviewTime: moment(previewTime[1]).format(format),
          }
        : {};
      // 超限超速
      let other = {};
      if (otherSearch) {
        const otherSearchs = otherSearch.split('_');
        other = {
          [otherSearchs[0]]: otherSearchs[1],
        };
      }
      // 站点
      if (!this.getSiteIN().siteCodes.length) {
        message.error('当前机构暂无站点');
        return;
      }
      const site = siteCodes ? [siteCodes] : this.getSiteIN().siteCodes;
      const values = {
        ...fieldsValue,
        ...time,
        ...other,
        siteCodes: site,
      };
      delete values.previewTime;
      delete values.otherSearch;
      delete values.name;
      this.setState({ formValues: values });
      this.getList({ ...pageBean, ...values });
    });
  };

  siteChange = (value, option) => {
    const { key } = option;
    const { form } = this.props;

    this.setState({ directionkey: parseInt(key, 10) }, () =>
      form.setFieldsValue({ direction: undefined }),
    );
  };

  renderOption = () => {
    const { newSiteList } = this.state;
    return newSiteList.map(item => (
      <Option key={item.index} value={item.code}>
        {item.name}
      </Option>
    ));
  };

  importClick = () => {
    this.setState({ importLoading: true });
    const { dispatch } = this.props;
    const { formValues } = this.state;

    dispatch({
      type: 'TrafficApiV2BusData/import',
      payload: formValues,
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
        const newSiteList = res
          .map((item, index) => {
            if (item.siteType === '1') {
              return {
                index: index + 1,
                code: item.siteCode,
                name: item.siteName,
                direction: [item.forwardDirection, item.reverseDirection].filter(cell => cell),
              };
            }
            return '';
          })
          .filter(item => item);
        this.setState({ newSiteList }, () => {
          if (callback) callback(newSiteList);
        });
      },
    });
  };

  treeSelectChange = value => {
    const { form } = this.props;
    form.setFieldsValue({ siteCodes: undefined });
    this.getSite(value);
    this.setState({ directionkey: 0 });
  };

  renderSearchBotton = () => {
    const { importLoading } = this.state;
    return (
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
    );
  };

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
      // Dynamic: {siteList}
      system: { treeList },
    } = this.props;
    const { directionkey, newSiteList } = this.state;

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
          <Col md={5} sm={24}>
            <div className={publicCss.inputMain}>
              <span
                style={{ width: '70px', lineHeight: '30px', height: '32px' }}
                className="ant-input-group-addon"
              >
                检测点
              </span>
              <FormItem style={{ flex: 1 }}>
                {getFieldDecorator('siteCodes')(
                  <Select
                    onChange={this.siteChange}
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
          {directionkey ? (
            <Col md={4} sm={24}>
              <div className={publicCss.inputMain}>
                <span
                  style={{ width: '60px', lineHeight: '30px', height: '32px' }}
                  className="ant-input-group-addon"
                >
                  方向
                </span>
                <FormItem style={{ flex: 1 }}>
                  {getFieldDecorator('direction', {})(
                    <Select style={{ width: '100%' }} placeholder="请选择">
                      {newSiteList[directionkey - 1].direction.map(item => (
                        <Option value={item} key={`${item}`}>
                          {item}
                        </Option>
                      ))}
                    </Select>,
                  )}
                </FormItem>
              </div>
            </Col>
          ) : null}
          <Col md={6} sm={24}>
            <FormItem>
              {getFieldDecorator('otherSearch', {})(
                <RadioGroup>
                  {/* <Radio value="overSpeed">只看超速</Radio> */}
                  <Radio value="overLoadFlag_1">只看超限</Radio>
                  <Radio value="readFlag_2">只看未读预警信息</Radio>
                </RadioGroup>,
              )}
            </FormItem>
          </Col>
          {directionkey ? null : (
            <Col md={6} sm={24} style={{ float: 'right' }}>
              {this.renderSearchBotton()}
            </Col>
          )}
        </Row>
        {directionkey ? this.renderSearchBotton() : null}
      </Form>
    );
  }

  render() {
    const {
      TrafficApiV2BusData: { dyData },
      loading,
    } = this.props;
    const { detailModalVisible, detailId } = this.state;

    const modalMethods = {
      handleModalVisible: this.handleDetailModalVisible,
      id: detailId,
    };
    return (
      <Fragment>
        {checkAuth(authority[0]) ? null : <Redirect to="/exception/403" />}
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderAdvancedForm()}</div>
            <StandardTable
              tableAlert={false}
              selectedRows={0}
              rowSelection={null}
              loading={loading}
              data={dyData}
              size="middle"
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        {detailModalVisible && detailId ? (
          <ModalIndex {...modalMethods} modalVisible={detailModalVisible} />
        ) : null}
      </Fragment>
    );
  }
}

export default TableList;
