import { getList, getPointInfoByCode, getPointInfoForDay } from './service';
import { filterResponse } from '@/utils/utils';

export default {
  namespace: 'MaritimeMonitor',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    * fetch({ payload, callback }, { call, put }) {
      const response = yield call(getList, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      callback && callback();
    },
    * pointInfoByCode({ payload, callback }, { call }) {
      const response = yield call(getPointInfoByCode, payload);
      const status = filterResponse(response);
      if (status === 200) {
        callback && callback(response.data || []);
      }
    },
    * pointInfoForDay({ payload, callback }, { call }) {
      const response = yield call(getPointInfoForDay, payload);
      const status = filterResponse(response);
      if (status === 200) {
        callback && callback(response.data || []);
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
