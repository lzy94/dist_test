import React, { Fragment } from 'react';
import {
  Avatar,
  Menu,
  Spin,
  Icon,
  Modal,
  Form,
  Input,
  message,
  Upload,
  Button,
  AutoComplete,
  notification,
  Row,
  Col,
  TreeSelect,
  Checkbox,
} from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import router from 'umi/router';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import {
  imgUrl,
  emailSuffix,
  checkPhone,
  getLocalStorage,
  socketUrl,
  fileUrl,
  isTraffic,
  getPlan,
} from '@/utils/utils';
import themeStyle from '@/pages/style/theme.less';

const plan = getPlan();

const FormItem = Form.Item;
const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleVisible, handleConfirmBlur, confirmDirty } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };

  const compareToFirstPassword = (rule, value, callback) => {
    if (value && value !== form.getFieldValue('newPwd')) {
      callback('您输入的两个密码不一致！');
    } else {
      callback();
    }
  };

  const validateToNextPassword = (rule, value, callback) => {
    if (value && confirmDirty) {
      form.validateFields(['okPwd'], { force: true });
    }
    callback();
  };

  return (
    <Modal
      destroyOnClose
      title="修改密码"
      className={themeStyle.formModal}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleVisible()}
    >
      <div className={themeStyle.formModalBody}>
        <FormItem label="旧密码">
          {form.getFieldDecorator('oldPwd', {
            rules: [{ required: true, message: '请输入旧密码' }],
          })(<Input type="password" placeholder="请输入" />)}
        </FormItem>
        <FormItem hasFeedback label="新密码">
          {form.getFieldDecorator('newPwd', {
            rules: [
              { required: true, min: 6, message: '请输入新密码且密码必须大于或等于六位数' },
              {
                validator: validateToNextPassword,
              },
            ],
          })(<Input type="password" placeholder="请输入" />)}
        </FormItem>
        <FormItem hasFeedback label="确认密码">
          {form.getFieldDecorator('okPwd', {
            rules: [
              { required: true, min: 6, message: '请输入旧密码' },
              {
                validator: compareToFirstPassword,
              },
            ],
          })(<Input type="password" placeholder="请输入" onBlur={handleConfirmBlur} />)}
        </FormItem>
      </div>
    </Modal>
  );
});

