import {
  querySource,
  removeSource,
  addSource,
  updateSource,
  getDicSourceCompanyById,
  getSourceCompanyByOrganId,
} from '@/services/source';
import { filterResponse } from '@/utils/utils';

export default {
  namespace: 'Source',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    detail: {},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(querySource, payload);
      const status = filterResponse(response);
      if (status === 200) {
        yield put({
          type: 'save',
          payload: response.data,
        });
      }
    },
    *add({ payload, callback }, { call, put }) {
      const newData = filterResponse(yield call(addSource, payload.add));
      if (newData === 200) {
        const response = yield call(querySource, payload.query);
        yield put({
          type: 'save',
          payload: response.data,
        });
        if (callback) callback();
      }
    },
    *remove({ payload, callback }, { call, put }) {
      const newData = filterResponse(yield call(removeSource, payload.remove));
      if (newData === 200) {
        const response = yield call(querySource, payload.query);
        yield put({
          type: 'save',
          payload: response.data,
        });
        if (callback) callback();
      }
    },
    *update({ payload, callback }, { call, put }) {
      const newData = filterResponse(yield call(updateSource, payload.update));
      if (newData === 200) {
        const response = yield call(querySource, payload.query);
        yield put({
          type: 'save',
          payload: response.data,
        });
        if (callback) callback();
      }
    },
    *detail({ payload, callback }, { call }) {
      const response = yield call(getDicSourceCompanyById, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        // yield put({
        //     type: 'detailData',
        //     payload: response.data || {}
        // })
        callback && callback(response.data || {});
      }
    },
    *listByOrganId({ payload, callback }, { call }) {
      const response = yield call(getSourceCompanyByOrganId, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        callback && callback(response.data);
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
  },
};
