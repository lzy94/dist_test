import { getConserveCount, getCompanyScore, getElectroLabel } from './service';
import { filterResponse } from '@/utils/utils';

export default {
  namespace: 'ConserveDataV',

  state: {},

  effects: {
    *conserveCount({ callback }, { call }) {
      const response = yield call(getConserveCount);
      const status = filterResponse(response);
      if (status === 200) {
        if (callback) callback(response.data);
      }
    },
    *companyScore({ callback }, { call }) {
      const response = yield call(getCompanyScore);
      const status = filterResponse(response);
      if (status === 200) {
        if (callback) callback(response.data);
      }
    },
    *electroLabel({ callback }, { call }) {
      const response = yield call(getElectroLabel);
      const status = filterResponse(response);
      if (status === 200) {
        if (callback) callback(response.data);
      }
    },
  },

  reducers: {},
};
