import React, { PureComponent, Fragment } from "react";
import { Form, Icon, Modal } from "antd";
import { connect } from "dva";
import moment from "moment";
import themeStyle from "@/pages/style/theme.less";
import RecordList from "@/components/MyDyModalPublic/recordList";
import MyStaticModalPublic from "@/components/MyStaticModalPublic/staticModal";


@connect(({ LawmentStatic, loading }) => ({
  LawmentStatic,
  loading: loading.models.LawmentStatic,
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
  };

  componentDidMount() {
    this.getDetail();
  }

  getDetail = () => {
    const { dispatch, detailID } = this.props;
    dispatch({
      type: 'LawmentStatic/detail',
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
    const { modalVisible, handleModalVisible, loading } = this.props;
    const { busStaticData, openRecord } = this.state;

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

        <div className={themeStyle.detailMsg} style={{ marginTop: 16 }}>
          <div className={themeStyle.detailMsgTitle}><Icon type="stop" />&nbsp;作废原因</div>
          <p style={{ padding: '0 20px 20px' }}>{busStaticData.reson}</p>
        </div>

        {openRecord.length ? <div className={themeStyle.detailMsg} style={{ marginTop: 16 }}>
          <div className={themeStyle.detailMsgTitle}><Icon type="table" />&nbsp;操作记录</div>
          <div className={themeStyle.recordList} style={{ padding: '0 20px 20px' }}>
            <RecordList loading={loading} list={openRecord} columns={this.columns} />
          </div>
        </div> : null}
      </Modal>
    </Fragment>
  }
}

export default DetailModal;
