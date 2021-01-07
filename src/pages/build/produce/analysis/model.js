import { getRawmaterails, getUnitproject } from './service';
import { filterResponse } from '@/utils/utils';

export default {
  namespace: 'BuildProduceAnalysis',

  state: {
    rawmaterails: {},
    unitproject: {},
  },

  effects: {
    *rawmaterails({ payload }, { call, put }) {
      const response = yield call(getRawmaterails, payload);
      const status = filterResponse(response);
      if (status === 200) {
        yield put({
          type: 'save1',
          payload: response.data,
        });
      }
    },
    *unitproject({ payload }, { call, put }) {
      const response = yield call(getUnitproject, payload);
      const status = filterResponse(response);
      if (status === 200) {
        yield put({
          type: 'save2',
          payload: response.data,
        });
      }
    },
  },

  reducers: {
    save1(state, action) {
      return {
        ...state,
        rawmaterails: action.payload,
      };
    },
    save2(state, action) {
      return {
        ...state,
        unitproject: action.payload,
      };
    },
  },
};
