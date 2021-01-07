import { queryStatic, getBusDynamicData, exportBusStaticData } from './service';
import { filterResponse, downLoadFile } from '@/utils/utils';

export default {
  namespace: 'Static',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryStatic, payload);
      filterResponse(response);
      yield put({
        type: 'save',
        payload: response.data || {},
      });
    },
    *detail({ payload, callback }, { call }) {
  const response = yield call(getBusDynamicData, payload);
  const newData = filterResponse(response);
  if (newData === 200) {
    if (callback) callback(response.data);
  }
},
    *import({ payload, callback }, { call }) {
      const response = yield call(exportBusStaticData, payload);
      const status = filterResponse(response);
      if (status.type === 'application/json') {
        callback && callback(404);
      } else {
        downLoadFile(response, '静态检测.zip');
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
  },
};
