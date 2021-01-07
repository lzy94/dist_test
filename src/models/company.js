import { queryCompany, removeCompany, addCompany, updateCompany, getCompanyDetail } from '@/services/company';
import { filterResponse } from '@/utils/utils';

export default {
  namespace: 'Company',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    * fetch({ payload }, { call, put }) {
      const response = yield call(queryCompany, payload);
      filterResponse(response);
      yield put({
        type: 'save',
        payload: response.data || {},
      });
    },
    * add({ payload, callback }, { call, put }) {
      const response = yield call(addCompany, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        if (callback) callback();
      }
    },
    * remove({ payload, callback }, { call, put }) {
      const response = yield call(removeCompany, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        if (callback) callback();
      }
    },
    * update({ payload, callback }, { call, put }) {
      const response = yield call(updateCompany, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        if (callback) callback();
      }
    },
    * detail({ payload, callback }, { call, put }) {
      const response = yield call(getCompanyDetail, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
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
