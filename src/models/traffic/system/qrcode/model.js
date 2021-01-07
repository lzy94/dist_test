import { getList, updateData } from '@/services/traffic/system/qrcode/service';
import { filterResponse } from '@/utils/utils';

export default {
  namespace: 'QrcodeSystem',

  state: {
    data: [],
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(getList, payload);
      const status = filterResponse(response);
      if (status === 200) {
        yield put({
          type: 'save',
          payload: response.data,
        });
        callback && callback();
      }
    },
    *saveData({ payload, callback }, { call }) {
      const newData = filterResponse(yield call(updateData, payload));
      if (newData === 200) {
        callback && callback();
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload.rows,
      };
    },
  },
};
