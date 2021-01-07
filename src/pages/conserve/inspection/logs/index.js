import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, Modal, Tooltip, Descriptions, message } from 'antd';
import StandardTable from '@/components/StandardTable';

import styles from '../../../style/style.less';
import themeStyle from '@/pages/style/theme.less';
import Zmage from 'react-zmage';
import { imgUrl } from '@/utils/utils';

const FormItem = Form.Item;

const DetailForm = Form.create()(props => {
  const { modalVisible, handleModalVisible, detail } = props;

  const imgs = detail.inspecImg ? detail.inspecImg.split(',') : [];
  const renderImg = imgs
    .filter(item => item)
    .map(item => (
      <div
        key={item}
        style={{
          overflow: 'hidden',
          width: 170,
          height: 170,
          float: 'left',
          marginRight: 10,
          marginBottom: 10,
        }}
      >
        <Zmage
          backdrop="rgba(255,255,255,.3)"
          src={imgUrl + item}
          alt="图片"
          style={{
            width: '100%',
            height: '170px',
          }}
        />
      </div>
    ));

  return (
    <Modal
      destroyOnClose
      title="详情"
      width={800}
      className={themeStyle.formModal}
      visible={modalVisible}
      footer={null}
      onCancel={() => handleModalVisible()}
    >
      <Card bordered={false}>
        <Descriptions size="small" bordered column={2}>
          <Descriptions.Item label="巡查单位">{detail.inspecUnit}</Descriptions.Item>
          <Descriptions.Item label="巡查天气">{detail.inspecWeather}</Descriptions.Item>
          <Descriptions.Item label="巡查路线">{detail.inspecRoute}</Descriptions.Item>
          <Descriptions.Item label="巡查性质">{detail.inspecNature}</Descriptions.Item>
          <Descriptions.Item label="清除杂草">{detail.clearWeeds} KM</Descriptions.Item>
          <Descriptions.Item label="清除死树">{detail.clearTree} 颗</Descriptions.Item>
          <Descriptions.Item label="清除垃圾">{detail.clearTrash} KM</Descriptions.Item>
          <Descriptions.Item label="运输车">{detail.callShipcar}</Descriptions.Item>
          <Descriptions.Item label="路面综合养护机">{detail.callMaintenance}</Descriptions.Item>
          <Descriptions.Item label="灌缝机">{detail.callMachine}</Descriptions.Item>
          <Descriptions.Item label="调用钩机">{detail.callHook}</Descriptions.Item>
          <Descriptions.Item label="调用挖掘机">{detail.callExcavator}</Descriptions.Item>
          <Descriptions.Item label="事件详情" span={2}>
            {detail.eventDatails}
          </Descriptions.Item>
          <Descriptions.Item label="巡查图片" span={2}>
            {renderImg}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ ConserveLogs, loading }) => ({
  ConserveLogs,
  loading: loading.models.ConserveLogs,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: [],
    formValues: [],
    detail: {},
    pageBean: { page: 1, pageSize: 10, showTotal: true },
  };

  columns = [
    {
      title: '巡查单位',
      dataIndex: 'inspecUnit',
    },
    {
      title: '巡查天气',
      dataIndex: 'inspecWeather',
    },
    {
      title: '巡查路线',
      dataIndex: 'inspecRoute',
    },
    {
      title: '巡查性质',
      dataIndex: 'inspecNature',
    },
    {
      title: '事件详情',
      width: 200,
      dataIndex: 'eventDatails',
      render: val =>
        val ? (
          val.length > 15 ? (
            <Tooltip title={val}>{val.substring(0, 15) + '...'}</Tooltip>
          ) : (
            val
          )
        ) : (
          ''
        ),
    },
    {
      title: '操作',
      width: 80,
      render: (text, record) => (
        <Fragment>
          <Tooltip placement="left" title="详情">
            <Button
              onClick={() => this.getDetail(record)}
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
    const { pageBean } = this.state;
    this.getList({ pageBean });
  }

  getDetail = detail => {
    this.setState({ detail }, () => this.handleModalVisible(true));
  };

  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ConserveLogs/fetch',
      payload: params,
    });
  };

  delBatch = () => {
    const { selectedRows } = this.state;
    if (!selectedRows.length) return message.error('请选择要删除的数据');
    Modal.confirm({
      title: '提示',
      content: '您确定要批量删除吗?',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        this.delUtil(selectedRows.map(row => row.id).join());
      },
    });
  };

  delUtil = ids => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ConserveLogs/remove',
      payload: { ids },
      callback: () => {
        message.success('删除成功');
        this.getList({ pageBean: this.state.pageBean });
        this.setState({
          selectedRows: [],
        });
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
    form.resetFields();
    this.setState({
      formValues: [],
      selectedRows: [],
    });
    this.getList({ pageBean: this.state.pageBean });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
      };
      const { pageBean } = this.state;
      const objKeys = Object.keys(values);
      const condition = objKeys.map(item => {
        return values[item]
          ? {
              property: item,
              value: values[item],
              group: 'main',
              operation: 'LIKE',
              relation: 'AND',
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

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 16, xl: 16 }}>
          <Col md={6} sm={24}>
            <FormItem>
              {getFieldDecorator('inspecUnit')(
                <Input addonBefore="巡查单位" placeholder="请输入" />,
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem>
              {getFieldDecorator('inspecRoute')(
                <Input addonBefore="巡查路线" placeholder="请输入" />,
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem>
              {getFieldDecorator('inspecWeather')(
                <Input addonBefore="巡查天气" placeholder="请输入" />,
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
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
      ConserveLogs: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, detail } = this.state;
    const parentMethods = {
      detail,
      handleModalVisible: this.handleModalVisible,
    };
    return (
      <Fragment>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <div className={styles.tableListOperator}>
              <span>
                <Button type="danger" onClick={this.delBatch}>
                  批量删除
                </Button>
              </span>
            </div>
            <StandardTable
              size="middle"
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        {modalVisible && Object.keys(detail).length ? (
          <DetailForm {...parentMethods} modalVisible={modalVisible} />
        ) : null}
      </Fragment>
    );
  }
}

export default TableList;
