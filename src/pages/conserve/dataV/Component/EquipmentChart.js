import React from 'react';
import { connect } from 'dva';
import { Empty } from 'antd';
import { BorderBox12, BorderBox7, Loading, ScrollBoard } from '@jiaminghi/data-view-react';

import dataVPublic from '@/pages/style/dataV.less';
import style from '../index.less';

@connect(({ ConserveDataV, loading }) => ({
  ConserveDataV,
  loading: loading.models.ConserveDataV,
}))
class EquipmentChart extends React.Component {
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
      type: 'ConserveDataV/electroLabel',
      callback: list => {
        this.setData(list);
      },
    });
  };

  setData = list => {
    if (list.length) {
      const data = this.formatData(list);
      this.setState({ data });
    }
  };

  formatData = list => {
    return list.map(item => [
      `<span style="color:#01D4F9">${item.productionCode}</span>`,
      `<span style="color:#01D4F9">${item.productionName}</span>`,
      `<span style="color:#01D4F9" title='${item.addr}'>${item.addr}</span>`,
      `<span style="color:#01D4F9">${item.categoryName}</span>`,
    ]);
  };

  renderScrollBoard = () => {
    const { data } = this.state;
    return data.length ? (
      <ScrollBoard
        config={{
          header: ['编号', '名称', '路段', '类型'],
          data,
          headerBGC: '',
          oddRowBGC: '',
          evenRowBGC: '',
          waitTime: '3000',
          columnWidth: [80],
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
      <BorderBox12 color={['#48A2B3']}>
        <div className={dataVPublic.itemTitle}>设备信息</div>
        <div className={style.chartPanel}>
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
      </BorderBox12>
    );
  }
}
export default EquipmentChart;
