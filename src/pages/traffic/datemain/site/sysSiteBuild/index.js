import React, { Fragment, PureComponent } from 'react';
import {
  Button,
  Modal,
  Form,
  message,
  Input,
  Tooltip,
  Divider,
  Popconfirm,
  Row,
  Col,
  Upload,
  Icon,
  Spin,
} from 'antd';
import styles from '@/pages/style/style.less';
import StandardTable from '@/components/StandardTable';
import { connect } from 'dva';
import { getLocalStorage, fileUrl, pdfUrl, fileBeforeUpload } from '@/utils/utils';
import themeStyle from '@/pages/style/theme.less';

const FormItem = Form.Item;

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, fileList, fileChange } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleAdd(fieldsValue, () => form.resetFields());
    });
  };

  const uploadBase = {
    name: 'files',
    action: '/result/api/file/v1/fileUpload',
    accept: '.pdf,.doc,.docx',
    listType: 'picture',
    data: {
      type: 2,
      xbType: '',
    },
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    onChange: fileChange,
    beforeUpload: fileBeforeUpload,
  };

  return (
    <Modal
      destroyOnClose
      title="建设资料上传"
      className={themeStyle.formModal}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <div className={themeStyle.formModalBody}>
        <FormItem hasFeedback label="文件名称">
          {form.getFieldDecorator('fileName', {
            rules: [{ required: true, message: '请输入文件名称！' }],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem label="文件上传">
          {form.getFieldDecorator('filePath', {
            rules: [{ required: true, message: '请选择文件！' }],
          })(
            <Upload {...uploadBase}>
              {fileList.length >= 1 ? null : (
                <Button>
                  <Icon type="upload" /> 选择文件（请上传 ‘pdf’ 及 ‘doc’ 文件）
                </Button>
              )}
            </Upload>,
          )}
        </FormItem>
      </div>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ Site, loading, File }) => ({
  Site,
  File,
  loading: loading.models.Site,
}))
@Form.create()
class SiteBuildModal extends PureComponent {
  static defaultProps = {
    handleModalVisible: () => {},
  };

  state = {
    createModalVisible: false,
    downLoaing: false,
    uploadLoad: false,
    fileId: '',
    baseQuery: {},
    selectedRows: [],
    formValues: [],
    fileList: [],
    pageBean: {
      page: 1,
      pageSize: 10,
      showTotal: true,
    },
  };

  columns = [
    {
      title: '文件名称',
      dataIndex: 'fileName',
    },
    {
      title: '文件路径',
      dataIndex: 'filePath',
    },
    {
      title: '操作',
      width: 140,
      render: (text, record) => (
        <Fragment>
          <Tooltip placement="left" title="查看">
            <Button
              onClick={() => this.openPDF(record)}
              type="primary"
              shape="circle"
              icon="eye"
              size="small"
            />
          </Tooltip>
          <Divider type="vertical" />
          <Tooltip placement="left" title="下载">
            <Button
              onClick={() => this.downLoadFile(record)}
              type="primary"
              shape="circle"
              icon="download"
              size="small"
            />
          </Tooltip>
          <Divider type="vertical" />
          <Popconfirm
            title="是否删除数据?"
            onConfirm={() => this.dataDel(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Tooltip placement="left" title="删除">
              <Button type="danger" shape="circle" icon="delete" size="small" />
            </Tooltip>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { siteCode } = this.props;
    this.setState(
      {
        baseQuery: {
          group: 'main',
          hasInitValue: false,
          operation: 'EQUAL',
          property: 'siteCode',
          relation: 'AND',
          value: siteCode,
        },
      },
      () => {
        const { baseQuery, pageBean } = this.state;
        this.getList({ pageBean, querys: [baseQuery] });
      },
    );
  }

  downLoadFile = record => {
    const { dispatch } = this.props;
    this.setState({ downLoaing: true });
    dispatch({
      type: 'File/downLoad',
      payload: {
        id: record.fileId,
        fileName: record.fileName,
        extensionName: '.' + record.filePath.split('.')[1],
      },
      callback: () => {
        this.setState({ downLoaing: false });
      },
    });
  };

  dataDel = params => {
    this.delUtil(params);
  };

  batchDel = () => {
    const { selectedRows } = this.state;
    if (!selectedRows) return;
    const self = this;
    Modal.confirm({
      title: '批量删除',
      content: '您确定要批量删除吗?',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        self.delUtil(selectedRows.map(item => item.id).join());
      },
      onCancel() {},
    });
  };

  delUtil = ids => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Site/deleteSysSiteBuildMsg',
      payload: { ids },
      callback: () => {
        this.getList();
        this.setState({ selectedRow: [] });
      },
    });
  };

  openPDF = record => {
    this.setState({ downLoaing: true });
    const extensionName = record.filePath.split('.')[1];
    const { dispatch } = this.props;
    if (extensionName === 'pdf') {
      this.setState({ downLoaing: false });
      window.open(fileUrl + record.filePath, '_blank');
    } else {
      dispatch({
        type: 'File/preview',
        payload: {
          fileId: record.fileId,
        },
        callback: res => {
          if (!res) return;
          const paths = res.pdfUrl.split('/');
          const len = paths.length;
          const path = paths[len - 1];
          dispatch({
            type: 'File/preview_',
            payload: path,
            callback: res2 => {
              this.setState({ downLoaing: false });
              if (res2.code !== 200) {
                return message.error('文件读取失败！');
              }
              window.open(pdfUrl + res2.data, '_blank');
            },
          });
        },
      });
    }
  };

  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Site/getSysSiteBuild',
      payload: params,
    });
  };

  handleCreateModalVisible = flag => {
    this.setState({ createModalVisible: !!flag });
    if (!flag) {
      this.setState({ fileList: [] });
    }
  };

  handleFormReset = () => {
    const { form } = this.props;
    const { pageBean, baseQuery } = this.state;
    form.resetFields();
    this.setState({
      formValues: [],
      selectedRows: [],
    });
    this.getList({ pageBean, querys: [baseQuery] });
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { pageBean, baseQuery } = this.state;
      const values = {
        ...fieldsValue,
      };
      const objKeys = Object.keys(values);
      // 重新格式化条件数组
      const condition = objKeys.map(item => {
        return values[item]
          ? {
              property: item,
              value: values[item],
              group: 'main',
              operation: 'LIKE',
              relation: 'OR',
            }
          : '';
      });
      const conditionFilter = condition.filter(item => item);
      this.setState({
        formValues: conditionFilter,
      });
      this.getList({ pageBean, querys: [baseQuery].concat(conditionFilter) });
    });
  };

  handleAdd = (fields, callback) => {
    const { dispatch, siteCode } = this.props;
    const { baseQuery, pageBean, fileId, fileList } = this.state;
    if (!fileList.length) return message.error('请选择文件');
    fields.siteCode = siteCode;
    const filePath = fields.filePath.file.response;
    fields.filePath = filePath ? filePath.filePath : '';
    fields.fileId = fileId;

    dispatch({
      type: 'Site/addSysSiteBuildMsg',
      payload: fields,
      callback: () => {
        message.success('添加成功');
        callback && callback();
        setTimeout(() => {
          this.getList({ pageBean, querys: [baseQuery] });
          this.handleCreateModalVisible();
        }, 500);
      },
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  fileChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ uploadLoad: true });
      return;
    }
    if (info.file.status === 'done') {
      if (info.file.response.code === 200) {
        message.success('上传成功');
        this.setState({
          fileList: info.fileList,
          uploadLoad: false,
          fileId: info.file.response.fileId,
        });
      } else {
        message.error('上传失败');
        this.setState({ uploadLoad: false });
      }
    } else if (info.file.status === 'error') {
      message.error('上传失败');
      this.setState({ uploadLoad: false });
    } else if (info.file.status === 'removed') {
      this.setState({ fileList: info.fileList });
    }
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { formValues, baseQuery } = this.state;
    const params = {
      pageBean: {
        page: pagination.current,
        pageSize: pagination.pageSize,
        showTotal: true,
      },
      querys: [baseQuery].concat(formValues),
    };
    this.getList(params);
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 16, xl: 16 }}>
          <Col md={10} sm={24}>
            <FormItem>
              {getFieldDecorator('fileName')(<Input addonBefore="站点建设资料名称" />)}
            </FormItem>
          </Col>
          <Col md={3} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      Site: { sysSiteBuild },
      modalVisible,
      handleModalVisible,
      loading,
    } = this.props;
    const { createModalVisible, selectedRows, fileList, uploadLoad, downLoaing } = this.state;
    const createMethods = {
      handleModalVisible: this.handleCreateModalVisible,
      handleAdd: this.handleAdd,
      fileList,
      fileChange: this.fileChange,
      uploadLoad,
    };
    return (
      <Fragment>
        <Modal
          destroyOnClose
          title="站点建设信息"
          visible={modalVisible}
          className={themeStyle.myModal + ' ' + themeStyle.modalbody}
          onCancel={() => handleModalVisible()}
          width={800}
          footer={null}
        >
          <Spin spinning={downLoaing}>
            <div className={themeStyle.detailMsg}>
              <div style={{ padding: 20 }}>
                <div className={styles.tableList}>
                  <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
                  <div className={styles.tableListOperator}>
                    <Button
                      icon="plus"
                      type="primary"
                      onClick={() => this.handleCreateModalVisible(true)}
                    >
                      新建
                    </Button>
                    {selectedRows.length > 0 && (
                      <span>
                        <Button type="danger" onClick={() => this.batchDel()}>
                          批量删除
                        </Button>
                      </span>
                    )}
                  </div>
                  <StandardTable
                    selectedRows={selectedRows}
                    loading={loading}
                    size="middle"
                    data={sysSiteBuild}
                    columns={this.columns}
                    onSelectRow={this.handleSelectRows}
                    onChange={this.handleStandardTableChange}
                  />
                </div>
              </div>
            </div>
          </Spin>
        </Modal>
        {modalVisible ? <CreateForm {...createMethods} modalVisible={createModalVisible} /> : null}
      </Fragment>
    );
  }
}

export default SiteBuildModal;
