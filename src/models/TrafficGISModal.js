import {
  getDynamicOverLimitTop5,
  getStaticOverLimitTop5,
  getAllSite,
  getSiteAndCount,
  getCompanyAndCount,
} from '@/services/TrafficGISservice';
import { filterResponse } from '@/utils/utils';


function formData(list) {
  for (const i in list) {
    list[i].id = i;
  }
  return list;
}

export default {
  namespace: 'GisMap',

  state: {
    dynamicData: {
      list: [],
    },
    staticData: {
      list: [],
    },
    allSiteList: [],
  },

  effects: {
    * dynamicOverLimitTop5({ payload }, { call, put }) {
      const response = yield call(getDynamicOverLimitTop5, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        yield put({
          type: 'dynamicSave',
          payload: response,
        });
      }
    },
    * staticOverLimitTop5({ payload }, { call, put }) {
      const response = yield call(getStaticOverLimitTop5, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        yield put({
          type: 'staticSave',
          payload: response,
        });
      }
    },
    * allSite({ payload, callback }, { call, put }) {
      const response = yield call(getAllSite, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        callback && callback(response.data);
        yield put({
          type: 'allSiteSave',
          payload: response,
        });
      }
    },
    * siteAndCount({ payload, callback }, { call, put }) {
      const response = yield call(getSiteAndCount, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        callback && callback(response.data);
      }
    },
    * companyAndCount({ payload, callback }, { call, put }) {
      const response = yield call(getCompanyAndCount, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        callback && callback(response.data);
      }
    },
  },

  reducers: {
    dynamicSave(state, action) {
      return {
        ...state,
        dynamicData: {
          list: formData(action.payload.data),
        },
      };
    },
    staticSave(state, action) {
      return {
        ...state,
        staticData: {
          list: formData(action.payload.data),
        },
      };
    },
    allSiteSave(state, action) {
      return {
        ...state,
        allSiteList: action.payload.data,
      };
    },
  },
};
