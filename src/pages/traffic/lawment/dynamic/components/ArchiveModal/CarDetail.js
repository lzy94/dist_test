import React, { PureComponent } from 'react';
import { Button, Icon, Descriptions, Spin, Skeleton } from 'antd';
import { connect } from 'dva';
import MyDyModalPublic from '@/components/MyDyModalPublic';
import MyStaticModalPublic from '@/components/MyStaticModalPublic/staticModal';
import RecordList from '@/components/MyDyModalPublic/recordList';
import themeStyle from '@/pages/style/theme.less';

@connect(({ DynamicLaw, loading }) => ({
  DynamicLaw,
  loading: loading.models.DynamicLaw,
}))
class CarDetail extends PureComponent {
  state = {
    registerInfo: {},
    busDynamicLawDate: {},
    openRecord: [],
    busStaticData: {},
  };

  componentDidMount() {
    const { detail } = this.props;
    const registerInfo = detail.registerInfo || {};
    this.setState({
      registerInfo: registerInfo,
      busDynamicLawDate: detail.busDynamicLawDate,
      openRecord: detail.openRecord,
      busStaticData: detail.busStaticData || {},
    });
  }

  renderCarMsg = () => {
    const { registerInfo } = this.state;
    return (
      <Descriptions bordered size="small" column={4}>
        <Descriptions.Item label="车辆所属" span={4}>
          {registerInfo.truckBelong === 1 ? '个人' : '企业'}
        </Descriptions.Item>
        <Descriptions.Item label="车牌号码">{registerInfo.carNo}</Descriptions.Item>
        <Descriptions.Item label="车主姓名">{registerInfo.vehicleOwner}</Descriptions.Item>
        <Descriptions.Item label="车辆类型">{registerInfo.carType}</Descriptions.Item>
        <Descriptions.Item label="核定载重(kg)">{registerInfo.weightLimited}</Descriptions.Item>
        <Descriptions.Item label="手机号码">{registerInfo.phone}</Descriptions.Item>
        {registerInfo.truckBelong === 2 ? (
          <Descriptions.Item label="统一信用码">{registerInfo.creditCode}</Descriptions.Item>
        ) : (
          <Descriptions.Item label="身份证号">{registerInfo.idCard}</Descriptions.Item>
        )}

        <Descriptions.Item label="外廓尺寸">{registerInfo.externalDimensions}</Descriptions.Item>
        <Descriptions.Item label="车辆总重(kg)">{registerInfo.totalWeight}</Descriptions.Item>
        <Descriptions.Item label="车辆厂牌">{registerInfo.brandName}</Descriptions.Item>
        {registerInfo.truckBelong === 2 ? (
          <Descriptions.Item label="法人姓名">{registerInfo.legalRepresentative}</Descriptions.Item>
        ) : (
          <Descriptions.Item style={{ display: 'none' }}></Descriptions.Item>
        )}
        {registerInfo.truckBelong === 2 ? (
          <Descriptions.Item label="注册地址">{registerInfo.registAddr}</Descriptions.Item>
        ) : (
          <Descriptions.Item label="车主地址">{registerInfo.vehicleOwnerAddr}</Descriptions.Item>
        )}
      </Descriptions>
    );
  };

  columns = [
    {
      title: '操作员',
      dataIndex: 'executor',
    },
    {
      title: '办理时间',
      dataIndex: 'executorTime',
    },
    {
      title: '状态',
      dataIndex: 'logType',
    },
    {
      title: '原因',
      dataIndex: 'remark',
    },
  ];

  render() {
    const { loading } = this.props;
    const { busDynamicLawDate, openRecord, busStaticData } = this.state;

    return (
      <div style={{ background: '#EEF1FC' }}>
        <Spin spinning={loading}>
          <div className={themeStyle.detailMsg} style={{ borderRadius: '0 0 4px 4px' }}>
            <div className={themeStyle.detailMsgTitle}>
              <Icon type="profile" />
              &nbsp;车辆基本信息
              <Button
                style={{ float: 'right' }}
                size="small"
                href="http://www.gsxt.gov.cn/index.html"
                target="_blank"
              >
                企业法人查询
              </Button>
            </div>
            <div style={{ padding: '0 20px 20px' }}>{this.renderCarMsg()}</div>
          </div>
          {Object.keys(busDynamicLawDate).length ? (
            <MyDyModalPublic detail={busDynamicLawDate} isTitle={true} />
          ) : (
            <Skeleton active />
          )}
          {JSON.stringify(busStaticData) !== '{}' ? (
            <MyStaticModalPublic detail={busStaticData} />
          ) : null}
          <div className={themeStyle.detailMsg} style={{ marginTop: 16 }}>
            <div className={themeStyle.detailMsgTitle}>
              <Icon type="table" />
              &nbsp;操作记录
            </div>

            <div className={themeStyle.recordList} style={{ padding: '0 20px 20px' }}>
              <RecordList loading={loading} list={openRecord} columns={this.columns} />
            </div>
          </div>
        </Spin>
      </div>
    );
  }
}

export default CarDetail;
