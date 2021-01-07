import React, { Fragment } from 'react';
import { Modal, List, Card } from 'antd';

import themeStyle from '@/pages/style/theme.less';

const description = data => (
  <Fragment>
    <p style={{ margin: 0 }}>
      车辆类型：{data.vclTpNm || '-'}&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;车辆型号：
      {data.prdCdNm || '-'}
    </p>
    <p style={{ margin: 0 }}>车辆识别代码/车架号：{data.vin}</p>
    <p style={{ margin: 0 }}>
      核定载重量：{data.ldTn || '-'}&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;外廓尺寸(mm)：
      {data.vclLng || '-'}-{data.vclWdt || '-'}-{data.vclHgt || '-'}
      &nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;轴数：{data.vehicleAxis || '-'}
    </p>
  </Fragment>
);

const LicenseModal = props => {
  const { modalVisible, handleModalVisible, modalCallback, data } = props;

  return (
    <Modal
      destroyOnClose
      className={`${themeStyle.myModal} ${themeStyle.modalbody}`}
      title="选择行驶证"
      visible={modalVisible}
      footer={null}
      onCancel={() => handleModalVisible()}
    >
      <Card bordered={false}>
        <List
          itemLayout="horizontal"
          dataSource={data}
          renderItem={item => (
            <List.Item
              style={{ cursor: 'pointer', backgroundColor: '#fff' }}
              onClick={() => modalCallback(item)}
            >
              <List.Item.Meta
                title={
                  <Fragment>
                    车主/业户：{item.cmpNm || ''}
                    &nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;联系人手机：{item.vclWnrPhn}
                  </Fragment>
                }
                description={description(item)}
              />
            </List.Item>
          )}
        />
      </Card>
    </Modal>
  );
};

LicenseModal.defaultProps = {
  data: [],
  modalVisible: false,
  handleModalVisible: () => {},
  modalCallback: () => {},
};

export default LicenseModal;
