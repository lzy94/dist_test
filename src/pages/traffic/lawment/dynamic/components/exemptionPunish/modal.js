import React, {PureComponent, Fragment} from 'react';
import publicCss from "@/pages/style/public.less";
import {Button, Icon, Descriptions, Spin, Modal} from "antd";
import {connect} from "dva";
import {imgUrl} from "@/utils/utils";
import Zmage from "react-zmage";
import moment from "moment";
import FocusDataModal from "../base";
import {checkAuth} from '@/utils/utils';
import MyDyModalPublic from "@/components/MyDyModalPublic";
import MyStaticModalPublic from "@/components/MyStaticModalPublic/staticModal";
import RecordList from "@/components/MyDyModalPublic/recordList";
import themeStyle from "@/pages/style/theme.less";

const authority = ['/lawment/dynamic/casehand/focusData'];

@connect(({DynamicLaw, loading}) => ({
  DynamicLaw,
  loading: loading.models.DynamicLaw,
}))
class CarDetail extends PureComponent {

  constructor(props) {
    super(props);
    this.myCarousel = React.createRef();
  }

  state = {
    registerInfo: {},
    busDynamicLawDate: {},
    openRecord: [],
    busStaticData: {},
    focusDataVisible: false,
  };

  componentDidMount() {
    this.getBusDynamicLawDataByPreviewCode();
  }


  getBusDynamicLawDataByPreviewCode = () => {
    const {dispatch, previewCode} = this.props;
    dispatch({
      type: 'DynamicLaw/busDynamicLawDataByPreviewCode',
      payload: {previewCode},
      callback: res => {
        if (res) {
          const registerInfo = res.registerInfo || {};
          this.setState({
            registerInfo: registerInfo,
            busDynamicLawDate: res.busDynamicLawDate,
            openRecord: res.openRecord,
            busStaticData: res.busStaticData || {}
          })
        }
      }
    })
  };

  renderCarMsg = () => {
    const {registerInfo, busDynamicLawDate} = this.state;
    return (
      <Descriptions bordered size='small' column={4}>
        <Descriptions.Item label='车辆所属' span={4}>{registerInfo.truckBelong === 1 ? '个人' : '企业'}</Descriptions.Item>
        <Descriptions.Item label='车牌号码'>{registerInfo.carNo || busDynamicLawDate.carNo}</Descriptions.Item>
        <Descriptions.Item label='车主姓名'>{registerInfo.vehicleOwner}</Descriptions.Item>
        <Descriptions.Item label='车辆类型'>{registerInfo.carType}</Descriptions.Item>
        <Descriptions.Item label='核定载重(kg)'>{registerInfo.weightLimited}</Descriptions.Item>
        <Descriptions.Item label='手机号码'>{registerInfo.phone}</Descriptions.Item>
        {registerInfo.truckBelong === 2 ?
          <Descriptions.Item label='统一信用码'>{registerInfo.creditCode}</Descriptions.Item> :
          <Descriptions.Item label='身份证号'>{registerInfo.idCard}</Descriptions.Item>}

        <Descriptions.Item label='外廓尺寸'>{registerInfo.externalDimensions}</Descriptions.Item>
        <Descriptions.Item label='车辆总重(kg)'>{registerInfo.totalWeight}</Descriptions.Item>
        <Descriptions.Item label='车辆厂牌'>{registerInfo.brandName}</Descriptions.Item>
        {registerInfo.truckBelong === 2 ?
          <Descriptions.Item label='法人姓名'>{registerInfo.legalRepresentative}</Descriptions.Item> :
          <Descriptions.Item style={{display: 'none'}}></Descriptions.Item>}
        {registerInfo.truckBelong === 2 ?
          <Descriptions.Item label='注册地址'>{registerInfo.registAddr}</Descriptions.Item> :
          <Descriptions.Item label='车主地址'>{registerInfo.vehicleOwnerAddr}</Descriptions.Item>}
      </Descriptions>
    );
  };

  modalSuccess = () => {
    const {handleModalVisible} = this.props;
    handleModalVisible();
  };

