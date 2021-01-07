import React, { PureComponent } from 'react';
import {
  Modal,
  Form,
  Row,
  Col,
  Select,
  Input,
  InputNumber,
  TreeSelect,
  Button,
  Spin,
  message,
  Radio,
} from 'antd';

import { roadType } from '@/utils/dictionaries';
import themeStyle from '@/pages/style/theme.less';
import { checkPhone } from '@/utils/utils';
import { connect } from 'dva';

import Map from './map';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ system, RoadInfo, loading }) => ({
  system,
  RoadInfo,
  loading: loading.models.RoadInfo,
}))
@Form.create()
class UpdateModal extends PureComponent {
  constructor(props) {
    super(props);

    this.paths = [];
    // this.roadMileage = 0;
    this.organName = '';
  }

  state = {
    roadMileage: 0,
    detail: {},
    startAddr: '',
    endAddr: '',
    startlongla: '',
    endlongla: '',
  };

  componentDidMount() {
    const { dispatch, id } = this.props;
    dispatch({
      type: 'RoadInfo/detail',
      payload: id,
      callback: detail => {
        const { longitudeandlatitude, roadMileage, startAddr, endAddr } = detail;
        this.paths = JSON.parse(longitudeandlatitude || '[]');
        this.organName = detail.organName;
        this.setState({ detail, roadMileage, startAddr, endAddr });
      },
    });
  }

  componentWillUnmount() {
    this.setState({ roadMileage: 0, startAddr: '', endAddr: '', startlongla: '', endlongla: '' });
  }

  /**
   *
   * @param path
   */
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

  save = () => {
    const { form, dispatch, handleModalVisible, modalSuccess } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (!this.paths.length) {
        message.error('请选择道路');
        return;
      }
      const { detail, startAddr, endAddr, startlongla, endlongla } = this.state;
      const newDetail = JSON.parse(JSON.stringify(detail));
      const value = { ...fieldsValue, startAddr, endAddr, startlongla, endlongla };
      value.organCode = typeof value.organCode === 'object' ? value.organCode[0] : value.organCode;
      value.organName = this.organName;
      // value.roadMileage = roadMileage;
      value.longitudeandlatitude = JSON.stringify(this.paths);
      // value.endlongla = [
      //   this.paths[this.paths.length - 1].lng,
      //   this.paths[this.paths.length - 1].lat,
      // ].join();
      // value.startlongla = [this.paths[0].lng, this.paths[0].lat].join();
      for (let i in value) {
        newDetail[i] = value[i];
      }
      this.setState({ detail: newDetail });
      dispatch({
        type: 'RoadInfo/update',
        payload: newDetail,
        callback: () => {
          form.resetFields();
          handleModalVisible();
          modalSuccess();
          message.success('编辑成功');
        },
      });
    });
  };

  treeChange = (value, label) => {
    this.organName = label.length ? label[0] : '';
  };

  render() {
    const {
      system: { treeList },
      modalVisible,
      handleModalVisible,
      form,
      loading,
    } = this.props;
    const { detail } = this.state;

    return (
      <Modal
        destroyOnClose
        title="修改公路信息"
        className={themeStyle.formModal}
        visible={modalVisible}
        width={800}
        onCancel={() => handleModalVisible()}
        footer={[
          <Button key="back" onClick={() => handleModalVisible()}>
            取消
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={this.save}>
            确定
          </Button>,
        ]}
      >
        <Spin spinning={loading}>
          <div className={themeStyle.formModalBody}>
            <Row gutter={40}>
              <Col md={12} sm={24}>
                <FormItem label="公路类型">
                  {form.getFieldDecorator('roadType', {
                    initialValue: detail.roadType,
                    rules: [{ required: true, message: '请选择公路类型！' }],
                  })(
                    <Select style={{ width: '100%' }} placeholder="请选择">
                      {roadType.map((item, index) => (
                        <Option value={index + 1} key={`${index}_road_type`}>
                          {item}
                        </Option>
                      ))}
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col md={12} sm={24}>
                <FormItem label="公路编号">
                  {form.getFieldDecorator('roadCode', {
                    initialValue: detail.roadCode,
                    rules: [{ required: true, message: '请输入公路编号！' }],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={12} sm={24}>
                <FormItem label="公路名称">
                  {form.getFieldDecorator('roadName', {
                    initialValue: detail.roadName,
                    rules: [{ required: true, message: '请输入公路名称！' }],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={12} sm={24}>
                <FormItem label="行政区域">
                  {form.getFieldDecorator('organCode', {
                    initialValue: [detail.organCode],
                    rules: [{ required: true, message: '请选择行政区域！' }],
                  })(
                    <TreeSelect
                      treeData={treeList}
                      style={{ width: '100%' }}
                      placeholder="请选择"
                      onChange={this.treeChange}
                    />,
                  )}
                </FormItem>
              </Col>
              <Col md={12} sm={24}>
                <FormItem label="路长">
                  {form.getFieldDecorator('roadElder', {
                    initialValue: detail.roadElder,
                    rules: [{ required: true, message: '请输入路长！' }],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={12} sm={24}>
                <FormItem label="职务">
                  {form.getFieldDecorator('jobTitle', {
                    initialValue: detail.jobTitle,
                    rules: [{ required: true, message: '请输入职务！' }],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              {/* <Col md={12} sm={24}>
                <FormItem label="起始地">
                  {form.getFieldDecorator('startAddr', {
                    initialValue: detail.startAddr,
                    rules: [{ required: true, message: '请输入起始地！' }],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={12} sm={24}>
                <FormItem label="结束地">
                  {form.getFieldDecorator('endAddr', {
                    initialValue: detail.endAddr,
                    rules: [{ required: true, message: '请选择结束地！' }],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col> */}
            </Row>

            {/* <div style={{ height: 350 }}> */}
            {JSON.stringify(detail) === '{}' ? null : (
              <Map
                // getLngLat={this.getLngLat}
                getMapData={this.getMapData}
                startAddr={detail.startAddr}
                endAddr={detail.endAddr}
                line={JSON.parse(detail.longitudeandlatitude || '[]')}
              />
            )}
            {/* </div> */}

            <Row gutter={40}>
              <Col md={12} sm={24}>
                <FormItem label="里程（km）">
                  {form.getFieldDecorator('roadMileage', {
                    initialValue: this.state.roadMileage
                      ? this.state.roadMileage
                      : detail.roadMileage,
                    rules: [{ required: true, message: '请输入里程！' }],
                  })(<InputNumber readOnly style={{ width: '100%' }} placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={12} sm={24}>
                <FormItem label="是否重点路段">
                  {form.getFieldDecorator('focus', {
                    initialValue: detail.focus,
                    rules: [{ required: true, message: '请选择！' }],
                  })(
                    <Radio.Group>
                      <Radio value={1}>是</Radio>
                      <Radio value={0}>否</Radio>
                    </Radio.Group>,
                  )}
                </FormItem>
              </Col>
              <Col md={12} sm={24}>
                <FormItem label="负责人">
                  {form.getFieldDecorator('leadingCadre', {
                    initialValue: detail.leadingCadre,
                    rules: [{ required: true, message: '请输入负责人！' }],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={12} sm={24}>
                <FormItem label="联系方式">
                  {form.getFieldDecorator('leadingTel', {
                    initialValue: detail.leadingTel,
                    rules: [
                      {
                        required: true,
                        validator: checkPhone,
                      },
                    ],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
            </Row>
          </div>
        </Spin>
      </Modal>
    );
  }
}

export default UpdateModal;
