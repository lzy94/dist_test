import React, { PureComponent } from 'react';

import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

// import Link from 'umi/link';
import { FullScreenContainer, BorderBox12, BorderBox7 } from '@jiaminghi/data-view-react';

import { socketUrl } from '@/utils/utils';

import WaterChart from './Component/WaterChart';
import MaintainChart from './Component/MaintainChart';
import CompanyScoreChart from './Component/CompanyScoreChart';
import EquipmentChart from './Component/EquipmentChart';
import MapChart from './Component/MapChart';
import RoadWorkOrdesChart from './Component/RoadWorkOrdesChart';
import EmergencyCommand from '@/pages/PublicComponent/EmergencyCommand';

import dataVPublic from '@/pages/style/dataV.less';
import style from './index.less';
import logo from '@/assets/dataV/logo.png';

let stompClient = null;

class Index extends PureComponent {
  state = {
    socketMsg: '',
  };

  componentDidMount() {
    // this.connection();
  }

  componentWillUnmount() {
    if (stompClient) {
      try {
        stompClient.disconnect();
      } catch (error) {}
      stompClient = null;
    }
  }

  onMessage = msg => {
    // console.log(msg.body); // msg.body存放的是服务端发送给我们的信息
    const m = JSON.parse(msg.body);
    // let newData = m.data;
    // newData.id = new Date().getTime();
    // const list = [newData, ...this.state.dataList.list];
    // if (list.length > 10) {
    //   list.splice(9, 10);
    // }
    // if (m.key === 1) {
    //   this.setState({ tipMsg: m.msg });
    // }
    // this.setState({
    //   dataList: {
    //     list: list,
    //     pagination: {},
    //   },
    // });
  };

  connection = () => {
    // const { currentUser } = this.props;
    const socket = new SockJS(socketUrl);
    stompClient = Stomp.over(socket);
    const headers = {
      Authorization: '',
    };
    stompClient.debug = null;
    // 向服务器发起websocket连接
    stompClient.connect(
      headers,
      () => {
        stompClient.subscribe('/topic/roadProductionTrouble', this.onMessage);
      },
      err => {
        console.log('失败');
        console.log(err);
        // this.connection();
      },
    );
  };

  render() {
    const { socketMsg } = this.state;
    return (
      <FullScreenContainer>
        <div className={dataVPublic.main}>
          <div className={dataVPublic.header}>
            <div className={dataVPublic.logo}>
              <img src={logo} alt="" />
            </div>
            <div className={dataVPublic.title}>综合交通执法管理平台</div>
            <div className={dataVPublic.btns}>
              {/* <div className={dataVPublic.btn}>
                <Link to="/visualization">路政</Link>
              </div>
              <div className={dataVPublic.btn}>
                <Link to="/maritimeDataV">海事</Link>
              </div>
              <div className={dataVPublic.btn}>
                <Link to="/conserveDataV">养护</Link>
              </div>
              <div className={dataVPublic.btn}>
                <Link to="/transportDataV">运政</Link>
              </div> */}
            </div>
          </div>
          <div className={dataVPublic.chartMain}>
            <div className={dataVPublic.leftContainer}>
              <div className={style.leftContainerTop}>
                <CompanyScoreChart />
              </div>
              <div className={style.leftContainerCenter}>
                <WaterChart />
              </div>
              <div className={style.leftContainerBottom}>
                <EquipmentChart />
              </div>
            </div>
            <div className={dataVPublic.centerContainer}>
              <div className={style.centerContainerTop}>
                <MapChart />
              </div>
              <div className={style.centerContainerBottom}>
                <div className={style.socketmsg}>
                  {socketMsg}
                  {/* 四川省绵阳市江油市彰明
                  <span>某某路波形护栏缺损存在安全隐患</span> */}
                </div>
                <RoadWorkOrdesChart />
              </div>
            </div>
            <div className={dataVPublic.rightContainer}>
              <div className={style.rightContainerTop}>
                <MaintainChart />
              </div>
              <div className={style.rightContainerBottom}>
                <EmergencyCommand type={-2} />
              </div>
            </div>
          </div>
        </div>
      </FullScreenContainer>
    );
  }
}

export default Index;
