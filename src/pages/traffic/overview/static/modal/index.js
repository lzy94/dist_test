import React, { PureComponent, Fragment } from "react";
import { Form, Icon, Modal, Button, Tag } from "antd";
import { connect } from "dva";
import moment from "moment";
import themeStyle from "@/pages/style/theme.less";
import InvalidDataModal from '../../../lawment/static/components/modal/InvalidDataModal';
import MyStaticModalPublic from "@/components/MyStaticModalPublic/staticModal";


@connect(({ Static, loading }) => ({
  Static,
  loading: loading.models.Static,
}))
@Form.create()
class DetailModal extends PureComponent {
  static defaultProps = {
    handleModalVisible: () => {
    }
  };

  constructor(props) {
    super(props);
    this.myCarousel = React.createRef();
  }

  state = {
    openRecord: [],
    busStaticData: {},
    invalidVisible: false
  };

  componentDidMount() {
    this.getDetail();
  }

  getDetail = () => {
    const { dispatch, detailID } = this.props;
    dispatch({
      type: 'Static/detail',
      payload: {
        id: detailID,
      },
      callback: res => {
        this.setState({
          openRecord: res.openRecord,
          busStaticData: res.busStaticData
        })
      },
    });
  };

  handleInvalidVisible = flag => {
    this.setState({ invalidVisible: !!flag });
  };

  modalSuccess = () => {
    const { handleModalVisible } = this.props;
    setTimeout(() => {
      handleModalVisible();
      this.props.modalSuccess();
    }, 300)
  };

  title = () => {
    const { busStaticData } = this.state;
    return (
      <div className={themeStyle.modalHeader}>
        <div className={themeStyle.title}>
          <span className={themeStyle.value}>{busStaticData.carNo}</span>
          <span className={themeStyle.time}>{moment(busStaticData.previewTime).format("YYYY-M-D HH:mm:ss")}</span>
        </div>
        <div className={themeStyle.titleRight}>
          <div className={themeStyle.local}>
            <Icon type="environment" />
            <a title={busStaticData.siteName}>
              {busStaticData.siteName}
            </a>
          </div>
          {busStaticData.reson ? <Tag style={{ padding: '5px 10px', marginLeft: 10 }} color="red">数据已作废</Tag> : <Button type="danger" style={{ marginLeft: 10 }}
            onClick={() => this.handleInvalidVisible(true)}>数据作废</Button>}

        </div>
      </div>
    )
  };


  columns = [{
    title: '操作员',
    dataIndex: 'executor'
  }, {
    title: '办理时间',
    dataIndex: 'executorTime'
  }, {
    title: '状态',
    dataIndex: 'logType'
  }, {
    title: '原因',
    dataIndex: 'remark'
  }];

  render() {
    const { modalVisible, handleModalVisible, loading, detailID } = this.props;
    const { busStaticData, openRecord, invalidVisible } = this.state;

    const parentMethods = {
      detailID: detailID,
      modalSuccess: this.modalSuccess,
      handleModalVisible: this.handleInvalidVisible
    };

    return <Fragment>
      <Modal
        destroyOnClose
        className={themeStyle.modalStyle}
        title={this.title()}
        visible={modalVisible}
        onCancel={() => handleModalVisible()}
        footer={null}
        width={1150}
      >
        <MyStaticModalPublic detail={busStaticData} />
        {busStaticData.reson ? <div className={themeStyle.detailMsg} style={{ marginTop: 16 }}>
          <div className={themeStyle.detailMsgTitle}><Icon type="stop" />&nbsp;作废原因</div>
          <p style={{ padding: '0 20px 20px' }}>{busStaticData.reson}</p>
        </div>
          : null}
      </Modal>
      {invalidVisible ? <InvalidDataModal {...parentMethods} modalVisible={invalidVisible} /> : null}
    </Fragment>
  }
}

export default DetailModal;
