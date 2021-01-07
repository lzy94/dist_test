import {
  queryCompany,
  addCompany,
  getDetail,
  updateCompany,
  removeCompany,

  addCompanyRoadConserve,
  deleteCompanyRoadConserveById,
  getAllRoadCompanyConserve,
  getCompanyInfos,
  getRoadInfos,
} from '@/services/company/service';
import { filterResponse } from '@/utils/utils';

export default {
  namespace: 'ConserveCompany',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    * fetch({ payload }, { call, put }) {
      const response = yield call(queryCompany, payload);
      const status = filterResponse(response);
      if (status === 200) {
        yield put({
          type: 'save',
          payload: response.data,
        });
      }
    },
    * add({ payload, callback }, { call, put }) {
      const response = yield call(addCompany, payload);
      const status = filterResponse(response);
      if (status === 200) {
        if (callback) callback();
      }
    },
    * remove({ payload, callback }, { call, put }) {
      const response = yield call(removeCompany, payload);
      const status = filterResponse(response);
      if (status === 200) {
        if (callback) callback();
      }
    },
    * update({ payload, callback }, { call, put }) {
      const response = yield call(updateCompany, payload);
      const status = filterResponse(response);
      if (status === 200) {
        if (callback) callback();
      }
    },
    * detail({ payload, callback }, { call, put }) {
      const response = yield call(getDetail, payload);
      const status = filterResponse(response);
      if (status === 200) {
        if (callback) callback(response.data);
      }
    },

    * addCompanyRoadConserveData({ payload, callback }, { call, put }) {
      const response = yield call(addCompanyRoadConserve, payload);
      const status = filterResponse(response);
      if (status === 200) {
        if (callback) callback();
      }
    },
    * deleteCompanyRoadConserveByIdData({ payload, callback }, { call, put }) {
      const response = yield call(deleteCompanyRoadConserveById, payload);
      const status = filterResponse(response);
      if (status === 200) {
        if (callback) callback();
      }
    },
    * getCompanyInfosData({ payload, callback }, { call, put }) {
      const response = yield call(getCompanyInfos, payload);
      const status = filterResponse(response);
      if (status === 200) {
        if (callback) callback(response.data);
      }
    },
    * getRoadInfosData({ payload, callback }, { call, put }) {
      const response = yield call(getRoadInfos, payload);
      const status = filterResponse(response);
      if (status === 200) {
        if (callback) callback(response.data);
      }
    },
    * getAllRoadCompanyConserveData({ payload, callback }, { call, put }) {
      const response = yield call(getAllRoadCompanyConserve, payload);
      const status = filterResponse(response);
      if (status === 200) {
        if (callback) callback(response.data.rows);
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
