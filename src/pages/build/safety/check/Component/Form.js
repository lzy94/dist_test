import React, { Fragment } from 'react';
import moment from 'moment';
import { Form, Select, DatePicker, InputNumber } from 'antd';

import { cate, project } from '@/utils/constant';

const FormItem = Form.Item;
const { Option } = Select;

function setValueField(field) {
  const keys = Object.keys(field);
  const obj = {};
  for (let i = 0; i < keys.length; i += 1) {
    obj[keys[i]] = Form.createFormField({
      ...field[keys[i]],
      value:
        keys[i] === 'checkTime'
          ? moment(new Date(field[keys[i]].value), 'YYYY-MM-DD')
          : field[keys[i]].value,
    });
  }
  return obj;
}

const MyForm = Form.create({
  mapPropsToFields(props) {
    return setValueField(props.field);
  },
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields);
  },
})(props => {
  const { form, cateIndex, setCateIndex } = props;
  const onChange = (_, e) => {
    form.setFieldsValue({
      projectName: undefined,
    });
    setCateIndex(e.props.title);
  };

  return (
    <Fragment>
      <FormItem label="抽检类别">
        {form.getFieldDecorator('catogery', {
          rules: [{ required: true, message: '请选择抽检类别！' }],
        })(
          <Select placeholder="请输入" style={{ width: '100%' }} onChange={onChange}>
            {cate.map((item, i) => (
              <Option value={item} key={item} title={`${i}`}>
                {item}
              </Option>
            ))}
          </Select>,
        )}
      </FormItem>
      <FormItem label="抽检项目">
        {form.getFieldDecorator('projectName', {
          rules: [{ required: true, message: '请选择抽检项目！' }],
        })(
          <Select placeholder="请输入" style={{ width: '100%' }}>
            {project[cateIndex].map(item => (
              <Option value={item} key={item}>
                {item}
              </Option>
            ))}
          </Select>,
        )}
      </FormItem>
      <FormItem label="抽检时间">
        {form.getFieldDecorator('checkTime', {
          rules: [{ required: true, message: '请输入抽检时间！' }],
        })(<DatePicker style={{ width: '100%' }} />)}
      </FormItem>
      <FormItem label="合格数">
        {form.getFieldDecorator('passNum', {
          rules: [{ required: true, message: '请输入合格数！' }],
        })(<InputNumber placeholder="请输入" min={0} style={{ width: '100%' }} />)}
      </FormItem>
      <FormItem label="检测数">
        {form.getFieldDecorator('checkNum', {
          rules: [{ required: true, message: '请输入检测数！' }],
        })(<InputNumber placeholder="请输入" min={0} style={{ width: '100%' }} />)}
      </FormItem>
    </Fragment>
  );
});

MyForm.defaultProps = {
  field: {},
  cateIndex: 0,
  onChange: () => {},
  setCateIndex: () => {},
};

export default MyForm;
