import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
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
  DatePicker,
  Radio,
  Tooltip,
  Popconfirm,
  Upload,
  Icon,
  Tag,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import { Redirect } from 'umi';
import styles from '../../../style/style.less';
import { checkAuth, fileUrl, getLocalStorage, filePDZ } from '@/utils/utils';
import Participants from './modal';
import themeStyle from '@/pages/style/theme.less';

const authority = ['/datemain/train'];
const FormItem = Form.Item;
const statusMap = ['未开始', '已结束'];
const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;

const CreateForm = Form
  .create
  //   {
  //   mapPropsToFields(props) {
  //     return {
  //       participants: Form.createFormField({
  //         value: props.participants,
  //       }),
  //     };
  //   },
  // }
  ()(props => {
  const {
    modalVisible,
    form,
    handleAdd,
    handleModalVisible,
    participantsClick,
    fileList,
    participants,
    uploadChange,
  } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleAdd(fieldsValue, () => form.resetFields());
    });
  };

  const uploadConfig = {
    name: 'files',
    action: '/result/api/file/v1/fileUpload',
    // listType: 'picture',
    accept: '.doc,.docx,.pdf,.zip',
    data: {
      type: 8,
      params: null,
    },
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    beforeUpload: filePDZ,
    onChange: uploadChange,
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
        <FormItem labelCol={{ span: 5 }} hasFeedback wrapperCol={{ span: 15 }} label="培训主题">
          {form.getFieldDecorator('trainTitle', {
            rules: [{ required: true, message: '请输入培训主题！' }],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} hasFeedback wrapperCol={{ span: 15 }} label="培训内容">
          {form.getFieldDecorator('trainContent', {
            rules: [{ required: true, message: '请输入培训内容！' }],
          })(<Input.TextArea autosize placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} hasFeedback wrapperCol={{ span: 15 }} label="培训时间">
          {form.getFieldDecorator('trainTime', {
            rules: [{ required: true, message: '请选择培训时间！' }],
          })(<RangePicker style={{ width: '100%' }} showTime />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} hasFeedback wrapperCol={{ span: 15 }} label="培训地点">
          {form.getFieldDecorator('trainSite', {
            rules: [{ required: true, message: '请输入培训地点！' }],
          })(<Input.TextArea autosize placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} hasFeedback wrapperCol={{ span: 15 }} label="参与人员">
          {form.getFieldDecorator('participants', {
            initialValue: participants,
            rules: [{ required: true, message: '请选择参与人员！' }],
          })(
            <Input.TextArea
              onClick={() => participantsClick()}
              readOnly
              placeholder="请选择"
              autosize
            />,
          )}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="状态">
          {form.getFieldDecorator('status', {
            initialValue: 0,
            rules: [{ required: true, message: '请选择状态！' }],
          })(
            <RadioGroup>
              {statusMap.map((item, index) => (
                <Radio key={index} value={index}>
                  {item}
                </Radio>
              ))}
            </RadioGroup>,
          )}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="培训文件">
          {form.getFieldDecorator('trainImg', {})(
            <Upload {...uploadConfig} defaultFileList={fileList}>
              {fileList.length > 0 ? null : (
                <Button>
                  <Icon type="upload" /> 选择培训文件(.doc,.docx,.pdf,.zip)
                </Button>
              )}
            </Upload>,
          )}
        </FormItem>
      </div>
    </Modal>
  );
});

const UpdateForm = Form
  .create
  //   {
  //   mapPropsToFields(props) {
  //     return {
  //       participants: Form.createFormField({
  //         value: props.participants,
  //       }),
  //     };
  //   },
  // }
  ()(props => {
  const {
    modalVisible,
    form,
    handleUpdate,
    handleModalVisible,
    detail,
    participantsClick,
    uploadChange,
    participants,
    fileList,
  } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // form.resetFields();
      handleUpdate(fieldsValue);
    });
  };

  const showTime = time => {
    if (time) {
      const times = time.split(',');
      const timeStart = moment(times[0], 'YYYY-MM-DD HH:mm:ss');
      const timeEnd = moment(times[1], 'YYYY-MM-DD HH:mm:ss');
      return [timeStart, timeEnd];
    }
    return [];
  };

  const uploadConfig = {
    name: 'files',
    action: '/result/api/file/v1/fileUpload',
    // listType: 'picture',
    // accept: '.jpg,.jpeg,.png',
    accept: '.doc,.docx,.pdf,.zip',
    data: {
      type: 8,
      xbType: '',
    },
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    beforeUpload: filePDZ,
    onChange: uploadChange,
  };

  return (
    <Modal
      destroyOnClose
      title="编辑"
      className={themeStyle.formModal}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <div className={themeStyle.formModalBody}>
        <FormItem labelCol={{ span: 5 }} hasFeedback wrapperCol={{ span: 15 }} label="培训主题">
          {form.getFieldDecorator('trainTitle', {
            initialValue: detail.trainTitle,
            rules: [{ required: true, message: '请输入培训主题！' }],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} hasFeedback wrapperCol={{ span: 15 }} label="培训内容">
          {form.getFieldDecorator('trainContent', {
            initialValue: detail.trainContent,
            rules: [{ required: true, message: '请输入培训内容！' }],
          })(<Input.TextArea autosize placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} hasFeedback wrapperCol={{ span: 15 }} label="培训时间">
          {form.getFieldDecorator('trainTime', {
            initialValue: showTime(detail.trainTime),
            rules: [{ required: true, message: '请选择培训时间！' }],
          })(<RangePicker style={{ width: '100%' }} showTime />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} hasFeedback wrapperCol={{ span: 15 }} label="培训地点">
          {form.getFieldDecorator('trainSite', {
            initialValue: detail.trainSite,
            rules: [{ required: true, message: '请输入培训地点！' }],
          })(<Input.TextArea autosize placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} hasFeedback wrapperCol={{ span: 15 }} label="参与人员">
          {form.getFieldDecorator('participants', {
            initialValue: participants,
            // initialValue: participants ? participants : detail.participants,
            rules: [{ required: true, message: '请选择参与人员！' }],
          })(
            <Input.TextArea
              readOnly
              onClick={() => participantsClick()}
              placeholder="请选择"
              autosize
            />,
          )}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="状态">
          {form.getFieldDecorator('status', {
            initialValue: detail.status,
            rules: [{ required: true, message: '请选择状态！' }],
          })(
            <RadioGroup>
              {statusMap.map((item, index) => (
                <Radio key={index} value={index}>
                  {item}
                </Radio>
              ))}
            </RadioGroup>,
          )}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="培训文件">
          {form.getFieldDecorator('trainImg', {
            initialValue: detail.trainImg,
          })(
            <Upload {...uploadConfig} defaultFileList={fileList}>
              {fileList.length > 0 ? null : (
                <Button>
                  <Icon type="upload" /> 选择培训文件(.doc,.docx,.pdf,.zip)
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
@connect(({ system, LawenforTrain, loading }) => ({
  system,
  LawenforTrain,
  loading: loading.models.LawenforTrain,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    participantsVisible: false,
    selectedRows: [],
    fileList: [],
    participants: '',
    formValues: [],
    detail: {},
    pageBean: {
      page: 1,
      pageSize: 10,
      showTotal: true,
    },
  };

  columns = [
    {
      title: '培训主题',
      dataIndex: 'trainTitle',
    },
    {
      title: '培训内容',
      dataIndex: 'trainContent',
      render: val => (
        <Tooltip title={val}>
          <a>{val.length > 30 ? val.substr(0, 30) + '......' : val}</a>
        </Tooltip>
      ),
    },
    {
      title: '培训地点',
      dataIndex: 'trainSite',
      render: val => (
        <Tooltip title={val}>
          <a>{val.length > 30 ? val.substr(0, 30) + '......' : val}</a>
        </Tooltip>
      ),
    },
    {
      title: '培训时间',
      dataIndex: 'trainTime',
      width: 310,
      render: val => {
        if (val) {
          const time = val.split(',');
          return time[0] + ' ~ ' + time[1];
        }
        return '';
      },
    },
    {
      title: '参与人员',
      dataIndex: 'participants',
      render: val =>
        val && (
          <Tooltip title={val}>
            <a>{val.length > 30 ? val.substr(0, 30) + '......' : val}</a>
          </Tooltip>
        ),
    },
    {
      title: '培训文件',
      dataIndex: 'trainImg',
      render: val => (
        <Tag color="#87d068">
          <Icon type="download" />{' '}
          <a href={fileUrl + val} target="_blank">
            {' '}
            文件下载
          </a>
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: val => statusMap[parseInt(val, 10)],
    },
    {
      title: '操作',
      width: 100,
      render: (text, record) => (
        <Fragment>
          <Fragment>
            <Tooltip placement="left" title="编辑">
              <Button
                onClick={() => this.showUpdateModal(record)}
                type="primary"
                shape="circle"
                icon="edit"
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
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    if (!checkAuth(authority[0])) return;
    const { pageBean } = this.state;
    this.getList({ pageBean });
  }

  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'LawenforTrain/fetch',
      payload: params,
    });
  };

  showUpdateModal = record => {
    this.setState(
      {
        detail: record,
        participants: record.participants,
        fileList: record.trainImg
          ? [
              {
                uid: '-1',
                name: '培训文件',
                status: 'done',
              },
            ]
          : [],
      },
      () => {
        this.handleUpdateModalVisible(true);
      },
    );
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
    });
  };

  dataDel = id => {
    this.delUtil(id);
  };

  delUtil = ids => {
    const { dispatch } = this.props;
    const { pageBean } = this.state;
    dispatch({
      type: 'LawenforTrain/remove',
      payload: { ids },
      callback: () => {
        this.setState({
          selectedRows: [],
        });
        this.getList({ pageBean });
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
      selectedRows: [],
    });
    this.getList({ pageBean });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
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
              relation: 'OR',
            }
          : '';
      });
      const conditionFilter = condition.filter(item => item);
      this.setState({
        formValues: conditionFilter,
      });
      this.getList({ pageBean, querys: conditionFilter });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
    if (!flag) {
      this.setState({
        participants: '',
        fileList: [],
      });
    }
  };

  handleUpdateModalVisible = flag => {
    this.setState({
      updateModalVisible: !!flag,
    });
    if (!flag) {
      this.setState({
        detail: {},
        participants: '',
        fileList: [],
      });
    }
  };

  handleParticipantsVisible = flag => {
    this.setState({ participantsVisible: !!flag });
  };

  selectParticipants = res => {
    const names = res.map(item => item.fullname).join();
    this.setState({ participants: names });
  };

  participantsClick = () => {
    this.handleParticipantsVisible(true);
  };

  handleAdd = (fields, callback) => {
    const { dispatch } = this.props;
    const { pageBean, fileList } = this.state;
    if (!fileList.length) {
      return message.error('请选择文件');
    }
    const time = fields.trainTime;
    const timeStart = moment(time[0]).format('YYYY-MM-DD HH:mm:ss');
    if (moment() > moment(time[0])) {
      return message.error('开始时间应大于当前时间');
    }
    const timeEnd = moment(time[1]).format('YYYY-MM-DD HH:mm:ss');
    fields.trainImg = fields.trainImg ? fields.trainImg.file.response.filePath : '';
    fields.trainTime = `${timeStart},${timeEnd}`;
    dispatch({
      type: 'LawenforTrain/add',
      payload: fields,
      callback: () => {
        message.success('添加成功');
        callback && callback();
        setTimeout(() => {
          this.handleModalVisible();
          this.getList({ pageBean });
        }, 500);
      },
    });
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    const { pageBean, detail, fileList } = this.state;
    if (!fileList.length) {
      return message.error('请选择文件');
    }
    const arr = JSON.parse(JSON.stringify(detail));
    fields.id = detail.id;
    const time = fields.trainTime;
    const timeStart = moment(time[0]).format('YYYY-MM-DD HH:mm:ss');
    if (moment() > moment(time[0])) {
      return message.error('开始时间应大于当前时间');
    }
    const timeEnd = moment(time[1]).format('YYYY-MM-DD HH:mm:ss');
    fields.trainTime = `${timeStart},${timeEnd}`;
    if (typeof fields.trainImg === 'object') {
      const { response } = fields.trainImg.file;
      fields.trainImg = response ? response.filePath : '';
    }
    const keys = Object.keys(fields);
    for (let item in keys) {
      arr[keys[item]] = fields[keys[item]];
    }
    this.setState({ detail: arr });
    dispatch({
      type: 'LawenforTrain/update',
      payload: fields,
      callback: () => {
        message.success('编辑成功');
        setTimeout(() => {
          this.handleUpdateModalVisible();
          this.getList({ pageBean });
        }, 500);
      },
    });
  };

  uploadChange = info => {
    if (info.file.status === 'done') {
      if (info.file.response.code === 200) {
        message.success('上传成功');
        this.setState({ fileList: info.fileList });
      } else {
        message.error('上传失败');
        message.error(info.file.response.code.msg);
      }
    } else if (info.file.status === 'error') {
      message.error('上传失败');
    } else if (info.file.status === 'removed') {
      this.setState({ fileList: info.fileList });
    }
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 16, xl: 16 }}>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('trainTitle')(
                <Input addonBefore="培训主题" placeholder="请输入" />,
              )}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('trainContent')(
                <Input addonBefore="培训内容" placeholder="请输入" />,
              )}
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
      LawenforTrain: { data },
      loading,
    } = this.props;
    const {
      selectedRows,
      modalVisible,
      updateModalVisible,
      detail,
      participants,
      participantsVisible,
      fileList,
    } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      participantsClick: this.participantsClick,
      participants,
      uploadChange: this.uploadChange,
      fileList,
    };

    const updateMethods = {
      handleUpdate: this.handleUpdate,
      detail,
      participants,
      handleModalVisible: this.handleUpdateModalVisible,
      participantsClick: this.participantsClick,
      uploadChange: this.uploadChange,
      fileList,
    };

    const participantsMethods = {
      handleModalVisible: this.handleParticipantsVisible,
      selectParticipants: this.selectParticipants,
    };

    return (
      <Fragment>
        {checkAuth(authority[0]) ? null : <Redirect to="/exception/403" />}
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button type="danger" onClick={() => this.batchDel()}>
                    批量操作
                  </Button>
                </span>
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
        {modalVisible && <CreateForm {...parentMethods} modalVisible={modalVisible} />}
        {updateModalVisible && Object.keys(detail).length && (
          <UpdateForm {...updateMethods} modalVisible={updateModalVisible} />
        )}
        {participantsVisible && (
          <Participants {...participantsMethods} modalVisible={participantsVisible} />
        )}
      </Fragment>
    );
  }
}

export default TableList;
