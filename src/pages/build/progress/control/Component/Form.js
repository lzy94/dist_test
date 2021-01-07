import React from 'react';
import moment from 'moment';
import { Form, Input, Select, DatePicker, InputNumber, Button, message } from 'antd';

import tableStyle from '../../../style.less';

const FormItem = Form.Item;
const { Option } = Select;
const cate = ['高速公路', '国省干线', '农村公路'];

function setValueField(field) {
  const keys = Object.keys(field);
  const obj = {};
  for (let i = 0; i < keys.length; i += 1) {
    obj[keys[i]] = Form.createFormField({
      value:
        keys[i] === 'startWorkTime' || keys[i] === 'completeWorkTime' || keys[i] === 'registerTime'
          ? moment(new Date(field[keys[i]]), 'YYYY-MM-DD HH:mm:ss')
          : field[keys[i]],
    });
  }
  return obj;
}

const MyForm = Form.create({
  mapPropsToFields(props) {
    return setValueField(props.field);
  },
  onValuesChange(props, values) {
    props.onChange(values);
  },
})(props => {
  const { form } = props;

  return (
    <table className={tableStyle.table}>
      <tbody>
        <tr>
          <td>项目名称</td>
          <td colSpan={2}>
            <FormItem>
              {form.getFieldDecorator('projectName', {
                rules: [{ required: true, message: '请输入项目名称' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </td>
          <td>项目类型</td>
          <td colSpan={2}>
            <FormItem>
              {form.getFieldDecorator('projectCategory', {
                rules: [{ required: true, message: '请选择项目类型' }],
              })(
                <Select style={{ width: '100%' }}>
                  {cate.map(item => (
                    <Option key={item}>{item}</Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td>开工时间</td>
          <td>
            <FormItem>
              {form.getFieldDecorator('startWorkTime', {
                rules: [{ required: true, message: '请选择开工时间' }],
              })(<DatePicker showTime style={{ minWidth: '100%' }} placeholder="请选择" />)}
            </FormItem>
          </td>
          <td>完工时间</td>
          <td>
            <FormItem>
              {form.getFieldDecorator('completeWorkTime', {
                rules: [{ required: true, message: '请选择完工时间' }],
              })(<DatePicker showTime style={{ minWidth: '100%' }} placeholder="请选择" />)}
            </FormItem>
          </td>
          <td>登记时间</td>
          <td>
            <FormItem>
              {form.getFieldDecorator('registerTime', {
                rules: [{ required: true, message: '请选择登记时间' }],
              })(<DatePicker showTime style={{ minWidth: '100%' }} placeholder="请选择" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td>总里程（km）</td>
          <td>
            <FormItem>
              {form.getFieldDecorator('totalMileage', {
                rules: [{ required: true, message: '请输入' }],
              })(<InputNumber min={0} style={{ width: '100%' }} placeholder="请选择" />)}
            </FormItem>
          </td>
          <td>累计完成里程（km）</td>
          <td>
            <FormItem>
              {form.getFieldDecorator('cumulativeMileage', {
                rules: [{ required: true, message: '请输入' }],
              })(<InputNumber min={0} style={{ width: '100%' }} placeholder="请选择" />)}
            </FormItem>
          </td>
          <td>当年完成里程（km）</td>
          <td>
            <FormItem>
              {form.getFieldDecorator('yearCompletedMileage', {
                rules: [{ required: true, message: '请输入' }],
              })(<InputNumber min={0} style={{ width: '100%' }} placeholder="请选择" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td>工程总投资（万元）</td>
          <td>
            <FormItem>
              {form.getFieldDecorator('totalInvestment', {
                rules: [{ required: true, message: '请输入' }],
              })(<InputNumber min={0} style={{ width: '100%' }} placeholder="请选择" />)}
            </FormItem>
          </td>
          <td>累计完成投资（万元）</td>
          <td>
            <FormItem>
              {form.getFieldDecorator('accumulatedInvestment', {
                rules: [{ required: true, message: '请输入' }],
              })(<InputNumber min={0} style={{ width: '100%' }} placeholder="请选择" />)}
            </FormItem>
          </td>
          <td>当年完成投资（万元）</td>
          <td>
            <FormItem>
              {form.getFieldDecorator('yearCompletedInvestment', {
                rules: [{ required: true, message: '请输入' }],
              })(<InputNumber min={0} style={{ width: '100%' }} placeholder="请选择" />)}
            </FormItem>
          </td>
        </tr>
      </tbody>
    </table>
  );
});

MyForm.defaultProps = {
  field: {},
  onChange: () => {},
};

export default MyForm;
