import React, { PureComponent } from 'react';
import { Checkbox, Form, Modal, Spin, Empty, message } from 'antd';
import { connect } from 'dva';

import themeStyle from '@/pages/style/theme.less';

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

@connect(({ DynamicLaw, loading }) => ({
  DynamicLaw,
  loading: loading.models.DynamicLaw,
}))
@Form.create()
class PrintModal extends PureComponent {
  static defaultProps = {
    onlineUrl: '',
    handleModalVisible: () => {},
  };

  state = {
    printFileList: [],
    downLoaing: false,
  };

  componentDidMount() {
    this.getList();
  }

  getList = () => {
    const { dispatch, organCode } = this.props;
    dispatch({
      type: 'DynamicLaw/fileList',
      payload: {
        pageBean: {
          page: 1,
          pageSize: 100000,
          showTotal: true,
        },
        querys: [
          {
            property: 'organCode',
            value: organCode || 51,
            group: 'main',
            operation: 'EQUAL',
            relation: 'AND',
          },
        ],
      },
      callback: res => {
        this.setState({ printFileList: res });
      },
    });
  };

  renderOption = () => {
    const { printFileList } = this.state;

    return printFileList.map(item => (
      <div key={item.fileId}>
        <Checkbox value={item.fileId}>{item.fileName}</Checkbox>
      </div>
    ));
  };

  // previcew = () => {
  //   const { dispatch, onlineUrl } = this.props;
  //   dispatch({
  //     type: 'File/preview',
  //     payload: {
  //       fileId: onlineUrl,
  //     },
  //     callback: res => {
  //       if (!res) return;
  //       const paths = res.pdfUrl.split('/');
  //       const len = paths.length;
  //       const path = paths[len - 1];
  //       dispatch({
  //         type: 'File/preview_',
  //         payload: path,
  //         callback: res2 => {
  //           if (res2.code !== 200) {
  //             return message.error('模板读取失败！');
  //           }
  //           window.open(res2.data, '_blank');
  //         },
  //       });
  //     },
  //   });
  // };

  templatePrint = fields => {
    this.setState({ downLoaing: true });
    const { handleModalVisible, dispatch, previewCode, carNo } = this.props;
    dispatch({
      type: 'DynamicLaw/filePrint',
      payload: {
        carNo,
        previewCode,
        fileIds: fields.template.join(),
      },
      callback: status => {
        if (status === 404) {
          message.error('模板异常，无法下载');
        } else {
          setTimeout(() => handleModalVisible(), 1500);
        }
        this.setState({ downLoaing: false });
      },
    });
  };

  render() {
    const { modalVisible, handleModalVisible, form } = this.props;
    const { printFileList, downLoaing } = this.state;

    const okHandle = () => {
      form.validateFields((errors, values) => {
        if (errors) return;
        this.templatePrint(values);
      });
    };

    const footer = printFileList.length <= 0 ? { footer: null } : {};

    return (
      <Modal
        destroyOnClose
        title="打印预览选择"
        className={themeStyle.formModal}
        visible={modalVisible}
        onOk={okHandle}
        onCancel={() => handleModalVisible()}
        {...footer}
      >
        <Spin spinning={downLoaing} tip="正在下载······">
          <div className={themeStyle.formModalBody}>
            {printFileList.length <= 0 ? (
              <Empty description="暂无模板，请先上传" />
            ) : (
              <FormItem label="模板名称">
                {form.getFieldDecorator('template', {
                  initialValue: printFileList.map(item => item.fileId),
                })(<CheckboxGroup>{this.renderOption()}</CheckboxGroup>)}
              </FormItem>
            )}
          </div>
        </Spin>
      </Modal>
    );
  }
}

export default PrintModal;
