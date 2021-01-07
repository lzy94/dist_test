/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import RightContent from '@/components/GlobalHeader/RightContent';
import { connect } from 'dva';
import React, { useState } from 'react';
import logoSmall from '../assets/logo-small.png';
import Authorized from '@/utils/Authorized';
import { formatMessage } from 'umi-plugin-react/locale';
import { isAntDesignPro } from '@/utils/utils';
import { BasicLayout as ProLayoutComponents } from '@ant-design/pro-layout';
import Link from 'umi/link';
import { Badge, Icon, Layout, Menu } from "antd";
import style from "./menuLayout.less";
import { getLocalStorage } from '@/utils/utils'

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
        <span style={{ fontSize: 15 }}> <Icon type={item.icon} style={{ fontSize: 16 }} />{item.name}</span>
      </Menu.Item>
    )
  })
};


/**
 * use Authorized check all menu item
 */
const menuDataRender = menuList => {
  return menuList.map(item => {
    const localItem = { ...item, children: item.children ? menuDataRender(item.children) : [] };
    return Authorized.check(item.authority, localItem, null);
  });
};

const footerRender = (_, defaultDom) => {
  if (!isAntDesignPro()) {
    return defaultDom;
  }

  return (
    <>
      {defaultDom}
      <div
        style={{
          padding: '0px 24px 24px',
          textAlign: 'center',
        }}
      >
        <a href="https://www.netlify.com" target="_blank">
          <img
            src="https://www.netlify.com/img/global/badges/netlify-color-bg.svg"
            width="82px"
            alt="netlify logo"
          />
        </a>
      </div>
    </>
  );
};


const BasicLayout = props => {
  const { dispatch, children, settings, menu } = props;
  const menuData = menu.menuData;
  const menuKeys = menu.menuKeys;
  const collapsed = menu.collapsed;

  const menuClick = (e) => {
    const index = e.key;
    // selectIndex = 0;
    dispatch({
      type: 'menu/getChildMenu',
      payload: { index: index },
      callback(obj) {
        props.history.push(menuData[obj].children[0].path);
        return;
      }
    });
  };

  const toggle = flag => {
    dispatch({
      type: 'menu/toggleMenu',
      payload: !flag
    });
  };


  const headerRender = (menuData, e) => {
    return (
      <>
        <span style={{ float: 'left', padding: '0 24px', cursor: 'pointer' }} onClick={toggle.bind(this, collapsed)}>
          <Icon
            className="trigger"
            type={collapsed ? 'menu-unfold' : 'menu-fold'}
            style={{ fontSize: 20 }}
          />
        </span>
        <Menu
          mode="horizontal"
          defaultSelectedKeys={['0']}
          selectedKeys={[menuKeys.toString()]}
          onClick={menuClick}
          className={style.menu}
          style={{ lineHeight: '62px', border: 0, float: 'left' }}
        >
          {parentMenu(menuData)}
        </Menu>
        <div style={{ float: 'right' }}>
          <RightContent />
        </div>
      </>
    )
  };
  const list = menuData[getLocalStorage('menuKeys')[0] || 0] || [];
  /**
   * constructor
   */
  useState(() => {
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
      dispatch({
        type: 'settings/getSetting',
      });
      dispatch({
        type: 'menu/getMenuData',
      });
    }
  });
  /**
   * init variables
   */
  const handleMenuCollapse = payload => {
    dispatch &&
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
  };
  return (
    <ProLayoutComponents
      logo={logoSmall}
      collapsed={collapsed}
      onCollapse={handleMenuCollapse}
      menuItemRender={(menuItemProps, defaultDom) => {
        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }}
      breadcrumbRender={(routers = []) => {
        return [
          {
            path: '/',
            breadcrumbName: formatMessage({
              id: 'menu.home',
              defaultMessage: 'Home',
            }),
          },
          ...routers,
        ];
      }}
      footerRender={footerRender}
      // menuDataRender={menuDataRender}
      menuDataRender={() => list.children || []}
      formatMessage={formatMessage}
      headerRender={headerRender.bind(this, menuData)}
      rightContentRender={rightProps => <RightContent {...rightProps} />}
      {...props}
      {...settings}
    >
      {children}
    </ProLayoutComponents>
  );
};


export default connect(({ global, settings, menu }) => ({
  collapsed: global.collapsed,
  settings,
  menu,
}))(BasicLayout);
