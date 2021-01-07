import {
  listPlanCategory,
  deletePlanCategory,
  addPlanCategory,
  updatePlanCategory,
} from '@/services/listPlanCategory/service';
import { filterResponse } from '@/utils/utils';

export default {
  namespace: 'ListPlanCategory',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    * fetch({ payload }, { call, put }) {
      const response = yield call(listPlanCategory, payload);
      const status = filterResponse(response);
      if (status === 200) {
        yield put({
          type: 'save',
          payload: response.data,
        });
      }
    },
    * add({ payload, callback }, { call, put }) {
      const response = yield call(addPlanCategory, payload);
      const status = filterResponse(response);
      if (status === 200) {
        callback && callback();
      }
    },
    * remove({ payload, callback }, { call, put }) {
      const response = yield call(deletePlanCategory, payload);
      const status = filterResponse(response);
      if (status === 200) {
        callback && callback();
      }
    },
    * update({ payload, callback }, { call, put }) {
      const response = yield call(updatePlanCategory, payload);
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
