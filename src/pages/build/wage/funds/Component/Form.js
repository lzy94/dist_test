import React from 'react';
import moment from 'moment';
import { Form, Input, DatePicker, Radio, InputNumber } from 'antd';
import { checkPhone } from '@/utils/utils';

import tableStyle from '../../../style.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

function setValueField(field) {
  const keys = Object.keys(field);
  const obj = {};
  for (let i = 0; i < keys.length; i += 1) {
    if (keys[i] === 'startTime') {
      if (/~/.test(field[keys[i]])) {
        const time = field[keys[i]].split('~');
        obj[keys[i]] = Form.createFormField({
          value: [moment(time[0], 'YYYY-MM-DD'), moment(time[1], 'YYYY-MM-DD')],
        });
      } else {
        obj[keys[i]] = Form.createFormField({
          value: field[keys[i]],
        });
      }
    } else if (keys[i] === 'incorporationTime') {
      obj[keys[i]] = Form.createFormField({
        value: moment(new Date(field[keys[i]]), 'YYYY-MM-DD'),
      });
    } else {
      obj[keys[i]] = Form.createFormField({
        value: field[keys[i]],
      });
    }
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
        <col width={100} />
        <col width={80} />
        <col width={80} />
      </colgroup>
      <tbody>
        <tr>
          <td colSpan={4} className={tableStyle.title}>
            农民工工资月报表
          </td>
        </tr>
        <tr>
          <td colSpan={2}>工程项目所在乡镇</td>
          <td colSpan={2}>
            <FormItem>
              {form.getFieldDecorator('projectLocation', {
                rules: [{ required: true, message: '请输入工程项目所在乡镇' }],
              })(<Input.TextArea placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td rowSpan={6} className={tableStyle.title}>
            项目基本情况
          </td>
          <td>名称</td>
          <td colSpan={2}>
            <FormItem>
              {form.getFieldDecorator('projectName', {
                rules: [{ required: true, message: '请输入项目名称' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td>地址</td>
          <td colSpan={2}>
            <FormItem>
              {form.getFieldDecorator('projectAddr', {
                rules: [{ required: true, message: '请输入地址' }],
              })(<Input.TextArea placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td>审批或许可部门</td>
          <td colSpan={2}>
            <FormItem>
              {form.getFieldDecorator('licenseDepartment', {
                rules: [{ required: true, message: '请输入审批或许可部门' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td>建设单位及联系电话</td>
          <td style={{ width: '33%' }}>
            <FormItem>
              {form.getFieldDecorator('jsdw', {
                rules: [{ required: true, message: '请输入建设单位' }],
              })(<Input placeholder="请输入建设单位" />)}
            </FormItem>
          </td>
          <td>
            <FormItem>
              {form.getFieldDecorator('jsdwLxdh', {
                rules: [
                  {
                    required: true,
                    validator: checkPhone,
                  },
                ],
              })(<Input placeholder="请输入建设单位联系电话" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td>总包单位及联系电话</td>
          <td style={{ width: '33%' }}>
            <FormItem>
              {form.getFieldDecorator('zbdw', {
                rules: [{ required: true, message: '请输入总包单位' }],
              })(<Input placeholder="请输入总包单位" />)}
            </FormItem>
          </td>
          <td>
            <FormItem>
              {form.getFieldDecorator('zbdwLxdh', {
                rules: [
                  {
                    required: true,
                    validator: checkPhone,
                  },
                ],
              })(<Input placeholder="请输入总包单位联系电话" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td>开工及计划完工时间</td>
          <td colSpan={2}>
            <FormItem>
              {form.getFieldDecorator('startTime', {
                rules: [{ required: true, message: '请选择' }],
              })(<RangePicker style={{ width: '100%' }} format="YYYY-MM-DD" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td rowSpan={8} className={tableStyle.title}>
            建设领域有关制度落实情况
          </td>
          <td rowSpan={2}>依法发包等情况</td>
          <td>是否存在违法行为</td>
          <td style={{ textAlign: 'left' }}>
            <FormItem>
              {form.getFieldDecorator('illegalConduct', {
                rules: [{ required: true, message: '请选择' }],
              })(
                <Radio.Group>
                  <Radio value="是">是</Radio>
                  <Radio value="否">否</Radio>
                </Radio.Group>,
              )}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td>处理情况</td>
          <td>
            <FormItem>
              {form.getFieldDecorator('handlingSituation', {})(
                <Input.TextArea placeholder="请输入" />,
              )}
            </FormItem>
          </td>
        </tr>

        <tr>
          <td rowSpan={2}>工程款支付担保制度落实情况</td>
          <td>是否推行</td>
          <td style={{ textAlign: 'left' }}>
            <FormItem>
              {form.getFieldDecorator('isImplement', {
                rules: [{ required: true, message: '请选择' }],
              })(
                <Radio.Group>
                  <Radio value="是">是</Radio>
                  <Radio value="否">否</Radio>
                </Radio.Group>,
              )}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td>担保形式</td>
          <td>
            <FormItem>
              {form.getFieldDecorator('formGuarantee', {})(<Input.TextArea placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>

        <tr>
          <td rowSpan={2}>工程款过程结算制度落实情况</td>
          <td>是否落实</td>
          <td style={{ textAlign: 'left' }}>
            <FormItem>
              {form.getFieldDecorator('isFulfill', {
                rules: [{ required: true, message: '请选择' }],
              })(
                <Radio.Group>
                  <Radio value="是">是</Radio>
                  <Radio value="否">否</Radio>
                </Radio.Group>,
              )}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td>结算周期</td>
          <td>
            <FormItem>
              {form.getFieldDecorator('billingCycle', {})(<Input.TextArea placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td rowSpan={2}>未履行工程款支付责任纳入行业主管部门信用体系情况</td>
          <td>是否纳入</td>
          <td style={{ textAlign: 'left' }}>
            <FormItem>
              {form.getFieldDecorator('isInclude', {
                rules: [{ required: true, message: '请选择' }],
              })(
                <Radio.Group>
                  <Radio value="是">是</Radio>
                  <Radio value="否">否</Radio>
                </Radio.Group>,
              )}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td>纳入时间</td>
          <td>
            <FormItem>
              {form.getFieldDecorator('incorporationTime', {})(
                <DatePicker style={{ width: '100%' }} placeholder="请选择" />,
              )}
            </FormItem>
          </td>
        </tr>

        <tr>
          <td rowSpan={13} className={tableStyle.title}>
            工资支付保障制度落实情况
          </td>
          <td rowSpan={3}>实名制管理制度落实情况</td>
          <td>农民工人数</td>
          <td>
            <FormItem>
              {form.getFieldDecorator('farmerNumber', {
                rules: [{ required: true, message: '请输入' }],
              })(<InputNumber style={{ width: '100%' }} min={0} placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td>签订合同人数</td>
          <td>
            <FormItem>
              {form.getFieldDecorator('signingNumber', {
                rules: [{ required: true, message: '请输入' }],
              })(<InputNumber style={{ width: '100%' }} min={0} placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td>纳入信息系统管理人数</td>
          <td>
            <FormItem>
              {form.getFieldDecorator('intoSystemNumber', {
                rules: [{ required: true, message: '请输入' }],
              })(<InputNumber style={{ width: '100%' }} min={0} placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td rowSpan={3}>农民工工资专用账户建立及使用情况</td>
          <td>账号</td>
          <td>
            <FormItem>
              {form.getFieldDecorator('accountNumber', {
                rules: [{ required: true, message: '请输入' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td>建设单位拨付数额</td>
          <td>
            <FormItem>
              {form.getFieldDecorator('amountAllocated', {
                rules: [{ required: true, message: '请输入' }],
              })(<InputNumber style={{ width: '100%' }} min={0} placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td>委托银行发放金额</td>
          <td>
            <FormItem>
              {form.getFieldDecorator('amountIssued', {
                rules: [{ required: true, message: '请输入' }],
              })(<InputNumber style={{ width: '100%' }} min={0} placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td rowSpan={2}>工资保证金制度落实情况</td>
          <td>交纳形式</td>
          <td>
            <FormItem>
              {form.getFieldDecorator('deliveryForm', {
                rules: [{ required: true, message: '请输入' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td>金额</td>
          <td>
            <FormItem>
              {form.getFieldDecorator('amount', {
                rules: [{ required: true, message: '请输入' }],
              })(<InputNumber style={{ width: '100%' }} min={0} placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td rowSpan={2}>按月足额支付工资情况</td>
          <td>总人数</td>
          <td>
            <FormItem>
              {form.getFieldDecorator('totalPeople', {
                rules: [{ required: true, message: '请输入' }],
              })(<InputNumber style={{ width: '100%' }} min={0} placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td>总金额</td>
          <td>
            <FormItem>
              {form.getFieldDecorator('totalAmount', {
                rules: [{ required: true, message: '请输入' }],
              })(<InputNumber style={{ width: '100%' }} min={0} placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>

        <tr>
          <td rowSpan={2}>有关单位落实清偿欠薪责任情况</td>
          <td>建设单位清偿金额</td>
          <td>
            <FormItem>
              {form.getFieldDecorator('buildSettlementAmount', {
                rules: [{ required: true, message: '请输入' }],
              })(<InputNumber style={{ width: '100%' }} min={0} placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td>施工总承包单位清偿金额</td>
          <td>
            <FormItem>
              {form.getFieldDecorator('construcSettlementAmount', {
                rules: [{ required: true, message: '请输入' }],
              })(<InputNumber style={{ width: '100%' }} min={0} placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td colSpan={2}>是否落实维权信息告示牌制度情况</td>
          <td>
            <FormItem>
              {form.getFieldDecorator('rightsNotice', {
                rules: [{ required: true, message: '请输入' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </td>
        </tr>
        <tr>
          <td>备注</td>
          <td colSpan={3}>
            <FormItem>
              {form.getFieldDecorator('remarks', {
                rules: [{ required: true, message: '请输入' }],
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
