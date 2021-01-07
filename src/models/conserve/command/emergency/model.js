import {
  contingencyControlForPage,
  contingencyControlSend,
  getRoadContingencyControlById,
  addContingencyControl,
} from '@/services/conserve/command/emergency/service';
import { filterResponse } from '@/utils/utils';

export default {
  namespace: 'Emergency',

  state: {
    dataList: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(contingencyControlForPage, payload);
      const status = filterResponse(response);
      if (status === 200) {
        yield put({
          type: 'save',
          payload: response.data,
        });
      }
    },
    *add({ payload, callback }, { call }) {
      const response = yield call(addContingencyControl, payload);
      const status = filterResponse(response);
      if (status === 200) {
        if (callback) callback();
      }
    },
    *update({ payload, callback }, { call }) {
      const response = yield call(contingencyControlSend, payload);
      const status = filterResponse(response);
      if (status === 200) {
        if (callback) callback(response.data);
      }
    },
    *detail({ payload, callback }, { call }) {
      const response = yield call(getRoadContingencyControlById, payload);
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
        dataList: {
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
