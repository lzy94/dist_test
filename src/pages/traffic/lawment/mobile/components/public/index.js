import React, { PureComponent, Fragment } from "react";
import { Descriptions, Icon, Skeleton } from "antd";
import Zmage from "react-zmage";
import { imgUrl } from "@/utils/utils";
import themeStyle from "@/pages/style/theme.less";

class Detail extends PureComponent {
  constructor(props) {
    super(props);
  }

  renderImg = (path, alt) => {
    return <div style={{ overflow: 'hidden', width: 100, height: 100 }}>
      <Zmage backdrop='rgba(255,255,255,.3)' src={imgUrl + path} alt={alt} style={{
        width: '100%',
        height: '100px'
      }} />
    </div>
  };

  
  
  render() {
    const { detail } = this.props;
    const driverPic = detail.driverPic?detail.driverPic.split(','):['',''];
    return <Fragment>
      {JSON.stringify(detail) !== '{}' ?
        <div>
          <div className={themeStyle.detailMsg}>
            <div className={themeStyle.detailMsgTitle}>
              <Icon type="profile" />&nbsp;
              执法基本信息
            </div>
            <div style={{ padding: '0 20px 20px' }}>
              <Descriptions bordered size="small" column={2}>
                <Descriptions.Item label="车牌号">{detail.carNo}</Descriptions.Item>
                <Descriptions.Item label="执法人员">{detail.undertaker}</Descriptions.Item>
                <Descriptions.Item label="执法时间">{detail.lawTime}</Descriptions.Item>
                <Descriptions.Item label="执法地址">{detail.address}</Descriptions.Item>
                <Descriptions.Item label="轴数">{detail.axleNumber}</Descriptions.Item>
                <Descriptions.Item label="限重(t)">{(detail.weightLimited / 1000).toFixed(2)}</Descriptions.Item>
                <Descriptions.Item label="总重(t)">{(detail.totalLoad / 1000).toFixed(2)}</Descriptions.Item>
                <Descriptions.Item label="超重(t)">{(detail.overLoad / 1000).toFixed(2)}</Descriptions.Item>
              </Descriptions>
            </div>
          </div>
          < div style={{ marginTop: 20 }}></div>
          <div className={themeStyle.detailMsg}>
            <div className={themeStyle.detailMsgTitle}>
              <Icon type="profile" />&nbsp;
              当事人信息
            </div>
            <div style={{ padding: '0 20px 20px' }}>
              <Descriptions bordered size="small" column={2}>
                <Descriptions.Item label="姓名">{detail.partyName}</Descriptions.Item>
                <Descriptions.Item label="性别">{detail.partySex}</Descriptions.Item>
                <Descriptions.Item label="联系方式">{detail.partyTel}</Descriptions.Item>
                <Descriptions.Item label="身份证号">{detail.partyIdcard}</Descriptions.Item>
                <Descriptions.Item label="地址">{detail.partyAddr}</Descriptions.Item>
              </Descriptions>
            </div>
          </div>
          <div style={{ marginTop: 20 }}></div>
          <div className={themeStyle.detailMsg}>
            <div className={themeStyle.detailMsgTitle}>
              <Icon type="picture" />&nbsp;
              图片
            </div>
            <div style={{ padding: '0 20px 20px' }}>
              <Descriptions bordered layout="vertical" size="small" column={5}>
                <Descriptions.Item label="驾驶证照">{this.renderImg(driverPic[0], '驾驶证照')}</Descriptions.Item>
                <Descriptions.Item label="行驶证照">{this.renderImg(driverPic[1], '行驶证照')}</Descriptions.Item>
                <Descriptions.Item label="车头照">{this.renderImg(detail.frontPic, '车头照')}</Descriptions.Item>
                <Descriptions.Item label="车尾照">{this.renderImg(detail.backtPic, '车尾照')}</Descriptions.Item>
                <Descriptions.Item label="签名">{this.renderImg(detail.signPic, '签名')}</Descriptions.Item>
              </Descriptions>
            </div>
          </div>
        </div>
        : <div style={{ background: '#fff', padding: 20 }}><Skeleton active /><Skeleton active /><Skeleton active /></div>}
    </Fragment>
  }
}

export default Detail;
