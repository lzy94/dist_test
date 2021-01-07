import React from 'react';
import moment from 'moment';
import { Form, Input, DatePicker } from 'antd';
import { checkPhone } from '@/utils/utils';

import tableStyle from '../../../style.less';

const FormItem = Form.Item;

function setValueField(field) {
  const keys = Object.keys(field);
  const obj = {};
  for (let i = 0; i < keys.length; i += 1) {
    obj[keys[i]] = Form.createFormField({
      // value: keys[i] === 'contractDuration' ? moment(field[keys[i]], 'YYYY-MM-DD') : field[keys[i]],
      value: field[keys[i]],
    });
  }
  return obj;
}

const MyForm = Form.create({
  mapPropsToFields(props) {
    return setValueField(props.field);
  },
})(props => {
  const { form } = props;
  return (
    <table className={tableStyle.table}>
      <tbody>
        <tr>
          <td colSpan={2}>工程项目及标段名称</td>
          <td colSpan={8}>
            <FormItem>
              {form.getFieldDecorator('projectName', {
                rules: [{ required: true, message: '请输入工程项目及标段名称' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td colSpan={2}>施工（监理）单位名称</td>
          <td colSpan={8}>
            <FormItem>
              {form.getFieldDecorator('construcUnit', {
                rules: [{ required: true, message: '请输入施工（监理）单位名称' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td colSpan={2}>所承担的工程项目内容</td>
          <td colSpan={8}>
            <FormItem>
              {form.getFieldDecorator('projectDesc', {
                rules: [{ required: true, message: '请输入所承担的工程项目内容' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td colSpan={2}>工程合同工期</td>
          <td colSpan={8}>
            {/* <FormItem>
              {form.getFieldDecorator('contractDuration', {
                rules: [{ required: true, message: '请选择工程合同工期' }],
              })(<DatePicker style={{ width: '100%' }} placeholder="请选择" />)}
            </FormItem> */}
            <FormItem>
              {form.getFieldDecorator('contractDuration', {
                rules: [{ required: true, message: '请输入工程合同工期' }],
              })(<Input placeholder="请输入工程合同工期（xxxx-xx-xx ~ xxxx-xx-xx）" />)}
            </FormItem>
          </td>
        </tr>

        <tr>
          <td rowSpan={3}>实验检测机构</td>
          <td>名称</td>
          <td colSpan={8}>
            <FormItem>
              {form.getFieldDecorator('detectName', {
                rules: [{ required: true, message: '请输入实验检测机构名称' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td>等级及编号</td>
          <td colSpan={2}>
            <FormItem>
              {form.getFieldDecorator('detectGrade', {
                rules: [{ required: true, message: '请输入等级及编号' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </td>
          <td colSpan={3}>发证机关</td>
          <td colSpan={3}>
            <FormItem>
              {form.getFieldDecorator('detectLssueOrgan', {
                rules: [{ required: true, message: '请输入发证机关' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td>地址</td>
          <td colSpan={2}>
            <FormItem>
              {form.getFieldDecorator('detectAddr', {
                rules: [{ required: true, message: '请输入地址' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </td>
          <td colSpan={3}>联系方式</td>
          <td colSpan={3}>
            <FormItem>
              {form.getFieldDecorator('detectPhone', {
                rules: [{ required: true, message: '请输入联系方式' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>

        <tr>
          <td rowSpan={2}>工地实验室</td>
          <td>详细地址</td>
          <td colSpan={8}>
            <FormItem>
              {form.getFieldDecorator('laboratoryAddr', {
                rules: [{ required: true, message: '请输入详细地址' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td>联系方式</td>
          <td>电话</td>
          <td colSpan={3}>
            <FormItem>
              {form.getFieldDecorator('laboratoryPhone', {
                rules: [{ required: true, message: '请输入电话' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </td>
          <td>传真</td>
          <td colSpan={3}>
            <FormItem>
              {form.getFieldDecorator('laboratoryFax', {
                rules: [{ required: true, message: '请输入传真' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>

        <tr>
          <td rowSpan={2}>工地实验室负责人</td>
          <td>姓名</td>
          <td colSpan={4}>
            <FormItem>
              {form.getFieldDecorator('principalName', {
                rules: [{ required: true, message: '请输入姓名' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </td>
          <td>联系电话</td>
          <td colSpan={3}>
            <FormItem>
              {form.getFieldDecorator('principalPhone', {
                rules: [{ required: true, validator: checkPhone }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>

        <tr>
          <td>职称/资格</td>
          <td colSpan={4}>
            <FormItem>
              {form.getFieldDecorator('principalJobTitle', {
                rules: [{ required: true, message: '请输入职称/资格' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </td>
          <td>资格证书</td>
          <td colSpan={3}>
            <FormItem>
              {form.getFieldDecorator('principalCredebtials', {
                rules: [{ required: true, message: '请输入资格证书' }],
              })(<Input placeholder="请输入" />)}
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
