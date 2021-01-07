import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';

import { Button, Form, Modal } from 'antd';

import StandardTable from '@/components/StandardTable';
import styles from '../style/style.less';
import themeStyle from '@/pages/style/theme.less';

@connect(({ Company, loading }) => ({
  Company,
  loading: loading.models.Company,
}))
@Form.create()
class CompanyModal extends PureComponent {
  static defaultProps = {
    handleCompanyModalVisible: () => {},
  };

  state = {
    pageBean: {
      page: 1,
      pageSize: 10,
      showTotal: true,
    },
  };

  columns = [
    {
      title: '企业名称',
      dataIndex: 'companyName',
    },
    {
      title: '企业号码',
      dataIndex: 'companyPhone',
    },
    {
      title: '地址',
      dataIndex: 'address',
    },
    {
      title: '选择',
      width: 50,
      render: (text, record) => (
        <Fragment>
          <Button
            type="primary"
            icon="plus-circle"
            size="small"
            shape="circle"
            onClick={() => this.selectTable(record)}
          />
        </Fragment>
      ),
    },
  ];

  selectTable = res => {
    const { selectTableRow } = this.props;
    selectTableRow(res);
  };

  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Company/fetch',
      payload: params,
    });
  };

  componentDidMount() {
    const { pageBean } = this.state;
    this.getList({ pageBean });
  }

  handleStandardTableChange = pagination => {
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
    const {
      Company: { data },
      modalVisible,
      handleCompanyModalVisible,
      loading,
    } = this.props;
    return (
      <Modal
        destroyOnClose
        title="货运企业"
        visible={modalVisible}
        className={themeStyle.myModal + ' ' + themeStyle.modalbody}
        onCancel={() => handleCompanyModalVisible()}
        width={800}
        footer={null}
      >
        <div className={themeStyle.detailMsg}>
          <div style={{ padding: 20 }}>
            <StandardTable
              rowKey="id"
              size="middle"
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
    );
  }
}

export default CompanyModal;
