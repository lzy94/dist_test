import React, { PureComponent } from 'react';
import { Modal, Card, Descriptions } from 'antd';
import Zmage from 'react-zmage';
import { imgUrl } from '@/utils/utils';

import themeStyle from '@/pages/style/theme.less';

export default class DetailModal extends PureComponent {
  static defaultProps = {
    detail: {},
    modalVisible: false,
    handleModalVisible: () => {},
  };

  renderImg = item => {
    return (
      <Zmage
        backdrop="rgba(255,255,255,.3)"
        src={`${imgUrl}${item}`}
        alt="图片"
        style={{
          width: '200px',
          height: '200px',
        }}
      />
    );
  };

  render() {
    const { modalVisible, handleModalVisible, detail } = this.props;
    const cardMT = {
      marginTop: 5,
    };
    return (
      <Modal
        destroyOnClose
        title="详情"
        className={themeStyle.formModal}
        visible={modalVisible}
        onCancel={() => handleModalVisible()}
        footer={null}
        width={1000}
      >
        <Card bordered={false}>
          <Descriptions column={4} size="small" layout="vertical" bordered>
            <Descriptions.Item label="渡口名称">{detail.ferryName}</Descriptions.Item>
            <Descriptions.Item label="批准单位">{detail.authority}</Descriptions.Item>
            <Descriptions.Item label="所属水系">{detail.waterSystem}</Descriptions.Item>
            <Descriptions.Item label="所属乡镇">{detail.township}</Descriptions.Item>
            <Descriptions.Item label="经营人">{detail.operator}</Descriptions.Item>
            <Descriptions.Item label="联系方式">{detail.phone}</Descriptions.Item>
            <Descriptions.Item label="安全管理员">{detail.securityAdmin}</Descriptions.Item>
            <Descriptions.Item label="安全管理员联系方式">{detail.adminPhone}</Descriptions.Item>
          </Descriptions>
        </Card>
        <Card bordered={false} style={cardMT}>
          <Descriptions
            title={
              <div>
                渡口环境&nbsp;&nbsp;&nbsp;&nbsp;
                {detail.ferryEnvironment === 'on' ? (
                  '符合规范'
                ) : (
                  <span style={{ color: 'red' }}>不符合规范</span>
                )}
              </div>
            }
            column={1}
            size="small"
            layout="vertical"
            bordered
          >
            <Descriptions.Item label="渡口环境规范">
              <p>1、“两线一牌”（警戒水位线、停航封渡线、渡口公示牌）设置醒目，内容齐全</p>
              <p>2、渡口设置符合相关要求：远离大坝、水流平缓、无滑坡等地质灾害及水毁现象等</p>
              <p>3、栈道有扶手，便于上下</p>
              <p>4、300人次以上的渡口安装了摄像头并不被遮挡</p>
              <p>5、300人次以上的渡口安装了摄像头并不被遮挡</p>
              <p>6、渡船按固定航线行驶</p>
              <p>7、有举报和报警电话</p>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Card bordered={false} style={cardMT}>
          <Descriptions
            title={
              <div>
                执行不发航情况&nbsp;&nbsp;&nbsp;&nbsp;
                {detail.sailingSituation === 'on' ? (
                  '符合规范'
                ) : (
                  <span style={{ color: 'red' }}>不符合规范</span>
                )}
              </div>
            }
            column={1}
            size="small"
            layout="vertical"
            bordered
          >
            <Descriptions.Item label="执行不发航规范">
              <p>1、第一次洪峰超过警戒水位线停航执行情况</p>
              <p>2、大风、大雨、大雾、漂浮物过多、能见度不良等情况停航</p>
              <p>3、自然河段超封渡水位线、库区流量超停航封渡流量停航</p>
              <p>4、超警戒水位（警戒流量）减载30%</p>
              <p>5、船舶不适航、船员不适任、超载停航</p>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Card bordered={false} style={cardMT}>
          <Descriptions
            title={
              <div>
                签单情况&nbsp;&nbsp;&nbsp;&nbsp;
                {detail.signingStatus === 'on' ? (
                  '符合规范'
                ) : (
                  <span style={{ color: 'red' }}>不符合规范</span>
                )}
              </div>
            }
            column={1}
            size="small"
            layout="vertical"
            bordered
          >
            <Descriptions.Item label="签单规范">
              <p>1、“两线一牌”（警戒水位线、停航封渡线、渡口公示牌）设置醒目，内容齐全</p>
              <p>2、有固定的签场所、落实了签人员</p>
              <p>3、落实了签单人员，重点渡口按航次签单、非重点渡口逢场节假日专人签单</p>
              <p>
                4、签单记录（含人、车）与实载相符、签单员、驾驶员开航前实际核对后签字，无提前签单或假签单情况
              </p>
              <p>5、有固定签单记录严禁随船携带</p>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Card bordered={false} style={cardMT}>
          <Descriptions column={2} size="small" layout="vertical" bordered>
            <Descriptions.Item label="检查人员签字">
              {this.renderImg(detail.inspectors)}
            </Descriptions.Item>
            <Descriptions.Item label="被检查人员签字">
              {this.renderImg(detail.inspectedPerson)}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Modal>
    );
  }
}
