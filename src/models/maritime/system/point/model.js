import {
  getList,
  delPoint,
  addPoint,
  updatePoint,
  getDetail,
  getPointInfoByCode,
  getPointInfoForDay,
  getWaterPoint,
  getWaterMonitoringPointPointInfoByCode,
  getWaterList,
} from '@/services/maritime/system/point/service';
import { filterResponse } from '@/utils/utils';

export default {
  namespace: 'MaritimePoint',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    waterListData: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(getList, payload);
      const status = filterResponse(response);
      if (status === 200) {
        yield put({
          type: 'save',
          payload: response.data,
        });
      }
      callback && callback();
    },
    *add({ payload, callback }, { call }) {
      const response = yield call(addPoint, payload);
      const status = filterResponse(response);
      if (status === 200) {
        callback && callback();
      }
    },
    *remove({ payload, callback }, { call }) {
      const response = yield call(delPoint, payload);
      const status = filterResponse(response);
      if (status === 200) {
        callback && callback();
      }
    },
    *update({ payload, callback }, { call }) {
      const response = yield call(updatePoint, payload);
      const status = filterResponse(response);
      if (status === 200) {
        callback && callback();
      }
    },
    *detail({ payload, callback }, { call }) {
      const response = yield call(getDetail, payload);
      const status = filterResponse(response);
      if (status === 200) {
        if (callback) callback(response.data);
      }
    },
    *pointInfoByCode({ payload, callback }, { call }) {
      const response = yield call(getPointInfoByCode, payload);
      const status = filterResponse(response);
      if (status === 200) {
        callback && callback(response.data || []);
      }
    },
    *waterMonitoringPointPointInfoByCode({ payload, callback }, { call }) {
      const response = yield call(getWaterMonitoringPointPointInfoByCode, payload);
      const status = filterResponse(response);
      if (status === 200) {
        callback && callback(response.data || []);
      }
    },
    *pointInfoForDay({ payload, callback }, { call }) {
      const response = yield call(getPointInfoForDay, payload);
      const status = filterResponse(response);
      if (status === 200) {
        callback && callback(response.data || []);
      }
    },
    *waterPointList({ payload, callback }, { call }) {
      const response = yield call(getWaterPoint, payload);
      const status = filterResponse(response);
      if (status === 200) {
        callback && callback(response.data);
      }
    },
    *waterList({ payload, callback }, { call, put }) {
      const response = yield call(getWaterList, payload);
      const status = filterResponse(response);
      if (status === 200) {
        yield put({
          type: 'saveWaterList',
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
          list: action.payload.rows,
          pagination: {
            total: action.payload.total,
            pageSize: action.payload.pageSize,
            current: action.payload.page,
          },
        },
      };
    },
    saveWaterList(state, action) {
      return {
        ...state,
        waterListData: {
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
