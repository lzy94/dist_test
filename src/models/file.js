import {
  queryFile,
  downloadFile,
  removeFile,
  getDetail,
  getPreview,
  getPreview_,
} from '@/services/file';
import { filterResponse, downLoadFile } from '@/utils/utils';

export default {
  namespace: 'File',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryFile, payload);
      filterResponse(response);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *remove({ payload, callback }, { call }) {
      const response = yield call(removeFile, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        if (callback) callback();
      }
    },
    *detail({ payload, callback }, { call }) {
      const response = yield call(getDetail, payload);
      if (callback) callback(response);
    },
    *preview({ payload, callback }, { call }) {
      const response = yield call(getPreview, payload);
      if (callback) callback(response);
    },
    *preview_({ payload, callback }, { call }) {
      const response = yield call(getPreview_, payload);
      if (callback) callback(response);
    },
    *downLoad({ payload, callback }, { call }) {
      const response = yield call(downloadFile, payload.id);
      const status = filterResponse(response);
      const filename = `${payload.fileName}.${payload.extensionName}`;
      if (status.type === 'application/json') {
        callback && callback(404);
      } else {
        downLoadFile(response, filename);
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
