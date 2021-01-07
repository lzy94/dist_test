import React, { PureComponent, Fragment } from 'react';
import { Modal, Descriptions, Button, message, Form, Input } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import ScoreModal from './ScoreModal';
import Zmage from 'react-zmage';
import { imgUrl } from '@/utils/utils';

import themeStyle from '@/pages/style/theme.less';
import iconStyle from '@/assets/font/conserve/iconfont.css';

const FormItem = Form.Item;

/* eslint react/no-multi-comp:0 */
@connect(({ RoadWorkOrdes, loading }) => ({
  RoadWorkOrdes,
  loading: loading.models.RoadWorkOrdes,
}))
@Form.create()
class DetailModal extends PureComponent {
  state = {
    scoreModalVisible: false,
  };

  scoreHandleModalVisible = flag => {
    this.setState({
      scoreModalVisible: !!flag,
    });
  };

  modalSuccess = () => {
    const { modalSuccess, handleModalVisible } = this.props;
    modalSuccess();
    handleModalVisible();
  };

  save = () => {
    const { dispatch, detail, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const value = {
        id: detail.roadWorkOrdes.id,
        ...fieldsValue,
      };

      dispatch({
        type: 'RoadWorkOrdes/orderCompelete',
        payload: value,
        callback: () => {
          message.success('工单已完成');
          this.scoreHandleModalVisible(true);
        },
      });
    });
  };

  render() {
    const { scoreModalVisible } = this.state;
    const { modalVisible, handleModalVisible, detail, loading, form } = this.props;
    const [roadWorkOrdes, roadConserveCompany] = [
      detail.roadWorkOrdes,
      detail.roadConserveCompany,
      detail.roadConserveExamine,
    ];

    const parentMethods = {
      detail: roadConserveCompany,
      modalSuccess: this.modalSuccess,
      handleModalVisible: this.scoreHandleModalVisible,
    };
    const hStyle = { fontSize: 16, fontWeight: 'bold', color: '#2A5298', float: 'left' };
    const pStyle = { float: 'right', fontSize: 12, color: '#80848D', fontWeight: '500' };

    const companyTitle = (
      <div style={{ overflow: 'hidden' }}>
        <h3 style={hStyle}>
          <span className={`${iconStyle.iconfont} ${iconStyle['icon-gongsi']}`} /> 公司信息
        </h3>
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
      <Fragment>
        <Modal
          destroyOnClose
          title="工单详情"
          className={themeStyle.formModal}
          visible={modalVisible}
          width={700}
          onCancel={() => handleModalVisible()}
          footer={[
            <Button key="back" onClick={() => handleModalVisible()}>
              取消
            </Button>,
            <Button loading={loading} key="submit" type="primary" onClick={() => this.save()}>
              完成
            </Button>,
          ]}
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
                {/* <Descriptions.Item label="完成情况" span={2}>
                  {roadWorkOrdes.completionStatus}
                </Descriptions.Item> */}
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
          <div className={themeStyle.detailMsg} style={{ marginTop: 10 }}>
            <div style={{ padding: 20 }}>
              <FormItem label="完成情况" style={{ marginBottom: 0 }}>
                {form.getFieldDecorator('completionStatus', {
                  rules: [{ required: true, message: '请输入完成情况！' }],
                })(<Input.TextArea autosize placeholder="请输入" />)}
              </FormItem>
            </div>
          </div>
        </Modal>
        {scoreModalVisible ? (
          <ScoreModal {...parentMethods} modalVisible={scoreModalVisible} />
        ) : null}
      </Fragment>
    );
  }
}

export default DetailModal;
