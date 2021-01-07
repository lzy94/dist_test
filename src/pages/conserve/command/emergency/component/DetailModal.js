import React, { PureComponent } from 'react';
import { Modal, Form, Icon, Descriptions } from 'antd';
import { connect } from 'dva';
import Zmage from 'react-zmage';
import { planRank, getPlanObject } from '@/utils/dictionaries';
import { imgUrl } from '@/utils/utils';
import themeStyle from '@/pages/style/theme.less';

import moment from 'moment';
import StandardTable from '@/components/StandardTable';

let planObject = [[], []];

/* eslint react/no-multi-comp:0 */
@connect(({ system, Emergency, loading }) => ({
  system,
  Emergency,
  loading: loading.models.system,
}))
@Form.create()
class DetailModal extends PureComponent {
  // eslint-disable-next-line react/sort-comp
  constructor(props) {
    super(props);
    planObject = getPlanObject();
  }

  state = {
    pageBean: { page: 1, pageSize: 5, showTotal: true },
  };

  columns = [
    {
      title: '操作员',
      dataIndex: 'createdBy',
    },
    {
      title: '反馈时间',
      dataIndex: 'createdTime',
      render: val => moment(val).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '反馈内容',
      dataIndex: 'feedbackContent',
    },
  ];

  componentDidMount() {
    const { detail } = this.props;
    this.getList({
      pageBean: this.state.pageBean,
      querys: [
        {
          property: 'eventId',
          value: detail.id_,
          group: 'main',
          operation: 'EQUAL',
          relation: 'AND',
        },
      ],
    });
  }

  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'system/contingencyControl',
      payload: params,
    });
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const params = {
      pageBean: {
        page: pagination.current,
        pageSize: pagination.pageSize,
        showTotal: true,
      },
      querys: [
        {
          property: 'eventId',
          value: this.props.detail.id_,
          group: 'main',
          operation: 'EQUAL',
          relation: 'AND',
        },
      ],
    };
    this.getList(params);
  };

  render() {
    const {
      system: { contingencyControlData },
      modalVisible,
      handleModalVisible,
      detail,
      loading,
    } = this.props;
    return (
      <Modal
        destroyOnClose
        title="应急指挥详情"
        className={themeStyle.formModal}
        visible={modalVisible}
        onCancel={() => handleModalVisible()}
        width={800}
        footer={null}
        // footer={[
        //   <Button key="back" onClick={() => handleModalVisible()}>
        //     取消
        //   </Button>,
        //   <Button key="submit" type="primary" loading={loading} onClick={() => this.save()}>
        //     完成任务
        //   </Button>,
        // ]}
      >
        <div className={themeStyle.detailMsg}>
          <div style={{ padding: 20 }}>
            <h3 style={{ color: '#2A5298' }}>
              <Icon type="profile" theme="filled" />
              基本信息
            </h3>
            <Descriptions bordered size="small" column={2}>
              <Descriptions.Item label="对象">
                {planObject[1][planObject[0].indexOf(detail.planObject)]}
              </Descriptions.Item>
              <Descriptions.Item label="类型">{detail.categoryName}</Descriptions.Item>
              <Descriptions.Item label="处置时间">
                {moment(detail.sendTime).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
              <Descriptions.Item label="等级">
                {planRank[detail.emergencyLevel - 1]}
              </Descriptions.Item>

              <Descriptions.Item label="位置">{detail.addr}</Descriptions.Item>
              <Descriptions.Item label="处置人员">{detail.charger}</Descriptions.Item>
              <Descriptions.Item label="处置方式" span={2}>
                {detail.dealType}
              </Descriptions.Item>
              <Descriptions.Item label="上报内容" span={2}>
                {detail.workContent}
              </Descriptions.Item>
            </Descriptions>
          </div>
        </div>
        <div className={themeStyle.detailMsg} style={{ marginTop: 10 }}>
          <div style={{ padding: 20, overflow: 'hidden' }}>
            <h3 style={{ color: '#2A5298' }}>
              <Icon type="picture" theme="filled" /> 图片信息
            </h3>

            {detail.imgUrl
              ? detail.imgUrl.split(',').map((item, index) => (
                  <div
                    key={index}
                    style={{
                      overflow: 'hidden',
                      width: 200,
                      height: 200,
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
                        height: '200px',
                      }}
                    />
                  </div>
                ))
              : null}
          </div>
        </div>

        {contingencyControlData.list.length ? (
          <div className={themeStyle.detailMsg} style={{ marginTop: 10 }}>
            <div className={themeStyle.recordList} style={{ padding: '20px' }}>
              <h3 style={{ color: '#2A5298' }}>
                <Icon type="picture" theme="filled" /> 反馈结果
              </h3>
              <StandardTable
                rowKey="id_"
                size="small"
                selectedRows={0}
                rowSelection={null}
                loading={loading}
                data={contingencyControlData}
                columns={this.columns}
                onChange={this.handleStandardTableChange}
              />
            </div>
          </div>
        ) : null}
      </Modal>
    );
  }
}

export default DetailModal;
