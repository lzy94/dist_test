import React, { PureComponent } from 'react';
import { Modal, Descriptions, List, Avatar, Button } from 'antd';
import themeStyle from '@/pages/style/theme.less';
import Zmage from 'react-zmage';
import { imgUrl } from '@/utils/utils';

import iconStyle from '@/assets/font/conserve/iconfont.css';
import moment from 'moment';

class DetailModal extends PureComponent {
  renderScore = list => {
    let score = 0;
    for (let i = 0; i < list.length; i++) {
      score += list[i].delScore;
    }
    return score;
  };

  render() {
    const { modalVisible, handleModalVisible, detail } = this.props;
    const [roadWorkOrdes, roadConserveCompany, roadConserveExamine] = [
      detail.roadWorkOrdes,
      detail.roadConserveCompany,
      detail.roadConserveExamine,
    ];
    const hStyle = { fontSize: 16, fontWeight: 'bold', color: '#2A5298', float: 'left' };
    const pStyle = { float: 'right', fontSize: 12, color: '#80848D', fontWeight: '500' };

    const companyTitle = (
      <div style={{ overflow: 'hidden' }}>
        <h3 style={hStyle}>
          <span className={`${iconStyle.iconfont} ${iconStyle['icon-gongsi']}`} /> 公司信息
        </h3>
        <p style={pStyle}>
          本月得分：
          <span style={{ fontSize: 18, color: '#F9271C' }}>
            {100 - this.renderScore(roadConserveExamine)}
          </span>
        </p>
      </div>
    );

    const ordesTitle = (
      <div style={{ overflow: 'hidden' }}>
        <h3 style={hStyle}>
          <span className={`${iconStyle.iconfont} ${iconStyle['icon-renwu']}`} /> 养护任务
        </h3>
        <p style={pStyle}>
          状态：
          <span style={{ fontSize: 16, color: '#1C8FF9' }}>
            {roadWorkOrdes.state === 1 ? '已派出' : '已完成'}
          </span>
        </p>
      </div>
    );

    return (
      <Modal
        destroyOnClose
        title="工单详情"
        className={`${themeStyle.myModal} ${themeStyle.modalbody}`}
        visible={modalVisible}
        width={700}
        onCancel={() => handleModalVisible()}
        footer={null}
        // footer={[
        //   <Button key="back" onClick={() => handleModalVisible()}>
        //     取消
        //   </Button>,
        //   <Button key="submit" type="primary" onClick={() => this.save()}>
        //     完成任务
        //   </Button>,
        // ]}
      >
        <div className={themeStyle.detailMsg}>
          <div style={{ padding: 20 }}>
            <Descriptions title={companyTitle} bordered size="small" column={2}>
              <Descriptions.Item label="公司名称">
                {roadConserveCompany.companyName}
              </Descriptions.Item>
              <Descriptions.Item label="负责人">
                {roadConserveCompany.companyHeader}
              </Descriptions.Item>
              <Descriptions.Item label="联系电话" span={2}>
                {roadConserveCompany.companyTel}
              </Descriptions.Item>
              <Descriptions.Item label="签订内容" span={2}>
                {roadConserveCompany.agreement}
              </Descriptions.Item>
            </Descriptions>
          </div>
        </div>
        <div className={themeStyle.detailMsg} style={{ marginTop: 10 }}>
          <div style={{ padding: 20 }}>
            <Descriptions title={ordesTitle} bordered size="small" column={2}>
              <Descriptions.Item label="所在地点">{roadWorkOrdes.curingAddr}</Descriptions.Item>
              <Descriptions.Item label="负责人">{roadWorkOrdes.curinger}</Descriptions.Item>
              <Descriptions.Item label="开始时间">
                {moment(roadWorkOrdes.checkTime).format('YYYY-MM-DD')}
              </Descriptions.Item>
              <Descriptions.Item label="限定完成时间">
                {moment(roadWorkOrdes.endTime).format('YYYY-MM-DD')}
              </Descriptions.Item>
              <Descriptions.Item label="完成情况" span={2}>
                {roadWorkOrdes.completionStatus}
              </Descriptions.Item>
              <Descriptions.Item label="养护原因" span={2}>
                {roadWorkOrdes.curingContent}
              </Descriptions.Item>
              <Descriptions.Item label="工作内容" span={2}>
                {roadWorkOrdes.workContent}
              </Descriptions.Item>
            </Descriptions>
          </div>
        </div>
        <div className={themeStyle.detailMsg} style={{ marginTop: 10 }}>
          <div style={{ padding: 20, overflow: 'hidden' }}>
            <div style={{ overflow: 'hidden' }}>
              <h3 style={hStyle}>
                <span className={`${iconStyle.iconfont} ${iconStyle['icon-tupian']}`} /> 图片
              </h3>
            </div>

            {roadWorkOrdes.imgUrl
              ? roadWorkOrdes.imgUrl.split(',').map((item, index) => (
                  <div
                    key={index}
                    style={{
                      overflow: 'hidden',
                      width: 195,
                      height: 195,
                      float: 'left',
                      marginRight: 10,
                    }}
                  >
                    <Zmage
                      backdrop="rgba(255,255,255,.3)"
                      src={imgUrl + item}
                      alt="图片"
                      style={{
                        width: '100%',
                        height: '195px',
                      }}
                    />
                  </div>
                ))
              : null}
          </div>
        </div>

        {roadConserveExamine.length ? (
          <div className={themeStyle.detailMsg} style={{ marginTop: 10 }}>
            <div style={{ padding: 20 }}>
              <div style={{ overflow: 'hidden' }}>
                <h3 style={{ ...hStyle, float: 'none' }}>
                  <span className={`${iconStyle.iconfont} ${iconStyle['icon-tubiao_fenshu']}`}>
                    本月绩效考核信息
                  </span>
                </h3>
                <p style={pStyle}>
                  总扣分：
                  <span style={{ fontSize: 18, color: '#F9271C' }}>
                    {this.renderScore(roadConserveExamine)}
                  </span>
                </p>
              </div>

              {
                <List
                  itemLayout="horizontal"
                  dataSource={roadConserveExamine}
                  renderItem={item => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar shape="square" size={60} src={imgUrl + item.evidence} />}
                        title={`罚款：${item.fine}   扣分：${item.delScore}`}
                        description={`扣分原因：${item.reson}`}
                      />
                    </List.Item>
                  )}
                />
              }
            </div>
          </div>
        ) : null}
      </Modal>
    );
  }
}

export default DetailModal;
