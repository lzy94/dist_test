import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  Modal,
  Upload,
  message,
  DatePicker,
  Divider,
  Tooltip,
  Popconfirm,
  Icon,
  Radio,
} from 'antd';
import { getLocalStorage, fileUrl, filePDZ } from '@/utils/utils';
import StandardTable from '@/components/StandardTable';
import PeopleModal from '../../Component/PeopleModal';

import styles from '../../../style/style.less';
import themeStyle from '@/pages/style/theme.less';
import publicCss from '@/pages/style/public.less';

const FormItem = Form.Item;
const { Option } = Select;

const statusMap = ['未开始', '已结束', '取消'];

const CreateForm = Form.create()(props => {
  const {
    modalVisible,
    form,
    handleAdd,
    handleModalVisible,
    loading,
    fileList,
    uploadConfig,
    handlePeopleVisible,
    participants,
  } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleAdd(fieldsValue, () => form.resetFields());
    });
  };
  return (
    <Modal
      destroyOnClose
      title="添加培训信息"
      className={themeStyle.formModal}
      visible={modalVisible}
      width={700}
      onCancel={() => handleModalVisible()}
      footer={[
        <Button key="back" onClick={() => handleModalVisible()}>
          取消
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={okHandle}>
          确定
        </Button>,
      ]}
    >
      <div className={themeStyle.formModalBody}>
        <Row gutter={40}>
          <Col md={12} sm={24}>
            <FormItem label="培训主题">
              {form.getFieldDecorator('trainTitle', {
                rules: [{ required: true, message: '请输入培训主题！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="培训时间">
              {form.getFieldDecorator('trainTime', {
                rules: [{ required: true, message: '请选择培训时间！' }],
              })(<DatePicker style={{ width: '100%' }} placeholder="请选择" showTime />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="培训地点">
              {form.getFieldDecorator('trainAddr', {
                rules: [{ required: true, message: '请输入培训地点！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="培训内容">
              {form.getFieldDecorator('trainContent', {
                rules: [{ required: true, message: '请输入培训内容！' }],
              })(<Input.TextArea placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={24} sm={24}>
            <FormItem label="参与人员">
              {form.getFieldDecorator('participants', {
                initialValue: participants,
                rules: [{ required: true, message: '请选择参与人员！' }],
              })(
                <Input.TextArea
                  readOnly
                  placeholder="请选择"
                  onClick={() => handlePeopleVisible(true)}
                />,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="培训附件名称">
              {form.getFieldDecorator('enclosureName', {
                rules: [{ required: true, message: '请输入培训附件名称！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="培训附件">
              {form.getFieldDecorator('enclosureUrl', {
                rules: [{ required: true, message: '请选择培训附件！' }],
              })(
                <Upload {...uploadConfig()} defaultFileList={fileList}>
                  {fileList.length > 0 ? null : (
                    <Button>
                      <Icon type="upload" /> 请上传培训附件（ pdf , doc, docx, zip）
                    </Button>
                  )}
                </Upload>,
              )}
            </FormItem>
          </Col>
        </Row>
      </div>
    </Modal>
  );
});

const UpdateForm = Form.create()(props => {
  const {
    modalVisible,
    form,
    handleUpdate,
    handleModalVisible,
    loading,
    fileList,
    uploadConfig,
    handlePeopleVisible,
    participants,
    detail,
    stateValue,
    stateChange,
  } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleUpdate(fieldsValue, () => form.resetFields());
    });
  };

  return (
    <Modal
      destroyOnClose
      title="编辑培训信息"
      className={themeStyle.formModal}
      visible={modalVisible}
      width={700}
      onCancel={() => handleModalVisible()}
      footer={[
        <Button key="back" onClick={() => handleModalVisible()}>
          取消
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={okHandle}>
          确定
        </Button>,
      ]}
    >
      <div className={themeStyle.formModalBody}>
        <Row gutter={40}>
          <Col md={12} sm={24}>
            <FormItem label="培训主题">
              {form.getFieldDecorator('trainTitle', {
                initialValue: detail.trainTitle,
                rules: [{ required: true, message: '请输入培训主题！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="培训时间">
              {form.getFieldDecorator('trainTime', {
                initialValue: moment(detail.trainTime),
                rules: [{ required: true, message: '请选择培训时间！' }],
              })(<DatePicker style={{ width: '100%' }} placeholder="请选择" showTime />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="培训地点">
              {form.getFieldDecorator('trainAddr', {
                initialValue: detail.trainAddr,
                rules: [{ required: true, message: '请输入培训地点！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="培训内容">
              {form.getFieldDecorator('trainContent', {
                initialValue: detail.trainContent,
                rules: [{ required: true, message: '请输入培训内容！' }],
              })(<Input.TextArea placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={24} sm={24}>
            <FormItem label="参与人员">
              {form.getFieldDecorator('participants', {
                initialValue: participants,
                rules: [{ required: true, message: '请选择参与人员！' }],
              })(
                <Input.TextArea
                  readOnly
                  placeholder="请选择"
                  onClick={() => handlePeopleVisible(true)}
                />,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="培训附件名称">
              {form.getFieldDecorator('enclosureName', {
                initialValue: detail.enclosureName,
                rules: [{ required: true, message: '请输入培训附件名称！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="培训附件">
              {form.getFieldDecorator('enclosureUrl', {
                initialValue: detail.enclosureUrl,
                rules: [{ required: true, message: '请选择培训附件！' }],
              })(
                <Upload {...uploadConfig()} defaultFileList={fileList}>
                  {fileList.length > 0 ? null : (
                    <Button>
                      <Icon type="upload" /> 请上传培训附件（ pdf , doc, docx, zip）
                    </Button>
                  )}
                </Upload>,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="状态">
              {form.getFieldDecorator('state', {
                initialValue: detail.state,
                rules: [{ required: true, message: '请选择状态！' }],
              })(
                <Radio.Group onChange={stateChange}>
                  {statusMap.map((item, i) => (
                    <Radio value={i + 1} key={i}>
                      {item}
                    </Radio>
                  ))}
                </Radio.Group>,
              )}
            </FormItem>
          </Col>
        </Row>
        {stateValue === 3 && (
          <Row gutter={40}>
            <Col md={24}>
              <FormItem label="取消原因">
                {form.getFieldDecorator('cancleReason', {
                  initialValue: detail.cancleReason || '',
                })(<Input.TextArea placeholder="请输入" />)}
              </FormItem>
            </Col>
          </Row>
        )}
      </div>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ MaritimeTrain, loading }) => ({
  MaritimeTrain,
  loading: loading.models.MaritimeTrain,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    peopleVisible: false,
    participants: '',
    formValues: [],
    fileList: [],
    stateValue: 0,
    detail: {},
    pageBean: { page: 1, pageSize: 10, showTotal: true },
  };

  columns = [
    {
      title: '培训主题',
      dataIndex: 'trainTitle',
    },
    {
      title: '培训内容',
      dataIndex: 'trainContent',
      render: val =>
        val.length > 10 ? <Tooltip title={val}>{val.substring(0, 10)}...</Tooltip> : val,
    },
    {
      title: '培训地点',
      dataIndex: 'trainAddr',
    },
    {
      title: '培训时间',
      dataIndex: 'trainTime',
      width: 170,
      render: val => moment(val).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '参与人员',
      dataIndex: 'participants',
    },
    {
      title: '培训附件',
      dataIndex: 'enclosureUrl',
      render: (val, record) => {
        if (val) {
          return (
            <a href={fileUrl + record.enclosureUrl} download={record.enclosureName} target="_blank">
              {record.enclosureName}
            </a>
          );
        }
        return '';
      },
    },
    {
      title: '状态',
      dataIndex: 'state',
      render: val => statusMap[val - 1],
    },
    {
      title: '操作',
      width: 90,
      render: (text, record) => (
        <Fragment>
          <Tooltip placement="left" title="编辑">
            <Button
              onClick={() => this.editData(record)}
              type="primary"
              shape="circle"
              icon="edit"
              size="small"
            />
          </Tooltip>
          <Divider type="vertical" />
          <Popconfirm
            title="是否删除数据?"
            onConfirm={() => this.dataDel(record.id_)}
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
    const { pageBean } = this.state;
    this.getList({ pageBean });
  }

  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'MaritimeTrain/fetch',
      payload: params,
    });
  };

  dataDel = id => {
    const { dispatch } = this.props;
    const { pageBean } = this.state;
    dispatch({
      type: 'MaritimeTrain/remove',
      payload: { id },
      callback: () => {
        message.success('删除成功');
        this.getList({ pageBean });
      },
    });
  };

  editData = detail => {
    this.setState(
      {
        detail,
        stateValue: detail.state,
        participants: detail.participants,
        fileList: detail.enclosureUrl
          ? [
              {
                uid: '1',
                name: '当前文件',
                status: 'done',
                url: fileUrl + detail.enclosureUrl,
                path: detail.enclosureUrl,
              },
            ]
          : [],
      },
      () => this.handleUpdateModalVisible(true),
    );
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
    this.getList({ pageBean });
  };

  handleSearch = e => {
    e.preventDefault();

    const { form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { pageBean } = this.state;
      const values = {
        state: fieldsValue.status,
        participants: fieldsValue.cyry,
        trainAddr: fieldsValue.address,
      };

      const objKeys = Object.keys(values);
      const condition = objKeys.map(item => {
        return values[item]
          ? {
              property: item,
              value: values[item],
              group: 'main',
              operation: item === 'state' ? 'EQUAL' : 'LIKE',
              relation: 'AND',
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

  handlePeopleVisible = flag => {
    this.setState({
      peopleVisible: !!flag,
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
    if (!flag) {
      this.setState({ participants: '', fileList: [] });
    }
  };

  handleUpdateModalVisible = flag => {
    this.setState({
      updateModalVisible: !!flag,
    });
    if (!flag) {
      this.setState({ participants: '', detail: {}, fileList: [], stateValue: 0 });
    }
  };

  handleAdd = (fields, callback) => {
    const { dispatch } = this.props;
    const { fileList, participants, pageBean } = this.state;
    if (!fileList.length) return message.error('请选择文件');
    const values = {
      ...fields,
    };
    values.participants = participants;
    values.enclosureUrl = fileList.length ? fileList[0].response.filePath : '';
    values.state = 1;
    dispatch({
      type: 'MaritimeTrain/add',
      payload: values,
      callback: () => {
        this.getList({ pageBean });
        message.success('添加成功');
        this.handleModalVisible();
        callback();
      },
    });
  };

  handleUpdate = (fields, callback) => {
    const { dispatch } = this.props;
    const { fileList, participants, pageBean, detail, stateValue } = this.state;
    if (!fileList.length) return message.error('请选择文件');
    const keys = Object.keys(fields);
    const values = {
      id_: detail.id_,
      ...fields,
    };
    values.participants = participants;
    if (typeof values.enclosureUrl === 'object') {
      values.enclosureUrl = fileList[0].response.filePath;
    }

    for (let i = 0; i < keys.length; i += 1) {
      detail[keys[i]] = values[keys[i]];
    }
    if (stateValue === 3) {
      values.cancleTime = new Date();
    }
    this.setState({ detail: values });
    dispatch({
      type: 'MaritimeTrain/update',
      payload: values,
      callback: () => {
        this.getList({ pageBean });
        message.success('编辑成功');
        this.handleUpdateModalVisible();
        callback();
      },
    });
  };

  stateChange = e => {
    const { value } = e.target;
    this.setState({ stateValue: value });
  };

  uploadConfig = () => {
    return {
      name: 'files',
      action: '/result/api/file/v1/fileUpload',
      listType: 'picture',
      accept: '.doc,.docx,.pdf,.zip',
      className: 'upload-list-inline',
      data: {
        type: 9,
      },
      headers: {
        Authorization: `Bearer ${getLocalStorage('token')[0]}`,
        'x-requested-with': 'XMLHttpRequest',
      },
      beforeUpload: filePDZ,
      onChange: this.uploadChange,
    };
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

  participantsList = data => {
    this.setState({ participants: data.join() });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 16, xl: 16 }}>
          <Col md={6} sm={24}>
            <FormItem>
              {getFieldDecorator('address')(<Input addonBefore="培训地点" placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <div className={publicCss.inputMain}>
              <span
                style={{ width: '80px', lineHeight: '30px', height: '32px' }}
                className="ant-input-group-addon"
              >
                状态
              </span>
              <FormItem style={{ flex: 1 }}>
                {getFieldDecorator('status')(
                  <Select placeholder="请选择" style={{ width: '100%' }}>
                    {statusMap.map((item, i) => (
                      <Option value={i + 1} key={`${i}_status`}>
                        {item}
                      </Option>
                    ))}
                  </Select>,
                )}
              </FormItem>
            </div>
          </Col>
          <Col md={6} sm={24}>
            <FormItem>
              {getFieldDecorator('cyry')(<Input addonBefore="参与人员" placeholder="请输入" />)}
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
      MaritimeTrain: { data },
      loading,
    } = this.props;
    const {
      modalVisible,
      updateModalVisible,
      fileList,
      peopleVisible,
      participants,
      detail,
      stateValue,
    } = this.state;

    const baseMetods = {
      loading,
      fileList,
      participants,
      uploadConfig: this.uploadConfig,
      handlePeopleVisible: this.handlePeopleVisible,
    };

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      detail,
      stateValue,
      stateChange: this.stateChange,
      handleModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <Fragment>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
            </div>
            <StandardTable
              rowKey="id_"
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
        </Card>
        <CreateForm {...baseMetods} {...parentMethods} modalVisible={modalVisible} />

        {updateModalVisible && Object.keys(detail).length && (
          <UpdateForm {...baseMetods} {...updateMethods} modalVisible={updateModalVisible} />
        )}
        {peopleVisible && (
          <PeopleModal
            participantsList={this.participantsList}
            handleModalVisible={this.handlePeopleVisible}
            modalVisible={peopleVisible}
          />
        )}
      </Fragment>
    );
  }
}

export default TableList;
