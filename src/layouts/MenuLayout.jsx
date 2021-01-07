/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import { connect } from 'dva';
import React, { useState } from 'react';
import Link from 'umi/link';
import moment from 'moment';
import Avatar from '@/components/GlobalHeader/AvatarDropdown';
import { Layout, Menu, Icon, Badge, Tooltip, Popover } from 'antd';
import { getLocalStorage, imgUrl } from '@/utils/utils';
import MsgListModal from '@/pages/traffic/overview/dynamic/modal/msgListModal';
import style from './menuLayout.less';
import iconStyle from '@/assets/font/iconfont.css';
import logoSmall from '@/assets/login/logo.png';
import textLogo from '@/assets/textLogo.png';
import notImg from '@/assets/notImg.png';
import phone from '@/assets/phone.png';

const { Header, Content, Sider, Footer } = Layout;

/**
 * 加载一级菜单
 * @param list
 * @returns {*}
 */
const parentMenu = list => {
  return list.map((item, i) => {
    return (
      <Menu.Item key={i}>
        <span className={style.topMenuSpan}>{item.name}</span>
      </Menu.Item>
    );
  });
};

const childMenu = (list, collapsed) => {
  if (!list) return '';
  const isColl = !!collapsed;
  return list.children.map((item, i) => {
    return (
      <Menu.Item key={i}>
        <Link to={item.path} style={isColl ? null : { paddingLeft: 20 }}>
          <i
            className={`${iconStyle.iconfont} ${iconStyle[item.icon]}`}
            style={{ marginRight: 20, fontSize: 22 }}
          />
          <span className={style.textJustify}>{item.name}</span>
        </Link>
      </Menu.Item>
    );
  });
};
let selectIndex = 0;

const getIndex = (menu = [], index = 0, dispatch) => {
  let path = '';
  if (/#/.test(window.location.href)) {
    path = window.location.hash.replace('#', '');
  } else {
    path = window.location.pathname;
  }

  if (JSON.stringify(menu) === '[]') return 0;
  const parentPath = path.split('/').filter(item => item)[0];
  for (let i = 0; i < menu.length; i += 1) {
    if (menu[i].path === `/${parentPath}`) {
      // console.log(i)
      // dispatch({
      //   type: 'menu/getChildMenu',
      //   payload: {index: i},
      //   callback(obj) {
      //   }
      // });
      break;
    }
  }

  for (let i = 0; i < menu[index].children.length; i += 1) {
    if (menu[index].children[i].path === path) {
      selectIndex = i;
      break;
    }
  }
};

