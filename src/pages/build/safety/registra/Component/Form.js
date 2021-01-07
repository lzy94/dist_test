import React from 'react';
import { Form, Input } from 'antd';

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
})(props => {
  const { form } = props;
  return (
    <table className={tableStyle.table}>
      <tbody>
        <tr>
          <td colSpan={2} className={tableStyle.title}>
            工程项目名称
          </td>
          <td colSpan={10}>
            <FormItem>
              {form.getFieldDecorator('projectName', {
                rules: [{ required: true, message: '请输入工程项目名称！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td colSpan={6} className={tableStyle.title}>
            从业单位质量责任人
          </td>
          <td colSpan={6} className={tableStyle.title}>
            质量责任
          </td>
        </tr>

        <tr>
          <td colSpan={2} rowSpan={3} className={tableStyle.title}>
            项目法人
          </td>
          <td>名称</td>
          <td colSpan={3}>
            <FormItem>
              {form.getFieldDecorator('prolegalName', {
                rules: [{ required: true, message: '请输入名称！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </td>
          <td colSpan={6} rowSpan={3}>
            <FormItem style={{ height: '100%' }}>
              {form.getFieldDecorator('prolegalQualityDuty', {
                rules: [{ required: true, message: '请输入质量责任！' }],
              })(<Input.TextArea placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td colSpan={2}>法定代表人</td>
          <td colSpan={2}>
            <FormItem>
              {form.getFieldDecorator('prolegalLegalRepresent', {
                rules: [{ required: true, message: '请输入法定代表人！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td colSpan={2}>项目负责人</td>
          <td colSpan={2}>
            <FormItem>
              {form.getFieldDecorator('prolegalProjectLeader', {
                rules: [{ required: true, message: '请输入项目负责人！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>

        <tr>
          <td colSpan={2} rowSpan={3} className={tableStyle.title}>
            代理建设管理单位（如果有）
          </td>
          <td>名称</td>
          <td colSpan={3}>
            <FormItem>
              {form.getFieldDecorator('buildName', {
                rules: [{ message: '请输入建设管理名称！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </td>
          <td colSpan={6} rowSpan={3}>
            <FormItem style={{ height: '100%' }}>
              {form.getFieldDecorator('buildQualityDuty', {
                rules: [{ message: '请输入质量责任！' }],
              })(<Input.TextArea placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td colSpan={2}>法定代表人</td>
          <td colSpan={2}>
            <FormItem>
              {form.getFieldDecorator('buildLegalRepresent', {
                rules: [{ message: '请输入法定代表人！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td colSpan={2}>项目负责人</td>
          <td colSpan={2}>
            <FormItem>
              {form.getFieldDecorator('buildProjectLeader', {
                rules: [{ message: '请输入项目负责人！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>

        <tr>
          <td colSpan={2} rowSpan={4} className={tableStyle.title}>
            勘察单位
          </td>
          <td>名称</td>
          <td colSpan={3}>
            <FormItem>
              {form.getFieldDecorator('prospectName', {
                rules: [{ required: true, message: '请输入勘察单位名称！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </td>
          <td colSpan={6} rowSpan={4}>
            <FormItem style={{ height: '100%' }}>
              {form.getFieldDecorator('prospectQualityDuty', {
                rules: [{ required: true, message: '请输入质量责任！' }],
              })(<Input.TextArea placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td colSpan={2}>合同段号</td>
          <td colSpan={2}>
            <FormItem>
              {form.getFieldDecorator('prospectContractNo', {
                rules: [{ required: true, message: '请输入合同段号！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td colSpan={2}>法定代表人</td>
          <td colSpan={2}>
            <FormItem>
              {form.getFieldDecorator('prospectLegalRepresent', {
                rules: [{ required: true, message: '请输入法定代表人！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td colSpan={2}>项目负责人</td>
          <td colSpan={2}>
            <FormItem>
              {form.getFieldDecorator('prospectProjectLeader', {
                rules: [{ required: true, message: '请输入项目负责人！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>

        <tr>
          <td colSpan={2} rowSpan={4} className={tableStyle.title}>
            设计单位
          </td>
          <td>名称</td>
          <td colSpan={3}>
            <FormItem>
              {form.getFieldDecorator('designName', {
                rules: [{ required: true, message: '请输入设计单位名称！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </td>
          <td colSpan={6} rowSpan={4}>
            <FormItem style={{ height: '100%' }}>
              {form.getFieldDecorator('designQualityDuty', {
                rules: [{ required: true, message: '请输入质量责任！' }],
              })(<Input.TextArea placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td colSpan={2}>合同段号</td>
          <td colSpan={2}>
            <FormItem>
              {form.getFieldDecorator('designContractNo', {
                rules: [{ required: true, message: '请输入合同段号！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td colSpan={2}>法定代表人</td>
          <td colSpan={2}>
            <FormItem>
              {form.getFieldDecorator('designLegalRepresent', {
                rules: [{ required: true, message: '请输入法定代表人！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td colSpan={2}>项目负责人</td>
          <td colSpan={2}>
            <FormItem>
              {form.getFieldDecorator('designProjectLeader', {
                rules: [{ required: true, message: '请输入项目负责人！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>

        <tr>
          <td colSpan={2} rowSpan={4} className={tableStyle.title}>
            施工单位
          </td>
          <td>名称</td>
          <td colSpan={3}>
            <FormItem>
              {form.getFieldDecorator('workName', {
                rules: [{ required: true, message: '请输入施工单位名称！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </td>
          <td colSpan={6} rowSpan={4}>
            <FormItem style={{ height: '100%' }}>
              {form.getFieldDecorator('workQualityDuty', {
                rules: [{ required: true, message: '请输入质量责任！' }],
              })(<Input.TextArea placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td colSpan={2}>合同段号</td>
          <td colSpan={2}>
            <FormItem>
              {form.getFieldDecorator('workContractNo', {
                rules: [{ required: true, message: '请输入合同段号！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td colSpan={2}>法定代表人</td>
          <td colSpan={2}>
            <FormItem>
              {form.getFieldDecorator('workLegalRepresent', {
                rules: [{ required: true, message: '请输入法定代表人！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td colSpan={2}>项目负责人</td>
          <td colSpan={2}>
            <FormItem>
              {form.getFieldDecorator('workProjectLeader', {
                rules: [{ required: true, message: '请输入项目负责人！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td colSpan={2} rowSpan={4} className={tableStyle.title}>
            监理单位
          </td>
          <td>名称</td>
          <td colSpan={3}>
            <FormItem>
              {form.getFieldDecorator('superviseName', {
                rules: [{ required: true, message: '请输入监理单位名称！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </td>
          <td colSpan={6} rowSpan={4}>
            <FormItem style={{ height: '100%' }}>
              {form.getFieldDecorator('superviseQualityDuty', {
                rules: [{ required: true, message: '请输入质量责任！' }],
              })(<Input.TextArea placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td colSpan={2}>合同段号</td>
          <td colSpan={2}>
            <FormItem>
              {form.getFieldDecorator('superviseContractNo', {
                rules: [{ required: true, message: '请输入合同段号！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td colSpan={2}>法定代表人</td>
          <td colSpan={2}>
            <FormItem>
              {form.getFieldDecorator('superviseLegalRepresent', {
                rules: [{ required: true, message: '请输入法定代表人！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td colSpan={2}>项目负责人</td>
          <td colSpan={2}>
            <FormItem>
              {form.getFieldDecorator('superviseProjectLeader', {
                rules: [{ required: true, message: '请输入项目负责人！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>

        <tr>
          <td colSpan={2} rowSpan={3} className={tableStyle.title}>
            试验检测单位
          </td>
          <td>名称</td>
          <td colSpan={3}>
            <FormItem>
              {form.getFieldDecorator('testingName', {
                rules: [{ required: true, message: '请输入试验检测单位名称！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </td>
          <td colSpan={6} rowSpan={3}>
            <FormItem style={{ height: '100%' }}>
              {form.getFieldDecorator('testingQualityDuty', {
                rules: [{ required: true, message: '请输入质量责任！' }],
              })(<Input.TextArea placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td colSpan={2}>法定代表人</td>
          <td colSpan={2}>
            <FormItem>
              {form.getFieldDecorator('testingLegalRepresent', {
                rules: [{ required: true, message: '请输入法定代表人！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td colSpan={2}>项目负责人</td>
          <td colSpan={2}>
            <FormItem>
              {form.getFieldDecorator('testingProjectLeader', {
                rules: [{ required: true, message: '请输入项目负责人！' }],
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
