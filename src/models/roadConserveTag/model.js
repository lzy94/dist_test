import { queryTag, removeTag, addTag } from '@/services/roadConserveTag/service';
import { filterResponse } from '@/utils/utils';

export default {
  namespace: 'RoadConserveTag',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    * fetch({ payload }, { call, put }) {
      const response = yield call(queryTag, payload);
      const status = filterResponse(response);
      if (status === 200) {
        yield put({
          type: 'save',
          payload: response.data,
        });
      }
    },
    * saveData({ payload, callback }, { call, put }) {
      const response = yield call(addTag, payload);
      const status = filterResponse(response);
      if (status === 200) {
        callback && callback();
      }
    },
    * remove({ payload, callback }, { call, put }) {
      const response = yield call(removeTag, payload);
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
          list: action.payload,
        },
      };
    },
  },
};
