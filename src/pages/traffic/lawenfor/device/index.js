import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Button, Modal, Tooltip, Descriptions } from 'antd';
import { Redirect } from 'umi';
import StandardTable from '@/components/StandardTable';
import { checkAuth } from '@/utils/utils';

import styles from '../../../style/style.less';
import publicCss from '@/pages/style/public.less';
import themeStyle from '@/pages/style/theme.less';

const FormItem = Form.Item;
const Option = Select.Option;
const type = ['APP', 'PC', '执法仪', '其它'];
const authority = ['/lawenfor/device'];

const UpdateForm = Form.create()(props => {
  const { modalVisible, handleModalVisible, userSite, detail } = props;

  const getSiteName = code => {
    let siteName = '';
    for (let i = 0; i < userSite.length; i++) {
      if (code === userSite[i].code) {
        siteName = userSite[i].name;
        break;
      }
    }
    return siteName;
  };

  return (
    <Modal
      destroyOnClose
      title="设备详情"
      className={themeStyle.myModal + ' ' + themeStyle.modalbody}
      visible={modalVisible}
      onCancel={() => handleModalVisible()}
      footer={null}
    >
      <div className={themeStyle.detailMsg}>
        <div style={{ padding: 20 }}>
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="设备名称">{detail.equipmentName}</Descriptions.Item>
            <Descriptions.Item label="设备编码">{detail.equipmentCode}</Descriptions.Item>
            <Descriptions.Item label="所属人员">{detail.userId}</Descriptions.Item>
            <Descriptions.Item label="站点名称">{getSiteName(detail.siteCode)}</Descriptions.Item>
            <Descriptions.Item label="设备类型">
              {type[parseInt(detail.type) - 1]}
            </Descriptions.Item>
          </Descriptions>
        </div>
      </div>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ system, LawenforDevice, loading }) => ({
  system,
  LawenforDevice,
  loading: loading.models.LawenforDevice,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    updateModalVisible: false,
    formValues: [],
    userSite: [],
    detail: {},
    fieldSite: [],
    pageBean: {
      page: 1,
      pageSize: 10,
      showTotal: true,
    },
  };

  columns = [
    {
      title: '设备名称',
      dataIndex: 'equipmentName',
    },
    {
      title: '设备编码',
      dataIndex: 'equipmentCode',
    },
    {
      title: '设备类型',
      dataIndex: 'type',
      render: val => type[parseInt(val) - 1],
    },
    {
      title: '站点名称',
      dataIndex: 'siteName',
    },
    {
      title: '责任人',
      dataIndex: 'userId',
    },
    {
      title: '操作',
      width: 70,
      render: (text, record) => (
        <Fragment>
          <Tooltip placement="left" title="详情">
            <Button
              onClick={() => this.showUpdateModal(record)}
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
    this.getUserSite(1, res => {
      this.getUserSite(2, res2 => {
        this.setState({ userSite: res.concat(res2) });
      });
    });
  }

  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'LawenforDevice/fetch',
      payload: params,
    });
  };

  showUpdateModal = record => {
    this.setState({ detail: record, fieldSite: [record.siteCode, record.siteName] }, () => {
      this.handleUpdateModalVisible(true);
    });
  };

  getUserSite = (siteType, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'system/userSite',
      payload: {
        siteType,
      },
      callback: res => {
        const siteList = res.map((item, index) => {
          const key = Object.keys(item);
          return {
            index: index + 1,
            code: key[0],
            name: item[key[0]],
            direction: [item[key[1]], item[key[2]]],
          };
        });
        callback(siteList);
      },
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
              operation: 'LIKE',
              relation: 'OR',
            }
          : '';
      });
      const conditionFilter = condition.filter(item => item);
      this.setState({
        formValues: conditionFilter,
      });
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
      form: { getFieldDecorator },
    } = this.props;
    const { userSite } = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 16, xl: 16 }}>
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
                  <Select className={publicCss.inputGroupLeftRadius} placeholder="请选择">
                    {userSite.map((item, index) => (
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
            <FormItem>
              {getFieldDecorator('equipmentName')(
                <Input addonBefore="设备名称" placeholder="请输入" />,
              )}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('equipmentCode')(
                <Input addonBefore="设备编码" placeholder="请输入" />,
              )}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      LawenforDevice: { data },
      loading,
    } = this.props;
    const { userSite, updateModalVisible, detail } = this.state;

    const updateMethods = {
      handleUpdate: this.handleUpdate,
      userSite,
      detail,
      handleModalVisible: this.handleUpdateModalVisible,
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
