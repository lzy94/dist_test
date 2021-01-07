import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { FullScreenContainer, BorderBox12 } from '@jiaminghi/data-view-react';
import WaterChart from './component/WaterChart';
import VideoLive from './component/VideoLive';
import FocusChart from './component/FocusChart';
import MonitorScale from './component/MonitorScale';
import WaterTableList from './component/WaterTableList';
import MapChart from './component/MapChart';
import EmergencyCommand from '@/pages/PublicComponent/EmergencyCommand';

import dataVPublic from '@/pages/style/dataV.less';
import style from './index.less';

import logo from '@/assets/dataV/logo.png';

@connect(({ MaritimePoint, loading }) => ({
  MaritimePoint,
  loading: loading.models.MaritimePoint,
}))
class Index extends PureComponent {
  componentDidMount() {
    this.getWaterList();
  }

  getWaterList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'MaritimePoint/fetch',
      payload: { pageBean: { page: 1, pageSize: 30, showTotal: true } },
    });
  };

  render() {
    return (
      <FullScreenContainer>
        <div className={dataVPublic.main}>
          <div className={dataVPublic.header}>
            <div className={dataVPublic.logo}>
              <img src={logo} alt="" />
            </div>
            <div className={dataVPublic.title}>综合交通执法管理平台</div>
            <div className={dataVPublic.btns} />
          </div>
          <div className={dataVPublic.chartMain}>
            <div className={dataVPublic.leftContainer}>
              <div className={style.leftContainerTop}>
                <VideoLive />
              </div>
              <div className={style.leftContainerBottom}>
                <BorderBox12 color={['#48A2B3']}>
                  <MonitorScale />
                  <FocusChart />
                </BorderBox12>
              </div>
            </div>
            <div className={dataVPublic.centerContainer}>
              <div className={style.centerContainerTop}>
                <MapChart />
              </div>
              <div className={style.centerContainerBottom}>
                <div className={style.socketmsg}>
                  {/* 四川省绵阳市江油市彰明
                  <span>某某路波形护栏缺损存在安全隐患</span> */}
                </div>

                <div className={style.problemList}>
                  <WaterTableList />
                </div>
              </div>
            </div>
            <div className={dataVPublic.rightContainer}>
              <div className={style.rightContainerTop}>
                <WaterChart />
              </div>
              <div className={style.rightContainerBottom}>
                <EmergencyCommand type={-3} />
              </div>
            </div>
          </div>
        </div>
      </FullScreenContainer>
    );
  }
}
export default Index;
