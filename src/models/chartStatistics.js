import {
  getOverviewOfHomePage,
  getAxleCount,
  getOverLimitCount,
  getOverSpeedCount,
  lawCountData,
  overRangeCountData,
  // 检测概况  新API
  getCountTwelveMData,
  // 动态检测今日超限统计
  getDyCountByNow,
  // 静态检测今日超限统计
  getStaticCountByNow,
  // 非现场近12月检测数据统计
  getCountDataForYear,
} from '@/services/chartStatistics';
import { filterResponse, formatTable } from '@/utils/utils';

export default {
  namespace: 'ChartStatistics',

  state: {
    data: {},
    overRunData: {
      total: [],
      overLimit: [],
    },
    columns: [],
    tableData: {
      list: [],
      pagination: {},
    },
    lawCountList: {
      pendingVerify: [],
    },
    overRangeList: [],
    dyCountByNowData: [],
    staticCountByNowData: [],
    countDataForYearData: {},
  },

  effects: {
    *resetAssess(_, { put }) {
      yield put({
        type: 'lawCountSave',
        payload: {
          data: {
            pendingVerify: [],
          },
        },
      });
    },
    *resetOverRange(_, { put }) {
      yield put({
        type: 'overRangeSave',
        payload: {
          data: [],
        },
      });
    },
    *resetData(_, { put }) {
      yield put({
        type: 'save',
        payload: { data: {} },
      });
    },
    *resetOverrun(_, { put }) {
      yield put({
        type: 'overRunSave',
        payload: [{ data: { total: [], overLimit: [] } }, []],
      });
    },
    // 概况
    *overviewOfHomePage({ payload }, { call, put }) {
      const response = yield call(getOverviewOfHomePage, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        yield put({
          type: 'save',
          payload: response,
        });
      }
    },
    // 超限率统计
    *overLimitCount({ payload, callback }, { call, put }) {
      const response = yield call(getOverLimitCount, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        yield put({
          type: 'overRunSave',
          payload: [response, payload],
        });
        callback && callback();
      }
    },
    // 超速率统计
    *overSpeedCount({ payload }, { call, put }) {
      const response = yield call(getOverSpeedCount, payload);
      filterResponse(response);
      yield put({
        type: 'overRunSave',
        payload: [response, payload],
      });
    },
    // 轴型统计
    *axleCount({ payload, callback }, { call, put }) {
      const response = yield call(getAxleCount, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        yield put({
          type: 'overRunSave',
          payload: [response, payload],
        });
        if (callback) callback();
      }
    },
    *lawCount({ payload }, { call, put }) {
      const response = yield call(lawCountData, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        yield put({
          type: 'lawCountSave',
          payload: response,
        });
      }
    },
    *overRangeCount({ payload, callback }, { call, put }) {
      const response = yield call(overRangeCountData, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        yield put({
          type: 'overRangeSave',
          payload: response,
        });
        if (callback) callback();
      }
    },
    //  新API
    // 检测概况
    *countTwelveMData({ payload, callback }, { call }) {
      const response = yield call(getCountTwelveMData, payload);
      const status = filterResponse(response);
      if (status === 200) {
        if (callback) callback(response.data);
      }
    },
    // 动态检测今日超限统计
    *dyCountByNow({ payload, callback }, { call, put }) {
      const response = yield call(getDyCountByNow, payload);
      const status = filterResponse(response);
      if (status === 200) {
        yield put({
          type: 'dyCountByNowSave',
          payload: response.data,
        });
        if (callback) callback(response.data);
      }
    },
    // 静态检测今日超限统计
    *staticCountByNow({ payload, callback }, { call, put }) {
      const response = yield call(getStaticCountByNow, payload);
      const status = filterResponse(response);
      if (status === 200) {
        yield put({
          type: 'staticCountByNowSave',
          payload: response.data,
        });
        if (callback) callback(response.data);
      }
    },
    // 非现场近12月检测数据统计
    *countDataForYear({ payload, callback }, { call, put }) {
      const response = yield call(getCountDataForYear, payload);
      const status = filterResponse(response);
      if (status === 200) {
        yield put({
          type: 'countDataForYearSave',
          payload: response.data,
        });
        if (callback) callback(response.data);
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload.data,
      };
    },
    overRunSave(state, action) {
      const { data } = action.payload[0];
      return {
        ...state,
        overRunData: data,
        tableData: formatTable(data, action.payload[1])[1],
        columns: formatTable(data, action.payload[1])[0],
      };
    },
    lawCountSave(state, action) {
      return {
        ...state,
        lawCountList: action.payload.data,
      };
    },
    overRangeSave(state, action) {
      return {
        ...state,
        overRangeList: action.payload.data,
      };
    },
    dyCountByNowSave(state, action) {
      return {
        ...state,
        dyCountByNowData: action.payload,
      };
    },
    staticCountByNowSave(state, action) {
      return {
        ...state,
        staticCountByNowData: action.payload,
      };
    },
    countDataForYearSave(state, action) {
      return {
        ...state,
        countDataForYearData: action.payload,
      };
    },
  },
};
