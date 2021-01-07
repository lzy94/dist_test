import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Empty } from 'antd';
import { BorderBox12, BorderBox7, ScrollBoard, Loading } from '@jiaminghi/data-view-react';
import { planRank } from '@/utils/dictionaries';
import dataVPublic from '@/pages/style/dataV.less';

const statusMap = ['新建', '已派', '处理中', '已完成'];

@connect(({ Emergency, loading }) => ({
  Emergency,
  loading: loading.models.Emergency,
}))
class EmergencyCommand extends PureComponent {
  state = {
    data: [],
    oldList: [],
  };

  componentDidMount() {
    this.getList();
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      Emergency: {
        dataList: { list },
      },
    } = prevProps;
    const { oldList } = prevState;

    if (JSON.stringify(list) !== JSON.stringify(oldList)) {
      this.formatData(list);
    }
  }

  getList = () => {
    const { dispatch, type } = this.props;
    dispatch({
      type: 'Emergency/fetch',
      payload: {
        pageBean: { page: 1, pageSize: 10, showTotal: true },
        querys: [
          {
            group: 'main',
            operation: 'IN',
            property: 'planObject',
            relation: 'AND',
            value: [type],
          },
        ],
      },
    });
  };

  formatData = list => {
    this.setState({ oldList: list });
    const data = list.map(item => {
      const name = /_/.test(item.createdBy) ? item.createdBy.split('_')[1] || '' : '';
      return [
        `<span style="color:#01D4F9" title='${item.workContent || ''}'>${item.workContent ||
          ''}</span>`,
        `<span style="color:#01D4F9" title='${name}'>${name}</span>`,
        `<span style="color:#01D4F9">${item.categoryName}</span>`,
        `<span style="color:#01D4F9">${planRank[item.emergencyLevel - 1]}</span>`,
        `<span style="color:#01D4F9">${statusMap[item.state - 1]}</span>`,
      ];
    });
    this.setState({ data });
  };

  renderScrollBoard = () => {
    const { data } = this.state;
    return data.length ? (
      <ScrollBoard
        config={{
          header: ['上报内容', '创建人', '类型', '等级', '状态'],
          data,
          headerBGC: '',
          oddRowBGC: '',
          evenRowBGC: '',
          waitTime: '3000',
          columnWidth: [180],
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
        <div className={dataVPublic.itemTitle}>应急指挥</div>
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
      </BorderBox12>
    );
  }
}

export default EmergencyCommand;