  modalTitle = () => {
    const {busDynamicLawDate} = this.state;
    const style = {
      color: '#fff'
    };
    return (
      <div className={themeStyle.modalHeader}>
        <div className={themeStyle.title}>
          <span className={themeStyle.value}>{busDynamicLawDate.carNo}</span>
          <span className={themeStyle.time}>{moment(busDynamicLawDate.previewTime).format("YYYY-M-D HH:mm:ss")}</span>
        </div>
        <div>
          {checkAuth(authority[0]) ? <Button style={{background: '#f1a325', borderColor: '#f1a325', ...style}}
                                             onClick={() => this.focusDataClick()}>重点关注</Button> : null}
        </div>
      </div>
    );
  };

  focusDataClick = () => {
    this.handleFocusModalVisible(true);
  };

  handleFocusModalVisible = flag => {
    this.setState({
      focusDataVisible: !!flag
    })
  };


  renderImg = (path, alt) => {
    return <div style={{overflow: 'hidden', width: 100, height: 100}}>
      <Zmage backdrop='rgba(255,255,255,.3)' src={imgUrl + path} alt={alt} style={{
        height: '100px'
      }}/>
    </div>
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
    const {loading, modalVisible, handleModalVisible, enclosureList} = this.props;
    const {busDynamicLawDate, openRecord, focusDataVisible, registerInfo, busStaticData} = this.state;

    const focusDataMethods = {
      handleModalVisible: this.handleFocusModalVisible,
      modalSuccess: this.modalSuccess,
      detail: {
        busDynamicLawDate,
        registerInfo
      }
    };

    return (
      <Fragment>
        <Modal
          destroyOnClose
          title={this.modalTitle()}
          visible={modalVisible}
          onCancel={() => handleModalVisible()}
          width={1100}
          footer={null}
          className={themeStyle.modalStyle}
        >
          <Spin spinning={loading}>
            <div className={themeStyle.detailMsg}>
              <div className={themeStyle.detailMsgTitle}><Icon type="profile"/>&nbsp;车辆基本信息
                <Button style={{float: 'right'}} size='small' href='http://www.gsxt.gov.cn/index.html'
                        target='_blank'>企业法人查询</Button>
              </div>
              <div style={{padding: '0 20px 20px'}}>
                {this.renderCarMsg()}
              </div>
            </div>
            <MyDyModalPublic detail={busDynamicLawDate} isTitle={true}/>
            {JSON.stringify(busStaticData) !== '{}' ? <MyStaticModalPublic detail={busStaticData}/> : null}
            <div className={themeStyle.detailMsg} style={{padding: 20, marginTop: 16}}>
              <div className={publicCss.modalTitle}><Icon type="file"/>&nbsp;附件记录</div>
              <Descriptions layout='vertical' bordered size='small' column={4}>
                <Descriptions.Item
                  label='委托代理人身份证照片'>{this.renderImg(enclosureList.agentIdcardUrl, '委托代理人身份证照片')}</Descriptions.Item>
                <Descriptions.Item
                  label='撤销凭证照片'>{this.renderImg(enclosureList.cancelProofUrl, '委托代理人身份证照片')}</Descriptions.Item>
                <Descriptions.Item
                  label='当事人身份证/企业营业执照'>{this.renderImg(enclosureList.cardUrl, '当事人身份证/企业营业执照')}</Descriptions.Item>
                <Descriptions.Item
                  label='车辆行驶证图片'>{this.renderImg(enclosureList.driveLicenseUrl, '车辆行驶证图片')}</Descriptions.Item>
              </Descriptions>
            </div>
            <div className={themeStyle.detailMsg} style={{marginTop: 16}}>
              <div className={themeStyle.detailMsgTitle}><Icon type="table"/>&nbsp;操作记录</div>
              <div className={themeStyle.recordList} style={{padding: '0 20px 20px'}}>
                <RecordList loading={loading} list={openRecord} columns={this.columns}/>
              </div>
            </div>
          </Spin>
        </Modal>
        {
          focusDataVisible ? <FocusDataModal {...focusDataMethods} modalVisible={focusDataVisible}/> : null
        }
      </Fragment>
    )
  }
}

export default CarDetail;
