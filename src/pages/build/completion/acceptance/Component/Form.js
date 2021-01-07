import React from 'react';
import moment from 'moment';
import { Form, Input, DatePicker, Upload, Button, Icon, message, InputNumber } from 'antd';
import { filePDZ, getLocalStorage } from '@/utils/utils';

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
  const { form, fileList, uploadChange } = props;

  const uploadConfig = () => {
    return {
      name: 'files',
      action: '/result/api/file/v1/fileUpload',
      listType: 'picture',
      accept: '.pdf,.doc,.docx,.zip',
      className: 'upload-list-inline',
      data: {
        type: 9,
      },
      headers: {
        Authorization: `Bearer ${getLocalStorage('token')[0]}`,
        'x-requested-with': 'XMLHttpRequest',
      },
      beforeUpload: filePDZ,
      onChange: uploadChange,
    };
  };

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
          <td className={tableStyle.title}>七</td>
          <td>批准概算</td>
          <td>
            <FormItem>
              {form.getFieldDecorator('budget', {
                rules: [{ required: true, message: '请输入批准概算' }],
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
          <td className={tableStyle.title}>十</td>
          <td>建设项目工程质量交工验收结论</td>
          <td>
            <FormItem>
              {form.getFieldDecorator('acceptanceConclusion', {
                rules: [{ required: true, message: '请输入建设项目工程质量交工验收结论' }],
              })(<Input.TextArea placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td className={tableStyle.title}>十一</td>
          <td>存在问题处理措施</td>
          <td>
            <FormItem>
              {form.getFieldDecorator('treatmentMeasures', {
                rules: [{ required: true, message: '请输入存在问题处理措施' }],
              })(<Input.TextArea placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td className={tableStyle.title}>十二</td>
          <td>附件（自行上传）</td>
          <td style={{ textAlign: 'left' }}>
            <FormItem>
              {form.getFieldDecorator('annexUrl', {
                rules: [{ required: true, message: '附件' }],
              })(
                <Upload {...uploadConfig()} defaultFileList={fileList}>
                  {!fileList.length && (
                    <Button>
                      <Icon type="upload" /> 附件( pdf , doc, docx, zip)
                    </Button>
                  )}
                </Upload>,
              )}
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
