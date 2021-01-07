import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  Button, Tooltip, Modal,
} from 'antd';
import StandardTable from '@/components/StandardTable';

import styles from '../../../../style/style.less';
import themeStyle from '@/pages/style/theme.less';

const FormItem = Form.Item;


/* eslint react/no-multi-comp:0 */
@connect(({ ConserveCompany, loading }) => ({
  ConserveCompany,
  loading: loading.models.ConserveCompany,
}))
@Form.create()
class CompanyModal extends PureComponent {
  state = {
    formValues: [],
    pageBean: { 'page': 1, 'pageSize': 10, 'showTotal': true },
  };

  columns = [
    {
      title: '企业名称',
      dataIndex: 'companyName',
    },
    {
      title: '法人代表',
      dataIndex: 'companyHeader',
    },
    {
      title: '联系方式',
      dataIndex: 'companyTel',
    },
    {
      title: '标签',
      dataIndex: 'conserveCategoryName',
    },
    {
      title: '操作',
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
    this.getList({ pageBean: this.state.pageBean });
  }

  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ConserveCompany/fetch',
      payload: params,
    });
  };

  selectData = record => {
    const { selectData, handleModalVisible } = this.props;
    selectData(record);
    handleModalVisible();
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

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 16, xl: 16 }}>
          <Col md={8} sm={24}>
            <FormItem>
              {getFieldDecorator('companyHeader')(<Input addonBefore="法人代表" placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem>
              {getFieldDecorator('companyName')(<Input addonBefore="企业名称" placeholder="请输入"/>)}
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
      ConserveCompany: { data },
      loading,
      modalVisible,
      handleModalVisible,
    } = this.props;


    return (
      <Modal
        destroyOnClose
        title="选择公司"
        className={themeStyle.myModal}
        visible={modalVisible}
        width={1000}
        onCancel={() => handleModalVisible()}
        footer={null}
      >
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
      </Modal>
    );
  }
}

export default CompanyModal;
