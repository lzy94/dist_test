import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, message, Upload, Tooltip, Modal, Icon } from 'antd';
import { Redirect } from 'umi';
import StandardTable from '@/components/StandardTable';
import { checkAuth, getLocalStorage, fileUrl, fileBeforeUpload } from '@/utils/utils';
import themeStyle from '@/pages/style/theme.less';
import styles from '../../../style/style.less';

const authority = ['/datemain/legal'];
const FormItem = Form.Item;

const CreateModal = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, fileList, uploadChange } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue, () => form.resetFields());
    });
  };

  const uploadConfig = {
    name: 'files',
    action: '/result/api/file/v1/fileUpload',
    accept: '.doc,.docx,.pdf',
    data: {
      type: 4,
      params: null,
    },
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    onChange: uploadChange,
    beforeUpload: fileBeforeUpload,
  };

  return (
    <Modal
      destroyOnClose
      title="添加"
      className={themeStyle.formModal}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <div className={themeStyle.formModalBody}>
        <FormItem labelCol={{ span: 5 }} hasFeedback wrapperCol={{ span: 15 }} label="发布机构">
          {form.getFieldDecorator('sourceName', {
            rules: [{ required: true, message: '请输入发布机构！' }],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="文件上传">
          {form.getFieldDecorator('file', {
            rules: [{ required: true, message: '请选择文件!' }],
          })(
            <Upload {...uploadConfig} defaultFileList={fileList}>
              {fileList.length > 0 ? null : (
                <Button>
                  <Icon type="upload" /> 法律法规（请上传 ‘pdf’ 及 ‘doc’ 文件）
                </Button>
              )}
            </Upload>,
          )}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} hasFeedback wrapperCol={{ span: 15 }} label="版本">
          {form.getFieldDecorator('version', {
            rules: [{ required: true, message: '请输入版本！' }],
          })(<Input placeholder="请输入" />)}
        </FormItem>
      </div>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ loading, File, LawsAndRegulations }) => ({
  File,
  fileLoading: loading.models.File,
  LawsAndRegulations,
  loading: loading.models.LawsAndRegulations,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    formValues: [],
    fileList: [],
    selectedRows: [],
    uploadLoading: false,
    modalVisible: false,
    pageBean: {
      page: 1,
      pageSize: 10,
      showTotal: true,
    },
  };

  columns = [
    {
      title: '上传者',
      dataIndex: 'createBy',
    },
    {
      title: '发布机构',
      dataIndex: 'sourceName',
    },
    {
      title: '文件名',
      dataIndex: 'fileName',
      render: val =>
        val.length > 15 ? (
          <Tooltip title={val}>
            <span style={{ cursor: 'pointer' }}>{val.substr(0, 15) + '......'}</span>
          </Tooltip>
        ) : (
          val
        ),
    },
    {
      title: '版本',
      dataIndex: 'version',
    },
    // {
    //   title: '扩展名',
    //   dataIndex: 'ext',
    //   render: val => <Tag color='#87d068'>{val}</Tag>
    // },
    {
      title: '上传时间',
      dataIndex: 'createTime',
    },
    {
      title: '操作',
      width: 70,
      render: (text, record) => (
        <Fragment>
          <Tooltip placement="left" title="预览">
            <Button
              onClick={() => this.previcew(record)}
              type="primary"
              shape="circle"
              icon="eye"
              size="small"
            />
          </Tooltip>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { pageBean } = this.state;
    this.getList({ pageBean });
  }

  previcew = result => {
    const { dispatch } = this.props;
    if (result.ext === 'pdf') {
      window.open(fileUrl + result.filePath, '_blank');
    } else {
      dispatch({
        type: 'File/preview',
        payload: {
          fileId: result.fileId,
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
              if (res2.code !== 200) {
                return message.error('文件读取失败！');
              }
              window.open(res2.data, '_blank');
            },
          });
        },
      });
    }
  };

  delBatch = () => {
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
    const { pageBean } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'LawsAndRegulations/remove',
      payload: { ids },
      callback: () => {
        message.success('删除成功');
        setTimeout(() => this.getList({ pageBean }), 100);
        this.setState({
          selectedRows: [],
        });
      },
    });
  };

  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'LawsAndRegulations/fetch',
      payload: params,
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
    if (!flag) {
      this.setState({
        fileList: [],
      });
    }
  };

  handleAdd = (fields, callback) => {
    const { dispatch } = this.props;
    const { fileList, pageBean } = this.props;
    if (!fileList.length) return message.error('请选择文件');
    const { response } = fields.file.file;
    fields.fileId = response.fileId;
    fields.fileName = response.fileName;
    fields.filePath = response.filePath;
    fields.ext = response.extensionName;
    dispatch({
      type: 'LawsAndRegulations/add',
      payload: fields,
      callback: () => {
        message.success('添加成功');
        this.handleModalVisible();
        this.getList({ pageBean });
        callback && callback();
      },
    });
  };

  uploadChange = info => {
    if (info.file.status === 'done') {
      if (info.file.response.code === 200) {
        message.success('上传成功');
        this.setState({ fileList: info.fileList });
      } else {
        message.error(info.file.response.code.msg);
      }
    } else if (info.file.status === 'error') {
      message.error('上传失败');
    } else if (info.file.status === 'removed') {
      this.setState({ fileList: info.fileList });
    }
  };

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

  handleFormReset = () => {
    const { form } = this.props;
    const { pageBean } = this.state;
    form.resetFields();
    this.setState({
      formValues: [],
    });
    this.getList({
      pageBean,
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const { pageBean } = this.state;
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
              relation: 'AND',
            }
          : '';
      });
      // 过滤数组中的('' null undefined)
      const conditionFilter = condition.filter(item => item);
      this.setState({
        formValues: conditionFilter,
      });
      this.getList({ pageBean, querys: conditionFilter });
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={16}>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('createBy')(<Input addonBefore="上传者" placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('fileName')(<Input addonBefore="文件名称" placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
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
      LawsAndRegulations: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, fileList } = this.state;
    const parentMethods = {
      fileList: fileList,
      handleAdd: this.handleAdd,
      uploadChange: this.uploadChange,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <Fragment>
        {checkAuth(authority[0]) ? null : <Redirect to="/exception/403" />}
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <div className={styles.tableListOperator}>
              <Button type="primary" icon="plus" onClick={() => this.handleModalVisible(true)}>
                新增
              </Button>
              {selectedRows.length > 0 && (
                <Button type="danger" onClick={() => this.delBatch()}>
                  批量删除
                </Button>
              )}
            </div>
            <StandardTable
              size="middle"
              tableAlert={true}
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateModal {...parentMethods} modalVisible={modalVisible} />
      </Fragment>
    );
  }
}

export default TableList;
