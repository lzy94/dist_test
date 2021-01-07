import React, { PureComponent } from 'react';
import {
  FullScreenContainer,
  BorderBox12,
  BorderBox7,
  ScrollBoard,
} from '@jiaminghi/data-view-react';
import moment from 'moment';
import CompanyInfo from './component/CompanyInfo';
import OverLoadChart from './component/OverLoadChart';
import OverLoadScale from './component/OverLoadScale';
import ShaftTypeScale from './component/ShaftTypeScale';
import CompanyRank from './component/CompanyRank';
import EmergencyCommand from '@/pages/PublicComponent/EmergencyCommand';

import dataVPublic from '@/pages/style/dataV.less';
import style from './index.less';

import logo from '@/assets/dataV/logo.png';
import MapChart from './component/MapChart';

const data = [
  [
    '<span style="color:#01D4F9">川B05678</span>',
    '<span style="color:#01D4F9">25t</span>',
    '<span style="color:#01D4F9">0</span>',
    '<span style="color:#01D4F9">王安康</span>',
    '<span style="color:#01D4F9">王安康</span>',
    '<span style="color:#01D4F9">四川富临运业集团江油运输</span>',
    '<span style="color:#01D4F9">四川富临运业集团江油运输</span>',
  ],
  [
    '<span style="color:#01D4F9">川B05622</span>',
    '<span style="color:#01D4F9">40t</span>',
    '<span style="color:#01D4F9">10t</span>',
    '<span style="color:#01D4F9">王员</span>',
    '<span style="color:#01D4F9">王员</span>',
    '<span style="color:#01D4F9">四川富临运业集团江油运输</span>',
    '<span style="color:#01D4F9">四川富临运业集团江油运输</span>',
  ],
  [
    '<span style="color:#01D4F9">川Bas678</span>',
    '<span style="color:#01D4F9">35t</span>',
    '<span style="color:#01D4F9">5t</span>',
    '<span style="color:#01D4F9">李晓燕</span>',
    '<span style="color:#01D4F9">李晓燕</span>',
    '<span style="color:#01D4F9">四川富临运业集团江油运输</span>',
    '<span style="color:#01D4F9">四川富临运业集团江油运输</span>',
  ],
  [
    '<span style="color:#01D4F9">川Bwe567</span>',
    '<span style="color:#01D4F9">45t</span>',
    '<span style="color:#01D4F9">15t</span>',
    '<span style="color:#01D4F9">简自豪</span>',
    '<span style="color:#01D4F9">简自豪</span>',
    '<span style="color:#01D4F9">四川富临运业集团江油运输</span>',
    '<span style="color:#01D4F9">四川富临运业集团江油运输</span>',
  ],
  [
    '<span style="color:#01D4F9">川Bqs678</span>',
    '<span style="color:#01D4F9">50t</span>',
    '<span style="color:#01D4F9">20t</span>',
    '<span style="color:#01D4F9">周凯</span>',
    '<span style="color:#01D4F9">周凯</span>',
    '<span style="color:#01D4F9">四川东恒运输集团有限公司</span>',
    '<span style="color:#01D4F9">四川东恒运输集团有限公司</span>',
  ],
  [
    '<span style="color:#01D4F9">川B07856</span>',
    '<span style="color:#01D4F9">45t</span>',
    '<span style="color:#01D4F9">15t</span>',
    '<span style="color:#01D4F9">李凯</span>',
    '<span style="color:#01D4F9">李凯</span>',
    '<span style="color:#01D4F9">四川东恒运输集团有限公司</span>',
    '<span style="color:#01D4F9">四川东恒运输集团有限公司</span>',
  ],
];

class Index extends PureComponent {
  constructor(props) {
    super(props);
    this.timeInterval = null;
  }

  state = {
    time: moment().format('YYYY-MM-DD HH:mm'),
  };

  componentDidMount() {
    this.timeInterval = setInterval(() => {
      const time = moment().format('YYYY-MM-DD HH:mm');
      this.setState({ time });
    }, 60000);
  }

  componentWillUnmount() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  render() {
    const { time } = this.state;
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
              <div className={style.leftContainerBottom}>
                <CompanyInfo />
              </div>
              <div className={style.leftContainerTop}>
                <CompanyRank />
              </div>
            </div>
            <div className={`${dataVPublic.centerContainer} ${style.centerPad}`}>
              <div className={style.centerContainerTop}>
                {/* <h3>
                  {localStorage.getItem('addr') || '四川省'}
                  <small>{time}</small>
                </h3> */}
                <MapChart />
              </div>
              <div className={style.centerContainerBottom}>
                <div className={style.centerContainerBottomItem}>
                  <div className={dataVPublic.itemTitle}>超限比例</div>
                  <div className={dataVPublic.chartPanel}>
                    <OverLoadScale />
                  </div>
                </div>
                <div className={style.centerContainerBottomItem}>
                  <div className={dataVPublic.itemTitle}>车型占比</div>
                  <div className={dataVPublic.chartPanel}>
                    <ShaftTypeScale />
                  </div>
                </div>
              </div>
            </div>
            <div className={dataVPublic.rightContainer}>
              <div className={style.rightContainerTop}>
                <OverLoadChart />
                {/*  <BorderBox12 color={['#48A2B3']}>
                <div className={dataVPublic.itemTitle}>一超四罚</div>
                  <div className={dataVPublic.chartPanel}>
                    <BorderBox7 color={['#019EFF']}>
                      <ScrollBoard
                        config={{
                          header: ['车牌', '载重', '超重', '司机', '车主', '运输企业', '货运企业'],
                          data,
                          headerBGC: '',
                          oddRowBGC: '',
                          evenRowBGC: '',
                          waitTime: '3000',
                        }}
                        style={{ width: '100%', height: '100%' }}
                      />
                    </BorderBox7>
                  </div> </BorderBox12> */}
              </div>
              <div className={style.rightContainerBottom}>
                <EmergencyCommand type={-4} />
              </div>
            </div>
          </div>
        </div>
      </FullScreenContainer>
    );
  }
}
export default Index;
