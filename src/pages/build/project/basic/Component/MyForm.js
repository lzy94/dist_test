import React from 'react';
import moment from 'moment';
import { Form, InputNumber, Input, DatePicker } from 'antd';
import { checkDate } from '@/utils/utils';

import styles from '../../../style.less';

function setValueField(field) {
  const keys = Object.keys(field);
  const obj = {};
  for (let i = 0; i < keys.length; i += 1) {
    if (keys[i] === 'plannedStartTime' || keys[i] === 'proposedDeliveryTime') {
      obj[keys[i]] = Form.createFormField({
        value: field[keys[i]] ? moment(new Date(field[keys[i]]), 'YYYY-MM-DD') : null,
      });
    } else {
      obj[keys[i]] = Form.createFormField({
        value: checkDate(field[keys[i]]) ? moment(field[keys[i]], 'YYYY-MM-DD') : field[keys[i]],
      });
    }
  }
  return obj;
}

const MyForm = Form.create({
  mapPropsToFields(props) {
    return setValueField(props.field);
  },
  // onFieldsChange(props, changedFields) {
  //   // props.onChange(changedFields);
  //   console.log(changedFields, '----');
  // },
  onValuesChange(props, values) {
    props.onChange(values);
  },
})(props => {
  const {
    form: { getFieldDecorator },
  } = props;
  return (
    <table className={styles.table}>
      <tbody>
        <tr>
          <td>项目名称</td>
          <td colSpan={4}>
            {getFieldDecorator('projectName', {
              rules: [{ required: true, message: '请输入项目名称！' }],
            })(<Input placeholder="请输入" />)}
          </td>
          <td>项目类型</td>
          <td colSpan={4}>
            {getFieldDecorator('projectType', {
              rules: [{ required: true, message: '请输入项目类型！' }],
            })(<Input placeholder="请输入" />)}
          </td>
        </tr>
        <tr>
          <td>建设单位</td>
          <td colSpan={4}>
            {getFieldDecorator('buildUnit', {
              rules: [{ required: true, message: '请输入建设单位！' }],
            })(<Input placeholder="请输入" />)}
          </td>
          <td>设计单位</td>
          <td colSpan={4}>
            {getFieldDecorator('designUnit', {
              rules: [{ required: true, message: '请输入设计单位！' }],
            })(<Input placeholder="请输入" />)}
          </td>
        </tr>
        <tr>
          <td colSpan={2} />
          <td colSpan={3} className={styles.title}>
            审批单位
          </td>
          <td colSpan={3} className={styles.title}>
            批准文号
          </td>
          <td colSpan={2} className={styles.title}>
            批准时间
          </td>
        </tr>
        <tr>
          <td colSpan={2}>项目立项</td>
          <td colSpan={3}>
            {getFieldDecorator('projectApproval_1', {
              rules: [{ required: true, message: '请输入审批单位！' }],
            })(<Input placeholder="请输入" />)}
          </td>
          <td colSpan={3}>
            {getFieldDecorator('projectApproval_2', {
              rules: [{ required: true, message: '请输入批准文号！' }],
            })(<Input placeholder="请输入" />)}
          </td>
          <td colSpan={2}>
            {getFieldDecorator('projectApproval_3', {
              rules: [{ required: true, message: '请选择批准时间！' }],
            })(<DatePicker style={{ width: '100%' }} placeholder="请选择" />)}
          </td>
        </tr>
        <tr>
          <td colSpan={2}>工可批复</td>
          <td colSpan={3}>
            {getFieldDecorator('workersApprove_1', {
              rules: [{ required: true, message: '请输入审批单位！' }],
            })(<Input placeholder="请输入" />)}
          </td>
          <td colSpan={3}>
            {getFieldDecorator('workersApprove_2', {
              rules: [{ required: true, message: '请输入批准文号！' }],
            })(<Input placeholder="请输入" />)}
          </td>
          <td colSpan={2}>
            {getFieldDecorator('workersApprove_3', {
              rules: [{ required: true, message: '请选择批准时间！' }],
            })(<DatePicker style={{ width: '100%' }} placeholder="请选择" />)}
          </td>
        </tr>
        <tr>
          <td colSpan={2}>初步设计审查</td>
          <td colSpan={3}>
            {getFieldDecorator('designReview_1', {
              rules: [{ required: true, message: '请输入审批单位！' }],
            })(<Input placeholder="请输入" />)}
          </td>
          <td colSpan={3}>
            {getFieldDecorator('designReview_2', {
              rules: [{ required: true, message: '请输入批准文号！' }],
            })(<Input placeholder="请输入" />)}
          </td>
          <td colSpan={2}>
            {getFieldDecorator('designReview_3', {
              rules: [{ required: true, message: '请选择批准时间！' }],
            })(<DatePicker style={{ width: '100%' }} placeholder="请选择" />)}
          </td>
        </tr>
        <tr>
          <td colSpan={2}>施工图设计批复</td>
          <td colSpan={3}>
            {getFieldDecorator('workingDrawingReview_1', {
              rules: [{ required: true, message: '请输入审批单位！' }],
            })(<Input placeholder="请输入" />)}
          </td>
          <td colSpan={3}>
            {getFieldDecorator('workingDrawingReview_2', {
              rules: [{ required: true, message: '请输入批准文号！' }],
            })(<Input placeholder="请输入" />)}
          </td>
          <td colSpan={2}>
            {getFieldDecorator('workingDrawingReview_3', {
              rules: [{ required: true, message: '请选择批准时间！' }],
            })(<DatePicker style={{ width: '100%' }} placeholder="请选择" />)}
          </td>
        </tr>
        <tr>
          <td>建设里程(km)</td>
          <td>
            {getFieldDecorator('buildMileage', {
              rules: [{ required: true, message: '请输入建设里程！' }],
            })(<InputNumber min={0} style={{ width: '100%' }} placeholder="请输入" />)}
          </td>
          <td colSpan={2}>设计时速(km/h)</td>
          <td>
            {getFieldDecorator('designSpeed', {
              rules: [{ required: true, message: '请输入设计时速！' }],
            })(<InputNumber min={0} style={{ width: '100%' }} placeholder="请输入" />)}
          </td>
          <td colSpan={2}>路基宽度(m)</td>
          <td>
            {getFieldDecorator('subgradeWidth', {
              rules: [{ required: true, message: '请输入路基宽度！' }],
            })(<InputNumber min={0} style={{ width: '100%' }} placeholder="请输入" />)}
          </td>
          <td>桥隧比例(%)</td>
          <td>
            {getFieldDecorator('bridgeTunnelRatio', {
              rules: [{ required: true, message: '请输入桥隧比例！' }],
            })(<InputNumber min={0} style={{ width: '100%' }} placeholder="请输入" />)}
          </td>
        </tr>
        <tr>
          <td>工程概算(万元)</td>
          <td>
            {getFieldDecorator('engineeringBudget', {
              rules: [{ required: true, message: '请输入工程概算！' }],
            })(<InputNumber min={0} style={{ width: '100%' }} placeholder="请输入" />)}
          </td>
          <td colSpan={2}>建安费(万元)</td>
          <td>
            {getFieldDecorator('constructionFee', {
              rules: [{ required: true, message: '请输入建安费！' }],
            })(<InputNumber min={0} style={{ width: '100%' }} placeholder="请输入" />)}
          </td>
          <td colSpan={2}>合同价(万元)</td>
          <td colSpan={3}>
            {getFieldDecorator('contractPrice', {
              rules: [{ required: true, message: '请输入合同价！' }],
            })(<InputNumber min={0} style={{ width: '100%' }} placeholder="请输入" />)}
          </td>
        </tr>
        <tr>
          <td>批准工期(月)</td>
          <td>
            {getFieldDecorator('approvalPeriod', {
              rules: [{ required: true, message: '请输入批准工期！' }],
            })(<InputNumber min={0} style={{ width: '100%' }} placeholder="请输入" />)}
          </td>
          <td colSpan={2}>合同工期(月)</td>
          <td>
            {getFieldDecorator('contractDuration', {
              rules: [{ required: true, message: '请输入合同工期！' }],
            })(<InputNumber min={0} style={{ width: '100%' }} placeholder="请输入" />)}
          </td>
          <td colSpan={2}>(拟)开工时间</td>
          <td>
            {getFieldDecorator('plannedStartTime', {
              rules: [{ required: true, message: '请输入开工时间！' }],
            })(<DatePicker style={{ width: '100%' }} placeholder="请输入" />)}
          </td>
          <td>(拟)交工时间</td>
          <td>
            {getFieldDecorator('proposedDeliveryTime', {
              rules: [{ required: true, message: '请输入交工时间期！' }],
            })(<DatePicker style={{ width: '100%' }} placeholder="请输入" />)}
          </td>
        </tr>

        <tr>
          <td colSpan={5} className={styles.title}>
            桥梁工程
          </td>
          <td colSpan={5} className={styles.title}>
            隧道工程(瓦斯隧道请备注)
          </td>
        </tr>
        <tr>
          <td>特大桥(座)</td>
          <td>
            {getFieldDecorator('extraLargeBridge_1', {
              rules: [{ required: true, message: '请输入特大桥！' }],
            })(<InputNumber min={0} style={{ width: '100%' }} placeholder="请输入" />)}
          </td>
          <td colSpan={2}>累计长度(m)</td>
          <td>
            {getFieldDecorator('extraLargeBridge_2', {
              rules: [{ required: true, message: '请输入累计长度！' }],
            })(<InputNumber min={0} style={{ width: '100%' }} placeholder="请输入" />)}
          </td>
          <td colSpan={2}>特长隧道(座)</td>
          <td>
            {getFieldDecorator('extraLongTunnel_1', {
              rules: [{ required: true, message: '请输入特长隧道！' }],
            })(<InputNumber min={0} style={{ width: '100%' }} placeholder="请输入" />)}
          </td>
          <td>累计长度(m)</td>
          <td>
            {getFieldDecorator('extraLongTunnel_2', {
              rules: [{ required: true, message: '请输入累计长度！' }],
            })(<InputNumber min={0} style={{ width: '100%' }} placeholder="请输入" />)}
          </td>
        </tr>
        <tr>
          <td>大桥(座)</td>
          <td>
            {getFieldDecorator('bigBridge_1', {
              rules: [{ required: true, message: '请输入大桥！' }],
            })(<InputNumber min={0} style={{ width: '100%' }} placeholder="请输入" />)}
          </td>
          <td colSpan={2}>累计长度(m)</td>
          <td>
            {getFieldDecorator('bigBridge_2', {
              rules: [{ required: true, message: '请输入累计长度！' }],
            })(<InputNumber min={0} style={{ width: '100%' }} placeholder="请输入" />)}
          </td>
          <td colSpan={2}>长隧道(座)</td>
          <td>
            {getFieldDecorator('longTunnel_1', {
              rules: [{ required: true, message: '请输入长隧道！' }],
            })(<InputNumber min={0} style={{ width: '100%' }} placeholder="请输入" />)}
          </td>
          <td>累计长度(m)</td>
          <td>
            {getFieldDecorator('longTunnel_2', {
              rules: [{ required: true, message: '请输入累计长度！' }],
            })(<InputNumber min={0} style={{ width: '100%' }} placeholder="请输入" />)}
          </td>
        </tr>
        <tr>
          <td>中桥(座)</td>
          <td>
            {getFieldDecorator('middleBridge_1', {
              rules: [{ required: true, message: '请输入中桥！' }],
            })(<InputNumber min={0} style={{ width: '100%' }} placeholder="请输入" />)}
          </td>
          <td colSpan={2}>累计长度(m)</td>
          <td>
            {getFieldDecorator('middleBridge_2', {
              rules: [{ required: true, message: '请输入累计长度！' }],
            })(<InputNumber min={0} style={{ width: '100%' }} placeholder="请输入" />)}
          </td>
          <td colSpan={2}>中隧道(座)</td>
          <td>
            {getFieldDecorator('middleTunnel_1', {
              rules: [{ required: true, message: '请输入中隧道！' }],
            })(<InputNumber min={0} style={{ width: '100%' }} placeholder="请输入" />)}
          </td>
          <td>累计长度(m)</td>
          <td>
            {getFieldDecorator('middleTunnel_2', {
              rules: [{ required: true, message: '请输入累计长度！' }],
            })(<InputNumber min={0} style={{ width: '100%' }} placeholder="请输入" />)}
          </td>
        </tr>
        <tr>
          <td />
          <td />
          <td colSpan={2} />
          <td />
          <td colSpan={2}>短隧道(座)</td>
          <td>
            {getFieldDecorator('shortTunnel_1', {
              rules: [{ required: true, message: '请输入短隧道！' }],
            })(<InputNumber min={0} style={{ width: '100%' }} placeholder="请输入" />)}
          </td>
          <td>累计长度(m)</td>
          <td>
            {getFieldDecorator('shortTunnel_2', {
              rules: [{ required: true, message: '请输入累计长度！' }],
            })(<InputNumber min={0} style={{ width: '100%' }} placeholder="请输入" />)}
          </td>
        </tr>
        <tr>
          <td colSpan={10} className={styles.title}>
            合同、施工、监理单位数量
          </td>
        </tr>
        <tr>
          <td>施工合同段(个)</td>
          <td>
            {getFieldDecorator('contractSection', {
              rules: [{ required: true, message: '请输入施工合同段！' }],
            })(<InputNumber min={0} style={{ width: '100%' }} placeholder="请输入" />)}
          </td>
          <td colSpan={2}>施工单位(家)</td>
          <td>
            {getFieldDecorator('contractUnit', {
              rules: [{ required: true, message: '请输入施工单位！' }],
            })(<InputNumber min={0} style={{ width: '100%' }} placeholder="请输入" />)}
          </td>
          <td colSpan={2}>监理合同段(个)</td>
          <td>
            {getFieldDecorator('superContractSection', {
              rules: [{ required: true, message: '请输入监理合同段！' }],
            })(<InputNumber min={0} style={{ width: '100%' }} placeholder="请输入" />)}
          </td>
          <td>监理单位(家)</td>
          <td>
            {getFieldDecorator('superUnit', {
              rules: [{ required: true, message: '请输入监理单位！' }],
            })(<InputNumber min={0} style={{ width: '100%' }} placeholder="请输入" />)}
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
