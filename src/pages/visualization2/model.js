import {
  getSiteList,
  getBigScreenData,
  getBigScreenDyLawCaseData,
  getBigScreenDyLawData,
  getBigScreenSiteEquiment,
  getBigScreenStaticLawData,
  getBigScreenAxleData,
  getPersonnelLaw,
  getSiteOverview,
  getBusDlack
} from './service';
import { filterResponse } from '@/utils/utils';

export default {
  namespace: 'BigScreen',

  state: {
    data: {
      dynamicScreen: [],
      staticScreen: [],
    },
    dyLawData: [],
    staticLaeData: [],
    dyLawCase: [],
    siteEquiment: [],
    bigScreenAxleData: [],
    personnelLawData: [],
    siteOverviewData: {
      staticSites: [],
      dySites: [],
      sourceConpany: []
    },
    busDlackData: []
  },

  effects: {
    * bigScreenData({ payload, callback }, { call, put }) {
      const response = yield call(getBigScreenData, payload);
      filterResponse(response);
      yield put({
        type: 'save',
        payload: response.data,
      });
      callback && callback();
    },
    * bigScreenDyLawCaseData({ payload, callback }, { call, put }) {
      const response = yield call(getBigScreenDyLawCaseData, payload);
      filterResponse(response);
      yield put({
        type: 'saveDyLawCaseData',
        payload: response.data,
      });
      callback && callback();
    },
    * bigScreenDyLawData({ payload, callback }, { call, put }) {
      const response = yield call(getBigScreenDyLawData, payload);
      filterResponse(response);
      yield put({
        type: 'saveDyLawData',
        payload: response.data,
      });
      callback && callback();
    },
    * bigScreenSiteEquiment({ payload, callback }, { call, put }) {
      const response = yield call(getBigScreenSiteEquiment, payload);
      filterResponse(response);
      yield put({
        type: 'saveSiteEquiment',
        payload: response.data,
      });
      callback && callback();
    },
    * bigScreenStaticLawData({ payload, callback }, { call, put }) {
      const response = yield call(getBigScreenStaticLawData, payload);
      filterResponse(response);
      yield put({
        type: 'saveStaticLawData',
        payload: response.data,
      });
      callback && callback();
    },
    * siteList({ payload, callback }, { call, put }) {
      const response = yield call(getSiteList, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        callback && callback(response.data || { siteList: [] });
      }
    },
    * bigScreenAxleData({ payload, callback }, { call, put }) {
      const response = yield call(getBigScreenAxleData, payload);
      filterResponse(response);
      yield put({
        type: 'saveBigScreenAxleData',
        payload: response.data
      })
      callback && callback();
    },
    * personnelLaw({ payload, callback }, { call, put }) {
      const response = yield call(getPersonnelLaw, payload);
      filterResponse(response);
      yield put({
        type: 'savePersonnelLaw',
        payload: response.data
      })
      callback && callback();
    },
    * siteOverview({ payload, callback }, { call, put }) {
      const response = yield call(getSiteOverview, payload);
      filterResponse(response);
      yield put({
        type: 'saveSiteOverview',
        payload: response.data
      })
      callback && callback();
    },
    * busDlack({ payload, callback }, { call, put }) {
      const response = yield call(getBusDlack, payload);
      filterResponse(response);
      yield put({
        type: 'saveBusDlack',
        payload: response.data
      })
      callback && callback();
    }
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: {
          dynamicScreen: action.payload.dynamicScreen || [],
          staticScreen: action.payload.staticScreen || [],
        },
      };
    },
    saveDyLawData(state, action) {
      return {
        ...state,
        dyLawData: action.payload.dyLawData || []
      };
    },
    saveStaticLawData(state, action) {
      return {
        ...state,
        staticLaeData: action.payload.staticLaeData || []
      }
    },
    saveDyLawCaseData(state, action) {
      return {
        ...state,
        dyLawCase: action.payload.dyLawCase || []
      }
    },
    saveSiteEquiment(state, action) {
      return {
        ...state,
        siteEquiment: action.payload.siteEquiment || []
      }
    },
    saveBigScreenAxleData(state, action) {
      return {
        ...state,
        bigScreenAxleData: action.payload.bigScreenAxleData || []
      }
    },
    savePersonnelLaw(state, action) {
      return {
        ...state,
        personnelLawData: action.payload || []
      }
    },
    saveSiteOverview(state, action) {
      return {
        ...state,
        siteOverviewData: {
          staticSites: action.payload.staticSites || [],
          dySites: action.payload.dySites || [],
          sourceConpany: action.payload.sourceConpany || []
        }
      }
    },
    saveBusDlack(state, action) {
      return {
        ...state,
        busDlackData: action.payload.busDlack || []
      }
    },
  },
};
