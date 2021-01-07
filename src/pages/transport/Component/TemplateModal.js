import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Button, Modal, Tooltip } from 'antd';
import StandardTable from '@/components/StandardTable';

import themeStyle from '@/pages/style/theme.less';
import publicCss from '@/pages/style/public.less';
import styles from '../../style/style.less';

const FormItem = Form.Item;
const { Option } = Select;

/* eslint react/no-multi-comp:0 */
@connect(({ TransportDangerCategory, TransportDangerTemplate, loading }) => ({
  TransportDangerCategory,
  TransportDangerTemplate,
  loading: loading.models.TransportDangerTemplate,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    selectedRows: [],
    formValues: [],
    pageBean: { page: 1, pageSize: 10, showTotal: true },
  };

  columns = [
    {
      title: '模板名称',
      dataIndex: 'name',
    },
    {
      title: '模板分类',
      dataIndex: 'categoryName',
    },
    {
      title: '操作',
      width: 80,
      render: (text, record) => (
        <Tooltip placement="left" title="选择">
          <Button
            type="primary"
            shape="circle"
            icon="check"
            size="small"
            onClick={() => this.selectData(record)}
          />
        </Tooltip>
      ),
    },
  ];

  componentDidMount() {
    const { pageBean } = this.state;
    this.getList({ pageBean });
    this.getCategory();
  }

  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'TransportDangerTemplate/fetch',
      payload: params,
    });
  };

  getCategory = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'TransportDangerCategory/fetch',
      payload: {
        page: 1,
        pageSize: 100,
        showTotal: true,
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

  selectData = detail => {
    const { setSelectData, handleModalVisible } = this.props;
    setSelectData(detail.id, detail.name);
    handleModalVisible();
  };

  handleSearch = e => {
    e.preventDefault();

    const { form } = this.props;
    const { pageBean } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        name: fieldsValue.templateName,
        categoryName: fieldsValue.cate,
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
      this.getList({ pageBean, querys: conditionFilter });
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      TransportDangerCategory: { data },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 16, xl: 16 }}>
          <Col md={9} sm={24}>
            <FormItem>
              {getFieldDecorator('templateName')(
                <Input addonBefore="模板名称" placeholder="请输入" />,
              )}
            </FormItem>
          </Col>
          <Col md={9} sm={24}>
            <div className={publicCss.inputMain}>
              <span
                style={{ width: '80px', lineHeight: '30px', height: '32px' }}
                className="ant-input-group-addon"
              >
                模板分类
              </span>
              <FormItem style={{ flex: 1, flexShrink: 0 }}>
                {getFieldDecorator('cate')(
                  <Select placeholder="请选择" style={{ width: '100%' }}>
                    {data.list.map(item => (
                      <Option key={item.id} value={item.name}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>,
                )}
              </FormItem>
            </div>
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
      TransportDangerTemplate: { data },
      loading,
      modalVisible,
      handleModalVisible,
    } = this.props;
    return (
      <Modal
        destroyOnClose
        title="选择模板"
        className={themeStyle.formModal}
        visible={modalVisible}
        width={800}
        onOk={this.selectData}
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
