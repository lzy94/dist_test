import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Modal, Card, Form, Button, Skeleton, message } from 'antd';

import CarDetail from './CarDetail';
import CaseDetail from './CaseDetail';
import { checkAuth } from '@/utils/utils';
import TemplateModal from '../base/printModal';
import LawCaseReturnModal from '../base/LawCaseReturnModal';

import themeStyle from '@/pages/style/theme.less';

const authority = [
  '/lawment/dynamic/casehand/lawCaseRevoke',
  '/lawment/dynamic/casehand/getFilePrint',
];

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
    detailID: '',
    carDetail: {},
    templateVisible: false,
    lawCaseRevokeVisible: false,
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
          this.setState({ carDetail: res, detailID: res.busDynamicLawDate.id });
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
        <div>
          {/* {checkAuth(authority[0]) ? (
            <Button
              style={{ background: '#f1a325', borderColor: '#f1a325', ...style }}
              onClick={() => this.handLawCaseRevokeVisible(true)}
            >
              退回重审
            </Button>
          ) : null} */}
          {checkAuth(authority[1]) ? (
            <Button
              style={{ background: '#38b03f', color: '#fff', marginLeft: 5 }}
              onClick={() => this.handleTemplateVisible(true)}
            >
              打印预览
            </Button>
          ) : null}
        </div>
      </div>
    );
  };

  modalSuccess = () => {
    const { handleModalVisible, modalSuccess } = this.props;
    handleModalVisible();
    modalSuccess();
  };

  handLawCaseRevokeVisible = flag => {
    this.setState({ lawCaseRevokeVisible: !!flag });
  };

  handleTemplateVisible = flag => {
    const {
      RPType: { reviewerConfirm, principalConfirm },
    } = this.props;
    if (!reviewerConfirm || !principalConfirm) {
      message.error('案卷未确认，无法打印模板');
    } else {
      this.setState({ templateVisible: !!flag });
    }
  };

  render() {
    const { handleModalVisible, modalVisible, loading, previewCode } = this.props;
    const {
      key,
      caseDetail,
      carDetail,
      templateVisible,
      lawCaseRevokeVisible,
      detailID,
    } = this.state;
    const templateMethods = {
      organCode: caseDetail.organCode,
      previewCode,
      carNo: Object.keys(carDetail).length ? carDetail.busDynamicLawDate.carNo : '',
      handleModalVisible: this.handleTemplateVisible,
    };

    const LawCaseReturnMethods = {
      handleModalVisible: this.handLawCaseRevokeVisible,
      modalSuccess: this.modalSuccess,
      detailID,
    };

    return (
      <Modal
        destroyOnClose
        title={this.modalTitle()}
        visible={modalVisible}
        onCancel={() => handleModalVisible()}
        width={1150}
        footer={null}
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
        {templateVisible && <TemplateModal {...templateMethods} modalVisible={templateVisible} />}
        {lawCaseRevokeVisible && (
          <LawCaseReturnModal {...LawCaseReturnMethods} modalVisible={lawCaseRevokeVisible} />
        )}
      </Modal>
    );
  }
}

export default Index;
