import React from 'react';
import moment from 'moment';
import { Form, Input, DatePicker, InputNumber, Rate } from 'antd';

import tableStyle from '../../../style.less';

const FormItem = Form.Item;

function setValueField(field) {
  const keys = Object.keys(field);
  const obj = {};
  for (let i = 0; i < keys.length; i += 1) {
    obj[keys[i]] = Form.createFormField({
      value:
        keys[i] === 'completionDate' || keys[i] === 'startDate'
          ? moment(new Date(field[keys[i]]), 'YYYY-MM-DD')
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
    <table className={tableStyle.table} style={{ tableLayout: 'auto' }}>
      <colgroup>
        <col width={80} />
      </colgroup>
      <tbody>
        <tr>
          <td colSpan={3} className={tableStyle.title}>
            （一）交工验收情况登记
          </td>
        </tr>
        <tr>
          <td className={tableStyle.title}>一</td>
          <td>工程名称</td>
          <td>
            <FormItem>
              {form.getFieldDecorator('projectName', {
                rules: [{ required: true, message: '请输入工程名称' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td className={tableStyle.title}>二</td>
          <td>工程地点及主要控制点</td>
          <td>
            <FormItem>
              {form.getFieldDecorator('projectPlace', {
                rules: [{ required: true, message: '请输入工程地点及主要控制点' }],
              })(<Input.TextArea placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td className={tableStyle.title}>三</td>
          <td>建设依据</td>
          <td>
            <FormItem>
              {form.getFieldDecorator('construcBasis', {
                rules: [{ required: true, message: '请输入建设依据' }],
              })(<Input.TextArea placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td className={tableStyle.title}>四</td>
          <td>技术标准与主要指标</td>
          <td>
            <FormItem>
              {form.getFieldDecorator('technicalStandard', {
                rules: [{ required: true, message: '请输入技术标准与主要指标' }],
              })(<Input.TextArea placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td className={tableStyle.title}>五</td>
          <td>建设规模及性质</td>
          <td>
            <FormItem>
              {form.getFieldDecorator('construcNature', {
                rules: [{ required: true, message: '请输入建设规模及性质' }],
              })(<Input.TextArea placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td className={tableStyle.title} rowSpan={2}>
            六
          </td>
          <td>开工日期</td>
          <td>
            <FormItem>
              {form.getFieldDecorator('startDate', {
                rules: [{ required: true, message: '请选择开工日期' }],
              })(<DatePicker style={{ width: '100%' }} placeholder="请选择" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td>完工日期</td>
          <td>
            <FormItem>
              {form.getFieldDecorator('completionDate', {
                rules: [{ required: true, message: '请选择完工日期' }],
              })(<DatePicker style={{ width: '100%' }} placeholder="请选择" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td className={tableStyle.title} rowSpan={3}>
            七
          </td>
          <td>原批准概算</td>
          <td>
            <FormItem>
              {form.getFieldDecorator('budget', {
                rules: [{ required: true, message: '请输入原批准概算' }],
              })(<InputNumber style={{ width: '100%' }} placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td>调整概算</td>
          <td>
            <FormItem>
              {form.getFieldDecorator('adjustBudget', {
                rules: [{ required: true, message: '请输入调整概算' }],
              })(<InputNumber style={{ width: '100%' }} placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td>竣工决算</td>
          <td>
            <FormItem>
              {form.getFieldDecorator('completionBudget', {
                rules: [{ required: true, message: '请输入竣工决算算' }],
              })(<InputNumber style={{ width: '100%' }} placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td className={tableStyle.title}>八</td>
          <td>工程建设主要内容</td>
          <td>
            <FormItem>
              {form.getFieldDecorator('construcContent', {
                rules: [{ required: true, message: '请输入工程建设主要内容' }],
              })(<Input.TextArea placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td className={tableStyle.title}>九</td>
          <td>主要材料实际消耗</td>
          <td>
            <FormItem>
              {form.getFieldDecorator('materialConsumption', {
                rules: [{ required: true, message: '请输入主要材料实际消耗' }],
              })(<Input.TextArea placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td className={tableStyle.title}>十</td>
          <td>实际征用土地数（亩）</td>
          <td>
            <FormItem>
              {form.getFieldDecorator('landNumber', {
                rules: [{ required: true, message: '请输入实际征用土地数（亩）' }],
              })(<InputNumber style={{ width: '100%' }} placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td className={tableStyle.title} rowSpan={3}>
            十一
          </td>
          <td>交工验收基本情况</td>
          <td>
            <FormItem>
              {form.getFieldDecorator('completionAcceptance', {
                rules: [{ required: true, message: '请输入交工验收基本情况' }],
              })(<Input.TextArea placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td>质量监督机构竣工质量鉴定情况</td>
          <td>
            <FormItem>
              {form.getFieldDecorator('qualityAppraisal', {
                rules: [{ required: true, message: '请输入质量监督机构竣工质量鉴定情况' }],
              })(<Input.TextArea placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td>竣工验收鉴定结论及质量评价</td>
          <td>
            <FormItem>
              {form.getFieldDecorator('appraisalConclusion', {
                rules: [{ required: true, message: '请输入竣工验收鉴定结论及质量评价' }],
              })(<Input.TextArea placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td className={tableStyle.title} rowSpan={4}>
            十二
          </td>
          <td>对建设单位的综合评价</td>
          <td>
            <FormItem>
              {form.getFieldDecorator('buildEvaluation', {
                rules: [{ required: true, message: '请输入对建设单位的综合评价' }],
              })(<Input.TextArea placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td>对设计单位的综合评价</td>
          <td>
            <FormItem>
              {form.getFieldDecorator('designEvaluation', {
                rules: [{ required: true, message: '请输入对设计单位的综合评价' }],
              })(<Input.TextArea placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td>对施工单位的综合评价</td>
          <td>
            <FormItem>
              {form.getFieldDecorator('construcEvaluation', {
                rules: [{ required: true, message: '请输入对施工单位的综合评价' }],
              })(<Input.TextArea placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td>对监理单位的综合评价</td>
          <td>
            <FormItem>
              {form.getFieldDecorator('superEvaluation', {
                rules: [{ required: true, message: '请输入对监理单位的综合评价' }],
              })(<Input.TextArea placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td className={tableStyle.title} rowSpan={6}>
            十三
          </td>
          <td>建设管理综合评分</td>
          <td>
            <FormItem>
              {form.getFieldDecorator('buildScore', {
                rules: [{ required: true, message: '请输入建设管理综合评分' }],
              })(<InputNumber style={{ width: '100%' }} min={0} max={100} placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td>设计工作综合评分</td>
          <td>
            <FormItem>
              {form.getFieldDecorator('designScore', {
                rules: [{ required: true, message: '请输入设计工作综合评分' }],
              })(<InputNumber style={{ width: '100%' }} min={0} max={100} placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td>监理工作综合评分</td>
          <td>
            <FormItem>
              {form.getFieldDecorator('superScore', {
                rules: [{ required: true, message: '请输入监理工作综合评分' }],
              })(<InputNumber style={{ width: '100%' }} min={0} max={100} placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td>施工管理综合评分</td>
          <td>
            <FormItem>
              {form.getFieldDecorator('construcScore', {
                rules: [{ required: true, message: '请输入施工管理综合评分' }],
              })(<InputNumber style={{ width: '100%' }} min={0} max={100} placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td>建设项目综合评分</td>
          <td>
            <FormItem>
              {form.getFieldDecorator('projectScore', {
                rules: [{ required: true, message: '请输入建设项目综合评分' }],
              })(<InputNumber style={{ width: '100%' }} min={0} max={100} placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td>工程建设项目综合评价等级</td>
          <td>
            <FormItem>
              {form.getFieldDecorator('projectBuildScore', {
                rules: [{ required: true, message: '请输入工程建设项目综合评价等级' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td className={tableStyle.title}>十四</td>
          <td>有关问题的决定和建议</td>
          <td>
            <FormItem>
              {form.getFieldDecorator('decideOpinion', {
                rules: [{ required: true, message: '有关问题的决定和建议' }],
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
  fileList: [],
  uploadChange: () => {},
  onChange: () => {},
};

export default MyForm;
