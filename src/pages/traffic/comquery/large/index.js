import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  TreeSelect,
  Modal,
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

const authority = ['/comquery/large'];

const cardType = ['身份证', '执法证', '军官证', '护照', '其他'];

const UpdateForm = Form.create()(props => {
  const { modalVisible, handleUpdateModalVisible, detail } = props;
  return (
    <Modal
      destroyOnClose
      title="大件运输信息详情"
      className={themeStyle.myModal + ' ' + themeStyle.modalbody}
      visible={modalVisible}
      onCancel={() => handleUpdateModalVisible()}
      width={800}
      footer={null}
    >
      <div className={themeStyle.detailMsg}>
        <div style={{ padding: 20 }}>
          <Descriptions bordered={true} column={2} size="small">
            <Descriptions.Item label="超限许可证号">{detail.licenceCode}</Descriptions.Item>
            <Descriptions.Item label="车牌号">{detail.carCode}</Descriptions.Item>
            <Descriptions.Item label="道路运输证号">{detail.transportCode}</Descriptions.Item>
            <Descriptions.Item label="承运人名称">{detail.carrier}</Descriptions.Item>
            <Descriptions.Item label="法人代表">{detail.legalRepresent}</Descriptions.Item>
            <Descriptions.Item label="法人代表证件类型">
              {cardType[detail.idCardType - 1]}
            </Descriptions.Item>
            <Descriptions.Item label="法人代表证件号码">{detail.licenceCode}</Descriptions.Item>
            <Descriptions.Item label="联系电话">{detail.phone}</Descriptions.Item>
            <Descriptions.Item label="承运协议号">{detail.carrierNo}</Descriptions.Item>
            <Descriptions.Item label="货物名称">{detail.goodsName}</Descriptions.Item>
            <Descriptions.Item label="货物重量(t)">{detail.goodsWeight}</Descriptions.Item>
            <Descriptions.Item label="车货长宽高(m)">{detail.limited}</Descriptions.Item>
            <Descriptions.Item label="出发地">{detail.placeDeparture}</Descriptions.Item>
            <Descriptions.Item label="目的地">{detail.destination}</Descriptions.Item>
            <Descriptions.Item label="运输周期" span={2}>
              {detail.transportCycle}
            </Descriptions.Item>
            <Descriptions.Item label="是否所属货运企业">
              {detail.isTransportCompany ? '是' : '否'}
            </Descriptions.Item>
            <Descriptions.Item label="货运企业">{detail.transportCompanyName}</Descriptions.Item>
            <Descriptions.Item label="是否所属源头企业">
              {detail.isSourceCompany ? '是' : '否'}
            </Descriptions.Item>
            <Descriptions.Item label="源头企业">{detail.transportSourceName}</Descriptions.Item>
          </Descriptions>
        </div>
      </div>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ system, Large, loading }) => ({
  treeList: system.treeList,
  Large,
  loading: loading.models.Large,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    updateModalVisible: false,
    formValues: [],
    detail: {},
    defaultFormValue: {
      property: 'isDele',
      value: '0',
      group: 'main',
      operation: 'NOT_EQUAL',
      relation: 'AND',
    },
    pageBean: {
      page: 1,
      pageSize: 10,
      showTotal: true,
    },
  };

  columns = [
    {
      title: '超限许可证号',
      dataIndex: 'licenceCode',
    },
    {
      title: '货车牌号',
      dataIndex: 'carCode',
    },
    {
      title: '道路运输证号',
      dataIndex: 'transportCode',
    },
    {
      title: '承运人名称',
      dataIndex: 'carrier',
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
    },
    {
      title: '法人代表',
      dataIndex: 'legalRepresent',
    },
    {
      title: '法人代表证件类型',
      dataIndex: 'idCardType',
      render: val => cardType[val - 1],
    },
    {
      title: '法人代表证件号码',
      dataIndex: 'idCardNo',
    },
    {
      title: '操作',
      width: '70px',
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
    const { pageBean, defaultFormValue } = this.state;
    this.getList({ pageBean, querys: [defaultFormValue] });
  }

  showModal = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Large/detail',
      payload: { id },
      callback: res => {
        this.setState({ detail: res });
        this.handleUpdateModalVisible(true);
      },
    });
  };

  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Large/fetch',
      payload: params,
    });
  };

  handleStandardTableChange = pagination => {
    const { formValues, defaultFormValue } = this.state;
    let arr = [];
    arr.unshift(defaultFormValue);
    const params = {
      pageBean: {
        page: pagination.current,
        pageSize: pagination.pageSize,
        showTotal: true,
      },
      querys: arr.concat(formValues),
    };
    this.getList(params);
  };

  handleFormReset = () => {
    const { form } = this.props;
    const { pageBean, defaultFormValue } = this.state;
    form.resetFields();
    this.setState({
      formValues: [],
      selectedRows: [],
    });
    this.getList({ pageBean, querys: [defaultFormValue] });
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { pageBean, defaultFormValue } = this.state;
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
      conditionFilter.unshift(defaultFormValue);
      this.getList({ pageBean, querys: conditionFilter });
    });
  };

  handleUpdateModalVisible = flag => {
    this.setState({
      updateModalVisible: !!flag,
    });
    if (!!!flag) {
      this.setState({
        detail: {},
      });
    }
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
            <FormItem>
              {getFieldDecorator('licenceCode')(<Input addonBefore="超限许可证号" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem>{getFieldDecorator('carCode')(<Input addonBefore="货车牌号" />)}</FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('transportCode')(<Input addonBefore="道路运输证号" />)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem>{getFieldDecorator('carrier')(<Input addonBefore="承运人名称" />)}</FormItem>
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
      Large: { data },
      loading,
    } = this.props;
    const { updateModalVisible, detail } = this.state;

    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      detail: detail,
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
        {updateModalVisible && JSON.stringify(detail) !== '{}' ? (
          <UpdateForm {...updateMethods} modalVisible={updateModalVisible} />
        ) : null}
      </Fragment>
    );
  }
}

export default TableList;
