import { getList, removeData, addData, updateData, importCompanyLicence } from './service';
import { filterResponse } from '@/utils/utils';

export default {
  namespace: 'TransportArchivesLicense',

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
    *add({ payload, callback }, { call }) {
      const response = yield call(addData, payload);
      const status = filterResponse(response);
      if (status === 200) {
        if (callback) callback();
      }
    },
    *remove({ payload, callback }, { call }) {
      const response = yield call(removeData, payload);
      const status = filterResponse(response);
      if (status === 200) {
        if (callback) callback();
      }
    },
    *update({ payload, callback }, { call }) {
      const response = yield call(updateData, payload);
      const status = filterResponse(response);
      if (status === 200) {
        if (callback) callback();
      }
    },
    *import({ payload, callback }, { call }) {
      const response = yield call(importCompanyLicence, payload);
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
