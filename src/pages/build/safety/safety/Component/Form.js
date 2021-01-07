import React from 'react';
import moment from 'moment';
import { Form, Input, DatePicker, Upload, Button, Icon, Select, Row, Col } from 'antd';
import { filePDZ, getLocalStorage } from '@/utils/utils';
import { logsCate, logsCateChild, logsDutyUnit, logsRectifySituation } from '@/utils/constant';

// import tableStyle from '../../../style.less';

const FormItem = Form.Item;
const { Option } = Select;

function setValueField(field) {
  const keys = Object.keys(field);
  const obj = {};
  for (let i = 0; i < keys.length; i += 1) {
    obj[keys[i]] = Form.createFormField({
      ...field[keys[i]],
      value:
        keys[i] === 'inspectorTime'
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
  // onValuesChange(props, values) {
  //   props.onChange(values);
  // },
})(props => {
  const { form, fileList, uploadChange, setCateIndex, cateIndex } = props;

  const cateChange = (_, e) => {
    form.setFieldsValue({
      specificType: undefined,
    });
    setCateIndex(e.props.index);
  };

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
    <Row gutter={20}>
      <Col span={12}>
        <FormItem label="项目名称">
          {form.getFieldDecorator('projectName', {
            rules: [{ required: true, message: '请输入项目名称！' }],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem label="督查人员">
          {form.getFieldDecorator('inspectors', {
            rules: [{ required: true, message: '请输入督查人员！' }],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem label="督查时间">
          {form.getFieldDecorator('inspectorTime', {
            rules: [{ required: true, message: '请选择督查时间！' }],
          })(<DatePicker style={{ width: '100%' }} placeholder="请输入" />)}
        </FormItem>
        <FormItem label="问题描述">
          {form.getFieldDecorator('questionDesc', {
            rules: [{ required: true, message: '请输入问题描述！' }],
          })(<Input.TextArea placeholder="请输入" />)}
        </FormItem>
        <FormItem label="整改要求">
          {form.getFieldDecorator('improveRequire', {
            rules: [{ required: true, message: '请输入整改要求' }],
          })(<Input.TextArea placeholder="请输入" />)}
        </FormItem>
      </Col>
      <Col span={12}>
        <FormItem label="问题分类">
          {form.getFieldDecorator('questionCategory', {
            initialValue: logsCate[0],
            rules: [{ required: true, message: '请选择问题分类' }],
          })(
            <Select style={{ width: '100%' }} placeholder="请选择" onChange={cateChange}>
              {logsCate.map((item, i) => (
                <Option value={item} key={item} index={i}>
                  {item}
                </Option>
              ))}
            </Select>,
          )}
        </FormItem>
        <FormItem label="具体类型">
          {form.getFieldDecorator('specificType', {
            rules: [{ required: true, message: '请选择具体类型' }],
          })(
            <Select style={{ width: '100%' }} placeholder="请选择">
              {logsCateChild[cateIndex].map(item => (
                <Option value={item} key={item}>
                  {item}
                </Option>
              ))}
            </Select>,
          )}
        </FormItem>
        <FormItem label="责任单位">
          {form.getFieldDecorator('dutyUnit', {
            rules: [{ required: true, message: '请选择责任单位' }],
          })(
            <Select style={{ width: '100%' }} placeholder="请选择">
              {logsDutyUnit.map(item => (
                <Option value={item} key={item}>
                  {item}
                </Option>
              ))}
            </Select>,
          )}
        </FormItem>
        <FormItem label="整改情况">
          {form.getFieldDecorator('improveCondition', {
            rules: [{ required: true, message: '请选择整改情况' }],
          })(
            <Select style={{ width: '100%' }} placeholder="请选择">
              {logsRectifySituation.map(item => (
                <Option value={item} key={item}>
                  {item}
                </Option>
              ))}
            </Select>,
          )}
        </FormItem>
        <FormItem label="附件">
          {form.getFieldDecorator('annexUrl', {})(
            <Upload {...uploadConfig()} defaultFileList={fileList}>
              {!fileList.length && (
                <Button>
                  <Icon type="upload" /> 整改资料( pdf , doc, docx, zip)
                </Button>
              )}
            </Upload>,
          )}
        </FormItem>
      </Col>
    </Row>
  );
});

MyForm.defaultProps = {
  field: {},
  cateIndex: 0,
  fileList: [],
  uploadChange: () => {},
  onChange: () => {},
  setCateIndex: () => {},
};

export default MyForm;
