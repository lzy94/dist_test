import React, { PureComponent, Fragment } from 'react';
import { Form, Descriptions, Icon } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import Zmage from 'react-zmage';
import { imgUrl } from '@/utils/utils';
import themeStyle from '@/pages/style/theme.less';
import notImg from '@/assets/notImg.png';

@connect(({ DynamicLaw, loading }) => ({
  DynamicLaw,
  loading: loading.models.DynamicLaw,
}))
@Form.create()
class CaseDetail extends PureComponent {
  state = {
    detail: {},
    partyRadio: 1,
    isAgent: 0,
  };

  componentDidMount() {
    const { detail } = this.props;
    this.setState({
      detail,
      partyRadio: parseInt(detail.personalororgan, 10),
      isAgent: parseInt(detail.isAgent, 10),
    });
  }

  // 当事人  个人
  renderParty = () => {
    const { detail } = this.state;
    return (
      <>
        <div className={themeStyle.detailMsgTitle}>
          <Icon type="profile" />
          &nbsp; 当事人信息
        </div>
        <div style={{ padding: '0 20px 20px' }}>
          <Descriptions bordered size="small">
            <Descriptions.Item label="当事人类型" span={3}>
              个人
            </Descriptions.Item>
            <Descriptions.Item label="姓名">{detail.partyName}</Descriptions.Item>
            <Descriptions.Item label="性别">
              {detail.partySex === 1 ? '男' : '女'}
            </Descriptions.Item>
            <Descriptions.Item label="身份证号">{detail.partyIdcard}</Descriptions.Item>
            <Descriptions.Item label="联系方式">{detail.partyTel}</Descriptions.Item>
            <Descriptions.Item label="住址">{detail.partyAddr}</Descriptions.Item>
          </Descriptions>
        </div>
      </>
    );
  };

  // 当事人 企业
  renderPartyEnterprise = () => {
    const { detail } = this.state;
    return (
      <>
        <div className={themeStyle.detailMsgTitle}>
          <Icon type="profile" />
          &nbsp; 当事人信息
        </div>
        <div style={{ padding: '0 20px 20px' }}>
          <Descriptions bordered size="small">
            <Descriptions.Item label="当事人类型" span={3}>
              企业或者其他组织
            </Descriptions.Item>
            <Descriptions.Item label="企业名称">{detail.partyName}</Descriptions.Item>
            <Descriptions.Item label="法定代表人">{detail.legalMan}</Descriptions.Item>
            <Descriptions.Item label="统一信用代码">{detail.creditCode}</Descriptions.Item>
            <Descriptions.Item label="企业电话">{detail.companyTel}</Descriptions.Item>
            <Descriptions.Item label="注册地址">{detail.companyAddr}</Descriptions.Item>
            <Descriptions.Item label="法人手机">{detail.legalManTel}</Descriptions.Item>
            <Descriptions.Item label="法人家庭住址">{detail.legalManAddr}</Descriptions.Item>
          </Descriptions>
        </div>
      </>
    );
  };

  // 委托
  renderAgent = () => {
    const { detail } = this.state;
    return (
      <>
        <div className={themeStyle.detailMsgTitle}>
          <Icon type="profile" />
          &nbsp; 委托代理人信息
        </div>
        <div style={{ padding: '0 20px 20px' }}>
          <Descriptions bordered size="small">
            <Descriptions.Item label="代理人姓名">{detail.agentName}</Descriptions.Item>
            <Descriptions.Item label="性别">
              {detail.agentSex === 1 ? '男' : '女'}
            </Descriptions.Item>
            <Descriptions.Item label="身份证号">{detail.agentIdcard}</Descriptions.Item>
            <Descriptions.Item label="联系方式">{detail.agentTel}</Descriptions.Item>
            <Descriptions.Item label="住址">{detail.agentAddr}</Descriptions.Item>
          </Descriptions>
        </div>
      </>
    );
  };

