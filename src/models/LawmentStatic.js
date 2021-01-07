import {
  queryStatic,
  getBusDynamicData,
  setInvalidData,
  setExaminationPassed,
  setReviewPassed,
  setSigningPassed,
  getTemplateDownload,
} from '@/services/LawmentStatic';
import { filterResponse, downLoadFile } from '@/utils/utils';

export default {
  namespace: 'LawmentStatic',

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
    *invalidData({ payload, callback }, { call }) {
      const response = yield call(setInvalidData, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        callback && callback();
      }
    },
    *examinationPassed({ payload, callback }, { call }) {
      const response = yield call(setExaminationPassed, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        callback && callback();
      }
    },
    *reviewPassed({ payload, callback }, { call }) {
      const response = yield call(setReviewPassed, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        callback && callback();
      }
    },
    *signingPassed({ payload, callback }, { call }) {
      const response = yield call(setSigningPassed, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        callback && callback();
      }
    },
    *templateDownload({ payload, callback }, { call }) {
      const response = yield call(getTemplateDownload, payload);
      const newData = filterResponse(response);
      if (newData.type === 'application/json') {
        callback(404);
      } else {
        downLoadFile(response, '卷宗.doc');
        callback(200);
      }
      // if (newData === 200) {
      //   callback && callback();
      // }
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
