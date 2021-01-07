/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import {connect} from 'dva';
import React, {useState} from 'react';
import Link from 'umi/link';
import logo from '../assets/logo.png'
import Avatar from '@/components/GlobalHeader/AvatarDropdown';
import {Layout, Menu, Icon} from 'antd';
import {getLocalStorage} from '@/utils/utils'
import SelectLang from "@/components/SelectLang";

const {SubMenu} = Menu;
const {Header, Content, Sider,Footer} = Layout;

/**
 * 加载一级菜单
 * @param list
 * @returns {*}
 */
const parentMenu = list => {
    return list.map((item,i)=>{
        return  <Menu.Item key={i} ><span style={{fontSize:15}} > <Icon type={item.icon} style={{fontSize:16}} />{item.name}</span></Menu.Item>;
    })
}

const childMenu = list =>{
    if(!list) return '';
    return list.children.map((item,i)=>{
        return <Menu.Item key={i}><Link to={item.path}><Icon type={item.icon} style={{fontSize:15}}/>{item.name}</Link></Menu.Item>;
    })
}
let selectIndex = 0;
const MenuLayout = props => {
    const {dispatch, children, menu} = props;
    const menuData = menu.menuData;
    const childrenMenu = menu.childrenMenu;
    const menuKeys = menu.menuKeys;
    const menuClick = (e)=> {
        const index = e.key;
        selectIndex = 0;
        dispatch({
            type: 'menu/getChildMenu',
            payload: {index:index},
            callback(obj) {
                props.history.push(menuData[obj].children[0].path);
                return;
            }
        });
    }
    const menuChildClick = (e) =>{
        selectIndex = e.key;
    }
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
            dispatch({
                type: 'menu/getChildMenu',
                payload: {index:getLocalStorage('menuKeys')[0]||0},
                callback(obj) {
                }
            });
            dispatch({
                type:'user/getCurrentUserMethodAuth',
            })
        }
    });
    return (
        <Layout style={{height:'100%'}}>
            <Header className="header" style={{position: 'fixed', zIndex: 99, width: '100%',background:'#fff',boxShadow:'0 0 5px rgba(0,0,0,.1)',padding:'0 25px'}}>
                <div className="logo" style={{float:'left',marginRight:65}}>
                    <img src={logo} alt="" />
                </div>
                <Menu
                    mode="horizontal"
                    defaultSelectedKeys={['0']}
                    selectedKeys={[menuKeys.toString()]}
                    style={{lineHeight: '63px',background:'#fff',float:'left',borderBottom: 0}}
                    onClick={menuClick}
                >
                    {parentMenu(menuData)}
                </Menu>
                <div style={{float:'right'}}>
                    <Avatar  />
                </div>
            </Header>
            <Layout>
                <Sider width={256} style={{background: '#fff', position: 'fixed', top: 65, bottom: 0}}>
                    <Menu
                        mode="inline"
                        selectedKeys={[selectIndex.toString()]}
                        style={{height: '100%', borderRight: 0}}
                        onClick={menuChildClick}
                    >
                        {childMenu(menuData[getLocalStorage('menuKeys')[0]||0])}
                    </Menu>
                </Sider>
                <Layout style={{paddingTop:65, marginLeft: 256,}}>
                    <Content
                        style={{
                            margin: 10,
                            minHeight: 280,
                        }}
                    >
                        {children}
                        {/*<Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>*/}
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default connect(({global, settings, menu}) => ({
    collapsed: global.collapsed,
    settings,
    menu,
}))(MenuLayout);
