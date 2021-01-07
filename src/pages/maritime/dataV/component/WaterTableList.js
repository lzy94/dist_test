import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Empty } from 'antd';
import { ScrollBoard, BorderBox6, Loading } from '@jiaminghi/data-view-react';

import dataVPublic from '@/pages/style/dataV.less';

@connect(({ MaritimePoint, loading }) => ({
  MaritimePoint,
  loading: !!loading.models.MaritimePoint,
}))
class WaterTableList extends PureComponent {
  state = {
    data: [],
    oldList: [],
  };

  componentDidUpdate(prevProps, prevState) {
    const {
      MaritimePoint: {
        data: { list },
      },
    } = prevProps;
    const { oldList } = prevState;
    if (JSON.stringify(oldList) !== JSON.stringify(list)) {
      this.initData(list);
    }
  }

  initData = list => {
    const data = list.map(item => {
      const time = item.waterOnitoringPointData
        ? moment(item.waterOnitoringPointData.createTime).format('YYYY-MM-DD HH:mm')
        : '';
      const waterLevel = item.waterOnitoringPointData ? item.waterOnitoringPointData.waterLevel : 0;
      const cc = item.warningHigh - waterLevel;
      return [
        `<span title='${item.addr}'>${item.addr}</span>`,
        `<span title='${time}'>${time}</span>`,
        `<span>${waterLevel}</span>`,
        `<span >${item.warningHigh}</span>`,
        cc < 0 ? `<span style="color:#EC2B63">${cc}</span>` : '无异常',
      ];
    });
    this.setState({ data, oldList: list });
  };

  renderScroll = () => {
    const { data } = this.state;
    return data.length ? (
      <ScrollBoard
        config={{
          header: ['检测地点', '检测时间', '当前水位', '预警水位', '超出水位'],
          data,
          headerBGC: '',
          oddRowBGC: '',
          evenRowBGC: '',
          waitTime: '3000',
          columnWidth: [200, 170],
        }}
        style={{ width: '100%', height: '100%' }}
      />
    ) : (
      <Empty className={dataVPublic.empty} image={Empty.PRESENTED_IMAGE_SIMPLE} />
    );
  };

  render() {
    const { loading } = this.props;
    return (
      <BorderBox6>
        {/* {loading ? (
          <Loading>
            <span style={{ color: '#fff' }}>Loading...</span>
          </Loading>
        ) : ( */}
        {this.renderScroll()}
        {/* )} */}
      </BorderBox6>
    );
  }
}

export default WaterTableList;
