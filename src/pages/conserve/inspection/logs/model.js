import { getList, removeLogs, getDetail } from './service';
import { filterResponse } from '@/utils/utils';

export default {
  namespace: 'ConserveLogs',

  state: {
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
    * remove({ payload, callback }, { call }) {
      const response = yield call(removeLogs, payload);
      const status = filterResponse(response);
      if (status === 200) {
        if (callback) callback();
      }
    },
    * detail({ payload, callback }, { call }) {
      const response = yield call(getDetail, payload);
      const status = filterResponse(response);
      if (status === 200) {
        if (callback) callback();
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