const MenuLayout = props => {
  localStorage.setItem('menuType', -1);
  const {
    dispatch,
    children,
    menu,
    system: { warningMsgNotDuCount, warningMsgVisible },
    QrcodeSystem: { data },
  } = props;
  const { menuData, childrenMenu, menuKeys, collapsed } = menu;
  const menuClick = e => {
    const index = e.key;
    selectIndex = 0;
    dispatch({
      type: 'menu/getChildMenu',
      payload: { index },
      callback(obj) {
        props.history.push(menuData[obj].children[0].path);
      },
    });
  };
  const menuChildClick = e => {
    selectIndex = e.key;
  };

  const resetSelectIndex = () => {
    selectIndex = 0;
  };

  const toggle = flag => {
    dispatch({
      type: 'menu/toggleMenu',
      payload: !flag,
    });
  };
  // 7 22
  const showNewWindow = url => {
    let path = url;
    if (/#/.test(window.location.href)) {
      path = `/#${url}`;
    }
    window.open(
      path,
      '',
      `width=${window.screen.availWidth},height=${window.screen.availHeight -
        65},top=0,left=0,resizable=yes,status=yes,menubar=no,scrollbars=yes`,
    );
  };

  const showMessage = flag => {
    dispatch({
      type: 'system/handleWarningMsgVisible',
      payload: !!flag,
    });
  };

  const showDay = () => {
    const {
      system: { treeList, address },
    } = props;
    if (!treeList.length) return '';
    const cap = ['', '一', '二', '三', '四', '五', '六', '日'];
    const day = moment().format('YYYY年MM月DD日');
    const week = cap[moment().format('E')];
    return (
      <>
        <p title={address}>
          <Icon type="environment" theme="filled" />
          &nbsp;&nbsp;{address}
        </p>
        <span>
          {day}&nbsp;&nbsp;&nbsp;星期{week}
        </span>
      </>
    );
  };

  const switchMenu = () => {
    // props.history.push('/');
    props.history.push('/');
  };

  useState(() => {
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
        callback: res => {
          dispatch({
            type: 'system/getTree',
            payload: {
              cityCode: res.organId,
            },
          });
          // dispatch({
          //   type: 'system/warningMsgNotDu',
          //   payload: { siteCodes: res.siteIds },
          // });
        },
      });
      dispatch({
        type: 'settings/getSetting',
      });
      dispatch({
        type: 'menu/getMenuData',
        // localStorage.getItem('department') || -1,
        payload: {
          prefix: '/traffic',
          type: -1,
        },
        // callback: res => {
        //   // console.log(res)
        // },
      });
      dispatch({
        type: 'menu/getChildMenu',
        payload: { index: getLocalStorage('menuKeys')[0] || 0 },
        // callback(obj) {
        // },
      });
      // dispatch({
      //   type: 'user/getCurrentUserMethodAuth',
      // });
      dispatch({
        type: 'QrcodeSystem/fetch',
        payload: {
          pageBean: {
            page: 1,
            pageSize: 1,
            showTotal: true,
          },
        },
      });
    }
  });

  getIndex(menuData, getLocalStorage('menuKeys')[0] || 0, dispatch);

  return (
    <Layout>
      <Sider
        trigger={null}
        collapsed={collapsed}
        collapsible
        className={`${style.siderLeft} ant-pro-sider-menu-sider`}
        width={256}
      >
        <div className={style.logo} style={collapsed ? { height: 84 } : null}>
          <div className={style.logTop}>
            <img src={logoSmall} alt="智慧交通治理平台" />
            <h3 style={collapsed ? { margin: 0 } : null}>
              <img src={textLogo} alt="智慧交通治理平台" />
            </h3>
          </div>
          <div className={style.smallTitle} style={collapsed ? { display: 'none' } : null}>
            <span />
            &nbsp; 智慧交通治理平台&nbsp;
            <span />
          </div>
        </div>
        <Menu
          mode="inline"
          theme="dark"
          selectedKeys={[selectIndex.toString()]}
          className={style.leftMenu}
          onClick={menuChildClick}
        >
          {childMenu(menuData[getLocalStorage('menuKeys')[0] || 0], collapsed)}
        </Menu>
        {collapsed ? null : <div className={style.leftMenuBottom}>{showDay()}</div>}
      </Sider>
      <Layout
        className={`${style.layout} ${collapsed ? '' : style.layoutPad}`}
        style={{ minHeight: '100vh' }}
      >
        <Header className={`${style.headerTop} ${collapsed ? '' : style.headerWidth}`}>
          <span
            style={{ float: 'left', padding: '0 10px', cursor: 'pointer', lineHeight: '73px' }}
            onClick={toggle.bind(this, collapsed)}
          >
            <Icon
              className="trigger"
              type={collapsed ? 'menu-unfold' : 'menu-fold'}
              style={{ fontSize: 24 }}
            />
          </span>
          <div
            className="ant-pro-top-nav-header-menu"
            style={{ flex: '1 1 0%', overflow: 'hidden' }}
          >
            <Menu
              mode="horizontal"
              defaultSelectedKeys={['0']}
              selectedKeys={[menuKeys.toString()]}
              onClick={menuClick}
              className={style.menu}
            >
              {parentMenu(menuData)}
            </Menu>
          </div>
          <div>
            <Popover
              content={
                <>
                  <img
                    src={data.length ? imgUrl + data[0].qrCode : notImg}
                    alt=""
                    style={{ width: 150 }}
                  />
                  <p style={{ textAlign: 'center', fontSize: 14, padding: 0, margin: '5px 0 0' }}>
                    App 下载
                  </p>
                </>
              }
            >
              <span className={style.headerRightIcon}>
                <img src={phone} alt="App下载" width={20} style={{ marginTop: -5 }} />
              </span>
            </Popover>
            <Tooltip title="百吨检测">
              <span className={style.headerRightIcon} onClick={() => showNewWindow('/tons')}>
                <span
                  className={`${iconStyle.iconfont} ${iconStyle['icon-baidunchengzhong1']} ${
                    style.icon
                  }`}
                />
              </span>
            </Tooltip>
            <Tooltip title="实时监控">
              <span
                className={style.headerRightIcon}
                onClick={() => showNewWindow('/realTimeMonitor')}
              >
                <Icon type="car" className={style.icon} />
              </span>
            </Tooltip>
            <Tooltip title="大屏数据">
              <span
                className={style.headerRightIcon}
                onClick={() => showNewWindow('/visualization')}
              >
                <Icon type="desktop" className={style.icon} />
              </span>
            </Tooltip>
            <span className={style.headerRightIcon} onClick={() => showMessage(true)}>
              {warningMsgNotDuCount ? (
                <Badge count={warningMsgNotDuCount}>
                  <Icon type="bell" className={style.icon} />
                </Badge>
              ) : (
                <Icon type="bell" className={style.icon} />
              )}
            </span>
            <Avatar resetSelectIndex={resetSelectIndex} />
            {localStorage.getItem('len') !== '1' && (
              <Tooltip title="切换">
                <span className={style.headerRightIcon} onClick={switchMenu}>
                  <span style={{ color: '#295095', fontWeight: 'bold' }}>路政管理</span>
                  <Icon
                    style={{ verticalAlign: 'sub' }}
                    type="unordered-list"
                    className={style.icon}
                  />
                </span>
              </Tooltip>
            )}
          </div>
        </Header>
        <Content className={style.container}>{children}</Content>
        {warningMsgVisible ? (
          <MsgListModal handleModalVisible={showMessage} modalVisible={warningMsgVisible} />
        ) : null}
      </Layout>
    </Layout>
  );
};

export default connect(({ global, settings, menu, system, QrcodeSystem, user }) => ({
  collapsed: global.collapsed,
  settings,
  menu,
  system,
  QrcodeSystem,
  currentUser: user.currentUser,
}))(MenuLayout);
