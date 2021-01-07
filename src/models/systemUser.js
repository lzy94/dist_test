import {
  querySystemUserList,
  removeSystemUser,
  addSystemUser,
  getUserDetail,
  updateSystemUser,
  activateUser,
  forbiddenUser,
  importData,
  updateUserInfo,
  getUserLawLogs,
} from '@/services/systemUser';
import { querySite } from '@/services/site';
import { downLoadFile, filterResponse, siteListFormat } from '@/utils/utils';

export default {
  namespace: 'systemUser',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    siteList: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(querySystemUserList, payload);
      const newData = filterResponse(response);
      yield put({
        type: 'save',
        payload: response.data || [],
      });
    },
    *add({ payload, callback }, { call }) {
      const newData = filterResponse(yield call(addSystemUser, payload));
      if (newData === 200) {
        // const response = yield call(querySystemUserList, payload.query);
        // yield put({
        //   type: 'save',
        //   payload: response.data || [],
        // });
        if (callback) callback();
      }
    },
    *remove({ payload, callback }, { call }) {
      const newData = filterResponse(yield call(removeSystemUser, payload));
      if (newData === 200) {
        // const response = yield call(querySystemUserList, payload.query);
        // yield put({
        //   type: 'save',
        //   payload: response.data || [],
        // });
        if (callback) callback();
      }
    },
    *detailData({ payload, callback }, { call }) {
      const response = yield call(getUserDetail, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        // yield put({
        //     type: 'detail',
        //     payload: response.data || [],
        // });
        if (callback) callback(response.data || {});
      }
    },
    *update({ payload, callback }, { call }) {
      const newData = filterResponse(yield call(updateSystemUser, payload));
      if (newData === 200) {
        if (callback) callback();
      }
    },
    *activate({ payload, callback }, { call }) {
      const newData = filterResponse(yield call(activateUser, payload));
      if (newData === 200) {
        if (callback) callback();
      }
    },
    *forbidden({ payload, callback }, { call }) {
      const newData = filterResponse(yield call(forbiddenUser, payload));
      if (newData === 200) {
        if (callback) callback();
      }
    },
    *import({ payload, callback }, { call }) {
      const response = yield call(importData, payload);
      const status = filterResponse(response);
      if (status.type === 'application/json') {
        callback(404);
      } else {
        downLoadFile(response, 'user.zip');
        callback(200);
      }
    },
    *getSite({ payload, callback }, { call, put }) {
      const response = yield call(querySite, payload);
      yield put({
        type: 'saveSite',
        payload: response,
      });
    },
    *updateMyinfo({ payload, callback }, { call }) {
      const response = yield call(updateUserInfo, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        callback && callback();
      }
    },
    *lawLogs({ payload, callback }, { call }) {
      const response = yield call(getUserLawLogs, payload);
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
    detail(state, action) {
      return {
        ...state,
        detailData: action.payload,
      };
    },
    saveSite(state, action) {
      return {
        ...state,
        siteList: siteListFormat(action.payload.rows),
      };
    },
  },
};
