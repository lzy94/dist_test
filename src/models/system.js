import {
  getTree,
  getPinyin,
  getMenuTree,
  getUserSite,
  // getWarningMsgNotDu,
  getDepartmentUser,
  contingencyControlForPage,
} from '@/services/system';
import { getWarningMsgNotDu } from '@/services/traffic/api-v2/countService';
import { formatTreeList, filterResponse } from '@/utils/utils';
import { queryData } from '@/services/dynamic';

let address = '';
function getAddress(list, code, json) {
  for (let i = 0; i < list.length; i += 1) {
    if (code === list[i].code) {
      const addr = list[i].areaName;
      address = addr + address;
      if (list[i].code) {
        getAddress(json, list[i].parentCode, json);
      }
      break;
    } else {
      getAddress(list[i].children, code, json);
    }
  }
}

const MenuModel = {
  namespace: 'system',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    contingencyControlData: {
      list: [],
      pagination: {},
    },
    treeList: [],
    address: '',
    pinyin: '',
    menuTreeList: [],
    warningMsgNotDuCount: 0,
    warningMsgVisible: false,
  },
  effects: {
    *getTree({ payload, callback }, { call, put }) {
      const response = yield call(getTree, payload);
      filterResponse(response);
      address = '';
      getAddress(response.data || [], payload.cityCode || '51', response.data || []);
      localStorage.setItem('addr', address);
      yield put({
        type: 'save',
        payload: { data: response.data || [], addr: address },
      });
    },
    *getPinyin({ payload, callback }, { call }) {
      const response = yield call(getPinyin, payload);
      callback(response.data || '');
      // yield put({
      //     type:'savePinYin',
      //     payload:response.data || ''
      // })
    },
    *menuTree({ payload, callback }, { call, put }) {
      const response = yield call(getMenuTree, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        yield put({
          type: 'saveMenuTree',
          payload: response.data || [],
        });
        callback && callback();
      }
    },
    *userSite({ payload, callback }, { call }) {
      const response = yield call(getUserSite, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        callback && callback(response.data || []);
      }
    },
    *warningMsgNotDu({ payload }, { call, put }) {
      const sites = payload.siteCodes || '';
      const response = yield call(getWarningMsgNotDu, sites.split(','));
      const newData = filterResponse(response);
      if (newData === 200) {
        yield put({
          type: 'warnCount',
          payload: response.data || 0,
        });
      }
    },
    *getWarningMsgList({ payload, callback }, { call, put }) {
      const response = yield call(queryData, payload);
      filterResponse(response);
      yield put({
        type: 'msgSave',
        payload: response.data || {},
      });
    },
    *handleWarningMsgVisible({ payload }, { put }) {
      yield put({
        type: 'warnVis',
        payload: payload,
      });
    },
    // 非运政 获取相关人员
    // 非运政 获取相关人员
    *departmentUser({ payload, callback }, { call }) {
      const response = yield call(getDepartmentUser, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        callback && callback(response.data);
      }
    },
    *contingencyControl({ payload, callback }, { call, put }) {
      const response = yield call(contingencyControlForPage, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        yield put({
          type: 'contingencyControlSave',
          payload: response.data || {},
        });
      }
    },
    *resetContingencyControl(_, { put }) {
      yield put({
        type: 'contingencyControlSave',
        payload: {
          rows: [],
          total: 0,
          pageSize: 0,
          current: 0,
        },
      });
    },
  },
  reducers: {
    save(state, action) {
      const { data, addr } = action.payload;
      return {
        ...state,
        treeList: formatTreeList(data),
        address: addr,
      };
    },
    savePinYin(state, action) {
      return {
        ...state,
        pinyin: action.payload,
      };
    },
    saveMenuTree(state, action) {
      return {
        ...state,
        menuTreeList: formatTreeList(action.payload),
      };
    },
    warnCount(state, action) {
      return {
        ...state,
        warningMsgNotDuCount: action.payload,
      };
    },
    warnVis(state, action) {
      return {
        ...state,
        warningMsgVisible: action.payload,
      };
    },
    msgSave(state, action) {
      return {
        ...state,
        data: {
          list: action.payload.rows,
          pagination: {
            total: action.payload.total,
            pageSize: action.payload.pageSize,
            current: action.payload.page,
          },
        },
      };
    },
    contingencyControlSave(state, action) {
      return {
        ...state,
        contingencyControlData: {
          list: action.payload.rows,
          pagination: {
            total: action.payload.total,
            pageSize: action.payload.pageSize,
            current: action.payload.page,
          },
        },
      };
    },
  },
};
export default MenuModel;
