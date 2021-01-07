import {getDetail, getList, setExaminationPassed, templateDownload} from './service';
import {downLoadFile, filterResponse} from '@/utils/utils';

export default {
  namespace: 'Mobile',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    * fetch({payload}, {call, put}) {
      const response = yield call(getList, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        yield put({
          type: 'save',
          payload: response.data,
        });
      }
    },
    * detail({payload, callback}, {call, put}) {
      const response = yield call(getDetail, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        callback && callback(response.data || {});
      }
    },
    * examinationPassed({payload, callback}, {call, put}) {
      const response = yield call(setExaminationPassed, payload);
      const newData = filterResponse(response);
      if (newData === 200) {
        callback && callback();
      }
    },
    * download({payload, callback}, {call, put}) {
      const response = yield call(templateDownload, payload);
      downLoadFile(response, '卷宗.doc');
      callback && callback();
    }
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
            current: action.payload.page
          }
        }
      };
    },
  },
};
