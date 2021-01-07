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
  TreeSelect,
  Tooltip,
  Descriptions,
} from 'antd';
import { Redirect } from 'umi';
import StandardTable from '@/components/StandardTable';
import { checkAuth } from '@/utils/utils';

import styles from '../../../style/style.less';
import publicCss from '../../../style/public.less';
import themeStyle from '@/pages/style/theme.less';

const FormItem = Form.Item;
const { Option } = Select;

const cardType = ['身份证', '执法证', '军官证', '护照', '其他'];
const carType = [
  '',
  '小型载货汽车',
  '拖拉机',
  '畜力车',
  '中型载货汽车',
  '大型载货汽车',
  '特大型载货汽车',
  '拖挂车',
  '集装箱车',
  '小型客车',
  '大型客车',
  '摩托车',
];

const authority = ['/comquery/vehicle'];

const UpdateForm = Form.create()(props => {
  const { modalVisible, handleUpdateModalVisible, detail } = props;
  return (
    <Modal
      destroyOnClose
      title="货运车辆详情"
      className={themeStyle.myModal + ' ' + themeStyle.modalbody}
      visible={modalVisible}
      onCancel={() => handleUpdateModalVisible()}
      width={800}
      footer={null}
    >
      <div className={themeStyle.detailMsg}>
        <div style={{ padding: 20 }}>
          <Descriptions bordered={true} size="small" column={2}>
            <Descriptions.Item label="车牌号">{detail.carCode}</Descriptions.Item>
            <Descriptions.Item label="车品牌型号">{detail.carBrand}</Descriptions.Item>
            <Descriptions.Item label="货车类型">{carType[detail.carType]}</Descriptions.Item>
            <Descriptions.Item label="发动机号">{detail.engineCode}</Descriptions.Item>
            <Descriptions.Item label="车主">{detail.vehicleOwner}</Descriptions.Item>
            <Descriptions.Item label="证件类型">
              {cardType[parseInt(detail.legalRepresent) - 1]}
            </Descriptions.Item>
            <Descriptions.Item label="证件号码">{detail.idCardNo}</Descriptions.Item>
            <Descriptions.Item label="道路运输证号">{detail.transportLicence}</Descriptions.Item>
            <Descriptions.Item label="车辆状态">
              {parseInt(detail.carrierNo) ? '运营' : '停运'}
            </Descriptions.Item>
            <Descriptions.Item label="总重量(kg)">{detail.weight}</Descriptions.Item>
            <Descriptions.Item label="核定载重量(kg)">{detail.limitedWeight}</Descriptions.Item>
            <Descriptions.Item label="车货长宽高(m)">{detail.limited}</Descriptions.Item>
            <Descriptions.Item label="轴数">
              {detail.axisNum === 'other' ? '其它' : detail.axisNum}
            </Descriptions.Item>
            <Descriptions.Item label="经营范围">{detail.manageRang}</Descriptions.Item>
            <Descriptions.Item label="有效截止日期">
              {moment(detail.effectiveDate).format('YYYY-MM-DD')}
            </Descriptions.Item>
            <Descriptions.Item label="技术等级">{detail.technicalGrade}</Descriptions.Item>
            <Descriptions.Item label="下次技术评定日期">
              {moment(detail.nextCheckTechnical).format('YYYY-MM-DD')}
            </Descriptions.Item>
            <Descriptions.Item label="下次年审日期">
              {moment(detail.nextAnnualReview).format('YYYY-MM-DD')}
            </Descriptions.Item>
            <Descriptions.Item label="是否所属货运企业">
              {parseInt(detail.isTransportCompany) ? '是' : '否'}
            </Descriptions.Item>
            <Descriptions.Item label="货运企业">{detail.transportCompanyName}</Descriptions.Item>
            <Descriptions.Item label="是否所属源头企业">
              {parseInt(detail.isSourceCompany) ? '是' : '否'}
            </Descriptions.Item>
            <Descriptions.Item label="源头企业">{detail.transportSourceName}</Descriptions.Item>
          </Descriptions>
        </div>
      </div>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ system, Vehicle, loading }) => ({
  treeList: system.treeList,
  Vehicle,
  loading: loading.models.Vehicle,
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
      title: '车牌号码',
      dataIndex: 'carCode',
    },
    {
      title: '车主',
      dataIndex: 'vehicleOwner',
    },
    {
      title: '经营范围',
      dataIndex: 'manageRang',
    },
    {
      title: '核定载重量',
      dataIndex: 'limitedWeight',
    },
    {
      title: '道路运输证号',
      dataIndex: 'transportLicence',
    },
    {
      title: '车货长宽高',
      dataIndex: 'limited',
    },
    {
      title: '轴数',
      dataIndex: 'axisNum',
      render: val => (val === 'other' ? '其它' : val),
    },
    {
      title: '操作',
      width: 70,
      render: (text, record) => (
        <Fragment>
          <Tooltip placement="left" title="详情">
            <Button
              onClick={() => this.showModal(record.id)}
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
    const { pageBean } = this.state;
    this.getList({ pageBean });
  }

  showModal = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Vehicle/detail',
      payload: id,
      callback: res => {
        this.setState({ detail: res });
        this.handleUpdateModalVisible(true);
      },
    });
  };

  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Vehicle/fetch',
      payload: params,
    });
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
    const { dispatch, form } = this.props;
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
              operation: item === 'organCode' ? 'RIGHT_LIKE' : 'LIKE',
              relation: 'AND',
            }
          : '';
      });
      const conditionFilter = condition.filter(item => item);
      this.setState({
        formValues: conditionFilter,
      });
      dispatch({
        type: 'Vehicle/fetch',
        payload: { pageBean, querys: conditionFilter },
      });
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
    });
  };

  renderSimpleForm() {
    const {
      treeList,
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 16, xl: 16 }}>
          <Col md={5} sm={24}>
            <div className={publicCss.inputMain}>
              <span
                style={{ width: '80px', lineHeight: '30px', height: '32px' }}
                className="ant-input-group-addon"
              >
                所属机构
              </span>
              <FormItem style={{ flex: 1 }}>
                {getFieldDecorator('organCode')(
                  <TreeSelect
                    className={publicCss.inputGroupLeftRadius}
                    treeData={treeList}
                    style={{ width: '100%' }}
                    placeholder="请选择"
                  />,
                )}
              </FormItem>
            </div>
          </Col>
          <Col md={5} sm={24}>
            <FormItem>{getFieldDecorator('carCode')(<Input addonBefore="车牌号" />)}</FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem>{getFieldDecorator('vehicleOwner')(<Input addonBefore="车主" />)}</FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('transportLicence')(<Input addonBefore="道路运输证号" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <div className={publicCss.inputMain}>
              <span
                style={{ width: '50px', lineHeight: '30px', height: '32px' }}
                className="ant-input-group-addon"
              >
                轴数
              </span>
              <FormItem style={{ flex: 1 }}>
                {getFieldDecorator('axisNum')(
                  <Select className={publicCss.inputGroupLeftRadius} style={{ width: '100%' }}>
                    <Option value="">全部轴数</Option>
                    <Option value="2">2</Option>
                    <Option value="3">3 </Option>
                    <Option value="4">4</Option>
                    <Option value="5">5</Option>
                    <Option value="6">6</Option>
                    <Option value="other">其它</Option>
                  </Select>,
                )}
              </FormItem>
            </div>
          </Col>
        </Row>
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
      </Form>
    );
  }

  render() {
    const {
      Vehicle: { data },
      loading,
    } = this.props;
    const { updateModalVisible, detail, isTransportCompany, isSourceCompany } = this.state;
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
      loading,
      detail,
      transportCompanyChange: this.transportCompanyChange,
      sourceCompanyChange: this.sourceCompanyChange,
      isTransportCompany,
      isSourceCompany,
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
