import React, { PureComponent } from 'react';

import { Modal, Card, Form, Button, Skeleton } from 'antd';
import CarDetail from '@/pages/traffic/lawment/dynamic/components/ArchiveModal/CarDetail';
// import CaseDetail from './CaseDetail';
import CaseDetail from '@/pages/traffic/lawment/dynamic/components/ArchiveModal/CaseDetail';
import { connect } from 'dva';
import moment from 'moment';
// import publicCss from '../../../../style/public.less';
// import {checkAuth} from '@/utils/utils';
// import TemplateModal from '../base/printModal';

// const authority = ['/lawment/dynamic/casehand/focusData', '/lawment/dynamic/casehand/getFilePrint'];
// import FocusDataModal from '../base/index';
import themeStyle from '@/pages/style/theme.less';

const tabList = [
  {
    key: 'car',
    tab: '车辆详细信息',
  },
  {
    key: 'case',
    tab: '案件登记信息',
  },
];

@connect(({ DynamicLaw, loading }) => ({
  DynamicLaw,
  loading: loading.models.DynamicLaw,
}))
@Form.create()
class Index extends PureComponent {
  static defaultProps = {
    handleModalVisible: () => {},
  };

  state = {
    key: 'car',
    caseDetail: {},
    carDetail: {},
    // focusDataVisible: false,
    // templateVisible: false,
  };

  componentDidMount() {
    this.getOvertruckRegisterInfo();
    this.getLawCase();
  }

  // 获取案件信息
  getLawCase = () => {
    const { dispatch, previewCode } = this.props;
    dispatch({
      type: 'DynamicLaw/getLawCase',
      payload: { previewCode },
      callback: res => {
        if (res) {
          this.setState({ caseDetail: res });
        }
      },
    });
  };

  getOvertruckRegisterInfo = () => {
    const { dispatch, previewCode } = this.props;
    dispatch({
      type: 'DynamicLaw/busDynamicLawDataByPreviewCode',
      payload: { previewCode },
      callback: res => {
        if (res) {
          this.setState({ carDetail: res });
        }
      },
    });
  };

  onTabChange = e => {
    this.setState({ key: e });
  };

  renderContent = key => {
    const { previewCode } = this.props;
    const { caseDetail, carDetail } = this.state;
    let template = '';
    switch (key) {
      case 'car':
        template = <CarDetail previewCode={previewCode} detail={carDetail} />;
        break;
      case 'case':
        template = <CaseDetail previewCode={previewCode} detail={caseDetail} />;
        break;
      default:
        template = '';
    }
    return template;
  };

  modalTitle = () => {
    const { carDetail } = this.state;
    const style = {
      color: '#fff',
      marginLeft: 5,
    };
    const busDynamicLawDate = carDetail.busDynamicLawDate || {};
    return (
      <div className={themeStyle.modalHeader}>
        <div className={themeStyle.title}>
          <span className={themeStyle.value}>{busDynamicLawDate.carNo}</span>
          <span className={themeStyle.time}>
            {moment(busDynamicLawDate.previewTime).format('YYYY-M-D HH:mm:ss')}
          </span>
        </div>
        {/*<div>*/}
        {/*  {checkAuth(authority[0]) ? <Button*/}
        {/*    style={{background: '#f1a325', borderColor: '#f1a325', ...style}}*/}
        {/*    onClick={() => this.focusDataClick()}*/}
        {/*  >*/}
        {/*    重点关注*/}
        {/*  </Button> : null}*/}
        {/*  {checkAuth(authority[1]) ?*/}
        {/*    <Button className={publicCss.import} style={{...style}}*/}
        {/*            onClick={() => this.handleTemplateVisible(true)}>打印预览</Button> : null}*/}
        {/*</div>*/}
      </div>
    );
  };

  // focusDataClick = () => {
  //   this.handleModalVisible(true);
  // };

  modalSuccess = () => {
    const { handleModalVisible } = this.props;
    handleModalVisible();
  };

  // handleModalVisible = flag => {
  //   this.setState({focusDataVisible: !!flag});
  // };
  //
  // handleTemplateVisible = flag => {
  //   this.setState({templateVisible: !!flag});
  // };

  render() {
    const { handleModalVisible, modalVisible, loading, previewCode } = this.props;
    const { key, carDetail, focusDataVisible, templateVisible } = this.state;
    // const focusDataMethods = {
    //   handleModalVisible: this.handleModalVisible,
    //   detail: carDetail,
    //   modalSuccess: this.modalSuccess,
    // };
    // const templateMethods = {
    //   previewCode: previewCode,
    //   handleModalVisible: this.handleTemplateVisible,
    // };
    return (
      <Modal
        destroyOnClose
        title={this.modalTitle()}
        visible={modalVisible}
        onCancel={() => handleModalVisible()}
        width={1150}
        footer={null}
        // className={publicCss.tabCar}
        className={themeStyle.modalStyle}
      >
        <Card
          bordered={false}
          tabList={tabList}
          activeTabKey={key}
          bodyStyle={{ padding: 0 }}
          onTabChange={this.onTabChange}
          headStyle={{ padding: 0, margin: '0 24px' }}
        >
          <Skeleton loading={loading}>
            {JSON.stringify(carDetail) !== '{}' ? this.renderContent(key) : null}
          </Skeleton>
        </Card>
        {/*{focusDataVisible ? (*/}
        {/*  <FocusDataModal {...focusDataMethods} modalVisible={focusDataVisible}/>*/}
        {/*) : null}*/}
        {/*{templateVisible ? <TemplateModal {...templateMethods} modalVisible={templateVisible}/> : null}*/}
      </Modal>
    );
  }
}

export default Index;
