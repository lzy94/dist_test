import { getCorporateInfo, getCompanySort } from './service';
import { filterResponse } from '@/utils/utils';

export default {
  namespace: 'TransportDataV',

  state: {},

  effects: {
    *corporateInfo({ callback }, { call }) {
      const response = yield call(getCorporateInfo);
      const status = filterResponse(response);
      if (status === 200) {
        callback && callback(response.data || []);
      }
    },
    *companySort({ callback }, { call }) {
      const response = yield call(getCompanySort);
      const status = filterResponse(response);
      if (status === 200) {
        callback && callback(response.data || []);
      }
    },
  },

  reducers: {},
};
