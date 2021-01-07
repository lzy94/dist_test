import React, { Fragment, PureComponent } from "react";
import { Button, message, Modal } from "antd";
import { connect } from "dva";
import Detail from "../../public";
import TemplateModal from "../../public/printModal";
import themeStyle from "@/pages/style/theme.less";
import publicCss from "@/pages/style/public.less";


@connect(({ Mobile, loading }) => ({
  Mobile,
  loading: loading.models.Mobile,
}))
class IndexDetail extends PureComponent {

  static defaultProps = {
    handleModalVisible: () => {
    }
  };

  state = {
    detail: {},
    templateVisible: false
  };

  componentDidMount() {
    this.getDetail();
  }

  componentWillUnmount() {
    this.setState({ detail: {} })
  };

  getDetail = () => {
    const { dispatch, detailID } = this.props;
    dispatch({
      type: 'Mobile/detail',
      payload: { id: detailID },
      callback: res => {
        this.setState({ detail: res });
      }
    });
  };

  title = () => {
    return <div className={themeStyle.modalHeader}>
      <div className={themeStyle.title}>
        <span className={themeStyle.value}>详情</span>
      </div>
      <div className={themeStyle.titleRight}>
        <Button type='primary' style={{ marginRight: 8 }}
          onClick={() => this.verifyPassClick()}>签批通过</Button>
        <Button className={publicCss.import}
          onClick={() => this.handleTemplateVisible(true)}>打印预览</Button>
      </div>
    </div>
  };

  verifyPassClick = () => {
    const { dispatch, detailID, handleModalVisible, modalSuccess } = this.props;
    dispatch({
      type: 'Mobile/examinationPassed',
      payload: { id: detailID, type: 3 },
      callback: () => {
        handleModalVisible();
        message.success('操作成功');
        setTimeout(() => modalSuccess(), 300);
      }
    })
  };

  handleTemplateVisible = flag => {
    this.setState({
      templateVisible: !!flag
    })
  };

  render() {
    const { modalVisible, handleModalVisible, detailID } = this.props;
    const { detail, templateVisible } = this.state;

    const tempalteMethods = {
      handleModalVisible: this.handleTemplateVisible,
      detailID: detailID,
      organCode: detail.organCode
    };


    return <Fragment>
      <Modal
        destroyOnClose
        title={this.title()}
        className={themeStyle.modalStyle}
        visible={modalVisible}
        onCancel={() => handleModalVisible()}
        width={800}
        footer={null}
      >
        <Detail detail={detail} />
      </Modal>
      {templateVisible ? <TemplateModal {...tempalteMethods} modalVisible={templateVisible} /> : null}
    </Fragment>
  }
}

export default IndexDetail;
