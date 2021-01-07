import React, {PureComponent} from "react";
import {Button, message, Modal} from "antd";
import {connect} from "dva";
import Detail from "../../public";
import themeStyle from "@/pages/style/theme.less";


@connect(({Mobile, loading}) => ({
  Mobile,
  loading: loading.models.Mobile,
}))
class IndexDetail extends PureComponent {

  static defaultProps = {
    handleModalVisible: () => {
    }
  };

  state = {
    detail: {}
  };

  componentDidMount() {
    this.getDetail();
  }

  componentWillUnmount() {
    this.setState({detail: {}})
  };

  getDetail = () => {
    const {dispatch, detailID} = this.props;
    dispatch({
      type: 'Mobile/detail',
      payload: {id: detailID},
      callback: res => {
        this.setState({detail: res});
      }
    });
  };

  title = () => {
    return <div className={themeStyle.modalHeader}>
      <div className={themeStyle.title}>
        <span className={themeStyle.value}>详情</span>
      </div>
      <div className={themeStyle.titleRight}>
        <Button type='primary' style={{marginRight: 8}}
                onClick={() => this.verifyPassClick()}>审核通过</Button>
      </div>
    </div>
  };


  verifyPassClick = () => {
    const {dispatch, detailID, handleModalVisible, modalSuccess} = this.props;
    dispatch({
      type: 'Mobile/examinationPassed',
      payload: {id: detailID, type: 1},
      callback: () => {
        handleModalVisible();
        message.success('操作成功');
        setTimeout(() => modalSuccess(), 300);
      }
    })
  };


  render() {
    const {modalVisible, handleModalVisible, loading} = this.props;
    const {detail} = this.state;
    return <Modal
      destroyOnClose
      title={this.title()}
      className={themeStyle.modalStyle}
      visible={modalVisible}
      onCancel={() => handleModalVisible()}
      width={800}
      footer={null}
    >
      <Detail detail={detail}/>
    </Modal>;
  }
}

export default IndexDetail;
