import React, { Fragment, PureComponent } from 'react';
import { Modal, Empty, message } from 'antd';
import { connect } from 'dva';

import StandardTable from '@/components/StandardTable';
import AddCompanyRoadModal from './addCompanyRoad';

import themeStyle from '@/pages/style/theme.less';
import style from '../index.less';

/* eslint react/no-multi-comp:0 */
@connect(({ ConserveCompany, RoadInfo, loading }) => ({
  RoadInfo,
  loading: loading.models.RoadInfo,
  ConserveCompany,
  conLoading: loading.models.ConserveCompany,
}))
class CompanyRoadConserveModal extends PureComponent {

  state = {
    addModalVisible: false,
    baseOrgan: [],
    roadInfos: [],
    roadID: '',
    roadName: '',
    pageBean: { 'page': 1, 'pageSize': 10, 'showTotal': true },
  };


  columns = [
    {
      title: '公路名称',
      dataIndex: 'roadName',
    },
    {
      title: '公路编号',
      dataIndex: 'roadCode',
    },
    {
      title: '里程（km）',
      dataIndex: 'roadMileage',
    },
    {
      title: '起始地',
      dataIndex: 'startAddr',
    },
    {
      title: '结束地',
      dataIndex: 'endAddr',
    },
    {
      title: '操作',
      width: 90,
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.showAddModal(record)}>添加</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { pageBean } = this.state;
    const organId = localStorage.getItem('organId');
    const baseOrgan = [{
      property: 'organCode',
      value: organId,
      group: 'main',
      operation: 'RIGHT_LIKE',
      relation: 'AND',
    }];
    this.setState({ baseOrgan });
    this.getList({
      pageBean,
      'querys': baseOrgan,
    });

    this.getRoadInfos();
  }

  showAddModal = record => {
    this.setState({ roadID: record.id, roadName: record.roadName }, () => this.handleAddModalVisible(true))
    ;
  };

  handleAddModalVisible = flag => {
    this.setState({ addModalVisible: !!flag });
  };


  getList = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'RoadInfo/fetch',
      payload: params,
    });
  };

  modalSuccess = () => {
    this.getRoadInfos();
  };

  getRoadInfos = () => {
    const { dispatch, companyID } = this.props;
    dispatch({
      type: 'ConserveCompany/getRoadInfosData',
      payload: companyID,
      callback: roadInfos => {
        this.setState({ roadInfos });
      },
    });
  };

  removeRoad = id => {


    Modal.confirm({
      title: '提示',
      content: '是否删除？',
      onOk: () => {
        const { dispatch } = this.props;
        dispatch({
          type: 'ConserveCompany/deleteCompanyRoadConserveByIdData',
          payload: { id },
          callback: () => {
            message.success('删除成功');
            this.getRoadInfos();
          },
        });
      },
    });


  };

  renderSelectRoadList = () => {
    const { roadInfos } = this.state;
    if (!roadInfos.length) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>;

    return roadInfos.map((item, i) => <li key={i}>
      <h3>{item.roadName}</h3>
      <p>起点：{item.startAddr}</p>
      <p>终点：{item.endAddr}</p>
      <p>里程：{item.roadMileage}km</p>
      <p>
        内容：{item.content}
      </p>
      <a onClick={() => this.removeRoad(item.id_)}>移除</a>
    </li>);
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { formValues } = this.state;
    const params = {
      pageBean: {
        page: pagination.current,
        pageSize: pagination.pageSize,
        showTotal: true,
      },
      querys: formValues,
    };
    this.getList(params);
  };

  render() {
    const { RoadInfo: { data }, companyName,modalVisible, handleModalVisible, loading, companyID } = this.props;
    const { addModalVisible, roadID, roadName } = this.state;

    const parseMothed = {
      companyID,
      roadID,
      roadName,
      modalSuccess: this.modalSuccess,
      handleModalVisible: this.handleAddModalVisible,
    };
    return (
      <Fragment>
        <Modal
          destroyOnClose
          title="查看添加养护公路"
          className={themeStyle.formModal + ' ' + style.readModal}
          visible={modalVisible}
          width={1200}
          onCancel={() => handleModalVisible()}
          footer={null}
        >
          <div className={style.content}>
            <div className={style.leftList}>
              <h3 className={style.header}><span></span>已选公路路段</h3>
              <div style={{ height: 540, overflowY: 'auto' }}>
                <ul className={style.selectRoadList}>
                  {this.renderSelectRoadList()}
                </ul>
                <p className={style.companyName}><span></span>{companyName}</p>
              </div>
            </div>
            <div className={style.rightList}>
              <h3 className={style.header+' '+style.listHeader}><span></span>可选公路路段</h3>
              <StandardTable
                size="middle"
                tableAlert={false}
                selectedRows={0}
                rowSelection={null}
                loading={loading}
                data={data}
                columns={this.columns}
                onChange={this.handleStandardTableChange}
              />
            </div>
          </div>
        </Modal>
        {addModalVisible ? <AddCompanyRoadModal {...parseMothed} modalVisible={addModalVisible}/> : null}
      </Fragment>
    );
  }

}

export default CompanyRoadConserveModal;
