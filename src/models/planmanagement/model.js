import { queryList, removeList, addList, updateList } from '@/services/planmanagement/service';
import { filterResponse } from '@/utils/utils';

export default {
  namespace: 'Planmanagement',

  state: {
    dataList: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    * fetch({ payload }, { call, put }) {
      const response = yield call(queryList, payload);
      const status = filterResponse(response);
      if (status === 200) {
        yield put({
          type: 'save',
          payload: response.data,
        });
      }
    },
    * add({ payload, callback }, { call }) {
      const response = yield call(addList, payload);
      const status = filterResponse(response);
      if (status === 200) {
        if (callback) callback(response.data);
      }
    },
    * remove({ payload, callback }, { call }) {
      const response = yield call(removeList, payload);
      const status = filterResponse(response);
      if (status === 200) {
        if (callback) callback(response.data);
      }
    },
    * update({ payload, callback }, { call }) {
      const response = yield call(updateList, payload);
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
