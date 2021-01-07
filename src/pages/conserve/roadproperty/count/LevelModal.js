import React, { PureComponent } from 'react';
import { Modal, Descriptions } from 'antd';
import themeStyle from '@/pages/style/theme.less';


export default class LevelModal extends PureComponent {

  static defaultProps = {
    detail: {},
    modalVisible: false,
    handleModalVisible: () => {
    },
  };


  render() {
    const { modalVisible, handleModalVisible, detail } = this.props;
    return (
      <Modal
        destroyOnClose
        title="预警"
        className={themeStyle.formModal}
        visible={modalVisible}
        // width={1000}
        footer={null}
        onCancel={() => handleModalVisible()}
      >



      </Modal>
    );
  }

}
