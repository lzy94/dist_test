import {
  getRoadInfoPage,
  deleteRoadInfoByIds,
  addRoadInfo,
  updateRoadInfo,
  getDetail,
  setRoadFocuseInfo,
} from '@/services/roadinfo/service';
import { filterResponse } from '@/utils/utils';

export default {
  namespace: 'RoadInfo',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },


  effects: {
    * fetch({ payload }, { call, put }) {
      const response = yield call(getRoadInfoPage, payload);
      const status = filterResponse(response);
      if (status === 200) {
        yield put({
          type: 'save',
          payload: response.data,
        });
      }
    },
    * add({ payload, callback }, { call, put }) {
      const response = yield call(addRoadInfo, payload);
      const status = filterResponse(response);
      if (status === 200) {
        callback && callback();
      }
    },
    * remove({ payload, callback }, { call, put }) {
      const response = yield  call(deleteRoadInfoByIds, payload);
      const status = filterResponse(response);
      if (status === 200) {
        callback && callback();
      }
    },
    * update({ payload, callback }, { call, put }) {
      const status = filterResponse(yield call(updateRoadInfo, payload));
      if (status === 200) {
        callback && callback();
      }
    },
    * detail({ payload, callback }, { call, put }) {
      const response = yield call(getDetail, payload);
      const status = filterResponse(response);
      if (status === 200) {
        callback && callback(response.data || {});
      }
    },
    * addFocus({ payload, callback }, { call, put }) {
      const response = yield call(setRoadFocuseInfo, payload);
      const status = filterResponse(response);
      if (status === 200) {
        callback && callback();
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
