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
  getBusDlack,
  getPeakValue,
  getBusFocusTop,
  queryCompare,
} from './service';
import { filterResponse } from '@/utils/utils';
import { dataAddIndex } from '@/utils/dataV';

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
      sourceConpany: [],
    },
    busDlackData: [],
    peakValueData: {
      list: [],
      pagination: {},
    },
    busFocusTopValue: {
      top1: {
        list: [],
        pagination: {},
      },
      top2: {
        list: [],
        pagination: {},
      },
    },
    compareValue: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *bigScreenData({ payload, callback }, { call, put }) {
      const response = yield call(getBigScreenData, payload);
      filterResponse(response);
      yield put({
        type: 'save',
        payload: response.data,
      });
      callback && callback();
    },
    *bigScreenDyLawCaseData({ payload, callback }, { call, put }) {
      const response = yield call(getBigScreenDyLawCaseData, payload);
      filterResponse(response);
      yield put({
        type: 'saveDyLawCaseData',
        payload: response.data,
      });
      callback && callback();
    },
    *bigScreenDyLawData({ payload, callback }, { call, put }) {
      const response = yield call(getBigScreenDyLawData, payload);
      filterResponse(response);
      yield put({
        type: 'saveDyLawData',
        payload: response.data,
      });
      callback && callback();
    },
    *bigScreenSiteEquiment({ payload, callback }, { call, put }) {
      const response = yield call(getBigScreenSiteEquiment, payload);
      filterResponse(response);
      yield put({
        type: 'saveSiteEquiment',
        payload: response.data,
      });
      callback && callback();
    },
    *bigScreenStaticLawData({ payload, callback }, { call, put }) {
      const response = yield call(getBigScreenStaticLawData, payload);
      filterResponse(response);
      yield put({
        type: 'saveStaticLawData',
        payload: response.data,
      });
      callback && callback();
    },
    *siteList({ payload, callback }, { call }) {
  const response = yield call(getSiteList, payload);
  const newData = filterResponse(response);
  if (newData === 200) {
    callback && callback(response.data || { siteList: [] });
  }
},
    *bigScreenAxleData({ payload, callback }, { call, put }) {
      const response = yield call(getBigScreenAxleData, payload);
      filterResponse(response);
      yield put({
        type: 'saveBigScreenAxleData',
        payload: response.data,
      });
      callback && callback();
    },
    *personnelLaw({ payload, callback }, { call, put }) {
      const response = yield call(getPersonnelLaw, payload);
      filterResponse(response);
      yield put({
        type: 'savePersonnelLaw',
        payload: response.data,
      });
      callback && callback();
    },
    *siteOverview({ payload, callback }, { call, put }) {
      const response = yield call(getSiteOverview, payload);
      filterResponse(response);
      yield put({
        type: 'saveSiteOverview',
        payload: response.data,
      });
      callback && callback();
    },
    *busDlack({ payload, callback }, { call, put }) {
      const response = yield call(getBusDlack, payload);
      filterResponse(response);
      yield put({
        type: 'saveBusDlack',
        payload: response.data,
      });
      callback && callback();
    },
    *peakValue({ payload, callback }, { call, put }) {
      const response = yield call(getPeakValue, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        yield put({
          type: 'savePeakValue',
          payload: response.data,
        });
      }
    },
    *busFocusTop(_, { call, put }) {
      const response = yield call(getBusFocusTop);
      const newData = filterResponse(response);
      if (newData === 200) {
        yield put({
          type: 'savebusFocusTopValue',
          payload: response.data,
        });
      }
    },
    *compare({ payload }, { call, put }) {
      const response = yield call(queryCompare, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        yield put({
          type: 'saveCompareValue',
          payload: response.data,
        });
      }
    },
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
        dyLawData: action.payload.dyLawData || [],
      };
    },
    saveStaticLawData(state, action) {
      return {
        ...state,
        staticLaeData: action.payload.staticLaeData || [],
      };
    },
    saveDyLawCaseData(state, action) {
      return {
        ...state,
        dyLawCase: action.payload.dyLawCase || [],
      };
    },
    saveSiteEquiment(state, action) {
      return {
        ...state,
        siteEquiment: action.payload.siteEquiment || [],
      };
    },
    saveBigScreenAxleData(state, action) {
      return {
        ...state,
        bigScreenAxleData: action.payload.bigScreenAxleData || [],
      };
    },
    savePersonnelLaw(state, action) {
      return {
        ...state,
        personnelLawData: action.payload || [],
      };
    },
    saveSiteOverview(state, action) {
      return {
        ...state,
        siteOverviewData: {
          staticSites: action.payload.staticSites || [],
          dySites: action.payload.dySites || [],
          sourceConpany: action.payload.sourceConpany || [],
        },
      };
    },
    saveBusDlack(state, action) {
      return {
        ...state,
        busDlackData: action.payload.busDlack || [],
      };
    },
    savePeakValue(state, action) {
      return {
        ...state,
        peakValueData: {
          list: dataAddIndex(action.payload || []),
          pagination: {
            total: 0,
            pageSize: 0,
            current: 0,
          },
        },
      };
    },
    savebusFocusTopValue(state, action) {
      return {
        ...state,
        busFocusTopValue: {
          top1: {
            list: dataAddIndex(action.payload.carCount || []),
            pagination: {
              total: 0,
              pageSize: 0,
              current: 0,
            },
          },
          top2: {
            list: dataAddIndex(action.payload.overLoad || []),
            pagination: {
              total: 0,
              pageSize: 0,
              current: 0,
            },
          },
        },
      };
    },
    saveCompareValue(state, action) {
      return {
        ...state,
        compareValue: {
          list: dataAddIndex(action.payload.rows),
          pagination: {
            total: 0,
            pageSize: 0,
            current: 0,
          },
        },
      };
    },
  },
};
