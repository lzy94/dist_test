/**
 * @description 静态检测数据
 */
import { getDynamicAndStaticCompare } from '@/services/traffic/api-v2/staticService';
import { filterResponse } from '@/utils/utils';

export default {
  namespace: 'TrafficApiV2Static',

  state: {
    dyAndStCompareData: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *dynamicAndStaticCompare({ payload }, { call, put }) {
      const response = yield call(getDynamicAndStaticCompare, payload);
      const status = filterResponse(response);
      if (status === 200) {
        yield put({
          type: 'dyAndStCompareDataSave',
          payload: response.data,
        });
      }
    },
  },

  reducers: {
    dyAndStCompareDataSave(state, action) {
      const { rows, pageSize, total, page } = action.payload;
      return {
        ...state,
        dyAndStCompareData: {
          list: rows,
          pagination: {
            pageSize,
            total,
            current: page,
          },
        },
      };
    },
  },
};
