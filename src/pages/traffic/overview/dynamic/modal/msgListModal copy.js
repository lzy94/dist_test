import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Form, Select, Button, Modal, Tooltip, Tag } from 'antd';
import 'video-react/dist/video-react.css';
import StandardTable from '@/components/StandardTable';
import ModalIndex from '@/pages/traffic/overview/dynamic/modal/modalIndex';
import styles from '@/pages/style/style.less';
import publicCss from '@/pages/style/public.less';
import themeStyle from '@/pages/style/theme.less';

const FormItem = Form.Item;
const { Option } = Select;

/* eslint react/no-multi-comp:0 */
@connect(({ system, Dynamic, user, loading }) => ({
  currentUser: user.currentUser,
  system,
  systemLoading: loading.models.system,
  Dynamic,
  loading: loading.models.Dynamic,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    detailModalVisible: false,
    siteList: [],
    formValues: [],
    detailId: 0,
    directionkey: 0,
    pageBean: {
      page: 1,
      pageSize: 10,
      showTotal: true,
    },
    baseQuery: [],
  };

  columns = [
    {
      title: '车牌号',
      dataIndex: 'carNo',
      width: 90,
    },
    {
      title: '检查站',
      dataIndex: 'siteName',
    },
    {
      title: '车辆方向',
      dataIndex: 'direction',
    },
    {
      title: '检测时间',
      dataIndex: 'previewTime',
      // width: 160,
      render: val => moment(val).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '消息来源',
      dataIndex: 'msgType',
    },
    {
      title: '速度(km/h)',
      dataIndex: 'speed',
    },
    // {
    //   title: '超速(km/h)',
    //   dataIndex: 'overSpeed',
    //   render: val => (val > 0 ? <Tag color="#FFA500">{val}</Tag> : val),
    // },
    {
      title: '超速比(%)',
      dataIndex: 'overSpeedRate',
      render: val => ((val || 0) * 100).toFixed(2),
    },
    {
      title: '总重(t)',
      dataIndex: 'totalLoad',
      render: val => (val / 1000).toFixed(2),
    },
    {
      title: '核定载重(t)',
      dataIndex: 'weightLimited',
      render: val => ((val || 0) / 1000).toFixed(2),
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
      render: val => (val * 100).toFixed(2),
    },
    {
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
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    const { pageBean } = this.state;
    dispatch({
      type: 'system/userSite',
      payload: {
        siteType: 1,
      },
      callback: res => {
        if (res) {
          const siteList = res.map((item, index) => {
            const key = Object.keys(item);
            return {
              index: index + 1,
              code: key[0],
              name: item[key[0]],
              direction: [item[key[1]], item[key[2]]],
            };
          });
          const baseQuery = [
            {
              property: 'siteCode',
              value: siteList.map(item => item.code),
              group: 'main',
              operation: 'IN',
              relation: 'AND',
            },
            {
              property: 'READ_FLAG',
              value: 0,
              group: 'main',
              operation: 'EQUAL',
              relation: 'AND',
            },
          ];
          this.setState({ siteList, baseQuery });

          dispatch({
            type: 'system/getWarningMsgList',
            payload: {
              pageBean,
              querys: baseQuery,
            },
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

  showDetailModal = id => {
    this.setState({ detailId: id }, () => this.handleDetailModalVisible(true));
  };

  handleDetailModalVisible = flag => {
    this.setState({
      detailModalVisible: !!flag,
    });
    if (!flag) {
      this.setState({ detailId: 0 });
      this.delDetail();

      const { pageBean, formValues, baseQuery, siteList } = this.state;
      const { dispatch } = this.props;
      dispatch({
        type: 'system/warningMsgNotDu',
        payload: { siteCodes: siteList.map(item => item.code).join() },
      });
      dispatch({
        type: 'system/getWarningMsgList',
        payload: {
          pageBean,
          querys: formValues.length ? formValues : baseQuery,
        },
      });
    }
  };

  delDetail = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Dynamic/resetDetail',
    });
  };

  handleStandardTableChange = pagination => {
    const { dispatch } = this.props;
    const { formValues, baseQuery } = this.state;
    const params = {
      pageBean: {
        page: pagination.current,
        pageSize: pagination.pageSize,
        showTotal: true,
      },
      querys: formValues.length ? formValues : baseQuery,
    };

    dispatch({
      type: 'system/getWarningMsgList',
      payload: params,
    });
  };

  renderOption = () => {
    const { siteList } = this.state;
    return siteList.map(item => {
      return (
        <Option key={item.index} value={item.code}>
          {item.name}
        </Option>
      );
    });
  };

  siteChange = (value, option) => {
    const { key } = option;
    const { form } = this.props;

    this.setState({ directionkey: parseInt(key, 10) }, () =>
      form.setFieldsValue({ direction: '' }),
    );
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    const { pageBean, baseQuery } = this.state;
    form.resetFields();
    this.setState({
      directionkey: 0,
      formValues: [],
    });
    dispatch({
      type: 'system/getWarningMsgList',
      payload: {
        pageBean,
        querys: baseQuery,
      },
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { pageBean, siteList } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const arr = [
        {
          property: 'READ_FLAG',
          value: 0,
          group: 'main',
          operation: 'EQUAL',
          relation: 'AND',
        },
        {
          property: 'msgType',
          value: fieldsValue.msgType ? fieldsValue.msgType : '',
          group: 'main',
          operation: 'EQUAL',
          relation: 'AND',
        },
        {
          property: 'direction',
          value: fieldsValue.direction || '',
          group: 'main',
          operation: 'LIKE',
          relation: 'AND',
        },
        {
          property: 'siteCode',
          value: fieldsValue.siteCode || siteList.map(item => item.code),
          group: 'main',
          operation: 'IN',
          relation: 'AND',
        },
      ].filter(item => item.value !== '');
      this.setState({
        formValues: arr,
      });
      dispatch({
        type: 'system/getWarningMsgList',
        payload: {
          pageBean,
          querys: arr,
        },
      });
    });
  };

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { directionkey, siteList } = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 16, xl: 16 }}>
          <Col md={6} sm={24}>
            <div className={publicCss.inputMain}>
              <span
                style={{ width: '70px', lineHeight: '30px', height: '32px' }}
                className="ant-input-group-addon"
              >
                检测点
              </span>
              <FormItem style={{ flex: 1 }}>
                {getFieldDecorator('siteCode')(
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
          <Col md={6} sm={24}>
            <div className={publicCss.inputMain}>
              <span
                style={{ width: '75px', lineHeight: '30px', height: '32px' }}
                className="ant-input-group-addon"
              >
                消息来源
              </span>
              <FormItem style={{ flex: 1 }}>
                {getFieldDecorator('msgType')(
                  <Select className={publicCss.inputGroupLeftRadius} placeholder="请选择">
                    <Option value="车辆超限">车辆超限</Option>
                    <Option value="车辆超速">车辆超速</Option>
                    <Option value="黑名单车辆">黑名单车辆</Option>
                    <Option value="重点关注车辆">重点关注车辆</Option>
                  </Select>,
                )}
              </FormItem>
            </div>
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
                      {siteList[directionkey - 1].direction.map(item => (
                        <Option value={item} key={item}>
                          {item}
                        </Option>
                      ))}
                    </Select>,
                  )}
                </FormItem>
              </div>
            </Col>
          ) : null}
          <Col md={5} sm={24}>
            <div style={{ overflow: 'hidden' }}>
              <Button type="primary" htmlType="submit">
                查询
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
      system: { data },
      systemLoading,
      modalVisible,
      handleModalVisible,
    } = this.props;
    const { detailModalVisible, detailId } = this.state;

    const modalMethods = {
      handleModalVisible: this.handleDetailModalVisible,
      id: detailId,
    };
    return (
      <Fragment>
        <Modal
          destroyOnClose
          title="未读消息通知"
          className={`${themeStyle.myModal} ${themeStyle.modalbody}`}
          visible={modalVisible}
          onCancel={() => handleModalVisible()}
          width="1300px"
          footer={null}
        >
          <div className={themeStyle.detailMsg}>
            <div style={{ padding: 20 }}>
              <div className={styles.tableList}>
                <div className={styles.tableListForm}>{this.renderAdvancedForm()}</div>
                <StandardTable
                  tableAlert={false}
                  selectedRows={0}
                  rowSelection={null}
                  loading={systemLoading}
                  data={data}
                  size="middle"
                  columns={this.columns}
                  onChange={this.handleStandardTableChange}
                />
              </div>
            </div>
          </div>
        </Modal>
        {detailModalVisible && detailId ? (
          <ModalIndex {...modalMethods} modalVisible={detailModalVisible} />
        ) : null}
      </Fragment>
    );
  }
}

export default TableList;
