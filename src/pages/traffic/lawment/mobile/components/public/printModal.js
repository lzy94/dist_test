import React, { PureComponent } from 'react';
import { Checkbox, Form, Modal, Spin, Empty } from "antd";
import { connect } from "dva";
import themeStyle from "@/pages/style/theme.less";

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;


@connect(({ DynamicLaw, loading, Mobile }) => ({
  DynamicLaw,
  Mobile,
  dynamicLawLoading: loading.models.DynamicLaw,
  loading: loading.models.Mobile,
}))
@Form.create()
class PrintModal extends PureComponent {
  static defaultProps = {
    handleModalVisible: () => {
    },
  };

  state = {
    printFileList: [],
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
          "page": 1,
          "pageSize": 100000,
          "showTotal": true
        },
        querys: [{
          property: 'organCode',
          value: organCode || 51,
          group: "main",
          operation: "EQUAL",
          relation: "AND"
        }]
      },
      callback: res => {
        this.setState({ printFileList: res })
      }
    });
  };

  renderOption = () => {
    const { printFileList } = this.state;
    return printFileList.map(item => <div key={item.fileId}>
      <Checkbox value={item.fileId}>{item.fileName}</Checkbox>
    </div>)
  };

  templatePrint = fields => {
    const { handleModalVisible, dispatch, detailID } = this.props;
    dispatch({
      type: 'Mobile/download',
      payload: {
        id: detailID,
        fileIds: fields.template.join(),
      },
      callback: () => {
        setTimeout(() => handleModalVisible(), 1500);
      },
    });
  };

  render() {
    const { modalVisible, handleModalVisible, form, loading, dynamicLawLoading } = this.props;
    const { printFileList } = this.state;

    const okHandle = () => {
      form.validateFields((errors, values) => {
        if (errors) return;
        this.templatePrint(values)
      })
    };

    const footer = printFileList.length <= 0 ? { footer: null } : {};

    return <Modal
      destroyOnClose
      title="打印预览选择"
      className={themeStyle.formModal}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      {...footer}
    >
      <Spin spinning={loading} tip="正在下载······">
        <Spin spinning={dynamicLawLoading}>
          <div className={themeStyle.formModalBody}>
            {printFileList.length <= 0 ? <Empty description="暂无模板，请先上传" /> : <FormItem label="模板名称">
              {form.getFieldDecorator('template', {
                initialValue: printFileList.map(item => item.fileId),
              })(<CheckboxGroup>{this.renderOption()}</CheckboxGroup>)}
            </FormItem>}
          </div>
        </Spin>
      </Spin>
    </Modal>
  }
}

export default PrintModal;
