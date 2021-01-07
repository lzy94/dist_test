import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Button, Tooltip,
  DatePicker,
} from 'antd';
import moment from 'moment';

import DetailModal from './DetailModal';

import StandardTable from '@/components/StandardTable';
import publicCss from '@/pages/style/public.less';
import styles from '../../../style/style.less';

const FormItem = Form.Item;


/* eslint react/no-multi-comp:0 */
@connect(({ Electronictag, loading }) => ({
  Electronictag,
  loading: loading.models.Electronictag,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    formValues: [],
    codes: '',
    pageBean: { 'page': 1, 'pageSize': 10, 'showTotal': true },
  };

  columns = [
    {
      title: '上传时间',
      dataIndex: 'createdTime',
    },
    {
      title: '路产编号',
      dataIndex: 'productionCodes',
    },
    {
      title: '异常编号',
      dataIndex: 'defecrCodes',
    },
    {
      title: '操作',
      width: 80,
      render: (text, record) => (
        <Fragment>
          {record.defecrCodes ? <Tooltip placement="left" title='缺失标签'>
            <Button
              onClick={() => this.getDetail(record.defecrCodes)}
              type="primary"
              shape="circle"
              icon='profile'
              size="small"
            />
          </Tooltip> : null}
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    this.getList({ pageBean: this.state.pageBean });
  }

  getDetail = codes => {
    this.setState({ codes }, () => this.handleModalVisible(true));
  };

  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Electronictag/fetch',
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
    this.getList({ pageBean: this.state.pageBean });
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
      values.createdTime = moment(fieldsValue.createdTime).format('YYYY-MM-DD');
      const objKeys = Object.keys(values);
      const condition = objKeys.map(item => {
        return values[item]
          ? {
            property: item,
            value: values[item],
            group: 'main',
            operation: 'EQUAL',
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
        <Row gutter={{ md: 8, lg: 16, xl: 32 }}>
          <Col md={6} sm={24}>
            <div className={publicCss.inputMain}>
              <span style={{ width: '80px', lineHeight: '30px', height: '32px' }}
                    className="ant-input-group-addon">上传时间</span>
              <div className={publicCss.myDate}>
                <FormItem style={{ flex: 1 }}>
                  {getFieldDecorator('createdTime')(
                    <DatePicker style={{ width: '100%' }}/>,
                  )}
                </FormItem>
              </div>
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
      Electronictag: { data },
      loading,
    } = this.props;
    const { modalVisible, codes } = this.state;

    const parentMethods = {
      codes,
      handleModalVisible: this.handleModalVisible,
    };
    return (
      <Fragment>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <StandardTable
              rowKey='id_'
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
        {modalVisible && codes ? <DetailModal modalVisible={modalVisible} {...parentMethods} /> : null}
      </Fragment>
    );
  }
}

export default TableList;
