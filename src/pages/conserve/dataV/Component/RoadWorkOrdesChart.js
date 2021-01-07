import React from 'react';
import { connect } from 'dva';
import { Empty } from 'antd';
import { BorderBox6, Loading, ScrollBoard } from '@jiaminghi/data-view-react';

import dataVPublic from '@/pages/style/dataV.less';
import style from '../index.less';

const statMap = ['', '已派出', '已完成'];

@connect(({ RoadWorkOrdes, loading }) => ({
  RoadWorkOrdes,
  loading: loading.models.RoadWorkOrdes,
}))
class RoadWorkOrdesChart extends React.Component {
  state = {
    data: [],
  };

  componentDidMount() {
    this.getList();
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  getList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'RoadWorkOrdes/fetch',
      payload: {
        pageBean: { page: 1, pageSize: 15, showTotal: true },
      },
      callback: () => {
        this.setData();
      },
    });
  };

  setData = () => {
    const {
      RoadWorkOrdes: {
        data: { list },
      },
    } = this.props;
    if (list && list.length) {
      const data = this.formatData(list);
      this.setState({ data });
    }
  };

  formatData = list => {
    return list.map(item => [
      `<span style="color:#01D4F9"  title='${item.curingAddr}'>${item.curingAddr || ''}</span>`,
      `<span style="color:#01D4F9">${item.createTime}</span>`,
      `<span style="color:#01D4F9" title='${item.curingContent}'>${item.curingContent}</span>`,
      `<span style="color:#01D4F9" title='${item.companyName}'>${item.companyName}</span>`,
      `<span style="color:#01D4F9">${statMap[item.state]}</span>`,
    ]);
  };

  renderScrollBoard = () => {
    const { data } = this.state;
    return data.length ? (
      <ScrollBoard
        config={{
          header: ['所在位置', '上报时间', '养护原因', '养护公司', '养护状态'],
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

  render() {
    const { loading } = this.props;
    return (
      <div className={style.problemList}>
        <BorderBox6>
          {loading ? (
            <Loading>
              <span style={{ color: '#fff' }}>Loading...</span>
            </Loading>
          ) : (
            this.renderScrollBoard()
          )}
        </BorderBox6>
      </div>
    );
  }
}

export default RoadWorkOrdesChart;
