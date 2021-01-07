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
import { Layout, Menu, Icon, Tooltip, Popover } from 'antd';
import { getLocalStorage } from '@/utils/utils';
import MsgListModal from '@/pages/traffic/overview/dynamic/modal/msgListModal';
import style from './menuLayout.less';
import iconStyle from '@/assets/font/iconfont.css';
import logoSmall from '@/assets/login/logo.png';
import textLogo from '@/assets/textLogo.png';
import encodePhone from '@/assets/phone-encode.png';
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
  return list.children.map((item, i) => {
    return (
      <Menu.Item key={i}>
        <Link to={item.path} style={!!collapsed ? null : { paddingLeft: 20 }}>
          <i
            className={iconStyle.iconfont + ' ' + iconStyle[item.icon]}
            style={{ marginRight: 30, fontSize: 22 }}
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
  if (/#/.test(location.href)) {
    path = location.hash.replace('#', '');
  } else {
    path = location.pathname;
  }

  if (JSON.stringify(menu) === '[]') return 0;
  const parentPath = path.split('/').filter(item => item)[0];
  for (let i = 0; i < menu.length; i++) {
    if (menu[i].path === '/' + parentPath) {
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

  for (let i = 0; i < menu[index].children.length; i++) {
    if (menu[index].children[i].path === path) {
      selectIndex = i;
      break;
    }
  }
};

const showBigScreen = () => {
  let path = '/maritimeDataV';
  if (/#/.test(window.location.href)) {
    path = '/#/maritimeDataV';
  }
  window.open(
    path,
    '',
    'width=' +
      window.screen.availWidth +
      ',height=' +
      (window.screen.availHeight - 65) +
      ',top=0,left=0,resizable=yes,status=yes,menubar=no,scrollbars=yes',
  );
};

const MenuLayout = props => {
  localStorage.setItem('menuType', -3);
  const {
    dispatch,
    children,
    menu,
    system: { warningMsgNotDuCount, warningMsgVisible },
  } = props;
  const { menuData, menuKeys, collapsed } = menu;
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

  const showMessage = flag => {
    dispatch({
      type: 'system/handleWarningMsgVisible',
      payload: !!flag,
    });
  };

  const showDay = () => {
    const {
      // currentUser,
      system: { treeList, address },
    } = props;
    if (!treeList.length) return '';
    const cap = ['', '一', '二', '三', '四', '五', '六', '日'];
    const day = moment().format('YYYY年MM月DD日');
    const week = cap[moment().format('E')];
    // const organId = currentUser.organId;
    // getAddress(treeList, organId);
    return (
      <>
        <p>
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
    // window.location.href = '/';
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
        },
      });
      dispatch({
        type: 'settings/getSetting',
      });
      dispatch({
        type: 'menu/getMenuData',
        payload: {
          prefix: '',
          type: -3,
        },
      });
      dispatch({
        type: 'menu/getChildMenu',
        payload: { index: getLocalStorage('menuKeys')[0] || 0 },
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
        className={style.siderLeft + ' ant-pro-sider-menu-sider'}
        width={256}
      >
        <div className={style.logo} style={collapsed ? { height: 84 } : null}>
          <img src={logoSmall} alt="交通执法平台" />
          <h3 style={collapsed ? { margin: 0 } : null}>
            <img src={textLogo} alt="交通执法平台" />
            <div className={style.smallTitle}>
              <span></span>&nbsp;海事管理&nbsp;<span></span>
            </div>
          </h3>
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
        className={style.layout + ' ' + (collapsed ? '' : style.layoutPad)}
        style={{ minHeight: '100vh' }}
      >
        <Header className={style.headerTop + ' ' + (collapsed ? '' : style.headerWidth)}>
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
                  <img src={encodePhone} alt="" />
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
            <Tooltip title="大屏数据">
              <span className={style.headerRightIcon} onClick={showBigScreen}>
                <Icon type="desktop" className={style.icon} />
              </span>
            </Tooltip>
            <Avatar resetSelectIndex={resetSelectIndex} />
            {localStorage.getItem('len') !== '1' && (
              <Tooltip title="切换">
                <span className={style.headerRightIcon} onClick={switchMenu}>
                  <span style={{ color: '#295095', fontWeight: 'bold' }}>海事管理</span>
                  <Icon
                    style={{ verticalAlign: 'sub' }}
                    type="unordered-list"
                    className={style.icon}
                  />
                </span>
              </Tooltip>
            )}

            {/*<Popover content={<>  <img src={encodePhone}/> <p*/}
            {/*  style={{ textAlign: 'center', fontSize: 14, padding: 0, margin: '5px 0 0' }}>App 下载</p></>}>*/}
            {/*  <span className={style.headerRightIcon} onClick={showBigScreen}>*/}
            {/*    <img src={phone} alt="App下载" width={20} style={{ marginTop: -5 }}/>*/}
            {/*  </span>*/}
            {/*</Popover>*/}
            {/*<span className={style.headerRightIcon} onClick={() => showMessage(true)}>*/}
            {/*  {warningMsgNotDuCount ?*/}
            {/*    <Badge count={warningMsgNotDuCount}><Icon type="bell" className={style.icon}/></Badge> :*/}
            {/*    <Icon type="bell" className={style.icon}/>}*/}
            {/*</span>*/}
            {/*<Avatar resetSelectIndex={resetSelectIndex}/>*/}
          </div>
        </Header>
        <Content className={style.container}>{children}</Content>
        <Footer style={{ textAlign: 'center' }}>
          四川奇石缘科技股份有限公司&copy;2019
          <br />
          地址：四川省绵阳市涪城区金家林总部城36、38、39栋&nbsp;&nbsp;&nbsp;&nbsp;技术支持热线：400-823-2997
        </Footer>
        {warningMsgVisible ? (
          <MsgListModal handleModalVisible={showMessage} modalVisible={warningMsgVisible} />
        ) : null}
      </Layout>
    </Layout>
  );
};

export default connect(({ global, settings, menu, system, user }) => ({
  collapsed: global.collapsed,
  settings,
  menu,
  system,
  currentUser: user.currentUser,
}))(MenuLayout);
