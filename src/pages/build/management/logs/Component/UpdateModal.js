import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import {
  Modal,
  Select,
  Button,
  Form,
  Input,
  DatePicker,
  message,
  Upload,
  Icon,
  Row,
  Col,
} from 'antd';

import { getLocalStorage, imageBeforeUpload, imgUrl } from '@/utils/utils';
import { logsCate, logsCateChild, logsDutyUnit, logsRectifySituation } from '@/utils/constant';

import themeStyle from '@/pages/style/theme.less';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ BuildManagementlogs, loading }) => ({
  BuildManagementlogs,
  loading: loading.models.BuildManagementlogs,
}))
@Form.create()
class CreateModal extends PureComponent {
  static defaultProps = {
    modalVisible: false,
    handleModalVisible: () => {},
    modalCallback: () => {},
  };

  state = { fileList: [], detail: {}, isSet: false, cateIndex: 0 };

  static getDerivedStateFromProps(props, state) {
    const { detail } = props;
    const { isSet } = state;
    if (!isSet) {
      return {
        isSet: !isSet,
        detail,
        cateIndex: logsCate.includes(detail.questionCategory)
          ? logsCate.indexOf(detail.questionCategory)
          : 0,
        fileList: detail.annexUrl
          ? detail.annexUrl.split(',').map((item, i) => ({
              uid: i,
              name: '当前图片',
              status: 'done',
              url: imgUrl + item,
              path: item,
            }))
          : [],
      };
    }
    return null;
  }

  uploadConfig = () => {
    return {
      name: 'files',
      action: '/result/api/file/v1/fileUpload',
      listType: 'picture',
      accept: '.jpg,.jpeg,.png',
      className: 'upload-list-inline',
      data: {
        type: 9,
      },
      headers: {
        Authorization: `Bearer ${getLocalStorage('token')[0]}`,
        'x-requested-with': 'XMLHttpRequest',
      },
      beforeUpload: imageBeforeUpload,
      onChange: this.uploadChange,
    };
  };

  uploadChange = info => {
    if (info.file.status === 'done') {
      if (info.file.response.code === 200) {
        message.success('上传成功');
        this.setState({ fileList: info.fileList });
      } else {
        message.error(info.file.response.code.msg);
      }
    } else if (info.file.status === 'error') {
      message.error('上传失败');
    } else if (info.file.status === 'removed') {
      this.setState({ fileList: info.fileList });
    }
  };

  save = () => {
    const { dispatch, form, modalCallback } = this.props;
    const { fileList, detail } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (!fileList.length) {
        message.error('请选择图片');
        return;
      }
      const values = {
        ...detail,
      };

      fieldsValue.annexUrl = fileList
        .map(item => {
          if (item.url) {
            return item.path;
          }
          return item.response.filePath;
        })
        .join();
      const keys = Object.keys(fieldsValue);
      for (let i = 0; i < keys.length; i += 1) {
        values[keys[i]] = fieldsValue[keys[i]];
      }

      this.setState({ detail: values });
      dispatch({
        type: 'BuildManagementlogs/add',
        payload: values,
        callback: () => {
          message.success('编辑成功');
          modalCallback();
          this.cancelClick();
        },
      });
    });
  };

  cancelClick = () => {
    const { handleModalVisible } = this.props;
    handleModalVisible();
  };

  cateChange = (_, e) => {
    const { index } = e.props;
    const { form } = this.props;
    this.setState({ cateIndex: index });
    form.setFieldsValue({ detailedType: undefined });
  };

  render() {
    const { loading, modalVisible, form } = this.props;
    const { fileList, detail, cateIndex } = this.state;
    return (
      <Modal
        destroyOnClose
        title="编辑管理日志"
        className={themeStyle.formModal}
        visible={modalVisible}
        onCancel={this.cancelClick}
        width={800}
        footer={[
          <Button key="back" onClick={this.cancelClick}>
            取消
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={this.save}>
            确定
          </Button>,
        ]}
      >
        <div className={themeStyle.formModalBody}>
          <Row gutter={20}>
            <Col span={12}>
              <FormItem label="项目名称">
                {form.getFieldDecorator('projectName', {
                  initialValue: detail.projectName,
                  rules: [{ required: true, message: '请输入项目名称！' }],
                })(<Input placeholder="请输入" />)}
              </FormItem>
              <FormItem label="巡查人">
                {form.getFieldDecorator('recorder', {
                  initialValue: detail.recorder,
                  rules: [{ required: true, message: '请输入巡查人！' }],
                })(<Input placeholder="请输入" />)}
              </FormItem>
              <FormItem label="巡查时间">
                {form.getFieldDecorator('recordTime', {
                  initialValue: moment(new Date(detail.recordTime), 'YYYY-MM-DD'),
                  rules: [{ required: true, message: '请选择巡查时间！' }],
                })(<DatePicker style={{ width: '100%' }} placeholder="请输入" />)}
              </FormItem>
              <FormItem label="问题描述">
                {form.getFieldDecorator('situationDescription', {
                  initialValue: detail.situationDescription,
                  rules: [{ required: true, message: '请输入问题描述！' }],
                })(<Input.TextArea placeholder="请输入" />)}
              </FormItem>
              <FormItem label="整改要求">
                {form.getFieldDecorator('relatedSuggestions', {
                  initialValue: detail.relatedSuggestions,
                  rules: [{ required: true, message: '请输入整改要求' }],
                })(<Input.TextArea placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="问题分类">
                {form.getFieldDecorator('questionCategory', {
                  initialValue: detail.questionCategory,
                  rules: [{ required: true, message: '请选择问题分类' }],
                })(
                  <Select style={{ width: '100%' }} placeholder="请选择" onChange={this.cateChange}>
                    {logsCate.map((item, i) => (
                      <Option value={item} key={item} index={i}>
                        {item}
                      </Option>
                    ))}
                  </Select>,
                )}
              </FormItem>
              <FormItem label="具体类型">
                {form.getFieldDecorator('detailedType', {
                  initialValue: detail.detailedType,
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
                  initialValue: detail.dutyUnit,
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
                {form.getFieldDecorator('rectifySituation', {
                  initialValue: detail.rectifySituation,
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
                {form.getFieldDecorator('annexUrl', {
                  initialValue: detail.annexUrl,
                  rules: [{ required: true, message: '请上传图片' }],
                })(
                  <Upload {...this.uploadConfig()} defaultFileList={fileList}>
                    {/* {fileList.length > 0 ? null : ( */}
                    <Button>
                      <Icon type="upload" /> 请上传图片(jpg,jpeg,png)
                    </Button>
                    {/* )} */}
                  </Upload>,
                )}
              </FormItem>
            </Col>
          </Row>
        </div>
      </Modal>
    );
  }
}

export default CreateModal;
