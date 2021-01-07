import {
  getMonitorPage,
  removeMonitor,
  addMonitor,
  updateMonitor,
  updateRelay,
} from '@/services/conserve/command/monitor/service';
import { filterResponse } from '@/utils/utils';

export default {
  namespace: 'ConserveMonitor',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    * fetch({ payload }, { call, put }) {
      const response = yield call(getMonitorPage, payload);
      const status = filterResponse(response);
      if (status === 200) {
        yield put({
          type: 'save',
          payload: response.data,
        });
      }
    },
    * add({ payload, callback }, { call }) {
      const response = yield call(addMonitor, payload);
      const status = filterResponse(response);
      if (status === 200) {
        if (callback) callback();
      }
    },
    * remove({ payload, callback }, { call }) {
      const response = yield call(removeMonitor, payload);
      const status = filterResponse(response);
      if (status === 200) {
        if (callback) callback();
      }
    },
    * update({ payload, callback }, { call }) {
      const response = yield call(updateMonitor, payload);
      const status = filterResponse(response);
      if (status === 200) {
        if (callback) callback();
      }
    },
    * switchRelay({ payload, callback }, { call }) {
      const response = yield call(updateRelay, payload);
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