  // 驾驶员
  renderDriver = () => {
    const { detail } = this.state;
    return (
      <>
        <div className={themeStyle.detailMsgTitle}>
          <Icon type="profile" />
          &nbsp; 驾驶员信息
        </div>
        <div style={{ padding: '0 20px 20px' }}>
          <Descriptions bordered size="small">
            <Descriptions.Item label="驾驶员姓名">{detail.driverName}</Descriptions.Item>
            <Descriptions.Item label="性别">
              {detail.driverSex === 1 ? '男' : '女'}
            </Descriptions.Item>
            <Descriptions.Item label="身份证号">{detail.driverIdcard}</Descriptions.Item>
            <Descriptions.Item label="联系方式">{detail.driverTel}</Descriptions.Item>
            <Descriptions.Item label="住址">{detail.driverAddr}</Descriptions.Item>
          </Descriptions>
        </div>
      </>
    );
  };

  // 案件信息
  renderCaseInfo = () => {
    const { detail } = this.state;
    return (
      <>
        <div className={themeStyle.detailMsgTitle}>
          <Icon type="profile" />
          &nbsp; 案件信息
        </div>
        <div style={{ padding: '0 20px 20px' }}>
          <Descriptions bordered size="small" column={4}>
            <Descriptions.Item label="案件来源" span={2}>
              {detail.caseSource || '非现场执法'}
            </Descriptions.Item>
            <Descriptions.Item label="案由" span={2}>
              {detail.caseReason
                ? `${detail.caseReason.split(',')[0]} - ${detail.caseReason.split(',')[1]}`
                : ''}
            </Descriptions.Item>
            <Descriptions.Item label="车货总重(t)">
              {(detail.weight / 1000).toFixed(2)}
            </Descriptions.Item>
            <Descriptions.Item label="轴数">{detail.axisNum}</Descriptions.Item>
            <Descriptions.Item label="超限">{detail.limited}</Descriptions.Item>
            <Descriptions.Item label="处罚金额">{detail.punishMoney}</Descriptions.Item>
            <Descriptions.Item label="货物名称" span={2}>
              {detail.goodsName}
            </Descriptions.Item>
            <Descriptions.Item label="询问时间" span={2}>
              {detail.askBeginTime && detail.askEndTime
                ? `${moment(new Date(detail.askBeginTime)).format(
                    'YYYY-MM-DD HH:mm:ss',
                  )} ~ ${moment(new Date(detail.askEndTime)).format('YYYY-MM-DD HH:mm:ss')}`
                : ''}
            </Descriptions.Item>
            <Descriptions.Item label="案卷号" span={2}>
              {detail.caseNo}
            </Descriptions.Item>
            <Descriptions.Item label="讨论时间" span={2}>
              {detail.discussBeginTime && detail.discussEndTime
                ? `${moment(new Date(detail.discussBeginTime)).format(
                    'YYYY-MM-DD HH:mm:ss',
                  )} ~ ${moment(new Date(detail.discussEndTime)).format('YYYY-MM-DD HH:mm:ss')}`
                : ''}
            </Descriptions.Item>
            <Descriptions.Item label="承办人">{detail.undertaker}</Descriptions.Item>
            <Descriptions.Item label="执法证号">{detail.enforcementNo}</Descriptions.Item>
            <Descriptions.Item label="协办人">{detail.coOrganizer}</Descriptions.Item>
            <Descriptions.Item label="执法证号">{detail.organizerNo}</Descriptions.Item>
            <Descriptions.Item label="审核人">{detail.reviewer}</Descriptions.Item>
            <Descriptions.Item label="负责人">{detail.principal}</Descriptions.Item>
            <Descriptions.Item label="情况说明" span={2}>
              {detail.hapDesc}
            </Descriptions.Item>
            <Descriptions.Item label="车辆说明" span={4}>
              {detail.carDesc}
            </Descriptions.Item>
          </Descriptions>
        </div>
      </>
    );
  };

