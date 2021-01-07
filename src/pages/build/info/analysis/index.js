import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Button, Spin, DatePicker } from 'antd';

import publicCss from '@/pages/style/public.less';
import styles from '../../../style/style.less';
import tableStyle from '../../style.less';

const FormItem = Form.Item;

const cate = ['高速公路', '国省干线', '农村公路'];

/* eslint react/no-multi-comp:0 */
@connect(({ BuildInfoAnalysis, loading }) => ({
  BuildInfoAnalysis,
  loading: loading.models.BuildInfoAnalysis,
}))
@Form.create()
class TableList extends PureComponent {
  state = { isopen: false, year: '' };

  componentDidMount() {
    this.getList({ year: moment().format('YYYY') });
  }

  getList = parmas => {
    const { dispatch } = this.props;
    dispatch({
      type: 'BuildInfoAnalysis/fetch',
      payload: parmas,
    });
  };

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({ year: '' });
    this.getList({ year: moment().format('YYYY') });
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const year = moment(fieldsValue.time).format('YYYY');
      const values = {
        year,
      };

      this.setState({ year });
      this.getList(values);
    });
  };

  renderTd = data => {
    const html = [<td key="td_0">0</td>, <td key="td_1">0</td>, <td key="td_2">0</td>];
    for (let i = 0; i < data.length; i += 1) {
      const index = cate.indexOf(data[i].projectCategory);
      html[index] = <td key={`td_${index}`}>{data[i].mileage}</td>;
    }
    return html;
  };

  renderData = data => {
    if (!data.length) {
      const { year } = this.state;
      return (
        <tr key="tr">
          <td>{year || moment().format('YYYY')}</td>
          <td>0</td>
          <td>0</td>
          <td>0</td>
          <td>0</td>
        </tr>
      );
    }

    const { year } = data[0];
    let count = 0;
    for (let i = 0; i < data.length; i += 1) {
      count += parseInt(data[i].yearCompletedInvestment, 10);
    }

    return (
      <tr key="tr">
        <td>{year}</td>
        {this.renderTd(data)}
        <td>{count}</td>
      </tr>
    );
  };

  // 弹出日历和关闭日历的回调
  handleOpenChange = status => {
    if (status) {
      this.setState({ isopen: true });
    } else {
      this.setState({ isopen: false });
    }
  };

  handlePanelChange = value => {
    this.setState({
      isopen: false,
    });
    const { form } = this.props;
    form.setFieldsValue({
      time: value,
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { isopen } = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={16}>
          <Col md={6} sm={24}>
            <div className={publicCss.inputMain}>
              <span
                style={{ width: '80px', lineHeight: '30px', height: '32px' }}
                className="ant-input-group-addon"
              >
                年份选择
              </span>
              <FormItem style={{ flex: 1, marginBottom: 0 }}>
                {getFieldDecorator('time')(
                  <DatePicker
                    // value={year}
                    open={isopen}
                    mode="year"
                    placeholder="请选择年份"
                    format="YYYY"
                    onOpenChange={this.handleOpenChange}
                    onPanelChange={this.handlePanelChange}
                  />,
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
      BuildInfoAnalysis: { data },
      loading,
    } = this.props;

    return (
      <Card bordered={false} style={{ height: '100%' }}>
        <div className={styles.tableList}>
          <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
          <Spin spinning={loading}>
            <table className={`${tableStyle.table} ${tableStyle.table_pad}`}>
              <tbody>
                <tr>
                  <td rowSpan={2} className={tableStyle.title}>
                    统计年份
                  </td>
                  <td colSpan={3} className={tableStyle.title}>
                    建设总里程（km）
                  </td>
                  <td rowSpan={2} className={tableStyle.title}>
                    当年完成投资（万元）
                  </td>
                </tr>
                <tr>
                  <td>高速公路（km）</td>
                  <td>国省干线（km）</td>
                  <td>农村公路（km）</td>
                </tr>
                {this.renderData(data)}
              </tbody>
            </table>
          </Spin>
        </div>
      </Card>
    );
  }
}

export default TableList;
