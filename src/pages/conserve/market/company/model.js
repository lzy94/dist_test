import { getCompanyInfo, getFocusRoadInfo } from './service';
import { filterResponse } from '@/utils/utils';

export default {
  namespace: 'marketCompanyGIS',

  state: {
    data: [],
  },

  effects: {
    * fetch({ payload, callback }, { call, put }) {
      const response = yield call(getFocusRoadInfo);
      const status = filterResponse(response);
      if (status === 200) {
        callback && callback(response.data);
        // yield put({
        //   type: 'save',
        //   payload: response.data,
        // });
      }
    },
    * companyInfo({ payload, callback }, { call, put }) {
      const response = yield call(getCompanyInfo, payload);
      const status = filterResponse(response);
      if (status === 200) {
        callback && callback(response.data);
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
