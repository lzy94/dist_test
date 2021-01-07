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
  Tag,
  Modal,
  TreeSelect,
  DatePicker,
  Descriptions,
  Card,
  Tooltip,
} from 'antd';
import { Redirect } from 'umi';
import StandardTable from '@/components/StandardTable';
// import MyDatePicker from '@/components/MyDatePicker';
import { checkAuth, getLocalStorage, imgUrl } from '@/utils/utils';
import Zmage from 'react-zmage';
import styles from '../../../style/style.less';
import publicCss from '../../../style/public.less';
import themeStyle from '@/pages/style/theme.less';

const FormItem = Form.Item;
const { Option } = Select;
const authority = ['/lawment/speed'];

const DetailModal = Form.create()(props => {
  const { handleModalVisible, modalVisible, detail } = props;

  const renderImg = () => {
    // eslint-disable-next-line no-unused-expressions
    const img = ['oneUrl', 'twoUrl', 'threeUrl'];
    return img.map((item, index) => (
      <div
        key={index}
        style={{ overflow: 'hidden', width: 100, height: 100, marginRight: 20, float: 'left' }}
      >
        <Zmage
          backdrop="rgba(255,255,255,.3)"
          src={imgUrl + detail[item]}
          alt="图片"
          style={{
            height: '100px',
          }}
        />
      </div>
    ));
  };

  return (
    <Modal
      destroyOnClose
      title="详情"
      className={themeStyle.myModal + ' ' + themeStyle.modalbody}
      visible={modalVisible}
      footer={null}
      onCancel={() => handleModalVisible()}
      width={800}
    >
      <div className={themeStyle.detailMsg}>
        <div style={{ padding: 20 }}>
          <Descriptions bordered={true} size="small" column={2}>
            <Descriptions.Item label="检测站">{detail.siteName}</Descriptions.Item>
            <Descriptions.Item label="检测时间">{detail.previewTime}</Descriptions.Item>
            <Descriptions.Item label="车牌号码">{detail.carNo}</Descriptions.Item>
            <Descriptions.Item label="速度(km/h)">{detail.speed}</Descriptions.Item>
            <Descriptions.Item label="限速(km/h)">{detail.speedLimit}</Descriptions.Item>
            <Descriptions.Item label="违章类别">{detail.violationName}</Descriptions.Item>
            <Descriptions.Item label="图片" span={2}>
              {renderImg()}
            </Descriptions.Item>
          </Descriptions>
        </div>
      </div>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ Speed, loading, system, Site }) => ({
  Site,
  system,
  Speed,
  loading: loading.models.Speed,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    formValues: [],
    detail: {},
    siteList: [],
    organCode: '',
    newSiteList: [],
    pageBean: {
      page: 1,
      pageSize: 10,
      showTotal: true,
    },
    baseQuery: [],
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
      title: '速度(km/h)',
      dataIndex: 'speed',
    },
    {
      title: '限速(km/h)',
      dataIndex: 'speedLimit',
      render: val => <Tag color="#87d068">{val}</Tag>,
    },
    {
      title: '违章类别',
      dataIndex: 'violationName',
    },
    {
      title: '操作',
      width: 70,
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
    if (!checkAuth(authority[0])) return;
    const { pageBean, baseQuery } = this.state;
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
          const siteIN = [
            {
              property: 'siteCode',
              value: siteList.map(item => item.code),
              group: 'main',
              operation: 'IN',
              relation: 'AND',
            },
          ];
          this.setState({ siteList, newSiteList: siteList });
          this.getList({ pageBean, querys: baseQuery.concat(siteIN) });
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
    const { dispatch } = this.props;
    dispatch({
      type: 'Speed/detail',
      payload: { id },
      callback: res => {
        this.setState({ detail: res });
        this.handleModalVisible(true);
      },
    });
  };

  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Speed/fetch',
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

  handleStandardTableChange = pagination => {
    const { formValues, baseQuery } = this.state;

    const params = {
      pageBean: {
        page: pagination.current,
        pageSize: pagination.pageSize,
        showTotal: true,
      },
      querys: baseQuery.concat(formValues.length ? formValues : this.getSiteIN()),
    };
    this.getList(params);
  };

  handleFormReset = () => {
    const { form } = this.props;
    const { pageBean, baseQuery } = this.state;
    const organId = getLocalStorage('organId');
    form.resetFields();
    this.setState({
      formValues: [],
      organCode: '',
    });
    this.getSite(organId, () => {
      this.getList({ pageBean, querys: baseQuery.concat(this.getSiteIN()) });
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { pageBean, baseQuery, organCode } = this.state;
      // const organId = getLocalStorage('organId');

      const arr = [
        fieldsValue.siteCode
          ? {
              property: 'siteCode',
              value: fieldsValue.siteCode || '',
              group: 'main',
              operation: 'EQUAL',
              relation: 'AND',
            }
          : this.getSiteIN()[0].value.length
          ? this.getSiteIN()[0]
          : {},
        {
          property: 'previewTime',
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
          property: 'speed',
          value:
            fieldsValue.speedStart && fieldsValue.speedEnd
              ? [fieldsValue.speedStart, fieldsValue.speedEnd]
              : '',
          group: 'main',
          operation: 'BETWEEN',
          relation: 'AND',
        },
        {
          property: 'carNo',
          value: fieldsValue.carNo || '',
          group: 'main',
          operation: 'LIKE',
          relation: 'AND',
        },
        {
          property: 'violationName',
          value: fieldsValue.violationName || '',
          group: 'main',
          operation: 'LIKE',
          relation: 'AND',
        },
      ];
      const newArr = arr.filter(item => item.value);
      this.setState({
        formValues: newArr,
      });
      this.getList({ pageBean, querys: baseQuery.concat(newArr) });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
    if (!!!flag) {
      this.setState({
        detail: {},
      });
    }
  };

  treeSelectChange = (value, label) => {
    this.getSite(value);
    this.setState({ organCode: value });
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
        this.setState({ newSiteList: newSiteList });
        callback && callback(newSiteList);
      },
    });
  };

  renderSimpleForm() {
    const {
      system: { treeList },
      form: { getFieldDecorator },
    } = this.props;
    const { newSiteList } = this.state;
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
                {getFieldDecorator('siteCode')(
                  <Select
                    dropdownMatchSelectWidth={false}
                    className={publicCss.inputGroupLeftRadius}
                    placeholder="请选择"
                  >
                    {newSiteList.map((item, index) => (
                      <Option key={index} value={item.code}>
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
              <FormItem style={{ display: 'inline-block', width: '50%' }}>
                {getFieldDecorator('speedStart')(
                  <Input
                    className={
                      publicCss.inputGroupRightRadius + ' ' + publicCss.inputGroupRightborder
                    }
                    addonBefore="速度(km)"
                    placeholder="请输入"
                    style={{ width: '100%', borderRight: 0 }}
                  />,
                )}
              </FormItem>
              <FormItem style={{ display: 'inline-block', width: '50%' }}>
                {getFieldDecorator('speedEnd')(
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
            {getFieldDecorator('violationName')(
              <Input addonBefore="违章类别" placeholder="请输入" />,
            )}
          </Col>

          <Col md={5} sm={24} style={{ float: 'right' }}>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ float: 'right', marginBottom: 24 }}>
                <Button type="primary" htmlType="submit">
                  查询
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
      Speed: { data },
      loading,
    } = this.props;
    const { modalVisible, detail } = this.state;

    const parentMethods = {
      detail,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <Fragment>
        {checkAuth(authority[0]) ? null : <Redirect to="/exception/403" />}
        <Card bordered={false}>
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
        </Card>
        {modalVisible && JSON.stringify(detail) !== '{}' ? (
          <DetailModal {...parentMethods} modalVisible={modalVisible} />
        ) : null}
      </Fragment>
    );
  }
}

export default TableList;
