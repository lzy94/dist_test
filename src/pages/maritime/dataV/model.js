import { getFocusList, getMonitorScale } from './service';
import { filterResponse } from '@/utils/utils';

export default {
  namespace: 'MaritimeDataV',

  state: {
    monitorScaleData: {
      roadMonitor: 0,
      seaPortInfo: 0,
      waterMonitoringPoint: 0,
    },
    focusListData: {
      seaPortInfo: [],
      seaShips: [],
    },
  },

  effects: {
    *focusList({ callback }, { call }) {
      const response = yield call(getFocusList);
      const status = filterResponse(response);
      if (status === 200) {
        // yield put({
        //   type: 'saveFocusListData',
        //   payload: response.data,
        // });
        callback && callback(response.data || []);
      }
    },
    *monitorScale({ callback }, { call }) {
      const response = yield call(getMonitorScale);
      const status = filterResponse(response);
      if (status === 200) {
        // yield put({
        //   type: 'saveMonitorScaleData',
        //   payload: response.data,
        // });

        callback && callback(response.data || []);
      }
    },
  },

  reducers: {
    saveMonitorScaleData(state, action) {
      return {
        ...state,
        monitorScaleData: action.payload,
      };
    },
    saveFocusListData(state, action) {
      return {
        ...state,
        focusListData: action.payload,
      };
    },
  },
};
