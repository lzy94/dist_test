import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Empty } from 'antd';
import { BorderBox12, ScrollBoard, BorderBox7, Loading } from '@jiaminghi/data-view-react';

import dataVPublic from '@/pages/style/dataV.less';

@connect(({ TransportDataV, loading }) => ({
  TransportDataV,
  loading: loading.models.TransportDataV,
}))
class CompanyInfo extends PureComponent {
  state = {
    data: [],
  };

  componentDidMount() {
    this.getList();
  }

  getList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'TransportDataV/corporateInfo',
      callback: data => {
        this.formatData(data);
      },
    });
  };

  formatData = list => {
    const data = list.map(item => [
      `<span style="color:#01D4F9" title='${item.companyName}'>${item.companyName}</span>`,
      `<span style="color:#01D4F9">${item.carNumber}</span>`,
      `<span style="color:#01D4F9">${item.staffNumber}</span>`,
      `<span style="color:#01D4F9">${item.concacts}</span>`,
      `<span style="color:#01D4F9" title='${item.concactsTel}'>${item.concactsTel}</span>`,
    ]);
    this.setState({ data });
  };

  renderScrollBoard = () => {
    const { data } = this.state;
    return data.length ? (
      <ScrollBoard
        config={{
          header: ['企业名称', '车辆数量', '员工数量', '负责人', '联系电话'],
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
      <BorderBox12 color={['#48A2B3']}>
        <div className={dataVPublic.itemTitle}>企业信息</div>
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

export default CompanyInfo;
