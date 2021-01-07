import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
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
import moment from 'moment';
import publicCss from '../../../style/public.less';
import themeStyle from '@/pages/style/theme.less';

const FormItem = Form.Item;
const { Option } = Select;

const authority = ['/comquery/freight'];

const UpdateForm = Form.create()(props => {
  const { modalVisible, form, handleUpdateModalVisible, detail } = props;
  const style = {
    color: 'rgba(0,0,0,.7)',
    border: 0,
  };
  const type = ['经营性道路旅客运输驾驶员', '经营性道路货物运输驾驶员', '道路危险货物运输驾驶员'];
  return (
    <Modal
      destroyOnClose
      title="货运从业人员详情"
      className={themeStyle.myModal + ' ' + themeStyle.modalbody}
      visible={modalVisible}
      onCancel={() => handleUpdateModalVisible()}
      width={800}
      footer={null}
    >
      <div className={themeStyle.detailMsg}>
        <div style={{ padding: 20 }}>
          <Descriptions bordered={true} size="small" column={2}>
            <Descriptions.Item label="驾驶证号">{detail.driverCode}</Descriptions.Item>
            <Descriptions.Item label="驾驶人姓名">{detail.driverName}</Descriptions.Item>
            <Descriptions.Item label="从业资格证号">{detail.licenceCode}</Descriptions.Item>
            <Descriptions.Item label="性别">{detail.sex === '1' ? '男' : '女'}</Descriptions.Item>
            <Descriptions.Item label="从业资格类别">
              {type[parseInt(detail.occupationType) - 1]}
            </Descriptions.Item>
            <Descriptions.Item label="超限超载情况">{detail.overloadCondition}</Descriptions.Item>
            <Descriptions.Item label="发证机关">{detail.licenceOrang}</Descriptions.Item>
            <Descriptions.Item label="有效日期">
              {moment(detail.effectiveDate).format('YYYY-MM-DD')}
            </Descriptions.Item>
            <Descriptions.Item label="联系电话">{detail.phone}</Descriptions.Item>
            <Descriptions.Item label="邮箱">{detail.email}</Descriptions.Item>
            <Descriptions.Item label="住址" span={2}>
              {detail.address}
            </Descriptions.Item>
            <Descriptions.Item label="是否所属货运企业">
              {detail.isTransportCompany === '1' ? '是' : '否'}
            </Descriptions.Item>
            <Descriptions.Item label="货运企业">{detail.transportCompanyName}</Descriptions.Item>
            <Descriptions.Item label="是否所属货运企业">
              {detail.isSourceCompany === '1' ? '是' : '否'}
            </Descriptions.Item>
            <Descriptions.Item label="源头企业">{detail.transportSourceName}</Descriptions.Item>
          </Descriptions>
        </div>
      </div>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ system, Freight, loading }) => ({
  treeList: system.treeList,
  Freight,
  loading: loading.models.Freight,
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
      title: '驾驶证号',
      dataIndex: 'driverCode',
    },
    {
      title: '驾驶证员姓名',
      dataIndex: 'driverName',
    },
    {
      title: '性别',
      dataIndex: 'sex',
      render: val => {
        let sex = '';
        switch (val) {
          case '1':
            sex = '男';
            break;
          case '2':
            sex = '女';
            break;
          default:
            sex = '其他';
        }
        return sex;
      },
    },
    {
      title: '从业资格证号',
      dataIndex: 'licenceCode',
    },
    {
      title: '从业资格类别',
      dataIndex: 'occupationType',
    },
    {
      title: '发证机关',
      dataIndex: 'licenceOrang',
    },
    {
      title: '有效日期',
      dataIndex: 'effectiveDate',
      render: val => moment(val).format('YYYY-MM-DD'),
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

  showModal = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Freight/detail',
      payload: id,
      callback: res => {
        this.setState({
          detail: res,
        });
        this.handleUpdateModalVisible(true);
      },
    });
  };

  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Freight/fetch',
      payload: params,
    });
  };

  componentDidMount() {
    if (!checkAuth(authority[0])) return;
    const { pageBean } = this.state;
    this.getList({ pageBean });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
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
    const { form } = this.props;
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
              operation:
                item === 'organCode' ? 'RIGHT_LIKE' : item === 'occupationType' ? 'EQUAL' : 'LIKE',
              relation: 'AND',
            }
          : '';
      });
      let conditionFilter = condition.filter(item => item);
      this.setState({
        formValues: conditionFilter,
      });
      this.getList({ pageBean, querys: conditionFilter });
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
            <FormItem>{getFieldDecorator('driverCode')(<Input addonBefore="驾驶证号" />)}</FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem>{getFieldDecorator('driverName')(<Input addonBefore="姓名" />)}</FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem>
              {getFieldDecorator('licenceCode')(<Input addonBefore="从业资格证号" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <div className={publicCss.inputMain}>
              <span
                style={{ width: '110px', lineHeight: '30px', height: '32px' }}
                className="ant-input-group-addon"
              >
                从业资格类别
              </span>
              <FormItem style={{ flex: 1 }}>
                {getFieldDecorator('occupationType')(
                  <Select
                    className={publicCss.inputGroupLeftRadius}
                    placeholder="请选择"
                    style={{ width: '100%' }}
                  >
                    <Option value="1">经营性道路旅客运输驾驶员 </Option>
                    <Option value="2">经营性道路货物运输驾驶员 </Option>
                    <Option value="3">道路危险货物运输驾驶员 </Option>
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
      Freight: { data },
      loading,
    } = this.props;
    const { updateModalVisible, detail } = this.state;

    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
      handleModalVisible: this.handleModalVisible,
      detail: detail,
      loading: loading,
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
              onSelectRow={this.handleSelectRows}
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
