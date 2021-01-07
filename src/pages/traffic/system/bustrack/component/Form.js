import React, { Fragment } from 'react';
import { Form, InputNumber, Input } from 'antd';

const FormItem = Form.Item;

function setValueField(field) {
  const keys = Object.keys(field);
  const obj = {};
  for (let i = 0; i < keys.length; i += 1) {
    obj[keys[i]] = Form.createFormField({
      ...field[keys[i]],
      value: field[keys[i]].value,
    });
  }
  return obj;
}

function numberCheck(value) {
  return value.replace(/^(0+)|[^\d]+/g, '');
}

const MyForm = Form.create({
  mapPropsToFields(props) {
    return setValueField(props.field);
  },
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields);
  },
})(({ form, type }) => {
  return (
    <Fragment>
      <FormItem label="方法名称">
        {form.getFieldDecorator('methodName', {
          rules: [{ required: true, message: '请输入方法名称！' }],
        })(<Input disabled={type === 'edit'} placeholder="请输入" />)}
      </FormItem>
      <FormItem label="方法值">
        {form.getFieldDecorator('methodValue', {
          rules: [{ required: true, message: '请输入方法值！' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem label="下次调用时间（h）">
        {form.getFieldDecorator('nextTryTime', {
          rules: [{ required: true, message: '请输入方法值！' }],
        })(
          <InputNumber
            formatter={numberCheck}
            parser={numberCheck}
            min={0}
            placeholder="请输入"
            style={{ width: '100%' }}
          />,
        )}
      </FormItem>
      <FormItem label="限制次数">
        {form.getFieldDecorator('limitNumber', {
          rules: [{ required: true, message: '请输入限制次数！' }],
        })(
          <InputNumber
            formatter={numberCheck}
            parser={numberCheck}
            placeholder="请输入"
            min={0}
            style={{ width: '100%' }}
          />,
        )}
      </FormItem>
    </Fragment>
  );
});

MyForm.defaultProps = {
  type: 'add',
  field: {},
  onChange: () => {},
};

export default MyForm;
