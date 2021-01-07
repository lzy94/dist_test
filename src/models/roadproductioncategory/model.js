import {
  queryList,
  saveList,
  removeList,
  getDetail,
  removeLists,
} from '@/services/roadproductioncategory/service';
import { filterResponse } from '@/utils/utils';

export default {
  namespace: 'RoadProductionCategory',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryList, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *saveData({ payload, callback }, { call }) {
      const response = yield call(saveList, payload);
      const status = filterResponse(response);
      if (status === 200) {
        callback && callback();
      }
    },
    *remove({ payload, callback }, { call }) {
      const response = yield call(removeList, payload);
      const status = filterResponse(response);
      if (status === 200) {
        callback && callback();
      }
    },
    *removes({ payload, callback }, { call }) {
      const response = yield call(removeLists, payload);
      const status = filterResponse(response);
      if (status === 200) {
        callback && callback();
      }
    },
    *detail({ payload, callback }, { call }) {
      const response = yield call(getDetail, payload);
      const status = filterResponse(response);
      if (status === 200) {
        callback && callback(response.data || {});
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
