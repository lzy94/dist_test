import { queryData, getDynamicDataById, exportBusDynamicData } from '@/services/dynamic';
import { filterResponse, downLoadFile } from '@/utils/utils';
import { querySite } from '@/services/site';

export default {
  namespace: 'Dynamic',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    detail: {},
    siteList: [],
  },

  effects: {
    *resetDetail(_, { put }) {
      yield put({
        type: 'detailData',
        payload: {},
      });
    },
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryData, payload);
      filterResponse(response);
      yield put({
        type: 'save',
        payload: response.data || {},
      });
    },
    *detail({ payload, callback }, { call, put }) {
      const response = yield call(getDynamicDataById, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        yield put({
          type: 'detailData',
          payload: response.data || {},
        });
        if (callback) callback();
      }
    },
    *getSite({ payload }, { call, put }) {
      const response = yield call(querySite, payload);
      yield put({
        type: 'saveSite',
        payload: response,
      });
    },
    *import({ payload, callback }, { call }) {
      const response = yield call(exportBusDynamicData, payload);
      const status = filterResponse(response);
      if (status.type === 'application/json') {
        callback && callback(404);
      } else {
        downLoadFile(response, '动态检测数据.zip');
        callback && callback(200);
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
    detailData(state, action) {
      return {
        ...state,
        detail: action.payload,
      };
    },
    saveSite(state, action) {
      return {
        ...state,
        siteList: action.payload.rows,
      };
    },
  },
};
