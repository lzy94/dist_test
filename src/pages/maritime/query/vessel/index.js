import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Modal, Tooltip, Descriptions,
} from 'antd';
import StandardTable from '@/components/StandardTable';

import styles from '../../../style/style.less';
import themeStyle from '@/pages/style/theme.less';
import { imgUrl } from '@/utils/utils';
import Zmage from 'react-zmage';

const FormItem = Form.Item;

const DetailModal = Form.create()(props => {
  const { modalVisible, handleModalVisible, detail } = props;
  const imgs = detail.shipPhotos ? detail.shipPhotos.split(',') : [];
  const renderImg = imgs.map((item, i) => <div key={i}
                                               style={{
                                                 overflow: 'hidden',
                                                 width: 125,
                                                 height: 125,
                                                 float: 'left',
                                                 marginRight: 10,
                                               }}>
    <Zmage backdrop='rgba(255,255,255,.3)'
           src={imgUrl + item}
           alt='图片' style={{
      width: '100%',
      height: '125px',
    }}/>
  </div>);
  return (
    <Modal
      destroyOnClose
      title="详情"
      className={themeStyle.formModal}
      visible={modalVisible}
      width={800}
      onCancel={() => handleModalVisible()}
      footer={null}
    >
      <Card bordered={false}>
        <Descriptions column={2} size='small' bordered>
          <Descriptions.Item label="船舶号">{detail.shipCode}</Descriptions.Item>
          <Descriptions.Item label="船只型号">{detail.shipType}</Descriptions.Item>
          <Descriptions.Item label="排水量">{detail.displacement}</Descriptions.Item>
          <Descriptions.Item label="吨位">{detail.tonnage}</Descriptions.Item>
          <Descriptions.Item label="船长名称">{detail.shipLeader}</Descriptions.Item>
          <Descriptions.Item label="船长联系方式">{detail.shipLeaderTel}</Descriptions.Item>
          <Descriptions.Item label="运输证号">{detail.transportCode}</Descriptions.Item>
          <Descriptions.Item label="经营范围">{detail.businessScope}</Descriptions.Item>
          <Descriptions.Item label="船只图片">{renderImg}</Descriptions.Item>
        </Descriptions>
      </Card>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ MaritimeVessel, loading }) => ({
  MaritimeVessel,
  loading: loading.models.MaritimeVessel,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    formValues: [],
    detail: {},
  };

  columns = [
    {
      title: '船舶号',
      dataIndex: 'shipCode',
    },
    {
      title: '船长',
      dataIndex: 'shipLeader',
    },
    {
      title: '船只型号',
      dataIndex: 'shipType',
    },
    {
      title: '经营范围',
      dataIndex: 'businessScope',
    },
    {
      title: '运输证号',
      dataIndex: 'transportCode',
    },
    {
      title: '吨位',
      dataIndex: 'tonnage',
    },
    {
      title: '排水量',
      dataIndex: 'displacement',
    },
    {
      title: '操作',
      width: 80,
      render: (text, record) => (
        <Fragment>
          <Tooltip placement="left" title='详情'>
            <Button
              onClick={() => this.getDetail(record)}
              type="primary"
              shape="circle"
              icon='eye'
              size="small"
            />
          </Tooltip>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { pageBean } = this.state;
    this.getList({ pageBean });
  }


  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'MaritimeVessel/fetch',
      payload: params,
    });
  };


  getDetail = detail => {
    this.setState({
      detail,
    }, () => this.handleModalVisible(true));
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
    form.resetFields();
    this.setState({
      formValues: [],
    });
    this.getList({ pageBean: this.state.pageBean });
  };


  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const arr = [
        {
          property: 'shipType',
          value: fieldsValue.czxh,
          group: 'main',
          operation: 'LIKE',
          relation: 'AND',
        }, {
          property: 'businessScope',
          value: fieldsValue.jyfw,
          group: 'main',
          operation: 'LIKE',
          relation: 'AND',
        }, {
          property: 'tonnage',
          value: fieldsValue.dw,
          group: 'main',
          operation: 'EQUAL',
          relation: 'AND',
        }, {
          property: 'displacement',
          value: fieldsValue.psl,
          group: 'main',
          operation: 'EQUAL',
          relation: 'AND',
        },
      ].filter(item => item.value);

      this.setState({
        formValues: arr,
      });
      this.getList({ pageBean: this.state.pageBean, querys: arr });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
    if (!!!flag) {
      this.setState({ detail: {} });
    }
  };

  handleUpdateModalVisible = flag => {
    this.setState({
      updateModalVisible: !!flag,
    });
    if (!!!flag) {
      this.setState({ detail: {} });
    }
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 16, xl: 32 }}>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('czxh')(<Input addonBefore="船只型号" placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('jyfw')(<Input addonBefore="经营范围" placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('dw')(<Input addonBefore="吨位" placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('psl')(<Input addonBefore="排水量" placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
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
      MaritimeVessel: { data },
      loading,
    } = this.props;
    const { modalVisible, detail } = this.state;

    const parentMethods = {
      detail,
      handleModalVisible: this.handleModalVisible,
    };
    return (
      <Fragment>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <StandardTable
              rowKey="id_"
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
        {modalVisible && Object.keys(detail).length ?
          <DetailModal {...parentMethods} modalVisible={modalVisible}/> : null}
      </Fragment>
    );
  }
}

export default TableList;
