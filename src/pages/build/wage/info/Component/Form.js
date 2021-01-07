import React from 'react';
import moment from 'moment';
import { Form, Input, InputNumber } from 'antd';

import tableStyle from '../../../style.less';

const FormItem = Form.Item;

function setValueField(field) {
  const keys = Object.keys(field);
  const obj = {};
  for (let i = 0; i < keys.length; i += 1) {
    obj[keys[i]] = Form.createFormField({
      value: field[keys[i]],
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
    <table className={tableStyle.table} style={{ tableLayout: 'auto' }}>
      <colgroup>
        <col width={120} />
        <col width={100} />
      </colgroup>
      <tbody>
        <tr>
          <td>项目及合同段</td>
          <td colSpan={2}>
            <FormItem>
              {form.getFieldDecorator('contractSegment', {
                rules: [{ required: true, message: '请输入项目及合同段' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td>企业名称</td>
          <td colSpan={2}>
            <FormItem>
              {form.getFieldDecorator('companyName', {
                rules: [{ required: true, message: '请输入企业名称' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td>所属区域（按市、州填写）</td>
          <td colSpan={2}>
            <FormItem>
              {form.getFieldDecorator('areaCity', {
                rules: [{ required: true, message: '请输入所属区域' }],
              })(<Input.TextArea placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td rowSpan={2} className={tableStyle.title}>
            项目概算投资及到位资金情况（万元）
          </td>
          <td>概算总投资</td>
          <td>
            <FormItem>
              {form.getFieldDecorator('totalInvestment', {
                rules: [{ required: true, message: '请输入概算总投资' }],
              })(<InputNumber style={{ width: '100%' }} min={0} placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td>累计到位资金</td>
          <td>
            <FormItem>
              {form.getFieldDecorator('fundsPlace', {
                rules: [{ required: true, message: '请输入累计到位资金' }],
              })(<InputNumber style={{ width: '100%' }} min={0} placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td rowSpan={3} className={tableStyle.title}>
            合同额及支付情况(万元)
          </td>
          <td>变更后的合同金额</td>
          <td>
            <FormItem>
              {form.getFieldDecorator('changeAmount', {
                rules: [{ required: true, message: '请输入变更后的合同金额' }],
              })(<InputNumber style={{ width: '100%' }} min={0} placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td>累计计量金额</td>
          <td>
            <FormItem>
              {form.getFieldDecorator('measurementAmount', {
                rules: [{ required: true, message: '请输入累计计量金额' }],
              })(<InputNumber style={{ width: '100%' }} min={0} placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td>累计支付金额</td>
          <td>
            <FormItem>
              {form.getFieldDecorator('paymentAmount', {
                rules: [{ required: true, message: '请输入累计支付金额' }],
              })(<InputNumber style={{ width: '100%' }} min={0} placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td rowSpan={4} className={tableStyle.title}>
            农民工工资支付情况（万元）
          </td>
          <td>总额</td>
          <td>
            <FormItem>
              {form.getFieldDecorator('totalAmount', {
                rules: [{ required: true, message: '请输入总额' }],
              })(<InputNumber style={{ width: '100%' }} min={0} placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td>预计尚需支付金额</td>
          <td>
            <FormItem>
              {form.getFieldDecorator('stillPaidAmount', {
                rules: [{ required: true, message: '请输入预计尚需支付金额' }],
              })(<InputNumber style={{ width: '100%' }} min={0} placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td>累计支付金额 </td>
          <td>
            <FormItem>
              {form.getFieldDecorator('accumulatedSalaryPayment', {
                rules: [{ required: true, message: '请输入累计支付金额' }],
              })(<InputNumber style={{ width: '100%' }} min={0} placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td>累计拖欠金额 </td>
          <td>
            <FormItem>
              {form.getFieldDecorator('accumulatedArrears', {
                rules: [{ required: true, message: '请输入累计拖欠金额' }],
              })(<InputNumber style={{ width: '100%' }} min={0} placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td rowSpan={2} className={tableStyle.title}>
            农民工工资拖欠情况（万元）
          </td>
          <td>本期拖欠金额</td>
          <td>
            <FormItem>
              {form.getFieldDecorator('arrearscurrentPeriod', {
                rules: [{ required: true, message: '请输入本期拖欠金额' }],
              })(<InputNumber style={{ width: '100%' }} min={0} placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td>截至上期 拖欠金额</td>
          <td>
            <FormItem>
              {form.getFieldDecorator('amountArrears', {
                rules: [{ required: true, message: '请输入截至上期 拖欠金额' }],
              })(<InputNumber style={{ width: '100%' }} min={0} placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td rowSpan={2} className={tableStyle.title}>
            农民工工资保证金 (万元)
          </td>
          <td>工资保证金</td>
          <td>
            <FormItem>
              {form.getFieldDecorator('wageDeposit', {
                rules: [{ required: true, message: '请输入工资保证金' }],
              })(<InputNumber style={{ width: '100%' }} min={0} placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td>应急周转金</td>
          <td>
            <FormItem>
              {form.getFieldDecorator('emergencyWorkingCapital', {
                rules: [{ required: true, message: '请输入应急周转金' }],
              })(<InputNumber style={{ width: '100%' }} min={0} placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td>备注</td>
          <td colSpan={2}>
            <FormItem>
              {form.getFieldDecorator('remarks', {
                rules: [{ required: true, message: '请输入备注' }],
              })(<Input.TextArea placeholder="请输入" />)}
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
