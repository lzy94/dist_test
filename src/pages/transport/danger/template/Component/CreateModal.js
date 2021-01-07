import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Button, Form, Input, Row, Col, Select, message, Table, Tooltip } from 'antd';

import themeStyle from '@/pages/style/theme.less';

const FormItem = Form.Item;
const { Option } = Select;
const controlMap = ['文本域', '上传控件'];

/* eslint react/no-multi-comp:0 */
@connect(({ TransportDangerCategory, TransportDangerTemplate, loading }) => ({
  TransportDangerCategory,
  TransportDangerTemplate,
  loading: loading.models.TransportDangerTemplate,
}))
@Form.create()
class CreateModal extends PureComponent {
  static defaultProps = {
    modalVisible: false,
    handleModalVisible: () => {},
  };

  state = {
    content: [],
  };

  columns = [
    {
      title: '内容',
      dataIndex: 'content',
      width: 400,
      render: val =>
        val.length > 20 ? <Tooltip title={val}>{val.substring(0, 20)}...</Tooltip> : val,
    },
    {
      title: '填写方式',
      dataIndex: 'control',
      render: val => controlMap[val - 1],
    },
    {
      title: '操作',
      width: 60,
      render: val => (
        <Button
          type="danger"
          shape="circle"
          icon="delete"
          size="small"
          onClick={() => this.delData(val.order)}
        />
      ),
    },
  ];

  delData = order => {
    const { content } = this.state;
    const newContent = JSON.parse(JSON.stringify(content));
    newContent.splice(parseInt(order, 10) - 1, 1);
    const list = newContent.map((item, i) => {
      return {
        ...item,
        order: i + 1,
      };
    });
    this.setState({ content: list });
  };

  addData = () => {
    const { form } = this.props;
    const value = form.getFieldsValue(['desc', 'formType']);
    if (!value.desc) return message.error('请输入内容！');
    if (!value.formType) return message.error('请选择输入格式！');
    const { content } = this.state;
    const newContent = JSON.parse(JSON.stringify(content));
    const order = newContent.length + 1;
    newContent.push({
      order,
      content: value.desc,
      control: value.formType,
    });
    this.setState({ content: newContent });
    return null;
  };

  save = () => {
    const { dispatch, form, modalCallback, handleModalVisible } = this.props;
    const { content } = this.state;
    if (!content.length) return message.error('请添加输入格式可内容！');

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        content: JSON.stringify(content),
      };
      delete values.desc;
      delete values.formType;
      dispatch({
        type: 'TransportDangerTemplate/UAData',
        payload: values,
        callback: () => {
          message.success('添加成功');
          handleModalVisible();
          setTimeout(() => modalCallback(), 300);
        },
      });
    });
    return null;
  };

  render() {
    const {
      form,
      modalVisible,
      handleModalVisible,
      loading,
      TransportDangerCategory: { data },
    } = this.props;
    const { content } = this.state;
    return (
      <Modal
        destroyOnClose
        title="添加模板"
        className={themeStyle.formModal}
        visible={modalVisible}
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
              <FormItem label="模板名称">
                {form.getFieldDecorator('name', {
                  rules: [{ required: true, message: '请输入模板名称！' }],
                })(<Input placeholder="请输入" />)}
              </FormItem>
              <FormItem label="内容">
                {form.getFieldDecorator('desc', {})(<Input.TextArea />)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem label="模板分类">
                {form.getFieldDecorator('categoryName', {
                  rules: [{ required: true, message: '请选择模板分类！' }],
                })(
                  <Select style={{ width: '100%' }} placeholder="请选择">
                    {data.list.map(item => (
                      <Option key={item.id} value={item.name}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>,
                )}
              </FormItem>
              <FormItem label="输入格式">
                <Row gutter={8}>
                  <Col md={17}>
                    {form.getFieldDecorator('formType', {})(
                      <Select style={{ width: '100%' }} placeholder="请选择">
                        {controlMap.map((item, i) => (
                          <Option value={i + 1} key={i}>
                            {item}
                          </Option>
                        ))}
                      </Select>,
                    )}
                  </Col>
                  <Col md={7}>
                    <Button type="primary" icon="plus" onClick={this.addData}>
                      添加
                    </Button>
                  </Col>
                </Row>
              </FormItem>
            </Col>
          </Row>
          <div style={{ marginBottom: 10, background: '#fff' }}>
            <Table
              size="small"
              pagination={false}
              columns={this.columns}
              rowKey="order"
              dataSource={content}
            />
          </div>
        </div>
      </Modal>
    );
  }
}

export default CreateModal;
