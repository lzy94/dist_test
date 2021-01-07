import { getMenuData } from '@/services/menu';
import { formatMenuList, setLocalStorage, getLocalStorage, filterResponse } from '@/utils/utils';

const MenuModel = {
  namespace: 'menu',
  state: {
    menuData: [],
    childrenMenu: [],
    menuKeys: 0,
    collapsed: false,
  },
  effects: {
    * getMenuData({ payload, callback }, { call, put }) {
      const response = yield call(getMenuData, payload.type);
      const newData = filterResponse(response);
      if (newData === 200) {
        const menu = formatMenuList((response.data || {}).value || [], payload.prefix);
        setLocalStorage('menu', menu);
        yield put({
          type: 'save',
          payload: menu,
        });
        if (callback) callback((response.data || {}).value);
      } else {
      //   setLocalStorage('menu', formatMenuList([{
      //     path: '/',
      //     exact: true,
      //     name: '首页',
      //     children: [{
      //       path: '/',
      //       exact: true,
      //       name: '首页',
      //       icon: 'home',
      //     }],
      //     icon: 'home',
      //   }]));
      }
    },
    * getMenuData2({ payload, callback }, { call, put }) {
      const response = yield call(getMenuData, payload.type);
      const newData = filterResponse(response);
      if (newData === 200) {
        const menu = formatMenuList((response.data || {}).value || [], payload.prefix);
        if (callback) callback(menu);
      }
    },
    * getChildMenu({ payload, callback }, { call, put }) {
      // const menu = getLocalStorage('menu')[payload.index].children;
      yield put({
        type: 'saveChild',
        payload: { keys: payload.index },
      });
      setLocalStorage('menuKeys', payload.index);
      if (callback) callback(payload.index);
    },
    * toggleMenu({ payload }, { call, put }) {
      yield put({
        type: 'saveCollapsed',
        payload: payload,
      });
    },

  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        // menuData: formatMenuList((action.payload.data || {}).value || []),
        menuData:action.payload
      };
    },
    saveChild(state, action) {
      return {
        ...state,
        // childrenMenu: menu,
        menuKeys: action.payload.keys,
      };
    },
    saveCollapsed(state, action) {
      return {
        ...state,
        collapsed: action.payload,
      };
    },
  },
};
export default MenuModel;

