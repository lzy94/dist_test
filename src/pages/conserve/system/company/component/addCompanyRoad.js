import React, { PureComponent } from 'react';
import { Button, Col, Input, Modal, Row, Form, message } from 'antd';
import themeStyle from '@/pages/style/theme.less';
import { connect } from 'dva';
import Map from '@/pages/conserve/system/roadinfo/component/map';

const FormItem = Form.Item;

/* eslint react/no-multi-comp:0 */
@connect(({ ConserveCompany, loading }) => ({
  ConserveCompany,
  loading: loading.models.ConserveCompany,
}))
@Form.create()
class AddCompanyRoadModal extends PureComponent {
  constructor(props) {
    super(props);
    this.paths = [];
  }

  state = {
    detail: {},
    roadMileage: 0,
    startAddr: '',
    endAddr: '',
    startlongla: '',
    endlongla: '',
  };

  componentDidMount() {
    this.getDetail();
  }

  componentWillUnmount() {
    this.setState({ roadMileage: 0, startAddr: '', endAddr: '', startlongla: '', endlongla: '' });
  }

  // getLngLat = (path, roadMileage, startAddr, endAddr) => {
  //   this.paths = path;
  //   // this.roadMileage = roadMileage;
  //   this.setState({ roadMileage: roadMileage / 1000, startAddr, endAddr });
  // };

  getMapData = data => {
    const { line, distance, startAddr, endAddr, sn_lnglat } = data;
    this.paths = line;
    this.setState({
      roadMileage: distance / 1000,
      startAddr,
      endAddr,
      startlongla: sn_lnglat[0].join(),
      endlongla: sn_lnglat[1].join(),
    });
  };

  getDetail = () => {
    const { dispatch, roadID } = this.props;
    dispatch({
      type: 'RoadInfo/detail',
      payload: roadID,
      callback: detail => {
        this.setState({ detail });
        // this.paths = JSON.parse(detail.longitudeandlatitude);
        // this.organName = detail.organName;
        // this.setState({ detail, roadMileage: detail.roadMileage });
      },
    });
  };

  save = () => {
    const {
      form,
      dispatch,
      handleModalVisible,
      modalSuccess,
      companyID,
      roadID,
      roadName,
    } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (!this.paths.length) return message.error('请选择道路');
      const { roadMileage, startAddr, endAddr, startlongla, endlongla } = this.state;
      const values = {
        ...fieldsValue,
        startAddr,
        endAddr,
        startlongla,
        endlongla,
      };
      values.companyId = companyID;
      values.longitudeandlatitude = JSON.stringify(this.paths);
      // values.endlongla = [
      //   this.paths[this.paths.length - 1].lng,
      //   this.paths[this.paths.length - 1].lat,
      // ].join();
      values.startlongla = [this.paths[0].lng, this.paths[0].lat].join();
      values.roadMileage = roadMileage;
      values.roadId = roadID;
      values.roadName = roadName;
      dispatch({
        type: 'ConserveCompany/addCompanyRoadConserveData',
        payload: values,
        callback: () => {
          handleModalVisible();
          modalSuccess();
          message.success('添加成功');
        },
      });
    });
  };

  render() {
    const { modalVisible, handleModalVisible, form, loading } = this.props;
    const { detail } = this.state;
    return (
      <Modal
        destroyOnClose
        title="添加路段信息"
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
            {/*  <Col md={12} sm={24}>
              <FormItem label="起始点">
                {form.getFieldDecorator('startAddr', {
                  rules: [{ required: true, message: '请输入起始点！' }],
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem label="结束点">
                {form.getFieldDecorator('endAddr', {
                  rules: [{ required: true, message: '请输入结束点！' }],
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col> */}
            <Col md={24} sm={24}>
              {JSON.stringify(detail) === '{}' ? null : (
                <Map getMapData={this.getMapData} line={JSON.parse(detail.longitudeandlatitude)} />
              )}
            </Col>
            <Col md={24} sm={24}>
              <FormItem label="维护内容">
                {form.getFieldDecorator('content', {
                  rules: [{ required: true, message: '请输入维护内容！' }],
                })(<Input.TextArea rows={4} placeholder="请输入" />)}
              </FormItem>
            </Col>
          </Row>
        </div>
      </Modal>
    );
  }
}

export default AddCompanyRoadModal;
