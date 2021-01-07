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
  Icon,
  Button,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Divider,
  Upload,
  Radio,
  TreeSelect,
  Spin,
  Tree,
  Tooltip,
  Tag,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import { Redirect } from 'umi';
import {
  checkAuth,
  checkPhone,
  getLocalStorage,
  imgUrl,
  checkLatitude,
  checkLongitude,
} from '@/utils/utils';
import UnloadYardModal from './unloadYard';
import SysSiteBuildModal from './sysSiteBuild';
import Modia from './modia';
import themeStyle from '@/pages/style/theme.less';
import styles from '../../../style/style.less';
import publicCss from '../../../style/public.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const authority = [
  '/datemain/site',
  '/datemain/site/addSite',
  '/datemain/site/updateSite',
  '/datemain/site/deleteSite',
  '/system/sysSiteBuild/list',
  '/system/unloadYard/list',
  '/system/mediaConf/list',
];

const status = ['报废', '在用', '检修'];
// const color = ['#FF0000', '#00FF00', '#FFFF00'];
const color = ['red', 'green', 'yellow'];

const CreateForm = Form.create()(props => {
  const {
    modalVisible,
    form,
    handleAdd,
    handleModalVisible,
    siteType,
    siteTypeChange,
    treeList,
  } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleAdd(fieldsValue, () => form.resetFields());
    });
  };

  const siteTypeForm = (
    <Fragment>
      <Col md={12} sm={24}>
        <FormItem label="最小速度(km)">
          {form.getFieldDecorator('lowSpeed', {})(
            <InputNumber style={{ width: '100%' }} placeholder="请输入" />,
          )}
        </FormItem>
      </Col>
      <Col md={12} sm={24}>
        <FormItem label="最高速度(km)">
          {form.getFieldDecorator('highSpeed', {})(
            <InputNumber style={{ width: '100%' }} placeholder="请输入" min={0} />,
          )}
        </FormItem>
      </Col>
      <Col md={12} sm={24}>
        <FormItem label="超载预警(%)">
          {form.getFieldDecorator('warningLoadRate', {})(
            <InputNumber style={{ width: '100%' }} placeholder="请输入" min={0} />,
          )}
        </FormItem>
      </Col>
      <Col md={12} sm={24}>
        <FormItem label="超速预警(%)">
          {form.getFieldDecorator('warningSpeedRate', {})(
            <InputNumber style={{ width: '100%' }} placeholder="请输入" min={0} />,
          )}
        </FormItem>
      </Col>
      <Col md={12} sm={24}>
        <FormItem label="执法方式">
          {form.getFieldDecorator('lawEnforceType', {
            initialValue: 1,
            rules: [{ required: true, message: '请选择执法方式!' }],
          })(
            <Select style={{ width: '100%' }} placeholder="请选择">
              <Select.Option value={1}>动态执法</Select.Option>
              <Select.Option value={2}>动静结合执法</Select.Option>
            </Select>,
          )}
        </FormItem>
      </Col>
    </Fragment>
  );

  const uploadConfig = {
    name: 'files',
    action: '/result/api/file/v1/fileUpload',
    listType: 'picture',
    accept: '.jpg,.jpeg,.png',
    data: {
      type: 2,
      xbType: '',
    },
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 上传成功`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败`);
      }
    },
  };
  return (
    <Modal
      destroyOnClose
      title="新建站点"
      className={themeStyle.formModal}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      width={800}
    >
      <div className={themeStyle.formModalBody}>
        <Row gutter={40}>
          <Col md={12} sm={24}>
            <FormItem label="站点类型">
              {form.getFieldDecorator('siteType', {
                initialValue: siteType,
                rules: [{ required: true, message: '请选择站点类型！' }],
              })(
                <Select style={{ width: '100%' }} placeholder="请选择" onChange={siteTypeChange}>
                  <Option value="1">动态检测站点</Option>
                  <Option value="2">静态检测站</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="站点号">
              {form.getFieldDecorator('siteCode', {
                rules: [{ required: true, message: '请输入站点号！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="站点名称">
              {form.getFieldDecorator('siteName', {
                rules: [{ required: true, message: '请输入站点名称！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="区域">
              {form.getFieldDecorator('organId', {
                rules: [{ required: true, message: '请选择区域！' }],
              })(<TreeSelect treeData={treeList} style={{ width: '100%' }} placeholder="请选择" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="地址">
              {form.getFieldDecorator('address', {
                rules: [{ required: true, message: '请输入地址！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="经度">
              {form.getFieldDecorator('longitude', {
                rules: [{ required: true, validator: checkLongitude }],
              })(<InputNumber style={{ width: '100%' }} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="纬度">
              {form.getFieldDecorator('latitude', {
                rules: [{ required: true, validator: checkLatitude }],
              })(<InputNumber style={{ width: '100%' }} placeholder="请输入" />)}
            </FormItem>
          </Col>
          {siteType === '1' ? siteTypeForm : null}
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="站点负责人">
              {form.getFieldDecorator('siteReponsible', {
                rules: [{ required: true, message: '请输入站点负责人！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="电话">
              {form.getFieldDecorator('reponsibleTel', {
                rules: [{ required: true, validator: checkPhone }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="建造公司">
              {form.getFieldDecorator('builderCompany', {
                rules: [{ required: true, message: '请输入建造公司！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="建造负责人">
              {form.getFieldDecorator('builderReponsible', {
                rules: [{ required: true, message: '请输入建造负责人！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="建造负责人电话">
              {form.getFieldDecorator('builderTel', {
                rules: [
                  {
                    required: true,
                    validator: checkPhone,
                  },
                ],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="建造时间">
              {form.getFieldDecorator('time', {
                rules: [{ required: true, message: '请选择建造时间！' }],
              })(<RangePicker style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="进城方向名称">
              {form.getFieldDecorator('forwardDirection', {})(<Input placeholder="进城方向" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="出城方向名称">
              {form.getFieldDecorator('reverseDirection', {})(<Input placeholder="出城方向" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="状态">
              {form.getFieldDecorator('status', {
                initialValue: '1',
                rules: [{ required: true, message: '请选择状态' }],
              })(
                <Radio.Group style={{ width: '100%' }}>
                  {status.map((item, index) => (
                    <Radio key={item} value={`${index}`}>
                      {item}
                    </Radio>
                  ))}
                </Radio.Group>,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="视频延时时间">
              {form.getFieldDecorator('videoTime', {
                rules: [
                  {
                    required: true,
                    message: '请输入视频延时时间',
                  },
                ],
              })(<InputNumber placeholder="时间可为负数" style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          {siteType === '2' && (
            <Col md={12} sm={24}>
              <FormItem hasFeedback label="流媒体通道号">
                {form.getFieldDecorator('mediaNo')(
                  <InputNumber placeholder="请输入" style={{ width: '100%' }} min={0} />,
                )}
              </FormItem>
            </Col>
          )}
        </Row>
        <Row gutter={40}>
          <Col md={12} sm={24}>
            <FormItem label="站点图片">
              {form.getFieldDecorator('siteImg', {})(
                <Upload multiple {...uploadConfig}>
                  <Button>
                    <Icon type="upload" /> 上传站点图片
                  </Button>
                </Upload>,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="下次检定时间">
              {form.getFieldDecorator('verificationDate', {
                rules: [
                  {
                    required: true,
                    message: '请选择下次检定时间',
                  },
                ],
              })(<DatePicker style={{ width: '100%' }} />)}
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
    detail,
    siteType,
    treeList,
    siteTypeChange,
    loading,
  } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();

      handleUpdate(fieldsValue);
    });
  };

  const check = checkAuth(authority[2]);
  const footer = check
    ? {
        footer: [
          <Button key="back" onClick={() => handleModalVisible()}>
            取消
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={okHandle}>
            确定
          </Button>,
        ],
      }
    : { footer: null };

  const style = check
    ? {}
    : {
        border: 0,
        color: 'rgba(0,0,0,.7)',
      };

  const siteTypeForm = (
    <Fragment>
      <Col md={12} sm={24}>
        <FormItem label="最小速度(km)">
          {form.getFieldDecorator('lowSpeed', {
            initialValue: detail.lowSpeed,
          })(
            <InputNumber
              disabled={!check}
              style={{ width: '100%', ...style }}
              placeholder="请输入"
              min={0}
            />,
          )}
        </FormItem>
      </Col>
      <Col md={12} sm={24}>
        <FormItem label="最高速度(km)">
          {form.getFieldDecorator('highSpeed', {
            initialValue: detail.highSpeed,
          })(
            <InputNumber
              disabled={!check}
              style={{ width: '100%', ...style }}
              placeholder="请输入"
              min={0}
            />,
          )}
        </FormItem>
      </Col>
      <Col md={12} sm={24}>
        <FormItem label="超载预警(%)">
          {form.getFieldDecorator('warningLoadRate', {
            initialValue: detail.warningLoadRate,
          })(
            <InputNumber
              disabled={!check}
              style={{ width: '100%', ...style }}
              placeholder="请输入"
              min={0}
            />,
          )}
        </FormItem>
      </Col>
      <Col md={12} sm={24}>
        <FormItem label="超速预警(%)">
          {form.getFieldDecorator('warningSpeedRate', {
            initialValue: detail.warningSpeedRate,
          })(
            <InputNumber
              disabled={!check}
              style={{ width: '100%', ...style }}
              placeholder="请输入"
              min={0}
            />,
          )}
        </FormItem>
      </Col>
      <Col md={12} sm={24}>
        <FormItem label="执法方式">
          {form.getFieldDecorator('lawEnforceType', {
            initialValue: detail.lawEnforceType,
            rules: [{ required: true, message: '请选择执法方式!' }],
          })(
            <Select disabled={!check} style={{ width: '100%', ...style }} placeholder="请选择">
              <Select.Option value={1}>动态执法</Select.Option>
              <Select.Option value={2}>动静结合执法</Select.Option>
            </Select>,
          )}
        </FormItem>
      </Col>
    </Fragment>
  );

  const uploadConfig = {
    name: 'files',
    action: '/result/api/file/v1/fileUpload',
    listType: 'picture',
    accept: '.jpg,.jpeg,.png',
    defaultFileList: detail.siteImg
      ? detail.siteImg.split(',').map((item, index) => {
          return {
            uid: index,
            name: item,
            status: 'done',
            url: imgUrl + item,
            thumbUrl: imgUrl + item,
            filePath: item,
          };
        })
      : [],
    data: {
      type: 2,
      // xbType: detail.siteCode
      xbType: '',
    },
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        if (info.file.response.code === 200) {
          message.success(`${info.file.name} 图片上传成功`);
        } else {
          message.error(`${info.file.name} 上传失败`);
        }
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败`);
      }
    },
  };

  return (
    <Modal
      destroyOnClose
      title={check ? '更新站点' : '站点详情'}
      visible={modalVisible}
      className={themeStyle.formModal}
      onCancel={() => handleModalVisible()}
      width="900px"
      {...footer}
    >
      <div className={themeStyle.formModalBody}>
        <Row gutter={40}>
          <Col md={12} sm={24}>
            <FormItem hasFeedback={check} label="站点类型">
              {form.getFieldDecorator('siteType', {
                initialValue: siteType,
                rules: [{ required: true, message: '请选择站点类型！' }],
              })(
                <Select
                  disabled={!check}
                  style={{ width: '100%', ...style }}
                  placeholder="请选择"
                  onChange={siteTypeChange}
                >
                  <Option value="1">动态检测站</Option>
                  <Option value="2">静态检测站</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback={check} label="站点号">
              {form.getFieldDecorator('siteCode', {
                initialValue: detail.siteCode,
                rules: [{ required: true, message: '请输入站点号！' }],
              })(<Input disabled style={style} />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback={check} label="站点名称">
              {form.getFieldDecorator('siteName', {
                initialValue: detail.siteName,
                rules: [{ required: true, message: '请输入站点名称！' }],
              })(<Input disabled={!check} style={style} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback={check} label="区域">
              {form.getFieldDecorator('organId', {
                initialValue: detail.organId,
                rules: [{ required: true, message: '请选择区域！' }],
              })(
                <TreeSelect
                  disabled={!check}
                  treeData={treeList}
                  style={{ width: '100%', ...style }}
                  placeholder="请选择"
                />,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback={check} label="地址">
              {form.getFieldDecorator('address', {
                initialValue: detail.address,
                rules: [{ required: true, message: '请输入地址！' }],
              })(<Input disabled={!check} style={style} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="经度">
              {form.getFieldDecorator('longitude', {
                initialValue: detail.longitude,
                rules: [{ required: true, validator: checkLongitude }],
              })(
                <InputNumber
                  disabled={!check}
                  style={{ width: '100%', ...style }}
                  placeholder="请输入"
                />,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback label="纬度">
              {form.getFieldDecorator('latitude', {
                initialValue: detail.latitude,
                rules: [{ required: true, validator: checkLatitude }],
              })(
                <InputNumber
                  disabled={!check}
                  style={{ width: '100%', ...style }}
                  placeholder="请输入"
                />,
              )}
            </FormItem>
          </Col>
          {siteType === '1' ? siteTypeForm : null}
          <Col md={12} sm={24}>
            <FormItem hasFeedback={check} label="站点负责人">
              {form.getFieldDecorator('siteReponsible', {
                initialValue: detail.siteReponsible,
                rules: [{ required: true, message: '请输入站点负责人！' }],
              })(<Input disabled={!check} style={style} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback={check} label="电话">
              {form.getFieldDecorator('reponsibleTel', {
                initialValue: detail.reponsibleTel,
                rules: [{ required: true, validator: checkPhone }],
              })(<Input disabled={!check} style={style} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback={check} label="建造公司">
              {form.getFieldDecorator('builderCompany', {
                initialValue: detail.builderCompany,
                rules: [{ required: true, message: '请输入建造公司！' }],
              })(<Input disabled={!check} style={style} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback={check} label="建造负责人">
              {form.getFieldDecorator('builderReponsible', {
                initialValue: detail.builderReponsible,
                rules: [{ required: true, message: '请输入建造负责人！' }],
              })(<Input disabled={!check} style={style} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback={check} label="建造负责人电话">
              {form.getFieldDecorator('builderTel', {
                initialValue: detail.builderTel,
                rules: [
                  {
                    required: true,
                    validator: checkPhone,
                  },
                ],
              })(<Input disabled={!check} style={style} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem hasFeedback={check} label="建造时间">
              {form.getFieldDecorator('time', {
                initialValue: [
                  moment(new Date(detail.builderDate), 'YYYY-MM-DD'),
                  moment(new Date(detail.completeDate), 'YYYY-MM-DD'),
                ],
                rules: [{ required: true, message: '请选择建造时间！' }],
              })(
                <RangePicker
                  disabled={!check}
                  format="YYYY-MM-DD"
                  style={{ ...style, width: '100%' }}
                />,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="进城方向名称">
              {form.getFieldDecorator('forwardDirection', {
                initialValue: detail.forwardDirection,
              })(<Input disabled={!check} style={style} />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="出城方向名称">
              {form.getFieldDecorator('reverseDirection', {
                initialValue: detail.reverseDirection,
              })(<Input disabled={!check} style={style} />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="状态">
              {form.getFieldDecorator('status', {
                initialValue: detail.status,
              })(
                <Radio.Group disabled={!check} style={{ width: '100%', ...style }}>
                  {status.map((item, index) => (
                    <Radio key={item} value={`${index}`}>
                      {item}
                    </Radio>
                  ))}
                </Radio.Group>,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="视频延时时间">
              {form.getFieldDecorator('videoTime', {
                initialValue: detail.videoTime,
                rules: [
                  {
                    required: true,
                    message: '请输入视频延时时间',
                  },
                ],
              })(
                <InputNumber
                  disabled={!check}
                  placeholder="时间可为负数"
                  style={{ width: '100%', ...style }}
                />,
              )}
            </FormItem>
          </Col>
          {siteType === '2' && (
            <Col md={12} sm={24}>
              <FormItem hasFeedback label="流媒体通道号">
                {form.getFieldDecorator('mediaNo', {
                  initialValue: detail.mediaNo,
                })(
                  <InputNumber
                    disabled={!check}
                    placeholder="请输入"
                    style={{ width: '100%', ...style }}
                    min={0}
                  />,
                )}
              </FormItem>
            </Col>
          )}
          <Col md={12} sm={24}>
            <FormItem label="下次检定时间">
              {form.getFieldDecorator('verificationDate', {
                initialValue: moment(new Date(detail.verificationDate), 'YYYY-MM-DD HH:mm:ss'),
                rules: [
                  {
                    required: true,
                    message: '请选择下次检定时间',
                  },
                ],
              })(<DatePicker disabled={!check} style={{ width: '100%', ...style }} />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={40}>
          <Col md={12} sm={24}>
            <FormItem label="站点图片">
              {form.getFieldDecorator('siteImg', {
                initialValue: detail.siteImg,
              })(
                <Upload multiple {...uploadConfig}>
                  {check ? (
                    <Button>
                      <Icon type="upload" /> 上传站点图片
                    </Button>
                  ) : null}
                </Upload>,
              )}
            </FormItem>
          </Col>
        </Row>
      </div>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ system, Site, loading, user }) => ({
  system,
  Site,
  currentUser: user.currentUser,
  loading: loading.models.Site,
  systemLoading: loading.models.system,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    modiaVisible: false,
    updateModalVisible: false,
    unloadYardVisible: false,
    sysSiteBuildVisible: false,
    siteType: '1',
    siteID: 0,
    siteCode: '',
    siteName: '',
    selectedKeys: [],
    selectedRows: [],
    formValues: [],
    expandCheckKeys: [],
    treeFormValue: {},
    detail: {},
    pageBean: { page: 1, pageSize: 10, showTotal: true },
  };

  columns = [
    {
      title: '站点号',
      dataIndex: 'siteCode',
    },
    {
      title: '站点名称',
      dataIndex: 'siteName',
      render: val =>
        val.length > 12 ? <Tooltip title={val}>{val.substring(0, 12) + '...'}</Tooltip> : val,
    },
    {
      title: '站点负责人',
      dataIndex: 'siteReponsible',
    },
    {
      title: '站点类型',
      dataIndex: 'siteType',
      render: val => (val === '1' ? '动态检测站点' : '静态检测站'),
    },
    {
      title: '地址',
      dataIndex: 'address',
      render: val =>
        val.length > 12 ? <Tooltip title={val}>{val.substring(0, 12) + '...'}</Tooltip> : val,
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: val => <Tag color={color[val]}>{status[val]}</Tag>,
    },
    {
      title: '操作',
      width: 160,
      render: (text, record) => (
        <Fragment>
          {checkAuth(authority[2]) ? (
            <Tooltip placement="left" title="设置">
              <Button
                onClick={() => this.showUpdateModal(record.siteCode)}
                type="primary"
                shape="circle"
                icon="setting"
                size="small"
              />
            </Tooltip>
          ) : (
            <Tooltip placement="left" title="详情">
              <Button
                onClick={() => this.showUpdateModal(record.siteCode)}
                type="primary"
                shape="circle"
                icon="eye"
                size="small"
              />
            </Tooltip>
          )}
          {record.siteType === '2' ? (
            checkAuth(authority[5]) ? (
              <Fragment>
                <Divider type="vertical" />
                <Tooltip placement="left" title="卸货场景">
                  <Button
                    onClick={() => this.showUnloadYardModal(record.id)}
                    type="primary"
                    shape="circle"
                    icon="gold"
                    size="small"
                  />
                </Tooltip>
              </Fragment>
            ) : null
          ) : (
            <Fragment>
              {checkAuth(authority[4]) ? (
                <Fragment>
                  <Divider type="vertical" />
                  <Tooltip placement="left" title="站点建设详情">
                    <Button
                      onClick={() => this.showSysSiteBuildModal(record.siteCode)}
                      type="primary"
                      shape="circle"
                      icon="file-search"
                      size="small"
                    />
                  </Tooltip>
                </Fragment>
              ) : null}
              {checkAuth(authority[6]) ? (
                <Fragment>
                  {' '}
                  <Divider type="vertical" />
                  <Tooltip placement="left" title="流媒体通道">
                    <Button
                      onClick={() => this.showModiaModal(record)}
                      type="primary"
                      shape="circle"
                      icon="video-camera"
                      size="small"
                    />
                  </Tooltip>
                </Fragment>
              ) : null}
            </Fragment>
          )}
          {/* {checkAuth(authority[3]) ?
            <Fragment>
              <Divider type="vertical" />
              <Popconfirm
                title="是否删除数据?"
                onConfirm={() => this.dataDel(record.id)}
                okText="确定"
                cancelText="取消"
              >
                <Tooltip placement="left" title="删除">
                  <Button type="danger" shape="circle" icon="delete" size='small' />
                </Tooltip>
              </Popconfirm>
            </Fragment>
            : null} */}
        </Fragment>
      ),
    },
  ];

  /**
   * 流媒体通道
   * @param siteCode
   */
  showModiaModal = record => {
    this.setState({ siteCode: record.siteCode, siteName: record.siteName }, () => {
      this.handModiaVisible(true);
    });
  };
  /**
   * 显示
   * @param id
   */
  showUnloadYardModal = id => {
    this.setState({ siteID: id }, () => {
      this.handleUnloadYardVisible(true);
    });
  };

  /**
   * 站点建设详情 Modal
   * @param siteCode
   */
  showSysSiteBuildModal = siteCode => {
    this.setState({ siteCode }, () => {
      this.handleSysSiteBuildVisible(true);
    });
  };

  /**
   * 站点类型 change
   * @param e
   */
  siteTypeChange = e => {
    this.setState({ siteType: e });
  };

  /**
   * 显示编辑窗口
   * @param code
   */
  showUpdateModal = code => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Site/detail',
      payload: { siteCode: code },
      callback: res => {
        this.setState({ siteType: res.siteType, detail: res });
        this.handleUpdateModalVisible(true);
      },
    });
  };

  // /**
  //  * 单个删除
  //  * @param id
  //  */
  // dataDel = id => {
  //   this.delUtil(id);
  // };

  // /**
  //  * 批量删除
  //  */
  // delBatch = () => {
  //   const { selectedRows } = this.state;
  //   if (!selectedRows) return;
  //   const self = this;
  //   Modal.confirm({
  //     title: '批量删除',
  //     content: '您确定要批量删除吗?',
  //     okText: '确定',
  //     okType: 'danger',
  //     cancelText: '取消',
  //     onOk() {
  //       self.delUtil(selectedRows.map(item => item.id).join());
  //     },
  //     onCancel() {
  //     },
  //   });
  // };

  // delUtil = ids => {
  //   const { dispatch } = this.props;
  //   const { pageBean } = this.state;
  //   dispatch({
  //     type: 'Site/remove',
  //     payload: { ids },
  //     callback: () => {
  //       this.getList({
  //         pageBean,
  //       });
  //       this.setState({
  //         selectedRows: []
  //       })
  //     }
  //   })
  // };

  componentDidMount() {
    if (!checkAuth(authority[0])) return;
    const { pageBean } = this.state;
    const organId = localStorage.getItem('organId');
    this.getList({
      pageBean: pageBean,
      querys: [
        {
          property: 'organId',
          value: organId,
          group: 'main',
          operation: 'RIGHT_LIKE',
          relation: 'AND',
        },
        // , {
        // group: "main",
        // operation: "LIKE",
        // property: "status",
        // relation: "AND",
        // value: "1"
        // }
      ],
    });
  }

  getList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Site/fetch',
      payload: params,
    });
  };

  /**
   * 分页请求
   * @param pagination
   * @param filtersArg
   * @param sorter
   */
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { currentUser } = this.props;
    const { formValues, treeFormValue } = this.state;
    let arr = [];
    if (JSON.stringify(treeFormValue) !== '{}') {
      arr.push(treeFormValue);
    } else {
      arr.unshift({
        property: 'organId',
        value: currentUser.organId,
        group: 'main',
        operation: 'RIGHT_LIKE',
        relation: 'AND',
      });
    }
    this.getList({
      pageBean: {
        page: pagination.current,
        pageSize: pagination.pageSize,
        showTotal: true,
      },
      querys: arr.concat(formValues),
    });
  };

  /**
   * 重置搜索表单
   */
  handleFormReset = () => {
    const { form, currentUser } = this.props;
    const { pageBean } = this.state;
    form.resetFields();
    this.setState({
      formValues: [],
      treeFormValue: {},
      selectedKeys: [],
    });
    this.getList({
      pageBean,
      querys: [
        {
          property: 'organId',
          value: currentUser.organId,
          group: 'main',
          operation: 'RIGHT_LIKE',
          relation: 'AND',
        },
      ],
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  /**
   * 搜索
   * @param e
   */
  handleSearch = e => {
    e.preventDefault();
    const { form, currentUser } = this.props;
    const { treeFormValue, pageBean } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
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
              operation: item === 'static' ? 'EQUAL' : 'LIKE',
              relation: 'AND',
            }
          : '';
      });
      const conditionFilter = condition.filter(item => item);
      this.setState({
        formValues: JSON.parse(JSON.stringify(conditionFilter)),
      });
      if (JSON.stringify(treeFormValue) !== '{}') {
        conditionFilter.push(treeFormValue);
      } else {
        conditionFilter.push({
          group: 'main',
          operation: 'RIGHT_LIKE',
          property: 'organId',
          relation: 'AND',
          value: currentUser.organId,
        });
      }
      this.getList({
        pageBean,
        querys: conditionFilter,
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handModiaVisible = flag => {
    this.setState({ modiaVisible: !!flag });
    if (!!!flag) {
      this.setState({ siteCode: '' });
    }
  };

  handleUpdateModalVisible = flag => {
    this.setState({
      updateModalVisible: !!flag,
    });
    if (!!!flag) {
      this.setState({ siteType: '1', detail: {} });
    }
  };

  handleSysSiteBuildVisible = flag => {
    this.setState({ sysSiteBuildVisible: !!flag });
    if (!!!flag) {
      this.setState({ siteCode: '' });
    }
  };

  handleUnloadYardVisible = flag => {
    this.setState({ unloadYardVisible: !!flag });
    if (!!!flag) this.setState({ siteID: 0 });
  };

  handleAdd = (fields, callback) => {
    const { dispatch, currentUser } = this.props;
    const { pageBean, formValues, treeFormValue } = this.state;
    fields.builderDate = fields.time[0].format();
    fields.completeDate = fields.time[1].format();
    fields.verificationDate = fields.verificationDate.format('YYYY-MM-DD');

    fields.forwardDirection = fields.forwardDirection || '进城方向';
    fields.reverseDirection = fields.reverseDirection || '出城方向';

    delete fields.time;
    if (fields.siteImg) {
      fields.siteImg = fields.siteImg.fileList.map(item => item.response.filePath).join();
    }
    if (fields.siteType === '2') {
      delete fields.lawEnforceType;
    }
    dispatch({
      type: 'Site/add',
      payload: fields,
      callback: () => {
        message.success('添加成功');
        this.handleModalVisible();

        const conditionFilter = Object.assign([], formValues);

        if (JSON.stringify(treeFormValue) !== '{}') {
          conditionFilter.push(treeFormValue);
        } else {
          conditionFilter.push({
            group: 'main',
            operation: 'RIGHT_LIKE',
            property: 'organId',
            relation: 'AND',
            value: currentUser.organId,
          });
        }

        this.getList({
          pageBean,
          querys: conditionFilter,
        });
        callback();
      },
    });
  };

  handleUpdate = fields => {
    const { dispatch, currentUser } = this.props;
    const { pageBean, detail, formValues, treeFormValue } = this.state;
    fields.builderDate = fields.time[0].format();
    fields.completeDate = fields.time[1].format();
    fields.verificationDate = fields.verificationDate.format('YYYY-MM-DD');
    fields.forwardDirection = fields.forwardDirection || '进城方向';
    fields.reverseDirection = fields.reverseDirection || '出城方向';
    delete fields.time;
    const arr = JSON.parse(JSON.stringify(detail));
    const keys = Object.keys(fields);
    for (let i = 0; i < keys.length; i++) {
      arr[keys[i]] = fields[keys[i]];
    }
    if (typeof arr.siteImg === 'object') {
      arr.siteImg = arr.siteImg.fileList
        .map(item => (item.response ? item.response.filePath : item.filePath))
        .join();
    }
    this.setState({ detail: arr });
    dispatch({
      type: 'Site/update',
      payload: arr,
      callback: () => {
        message.success('更新成功');
        this.handleUpdateModalVisible();

        const conditionFilter = Object.assign([], formValues);

        if (JSON.stringify(treeFormValue) !== '{}') {
          conditionFilter.push(treeFormValue);
        } else {
          conditionFilter.push({
            group: 'main',
            operation: 'RIGHT_LIKE',
            property: 'organId',
            relation: 'AND',
            value: currentUser.organId,
          });
        }

        this.getList({ pageBean, querys: conditionFilter });
      },
    });
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
              {getFieldDecorator('siteCode')(<Input addonBefore="站点号" placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('siteName')(<Input addonBefore="站点名称" placeholder="请输入" />)}
            </FormItem>
          </Col>

          <Col md={5} sm={24}>
            <div className={publicCss.inputMain}>
              <span
                style={{ width: '80px', lineHeight: '30px', height: '32px' }}
                className="ant-input-group-addon"
              >
                站点类型
              </span>
              <FormItem style={{ flex: 1 }}>
                {getFieldDecorator('siteType')(
                  <Select placeholder="请选择" className={publicCss.inputGroupLeftRadius}>
                    <Option value="1">非现场站点</Option>
                    <Option value="2">精简站</Option>
                  </Select>,
                )}
              </FormItem>
            </div>
          </Col>

          <Col md={5} sm={24}>
            <FormItem>
              {getFieldDecorator('status')(
                <Radio.Group>
                  {status.map((item, index) => (
                    <Radio key={index} value={`${index}`}>
                      {item}
                    </Radio>
                  ))}
                </Radio.Group>,
              )}
            </FormItem>
          </Col>

          <Col md={4} sm={24}>
            <span className={styles.submitButtons} style={{ float: 'right' }}>
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

  /**
   * 树形选择
   * @param selectedKeys
   * @param info
   */
  onSelect = (selectedKeys, info) => {
    if (!selectedKeys[0]) return;
    this.setState({ selectedKeys: selectedKeys });
    const { formValues, pageBean } = this.state;
    let arr = [];
    const treeFormValue = {
      property: 'organId',
      value: selectedKeys[0],
      group: 'main',
      operation: 'RIGHT_LIKE',
      relation: 'AND',
    };
    this.setState({ treeFormValue: treeFormValue });
    arr.push(treeFormValue);
    arr = arr.concat(formValues);
    this.getList({
      pageBean,
      querys: arr,
    });
  };

  expandCheck = keys => {
    this.setState({ expandCheckKeys: keys });
  };

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <Tree.TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </Tree.TreeNode>
        );
      }
      return <Tree.TreeNode {...item} />;
    });

  render() {
    const {
      system: { treeList },
      Site: { data },
      loading,
      systemLoading,
    } = this.props;
    const {
      modalStaticVisible,
      detail,
      selectedRows,
      modalVisible,
      updateModalVisible,
      modiaVisible,
      siteType,
      expandCheckKeys,
      selectedKeys,
      unloadYardVisible,
      siteID,
      siteCode,
      siteName,
      sysSiteBuildVisible,
    } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      siteType,
      treeList,
      siteTypeChange: this.siteTypeChange,
    };

    const updateMethods = {
      handleUpdate: this.handleUpdate,
      handleModalVisible: this.handleUpdateModalVisible,
      siteTypeChange: this.siteTypeChange,
      detail,
      siteType,
      treeList,
      loading,
    };

    const unloadYardMethods = {
      siteID,
      handleModalVisible: this.handleUnloadYardVisible,
    };

    const modiaMethods = {
      siteCode,
      siteName,
      handleModalVisible: this.handModiaVisible,
    };

    const sysSiteBuildMethods = {
      siteCode,
      handleModalVisible: this.handleSysSiteBuildVisible,
    };

    const tabConfig = {
      loading,
      size: 'middle',
      data,
      tableAlert: false,
      columns: this.columns,
      onChange: this.handleStandardTableChange,
    };

    return (
      <Fragment>
        {checkAuth(authority[0]) ? null : <Redirect to="/exception/403" />}

        <div className={styles.tableMain}>
          <Spin spinning={systemLoading}>
            <div className={styles.treeLeft}>
              <Tree
                selectedKeys={selectedKeys}
                showLine
                onSelect={this.onSelect}
                expandedKeys={
                  expandCheckKeys[0] ? expandCheckKeys : [treeList[0] ? treeList[0].key : '']
                }
                onExpand={this.expandCheck}
              >
                {this.renderTreeNodes(treeList)}
              </Tree>
            </div>
          </Spin>
          <div className={styles.rightTable}>
            <Card bordered={false} style={{ height: '100%' }}>
              <div className={styles.tableList}>
                <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
                <div className={styles.tableListOperator}>
                  {checkAuth(authority[1]) ? (
                    <Button
                      icon="plus"
                      type="primary"
                      onClick={() => this.handleModalVisible(true)}
                    >
                      新建
                    </Button>
                  ) : null}
                  {/* {selectedRows.length > 0 && (
                  <span>
                    <Button type="danger" onClick={() => this.handleModalStaticVisible(true)}>批量操作</Button>
                  </span>
                )} */}
                </div>
                <StandardTable selectedRows={0} rowSelection={null} {...tabConfig} />
                {/* {checkAuth(authority[3]) ? <StandardTable
                tableAlert={true}
                selectedRows={selectedRows}
                onSelectRow={this.handleSelectRows}
                {...tabConfig}
              /> : <StandardTable
                  selectedRows={0}
                  rowSelection={null}
                  {...tabConfig}
                />} */}
              </div>
            </Card>
          </div>
        </div>

        <CreateForm {...parentMethods} modalVisible={modalVisible} />
        {updateModalVisible && JSON.stringify(detail) !== '{}' ? (
          <UpdateForm {...updateMethods} modalVisible={updateModalVisible} />
        ) : null}

        {unloadYardVisible && siteID ? (
          <UnloadYardModal {...unloadYardMethods} modalVisible={unloadYardVisible} />
        ) : null}
        {sysSiteBuildVisible && siteCode ? (
          <SysSiteBuildModal {...sysSiteBuildMethods} modalVisible={sysSiteBuildVisible} />
        ) : null}
        {modiaVisible && siteCode ? <Modia {...modiaMethods} modalVisible={modiaVisible} /> : null}
      </Fragment>
    );
  }
}

export default TableList;
