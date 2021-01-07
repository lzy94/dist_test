import {
  queryFormList,
  removeForm,
  addAndUpdate,
  saveAllByFormId,
  getAllByFormId,
} from './service';
import { filterResponse } from '@/utils/utils';

export default {
  namespace: 'ConserveSystemFrom',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryFormList, payload);
      const status = filterResponse(response);
      if (status === 200) {
        yield put({
          type: 'save',
          payload: response.data,
        });
      }
    },
    *AUSave({ payload, callback }, { call }) {
      const response = yield call(addAndUpdate, payload);
      const status = filterResponse(response);
      if (status === 200) {
        if (callback) callback();
      }
    },
    *remove({ payload, callback }, { call }) {
      const response = yield call(removeForm, payload);
      const status = filterResponse(response);
      if (status === 200) {
        if (callback) callback();
      }
    },
    *saveABFI({ payload, callback }, { call }) {
      const response = yield call(saveAllByFormId, payload);
      const status = filterResponse(response);
      if (status === 200) {
        if (callback) callback();
      }
    },
    *getABFI({ payload, callback }, { call }) {
      const response = yield call(getAllByFormId, payload);
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
