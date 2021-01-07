import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Form, InputNumber, Button, message } from 'antd';

import themeStyle from '@/pages/style/theme.less';
import styles from '../styles.less';

const [bigCate, smallCate] = [
  [
    <span>MQI</span>,
    <span>
      路面
      <br />
      (PQI)
    </span>,
    <span>
      路基
      <br />
      (SIC)
    </span>,
    <span>
      桥隧
      <br />
      构造物
      <br />
      (BCI)
    </span>,
    <span>
      沿线设施
      <br />
      (TCI)
    </span>,
  ],
  ['县道', '乡道', '村道', '专用公路'],
];
const [projectType, roadType, field, NO] = [
  ['MQI', 'PQI', 'SCI', 'BCI', 'TCI'],
  smallCate.concat(['总数']),
  [
    'total',
    'excellent',
    'goodWaiting',
    'medium',
    'inferior',
    'difference',
    'excellentMid',
    'assessResults',
  ],
  [
    ['01', '02', '03', '04', '05'],
    ['06', '07', '08', '09', '10'],
    ['11', '12', '13', '14', '15'],
    ['16', '17', '18', '19', '20'],
    ['21', '22', '23', '24', '25'],
  ],
];

/* eslint react/no-multi-comp:0 */
@connect(({ ConserveSystemFrom, loading }) => ({
  ConserveSystemFrom,
  loading: loading.models.ConserveSystemFrom,
}))
@Form.create()
class CreateForm extends PureComponent {
  static defaultProps = {
    modalVisible: false,
    handleModalVisible: () => {},
  };

  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
    this.listIds = [];
  }

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    const { dispatch, detailID } = this.props;
    dispatch({
      type: 'ConserveSystemFrom/getABFI',
      payload: { formId: detailID },
      callback: data => {
        if (data.length) {
          this.setFormDta(data);
        }
      },
    });
  };

  setFormDta = data => {
    let obj = {};
    const { form } = this.props;
    for (let i = 0; i < data.length; i += 1) {
      this.listIds.push(data[i].id);
      const [setProjectType, setRoadType] = [
        projectType[data[i].projectType - 1],
        data[i].roadType,
      ];
      delete data[i].createTime;
      delete data[i].id;
      delete data[i].serialNumber;
      delete data[i].formId;
      delete data[i].roadType;
      delete data[i].projectType;

      const keys = Object.keys(data[i]);
      for (const item in keys) {
        obj = {
          ...obj,
          [`${keys[item]}_${setProjectType}_${setRoadType}`]: data[i][keys[item]],
        };
      }
    }
    form.setFieldsValue(obj);
  };

  renderTd = (type, index) => {
    const { form } = this.props;
    const html = [];
    for (let i = 0; i < 8; i += 1) {
      html.push(
        <td
          key={i}
          className={`${i === 0 || i === 6 ? `${styles.count}` : ''} ${styles.textRight}`}
        >
          {form.getFieldDecorator(`${field[i]}_${type}_${index}`)(
            <InputNumber size="small" style={{ width: '100%' }} min={0} />,
          )}
        </td>,
      );
    }
    return html;
  };

  renderCount = (type, index) => {
    const { form } = this.props;
    const html = [];
    for (let i = 0; i < 8; i += 1) {
      html.push(
        <td key={i} className={`${styles.count} ${styles.textRight}`}>
          {form.getFieldDecorator(`${field[i]}_${type}_${index}`)(
            <InputNumber size="small" style={{ width: '100%' }} min={0} />,
          )}
        </td>,
      );
    }
    return html;
  };

  renderTbodyChild = () => {
    const html = bigCate.map((item, i) => {
      return (
        <tbody key={i}>
          <tr>
            <td className={`${styles.title} ${styles.textCenter}`} rowSpan="5">
              {item}
            </td>
            <td className={styles.title}>总计</td>
            <td className={`${styles.title} ${styles.textCenter}`}>{NO[i][0]}</td>
            {this.renderCount(projectType[i], 5)}
          </tr>
          {smallCate.map((smItem, smi) => {
            return (
              <tr key={smi}>
                <td className={styles.title}>{smItem}</td>
                <td className={`${styles.title} ${styles.textCenter}`}>{NO[i][smi + 1]}</td>
                {this.renderTd(projectType[i], smi + 1)}
              </tr>
            );
          })}
        </tbody>
      );
    });
    return html;
  };

  fieldList = fields => {
    const arr = [];
    const keys = Object.keys(fields);
    for (let i = 0; i < 8; i += 1) {
      const re = new RegExp(`${field[i]}_`);
      arr[i] = keys
        .map(item => {
          if (re.test(item)) {
            const items = item.split('_');
            return {
              [field[i]]: fields[item] || 0,
              projectType: projectType.indexOf(items[1]) + 1,
              roadType: items[2],
            };
          }
          return '';
        })
        .filter(item => item);
    }
    return arr;
  };

  formatField = values => {
    const { detailID } = this.props;
    const list = this.fieldList(values);
    const fieldValues = [];
    for (let i = 0; i < 25; i += 1) {
      let obj = {};
      for (let j = 0; j < 8; j += 1) {
        obj = {
          ...obj,
          ...list[j][i],
          formId: detailID,
          serialNumber: i,
        };
      }

      if (this.listIds.length) {
        obj = { ...obj, id: this.listIds[i] };
      }
      fieldValues.push(obj);
    }
    return fieldValues;
  };

  save = () => {
    const { form, dispatch, handleModalVisible } = this.props;
    form.validateFields((err, fieldValue) => {
      if (err) return;
      const values = this.formatField(fieldValue);
      dispatch({
        type: 'ConserveSystemFrom/saveABFI',
        payload: values,
        callback: () => {
          message.success('操作成功');
          handleModalVisible();
          // console.log('success');
        },
      });
    });
  };

  render() {
    const { modalVisible, handleModalVisible, loading } = this.props;

    return (
      <Modal
        destroyOnClose
        title="公路技术状况统计表"
        className={themeStyle.formModal}
        visible={modalVisible}
        width={1200}
        onCancel={() => handleModalVisible()}
        // footer={null}
        footer={[
          <Button key="back" onClick={() => handleModalVisible()}>
            取消
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={() => this.save()}>
            确定
          </Button>,
        ]}
      >
        <table className={styles.table}>
          <thead>
            <tr className={`${styles.title} ${styles.textCenter}`}>
              <td colSpan="2" rowSpan="2">
                项目
              </td>
              <td rowSpan="2">序号</td>
              <td colSpan="6">实际评定里程(公里)</td>
              <td rowSpan="2">优良中路率(%)</td>
              <td rowSpan="2">评定结果</td>
            </tr>
            <tr className={`${styles.title} ${styles.textCenter}`}>
              <td>合计</td>
              <td>优等路</td>
              <td>良等路</td>
              <td>中等路</td>
              <td>次等路</td>
              <td>差等路</td>
            </tr>
            <tr className={`${styles.title} ${styles.textCenter}`}>
              <td colSpan="2">甲</td>
              <td>乙</td>
              <td>01</td>
              <td>02</td>
              <td>03</td>
              <td>04</td>
              <td>05</td>
              <td>06</td>
              <td>07</td>
              <td>08</td>
            </tr>
          </thead>
          {this.renderTbodyChild()}
        </table>
      </Modal>
    );
  }
}

export default CreateForm;
