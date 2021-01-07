import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Modal,
  message,
  Divider,
  Upload,
  Icon,
  Tooltip,
  Popconfirm,
} from 'antd';
import StandardTable from '@/components/StandardTable';

import { getLocalStorage, fileHSUpload } from '@/utils/utils';

import styles from '@/pages/style/style.less';
import themeStyle from '@/pages/style/theme.less';

const FormItem = Form.Item;

const [defaultQuery, pageBean] = [
  {
    property: 'fileType',
    value: 10,
    operation: 'EQUAL',
    relation: 'AND',
  },
  {
    page: 1,
    pageSize: 10,
    showTotal: true,
  },
];

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, fileList, onCancel, uploadChange } = props;
  const okHandle = () => {
    form.validateFields(err => {
      if (err) return;
      handleAdd();
    });
  };

  const uploadConfig = {
    name: 'files',
    action: '/result/api/file/v1/fileUpload',
    accept: '.doc,.docx,.pdf,.xlsx,.xls,.ppt,.pptx',
    data: {
      type: 10,
      params: null,
    },
    fileList,
    // multiple: true,
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    onChange: uploadChange,
    beforeUpload: fileHSUpload,
  };

  return (
    <Modal
      destroyOnClose
      title="上传文件"
      visible={modalVisible}
      onOk={okHandle}
      className={themeStyle.formModal}
      onCancel={() => onCancel()}
    >
      <div className={themeStyle.formModalBody}>
        <FormItem label="文件上传">
          {form.getFieldDecorator('file', {
            rules: [{ required: true, message: '请选择文件!' }],
          })(
            <Upload {...uploadConfig}>
              <Button>
                <Icon type="upload" /> 选择文件（请上传 ‘pdf’ 、‘excel’ 、‘ppt’ 、‘word’文件）
              </Button>
            </Upload>,
          )}
        </FormItem>
      </div>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ File, loading }) => ({
  File,
  loading: loading.models.File,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: [],
    formValues: [],
    fileList: [],
  };

  columns = [
    {
      title: '上传者',
      dataIndex: 'creatorName',
    },
    {
      title: '文件名称',
      dataIndex: 'fileName',
    },
    {
      title: '文件类型',
      width: 80,
      dataIndex: 'extensionName',
    },
    {
      title: '上传时间',
      width: 170,
      dataIndex: 'createTime',
    },
    {
      title: '操作',
      width: 100,
      render: (_, record) => (
        <Fragment>
          <Tooltip placement="left" title="下载">
            <Button
              type="primary"
              shape="circle"
              icon="download"
              size="small"
              onClick={() => this.downLoadFile(record)}
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
    this.getList({ pageBean, querys: [defaultQuery] });
  }

  getList = (payload = {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'File/fetch',
      payload,
    });
  };

  downLoadFile = record => {
    const { dispatch } = this.props;
    const { id, fileName, extensionName } = record;
    dispatch({
      type: 'File/downLoad',
      payload: {
        fileName,
        extensionName,
        id,
      },
      callback: status => {
        if (status === 404) {
          message.error('文件不存在');
        }
      },
    });
  };

  /**
   * @description 单个删除
   * @param id {number}
   */
  dataDel = id => {
    this.delUtil(id);
  };

  batchDel = () => {
    const { selectedRows } = this.state;
    if (!selectedRows.length) return;
    Modal.confirm({
      title: '提示',
      content: '是否删除数据？',
      onOk: () => {
        const ids = selectedRows.map(item => item.id);
        this.delUtil(ids.join(), () => {
          this.setState({ selectedRows: [] });
        });
      },
    });
  };

  /**
   * @description 删除公用
   * @param id {number}
   * @callback {function}
   */
  delUtil = (ids, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'File/remove',
      payload: ids,
      callback: () => {
        message.success('删除成功');
        this.getList({ pageBean, querys: [defaultQuery] });
        if (callback) callback();
      },
    });
  };

  handleStandardTableChange = pagination => {
    const { formValues } = this.state;
    const params = {
      pageBean: {
        page: pagination.current,
        pageSize: pagination.pageSize,
        showTotal: true,
      },
      querys: [defaultQuery, ...formValues],
    };
    this.getList(params);
  };

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValues: [],
      selectedRows: [],
    });
    this.getList({ pageBean, querys: [defaultQuery] });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  uploadChange = info => {
    if (info.file.status === 'done') {
      if (info.file.response.code === 200) {
        message.success('上传成功');
        // this.setState({ fileList: [...info.fileList] });
      } else {
        message.error(`${info.file.name} - 上传失败`);
      }
    } else if (info.file.status === 'error') {
      message.error('上传失败');
    } else if (info.file.status === 'removed') {
      const { response } = info.file;
      if (response.code === 200) {
        this.dataDel(info.file.response.fileId);
      }
      // this.setState({ fileList: [...info.fileList] });
    }
    this.setState({ fileList: [...info.fileList] });
  };

  handleAdd = () => {
    this.getList({
      pageBean,
      querys: [defaultQuery],
    });
    this.handleModalVisible();
  };

  onCancel = () => {
    const { fileList } = this.state;
    if (fileList.length) {
      const fileIDs = fileList.map(item => item.response.fileId).join();
      this.delUtil(fileIDs);
    }
    this.handleModalVisible();
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldValue) => {
      if (err) return;
      const values = {
        fileName: fieldValue.name,
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
      this.getList({ pageBean, querys: [defaultQuery, ...condition] });
    });
  };

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 16, xl: 16 }}>
          <Col md={6} sm={24}>
            <FormItem>
              {getFieldDecorator('name')(<Input addonBefore="文件名称" placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
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
      File: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, fileList } = this.state;

    const parentMethods = {
      fileList,
      handleAdd: this.handleAdd,
      uploadChange: this.uploadChange,
      onCancel: this.onCancel,
      // handleModalVisible: this.handleModalVisible,
    };
    return (
      <Fragment>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="upload" type="primary" onClick={() => this.handleModalVisible(true)}>
                上传文件
              </Button>
              {selectedRows.length > 0 && (
                <Button type="danger" onClick={this.batchDel}>
                  批量删除
                </Button>
              )}
            </div>
            <StandardTable
              tableAlert={true}
              size="middle"
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
      </Fragment>
    );
  }
}

export default TableList;
