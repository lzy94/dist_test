import { getList, delPort, addPort, updatePortfo } from '@/services/maritime/system/port/service';
import { filterResponse } from '@/utils/utils';

export default {
  namespace: 'MaritimePort',

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
    * add({ payload, callback }, { call }) {
      const response = yield call(addPort, payload);
      const status = filterResponse(response);
      if (status === 200) {
        callback && callback();
      }
    },
    * remove({ payload, callback }, { call }) {
      const response = yield call(delPort, payload);
      const status = filterResponse(response);
      if (status === 200) {
        callback && callback();
      }
    },
    * update({ payload, callback }, { call }) {
      const response = yield call(updatePortfo, payload);
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
  },
};
