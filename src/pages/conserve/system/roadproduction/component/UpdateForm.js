import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Col, Form, Input, Button, Modal, Row, Radio, message } from 'antd';
import LocationMap from '@/pages/conserve/Component/LocationMap';

import themeStyle from '@/pages/style/theme.less';

import Roadproductioncategory from './Roadproductioncategory';
import Roadinfo from './Roadinfo';

const FormItem = Form.Item;

@connect(({ RoadProduction, loading }) => ({
  RoadProduction,
  loading: loading.models.RoadProduction,
}))
@Form.create()
class UpdateForm extends PureComponent {
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
    address: '',
    lnglat: [],
    categoryName: '',
    categoryId: '',
    roadName: '',
    roadId: '',
    detail: {},
  };

  componentDidMount() {
    const { dispatch, detailID } = this.props;
    dispatch({
      type: 'RoadProduction/detail',
      payload: detailID,
      callback: detail => {
        this.setState({
          detail,
          categoryId: detail.categoryId,
          roadId: detail.roadId,
          lnglat: [detail.longitude, detail.latitude],
          address: detail.addr,
        });
      },
    });
  }

  parentAddress = (address, lnglat) => {
    this.setState({ address, lnglat });
  };

  getInputValue = address => {
    this.setState({ address });
  };

  handleUpdate = () => {
    const { lnglat, categoryId, roadId, detail, address } = this.state;
    const { form, dispatch, modalSuccess, handleModalVisible } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
      };
      const newDetail = {
        ...detail,
      };

      if (!address || !lnglat[0] || !lnglat[1]) {
        message.error('请获取位置');
        return;
      }

      values.categoryId = categoryId;
      values.roadId = roadId;
      values.longitude = lnglat[0];
      values.latitude = lnglat[1];
      values.addr = address;

      for (let i in values) {
        newDetail[i] = values[i];
      }

      dispatch({
        type: 'RoadProduction/saveData',
        payload: newDetail,
        callback: () => {
          form.resetFields();
          message.success('编辑成功');
          handleModalVisible();
          modalSuccess();
          this.setState({
            address: '',
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
    const { cateModalVisible, roadModalVisible, categoryName, roadName, detail } = this.state;

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
          title="编辑路产信息"
          className={themeStyle.formModal}
          visible={modalVisible}
          width={800}
          footer={[
            <Button key="back" onClick={this.cancelClick}>
              取消
            </Button>,
            <Button key="submit" type="primary" loading={loading} onClick={this.handleUpdate}>
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
                    initialValue: categoryName || detail.categoryName,
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
                    initialValue: roadName || detail.roadName,
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
                    initialValue: detail.productionName,
                    rules: [{ required: true, message: '请输入路产名称！' }],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={12} sm={24}>
                <FormItem label="路产编号">
                  {form.getFieldDecorator('productionCode', {
                    initialValue: detail.productionCode,
                    rules: [{ required: true, message: '请输入路产编号！' }],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={12} sm={24}>
                <FormItem label="路产状态">
                  {form.getFieldDecorator('state', {
                    initialValue: detail.state,
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
                {Object.keys(detail).length ? (
                  <LocationMap
                    lngLat={{
                      longitude: detail.longitude,
                      latitude: detail.latitude,
                    }}
                    address={detail.addr}
                    getInputValue={this.getInputValue}
                    parentAddress={this.parentAddress}
                  />
                ) : null}
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

export default UpdateForm;
