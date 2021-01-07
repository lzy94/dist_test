import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button, Tooltip, Modal,
} from 'antd';
import StandardTable from '@/components/StandardTable';


import { roadType } from '@/utils/dictionaries';
import styles from '../../../../style/style.less';
import publicCss from '@/pages/style/public.less';
import themeStyle from '@/pages/style/theme.less';

const FormItem = Form.Item;
const { Option } = Select;

/* eslint react/no-multi-comp:0 */
@connect(({ RoadInfo, loading }) => ({
  RoadInfo,
  loading: loading.models.RoadInfo,
}))
@Form.create()
class RoadInfo extends PureComponent {
  state = {
    formValues: [],
    pageBean: { 'page': 1, 'pageSize': 10, 'showTotal': true },
  };

  columns = [
    {
      title: '公路名称',
      dataIndex: 'roadName',
    },
    {
      title: '公路编号',
      dataIndex: 'roadCode',
    },
    {
      title: '公路类型',
      dataIndex: 'roadType',
      render: val => roadType[val - 1],
    },
    {
      title: '里程（km）',
      dataIndex: 'roadMileage',
    },
    {
      title: '起始地',
      dataIndex: 'startAddr',
    },
    {
      title: '结束地',
      dataIndex: 'endAddr',
    },
    {
      title: '操作',
      width: 80,
      render: (text, record) => (
        <Fragment>
          <Tooltip placement="left" title="选择">
            <Button type="primary" shape="circle" icon="check" size="small" onClick={() => this.selectData(record)}/>
          </Tooltip>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { pageBean } = this.state;
    const organId = localStorage.getItem('organId');
    const baseOrgan = [{
      property: 'organCode',
      value: organId,
      group: 'main',
      operation: 'RIGHT_LIKE',
      relation: 'AND',
    }];
    this.getList({
      pageBean,
      'querys': baseOrgan,
    });
  }

  selectData = record => {
    const { selectData, handleModalVisible } = this.props;
    selectData(record);
    handleModalVisible();
  };


  getList = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'RoadInfo/fetch',
      payload: params,
    });
  };

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
    form.resetFields();
    this.setState({
      formValues: [],
    });
    this.modalSuccess();
  };

  handleSearch = e => {
    e.preventDefault();

    const { form } = this.props;
    const { pageBean } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
      };
      const objKeys = Object.keys(values);

      const condition = objKeys.map(item => {
        return values[item]
          ? {
            property: item,
            value: values[item],
            group: 'main',
            operation: item === 'roadType' ? 'EQUAL' : 'LIKE',
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


  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 16, xl: 32 }}>
          <Col md={6} sm={24}>
            <FormItem>
              {getFieldDecorator('roadName')(<Input addonBefore="公路名称" placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem>
              {getFieldDecorator('roadCode')(<Input addonBefore="公路编号" placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <div className={publicCss.inputMain}>
              <span style={{ width: '80px', lineHeight: '30px', height: '32px' }}
                    className="ant-input-group-addon">公路类型</span>
              <FormItem style={{ flex: 1 }}>
                {getFieldDecorator('roadType')(
                  <Select placeholder="请选择" style={{ width: '100%' }}>
                    {
                      roadType.map((item, index) => <Option value={index + 1} key={index}>{item}</Option>)
                    }
                  </Select>,
                )}
              </FormItem>
            </div>
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
      RoadInfo: { data },
      loading,
      modalVisible,
      handleModalVisible,
    } = this.props;

    return (
      <Modal
        destroyOnClose
        title="选择公路"
        className={themeStyle.formModal}
        visible={modalVisible}
        width={1000}
        footer={null}
        onCancel={() => handleModalVisible()}
      >
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <StandardTable
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
      </Modal>
    );
  }
}

export default RoadInfo;
