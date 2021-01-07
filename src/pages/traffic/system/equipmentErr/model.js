import { queryData } from './service';
import { filterResponse } from '@/utils/utils';

export default {
  namespace: 'EquipmentErr',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryData, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        yield put({
          type: 'save',
          payload: response.data || {},
        });
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
