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
class CompanyScoreChart extends React.Component {
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
      type: 'ConserveDataV/companyScore',
      callback: list => {
        this.setData(list);
      },
    });
  };

  setData = list => {
    if (Object.keys(list).length) {
      const { examineList, stateList } = list;
      if (examineList.length && stateList.length) {
        const data = this.formatData(examineList, stateList);
        this.setState({ data });
      }
    }
  };

  formatData = (examineList, stateList) => {
    const data = [];
    for (let i = 0; i < stateList.length; i += 1) {
      const item = [
        stateList[i].COMPANY_NAME,
        `${stateList[i].COMPLETED}`,
        `${stateList[i].UNDONE}`,
        `${stateList[i].TOTAL}`,
      ];
      for (let j = 0; j < examineList.length; j += 1) {
        if (stateList[i].COMPANY_ID === examineList[j].COMPANY_ID) {
          item.push(`${examineList[j].DEL_SCORE}`);
          break;
        }
      }
      data.push(item);
    }
    return data;
  };

  renderScrollBoard = () => {
    const { data } = this.state;
    return data.length ? (
      <ScrollBoard
        config={{
          header: ['公司名称', '完成', '未完成', '总数', '扣分'],
          data,
          headerBGC: '',
          oddRowBGC: '',
          evenRowBGC: '',
          waitTime: '3000',
          columnWidth: [200],
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
        <div className={dataVPublic.itemTitle}>企业评分</div>
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

export default CompanyScoreChart;
