import {
  contingencyPersonControlForPage,
  addContingencyPersonControl,
  getContingencyPersonControlById,
  personControlComplete,
} from './service';
import { filterResponse } from '@/utils/utils';

export default {
  namespace: 'Manpower',

  state: {
    dataList: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    * fetch({ payload }, { call, put }) {
      const response = yield call(contingencyPersonControlForPage, payload);
      const status = filterResponse(response);
      if (status === 200) {
        yield put({
          type: 'save',
          payload: response.data,
        });
      }
    },
    * add({ payload, callback }, { call, put }) {
      const response = yield call(addContingencyPersonControl, payload);
      const status = filterResponse(response);
      if (status === 200) {
        if (callback) callback(response.data);
      }
    },
    * detail({ payload, callback }, { call, put }) {
      const response = yield call(getContingencyPersonControlById, payload);
      const status = filterResponse(response);
      if (status === 200) {
        if (callback) callback(response.data);
      }
    },
    * complete({ payload, callback }, { call, put }) {
      const response = yield call(personControlComplete, payload);
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
