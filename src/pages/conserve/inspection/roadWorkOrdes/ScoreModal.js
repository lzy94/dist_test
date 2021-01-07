import React, { PureComponent } from 'react';
import { Input, Modal, Form, Button, Upload, message, Icon, InputNumber } from 'antd';
import { connect } from 'dva';
import themeStyle from '@/pages/style/theme.less';
import { getLocalStorage } from '@/utils/utils';

const FormItem = Form.Item;

@connect(({ RoadWorkOrdes, loading }) => ({
  RoadWorkOrdes,
  loading: loading.models.RoadWorkOrdes,
}))
@Form.create()
class ScoreModal extends PureComponent {
  state = {
    fileList: [],
  };

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
    const { form, dispatch, handleModalVisible, modalSuccess, detail } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
      };
      values.evidence = values.evidence ? values.evidence.file.response.filePath : '';
      values.companyId = detail.id;
      values.companyName = detail.companyName;
      dispatch({
        type: 'RoadWorkOrdes/addExamineInfoData',
        payload: values,
        callback: () => {
          message.success('评分成功成功');
          handleModalVisible();
          modalSuccess();
        },
      });
    });
  };

  render() {
    const { modalVisible, handleModalVisible, form, loading } = this.props;
    const { fileList } = this.state;

    return (
      <Modal
        destroyOnClose
        title="评分"
        className={themeStyle.formModal}
        visible={modalVisible}
        onCancel={() => handleModalVisible()}
        footer={[
          // <Button key="back" onClick={() => handleModalVisible()}>
          //   取消
          // </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={() => this.save()}>
            确定
          </Button>,
        ]}
      >
        <div className={themeStyle.formModalBody}>
          {/*<FormItem label="企业名称">*/}
          {/*  {form.getFieldDecorator('companyName', {*/}
          {/*    rules: [{ required: true, message: '请输入企业名称！' }],*/}
          {/*  })(<Input readOnly placeholder="请输入"/>)}*/}
          {/*</FormItem>*/}
          <FormItem label="扣分">
            {form.getFieldDecorator('delScore', {
              rules: [{ required: true, message: '请输入扣分分数' }],
            })(<InputNumber style={{ width: '100%' }} placeholder="请输入" />)}
          </FormItem>
          <FormItem label="罚款">
            {form.getFieldDecorator('fine', {
              rules: [{ required: true, message: '请输入罚款数' }],
            })(<InputNumber style={{ width: '100%' }} placeholder="请输入" />)}
          </FormItem>
          <FormItem label="取证照片">
            {form.getFieldDecorator('evidence', {
              rules: [{ required: true, message: '请上传取证照片！' }],
            })(
              <Upload {...this.uploadConfig()} defaultFileList={fileList}>
                {fileList.length > 0 ? null : (
                  <Button>
                    <Icon type="upload" /> 请上传取证照片
                  </Button>
                )}
              </Upload>,
            )}
          </FormItem>
          <FormItem label="原因">
            {form.getFieldDecorator('reson', {
              rules: [{ required: true, reson: '请输入原因' }],
            })(<Input.TextArea rows={4} placeholder="请输入" />)}
          </FormItem>
        </div>
      </Modal>
    );
  }
}

export default ScoreModal;
