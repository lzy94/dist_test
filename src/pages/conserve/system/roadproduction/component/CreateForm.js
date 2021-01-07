import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Col, Form, Input, Button, Modal, Row, Radio, message } from 'antd';
import themeStyle from '@/pages/style/theme.less';
import LocationMap from '@/pages/conserve/Component/LocationMap';

import Roadproductioncategory from './Roadproductioncategory';
import Roadinfo from './Roadinfo';

const FormItem = Form.Item;

@connect(({ RoadProduction, loading }) => ({
  RoadProduction,
  loading: loading.models.RoadProduction,
}))
@Form.create()
class CreateForm extends PureComponent {
  static defaultProps = {
    modalVisible: false,
    handleModalVisible: () => {},
  };

  constructor(props) {
    super(props);
    this.timer = null;
  }

  state = {
    cateModalVisible: false,
    roadModalVisible: false,
    value: '',
    lnglat: [],
    categoryName: '',
    categoryId: '',
    roadName: '',
    roadId: '',
  };

  componentDidMount() {}

  parentAddress = (value, lngLat) => {
    this.setState({ value, lnglat: lngLat });
  };

  getInputValue = value => {
    this.setState({ value });
  };

  handleAdd = () => {
    const { lnglat, categoryId, roadId, value } = this.state;
    const { form, dispatch, modalSuccess, handleModalVisible } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
      };
      if (!value || !lnglat[0] || !lnglat[1]) {
        message.error('请获取位置');
        return;
      }
      values.categoryId = categoryId;
      values.roadId = roadId;
      values.longitude = lnglat[0];
      values.latitude = lnglat[1];
      values.addr = value;

      dispatch({
        type: 'RoadProduction/saveData',
        payload: values,
        callback: () => {
          form.resetFields();
          message.success('添加成功');
          handleModalVisible();
          modalSuccess();

          this.setState({
            value: '',
            lnglat: [],
            categoryName: '',
            categoryId: '',
            roadName: '',
            roadId: '',
          });
        },
      });
    });
  };

  cateHandleUpdateModalVisible = flag => {
    this.setState({
      cateModalVisible: !!flag,
    });
  };

  roadHandleUpdateModalVisible = flag => {
    this.setState({
      roadModalVisible: !!flag,
    });
  };

  selectDataCate = data => {
    this.setState({
      categoryId: data.id,
      categoryName: data.categoryName,
    });
  };

  selectDataRoad = data => {
    this.setState({
      roadName: data.roadName,
      roadId: data.id,
    });
  };

  cancelClick = () => {
    const { handleModalVisible } = this.props;
    handleModalVisible();
    this.setState({ categoryId: '', roadId: '', categoryName: '', roadName: '' });
  };

  render() {
    const { modalVisible, form, loading } = this.props;
    const { cateModalVisible, roadModalVisible, categoryName, roadName } = this.state;

    const CateMethods = {
      selectData: this.selectDataCate,
      handleModalVisible: this.cateHandleUpdateModalVisible,
    };

    const roadMethods = {
      selectData: this.selectDataRoad,
      handleModalVisible: this.roadHandleUpdateModalVisible,
    };

    return (
      <Fragment>
        <Modal
          destroyOnClose
          title="新建路产信息"
          className={themeStyle.formModal}
          visible={modalVisible}
          // onOk={this.handleAdd}
          width={800}
          footer={[
            <Button key="back" onClick={this.cancelClick}>
              取消
            </Button>,
            <Button key="submit" type="primary" loading={loading} onClick={this.handleAdd}>
              确定
            </Button>,
          ]}
          onCancel={this.cancelClick}
        >
          <div className={themeStyle.formModalBody}>
            <Row gutter={40}>
              <Col md={12} sm={24}>
                <FormItem label="分类">
                  {form.getFieldDecorator('categoryName', {
                    initialValue: categoryName,
                    rules: [{ required: true, message: '请选择分类！' }],
                  })(
                    <Input
                      readOnly
                      placeholder="请选择分类"
                      onClick={() => this.cateHandleUpdateModalVisible(true)}
                    />,
                  )}
                </FormItem>
              </Col>
              <Col md={12} sm={24}>
                <FormItem label="公路">
                  {form.getFieldDecorator('roadName', {
                    initialValue: roadName,
                    rules: [{ required: true, message: '请选择公路！' }],
                  })(
                    <Input
                      readOnly
                      placeholder="请输入"
                      onClick={() => this.roadHandleUpdateModalVisible(true)}
                    />,
                  )}
                </FormItem>
              </Col>
              <Col md={12} sm={24}>
                <FormItem label="路产名称">
                  {form.getFieldDecorator('productionName', {
                    rules: [{ required: true, message: '请输入路产名称！' }],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={12} sm={24}>
                <FormItem label="路产编号">
                  {form.getFieldDecorator('productionCode', {
                    rules: [{ required: true, message: '请输入路产编号！' }],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={12} sm={24}>
                <FormItem label="路产状态">
                  {form.getFieldDecorator('state', {
                    initialValue: 1,
                    rules: [{ required: true, message: '请选择路产状态！' }],
                  })(
                    <Radio.Group>
                      <Radio value={1}>正常</Radio>
                      <Radio value={2}>异常</Radio>
                    </Radio.Group>,
                  )}
                </FormItem>
              </Col>
              <Col md={24} sm={24}>
                <LocationMap
                  getInputValue={this.getInputValue}
                  parentAddress={this.parentAddress}
                />
              </Col>
            </Row>
          </div>
        </Modal>
        {cateModalVisible ? (
          <Roadproductioncategory modalVisible={cateModalVisible} {...CateMethods} />
        ) : null}
        {roadModalVisible ? <Roadinfo modalVisible={roadModalVisible} {...roadMethods} /> : null}
      </Fragment>
    );
  }
}

export default CreateForm;
