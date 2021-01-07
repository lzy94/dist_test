import { getList, removeData, saveData, updateStatusMethod, getDetail } from './service';
import { filterResponse } from '@/utils/utils';

export default {
  namespace: 'TransportDangerPlan',

  state: {
    data: {
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
    *detail({ payload, callback }, { call }) {
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
