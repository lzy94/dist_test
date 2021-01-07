import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Empty } from 'antd';
import { ScrollBoard, BorderBox7, Loading } from '@jiaminghi/data-view-react';

import dataVPublic from '@/pages/style/dataV.less';
import style from '../index.less';

@connect(({ MaritimeDataV, loading }) => ({
  MaritimeDataV,
  loading: loading.models.MaritimeDataV,
}))
class FocusChart extends PureComponent {
  state = {
    data: {
      seaPortInfo: [],
      seaShips: [],
    },
  };

  componentDidMount() {
    this.getList();
  }

  getList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'MaritimeDataV/focusList',
      callback: data => {
        this.setData(data);
      },
    });
  };

  setData = list => {
    const data = this.formatData(list);
    this.setState({ data });
  };

  formatData = list => {
    const seaPortInfo = list.seaPortInfo.map(item => [
      `<span style="color:#01D4F9">${item.id}</span>`,
      `<span style="color:#01D4F9" title='${item.portName}'>${item.portName}</span>`,
      `<span style="color:#01D4F9" title='${item.changer}'>${item.changer}</span>`,
    ]);

    const seaShips = list.seaShips.map(item => [
      `<span style="color:#01D4F9">${item.id_}</span>`,
      `<span style="color:#01D4F9" title='${item.shipCode}'>${item.shipCode}</span>`,
      `<span style="color:#01D4F9" title='${item.shipLeader}'>${item.shipLeader}</span>`,
    ]);

    return { seaPortInfo, seaShips };
  };

  scrollUtil = (data, header = []) => {
    return data.length ? (
      <ScrollBoard
        config={{
          header,
          data,
          headerBGC: '',
          oddRowBGC: '',
          evenRowBGC: '',
          waitTime: '3000',
        }}
        style={{ width: '100%', height: '100%' }}
      />
    ) : (
      <Empty className={dataVPublic.empty} image={Empty.PRESENTED_IMAGE_SIMPLE} />
    );
  };

  renderScrollBoard = () => {
    const {
      data: { seaPortInfo, seaShips },
    } = this.state;
    return (
      <div className={style.itemMain}>
        <div className={style.item}>
          {this.scrollUtil(seaPortInfo, ['关注序列', '港口名称', '负责人'])}
        </div>
        <div className={style.item}>
          {this.scrollUtil(seaShips, ['关注序列', '船只名称', '负责人'])}
        </div>
      </div>
    );
  };

  render() {
    const { loading } = this.props;
    return (
      <div className={style.leftContainerBottomBottom}>
        <div className={dataVPublic.itemTitle}>重点关注</div>
        <div className={dataVPublic.chartPanel}>
          <BorderBox7 color={['#019EFF']}>
            {loading ? (
              <Loading>
                <span style={{ color: '#fff' }}>Loading...</span>
              </Loading>
            ) : (
              this.renderScrollBoard()
            )}
          </BorderBox7>
        </div>
      </div>
    );
  }
}

export default FocusChart;
