import React, { PureComponent } from 'react';
import { Input, Modal, Form, Button, Row, Col, Select, message } from 'antd';
import { connect } from 'dva';

import { getPlanObject, planRank } from '@/utils/dictionaries';


import themeStyle from '@/pages/style/theme.less';

const FormItem = Form.Item;
const Option = Select.Option;
let planObject = [[], []];

/* eslint react/no-multi-comp:0 */
@connect(({ system, Planmanagement, loading }) => ({
  system,
  Planmanagement,
  loading: loading.models.Planmanagement,
}))
@Form.create()
class UpdateModal extends PureComponent {

  // eslint-disable-next-line react/sort-comp
  constructor(props) {
    super(props);
    planObject = getPlanObject();
  }

  state = { departmentUserList: [], charger: '', categoryName: '' };

  componentDidMount() {
    const { detail } = this.props;
    this.getDepartmentUser(detail.planObject);

    this.setState({ charger: detail.charger, categoryName: detail.categoryName });
  }


  getDepartmentUser = menuType => {
    const { dispatch } = this.props;
    dispatch({
      type: 'system/departmentUser',
      payload: { menuType },
      callback: data => {
        this.setState({ departmentUserList: data });
      },
    });
  };


  save = () => {
    const { form, detail } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { dispatch, handleModalVisible, modalSuccess } = this.props;

      const values = { ...fieldsValue };
      const { categoryName, charger } = this.state;
      values.charger = charger;
      values.categoryName = categoryName;

      for (let i in values) {
        detail[i] = values[i];
      }

      dispatch({
        type: 'Planmanagement/update',
        payload: detail,
        callback: () => {
          form.resetFields();
          message.success('编辑成功');
          handleModalVisible();
          modalSuccess();
        },
      });
    });
  };

  chargerChange = (value, option) => {
    this.setState({ charger: option.props.children });
  };

  categoryChange = (value, option) => {
    this.setState({ categoryName: option.props.children });
  };

  planObjectChange = value => {
    this.getDepartmentUser(value);
    const { form } = this.props;
    form.setFieldsValue({
      chargerId: '',
    });
    this.setState({ charger: '' });
  };


  render() {
    const { form, modalVisible, handleModalVisible, loading, cateList, detail } = this.props;
    const { departmentUserList } = this.state;
    return (
      <Modal
        destroyOnClose
        title="编辑预案"
        visible={modalVisible}
        className={themeStyle.formModal}
        width={800}
        onCancel={() => handleModalVisible()}
        footer={[
          <Button key="back" onClick={() => handleModalVisible()}>
            取消
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={() => this.save()}>
            确定
          </Button>,
        ]}
      >
        <div className={themeStyle.formModalBody}>
          <Row gutter={40}>
            <Col md={12} sm={24}>
              <FormItem label="预案名称">
                {form.getFieldDecorator('planName', {
                  initialValue: detail.planName,
                  rules: [{ required: true, message: '请输入预案名称！' }],
                })(<Input placeholder="请输入"/>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem label="预案编号">
                {form.getFieldDecorator('planCode', {
                  initialValue: detail.planCode,
                  rules: [{ required: true, message: '请输入预案编号！' }],
                })(<Input placeholder="请输入"/>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem label="预案类型">
                {form.getFieldDecorator('categoryId', {
                  initialValue: detail.categoryId,
                  rules: [{ required: true, message: '请选择预案类型！' }],
                })(
                  <Select placeholder='请选择' style={{ width: '100%' }} onChange={this.categoryChange}>
                    {
                      cateList.list.map((item, index) => <Option key={index}
                                                                 value={item.id_}>{item.categoryName}</Option>)
                    }
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem label="对象">
                {form.getFieldDecorator('planObject', {
                  initialValue: parseInt(detail.planObject),
                  rules: [{ required: true, message: '请输入预案名称！' }],
                })(
                  <Select style={{ width: '100%' }} placeholder='请选择' onChange={this.planObjectChange}>
                    {
                      planObject[1].map((item, index) => <Option key={index}
                                                                 value={planObject[0][index]}>{item}</Option>)
                    }
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem label="处置人员">
                {form.getFieldDecorator('chargerId', {
                  initialValue: detail.chargerId,
                  rules: [{ required: true, message: '请选择处置人员！' }],
                })(
                  <Select placeholder='请选择' style={{ width: '100%' }} onChange={this.chargerChange}>
                    {departmentUserList.map((item, index) =>
                      <Option
                        key={index}
                        value={item.id}
                      >{item.fullname}</Option>)}
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem label="处理方式">
                {form.getFieldDecorator('dealType', {
                  initialValue: detail.dealType,
                  rules: [{ required: true, message: '请输入处理方式！' }],
                })(<Input.TextArea placeholder="请输入"/>)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem label="等级">
                {form.getFieldDecorator('planRank', {
                  initialValue: detail.planRank,
                  rules: [{ required: true, message: '请选择等级！' }],
                })(
                  <Select placeholder='请选择' style={{ width: '100%' }}>
                    {
                      planRank.map((item, index) => <Option key={index} value={index + 1}>{item}</Option>)
                    }
                  </Select>,
                )}
              </FormItem>
            </Col>
          </Row>
        </div>
      </Modal>
    );
  }
}

export default UpdateModal;