const PersonalModal = Form.create()(props => {
  const {
    modalVisible,
    form,
    handleUpdate,
    handleVisible,
    emailInputChange,
    emailSuffixSour,
    detail,
    treeList,
    siteList,
    treeSelectChange,
    photeFileList,
    photeChange,
    lawCardImgChange,
    lawCardImgFileList,
  } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleUpdate(fieldsValue, () => form.resetFields());
    });
  };
  const treeChange = e => {
    form.setFieldsValue({
      siteIds: [],
      staticSite: [],
    });
    treeSelectChange(e);
  };

  const uploadConfig = {
    name: 'files',
    action: '/result/api/file/v1/fileUpload',
    listType: 'picture',
    accept: '.jpg,.jpeg,.png',
    className: 'upload-list-inline',
    data: {
      type: 1,
      // xbType: editModalData.id,
      xbType: '',
    },
    headers: {
      Authorization: `Bearer ${getLocalStorage('token')[0]}`,
      'x-requested-with': 'XMLHttpRequest',
    },
  };

  return (
    <Modal
      destroyOnClose
      title="个人信息"
      className={themeStyle.formModal}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleVisible()}
      width="900px"
    >
      <div className={themeStyle.formModalBody}>
        <Row gutter={40}>
          <Col md={12} sm={24}>
            <FormItem label="用户头像">
              {form.getFieldDecorator('photo', {
                initialValue: detail.photo,
              })(
                <Upload {...uploadConfig} defaultFileList={photeFileList} onChange={photeChange}>
                  {photeFileList.length > 0 ? null : (
                    <Button>
                      <Icon type="upload" /> 头像上传
                    </Button>
                  )}
                </Upload>,
              )}
            </FormItem>
            <FormItem label="名称" hasFeedback>
              {form.getFieldDecorator('fullname', {
                initialValue: detail.fullname,
                rules: [{ required: true, message: '请输入用户名称' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem label="登录账号">
              {form.getFieldDecorator('account', {
                initialValue: detail.account,
                rules: [{ required: true, message: '请输入登录账号！' }],
              })(<Input placeholder="请输入" disabled />)}
            </FormItem>
            <FormItem label="电话号码" hasFeedback>
              {form.getFieldDecorator('mobile', {
                initialValue: detail.mobile,
                rules: [
                  {
                    required: true,
                    validator: checkPhone,
                  },
                ],
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem hasFeedback label="职务">
              {form.getFieldDecorator('position', {
                initialValue: detail.position,
                rules: [{ required: true, message: '请输入职务' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem label="执法证件号">
              {form.getFieldDecorator('lawCard', {
                initialValue: detail.lawCard,
                rules: [{ message: '请输入执法证件号！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem label="执法证件图片">
              {form.getFieldDecorator('lawCardImg', {
                initialValue: detail.lawCardImg,
              })(
                <Upload
                  {...uploadConfig}
                  defaultFileList={lawCardImgFileList}
                  onChange={lawCardImgChange}
                >
                  {lawCardImgFileList.length > 0 ? null : (
                    <Button>
                      <Icon type="upload" /> 执法证件图片
                    </Button>
                  )}
                </Upload>,
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="证件号码">
              {form.getFieldDecorator('idCard', {
                initialValue: detail.idCard,
                rules: [{ message: '请输入证件号码！' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem label="邮箱">
              {form.getFieldDecorator('email', {
                initialValue: detail.email,
                rules: [{ message: '请输入用户的邮箱！' }],
              })(
                <AutoComplete
                  dataSource={emailSuffixSour}
                  style={{ width: '100%' }}
                  onChange={emailInputChange}
                  placeholder="请输入"
                />,
              )}
            </FormItem>
            <FormItem label="区域" hasFeedback>
              {form.getFieldDecorator('organId', {
                initialValue: [detail.organId],
                rules: [{ required: true, message: '请选择区域！' }],
              })(
                <TreeSelect
                  disabled
                  treeData={treeList}
                  style={{ width: '100%' }}
                  placeholder="请输入"
                  // onChange={treeChange}
                />,
              )}
            </FormItem>
            <FormItem label="部门">
              {form.getFieldDecorator('department', {
                rules: [{ required: true, message: '请选择部门' }],
                initialValue: detail.department ? detail.department.split(',') : [],
              })(
                <Checkbox.Group>
                  {plan[0].map((item, i) => (
                    <Checkbox value={item} key={i}>
                      {plan[1][i]}
                    </Checkbox>
                  ))}
                </Checkbox.Group>,
              )}
            </FormItem>
            {isTraffic() ? (
              <Fragment>
                <FormItem label="非现场站点">
                  {form.getFieldDecorator('siteIds', {
                    initialValue: detail.siteIds ? detail.siteIds.split(',') : [],
                  })(
                    <TreeSelect
                      disabled={detail.account === 'admin' ? false : true}
                      placeholder="请选择站点"
                      treeCheckable
                      treeData={siteList[0]}
                      style={{ width: '100%' }}
                    />,
                  )}
                </FormItem>
                <FormItem label="精简站">
                  {form.getFieldDecorator('staticSite', {
                    initialValue: detail.staticSite ? detail.staticSite.split(',') : [],
                  })(
                    <TreeSelect
                      disabled={detail.account === 'admin' ? false : true}
                      placeholder="请选择站点"
                      treeCheckable
                      treeData={siteList[1]}
                      style={{ width: '100%' }}
                    />,
                  )}
                </FormItem>
              </Fragment>
            ) : null}
            <FormItem label="地址">
              {form.getFieldDecorator('address', {
                initialValue: detail.address,
                rules: [{ message: '请输入用户地址！' }],
              })(<Input.TextArea placeholder="请输入" />)}
            </FormItem>
          </Col>
        </Row>
      </div>
    </Modal>
  );
});

let stompClient = null;

@Form.create()
class AvatarDropdown extends React.Component {
  state = {
    visible: false,
    personalVisible: false,
    confirmDirty: false,
    detail: {},
    emailSuffixSour: [],
    defaultFileList: [],
    lawCardImgFileList: [],
  };

  componentDidMount() {
    document.title = '智慧交通治理平台';
    if (localStorage.getItem('menuType') === '-1') {
      this.initWebSocket();
    }
  }

  componentWillUnmount() {
    // 关闭socket
    if (stompClient) {
      stompClient.disconnect();
      stompClient = null;
    }
  }

  initWebSocket = () => {
    this.connection();
  };

  onMessage = msg => {
    // const body = JSON.parse(msg.body);
    // console.log('广播成功-' + body.siteCode);
    // console.log(msg.body); // msg.body存放的是服务端发送给我们的信息
    const m = JSON.parse(msg.body);
    if (m.isWaring === 1) {
      const speechSU = new window.SpeechSynthesisUtterance();
      speechSU.text = m.msg;
      speechSU.lang = 'zh-CN';
      // eslint-disable-next-line compat/compat
      window.speechSynthesis.speak(speechSU);
      notification.open({
        description: m.msg,
        placement: 'bottomRight',
        style: {
          background: 'rgba(146,220,238,.5)',
        },
        onClick: () => {
          console.log('Notification Clicked!');
        },
      });
    }
  };

  connection = () => {
    // const { currentUser } = this.props;
    const siteIds = localStorage.getItem('siteIds');
    // const siteIds = '0';
    const socket = new SockJS(socketUrl);
    stompClient = Stomp.over(socket);
    const headers = {
      Authorization: '',
    };
    stompClient.debug = null;
    // 向服务器发起websocket连接
    stompClient.connect(
      headers,
      () => {
        siteIds
          ? siteIds.split(',').map(item => {
              stompClient.subscribe(`/topic/${item}`, this.onMessage);
            })
          : null;
      },
      err => {
        console.log('失败');
        console.log(err);
        // this.connection();
      },
    );
  };

  handleVisible = flag => {
    this.setState({
      visible: !!flag,
    });
  };

  handlePersonalVisible = flag => {
    this.setState({
      personalVisible: !!flag,
    });
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    const { confirmDirty } = this.state;
    this.setState({ confirmDirty: confirmDirty || !!value });
  };

  emailInputChange = value => {
    this.setState({
      emailSuffixSour: emailSuffix(value),
    });
  };

  handleAdd = fileds => {
    const { currentUser, dispatch } = this.props;
    fileds['account'] = currentUser.account;
    fileds['userId'] = currentUser.userId;
    dispatch({
      type: 'login/changpass',
      payload: fileds,
      callback: () => {
        message.success('修改成功');
        this.handleVisible(false);
      },
    });
  };

  handleUpdate = (fields, callback) => {
    const { dispatch } = this.props;
    const { detail } = this.state;
    if (typeof fields.photo === 'object') {
      const response = fields.photo.file.response;
      fields.photo = response ? response.filePath : '';
    }
    if (typeof fields.lawCardImg === 'object') {
      const response = fields.lawCardImg.file.response;
      fields.lawCardImg = response ? response.filePath : '';
    }
    delete fields.organId;
    // delete fields.siteIds;
    // delete fields.staticSite;
    if (typeof fields.organId === 'object') {
      fields.organId = fields.organId[0];
    }
    if (isTraffic()) {
      fields.siteIds = fields.siteIds ? fields.siteIds.join() : '';
      fields.staticSite = fields.staticSite ? fields.staticSite.join() : '';
    }
    fields.department = fields.department.join();
    const keys = Object.keys(fields);
    const newData = JSON.parse(JSON.stringify(detail));
    for (let i in keys) {
      newData[keys[i]] = fields[keys[i]];
    }
    this.setState({ detail: newData });
    dispatch({
      type: 'user/updateUser',
      payload: newData,
      callback: () => {
        message.success('更新成功');
        callback && callback();
        setTimeout(() => {
          dispatch({
            type: 'user/fetchCurrent',
          });
          this.handlePersonalVisible();
        }, 500);
      },
    });
  };

  lawCardImgChange = info => {
    if (info.file.status === 'done') {
      if (info.file.response.code === 200) {
        message.success('上传成功');
        this.setState({ lawCardImgFileList: info.fileList });
      } else {
        message.error(info.file.response.code.msg);
      }
    } else if (info.file.status === 'error') {
      message.error('上传失败');
    } else if (info.file.status === 'removed') {
      this.setState({ lawCardImgFileList: info.fileList });
    }
  };

  photeChange = info => {
    if (info.file.status === 'done') {
      if (info.file.response.code === 200) {
        message.success('上传成功');
        this.setState({ photeFileList: info.fileList });
      } else {
        message.error(info.file.response.code.msg);
      }
    } else if (info.file.status === 'error') {
      message.error('上传失败');
    } else if (info.file.status === 'removed') {
      this.setState({ photeFileList: info.fileList });
    }
  };

  treeSelectChange = (value, label) => {
    this.getSite(value);
  };

  getSite = value => {
    const { dispatch } = this.props;
    dispatch({
      type: 'systemUser/getSite',
      payload: {
        pageBean: {
          page: 1,
          pageSize: 1000,
          showTotal: true,
        },
        querys: [
          {
            property: 'status',
            value: '0',
            group: 'main',
            operation: 'NOT_EQUAL',
            relation: 'AND',
          },
          {
            property: 'organId',
            value: value,
            group: 'main',
            operation: 'RIGHT_LIKE',
            relation: 'OR',
          },
        ],
      },
    });
  };

  onMenuClick = event => {
    const { key } = event;
    const { dispatch, currentUser, resetSelectIndex } = this.props;
    if (key === 'logout') {
      if (dispatch) {
        dispatch({
          type: 'login/logout',
        });
        resetSelectIndex();
      }
    } else if (key === 'pass') {
      this.handleVisible(true);
    } else {
      if (dispatch) {
        dispatch({
          type: 'systemUser/detailData',
          payload: {
            account: currentUser.account,
          },
          callback: res => {
            this.setState({
              detail: res,
              photeFileList: res.photo
                ? [
                    {
                      uid: '-1',
                      name: res.fullname,
                      status: 'done',
                      url: imgUrl + res.photo,
                    },
                  ]
                : [],
              lawCardImgFileList: res.lawCardImg
                ? [
                    {
                      uid: '-1',
                      name: '当前图片',
                      status: 'done',
                      url: imgUrl + res.lawCardImg,
                    },
                  ]
                : [],
            });
            this.handlePersonalVisible(true);
            this.getSite(res.organId);
          },
        });
      }
    }
    // router.push(`/account/${key}`);
  };

  render() {
    const {
      currentUser = {},
      menu,
      systemUser: { siteList },
      system: { treeList },
    } = this.props;
    const {
      confirmDirty,
      personalVisible,
      visible,
      emailSuffixSour,
      detail,
      photeFileList,
      lawCardImgFileList,
    } = this.state;
    // const {isPhoto} = this.state;
    // if (!menu) {
    //   return (
    //     <span className={`${styles.action} ${styles.account}`}>
    //       <Avatar size="small" className={styles.avatar} src={currentUser.avatar} alt="avatar" />
    //       <span className={styles.name}>{currentUser.name}</span>
    //     </span>
    //   );
    // }

    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        <Menu.Item key="personalInformation">
          <Icon type="user" />
          <FormattedMessage
            id="menu.change.personalInformation"
            defaultMessage="Personal information"
          />
        </Menu.Item>
        <Menu.Item key="pass">
          <Icon type="unlock" />
          <FormattedMessage id="menu.change.password" defaultMessage="change password " />
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" />
          <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
        </Menu.Item>
      </Menu>
    );

    const config = {
      handleVisible: this.handleVisible,
      handleAdd: this.handleAdd,
      handleConfirmBlur: this.handleConfirmBlur,
      confirmDirty: confirmDirty,
    };
    const personalMethods = {
      handleVisible: this.handlePersonalVisible,
      emailInputChange: this.emailInputChange,
      handleUpdate: this.handleUpdate,
      emailSuffixSour: emailSuffixSour,
      detail: detail,
      treeList: treeList,
      siteList: siteList,
      photeFileList: photeFileList,
      lawCardImgFileList: lawCardImgFileList,
      photeChange: this.photeChange,
      lawCardImgChange: this.lawCardImgChange,
      treeSelectChange: this.treeSelectChange,
    };

    return (
      <React.Fragment>
        {' '}
        {currentUser && currentUser.fullname ? (
          <HeaderDropdown overlay={menuHeaderDropdown}>
            {/*<span className={`${styles.action} ${styles.account}`}>*/}
            {/*    /!*src={currentUser.photo}*!/*/}
            {/*    <Avatar style={{backgroundColor: '#fde3cf' }} className={styles.avatar} src={imgUrl + currentUser.photo}  alt="avatar"/>*/}
            {/*    <span className={styles.name}>{currentUser.fullname}</span>*/}
            {/*</span>*/}
            <span
              style={{
                height: '100%',
                display: 'inline-block',
                cursor: 'pointer',
                padding: '0 12px',
              }}
              className={`${styles.action} ${styles.account}`}
            >
              <Avatar
                style={{ backgroundColor: '#fde3cf', marginRight: 5 }}
                size="small"
                className={styles.avatar}
                src={imgUrl + currentUser.photo}
                alt="avatar"
              />
              <span className={styles.name}>{currentUser.fullname}</span>
            </span>
          </HeaderDropdown>
        ) : (
          <Spin
            size="small"
            style={{
              marginLeft: 8,
              marginRight: 8,
            }}
          />
        )}
        <CreateForm {...config} modalVisible={visible} />
        {personalVisible && JSON.stringify(currentUser) !== '{}' ? (
          <PersonalModal {...personalMethods} modalVisible={personalVisible} />
        ) : null}
      </React.Fragment>
    );
  }
}

export default connect(({ user, systemUser, system }) => ({
  user,
  system,
  systemUser,
  currentUser: user.currentUser,
}))(AvatarDropdown);
