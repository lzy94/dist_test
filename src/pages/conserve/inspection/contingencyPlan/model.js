import { getList, getDetail, changeState } from './service';
import { filterResponse } from '@/utils/utils';

export default {
  namespace: 'ContingencyPlan',

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
    * detail({ payload, callback }, { call, put }) {
      const response = yield call(getDetail, payload);
      const status = filterResponse(response);
      if (status === 200) {
        callback && callback(response.data);
      }
    },
    * change({ payload, callback }, { call, put }) {
      const response = yield call(changeState, payload);
      const status = filterResponse(response);
      if (status === 200) {
        callback && callback(response.data);
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
