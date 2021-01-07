import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Icon, Modal, Skeleton } from 'antd';
import MyDyModalPublic from '@/components/MyDyModalPublic';
import themeStyle from '@/pages/style/theme.less';

@connect(({ TrafficApiV2BusData, loading }) => ({
  TrafficApiV2BusData,
  loading: loading.models.TrafficApiV2BusData,
}))
class ModalIndex extends PureComponent {
  static defaultProps = {
    handleModalVisible: () => {},
  };

  componentDidMount() {
    const { id } = this.props;
    this.getDetail(id);
  }

  getDetail = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'TrafficApiV2BusData/dyDataDetail',
      payload: id,
    });
  };

  render() {
    const {
      modalVisible,
      handleModalVisible,
      TrafficApiV2BusData: {
        dyDataDetail: { busDynamicLawDate },
      },
    } = this.props;

    const title = (
      <div className={themeStyle.modalHeader}>
        <div className={themeStyle.title}>
          <span className={themeStyle.value}>{busDynamicLawDate.carNo}</span>
          <span className={themeStyle.time}>
            {moment(busDynamicLawDate.previewTime).format('YYYY-M-D HH:mm:ss')}
          </span>
        </div>
        <div className={themeStyle.titleRight}>
          <div className={themeStyle.local} style={{ width: 'auto' }}>
            <Icon type="environment" />
            <a title={busDynamicLawDate.siteName}>{busDynamicLawDate.siteName}</a>
          </div>
        </div>
      </div>
    );
    return (
      <Modal
        destroyOnClose
        className={themeStyle.modalStyle}
        title={title}
        visible={modalVisible}
        onCancel={() => handleModalVisible()}
        width="1100px"
        footer={null}
      >
        {JSON.stringify(busDynamicLawDate) !== '{}' ? (
          <MyDyModalPublic detail={busDynamicLawDate} />
        ) : (
          <Skeleton active />
        )}
      </Modal>
    );
  }
}

export default ModalIndex;
