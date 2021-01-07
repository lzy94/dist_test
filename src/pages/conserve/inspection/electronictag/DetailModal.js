import React, { PureComponent } from 'react';
import { Modal, Form, Tooltip } from 'antd';
import { connect } from 'dva';
import themeStyle from '@/pages/style/theme.less';
import styles from '@/pages/style/style.less';
import StandardTable from '@/components/StandardTable';

/* eslint react/no-multi-comp:0 */
@connect(({ Electronictag, loading }) => ({
  Electronictag,
  loading: loading.models.Electronictag,
}))

@Form.create()
class DetailModal extends PureComponent {

  columns = [{
    title: '编号',
    dataIndex: 'productionCode',
  }, {
    title: '名称',
    dataIndex: 'productionName',
  }, {
    title: '所属分类',
    dataIndex: 'categoryName',
  }, {
    title: '所属路段',
    dataIndex: 'roadName',
  }, {
    title: '地址',
    dataIndex: 'addr',
    render: val => val.length > 10 ? <Tooltip title={val}>{val.substring(0, 10) + '...'}</Tooltip> : val,
  }, {
    title: '领导',
    dataIndex: 'leadingCadre',
  }, {
    title: '联系电话',
    dataIndex: 'leadingTel',
  }];

  componentDidMount() {
    const { codes } = this.props;
    try {
      this.getList(JSON.parse(codes).join());
    } catch (e) {
      this.getList(codes.replace('[', '').replace(']', ''));
    }
  }


  getList = codes => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Electronictag/detail',
      payload: { codes },
    });
  };


  render() {
    const {
      Electronictag: {
        detailList,
      }, modalVisible, handleModalVisible, loading,
    } = this.props;
    return (
      <Modal
        destroyOnClose
        title="缺失标签"
        className={themeStyle.myModal}
        visible={modalVisible}
        width={1200}
        onCancel={() => handleModalVisible()}
        footer={null}
      >
        <div className={styles.tableList}>
          <StandardTable
            rowKey='id'
            size="middle"
            tableAlert={false}
            selectedRows={0}
            rowSelection={null}
            loading={loading}
            data={detailList}
            columns={this.columns}
            pagination={false}
          />
        </div>
      </Modal>
    );
  }

}


export default DetailModal;
