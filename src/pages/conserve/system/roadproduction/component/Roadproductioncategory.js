import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button, Tooltip, Modal,
} from 'antd';
import StandardTable from '@/components/StandardTable';

import styles from '../../../../style/style.less';
import themeStyle from '@/pages/style/theme.less';

const FormItem = Form.Item;


/* eslint react/no-multi-comp:0 */
@connect(({ RoadProductionCategory, loading }) => ({
  RoadProductionCategory,
  loading: loading.models.RoadProductionCategory,
}))
@Form.create()
class TableList extends PureComponent {
  static defaultProps = {
    handleModalVisible: () => {
    },
  };

  state = {
    formValues: [],
    pageBean: { 'page': 1, 'pageSize': 10, 'showTotal': true },
  };

  columns = [
    {
      title: '编号',
      dataIndex: 'categoryCode',
    },
    {
      title: '名称',
      dataIndex: 'categoryName',
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
    this.getList({ pageBean });
  }

  selectData = record => {
    const { selectData, handleModalVisible } = this.props;
    selectData(record);
    handleModalVisible();
  };

  getList = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'RoadProductionCategory/fetch',
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
            operation: 'LIKE',
            relation: 'AND',
          }
          : '';
      });
      const conditionFilter = condition.filter(item => item);

      this.setState({
        formValues: conditionFilter,
      });

      this.getList({ pageBean: this.state.pageBean, querys: conditionFilter });
    });
  };


  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 16, xl: 32 }}>
          <Col md={8} sm={24}>
            <FormItem>
              {getFieldDecorator('categoryCode')(<Input addonBefore='编号' placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem>
              {getFieldDecorator('categoryName')(<Input addonBefore='名称' placeholder="请输入"/>)}
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
      RoadProductionCategory: { data },
      loading,
      modalVisible,
      handleModalVisible,
    } = this.props;

    return (
      <Modal
        destroyOnClose
        title="选择分类"
        className={themeStyle.formModal}
        visible={modalVisible}
        footer={null}
        width={800}
        onCancel={() => handleModalVisible()}
      >
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
      </Modal>
    );
  }
}

export default TableList;
