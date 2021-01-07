import {
  getList,
  removeData,
  saveData,
  updateStatusMethod,
  getCycleSuperRetList,
  removeCycleSuperRetData,
  saveCycleSuperRetData,
} from './service';
import { filterResponse } from '@/utils/utils';

export default {
  namespace: 'TransportDangerPeriodic',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    cycleSuperRetListData: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getList, payload);
      const status = filterResponse(response);
      if (status === 200) {
        yield put({
          type: 'save',
          payload: response.data,
        });
      }
    },
    *UAData({ payload, callback }, { call }) {
      const response = yield call(saveData, payload);
      const status = filterResponse(response);
      if (status === 200) {
        if (callback) callback();
      }
    },
    *remove({ payload, callback }, { call }) {
      const response = yield call(removeData, payload);
      const status = filterResponse(response);
      if (status === 200) {
        if (callback) callback();
      }
    },
    *updateStatus({ payload, callback }, { call }) {
      const response = yield call(updateStatusMethod, payload);
      const status = filterResponse(response);
      if (status === 200) {
        if (callback) callback();
      }
    },
    *cycleSuperRetListfetch({ payload }, { call, put }) {
      const response = yield call(getCycleSuperRetList, payload);
      const status = filterResponse(response);
      if (status === 200) {
        yield put({
          type: 'saveCycleSuperRetList',
          payload: response.data,
        });
      }
    },
    *removeCycleSuperRet({ payload, callback }, { call }) {
      const response = yield call(removeCycleSuperRetData, payload);
      const status = filterResponse(response);
      if (status === 200) {
        callback && callback();
      }
    },
    *saveCycleSuperRet({ payload, callback }, { call }) {
      const response = yield call(saveCycleSuperRetData, payload);
      const status = filterResponse(response);
      if (status === 200) {
        callback && callback();
      }
    },
  },

  reducers: {
    save(state, action) {
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
    saveCycleSuperRetList(state, action) {
      return {
        ...state,
        cycleSuperRetListData: {
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
