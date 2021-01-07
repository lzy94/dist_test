import { queryList, addOrSave, testSend } from './service';
import { filterResponse } from '@/utils/utils';

export default {
  namespace: 'ConserveDataMessage',

  state: {
    data: {},
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryList, payload);
      // const status = filterResponse(response);
      // if (status === 200) {
      yield put({
        type: 'save',
        payload: response.rows,
      });
      callback && callback();
      // }
    },
    *dataSave({ payload, callback }, { call }) {
      const response = yield call(addOrSave, payload);
      const status = filterResponse(response);
      callback && callback(response);
    },
    *tSend({ payload, callback }, { call }) {
      const response = yield call(testSend, payload);
      const status = filterResponse(response);
      callback && callback(response);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload[0] || {},
      };
    },
  },
};
