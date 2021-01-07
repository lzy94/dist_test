import { getList, removeData, saveData } from './service';
import { filterResponse } from '@/utils/utils';

function formatData(data) {
  return data.map((item, index) => ({ ...item, key: index, isEdit: false }));
}

export default {
  namespace: 'TrafficSystemThreshold',

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
    *AUSave({ payload, callback }, { call }) {
      const response = yield call(saveData, payload);
      const status = filterResponse(response);
      if (status === 200) {
        if (callback) callback(status);
      }
    },
    *remove({ payload, callback }, { call }) {
      const response = yield call(removeData, payload);
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
          list: formatData(action.payload.rows.reverse()),
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
