import {
  getList,
  delEquiment,
  addEquiment,
  updateEquimentInfo,
  addEquimentCategory,
  delEquimentCategory,
  getListEquimentCategory,
} from '@/services/maritime/device/service';
import { filterResponse } from '@/utils/utils';

export default {
  namespace: 'MaritimeDevice',

  state: {
    cateData: {
      list: [],
      pagination: {},
    },
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    * fetch({ payload }, { call, put }) {
      const response = yield call(getList, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    * add({ payload, callback }, { call }) {
      const response = yield call(addEquiment, payload);
      const status = filterResponse(response);
      if (status === 200) {
        callback && callback();
      }
    },
    * remove({ payload, callback }, { call }) {
      const response = yield call(delEquiment, payload);
      const status = filterResponse(response);
      if (status === 200) {
        callback && callback();
      }
    },
    * update({ payload, callback }, { call }) {
      const response = yield call(updateEquimentInfo, payload);
      const status = filterResponse(response);
      if (status === 200) {
        callback && callback();
      }
    },

    // 分类
    * fetchCate({ payload }, { call, put }) {
      const response = yield call(getListEquimentCategory, payload);
      const status = filterResponse(response);
      if (status === 200) {
        yield put({
          type: 'saveCate',
          payload: response,
        });
      }
    },
    * removeCate({ payload, callback }, { call }) {
      const response = yield call(delEquimentCategory, payload);
      const status = filterResponse(response);
      if (status === 200) {
        callback && callback();
      }
    },
    * addCate({ payload, callback }, { call }) {
      const response = yield call(addEquimentCategory, payload);
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
    saveCate(state, action) {
      return {
        ...state,
        cateData: {
          list: action.payload.data,
        },
      };
    },
  },
};
