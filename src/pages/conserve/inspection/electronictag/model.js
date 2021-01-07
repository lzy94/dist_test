import { roadElectronictagReocdForPage, getByProductionCode } from './service';
import { filterResponse } from '@/utils/utils';

export default {
  namespace: 'Electronictag',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    detailList: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    * fetch({ payload }, { call, put }) {
      const response = yield call(roadElectronictagReocdForPage, payload);
      const status = filterResponse(response);
      if (status === 200) {
        yield put({
          type: 'save',
          payload: response.data,
        });
      }
    },
    * detail({ payload, callback }, { call, put }) {
      const response = yield call(getByProductionCode, payload);
      const status = filterResponse(response);
      if (status === 200) {
        yield put({
          type: 'saveDetail',
          payload: response,
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
    saveDetail(state, action) {
      return {
        ...state,
        detailList: {
          list: action.payload.data,
        },
      };
    },
  },
};