  checkImg = path => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onerror = () => {
        resolve('errror');
      };
      img.src = path;
    });
  };

  getUrl = async path => {
    const res = await this.checkImg(path);
    if (res === 'error') {
      return notImg;
    }
    return path;
  };

  renderImg = (path, alt) => {
    // this.getUrl(imgUrl + path);
    let src = path;
    if (!src) {
      src = notImg;
    } else {
      src = imgUrl + path;
    }
    return (
      <div style={{ overflow: 'hidden', width: 200, height: 100 }}>
        <Zmage
          backdrop="rgba(255,255,255,.3)"
          src={src}
          alt={alt}
          style={{
            height: '100%',
          }}
        />
      </div>
    );
  };

  renderAudio = path => {
    if (path) {
      return <audio style={{ outline: 'none' }} src={imgUrl + path} controls="controls" />;
    }
    return '暂无文件';
  };

  renderAutograph = () => {
    const { detail } = this.state;
    return (
      <>
        <div className={themeStyle.detailMsgTitle}>
          <Icon type="profile" />
          &nbsp; 签字
        </div>
        <div style={{ padding: '0 20px 20px' }}>
          <Descriptions layout="vertical" bordered size="small">
            <Descriptions.Item label="当事人签字">
              {this.renderImg(detail.partyNameSigna, '请上传当事人签字')}
            </Descriptions.Item>
          </Descriptions>
        </div>
      </>
    );
  };

  // 音频文件
  renderAudioDoc = () => {
    const { detail } = this.state;
    return (
      <>
        <div className={themeStyle.detailMsgTitle}>
          <Icon type="profile" />
          &nbsp; 音频资料
        </div>
        <div style={{ padding: '0 20px 20px' }}>
          <Descriptions layout="vertical" bordered size="small">
            <Descriptions.Item label="询问记录音频资料">
              {this.renderAudio(detail.liveRecord)}
            </Descriptions.Item>
            <Descriptions.Item label="讨论记录音频资料">
              {this.renderAudio(detail.talkRecord)}
            </Descriptions.Item>
          </Descriptions>
        </div>
      </>
    );
  };

  // 附件
  renderEnclosureDetail = () => {
    const { detail } = this.state;
    return (
      <>
        <div className={themeStyle.detailMsgTitle}>
          <Icon type="profile" />
          &nbsp; 附件
        </div>
        <div style={{ padding: '0 20px 20px' }}>
          <Descriptions layout="vertical" bordered size="small">
            <Descriptions.Item label="当事人身份证/企业营业执照">
              {this.renderImg(detail.cardUrl, '当事人身份证/企业营业执照')}
            </Descriptions.Item>
            <Descriptions.Item label="车辆行驶证">
              {this.renderImg(detail.driveLicenseUrl, '车辆行驶证')}
            </Descriptions.Item>
            <Descriptions.Item label="驾驶员驾驶证">
              {this.renderImg(detail.driverLicenseUrl, '驾驶员驾驶证')}
            </Descriptions.Item>
            <Descriptions.Item label="委托代理人身份证">
              {this.renderImg(detail.agentIdcardUrl, '委托代理人身份证')}
            </Descriptions.Item>
            <Descriptions.Item label="车辆道路运输证或其他">
              {this.renderImg(detail.transportLicenseUrl, '车辆道路运输证或其他')}
            </Descriptions.Item>
            <Descriptions.Item label="驾驶员从业资格证或其他">
              {this.renderImg(detail.practitionerUrl, '驾驶员从业资格证或其他')}
            </Descriptions.Item>
          </Descriptions>
        </div>
      </>
    );
  };

  render() {
    const { partyRadio, isAgent, detail } = this.state;

    return (
      <div style={{ background: '#EEF1FC' }}>
        {partyRadio === 1 ? (
          <div className={themeStyle.detailMsg} style={{ borderRadius: '0 0 4px 4px' }}>
            {this.renderParty()}
          </div>
        ) : (
          <div className={themeStyle.detailMsg}>{this.renderPartyEnterprise()}</div>
        )}
        {isAgent ? (
          <div className={themeStyle.detailMsg} style={{ marginTop: 16 }}>
            {this.renderAgent()}
          </div>
        ) : null}
        <div className={themeStyle.detailMsg} style={{ marginTop: 16 }}>
          {this.renderDriver()}
        </div>
        <div className={themeStyle.detailMsg} style={{ marginTop: 16 }}>
          {this.renderCaseInfo()}
        </div>
        <div className={themeStyle.detailMsg} style={{ marginTop: 16 }}>
          {this.renderAutograph()}
        </div>
        <div className={themeStyle.detailMsg} style={{ marginTop: 16 }}>
          {this.renderAudioDoc()}
        </div>
        {JSON.stringify(detail) !== '{}' ? (
          <div className={themeStyle.detailMsg} style={{ marginTop: 16 }}>
            {this.renderEnclosureDetail()}
          </div>
        ) : null}
      </div>
    );
  }
}

export default CaseDetail;
