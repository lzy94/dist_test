import {
  queryList,
  getDetail,
  saveRoadWorkOrdes,
  removeOrder,
  addExamineInfo,
  setOrderCompelete,
  getOrderByState,
  getExamineInforPage,
} from '@/services/conserve/inspection/roadWorkOrdes/service';
import { filterResponse } from '@/utils/utils';

export default {
  namespace: 'RoadWorkOrdes',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    examineList: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryList, payload);
      // const status = filterResponse(response);
      // if (status === 200) {
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
      // }
    },
    *saveData({ payload, callback }, { call }) {
      const response = yield call(saveRoadWorkOrdes, payload);
      const status = filterResponse(response);
      if (status === 200) {
        if (callback) callback();
      }
    },
    *addExamineInfoData({ payload, callback }, { call }) {
      const response = yield call(addExamineInfo, payload);
      const status = filterResponse(response);
      if (status === 200) {
        if (callback) callback();
      }
    },
    *orderCompelete({ payload, callback }, { call }) {
      const response = yield call(setOrderCompelete, payload);
      const status = filterResponse(response);
      if (status === 200) {
        if (callback) callback();
      }
    },
    *detail({ payload, callback }, { call }) {
      const response = yield call(getDetail, payload);
      const status = filterResponse(response);
      if (status === 200) {
        if (callback) callback(response.data);
      }
    },
    *orderByState({ payload, callback }, { call }) {
      const response = yield call(getOrderByState);
      const status = filterResponse(response);
      if (status === 200) {
        callback && callback(response.data);
      }
    },
    *remove({ payload, callback }, { call }) {
      const response = yield call(removeOrder, payload);
      const status = filterResponse(response);
      if (status === 200) {
        if (callback) callback();
      }
    },
    *getExamineList({ payload }, { call, put }) {
      const response = yield call(getExamineInforPage, payload);
      const status = filterResponse(response);
      if (status === 200) {
        yield put({
          type: 'saveExamineList',
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
    saveExamineList(state, action) {
      return {
        ...state,
        examineList: {
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
