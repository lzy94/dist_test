import { queryList, removeList, removeLists, getDetail, saveList } from './service';
import { filterResponse } from '@/utils/utils';

export default {
  namespace: 'RoadProduction',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    * fetch({ payload }, { call, put }) {
      const response = yield call(queryList, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    * saveData({ payload, callback }, { call, put }) {
      const response = yield call(saveList, payload);
      const status = filterResponse(response);
      if (status === 200) {
        if (callback) callback();
      }
    },
    * remove({ payload, callback }, { call, put }) {
      const response = yield call(removeList, payload);
      const status = filterResponse(response);
      if (status === 200) {
        if (callback) callback();
      }
    },
    * removes({ payload, callback }, { call, put }) {
      const response = yield call(removeLists, payload);
      const status = filterResponse(response);
      if (status === 200) {
        if (callback) callback();
      }
    },
    * detail({ payload, callback }, { call, put }) {
      const response = yield call(getDetail, payload);
      const status = filterResponse(response);
      if (status === 200) {
        if (callback) callback(response.data);
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
  },
};
